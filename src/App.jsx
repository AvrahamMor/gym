import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WorkoutTab } from './components/WorkoutTab';
import { WarmupTab } from './components/WarmupTab';
import { NutritionTab } from './components/NutritionTab';
import { CoachChatTab } from './components/CoachChatTab';
import { ProgressTab } from './components/ProgressTab';
import { SettingsTab } from './components/SettingsTab';

function MainContent() {
  const { currentTab } = useApp();

  return (
    <main className="flex-1 pb-[calc(env(safe-area-inset-bottom,16px)+72px)] md:pb-12">
      {currentTab === 'workout' && <WorkoutTab />}
      {currentTab === 'warmup' && <WarmupTab />}
      {currentTab === 'nutrition' && <NutritionTab />}
      {currentTab === 'coach' && <CoachChatTab />}
      {currentTab === 'progress' && <ProgressTab />}
      {currentTab === 'settings' && <SettingsTab />}
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
        <Header />
        <Navigation />
        <MainContent />
      </div>
    </AppProvider>
  );
}
