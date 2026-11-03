import React from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Flame, Apple, Bot, TrendingUp, Settings } from 'lucide-react';

export function Navigation() {
  const { currentTab, setCurrentTab, currentUserId } = useApp();
  const isBabzi = currentUserId === 'babzi';

  const navItems = [
    { id: 'workout', label: 'אימונים', icon: Dumbbell },
    { id: 'warmup', label: 'חימום & אירובי', icon: Flame },
    { id: 'nutrition', label: 'תזונה', icon: Apple },
    { id: 'coach', label: 'מאמן חכם', icon: Bot, isAi: true },
    { id: 'progress', label: 'מדדים', icon: TrendingUp },
    { id: 'settings', label: 'הגדרות', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Floating Bottom Bar (iPhone 16/17 Pro Optimized) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 pro-nav px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-300 active:scale-90 ${
                  isActive
                    ? isBabzi
                      ? 'text-rose-400 font-black'
                      : 'text-emerald-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? isBabzi
                        ? 'bg-rose-500/20 shadow-lg shadow-rose-500/25 scale-110'
                        : 'bg-emerald-500/20 shadow-lg shadow-emerald-500/25 scale-110'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {item.isAi && (
                    <span
                      className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                        isBabzi ? 'bg-rose-400' : 'bg-emerald-400'
                      } animate-ping`}
                    />
                  )}
                </div>
                <span className="text-[10px] mt-1 whitespace-nowrap tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Tabs Bar */}
      <div className="hidden md:flex justify-center max-w-4xl mx-auto px-4 mt-4">
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-white/[0.08] flex items-center gap-1.5 shadow-2xl backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  isActive
                    ? isBabzi
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
                <span>{item.label}</span>
                {item.isAi && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-black/25 text-white' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
