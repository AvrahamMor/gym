import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Key, User, ShieldCheck, ExternalLink, Save, RotateCcw, Zap, Sparkles } from 'lucide-react';

export function SettingsTab() {
  const {
    apiKey,
    setApiKey,
    currentProfile,
    currentUserId,
    updateProfile,
  } = useApp();

  const isBabzi = currentUserId === 'babzi';

  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [keySaved, setKeySaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [name, setName] = useState(currentProfile.name);
  const [nickname, setNickname] = useState(currentProfile.nickname);
  const [height, setHeight] = useState(currentProfile.height);
  const [targetWeight, setTargetWeight] = useState(currentProfile.targetWeight);
  const [targetCalories, setTargetCalories] = useState(currentProfile.targetCalories);
  const [targetProtein, setTargetProtein] = useState(currentProfile.targetProtein);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    setApiKey(keyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(currentUserId, {
      name,
      nickname,
      height: Number(height),
      targetWeight: Number(targetWeight),
      targetCalories: Number(targetCalories),
      targetProtein: Number(targetProtein),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('האם אתה בטוח שברצונך לאפס את הנתונים להגדרות ברירת המחדל של המאמן?')) {
      localStorage.removeItem('fitcouple_data_v1');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-3.5 pt-2">
      {/* 1. Google AI Studio API Key Card */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              <Key className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">חיבור ל-Google AI Studio</h2>
              <p className="text-xs text-slate-400">מודל חכם: Gemini 3.8 Flash (High Mode)</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 px-3 py-1 rounded-full font-black flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3 fill-current" />
            מחובר ופעיל
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          מפתח ה-API שלכם מחובר ישירות ל-Gemini 3.8 Flash במצב חשיבה גבוהה (High). המאמן מנתח ארוחות לעומק ומספק עצות ביומכניות מקצועיות.
        </p>

        <form onSubmit={handleSaveKey} className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="הדבק כאן את מפתח ה-API של Google..."
              className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-4 py-3 text-base sm:text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute left-3.5 top-3.5 text-xs text-slate-400 hover:text-white"
            >
              {showKey ? 'הסתר' : 'הצג'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline font-medium"
            >
              <span>קבל מפתח חינמי מ-Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="submit"
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>שמור מפתח</span>
            </button>
          </div>

          {keySaved && (
            <p className="text-xs text-emerald-400 font-bold animate-pulse">
              מפתח ה-API נשמר בהצלחה!
            </p>
          )}
        </form>
      </div>

      {/* 2. Edit Profile Settings */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/[0.08] text-white flex items-center justify-center font-bold">
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">עריכת נתונים אישיים • {currentProfile.nickname}</h2>
            <p className="text-xs text-slate-400">משפיע על חישובי התזונה והתשובות של המאמן</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">שם מלא</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">כינוי באפליקציה</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">גובה (ס״מ)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">משקל יעד (ק״ג)</label>
              <input
                type="number"
                step="0.5"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">יעד קלוריות</label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">יעד חלבון (גרם)</label>
              <input
                type="number"
                value={targetProtein}
                onChange={(e) => setTargetProtein(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-base sm:text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xl active:scale-95 ${
                isBabzi
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>שמור נתונים</span>
            </button>
          </div>

          {profileSaved && (
            <p className="text-xs text-emerald-400 font-bold animate-pulse text-left">
              הנתונים של {nickname} עודכנו בהצלחה!
            </p>
          )}
        </form>
      </div>

      {/* 3. Reset Option */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 border-red-500/20 flex items-center justify-between shadow-xl">
        <div>
          <h3 className="text-xs font-black text-red-400">איפוס נתוני אימונים</h3>
          <p className="text-[11px] text-slate-400 font-medium">מאפס את הלוגים והארוחות לברירת המחדל של המאמן</p>
        </div>
        <button
          onClick={handleResetData}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>איפוס</span>
        </button>
      </div>
    </div>
  );
}
