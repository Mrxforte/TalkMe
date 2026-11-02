import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import {
  Volume2,
  Mic,
  Sliders,
  TrendingUp,
  Sparkles,
  Cloud,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Search,
  Check,
  RotateCcw,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { TOPIC_LEARNING_GROUPS } from '../domain/learning/topicCatalog';

export const ProfileScreen: React.FC = () => {
  const {
    userName,
    userEmail,
    userPhotoURL,
    userLevel,
    xp,
    diamonds,
    currentUser,
    authLoading,
    authError,
    lastCloudSyncTimestamp,
    signInWithGoogle,
    signOutUser,
    manualSyncToCloud,
    userLearnedWords,
    userMasteredRules,
    toggleWordLearned,
    toggleRuleMastered,
    activeProfileTab,
    setActiveProfileTab,
    voiceSettings,
    updateVoiceSettings,
    navigate,
    goBack,
    playTts,
  } = useApp();

  const [wordSearchQuery, setWordSearchQuery] = useState<string>('');
  const [wordFilter, setWordFilter] = useState<'all' | 'learned' | 'learning'>('all');
  const [wordViewMode, setWordViewMode] = useState<'topics' | 'list'>('topics');
  const [ruleViewMode, setRuleViewMode] = useState<'topics' | 'list'>('topics');
  const [isSyncingSpin, setIsSyncingSpin] = useState<boolean>(false);

  const handleManualSync = async () => {
    setIsSyncingSpin(true);
    await manualSyncToCloud();
    setTimeout(() => setIsSyncingSpin(false), 800);
  };

  // Filtered words for list view
  const filteredWords = userLearnedWords.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(wordSearchQuery.toLowerCase()) ||
      w.translation.toLowerCase().includes(wordSearchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (wordFilter === 'learned') return w.status === 'learned';
    if (wordFilter === 'learning') return w.status !== 'learned';
    return true;
  });

  const learnedCount = userLearnedWords.filter((w) => w.status === 'learned').length;
  const masteredRulesCount = userMasteredRules.filter((r) => r.status === 'learned').length;

  const leaderboardUsers = [
    { rank: 1, name: 'Madina S.', xp: '1 480 XP', isUser: false },
    { rank: 2, name: 'Jasur K.', xp: '1 320 XP', isUser: false },
    { rank: 3, name: 'Sardor M.', xp: '1 280 XP', isUser: false },
    { rank: 4, name: `${userName} (Siz)`, xp: `${xp.toLocaleString()} XP`, isUser: true },
  ];

  const profileTabs = [
    { id: 0, label: 'Yodlangan So‘zlar', count: userLearnedWords.length },
    { id: 1, label: 'Qoidalar', count: userMasteredRules.length },
    { id: 2, label: 'Google Hisob', count: currentUser ? '✓' : '' },
    { id: 3, label: 'Reyting', count: '' },
    { id: 4, label: 'Ovozli AI', count: '' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="px-4 sm:px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="Mening Profilim"
          subtitle="O‘rganish yo‘lim, so‘zlar va bulut sinxronlash"
          onBackClick={goBack}
        />

        {/* ==========================================
            1. USER IDENTITY & CLOUD PROFILE CARD
           ========================================== */}
        <div className="rounded-xl p-5 bg-[#3949AB] text-white shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {userPhotoURL ? (
                <img
                  src={userPhotoURL}
                  alt={userName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white/40 shadow-xs"
                />
              ) : (
                <div className="w-13 h-13 rounded-full bg-white text-[#3949AB] font-bold text-xl flex items-center justify-center border-2 border-white shadow-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-white leading-snug flex items-center gap-1.5">
                  {userName}
                  <Sparkles className="w-4 h-4 text-[#80CBC4]" />
                </h2>
                <p className="text-xs text-[#C5CAE9] truncate max-w-[180px]">
                  {userEmail || 'Toshkent · TalkMe O‘quvchisi'}
                </p>
              </div>
            </div>

            <TalkMeBadge
              text={userLevel}
              containerColor="bg-white/15"
              textColor="text-white"
            />
          </div>

          {/* Cloud Sync Status Indicator */}
          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#80CBC4] animate-pulse" />
                <span className="text-xs font-semibold text-[#E0F2F1] flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5" />
                  Firebase & Bulutga ulangan
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/50" />
                <span className="text-xs font-medium text-[#C5CAE9]">
                  Lokal rejim (Google ulanmagan)
                </span>
              </div>
            )}

            {currentUser && (
              <button
                type="button"
                onClick={handleManualSync}
                className="text-xs text-white font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                title="Hozir sinxronlash"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSpin ? 'animate-spin' : ''}`} />
                <span>Sinxronlash</span>
              </button>
            )}
          </div>
        </div>

        {/* ==========================================
            2. STATS OVERVIEW (XP, Diamonds, Words, Rules)
           ========================================== */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-xl bg-white border border-[#E0E4EC] text-center shadow-2xs">
            <span className="text-[10px] text-[#616161] font-bold uppercase">XP</span>
            <p className="text-base font-bold text-[#3949AB] mt-0.5">{xp.toLocaleString()}</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E0E4EC] text-center shadow-2xs">
            <span className="text-[10px] text-[#616161] font-bold uppercase">Olmos</span>
            <p className="text-base font-bold text-[#3949AB] mt-0.5">{diamonds.toLocaleString()}</p>
          </div>

          <div
            onClick={() => setActiveProfileTab(0)}
            className="p-3 rounded-xl bg-white border border-[#E0E4EC] text-center shadow-2xs cursor-pointer hover:border-[#00897B] transition-colors"
          >
            <span className="text-[10px] text-[#00897B] font-bold uppercase">So‘zlar</span>
            <p className="text-base font-bold text-[#00897B] mt-0.5">{learnedCount}</p>
          </div>

          <div
            onClick={() => setActiveProfileTab(1)}
            className="p-3 rounded-xl bg-white border border-[#E0E4EC] text-center shadow-2xs cursor-pointer hover:border-[#3949AB] transition-colors"
          >
            <span className="text-[10px] text-[#3949AB] font-bold uppercase">Qoidalar</span>
            <p className="text-base font-bold text-[#3949AB] mt-0.5">{masteredRulesCount}</p>
          </div>
        </div>

        {/* ==========================================
            3. TAB NAVIGATION (So'zlar, Qoidalar, Hisob, Reyting, Ovoz)
           ========================================== */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {profileTabs.map((tab) => {
            const isActive = activeProfileTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveProfileTab(tab.id)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#3949AB] text-white shadow-2xs'
                    : 'bg-white text-[#616161] border border-[#E0E4EC] hover:bg-[#E8EAF6] hover:text-[#3949AB]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== '' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#E8EAF6] text-[#3949AB]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==========================================
            TAB 0: YODLANGAN SO'ZLAR (LEARNED WORDS)
           ========================================== */}
        {activeProfileTab === 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#212121]">Yodlangan So‘zlar Ro‘yxati</h3>
                <p className="text-xs text-[#616161]">
                  {learnedCount} ta o‘zlashtirilgan so‘z · Firestore bulutida saqlanadi
                </p>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-[#E8EAF6] p-0.5 rounded-lg border border-[#C5CAE9]">
                <button
                  type="button"
                  onClick={() => setWordViewMode('topics')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    wordViewMode === 'topics'
                      ? 'bg-[#3949AB] text-white shadow-2xs'
                      : 'text-[#3949AB] hover:text-[#212121]'
                  }`}
                >
                  Mavzular
                </button>
                <button
                  type="button"
                  onClick={() => setWordViewMode('list')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    wordViewMode === 'list'
                      ? 'bg-[#3949AB] text-white shadow-2xs'
                      : 'text-[#3949AB] hover:text-[#212121]'
                  }`}
                >
                  Ro‘yxat
                </button>
              </div>
            </div>

            {/* TOPIC-BASED VIEW */}
            {wordViewMode === 'topics' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#E0F2F1] border border-[#B2DFDB] text-xs font-medium text-[#00695C]">
                  Katta mavzu ustiga bosing — unda o‘rganiladigan barcha yangi so‘zlar alohida sahifada to‘liq ochiladi.
                </div>

                {TOPIC_LEARNING_GROUPS.map((topic) => {
                  const liveWords = topic.words.map((tw) => {
                    const found = userLearnedWords.find((w) => w.id === tw.id);
                    return found ? { ...tw, status: found.status } : tw;
                  });
                  const learnedInTopic = liveWords.filter((w) => w.status === 'learned').length;

                  return (
                    <div
                      key={topic.id}
                      onClick={() => navigate('topic_detail', { topicId: topic.id })}
                      className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs cursor-pointer hover:border-[#3949AB] transition-all group space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="w-11 h-11 rounded-lg bg-[#E8EAF6] text-xl flex items-center justify-center shrink-0 border border-[#C5CAE9]">
                            {topic.iconEmoji}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                              {topic.section}
                            </span>
                            <h4 className="text-sm font-bold text-[#212121] mt-1 truncate">
                              {topic.title}
                            </h4>
                            <p className="text-xs text-[#616161] line-clamp-1">{topic.subtitle}</p>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-[#F5F6FA] group-hover:bg-[#3949AB] group-hover:text-white flex items-center justify-center text-[#616161] transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Word chips preview */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {topic.words.map((w) => {
                          const isLearned = liveWords.find((item) => item.id === w.id)?.status === 'learned';
                          return (
                            <span
                              key={w.id}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                                isLearned
                                  ? 'bg-[#E0F2F1] text-[#00897B] border border-[#B2DFDB]'
                                  : 'bg-[#F5F6FA] text-[#212121] border border-[#E0E4EC]'
                              }`}
                            >
                              <span>{w.emoji}</span>
                              <span>{w.word}</span>
                              {isLearned && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </span>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-[#E0E4EC] flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#00897B] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00897B]" />
                          {learnedInTopic}/{topic.words.length} ta yodlangan
                        </span>
                        <span className="text-[#616161] font-semibold flex items-center gap-1 group-hover:text-[#3949AB]">
                          Sahifani ochish →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FLAT LIST VIEW */}
            {wordViewMode === 'list' && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#616161]" />
                  <input
                    type="text"
                    placeholder="So‘z yoki tarjimasini qidirish..."
                    value={wordSearchQuery}
                    onChange={(e) => setWordSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-[#E0E4EC] text-xs font-semibold text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#3949AB]"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWordFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      wordFilter === 'all'
                        ? 'bg-[#3949AB] text-white'
                        : 'bg-white text-[#616161] border border-[#E0E4EC]'
                    }`}
                  >
                    Barchasi ({userLearnedWords.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWordFilter('learned')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      wordFilter === 'learned'
                        ? 'bg-[#00897B] text-white'
                        : 'bg-white text-[#00897B] border border-[#B2DFDB]'
                    }`}
                  >
                    ✓ Yodlangan ({learnedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWordFilter('learning')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      wordFilter === 'learning'
                        ? 'bg-[#3949AB] text-white'
                        : 'bg-white text-[#3949AB] border border-[#C5CAE9]'
                    }`}
                  >
                    O‘rganilmoqda ({userLearnedWords.length - learnedCount})
                  </button>
                </div>

                {filteredWords.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#E0E4EC] space-y-2">
                    <p className="text-sm font-bold text-[#212121]">So‘z topilmadi</p>
                    <p className="text-xs text-[#616161]">Boshqa kalit so‘z bilan qidiring</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    {filteredWords.map((item) => {
                      const isLearned = item.status === 'learned';
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs flex items-center justify-between gap-3 hover:border-[#3949AB] transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-10 h-10 rounded-lg bg-[#E8EAF6] flex items-center justify-center text-xl shrink-0">
                              {item.emoji || '📖'}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[#212121] truncate">
                                  {item.word}
                                </span>
                                {item.phonetic && (
                                  <span className="text-[11px] font-medium text-[#616161]">
                                    {item.phonetic}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-[#00897B] truncate">
                                {item.translation}
                              </p>
                              <span className="text-[10px] text-[#757575] font-medium">
                                {item.category} • {item.reps} marta takrorlangan
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => playTts(item.word)}
                              className="w-8 h-8 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors cursor-pointer"
                              title="Talaffuzni eshitish (TTS)"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleWordLearned(item.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isLearned
                                  ? 'bg-[#E0F2F1] text-[#00897B] border border-[#B2DFDB]'
                                  : 'bg-[#E8EAF6] text-[#3949AB] border border-[#C5CAE9]'
                              }`}
                            >
                              {isLearned ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Yodlandi</span>
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>O‘rganish</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 1: O‘ZLASHTIRILGAN QOIDALAR (MASTERED RULES)
           ========================================== */}
        {activeProfileTab === 1 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#212121]">Grammatika Qoidalari</h3>
                <p className="text-xs text-[#616161]">
                  {masteredRulesCount} ta o‘zlashtirilgan qoida · Firestore bulutida saqlanadi
                </p>
              </div>

              <div className="flex items-center bg-[#E8EAF6] p-0.5 rounded-lg border border-[#C5CAE9]">
                <button
                  type="button"
                  onClick={() => setRuleViewMode('topics')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    ruleViewMode === 'topics'
                      ? 'bg-[#3949AB] text-white shadow-2xs'
                      : 'text-[#3949AB] hover:text-[#212121]'
                  }`}
                >
                  Mavzular
                </button>
                <button
                  type="button"
                  onClick={() => setRuleViewMode('list')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    ruleViewMode === 'list'
                      ? 'bg-[#3949AB] text-white shadow-2xs'
                      : 'text-[#3949AB] hover:text-[#212121]'
                  }`}
                >
                  Ro‘yxat
                </button>
              </div>
            </div>

            {/* TOPIC-BASED RULES VIEW */}
            {ruleViewMode === 'topics' && (
              <div className="space-y-3">
                {TOPIC_LEARNING_GROUPS.map((topic) => {
                  return (
                    <div
                      key={topic.id}
                      onClick={() => navigate('topic_detail', { topicId: topic.id })}
                      className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs cursor-pointer hover:border-[#3949AB] transition-all group space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-xl flex items-center justify-center shrink-0 border border-[#C5CAE9]">
                            {topic.iconEmoji}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                              {topic.section}
                            </span>
                            <h4 className="text-sm font-bold text-[#212121] mt-0.5 truncate">
                              {topic.title}
                            </h4>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-[#F5F6FA] group-hover:bg-[#3949AB] group-hover:text-white flex items-center justify-center text-[#616161] transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Rules preview list */}
                      <div className="space-y-1.5 pt-1">
                        {topic.rules.map((r) => (
                          <div
                            key={r.id}
                            className="p-2.5 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-[#212121] truncate max-w-[230px]">
                              {r.nameUz}
                            </span>
                            <span className="text-[11px] font-mono text-[#3949AB] font-bold">
                              {r.formula ? 'Formula' : 'Qoida'}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#E0E4EC] flex items-center justify-between text-xs font-semibold text-[#3949AB]">
                        <span>Qoidalarni alohida sahifada o‘rganish</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FLAT RULES LIST */}
            {ruleViewMode === 'list' && (
              <div className="space-y-3">
                {userMasteredRules.map((rule) => {
                  const isLearned = rule.status === 'learned';
                  return (
                    <div
                      key={rule.id}
                      className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3 hover:border-[#3949AB] transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                            {rule.category}
                          </span>
                          <h4 className="text-sm font-bold text-[#212121] mt-1.5 leading-snug">
                            {rule.nameUz}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleRuleMastered(rule.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0 ${
                            isLearned
                              ? 'bg-[#E0F2F1] text-[#00897B] border border-[#B2DFDB]'
                              : 'bg-[#E8EAF6] text-[#3949AB] border border-[#C5CAE9]'
                          }`}
                        >
                          {isLearned ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>O‘zlashtirildi</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>O‘rganilmoqda</span>
                            </>
                          )}
                        </button>
                      </div>

                      {rule.formula && (
                        <div className="px-3 py-2 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#3949AB]">
                            {rule.formula}
                          </span>
                          <span className="text-[10px] font-bold text-[#616161] uppercase">Formula</span>
                        </div>
                      )}

                      <p className="text-xs text-[#616161] leading-relaxed">
                        {rule.shortSummaryUz}
                      </p>

                      {rule.exampleEn && (
                        <div className="pt-2 border-t border-[#E0E4EC] flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[#212121] flex items-center gap-1.5">
                              <span>{rule.exampleEn}</span>
                            </p>
                            <p className="text-[11px] text-[#616161]">{rule.exampleUz}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => playTts(rule.exampleEn || '')}
                            className="w-8 h-8 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors cursor-pointer shrink-0"
                            title="Misolni eshitish"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 2: GOOGLE HISOB VA BULUT SINXRONLASH
           ========================================== */}
        {activeProfileTab === 2 && (
          <div className="space-y-4 pt-1">
            <div>
              <h3 className="text-base font-bold text-[#212121]">Google OAuth & Bulut Xizmati</h3>
              <p className="text-xs text-[#616161]">
                Yodlangan so‘zlar, grammatika qoidalari va yutuqlarni xavfsiz saqlash
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#D32F2F] text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {!currentUser ? (
              <div className="p-6 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs text-center space-y-4">
                <div className="w-16 h-16 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[#212121]">Google orqali kiring</h4>
                  <p className="text-xs text-[#616161] leading-relaxed max-w-xs mx-auto">
                    Barcha yodlagan so‘zlaringiz, grammatika darslaringiz va XP ballaringiz Cloud Firestore bazasiga avtomatik saqlanadi.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={signInWithGoogle}
                  disabled={authLoading}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#3949AB] text-white font-semibold text-sm flex items-center justify-center gap-3 hover:bg-[#283593] transition-all cursor-pointer shadow-xs active:scale-98 disabled:opacity-50"
                >
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{authLoading ? 'Yuklanmoqda...' : 'Google hisobi bilan kirish'}</span>
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4">
                <div className="flex items-center gap-3.5">
                  {userPhotoURL ? (
                    <img
                      src={userPhotoURL}
                      alt={userName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#C5CAE9]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#3949AB] text-white font-bold text-xl flex items-center justify-center">
                      {userName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-[#212121] leading-snug">{userName}</h4>
                    <p className="text-xs text-[#616161] truncate">{userEmail}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00897B] mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Google orqali tasdiqlangan hisob
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#616161]">Foydalanuvchi ID:</span>
                    <span className="font-mono text-[#212121] text-[11px]">
                      {currentUser.uid.slice(0, 14)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#616161]">Bulut holati:</span>
                    <span className="font-semibold text-[#00897B]">Faol & Himoyalangan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#616161]">Oxirgi sinxronlash:</span>
                    <span className="font-semibold text-[#212121]">
                      {lastCloudSyncTimestamp
                        ? new Date(lastCloudSyncTimestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Hozirgina'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleManualSync}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#3949AB] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#283593] transition-all cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSpin ? 'animate-spin' : ''}`} />
                    <span>Bulutga sinxronlash</span>
                  </button>

                  <button
                    type="button"
                    onClick={signOutUser}
                    className="py-2.5 px-4 rounded-lg bg-white border border-[#E0E4EC] text-[#D32F2F] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#FFEBEE] transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Chiqish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB 3: REYTING (LEADERBOARD)
           ========================================== */}
        {activeProfileTab === 3 && (
          <div className="space-y-3 pt-1">
            <div>
              <h3 className="text-base font-bold text-[#212121]">Reyting</h3>
              <p className="text-xs text-[#616161]">Birga o‘rganamiz, birga o‘samiz</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#E0F2F1] border border-[#B2DFDB] shadow-2xs flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-[#00897B] shrink-0" />
              <p className="text-xs text-[#00695C] font-medium leading-relaxed">
                Kuchli uchlikka yana 40 XP! O‘z sur‘atingizda davom eting, {userName}.
              </p>
            </div>

            <TalkMeCard className="p-4 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3949AB]">
                A2 BILIMDONLARI · 20 O‘QUVCHI
              </span>

              <div className="space-y-2 pt-1 divide-y divide-[#E0E4EC]">
                {leaderboardUsers.map((u) => (
                  <div
                    key={u.rank}
                    className={`pt-2 flex items-center justify-between ${
                      u.isUser ? 'bg-[#E8EAF6] -mx-2 px-2 py-1.5 rounded-lg' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-bold w-6 ${
                          u.isUser ? 'text-[#3949AB]' : 'text-[#616161]'
                        }`}
                      >
                        #{u.rank}
                      </span>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          u.isUser
                            ? 'bg-[#3949AB] text-white'
                            : 'bg-[#F5F6FA] text-[#212121] border border-[#E0E4EC]'
                        }`}
                      >
                        {u.name.charAt(0)}
                      </div>

                      <span
                        className={`text-sm ${
                          u.isUser ? 'font-bold text-[#3949AB]' : 'font-semibold text-[#212121]'
                        }`}
                      >
                        {u.name}
                      </span>
                    </div>

                    <TalkMeBadge
                      text={u.xp}
                      containerColor={u.isUser ? 'bg-[#3949AB]' : 'bg-[#F5F6FA]'}
                      textColor={u.isUser ? 'text-white' : 'text-[#616161]'}
                    />
                  </div>
                ))}
              </div>
            </TalkMeCard>
          </div>
        )}

        {/* ==========================================
            TAB 4: OVOZLI AI SOZLAMALARI
           ========================================== */}
        {activeProfileTab === 4 && (
          <div className="space-y-3 pt-1">
            <div>
              <h3 className="text-base font-bold text-[#212121]">
                Ovozli AI Engine & Model Sozlamalari
              </h3>
              <p className="text-xs text-[#616161]">
                TTS dvigatellari, modellar va ovoz tezligini boshqarish
              </p>
            </div>

            <div className="rounded-xl p-5 bg-white border border-[#E0E4EC] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#3949AB]">
                    Aktiv Dvigatel: Gemini 3.8 Flash TTS
                  </h4>
                  <p className="text-xs text-[#616161]">
                    Tabiiy mobil AI ovoz (24kHz WAV · en-US)
                  </p>
                </div>

                <TalkMeBadge
                  text="GEMINI 3.8"
                  containerColor="bg-[#E0F2F1]"
                  textColor="text-[#00897B]"
                />
              </div>

              {/* Speed slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#212121]">
                    Ovoz tezligi: {voiceSettings.speechSpeed.toFixed(2)}x
                  </span>

                  <button
                    onClick={() => playTts('Welcome to TalkMe English learning platform!')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-[#3949AB] text-white font-semibold flex items-center gap-1.5 hover:bg-[#283593] transition-colors cursor-pointer text-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Eshitish</span>
                  </button>
                </div>

                <input
                  type="range"
                  min="0.65"
                  max="1.25"
                  step="0.05"
                  value={voiceSettings.speechSpeed}
                  onChange={(e) => updateVoiceSettings({ speechSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-[#3949AB] cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <TalkMeButton
                text="Voice Studio — Ovoz Sinov Muhiti"
                trailingIcon={<Mic className="w-5 h-5" />}
                onClick={() => navigate('voice_studio')}
              />

              <TalkMeButton
                text="Barcha Voice AI Sozlamalari"
                variant="secondary"
                trailingIcon={<Sliders className="w-5 h-5" />}
                onClick={() => navigate('voice_settings')}
              />
            </div>
          </div>
        )}
      </div>

      <TalkMeBottomBar
        selectedTab={3}
        onTabSelected={(idx) => {
          if (idx === 0) navigate('home');
          if (idx === 1) navigate('courses');
          if (idx === 2) navigate('repeat');
          if (idx === 3) navigate('profile');
        }}
      />
    </div>
  );
};
