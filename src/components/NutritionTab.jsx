import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeMealWithGemini } from '../services/geminiService';
import { Apple, Sparkles, Plus, Trash2, Utensils, Flame, Award, Zap, ChevronLeft } from 'lucide-react';

export function NutritionTab() {
  const {
    currentProfile,
    currentUserId,
    apiKey,
    nutritionLogs,
    addMealLog,
    deleteMealLog,
  } = useApp();

  const isBabzi = currentUserId === 'babzi';
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = nutritionLogs.filter((m) => m.date === today);

  // חישוב צריכה להיום
  const totalCaloriesToday = todayMeals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
  const totalProteinToday = todayMeals.reduce((sum, m) => sum + (Number(m.protein) || 0), 0);

  const calProgress = Math.min(100, Math.round((totalCaloriesToday / currentProfile.targetCalories) * 100));
  const proProgress = Math.min(100, Math.round((totalProteinToday / currentProfile.targetProtein) * 100));

  // טופס הזנה וניתוח
  const [mealType, setMealType] = useState('ארוחת צהריים');
  const [mealText, setMealText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const mealTypes = [
    { label: 'בוקר', emoji: '🍳' },
    { label: 'צהריים', emoji: '🥗' },
    { label: 'ערב', emoji: '🥩' },
    { label: 'נשנוש', emoji: '🍎' },
  ];

  const handleAnalyze = async () => {
    if (!mealText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeMealWithGemini({
        apiKey,
        profile: currentProfile,
        mealText,
        mealType,
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error('Meal analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = () => {
    if (!analysisResult) return;
    addMealLog({
      type: mealType,
      description: mealText,
      calories: analysisResult.estimatedCalories,
      protein: analysisResult.estimatedProtein,
      carbs: analysisResult.estimatedCarbs,
      fat: analysisResult.estimatedFat,
      score: analysisResult.healthScore,
      coachTip: analysisResult.tips,
    });
    setMealText('');
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-4 pb-24 max-w-3xl mx-auto px-3.5 pt-2">
      {/* 1. Daily Targets & Macro Dashboard */}
      <div className={`pro-card rounded-[28px] p-4 sm:p-5 transition-all ${
        isBabzi ? 'hover:pro-card-glow-rose' : 'hover:pro-card-glow-emerald'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Utensils className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">תזונה יומית • {currentProfile.nickname}</h2>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                  חיטוב
                </span>
              </div>
              <p className="text-xs text-slate-400">גירעון מתון + שמירה על השריר</p>
            </div>
          </div>
        </div>

        {/* Macro Progress Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Calories Card */}
          <div className="bg-slate-950/70 border border-white/[0.06] p-4 rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                קלוריות
              </span>
              <span className="font-mono font-black text-white">
                {totalCaloriesToday} <span className="text-slate-500 font-normal">/ {currentProfile.targetCalories}</span>
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-700 shadow-md shadow-amber-500/40"
                style={{ width: `${calProgress}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-2 font-medium flex justify-between">
              <span>נותרו להיום:</span>
              <span className="font-mono font-bold text-amber-300">
                {Math.max(0, currentProfile.targetCalories - totalCaloriesToday)} קק״ל
              </span>
            </div>
          </div>

          {/* Protein Card */}
          <div className="bg-slate-950/70 border border-white/[0.06] p-4 rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Apple className={`w-4 h-4 ${isBabzi ? 'text-rose-400 fill-rose-400/20' : 'text-emerald-400 fill-emerald-400/20'}`} />
                חלבון
              </span>
              <span className="font-mono font-black text-white">
                {totalProteinToday}ג׳ <span className="text-slate-500 font-normal">/ {currentProfile.targetProtein}ג׳</span>
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
              <div
                className={`h-full rounded-full transition-all duration-700 shadow-md ${
                  isBabzi
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-500/40'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/40'
                }`}
                style={{ width: `${proProgress}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-2 font-medium flex justify-between">
              <span>נותרו להיום:</span>
              <span className={`font-mono font-bold ${isBabzi ? 'text-rose-300' : 'text-emerald-300'}`}>
                {Math.max(0, currentProfile.targetProtein - totalProteinToday)} גרם
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Meal Analyzer Card */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>ספר למאמן מה אכלת (ניתוח AI מעמיק)</span>
          </h3>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 fill-current" />
            Gemini 3.8 High
          </span>
        </div>

        {/* Meal Type Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {mealTypes.map((item) => (
            <button
              key={item.label}
              onClick={() => setMealType(`ארוחת ${item.label}`)}
              className={`py-2 px-1 text-xs font-black rounded-2xl border transition-all duration-200 text-center flex items-center justify-center gap-1.5 active:scale-95 ${
                mealType.includes(item.label)
                  ? isBabzi
                    ? 'bg-rose-500/25 border-rose-500 text-white shadow-lg shadow-rose-500/15'
                    : 'bg-emerald-500/25 border-emerald-500 text-white shadow-lg shadow-emerald-500/15'
                  : 'bg-slate-950/60 border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Input */}
        <div>
          <textarea
            rows="3"
            value={mealText}
            onChange={(e) => setMealText(e.target.value)}
            placeholder="לדוגמה: 200 גרם חזה עוף על המחבת, כוס אורז בסמטי, סלט ירקות גדול עם עגבניה, מלפפון וכף טחינה גולמית..."
            className="w-full bg-slate-950/80 border border-white/[0.08] rounded-2xl p-3.5 text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !mealText.trim()}
          className={`w-full py-3.5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-xl active:scale-95 ${
            isAnalyzing || !mealText.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : isBabzi
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/25'
              : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 shadow-emerald-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'המאמן מנתח ומחשב ערכים לעומק...' : 'נתח קלוריות, חלבון וטיפים עם המאמן'}</span>
        </button>

        {/* AI Analysis Result Card */}
        {analysisResult && (
          <div className="bg-slate-950/90 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 space-y-4 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                ציון תזונתי: {analysisResult.healthScore} / 10
              </span>
              <span className="text-xs text-slate-300 font-bold bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                {mealType}
              </span>
            </div>

            {/* Macros summary */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-white/[0.06]">
                <div className="text-[10px] text-slate-400 font-medium">קלוריות</div>
                <div className="text-base font-black text-amber-400 font-mono">{analysisResult.estimatedCalories}</div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-white/[0.06]">
                <div className="text-[10px] text-slate-400 font-medium">חלבון</div>
                <div className="text-base font-black text-emerald-400 font-mono">{analysisResult.estimatedProtein}ג׳</div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-white/[0.06]">
                <div className="text-[10px] text-slate-400 font-medium">פחמימות</div>
                <div className="text-base font-black text-blue-400 font-mono">{analysisResult.estimatedCarbs || 0}ג׳</div>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-white/[0.06]">
                <div className="text-[10px] text-slate-400 font-medium">שומן</div>
                <div className="text-base font-black text-pink-400 font-mono">{analysisResult.estimatedFat || 0}ג׳</div>
              </div>
            </div>

            {/* Coach Summary & Tip */}
            {analysisResult.tips && (
              <div className="text-xs text-slate-200 bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-2xl leading-relaxed space-y-1">
                <div className="font-black text-emerald-300 flex items-center gap-1.5">
                  <span>💡 ניתוח המאמן:</span>
                </div>
                <p className="text-slate-300">{analysisResult.tips}</p>
              </div>
            )}

            {/* Save to Log */}
            <button
              onClick={handleSaveMeal}
              className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>שמור ארוחה זו ביומן שלי</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Today's Meals Timeline */}
      <div className="pro-card rounded-[28px] p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-black text-white flex items-center justify-between">
          <span>ארוחות שנרשמו היום ({todayMeals.length})</span>
          <span className="text-xs font-mono text-slate-400 font-bold">
            סה״כ: {totalCaloriesToday} קק״ל • {totalProteinToday}ג׳ חלבון
          </span>
        </h3>

        {todayMeals.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            עדיין לא רשמתם ארוחות להיום. ספרו למאמן למעלה מה אכלתם! 🥑
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-slate-950/70 border border-white/[0.05] p-3.5 rounded-2xl flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{meal.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{meal.time}</span>
                    {meal.score && (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.2 rounded-md font-bold">
                        ציון {meal.score}/10
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{meal.description}</p>
                  {meal.coachTip && (
                    <p className="text-[11px] text-emerald-400/90 font-medium">״{meal.coachTip}״</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-left font-mono">
                    <div className="text-xs font-black text-amber-400">{meal.calories} קק״ל</div>
                    <div className="text-[10px] font-bold text-emerald-400">{meal.protein}ג׳ חלבון</div>
                  </div>
                  <button
                    onClick={() => deleteMealLog(meal.id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors active:scale-90"
                    title="מחק ארוחה"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
