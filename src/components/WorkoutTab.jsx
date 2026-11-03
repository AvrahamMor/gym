import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WORKOUT_DAYS } from '../data/initialData';
import { 
  Check, 
  Dumbbell, 
  Info, 
  Trophy, 
  Flame, 
  Plus, 
  Minus, 
  Timer, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function WorkoutTab() {
  const {
    activeDayId,
    setActiveDayId,
    currentProfile,
    currentUserId,
    currentWorkoutLog,
    toggleSet,
    updateSetWeight,
    updateSetReps,
    finishWorkout,
    startRestTimer,
    setCurrentTab,
  } = useApp();

  const isBabzi = currentUserId === 'babzi';
  const activeDay = WORKOUT_DAYS.find((d) => d.id === activeDayId) || WORKOUT_DAYS[0];

  const [expandedTip, setExpandedTip] = useState(null);
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  // חישוב התקדמות האימון הנוכחי
  const totalSets = activeDay.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSetsCount = activeDay.exercises.reduce((sum, ex) => {
    const done = currentWorkoutLog.completedSets?.[ex.id] || [];
    return sum + done.length;
  }, 0);
  const progressPercent = Math.round((completedSetsCount / totalSets) * 100);

  const handleFinish = () => {
    finishWorkout(activeDay.id);
    setShowFinishedModal(true);
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-3.5 pt-2">
      {/* 1. Day Selector (Apple Segmented Control Style) */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950/80 border border-white/[0.08] rounded-3xl shadow-inner backdrop-blur-xl">
        {WORKOUT_DAYS.map((day) => {
          const isSelected = activeDayId === day.id;
          return (
            <button
              key={day.id}
              onClick={() => setActiveDayId(day.id)}
              className={`relative py-3 px-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center active:scale-95 ${
                isSelected
                  ? isBabzi
                    ? 'bg-gradient-to-b from-rose-500/25 to-rose-600/30 border border-rose-500/60 shadow-lg shadow-rose-500/20'
                    : 'bg-gradient-to-b from-emerald-500/25 to-emerald-600/30 border border-emerald-500/60 shadow-lg shadow-emerald-500/20'
                  : 'hover:bg-slate-900/60 border border-transparent text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={`w-5 h-5 rounded-lg text-[11px] font-black flex items-center justify-center ${
                    isSelected
                      ? isBabzi
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {day.code}
                </span>
                <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {day.shortName}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{day.exercises.length} תרגילים</span>
            </button>
          );
        })}
      </div>

      {/* 2. Warmup & Workout Progress Overview Card */}
      <div className={`pro-card rounded-[28px] p-4 sm:p-5 transition-all ${
        isBabzi ? 'hover:pro-card-glow-rose' : 'hover:pro-card-glow-emerald'
      }`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">אימון מפוצל</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-bold">
                {activeDay.code}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">{activeDay.name}</h2>
            <p className="text-xs text-slate-400">{activeDay.focus}</p>
          </div>

          {/* Radial / Stat Counter */}
          <div className="text-left bg-slate-950/60 border border-white/[0.06] px-3.5 py-2 rounded-2xl shrink-0">
            <span className="text-[10px] text-slate-400 block font-medium">סטים שהושלמו</span>
            <div className="text-sm font-black text-white font-mono flex items-baseline gap-1">
              <span>{completedSetsCount}</span>
              <span className="text-slate-500 text-xs">/ {totalSets}</span>
              <span className={`mr-1 text-xs ${isBabzi ? 'text-rose-400' : 'text-emerald-400'}`}>
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950/80 h-3 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isBabzi
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 shadow-lg shadow-rose-500/50'
                : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/50'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Warmup Link Banner */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Flame className="w-4 h-4 fill-amber-400/20" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">10 דק׳ חימום יומי של המאמן</div>
              <div className="text-[10px] text-slate-400">5 דק׳ הליכה (6) • 2 דק׳ ריצה (9) • 3 דק׳ הליכה (5)</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('warmup')}
            className="text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl shrink-0 transition-colors shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1"
          >
            <span>טיימר</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>

      {/* 3. Exercises List */}
      <div className="space-y-3.5">
        {activeDay.exercises.map((exercise, exIndex) => {
          const completedSets = currentWorkoutLog.completedSets?.[exercise.id] || [];
          const isAllDone = completedSets.length === exercise.sets;
          const isTipOpen = expandedTip === exercise.id;

          return (
            <div
              key={exercise.id}
              className={`pro-card rounded-[26px] transition-all duration-300 ${
                isAllDone
                  ? 'border-emerald-500/30 opacity-95 bg-slate-900/60'
                  : 'hover:border-white/[0.14]'
              }`}
            >
              {/* Exercise Header */}
              <div className="p-4 border-b border-white/[0.06]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 border ${
                        isAllDone
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-800/80 text-slate-300 border-white/[0.06]'
                      }`}
                    >
                      {exIndex + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        {exercise.name}
                        {isAllDone && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-md font-bold">
                            הושלם ✓
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-300 bg-slate-800/90 px-2.5 py-0.5 rounded-full border border-white/[0.06] font-medium">
                          {exercise.muscle}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {exercise.sets} סטים × {exercise.reps} חזרות
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rest Timer Button */}
                  <button
                    onClick={() => startRestTimer(exercise.restSec || 90)}
                    className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-white/[0.08] px-2.5 py-1.5 rounded-xl transition-all active:scale-95 shrink-0"
                    title="הפעל טיימר מנוחה"
                  >
                    <Timer className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exercise.restSec || 90}ש׳ מנוחה</span>
                  </button>
                </div>

                {/* Trainer Technique Accordion */}
                {exercise.tip && (
                  <div className="mt-3">
                    <button
                      onClick={() => setExpandedTip(isTipOpen ? null : exercise.id)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span>דגשי מאמן לביצוע נכון</span>
                      {isTipOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {isTipOpen && (
                      <div className="mt-2 text-xs text-slate-200 bg-blue-950/30 border border-blue-500/25 p-3 rounded-2xl leading-relaxed animate-fadeIn">
                        💡 <span className="font-bold text-blue-300">הנחיית המאמן:</span> {exercise.tip}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sets Table */}
              <div className="p-3 space-y-2">
                {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                  const setNum = setIdx + 1;
                  const isDone = completedSets.includes(setIdx);
                  const weightKey = `${exercise.id}_${setIdx}`;
                  const repsKey = `${exercise.id}_${setIdx}`;
                  const currentWeight = currentWorkoutLog.weights?.[weightKey] ?? exercise.defaultWeight;
                  const currentReps = currentWorkoutLog.reps?.[repsKey] ?? exercise.reps;

                  return (
                    <div
                      key={setIdx}
                      className={`flex items-center justify-between gap-2 p-2.5 rounded-2xl transition-all duration-200 ${
                        isDone
                          ? isBabzi
                            ? 'bg-rose-500/15 border border-rose-500/40'
                            : 'bg-emerald-500/15 border border-emerald-500/40'
                          : 'bg-slate-950/60 hover:bg-slate-950/90 border border-white/[0.04]'
                      }`}
                    >
                      {/* Set Number */}
                      <span className="text-xs font-extrabold text-slate-300 w-12 text-center font-mono">
                        סט {setNum}
                      </span>

                      {/* Weight Selector */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-1.5 rounded-xl border border-white/[0.08]">
                        <span className="text-[10px] text-slate-400 font-medium">ק״ג:</span>
                        <button
                          onClick={() =>
                            updateSetWeight(exercise.id, setIdx, Math.max(0, (Number(currentWeight) || 0) - 2.5))
                          }
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          value={currentWeight}
                          onChange={(e) => updateSetWeight(exercise.id, setIdx, parseFloat(e.target.value) || 0)}
                          className="w-12 text-center bg-transparent text-sm font-black text-white focus:outline-none font-mono"
                        />
                        <button
                          onClick={() =>
                            updateSetWeight(exercise.id, setIdx, (Number(currentWeight) || 0) + 2.5)
                          }
                          className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs active:scale-90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Reps Selector */}
                      <div className="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1.5 rounded-xl border border-white/[0.08]">
                        <span className="text-[10px] text-slate-400 font-medium">חז׳:</span>
                        <input
                          type="text"
                          value={currentReps}
                          onChange={(e) => updateSetReps(exercise.id, setIdx, e.target.value)}
                          className="w-10 text-center bg-transparent text-sm font-black text-white focus:outline-none font-mono"
                        />
                      </div>

                      {/* Complete Checkbox */}
                      <button
                        onClick={() => toggleSet(exercise.id, setIdx, exercise.defaultWeight, exercise.reps)}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 shadow-md ${
                          isDone
                            ? isBabzi
                              ? 'bg-rose-500 text-white shadow-rose-500/40 scale-105'
                              : 'bg-emerald-400 text-slate-950 shadow-emerald-500/40 scale-105'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-white/[0.06]'
                        }`}
                        title={isDone ? 'סומן כהושלם (לחץ לביטול)' : 'סמן כהושלם'}
                      >
                        <Check className={`w-5 h-5 ${isDone ? 'stroke-[3.5]' : 'opacity-40 stroke-[2]'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Finish Workout Action Button */}
      <div className="pt-3">
        <button
          onClick={handleFinish}
          className={`w-full py-4 rounded-3xl font-black text-sm transition-all duration-300 shadow-2xl flex items-center justify-center gap-2.5 active:scale-95 ${
            isBabzi
              ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 text-white shadow-rose-500/30 hover:brightness-110'
              : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-slate-950 shadow-emerald-500/30 hover:brightness-110'
          }`}
        >
          <Trophy className="w-5 h-5 stroke-[2.5]" />
          <span>סיום אימון {activeDay.name}</span>
        </button>
      </div>

      {/* Finished Celebration Modal */}
      {showFinishedModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="pro-card rounded-[32px] max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border-white/[0.12] animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
              🏆
            </div>
            <h3 className="text-xl font-black text-white">אלופים! אימון מעולה!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentProfile.nickname}, סיימת את אימון {activeDay.shortName}! עמדת בסטים ובחזרות. עכשיו לא לשכוח לשתות מים, להשלים חלבון ולשמור על התאוששות.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowFinishedModal(false);
                  setCurrentTab('coach');
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/[0.08]"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>שאל את מאמן ה-AI מה לאכול עכשיו</span>
              </button>
              <button
                onClick={() => setShowFinishedModal(false)}
                className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20"
              >
                סגור וחזור לאפליקציה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
