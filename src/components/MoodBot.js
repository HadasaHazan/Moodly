import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles, CheckCircle } from 'lucide-react';
import { EMOTIONS } from '../constants/emotions';
import { 
  BOT_EXPLANATION, 
  BOT_EXPLANATION_EN,
  getGuidedRecommendation,
  getSupportiveMessageByEmotion,
  getBotClosingMessage
} from '../constants/botRecommendations';
import { saveBotConversation } from '../utils/storage';
import { getLanguage, getTodayDate, getWeeklyData } from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';

const MoodBot = ({ emotionId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationPhase, setConversationPhase] = useState('explanation'); // explanation, waiting_answer, recommendation, summary
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({ sleepHours: null, hardThing: '', helpNow: '' });
  const messagesEndRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isSendingRef = useRef(false);
  const language = getLanguage();
  const isRtl = isRtlLanguage(language);

  const queueTimeout = (callback, delay) => {
    const timeoutId = setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  };

  useEffect(() => {
    if (emotionId) {
      const emotion = EMOTIONS[emotionId];

      const weekly = getWeeklyData();
      const todayStr = getTodayDate();
      const getDateStr = (offsetDays) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offsetDays);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      let streak = 0;
      for (let offset = 0; offset >= -6; offset -= 1) {
        const dateStr = offset === 0 ? todayStr : getDateStr(offset);
        const count = weekly?.[dateStr]?.[emotionId] || 0;
        if (count > 0) streak += 1;
        else break;
      }

      const streakMessage =
        streak >= 3 && ['anger', 'stress', 'sad', 'despair'].includes(emotionId)
          ? (language === 'en'
            ? `I noticed that in the last few days you logged ${emotion.nameEn || emotion.name} more than once. That can happen when something is building up. Let’s figure out what’s driving it.`
            : `שמתי לב שבימים האחרונים סימנת ${emotion.name} כמה פעמים. זה יכול לקרות כשמשהו מצטבר. בוא/י ננסה להבין יחד מה עומד מאחורי זה.`)
          : null;
      
      // הודעה 1: הסבר על הבוט
      setMessages(
        [
          {
            type: 'bot',
            text:
              language === 'en'
                ? `Hi! 👋 I noticed you selected ${emotion.emoji} ${emotion.nameEn || emotion.name}.\n\n${BOT_EXPLANATION_EN}`
                : `שלום! 👋 ראיתי שבחרת ${emotion.emoji} ${emotion.name}.\n\n${BOT_EXPLANATION}`
          },
          ...(streakMessage ? [{ type: 'bot', text: streakMessage }] : [])
        ]
      );

      setAnswers({ sleepHours: null, hardThing: '', helpNow: '' });
      setQuestionIndex(0);
      
      const guidedQuestions = language === 'en'
        ? [
            { id: 'sleepHours', text: 'About how many hours did you sleep last night?' },
            { id: 'hardThing', text: 'Was there something hard today that might explain this feeling?' },
            { id: 'helpNow', text: 'What would help you most right now (even a small thing)?' }
          ]
        : [
            { id: 'sleepHours', text: 'כמה שעות ישנת בערך בלילה האחרון?' },
            { id: 'hardThing', text: 'היה משהו קשה היום שיכול להסביר את הרגש הזה?' },
            { id: 'helpNow', text: 'מה הכי היה יכול לעזור לך עכשיו (גם משהו קטן)?' }
          ];

      // הודעה 2+: שאלות מכוונות
      queueTimeout(() => {
        setIsTyping(true);
        queueTimeout(() => {
          const question = guidedQuestions[0]?.text;
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: question
          }]);
          setIsTyping(false);
          setConversationPhase('waiting_answer');
        }, 1200);
      }, 2000);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      isSendingRef.current = false;
    };
  }, [emotionId, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || conversationPhase !== 'waiting_answer' || isSendingRef.current) return;
    isSendingRef.current = true;

    const answer = inputValue.trim();
    setInputValue('');

    // הוספת תשובת המשתמש
    setMessages(prev => [...prev, { type: 'user', text: answer }]);

    const guidedQuestions = language === 'en'
      ? ['sleepHours', 'hardThing', 'helpNow']
      : ['sleepHours', 'hardThing', 'helpNow'];
    const currentId = guidedQuestions[questionIndex] || 'hardThing';

    setAnswers((prev) => {
      if (currentId === 'sleepHours') {
        const maybeNumber = Number(String(answer).replace(',', '.').trim());
        return { ...prev, sleepHours: Number.isFinite(maybeNumber) ? maybeNumber : prev.sleepHours };
      }
      if (currentId === 'hardThing') return { ...prev, hardThing: answer };
      if (currentId === 'helpNow') return { ...prev, helpNow: answer };
      return prev;
    });

    const nextIndex = questionIndex + 1;
    const hasMore = nextIndex < guidedQuestions.length;

    if (hasMore) {
      setQuestionIndex(nextIndex);
      setIsTyping(true);
      queueTimeout(() => {
        const questionText = language === 'en'
          ? [
              'Was there something hard today that might explain this feeling?',
              'What would help you most right now (even a small thing)?'
            ][nextIndex - 1]
          : [
              'היה משהו קשה היום שיכול להסביר את הרגש הזה?',
              'מה הכי היה יכול לעזור לך עכשיו (גם משהו קטן)?'
            ][nextIndex - 1];
        setMessages((prev) => [...prev, { type: 'bot', text: questionText }]);
        setIsTyping(false);
        isSendingRef.current = false;
      }, 900);
      return;
    }

    // All answers gathered -> recommendation
    setConversationPhase('recommendation');
    setIsTyping(true);
    queueTimeout(() => {
      const mergedAnswers = {
        ...answers,
        ...(currentId === 'sleepHours' ? { sleepHours: Number(String(answer).replace(',', '.').trim()) } : {}),
        ...(currentId === 'hardThing' ? { hardThing: answer } : {}),
        ...(currentId === 'helpNow' ? { helpNow: answer } : {})
      };
      const rec = getGuidedRecommendation(emotionId, mergedAnswers, { mode: 'immediate', language });
      const supportiveMessage = getSupportiveMessageByEmotion(emotionId, language);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `${rec.text}\n\n${supportiveMessage}` 
      }]);
      setIsTyping(false);

      // הודעת סיום
      queueTimeout(() => {
        setIsTyping(true);
        queueTimeout(() => {
          setMessages(prev => [...prev, { type: 'bot', text: getBotClosingMessage(language) }]);
          setIsTyping(false);
          setConversationPhase('summary');
          isSendingRef.current = false;

          // שמירת השיחה
          saveBotConversation({
            emotionId,
            emotionName: language === 'en' ? (EMOTIONS[emotionId].nameEn || EMOTIONS[emotionId].name) : EMOTIONS[emotionId].name,
            userAnswer: mergedAnswers.hardThing || mergedAnswers.helpNow || '',
            sleepHours: mergedAnswers.sleepHours ?? null,
            hardThing: mergedAnswers.hardThing || '',
            helpNow: mergedAnswers.helpNow || '',
            recommendation: rec.text,
            task: rec.task,
            timestamp: new Date().toISOString()
          });
        }, 1000);
      }, 2000);
    }, 1400);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl h-[650px] flex flex-col border border-indigo-400/30">
        {/* כותרת */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{language === 'en' ? 'Mood Bot' : 'בוט מצב רוח'}</h2>
              <p className="text-sm text-indigo-100">
                {language === 'en' ? 'Your emotional support bot' : 'בוט התמיכה הרגשי שלך'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full transition-colors text-white hover:bg-white hover:bg-opacity-20"
            title={language === 'en' ? 'Close' : 'סגור'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* הודעות */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-100 shadow-md'
                }`}
              >
                {msg.type === 'bot' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    <span className="text-xs font-semibold text-indigo-200">{language === 'en' ? 'Mood Bot' : 'בוט מצב רוח'}</span>
                  </div>
                )}
                <p className={`${isRtl ? 'text-right' : 'text-left'} whitespace-pre-wrap leading-relaxed`}>{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-slideUp">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                    <span className="text-sm text-slate-400">{language === 'en' ? 'Typing...' : 'כותב...'}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* קלט - רק כשמחכים לתשובה */}
        <div className="p-6 border-t border-slate-700 bg-slate-900 rounded-b-3xl">
          {conversationPhase === 'waiting_answer' ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'en' ? 'Type your answer...' : 'כתוב את התשובה שלך...'}
                className="flex-1 px-4 py-3 border border-slate-600 bg-slate-800 text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          ) : conversationPhase === 'summary' && (
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              {language === 'en' ? 'Close and View Daily Summary' : 'סגור וצפה בסיכום היומי'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodBot;
