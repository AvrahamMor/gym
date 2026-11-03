import React from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Sparkles, Timer, Zap, Cloud } from 'lucide-react';

export function Header() {
  const {
    currentUserId,
    switchUser,
    profiles,
    currentProfile,
    timerActive,
    timerRemaining,
    stopRestTimer,
    isCloudActive,
    setCurrentTab,
  } = useApp();

  const isBabzi = currentUserId === 'babzi';
  const otherUser = isBabzi ? profiles.avraham : profiles.babzi;

  return (
    <header className="sticky top-0 z-40 bg-[#07090e]/85 backdrop-blur-2xl border-b border-white/[0.07] px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all shadow-lg ${
              isBabzi
                ? 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-rose-500/25'
                : 'bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-emerald-500/25'
            }`}
          >
            <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white tracking-tight">FitCouple</span>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border flex items-center gap-1 shadow-sm ${
                  isBabzi
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <Zap className="w-2.5 h-2.5 fill-current" />
                3.8 Flash High
              </span>
              <button
                onClick={() => setCurrentTab('settings')}
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border flex items-center gap-1 shadow-sm transition-colors ${
                  isCloudActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-white/[0.08] hover:text-white'
                }`}
                title={isCloudActive ? 'ענן מחובר ומסונכרן בזמן אמת' : 'הגדר סנכרון ענן ב-Settings'}
              >
                <Cloud className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>{isCloudActive ? 'ענן' : 'מקומי'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">אברהם & באבזי • חיטוב ואימונים</p>
          </div>
        </div>

        {/* Dynamic Island Style Rest Timer Pill */}
        {timerActive && timerRemaining > 0 && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/90 to-slate-900 border border-emerald-500/50 text-emerald-300 px-3 py-1.5 rounded-full animate-pulse shadow-lg shadow-emerald-500/15">
            <Timer className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span className="font-mono font-black text-xs">
              {Math.floor(timerRemaining / 60)}:{(timerRemaining % 60).toString().padStart(2, '0')}
            </span>
            <button
              onClick={stopRestTimer}
              className="text-[10px] text-emerald-400/90 hover:text-white underline mr-0.5"
            >
              דלג
            </button>
          </div>
        )}

        {/* Profile Switcher Button */}
        <button
          onClick={() => switchUser(otherUser.id)}
          className={`relative flex items-center gap-2 p-1.5 pr-2.5 pl-3 rounded-2xl border transition-all active:scale-95 shadow-lg group ${
            isBabzi
              ? 'bg-rose-950/40 border-rose-500/40 hover:border-rose-400'
              : 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
          }`}
          title={`החלף לפרופיל של ${otherUser.nickname}`}
        >
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs font-black text-white">
              <span>{currentProfile.nickname}</span>
              <span className="text-[10px] text-slate-400 font-normal">({currentProfile.currentWeight} ק״ג)</span>
            </div>
            <div className="text-[9px] text-slate-400 group-hover:text-slate-200 transition-colors">
              החלף ל{otherUser.nickname} ⇄
            </div>
          </div>

          <div className="relative">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg border ${
                isBabzi ? 'bg-rose-500/20 border-rose-500/50' : 'bg-emerald-500/20 border-emerald-500/50'
              }`}
            >
              {currentProfile.avatar}
            </div>
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                isBabzi ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
}
