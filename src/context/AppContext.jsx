import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PROFILES, WORKOUT_DAYS } from '../data/initialData';
import { 
  syncStateToCloud, 
  listenToCloudSync, 
  isFirebaseActive, 
  saveFirebaseConfig,
  getFirebaseConfig 
} from '../services/firebase';

const AppContext = createContext();

const STORAGE_KEY = 'fitcouple_data_v1';
const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export function AppProvider({ children }) {
  // טעינת נתונים שמורים מ-localStorage
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.apiKey) {
          parsed.apiKey = DEFAULT_API_KEY;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
    return {
      profiles: INITIAL_PROFILES,
      currentUserId: 'avraham',
      apiKey: DEFAULT_API_KEY,
      workoutLogs: {},
      nutritionLogs: [],
      weightLogs: [
        { id: 'w1', userId: 'avraham', date: '2026-10-20', weight: 57.8 },
        { id: 'w2', userId: 'avraham', date: '2026-11-03', weight: 57.0 },
        { id: 'w3', userId: 'babzi', date: '2026-10-20', weight: 86.2 },
        { id: 'w4', userId: 'babzi', date: '2026-11-03', weight: 85.0 },
      ],
      cardioLogs: [
        { id: 'c1', userId: 'avraham', date: '2026-11-01', durationMin: 25 },
        { id: 'c2', userId: 'babzi', date: '2026-11-02', durationMin: 25 },
      ],
      chatMessages: {
        avraham: [
          {
            id: 'm1',
            role: 'model',
            text: 'אהלן אברהם! המאמן שלך כאן. היום ממשיכים בתוכנית חיטוב וירידה במשקל. איך אתה מרגיש? מוכן לקרוע את האימון?',
            timestamp: new Date().toISOString(),
          },
        ],
        babzi: [
          {
            id: 'm2',
            role: 'model',
            text: 'היי באבזי אלופה! ❤️ המאמן האישי שלך כאן כדי ללוות אותך צעד אחר צעד לחיטוב. איך האנרגיות היום?',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    };
  });

  const [currentTab, setCurrentTab] = useState('workout'); // workout, warmup, nutrition, coach, progress, settings
  const [activeDayId, setActiveDayId] = useState('day-a');

  // טיימר מנוחה גלובלי
  const [timerRemaining, setTimerRemaining] = useState(null);
  const [timerTotal, setTimerTotal] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [isCloudActive, setIsCloudActive] = useState(() => isFirebaseActive());
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // האזנה לסנכרון ענן בזמן אמת מ-Firebase
  useEffect(() => {
    const unsubscribe = listenToCloudSync((cloudData) => {
      if (cloudData) {
        setData((prev) => ({
          ...prev,
          profiles: cloudData.profiles || prev.profiles,
          workoutLogs: cloudData.workoutLogs || prev.workoutLogs,
          nutritionLogs: cloudData.nutritionLogs || prev.nutritionLogs,
          weightLogs: cloudData.weightLogs || prev.weightLogs,
          cardioLogs: cloudData.cardioLogs || prev.cardioLogs,
          chatMessages: cloudData.chatMessages || prev.chatMessages,
        }));
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    });

    setIsCloudActive(isFirebaseActive());
    return () => unsubscribe();
  }, []);

  // שמירה ל-localStorage וסנכרון מיידי ל-Firebase
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (isFirebaseActive()) {
        syncStateToCloud({
          profiles: data.profiles,
          workoutLogs: data.workoutLogs,
          nutritionLogs: data.nutritionLogs,
          weightLogs: data.weightLogs,
          cardioLogs: data.cardioLogs,
          chatMessages: data.chatMessages,
        }).then((ok) => {
          if (ok) {
            setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        });
      }
    } catch (e) {
      console.error('Failed to save/sync storage:', e);
    }
  }, [data]);

  // שעון עצר למנוחה
  useEffect(() => {
    let interval = null;
    if (timerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            // צפצוף קל אם נתמך
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(800, audioCtx.currentTime);
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.3);
            } catch (err) {
              // ignore audio error
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerRemaining]);

  const currentProfile = data.profiles[data.currentUserId] || INITIAL_PROFILES.avraham;

  const getTodayKey = (dayId = activeDayId) => {
    const today = new Date().toISOString().split('T')[0];
    return `${today}_${data.currentUserId}_${dayId}`;
  };

  const currentWorkoutLog = data.workoutLogs[getTodayKey()] || {
    completedSets: {},
    weights: {},
    reps: {},
    finished: false,
  };

  // פעולות
  const switchUser = (userId) => {
    setData((prev) => ({ ...prev, currentUserId: userId }));
  };

  const updateProfile = (userId, updatedFields) => {
    setData((prev) => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [userId]: { ...prev.profiles[userId], ...updatedFields },
      },
    }));
  };

  const setApiKey = (key) => {
    setData((prev) => ({ ...prev, apiKey: key.trim() }));
  };

  const toggleSet = (exerciseId, setIndex, defaultWeight = 0, defaultReps = '10') => {
    const key = getTodayKey();
    const current = data.workoutLogs[key] || { completedSets: {}, weights: {}, reps: {}, finished: false };
    const exSets = current.completedSets[exerciseId] || [];
    const isCompleted = exSets.includes(setIndex);

    const newSets = isCompleted
      ? exSets.filter((i) => i !== setIndex)
      : [...exSets, setIndex];

    const weightKey = `${exerciseId}_${setIndex}`;
    const newWeights = { ...current.weights };
    if (!newWeights[weightKey]) {
      newWeights[weightKey] = defaultWeight;
    }

    const repsKey = `${exerciseId}_${setIndex}`;
    const newReps = { ...current.reps };
    if (!newReps[repsKey]) {
      newReps[repsKey] = defaultReps;
    }

    setData((prev) => ({
      ...prev,
      workoutLogs: {
        ...prev.workoutLogs,
        [key]: {
          ...current,
          completedSets: {
            ...current.completedSets,
            [exerciseId]: newSets,
          },
          weights: newWeights,
          reps: newReps,
        },
      },
    }));

    // הפעלת טיימר מנוחה אם הסט סומן כהושלם
    if (!isCompleted) {
      startRestTimer(90);
    }
  };

  const updateSetWeight = (exerciseId, setIndex, weight) => {
    const key = getTodayKey();
    const current = data.workoutLogs[key] || { completedSets: {}, weights: {}, reps: {}, finished: false };
    setData((prev) => ({
      ...prev,
      workoutLogs: {
        ...prev.workoutLogs,
        [key]: {
          ...current,
          weights: {
            ...current.weights,
            [`${exerciseId}_${setIndex}`]: weight,
          },
        },
      },
    }));
  };

  const updateSetReps = (exerciseId, setIndex, reps) => {
    const key = getTodayKey();
    const current = data.workoutLogs[key] || { completedSets: {}, weights: {}, reps: {}, finished: false };
    setData((prev) => ({
      ...prev,
      workoutLogs: {
        ...prev.workoutLogs,
        [key]: {
          ...current,
          reps: {
            ...current.reps,
            [`${exerciseId}_${setIndex}`]: reps,
          },
        },
      },
    }));
  };

  const finishWorkout = (dayId) => {
    const key = getTodayKey(dayId);
    const current = data.workoutLogs[key] || { completedSets: {}, weights: {}, reps: {}, finished: false };
    setData((prev) => ({
      ...prev,
      workoutLogs: {
        ...prev.workoutLogs,
        [key]: {
          ...current,
          finished: true,
          finishedAt: new Date().toISOString(),
        },
      },
    }));
  };

  const startRestTimer = (seconds = 90) => {
    setTimerTotal(seconds);
    setTimerRemaining(seconds);
    setTimerActive(true);
  };

  const stopRestTimer = () => {
    setTimerActive(false);
    setTimerRemaining(null);
  };

  const addMealLog = (meal) => {
    const newLog = {
      id: 'meal_' + Date.now(),
      userId: data.currentUserId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...meal,
    };
    setData((prev) => ({
      ...prev,
      nutritionLogs: [newLog, ...prev.nutritionLogs],
    }));
  };

  const deleteMealLog = (id) => {
    setData((prev) => ({
      ...prev,
      nutritionLogs: prev.nutritionLogs.filter((m) => m.id !== id),
    }));
  };

  const addWeightLog = (weight) => {
    const parsedWeight = parseFloat(weight);
    if (!parsedWeight || isNaN(parsedWeight)) return;

    const newLog = {
      id: 'weight_' + Date.now(),
      userId: data.currentUserId,
      date: new Date().toISOString().split('T')[0],
      weight: parsedWeight,
    };

    setData((prev) => ({
      ...prev,
      weightLogs: [newLog, ...prev.weightLogs],
      profiles: {
        ...prev.profiles,
        [data.currentUserId]: {
          ...prev.profiles[data.currentUserId],
          currentWeight: parsedWeight,
        },
      },
    }));
  };

  const addCardioLog = (durationMin = 25, notes = '') => {
    const newLog = {
      id: 'cardio_' + Date.now(),
      userId: data.currentUserId,
      date: new Date().toISOString().split('T')[0],
      durationMin,
      notes,
    };
    setData((prev) => ({
      ...prev,
      cardioLogs: [newLog, ...prev.cardioLogs],
    }));
  };

  const addChatMessage = (role, text, tokens = null) => {
    const user = data.currentUserId;
    const msg = {
      id: 'msg_' + Date.now(),
      role,
      text,
      tokens,
      timestamp: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      chatMessages: {
        ...prev.chatMessages,
        [user]: [...(prev.chatMessages[user] || []), msg],
      },
    }));
  };

  const clearChat = () => {
    const user = data.currentUserId;
    setData((prev) => ({
      ...prev,
      chatMessages: {
        ...prev.chatMessages,
        [user]: [],
      },
    }));
  };

  const updateCloudConfig = (config) => {
    saveFirebaseConfig(config);
    setIsCloudActive(isFirebaseActive());
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        profiles: data.profiles,
        currentUserId: data.currentUserId,
        currentProfile,
        apiKey: data.apiKey,
        isCloudActive,
        lastSyncTime,
        updateCloudConfig,
        activeDayId,
        setActiveDayId,
        currentTab,
        setCurrentTab,
        currentWorkoutLog,
        workoutLogs: data.workoutLogs,
        nutritionLogs: data.nutritionLogs.filter((m) => m.userId === data.currentUserId),
        weightLogs: data.weightLogs.filter((w) => w.userId === data.currentUserId),
        cardioLogs: data.cardioLogs.filter((c) => c.userId === data.currentUserId),
        chatMessages: data.chatMessages[data.currentUserId] || [],
        timerRemaining,
        timerTotal,
        timerActive,
        switchUser,
        updateProfile,
        setApiKey,
        toggleSet,
        updateSetWeight,
        updateSetReps,
        finishWorkout,
        startRestTimer,
        stopRestTimer,
        addMealLog,
        deleteMealLog,
        addWeightLog,
        addCardioLog,
        addChatMessage,
        clearChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

