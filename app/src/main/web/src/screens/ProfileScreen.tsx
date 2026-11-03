import React from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { getProfileById } from '../domain/voice/catalog';
import { GlobalTtsControlStrip } from '../shared/components/speakable/SpeakableComponents';
import {
  User,
  Cloud,
  CloudOff,
  RefreshCw,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Mic,
  Settings,
  Award,
  Sparkles,
  Zap,
  Gem,
  AlertCircle,
} from 'lucide-react';

/**
 * 1. MAIN PROFILE SCREEN
 * - Responsive User Identity Card ('O‘quvchi')
 * - Clean XP & Olmos stats
 * - Material 2 Menu Cards for:
 *   1. Google Hisob -> opens 'google_account' screen
 *   2. Ovozli AI -> opens 'voice_ai_settings' screen
 *   3. Reyting -> opens 'leaderboard' screen
 */
export const ProfileScreen: React.FC = () => {
  const {
    userName,
    userEmail,
    userPhotoURL,
    currentUser,
    xp,
    diamonds,
    voiceSettings,
    cloudSyncStatus,
    manualSyncToCloud,
    navigate,
  } = useApp();

  const activeProfile = getProfileById(voiceSettings.selectedCharacterProfile);

  const syncStatusBadge = () => {
    if (!currentUser) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 text-white text-xs font-medium max-w-full">
          <CloudOff className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Lokal rejim (Google ulanmagan)</span>
        </span>
      );
    }
    if (cloudSyncStatus === 'syncing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 text-white text-xs font-medium max-w-full">
          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span className="truncate">Bulut bilan sinxronlanmoqda...</span>
        </span>
      );
    }
    if (cloudSyncStatus === 'error') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D32F2F] text-white text-xs font-medium max-w-full">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Sinxronlash xatosi</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00897B] text-white text-xs font-medium max-w-full">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">Google Bulutda saqlangan</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-28 text-[#212121]">
      <div className="px-4 pt-2 space-y-4 max-w-lg mx-auto">
        <TalkMeHeader
          title="Mening Profilim"
          leadingIcon={<User className="w-5 h-5" />}
          trailingContent={
            <button
              type="button"
              onClick={() => navigate('voice_ai_settings')}
              className="w-10 h-10 rounded-xl bg-white border border-[#E0E4EC] text-[#3949AB] hover:bg-[#E8EAF6] transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
              title="Ovoz va profil sozlamalari"
              aria-label="Sozlamalar"
            >
              <Settings className="w-5 h-5" />
            </button>
          }
        />

        {/* RESPONSIVE USER IDENTITY & CLOUD PROFILE BANNER */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#3949AB] text-white shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {userPhotoURL ? (
                <img
                  src={userPhotoURL}
                  alt={userName}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/40 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-[#3949AB] font-bold text-lg sm:text-xl flex items-center justify-center shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold tracking-tight truncate">
                  {userName}
                </h2>
                <p className="text-xs text-[#E8EAF6] truncate mt-0.5">
                  {userEmail ? `${userEmail} · O‘quvchi` : 'O‘quvchi'}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md bg-[#283593] border border-white/15 text-xs font-semibold shrink-0">
              Faol o‘quvchi
            </span>
          </div>

          {/* Cloud Status Bar */}
          <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0 max-w-full">{syncStatusBadge()}</div>

            {currentUser ? (
              <button
                type="button"
                onClick={manualSyncToCloud}
                className="px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Yangilash</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('google_account')}
                className="px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <span>Ulash</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* STATS SUMMARY GRID (XP & OLMOS) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold text-[#3949AB] leading-tight">{xp}</div>
              <div className="text-[11px] font-medium text-[#616161] truncate">Jami XP</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-bold text-[#00897B] leading-tight">{diamonds}</div>
              <div className="text-[11px] font-medium text-[#616161] truncate">Olmoslar</div>
            </div>
          </div>
        </div>

        {/* PROFILE MENU LIST (OPENS IN DEDICATED SCREENS) */}
        <div className="space-y-2.5 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#616161] px-1">
            Profil bo‘limlari va sozlamalar
          </h3>

          {/* 1. GOOGLE HISOB */}
          <button
            type="button"
            onClick={() => navigate('google_account')}
            className="w-full p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs hover:border-[#3949AB] transition-all flex items-center justify-between gap-3 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] text-[#3949AB] flex items-center justify-center shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#212121]">Google Hisob</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      currentUser
                        ? 'bg-[#E0F2F1] text-[#00897B]'
                        : 'bg-[#F5F6FA] text-[#616161] border border-[#E0E4EC]'
                    }`}
                  >
                    {currentUser ? 'Ulangan' : 'Lokal rejim'}
                  </span>
                </div>
                <p className="text-xs text-[#616161] truncate mt-0.5">
                  {currentUser
                    ? `${userEmail || 'Google bulut sinxronlash faol'}`
                    : 'Google orqali kirish va bulut sinxronlash'}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-[#F5F6FA] group-hover:bg-[#3949AB] group-hover:text-white text-[#616161] flex items-center justify-center transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* 2. OVOZLI AI */}
          <button
            type="button"
            onClick={() => navigate('voice_ai_settings')}
            className="w-full p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs hover:border-[#3949AB] transition-all flex items-center justify-between gap-3 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#E0F2F1] border border-[#B2DFDB] text-[#00897B] flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#212121]">Ovozli AI</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8EAF6] text-[#3949AB]">
                    {activeProfile.nameUz}
                  </span>
                </div>
                <p className="text-xs text-[#616161] truncate mt-0.5">
                  Nutq tezligi, Gemini 3.8 TTS ovozlar va Voice Studio
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-[#F5F6FA] group-hover:bg-[#3949AB] group-hover:text-white text-[#616161] flex items-center justify-center transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* 3. REYTING */}
          <button
            type="button"
            onClick={() => navigate('leaderboard')}
            className="w-full p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs hover:border-[#3949AB] transition-all flex items-center justify-between gap-3 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#FFF8E1] border border-[#FFE082] text-[#F57C00] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#212121]">Reyting</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFF8E1] text-[#F57C00]">
                    {xp} XP
                  </span>
                </div>
                <p className="text-xs text-[#616161] truncate mt-0.5">
                  O‘quvchilar haftalik reytingi va peshqadamlar jadvali
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-[#F5F6FA] group-hover:bg-[#3949AB] group-hover:text-white text-[#616161] flex items-center justify-center transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
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

/**
 * 2. DEDICATED SCREEN: GOOGLE HISOB (GOOGLE ACCOUNT & CLOUD SYNC)
 */
export const GoogleAccountScreen: React.FC = () => {
  const {
    userName,
    userEmail,
    userPhotoURL,
    currentUser,
    authLoading,
    authError,
    signInWithGoogle,
    signOutUser,
    lastCloudSyncTimestamp,
    manualSyncToCloud,
    goBack,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="px-4 pt-2 space-y-4 max-w-lg mx-auto">
        <TalkMeHeader
          title="Google Hisob"
          leadingIcon={<Cloud className="w-5 h-5" />}
          onBackClick={goBack}
        />
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
                Barcha o‘zlashtirgan so‘zlaringiz, grammatika darslaringiz va XP ballaringiz Cloud Firestore bazasiga avtomatik saqlanadi.
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
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C5CAE9] shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#3949AB] text-white font-bold text-xl flex items-center justify-center shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <h4 className="text-base font-bold text-[#212121] leading-snug truncate">
                  {userName}
                </h4>
                <p className="text-xs text-[#616161] truncate">{userEmail}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00897B] mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Google orqali tasdiqlangan hisob
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#616161]">Foydalanuvchi ID:</span>
                <span className="font-mono text-[#212121] text-[11px] truncate">
                  {currentUser.uid.slice(0, 14)}...
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#616161]">Bulut holati:</span>
                <span className="font-semibold text-[#00897B]">Faol & Himoyalangan</span>
              </div>
              <div className="flex items-center justify-between gap-2">
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

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={manualSyncToCloud}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#E8EAF6] text-[#3949AB] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#C5CAE9] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Hozir sinxronlash</span>
              </button>

              <button
                type="button"
                onClick={signOutUser}
                className="py-2.5 px-4 rounded-lg bg-[#FFEBEE] text-[#D32F2F] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FFCDD2] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 3. DEDICATED SCREEN: OVOZLI AI (VOICE AI & TTS SPEED SETTINGS)
 */
export const VoiceAiSettingsScreen: React.FC = () => {
  const { voiceSettings, ttsStatus, navigate, goBack } = useApp();

  const activeProfile = getProfileById(voiceSettings.selectedCharacterProfile);

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="px-4 pt-2 space-y-4 max-w-lg mx-auto">
        <TalkMeHeader
          title="Ovozli AI"
          leadingIcon={<Mic className="w-5 h-5" />}
          onBackClick={goBack}
        />
        {/* Global TTS Speed & Provider Configuration (Faqat Settings ichida) */}
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3949AB]">
              Nutq tezligi (TTS Speed)
            </span>
            <span className="text-xs font-semibold text-[#616161]">Ovoz sozlamasi</span>
          </div>
          <GlobalTtsControlStrip showInSettingsOnly />
        </div>

        {/* Active Character Profile Card */}
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] flex items-center justify-center text-2xl shrink-0">
              {activeProfile.iconEmoji}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3949AB] shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3949AB] truncate">
                  Gemini 3.8 Flash Lite TTS
                </span>
              </div>
              <h4 className="text-base font-bold text-[#212121] truncate">
                {activeProfile.nameUz} ({activeProfile.geminiVoiceName})
              </h4>
              <p className="text-xs text-[#616161] truncate">
                Keshlangan audio: {ttsStatus.cacheCount} ta · Tezlik:{' '}
                {voiceSettings.speechSpeed.toFixed(2)}x
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('voice_settings')}
            className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors cursor-pointer shrink-0"
            title="Ovoz sozlamalari"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Links to Voice Studio & Full Voice Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => navigate('voice_studio')}
            className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs hover:border-[#3949AB] transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#212121]">Voice Studio Lab</h4>
              <p className="text-xs text-[#616161] mt-0.5">
                Nutqni jonli test qilish va kechikish tahlili
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#3949AB]">
              <span>Ochish</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate('voice_settings')}
            className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs hover:border-[#00897B] transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#212121]">Ovoz Sozlamalari</h4>
              <p className="text-xs text-[#616161] mt-0.5">
                6 xil ovoz profili, tezlik va ohang
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#00897B]">
              <span>Sozlash</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. DEDICATED SCREEN: REYTING (LEADERBOARD)
 */
export const LeaderboardScreen: React.FC = () => {
  const { userName, xp, goBack } = useApp();

  const leaderboard = [
    { rank: 1, name: 'Sardor K.', xp: 3420, isMe: false },
    { rank: 2, name: 'Madina A.', xp: 2890, isMe: false },
    { rank: 3, name: `${userName} (Siz)`, xp, isMe: true },
    { rank: 4, name: 'Jasur T.', xp: 980, isMe: false },
    { rank: 5, name: 'Dilnoza M.', xp: 840, isMe: false },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="px-4 pt-2 space-y-3 max-w-lg mx-auto">
        <TalkMeHeader
          title="Reyting"
          leadingIcon={<Award className="w-5 h-5" />}
          onBackClick={goBack}
        />
        {leaderboard.map((item) => (
          <div
            key={item.rank}
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
              item.isMe
                ? 'bg-[#E8EAF6] border-[#3949AB] shadow-2xs'
                : 'bg-white border-[#E0E4EC]'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg font-bold text-sm flex items-center justify-center shrink-0 ${
                  item.rank === 1
                    ? 'bg-[#F57C00] text-white'
                    : item.rank === 2
                    ? 'bg-[#5C6BC0] text-white'
                    : item.rank === 3
                    ? 'bg-[#00897B] text-white'
                    : 'bg-[#F5F6FA] text-[#616161] border border-[#E0E4EC]'
                }`}
              >
                #{item.rank}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#212121] truncate">{item.name}</div>
                <div className="text-xs text-[#616161]">Faol o‘quvchi</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-sm text-[#3949AB] shrink-0">
              <Award className="w-4 h-4 text-[#F57C00]" />
              <span>{item.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
