import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { askCoach } from '../services/geminiService';
import { Send, Bot, Sparkles, Trash2, Zap, Dumbbell, Flame, Apple } from 'lucide-react';

function FormattedMessage({ text }) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <div key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => {
              const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
              const cleanLine = isBullet ? line.trim().substring(2) : line;
              const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

              return (
                <div
                  key={lIdx}
                  className={`${isBullet ? 'flex items-start gap-1.5 mr-2 my-0.5' : ''}`}
                >
                  {isBullet && <span className="text-emerald-400 font-bold shrink-0">•</span>}
                  <span>
                    {parts.map((part, k) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={k} className="font-black text-white">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function CoachChatTab() {
  const {
    currentProfile,
    currentUserId,
    apiKey,
    chatMessages,
    addChatMessage,
    clearChat,
  } = useApp();

  const isBabzi = currentUserId === 'babzi';
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: '🏋️ טכניקת סקוואט ביום ג׳', text: 'תן לי דגשים מפורטים לביצוע נכון ומדויק של הסקוואט ביום ג׳ בטווח של 6-8 חזרות' },
    { label: '🍕 אכלתי ארוחה כבדה', text: 'אכלתי היום משהו כבד ושמן, איך אני מאזן/ת את שאר היום ואת השבוע בלי רגשות אשם?' },
    { label: '🥩 איך להגיע ליעד החלבון?', text: 'תן לי רעיונות פשוטים וטעימים ממאכלים רגילים כדי להגיע ליעד החלבון היומי שלי' },
    { label: '⚡ עייפות והתאוששות', text: 'אני מרגיש/ה קצת תפוס/ה ועייף/ה, איך כדאי להתאושש ומה לעשות לפני האימון הבא?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const handleSend = async (textToSend = inputText) => {
    const message = textToSend.trim();
    if (!message || isLoading) return;

    addChatMessage('user', message);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askCoach({
        apiKey,
        profile: currentProfile,
        message,
        chatHistory: chatMessages,
      });

      addChatMessage('model', response.text, response.tokens);
    } catch (err) {
      console.error('Coach chat error:', err);
      addChatMessage(
        'model',
        'הייתה בעיה בתקשורת. וודא שהמפתח ב-Settings תקין או נסה שוב בעוד רגע!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-130px)] max-w-3xl mx-auto px-3.5 pb-[calc(env(safe-area-inset-bottom,16px)+64px)] pt-1">
      {/* 1. Chat Header */}
      <div className="pro-card rounded-[26px] p-3 mb-2.5 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-lg ${
                isBabzi
                  ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-500/25'
                  : 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 shadow-emerald-500/25'
              }`}
            >
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                isBabzi ? 'bg-rose-400' : 'bg-emerald-400'
              } animate-pulse`}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-white">המאמן האישי של {currentProfile.nickname}</h3>
              <span className="text-[9px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 fill-current" />
                Gemini 3.8 Flash (High)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              מוח מאמן בכיר • תשובות מעמיקות, מקצועיות וחכמות
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-slate-500 hover:text-slate-300 p-2 rounded-xl hover:bg-slate-800 transition-colors active:scale-90"
          title="נקה שיחה"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Quick Prompts Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 shrink-0 no-scrollbar">
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q.text)}
            disabled={isLoading}
            className="text-[11px] font-bold whitespace-nowrap bg-slate-900/90 hover:bg-slate-850 border border-white/[0.08] text-slate-200 px-3.5 py-1.5 rounded-full transition-all shrink-0 active:scale-95 shadow-md"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-[28px] mb-2.5 shadow-inner">
        {chatMessages.length === 0 && (
          <div className="text-center py-12 space-y-3 text-slate-400">
            <div className="w-12 h-12 rounded-3xl bg-slate-900/90 border border-white/[0.08] flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="text-base font-black text-white">אהלן {currentProfile.nickname}!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              המאמן החכם שלך כאן במלוא העוצמה עם מודל <strong className="text-white">Gemini 3.8 Flash (High)</strong>. שאל אותי כל דבר על התוכנית, סטים, תזונה ואיזון!
            </p>
          </div>
        )}

        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-2xl flex items-center justify-center text-sm shrink-0 shadow-md ${
                  isUser
                    ? isBabzi
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-400 text-slate-950 font-black'
                    : 'bg-slate-900 text-emerald-400 border border-white/[0.08]'
                }`}
              >
                {isUser ? currentProfile.avatar : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-3xl p-3.5 sm:p-4 text-xs shadow-xl transition-all ${
                  isUser
                    ? isBabzi
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-tr-none'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-900/95 border border-white/[0.08] text-slate-200 rounded-tl-none shadow-black/40'
                }`}
              >
                {isUser ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <FormattedMessage text={msg.text} />
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-slate-400 p-2">
            <div className="w-7 h-7 rounded-xl bg-slate-900 border border-white/[0.08] flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <span className="italic font-medium">המאמן מגבש תשובה מקצועית ומעמיקה...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Message Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`שאל את המאמן שלך (${currentProfile.nickname})...`}
          className="flex-1 bg-slate-950 border border-white/[0.09] rounded-2xl px-4 py-3 text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xl transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl shrink-0 active:scale-90 ${
            isLoading || !inputText.trim()
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : isBabzi
              ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-500/30'
              : 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 shadow-emerald-500/30'
          }`}
        >
          <Send className="w-5 h-5 rotate-180 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
