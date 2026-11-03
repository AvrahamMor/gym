// שירות תקשורת מתקדם עם Google AI Studio - Gemini 3.8 Flash (High Intelligence)

const GEMINI_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash';

/**
 * קריאה ל-Gemini API במצב חשיבה גבוהה ומקצועית (High Intelligence)
 */
async function callGemini(apiKey, systemInstruction, prompt, chatHistory = [], maxOutput = 1200) {
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  // היסטוריית שיחה עשירה (עד 6 חילופי דברים כדי לשמור על רציפות והבנה עמוקה)
  const contents = [];

  if (chatHistory && chatHistory.length > 0) {
    chatHistory.slice(-6).forEach((msg) => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: maxOutput,
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 400) {
        const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${FALLBACK_MODEL}:generateContent?key=${apiKey}`;
        const fallbackRes = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (fallbackRes.ok) {
          const fbData = await fallbackRes.json();
          return {
            text: fbData?.candidates?.[0]?.content?.parts?.[0]?.text || '',
            tokens: fbData?.usageMetadata?.totalTokenCount || 0,
          };
        }
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `שגיאת שרת (${res.status})`);
    }

    const data = await res.json();
    return {
      text: data?.candidates?.[0]?.content?.parts?.[0]?.text || '',
      tokens: data?.usageMetadata?.totalTokenCount || 0,
    };
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw err;
  }
}

/**
 * System Prompt מעמיק, מקצועי וחכם במיוחד עבור המאמן
 */
export function buildCoachSystemPrompt(profile) {
  const isBabzi = profile.id === 'babzi';
  const name = isBabzi ? 'באבזי (ניצן מור)' : 'אברהם נתן מור';
  const gender = isBabzi 
    ? 'לשון נקבה מעצימה, חמה, מקצועית ומדרבנת (מתאמנת חזקה ונחושה)' 
    : 'לשון זכר חברית, חדה, אנרגטית ומקצועית (מתאמן נחוש)';

  return `
אתה מאמן הכושר, הביומכניקה והתזונה הבכיר והאישי של ${name}.
אתה מופעל במודל החכם ביותר של Google - Gemini 3.8 Flash (High Mode).
פנייה למתאמן/ת: ${gender}.

תיק המתאמן/ת:
- שם: ${profile.name} (כינוי אהוב: ${profile.nickname})
- משקל התחלתי / נוכחי: ${profile.currentWeight} ק"ג
- גובה: ${profile.height} ס"מ
- יעד פיזיולוגי ראשי: ${profile.goal} (חיטוב עמוק, ירידה מבוקרת באחוזי שומן תוך בנייה ושימור מקסימלי של מסת שריר רזה).
- יעד משקל: ${profile.targetWeight} ק"ג
- יעד קלורי יומי: כ-${profile.targetCalories} קק"ל (גירעון קלורי מתון ובריא).
- יעד חלבון יומי: כ-${profile.targetProtein} גרם חלבון (קריטי לשמירה על שריר בתהליך חיטוב).
- תזונה: אוכלים הכל, מחפשים איזון פשוט, מזין וטעים ללא איסורים קיצוניים.

תוכנית האימונים המדויקת של המאמן שלכם:
1. חימום יומי של 10 דקות (חובה לפני כל אימון):
   - 5 דקות הליכה בקצב 6 (הזרמת דם ומפרקים)
   - 2 דקות ריצה בקצב 9 (העלאת דופק ומוכנות שרירית)
   - 3 דקות הליכה בקצב 5 (התאוששות וייצוב נשימה לקראת משקולות)

2. חלוקת אימוני כוח (ABC) עם מנוחה של 60-90 שניות בין סטים:
   - יום א' (גב ויד קדמית):
     * מתח רחב / פולי עליון אחיזה רחבה 4X10
     * פולי עליון כבד 4X6-8
     * פולאובר בכבל / משקולת 4X10
     * חתירה בכבל / מכשיר 4X10
     * יד קדמית: כפיפת מרפקים בפטישים (Hammer Curls) 4X12
   - יום ב' (חזה ויד אחורית):
     * לחיצת חזה שטוחה עם משקולות 4X10
     * לחיצת חזה בשיפוע חיובי במכשיר 4X10
     * חזה תחתון בכבלים / קרוסאובר 4X10
     * יד אחורית: פשיטת מרפקים בכבל 4X12
     * יד אחורית: פשיטה בכבל מעל הראש 4X10
   - יום ג' (רגליים וכתפיים):
     * סקוואט / האק סקוואט 4X6-8 (משקל כבד ומאתגר)
     * תאומים 4X10
     * פשיטת רגליים במכשיר 4X8
     * לחיצת כתפיים בישיבה עם דמבלים 4X10
     * הרחקת זרועות לצדדים 4X10
     * כתף אחורית (פרפר הפוך / Face Pulls) 4X10

3. אירובי שבועי:
   - מינימום 3 פעמים בשבוע, 25 דקות בכל פעם (הליכון בשיפוע, ריצה קלה, אליפטיקל או אופניים).

הנחיות לאופי המאמן ותשובותיו:
- חכם, סמכותי, ידען ומנוסה מאוד בכושר, ביומכניקה ותזונה ספורטיבית.
- סגנון דיבור: ישראלי חם, מחבק, ענייני ומעודד (בלי קלישאות ריקות – תן ידע אמיתי, הסבר את ה"למה" וה"איך").
- כששואלים על טכניקה – פרק את התנועה לשלבים ברורים (מנח כפות רגליים, נשימה, מסלול התנועה, נקודת כיווץ שיא).
- כששואלים על תזונה או "חריגות" – הרגע אותם, הסבר איך לאזן בצורה חכמה ומדעית (שבועי ולא יומי, חלבון, מים, אירובי).
- עצב את התשובות בצורה קריאה ויפה עם הדגשות (בולד), רשימות ורווחים נוחים לקריאה בטלפון.
`.trim();
}

/**
 * שיחה אינטליגנטית עם המאמן
 */
export async function askCoach({ apiKey, profile, message, chatHistory = [] }) {
  const systemPrompt = buildCoachSystemPrompt(profile);

  if (!apiKey) {
    return { text: getOfflineCoachResponse(profile, message), tokens: 0 };
  }

  try {
    return await callGemini(apiKey, systemPrompt, message, chatHistory, 1200);
  } catch (error) {
    console.warn('API error, falling back to simulated coach:', error);
    return {
      text: getOfflineCoachResponse(profile, message),
      tokens: 0,
    };
  }
}

/**
 * ניתוח ארוחה עמוק ומדויק
 */
export async function analyzeMealWithGemini({ apiKey, profile, mealText, mealType }) {
  const prompt = `
המתאמן/ת ${profile.nickname} (יעד: ${profile.goal}, צריכה מומלצת ${profile.targetCalories} קק"ל ו-${profile.targetProtein} גרם חלבון ביום) דיווח/ה על ארוחת ${mealType}:
"${mealText}"

בצע ניתוח תזונתי מקצועי והחזר אך ורק מבנה JSON תקין ללא שום טקסט או markdown מסביב:
{
  "calories": מספר_שלם_של_קלוריות,
  "protein": מספר_שלם_של_חלבון_בגרם,
  "carbs": מספר_שלם_של_פחמימות_בגרם,
  "fat": מספר_שלם_של_שומן_בגרם,
  "score": ציון_איכות_מ1_עד_10,
  "summary": "משפט סיכום מקצועי וברור על הארוחה",
  "tips": "ניתוח תזונתי מפורט ומעמיק של המאמן: האם מספק מבחינת חלבון, מה כדאי להוסיף, טיפ לאיזון בהמשך היום וכו'"
}
`.trim();

  const systemInstruction = 'אתה תזונאי ספורט קליני ומאמן כושר בכיר. ענה תמיד במבנה JSON תקין ומדויק בלבד.';

  if (!apiKey) {
    return getOfflineMealAnalysis(mealText, mealType);
  }

  try {
    const result = await callGemini(apiKey, systemInstruction, prompt, [], 500);
    const cleaned = result.text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      estimatedCalories: parsed.calories || 400,
      estimatedProtein: parsed.protein || 25,
      estimatedCarbs: parsed.carbs || 35,
      estimatedFat: parsed.fat || 12,
      healthScore: parsed.score || 8,
      summary: parsed.summary || `ארוחת ${mealType} טובה`,
      tips: parsed.tips || 'ארוחה טובה, הקפידו על יתרת החלבון בהמשך היום ושתיית מים מספקת!',
      tokens: result.tokens,
    };
  } catch (err) {
    console.warn('Failed to parse Gemini meal JSON, falling back:', err);
    return getOfflineMealAnalysis(mealText, mealType);
  }
}

/**
 * מענה מקומי עשיר ומפורט במקרה שאין מפתח
 */
function getOfflineCoachResponse(profile, message) {
  const isBabzi = profile.id === 'babzi';
  const name = isBabzi ? 'באבזי' : 'אברהם';
  const lower = message.toLowerCase();

  if (lower.includes('סקוואט') || lower.includes('רגליים')) {
    return `אהלן ${name}! בסקוואט ביום ג' אנחנו עובדים בטווח של **6-8 חזרות**, מה שאומר שהמשקל חייב להיות כבד ומאתגר – אבל הטכניקה מעל הכל:

1. **רוחב עמידה:** מעט רחב יותר מרוחב הכתפיים, אצבעות פונות ב-20-30 מעלות החוצה.
2. **תנועת האגן:** מתחילים את הירידה בלקיחת הישבן אחורה ולמטה (כאילו מתיישבים על ספסל), ולא דוחפים רק את הברכיים קדימה.
3. **נשימה ולחץ תוך-בטני (Bracing):** לקחת אוויר עמוק לבטן לפני הירידה, לנעול את שרירי הליבה, ולהוציא אוויר רק בשני שליש הדרך למעלה.
4. **עומק ומנוחה:** לרדת עד שהירך מקבילה לקרקע, ולנוח **90 שניות מלאות** בין הסטים כדי לגייס מקסימום יחידות מוטוריות!`;
  }

  if (lower.includes('אכלתי') || lower.includes('שווארמה') || lower.includes('פיצה') || lower.includes('מתוק')) {
    return `${name}, קודם כל לנשום עמוק – שום דבר לא נהרס! חיטוב אמיתי נמדד במאזן קלורי שבועי, לא בארוחה בודדת:

1. **לא מקזזים בצומות:** אל תרעיבו את עצמכם מחר. זה רק יוביל לבולמוס נוסף.
2. **הארוחה הבאה:** תתמקדו בחלבון רזה מאוד (חזה עוף, טונה במים, גבינה לבנה 5% או ביצים קשות) והרבה ירקות טריים לנפח ושובע.
3. **פעילות:** נצלו את הפחמימות שהגוף קיבל לאימון כוח פצצה היום או מחר, ואל תוותרו על ה-**25 דקות אירובי**!`;
  }

  return `שלום ${name}! אני כאן לרשותך עם כל הידע של המאמן והתזונה.
אנחנו מתקדמים בנחישות לעבר היעד: **חיטוב ושמירה על השריר**.
איך אפשר לעזור לך כרגע? טכניקה בתרגיל מסוים, תכנון הארוחות להיום או טיפ לאירובי?`;
}

function getOfflineMealAnalysis(mealText, mealType) {
  return {
    estimatedCalories: 420,
    estimatedProtein: 30,
    estimatedCarbs: 38,
    estimatedFat: 14,
    healthScore: 8,
    summary: `ארוחת ${mealType} מאוזנת ומשביעה`,
    tips: 'שילוב יפה של חלבון ופחמימות. מומלץ לוודא שתיית 2 כוסות מים לצד הארוחה לסיוע בעיכול והרגשת שובע.',
    tokens: 0,
  };
}
