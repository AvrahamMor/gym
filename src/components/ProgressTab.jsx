import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Scale, Target, Trophy, Plus, Calendar, ArrowDown, ArrowUp, Activity } from 'lucide-react';

export function ProgressTab() {
  const {
    currentProfile,
    currentUserId,
    weightLogs,
    addWeightLog,
    workoutLogs,
    cardioLogs,
  } = useApp();

  const isBabzi = currentUserId === 'babzi';
  const [newWeightInput, setNewWeightInput] = useState('');

  // חישוב BMI
  const heightMeters = currentProfile.height / 100;
  const bmi = (currentProfile.currentWeight / (heightMeters * heightMeters)).toFixed(1);

  const getBmiStatus = (bmiVal) => {
    const val = parseFloat(bmiVal);
    if (val < 18.5) return { text: 'תת משקל', color: 'text-blue-400' };
    if (val < 25) return { text: 'משקל תקין ובריא', color: 'text-emerald-400' };
    if (val < 30) return { text: 'עודף משקל קל', color: 'text-amber-400' };
    return { text: 'עודף משקל (בירידה!)', color: 'text-orange-400' };
  };

  const bmiStatus = getBmiStatus(bmi);

  const sortedLogs = [...weightLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const oldestLog = sortedLogs[sortedLogs.length - 1];
  const initialWeight = oldestLog ? oldestLog.weight : currentProfile.currentWeight;
  const totalChange = (currentProfile.currentWeight - initialWeight).toFixed(1);
  const remainingToGoal = (currentProfile.currentWeight - currentProfile.targetWeight).toFixed(1);

  const completedWorkoutsCount = Object.values(workoutLogs).filter(
    (log) => log.finished
  ).length;

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!newWeightInput) return;
    addWeightLog(newWeightInput);
    setNewWeightInput('');
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-3.5 pt-2">
      {/* 1. Main Overview Card */}
      <div className={`pro-card rounded-[28px] p-4 sm:p-5 transition-all ${
        isBabzi ? 'hover:pro-card-glow-rose' : 'hover:pro-card-glow-emerald'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">מדדי גוף ושקילות • {currentProfile.nickname}</h2>
              <p className="text-xs text-slate-400">גובה: {currentProfile.height} ס״מ • יעד: {currentProfile.goal}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          {/* Current Weight */}
          <div className="bg-slate-950/70 border border-white/[0.06] p-3.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">משקל נוכחי</span>
            <div className="text-2xl font-black text-white font-mono">
              {currentProfile.currentWeight} <span className="text-xs font-normal">ק״ג</span>
            </div>
          </div>

          {/* Target Weight */}
          <div className="bg-slate-950/70 border border-white/[0.06] p-3.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">משקל יעד</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {currentProfile.targetWeight} <span className="text-xs font-normal">ק״ג</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">עוד {remainingToGoal} ק״ג</span>
          </div>

          {/* Total Change */}
          <div className="bg-slate-950/70 border border-white/[0.06] p-3.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">שינוי מצטבר</span>
            <div
              className={`text-2xl font-black font-mono flex items-center justify-center gap-0.5 ${
                Number(totalChange) <= 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {Number(totalChange) <= 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              {Math.abs(totalChange)} <span className="text-xs font-normal">ק״ג</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">מתחילת התוכנית</span>
          </div>

          {/* BMI */}
          <div className="bg-slate-950/70 border border-white/[0.06] p-3.5 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5 font-medium">מדד BMI</span>
            <div className="text-2xl font-black text-white font-mono">{bmi}</div>
            <span className={`text-[10px] font-black ${bmiStatus.color}`}>
              {bmiStatus.text}
            </span>
          </div>
        </div>

        {/* Quick Weight Entry Form */}
        <form onSubmit={handleAddWeight} className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <div className="relative flex-1">
            <Scale className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="number"
              step="0.1"
              value={newWeightInput}
              onChange={(e) => setNewWeightInput(e.target.value)}
              placeholder="הזן שקילה חדשה (לדוגמה: 56.5)..."
              className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl pr-10 pl-3 py-3 text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!newWeightInput}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 shadow-xl active:scale-95 ${
              !newWeightInput
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isBabzi
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>עדכן משקל</span>
          </button>
        </form>
      </div>

      {/* 2. Milestones Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="pro-card rounded-[28px] p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Trophy className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-xl font-black text-white font-mono">{completedWorkoutsCount}</div>
            <div className="text-xs text-slate-400 font-medium">אימוני כוח שהושלמו</div>
          </div>
        </div>

        <div className="pro-card rounded-[28px] p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl font-black text-white font-mono">{cardioLogs.length}</div>
            <div className="text-xs text-slate-400 font-medium">אימוני אירובי (25 דק׳)</div>
          </div>
        </div>
      </div>

      {/* 3. Weight History Log */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-black text-white flex items-center justify-between">
          <span>היסטוריית שקילות ({sortedLogs.length})</span>
          <span className="text-xs text-slate-400 font-medium">מומלץ להישקל פעם בשבוע בבוקר</span>
        </h3>

        <div className="space-y-2">
          {sortedLogs.map((log, index) => {
            const nextLog = sortedLogs[index + 1];
            const diff = nextLog ? (log.weight - nextLog.weight).toFixed(1) : null;

            return (
              <div
                key={log.id}
                className="bg-slate-950/70 border border-white/[0.05] p-3.5 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-slate-300 text-xs font-black flex items-center justify-center border border-white/[0.06]">
                    #{sortedLogs.length - index}
                  </span>
                  <div>
                    <div className="text-sm font-black text-white font-mono">{log.weight} ק״ג</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.date}</div>
                  </div>
                </div>

                {diff !== null && (
                  <div
                    className={`text-xs font-black font-mono flex items-center gap-1 ${
                      Number(diff) <= 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {Number(diff) <= 0 ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                    {Math.abs(diff)} ק״ג
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
