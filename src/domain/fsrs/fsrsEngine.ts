import { FsrsCard, FsrsSchedulingInfo, FsrsState, Rating } from '../../types';

export const DEFAULT_FSRS_WEIGHTS: number[] = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949,
  0.5345, 1.4604, 0.0046, 1.5457, 0.1192,
  1.0192, 1.9395, 0.11, 0.29605, 2.2698,
  0.2315, 2.9898, 0.51655, 0.6621,
];

export class FsrsScheduler {
  private w: number[];
  private requestRetention: number;
  private maximumInterval: number;

  constructor(
    w: number[] = DEFAULT_FSRS_WEIGHTS,
    requestRetention: number = 0.9,
    maximumInterval: number = 36500
  ) {
    this.w = w;
    this.requestRetention = requestRetention;
    this.maximumInterval = maximumInterval;
  }

  public calculateRetrievability(elapsedDays: number, stability: number): number {
    if (stability <= 0) return 0;
    return Math.pow(1.0 + elapsedDays / (9.0 * stability), -1.0);
  }

  public repeat(card: FsrsCard, now: number = Date.now()): Record<Rating, FsrsSchedulingInfo> {
    const elapsedDays = Math.max(0, Math.floor((now - card.lastReview) / (1000 * 60 * 60 * 24)));

    return {
      [Rating.AGAIN]: this.scheduleNext(card, Rating.AGAIN, elapsedDays, now),
      [Rating.HARD]: this.scheduleNext(card, Rating.HARD, elapsedDays, now),
      [Rating.GOOD]: this.scheduleNext(card, Rating.GOOD, elapsedDays, now),
      [Rating.EASY]: this.scheduleNext(card, Rating.EASY, elapsedDays, now),
    };
  }

  private scheduleNext(
    card: FsrsCard,
    rating: Rating,
    elapsedDays: number,
    now: number
  ): FsrsSchedulingInfo {
    const grade = rating; // 1: Again, 2: Hard, 3: Good, 4: Easy
    const newReps = card.reps + 1;
    const newLapses = rating === Rating.AGAIN ? card.lapses + 1 : card.lapses;

    const newDifficulty = this.calculateNextDifficulty(card.difficulty, grade);
    let newStability: number;
    let newState: FsrsState;

    switch (card.state) {
      case FsrsState.NEW:
      case FsrsState.LEARNING:
      case FsrsState.RELEARNING:
        newStability = this.initStability(grade);
        newState = rating === Rating.AGAIN ? FsrsState.LEARNING : FsrsState.REVIEW;
        break;
      case FsrsState.REVIEW: {
        const r = this.calculateRetrievability(elapsedDays, card.stability);
        if (rating === Rating.AGAIN) {
          newStability = this.calculateLapseStability(newDifficulty, card.stability, r);
          newState = FsrsState.RELEARNING;
        } else {
          newStability = this.calculateRecallStability(newDifficulty, card.stability, r, grade);
          newState = FsrsState.REVIEW;
        }
        break;
      }
    }

    const intervalDays = Math.min(
      this.maximumInterval,
      Math.max(1, this.calculateInterval(newStability))
    );
    const nextReviewMs = now + intervalDays * 24 * 60 * 60 * 1000;

    const updatedCard: FsrsCard = {
      ...card,
      stability: newStability,
      difficulty: newDifficulty,
      state: newState,
      lastReview: now,
      nextReview: nextReviewMs,
      reps: newReps,
      lapses: newLapses,
      scheduledDays: intervalDays,
      elapsedDays,
    };

    return {
      card: updatedCard,
      intervalDays,
      nextReviewTimestamp: nextReviewMs,
    };
  }

  private initStability(grade: number): number {
    return Math.max(0.1, this.w[grade - 1]);
  }

  private calculateNextDifficulty(currentD: number, grade: number): number {
    if (currentD <= 0.0) {
      const initD = this.w[4] - Math.exp(this.w[5] * (grade - 1)) + 1.0;
      return Math.min(10.0, Math.max(1.0, initD));
    }
    const nextD = currentD - this.w[6] * (grade - 3);
    const meanReversionD =
      this.w[7] * (this.w[4] - Math.exp(this.w[5] * 2)) + (1.0 - this.w[7]) * nextD;
    return Math.min(10.0, Math.max(1.0, meanReversionD));
  }

  private calculateRecallStability(d: number, s: number, r: number, grade: number): number {
    const hardPenalty = grade === Rating.HARD ? this.w[15] : 1.0;
    const easyBonus = grade === Rating.EASY ? this.w[16] : 1.0;
    const newS =
      s *
      (1.0 +
        Math.exp(this.w[8]) *
          (11.0 - d) *
          Math.pow(s, -this.w[9]) *
          (Math.exp((1.0 - r) * this.w[10]) - 1.0) *
          hardPenalty *
          easyBonus);
    return Math.max(0.1, newS);
  }

  private calculateLapseStability(d: number, s: number, r: number): number {
    const newS =
      this.w[11] *
      Math.pow(d, -this.w[12]) *
      (Math.pow(s + 1.0, this.w[13]) - 1.0) *
      Math.exp((1.0 - r) * this.w[14]);
    return Math.min(s, Math.max(0.1, newS));
  }

  private calculateInterval(stability: number): number {
    const newInterval = Math.round(
      (stability / 0.9) * (Math.pow(this.requestRetention, -1.0 / 0.5) - 1.0)
    );
    return Math.max(1, newInterval);
  }
}

export const defaultFsrsScheduler = new FsrsScheduler();
