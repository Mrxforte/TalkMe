import { useState, useEffect, useMemo } from 'react';
import {
  globalKnowledgeTracker,
  GlobalKnowledgeStatistics,
  VocabularyLibraryQuery,
  GrammarLibraryQuery,
} from '../../domain/services/GlobalKnowledgeTracker';
import { VocabularyKnowledge } from '../../domain/entities/VocabularyKnowledge';
import { GrammarKnowledge } from '../../domain/entities/GrammarKnowledge';

export function useKnowledgeStats(): {
  stats: GlobalKnowledgeStatistics;
  isLoading: boolean;
  error: string | null;
} {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = globalKnowledgeTracker.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  const stats = useMemo(() => {
    void tick;
    return globalKnowledgeTracker.getGlobalStatistics();
  }, [tick]);

  const { isLoading, error } = globalKnowledgeTracker.getLoadingState();
  return { stats, isLoading, error };
}

export function useVocabularyKnowledge(query: VocabularyLibraryQuery = {}): {
  items: VocabularyKnowledge[];
  stats: GlobalKnowledgeStatistics;
  isLoading: boolean;
  error: string | null;
} {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = globalKnowledgeTracker.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  const items = useMemo(() => {
    void tick;
    return globalKnowledgeTracker.getVocabularyLibrary(query);
  }, [
    tick,
    query.searchQuery,
    query.levelId,
    query.courseOrTopicId,
    query.status,
    query.sortBy,
    query.includeCatalogUntracked,
  ]);

  const stats = useMemo(() => {
    void tick;
    return globalKnowledgeTracker.getGlobalStatistics();
  }, [tick]);

  const { isLoading, error } = globalKnowledgeTracker.getLoadingState();
  return { items, stats, isLoading, error };
}

export function useGrammarKnowledge(query: GrammarLibraryQuery = {}): {
  items: GrammarKnowledge[];
  stats: GlobalKnowledgeStatistics;
  isLoading: boolean;
  error: string | null;
} {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = globalKnowledgeTracker.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  const items = useMemo(() => {
    void tick;
    return globalKnowledgeTracker.getGrammarLibrary(query);
  }, [
    tick,
    query.searchQuery,
    query.levelId,
    query.topicId,
    query.status,
    query.sortBy,
    query.includeCatalogUntracked,
  ]);

  const stats = useMemo(() => {
    void tick;
    return globalKnowledgeTracker.getGlobalStatistics();
  }, [tick]);

  const { isLoading, error } = globalKnowledgeTracker.getLoadingState();
  return { items, stats, isLoading, error };
}
