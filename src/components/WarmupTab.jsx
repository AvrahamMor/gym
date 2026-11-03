import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WARMUP_PLAN, CARDIO_PLAN } from '../data/initialData';
import { Play, Pause, RotateCcw, SkipForward, Flame, Activity, CheckCircle, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export function WarmupTab() {
  const { currentProfile, currentUserId, cardioLogs, addCardioLog } = useApp();
  const isBabzi = currentUserId === 'babzi';

  // Warmup Timer State
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(WARMUP_PLAN.phases[0].durationSec);
  const [isWarmupRunning, setIsWarmupRunning] = useState(false);

  // Cardio Timer State
  const [cardioSecondsLeft, setCardioSecondsLeft] = useState(25 * 60);
  const [isCardioRunning, setIsCardioRunning] = useState(false);
  const [cardioNotes, setCardioNotes] = useState('הליכון במכון');
  const [cardioLoggedToday, setCardioLoggedToday] = useState(false);

  const activePhase = WARMUP_PLAN.phases[currentPhaseIndex];

  // Warmup timer effect
  useEffect(() => {
    let interval = null;
    if (isWarmupRunning && phaseSecondsLeft > 0) {
      interval = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.frequency.setValueAtTime(600, audioCtx.currentTime);
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.4);
            } catch (e) {}

            if (currentPhaseIndex < WARMUP_PLAN.phases.length - 1) {
              const nextIndex = currentPhaseIndex + 1;
              setCurrentPhaseIndex(nextIndex);
              return WARMUP_PLAN.phases[nextIndex].durationSec;
            } else {
              setIsWarmupRunning(false);
              confetti({ particleCount: 90, spread: 60 });
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWarmupRunning, phaseSecondsLeft, currentPhaseIndex]);

  // Cardio timer effect
  useEffect(() => {
    let interval = null;
    if (isCardioRunning && cardioSecondsLeft > 0) {
      interval = setInterval(() => {
        setCardioSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsCardioRunning(false);
            confetti({ particleCount: 110, spread: 70 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCardioRunning, cardioSecondsLeft]);

  const resetWarmup = () => {
    setIsWarmupRunning(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(WARMUP_PLAN.phases[0].durationSec);
  };

  const skipWarmupPhase = () => {
    if (currentPhaseIndex < WARMUP_PLAN.phases.length - 1) {
      const nextIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIndex);
      setPhaseSecondsLeft(WARMUP_PLAN.phases[nextIndex].durationSec);
    } else {
      setIsWarmupRunning(false);
      setPhaseSecondsLeft(0);
    }
  };

  const handleLogCardio = () => {
    addCardioLog(25, cardioNotes);
    setCardioLoggedToday(true);
    confetti({ particleCount: 80, spread: 50 });
  };

  const currentWeekCardioCount = cardioLogs.length;

  const formatMinSec = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-3.5 pt-2">
      {/* 1. Warmup Protocol Card */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/15">
              <Flame className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">חימום יומי של המאמן (10 דקות)</h2>
              <p className="text-xs text-slate-400">חובה לפני כל אימון כוח להזרמת דם ומניעת פציעות</p>
            </div>
          </div>
          <span className="text-xs font-mono font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
            שלב {currentPhaseIndex + 1} / 3
          </span>
        </div>

        {/* 3 Phases Badges */}
        <div className="grid grid-cols-3 gap-2">
          {WARMUP_PLAN.phases.map((phase, idx) => {
            const isCurrent = currentPhaseIndex === idx;
            const isDone = currentPhaseIndex > idx || (isCurrent && phaseSecondsLeft === 0);

            return (
              <div
                key={phase.id}
                onClick={() => {
                  setCurrentPhaseIndex(idx);
                  setPhaseSecondsLeft(phase.durationSec);
                }}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition-all duration-300 ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/15 scale-102'
                    : isDone
                    ? 'bg-slate-900/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-950/60 border-white/[0.05] text-slate-400 hover:border-white/[0.1]'
                }`}
              >
                <div className="text-[11px] font-bold">{phase.title}</div>
                <div className="text-sm font-black mt-0.5 font-mono">קצב {phase.speed}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {Math.round(phase.durationSec / 60)} דקות
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Phase Countdown Box */}
        <div className="bg-slate-950/80 border border-white/[0.08] rounded-3xl p-6 text-center space-y-3.5 shadow-2xl">
          <div className="inline-block bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs px-3.5 py-1 rounded-full font-black">
            {activePhase.title} • קצב {activePhase.speed}
          </div>

          <div className="font-mono text-5xl sm:text-6xl font-black text-white tracking-widest drop-shadow-lg">
            {formatMinSec(phaseSecondsLeft)}
          </div>

          <p className="text-xs text-slate-300 max-w-sm mx-auto font-medium">{activePhase.notes}</p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsWarmupRunning(!isWarmupRunning)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl text-sm transition-all shadow-xl shadow-amber-500/25 active:scale-95"
            >
              {isWarmupRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isWarmupRunning ? 'השהה' : 'התחל חימום'}</span>
            </button>

            <button
              onClick={skipWarmupPhase}
              className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-200 rounded-2xl transition-colors active:scale-90"
              title="שלב הבא"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={resetWarmup}
              className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-200 rounded-2xl transition-colors active:scale-90"
              title="איפוס"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cardio Protocol Card */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/15">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">אירובי שבועי: 25 דקות</h2>
              <p className="text-xs text-slate-400">מינימום 3 פעמים בשבוע (הליכון בשיפוע, ריצה או אליפטיקל)</p>
            </div>
          </div>
          <div className="text-left bg-slate-950/60 border border-white/[0.06] px-3 py-1.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-medium block">יעד שבועי</span>
            <div className="text-xs font-black text-emerald-400 font-mono">
              {currentWeekCardioCount} / 3 אימונים
            </div>
          </div>
        </div>

        {/* Weekly Cardio Progress Indicators */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((num) => {
            const isCompleted = num <= currentWeekCardioCount;
            return (
              <div
                key={num}
                className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-black transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-white/[0.05] text-slate-500'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-700'}`} />
                <span>אימון {num}</span>
              </div>
            );
          })}
        </div>

        {/* Cardio Live Timer & Quick Log */}
        <div className="bg-slate-950/80 border border-white/[0.08] rounded-3xl p-6 text-center space-y-3.5 shadow-2xl">
          <div className="text-xs text-slate-400 font-medium">טיימר אירובי 25 דקות</div>
          <div className="font-mono text-5xl sm:text-6xl font-black text-white tracking-widest drop-shadow-lg">
            {formatMinSec(cardioSecondsLeft)}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsCardioRunning(!isCardioRunning)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
            >
              {isCardioRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isCardioRunning ? 'השהה טיימר' : 'התחל אירובי'}</span>
            </button>

            <button
              onClick={() => {
                setIsCardioRunning(false);
                setCardioSecondsLeft(25 * 60);
              }}
              className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-200 rounded-2xl transition-colors active:scale-90"
              title="איפוס טיימר"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Log Form */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="סוג האירובי (למשל: הליכון בשיפוע, אופניים, ריצה בפארק)"
              value={cardioNotes}
              onChange={(e) => setCardioNotes(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/[0.08] rounded-2xl px-4 py-3 text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleLogCardio}
              className="w-full sm:w-auto shrink-0 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 px-5 py-3 rounded-2xl text-xs font-black transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>רשום 25 דק׳ שהושלמו</span>
            </button>
          </div>

          {cardioLoggedToday && (
            <p className="text-xs text-emerald-400 font-bold animate-pulse">
              אימון האירובי נרשם בהצלחה בהיסטוריה השבועית שלך! 🔥
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
