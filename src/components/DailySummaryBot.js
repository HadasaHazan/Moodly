import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Calendar } from 'lucide-react';
import { EMOTIONS } from '../constants/emotions';
import { getDailySummary, getDominantEmotion } from '../utils/storage';
import {
  getProfessionalBotReply,
  getBotIntroText,
  getBotQuestionText,
  getContextualReflectionText,
  buildAdaptiveQuestionPlan,
  getBotClosingMessageShort
} from '../constants/botRecommendations';
import { saveBotConversation, getLanguage, getUiTheme } from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';

const DailySummaryBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationPhase, setConversationPhase] = useState('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    mainThing: '',
    context: '',
    sleepHours: null,
    energyLevel: null,
    stressLevel: null,
    helpNow: ''
  });
  const [questionFlow, setQuestionFlow] = useState([]);
  const messagesEndRef = useRef(null);
  const timeoutsRef = useRef([]);
  const isSendingRef = useRef(false);
  const language = getLanguage();
  const uiTheme = getUiTheme();
  const isLight = uiTheme === 'light';
  const isRtl = isRtlLanguage(language);

  const queueTimeout = (callback, delay) => {
    const timeoutId = setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  };

  useEffect(() => {
    const dailySummary = getDailySummary();
    const dominantEmotion = getDominantEmotion();
    const totalEmotions = Object.values(dailySummary).reduce((sum, count) => sum + count, 0);

    if (totalEmotions === 0) {
      setMessages([{
        type: 'bot',
        text: language === 'en'
          ? 'Hi! 👋 It looks like you have not logged emotions today yet. Go to the emotion jar to start.'
          : 'שלום! 👋 נראה שעדיין לא סימנת רגשות היום. לך לצנצנת הרגשות כדי להתחיל!'
      }]);
      setConversationPhase('no_data');
      return;
    }

    const emotion = EMOTIONS[dominantEmotion];
    const emotionLabel = language === 'en'
      ? `${emotion.emoji} ${emotion.nameEn || emotion.name}`
      : `${emotion.emoji} ${emotion.name}`;
    setMessages([{ type: 'bot', text: getBotIntroText({ emotionLabel, language, mode: 'daily' }) }]);
    setAnswers({
      mainThing: '',
      context: '',
      sleepHours: null,
      energyLevel: null,
      stressLevel: null,
      helpNow: ''
    });
    setQuestionIndex(0);

    const guidedQuestions = [{ id: 'mainThing', text: getBotQuestionText({ questionId: 'mainThing', emotionName: emotionLabel, language }) }];
    setQuestionFlow(guidedQuestions);
    queueTimeout(() => {
      setIsTyping(true);
      queueTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: guidedQuestions[0]?.text }]);
        setIsTyping(false);
        setConversationPhase('waiting_answer');
      }, 1200);
    }, 700);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      isSendingRef.current = false;
    };
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || conversationPhase !== 'waiting_answer' || isSendingRef.current) return;
    isSendingRef.current = true;

    const answer = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', text: answer }]);

    const dominantEmotion = getDominantEmotion();
    const emotion = EMOTIONS[dominantEmotion];
    const guidedQuestions = questionFlow.length
      ? questionFlow
      : [{ id: 'mainThing', text: getBotQuestionText({ questionId: 'mainThing', emotionName: '', language }) }];
    const currentId = guidedQuestions[questionIndex]?.id || 'mainThing';

    setAnswers((prev) => {
      if (currentId === 'sleepHours') {
        const maybeNumber = Number(String(answer).replace(',', '.').trim());
        return { ...prev, sleepHours: Number.isFinite(maybeNumber) ? maybeNumber : prev.sleepHours };
      }
      if (currentId === 'context') return { ...prev, context: answer };
      if (currentId === 'energyLevel') {
        const maybeNumber = Number(String(answer).replace(',', '.').trim());
        return { ...prev, energyLevel: Number.isFinite(maybeNumber) ? maybeNumber : prev.energyLevel };
      }
      if (currentId === 'stressLevel') {
        const maybeNumber = Number(String(answer).replace(',', '.').trim());
        return { ...prev, stressLevel: Number.isFinite(maybeNumber) ? maybeNumber : prev.stressLevel };
      }
      if (currentId === 'helpNow') return { ...prev, helpNow: answer };
      if (currentId === 'mainThing') return { ...prev, mainThing: answer };
      return prev;
    });

    const nextIndex = questionIndex + 1;
    let nextFlow = null;
    if (currentId === 'mainThing' && questionIndex === 0) {
      const emotionLabel = language === 'en'
        ? `${emotion?.emoji || ''} ${emotion?.nameEn || emotion?.name || ''}`.trim()
        : `${emotion?.emoji || ''} ${emotion?.name || ''}`.trim();
      const followUps = buildAdaptiveQuestionPlan({
        emotionLabel,
        emotionId: dominantEmotion,
        language,
        mode: 'daily',
        mainThing: answer
      });
      const newFlow = [{ id: 'mainThing', text: guidedQuestions[0]?.text }, ...followUps];
      nextFlow = newFlow;
      setQuestionFlow(newFlow);
    }

    const effectiveFlow = nextFlow || (questionFlow.length ? questionFlow : guidedQuestions);

    const hasMore = nextIndex < effectiveFlow.length;

    if (hasMore) {
      setQuestionIndex(nextIndex);
      setIsTyping(true);
      queueTimeout(() => {
        const emotionName = language === 'en'
          ? (EMOTIONS[dominantEmotion]?.nameEn || EMOTIONS[dominantEmotion]?.name || '')
          : (EMOTIONS[dominantEmotion]?.name || '');
        const reflection = getContextualReflectionText({
          questionId: currentId,
          answer,
          emotionName,
          language,
          answers: { ...answers, ...(currentId === 'mainThing' ? { mainThing: answer } : {}) }
        });

        setMessages((prev) => [...prev, { type: 'bot', text: reflection }]);
        queueTimeout(() => {
          setMessages((prev) => [...prev, { type: 'bot', text: effectiveFlow[nextIndex]?.text }]);
          setIsTyping(false);
          isSendingRef.current = false;
        }, 650);
      }, 900);
      return;
    }

    setConversationPhase('recommendation');
    const emotionId = dominantEmotion || 'sad';
    setIsTyping(true);

    queueTimeout(() => {
      const mergedAnswers = {
        ...answers,
        ...(currentId === 'sleepHours' ? { sleepHours: Number(String(answer).replace(',', '.').trim()) } : {}),
        ...(currentId === 'context' ? { context: answer } : {}),
        ...(currentId === 'energyLevel' ? { energyLevel: Number(String(answer).replace(',', '.').trim()) } : {}),
        ...(currentId === 'stressLevel' ? { stressLevel: Number(String(answer).replace(',', '.').trim()) } : {}),
        ...(currentId === 'helpNow' ? { helpNow: answer } : {}),
        ...(currentId === 'mainThing' ? { mainThing: answer } : {})
      };

      const emotionObj = EMOTIONS[emotionId];
      const emotionName = language === 'en'
        ? (emotionObj?.nameEn || emotionObj?.name || 'General')
        : (emotionObj?.name || 'כללי');

      const reply = getProfessionalBotReply({
        emotionId,
        emotionName,
        language,
        answers: mergedAnswers,
        mode: 'daily'
      });
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: reply.text
      }]);
      setIsTyping(false);

      queueTimeout(() => {
        setIsTyping(true);
        queueTimeout(() => {
          setMessages(prev => [...prev, { type: 'bot', text: getBotClosingMessageShort(language) }]);
          setIsTyping(false);
          setConversationPhase('summary');
          isSendingRef.current = false;

          saveBotConversation({
            emotionId: dominantEmotion,
            emotionName: language === 'en' 
              ? (EMOTIONS[dominantEmotion]?.nameEn || EMOTIONS[dominantEmotion]?.name || 'General')
              : (EMOTIONS[dominantEmotion]?.name || 'כללי'),
            userAnswer: mergedAnswers.mainThing || mergedAnswers.helpNow || '',
            sleepHours: mergedAnswers.sleepHours ?? null,
            mainThing: mergedAnswers.mainThing || '',
            context: mergedAnswers.context || '',
            energyLevel: mergedAnswers.energyLevel ?? null,
            stressLevel: mergedAnswers.stressLevel ?? null,
            helpNow: mergedAnswers.helpNow || '',
            recommendation: reply.text,
            task: reply.task,
            timestamp: new Date().toISOString(),
            type: 'daily_summary'
          });
        }, 700);
      }, 700);
    }, 900);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed inset-0 ${isLight ? 'bg-slate-950/35' : 'bg-black/70'} backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn`}
    >
      <div
        className={`rounded-3xl shadow-2xl w-full max-w-2xl h-[650px] flex flex-col border ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900 border-indigo-400/30'
        }`}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{language === 'en' ? 'Daily Summary' : 'סיכום יומי'}</h2>
              <p className="text-sm text-indigo-100">{language === 'en' ? 'Let\'s talk about your day' : 'בוא נדבר על היום שלך'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors text-white hover:bg-white hover:bg-opacity-20"
            title={language === 'en' ? 'Close' : 'סגור'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div
          className={`flex-1 overflow-y-auto p-6 space-y-4 ${
            isLight ? 'bg-gradient-to-b from-white to-slate-50' : 'bg-gradient-to-b from-slate-900 to-slate-950'
          }`}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : isLight
                    ? 'bg-white/95 border border-slate-200 text-slate-800 shadow-md'
                    : 'bg-slate-800 border border-slate-700 text-slate-100 shadow-md'
              }`}>
                {msg.type === 'bot' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-indigo-300'}`} />
                    <span className={`text-xs font-semibold ${isLight ? 'text-indigo-700' : 'text-indigo-200'}`}>{language === 'en' ? 'Mood Bot' : 'בוט מצב רוח'}</span>
                  </div>
                )}
                <p className={`${isRtl ? 'text-right' : 'text-left'} whitespace-pre-wrap leading-relaxed`}>{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-slideUp">
              <div className={`rounded-2xl p-4 shadow-md border ${isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isLight ? 'bg-slate-500' : 'bg-gray-400'}`} style={{ animationDelay: '0s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isLight ? 'bg-slate-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.2s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${isLight ? 'bg-slate-500' : 'bg-gray-400'}`} style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{language === 'en' ? 'Typing...' : 'כותב...'}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={`p-6 border-t rounded-b-3xl ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-700 bg-slate-900'}`}>
          {conversationPhase === 'waiting_answer' && (
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'en' ? 'Type your answer...' : 'כתוב את התשובה שלך...'}
                className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-500 placeholder:opacity-100 ${
                  isLight
                    ? 'border-slate-300 bg-white text-slate-900'
                    : 'border-slate-600 bg-slate-800 text-slate-100'
                }`}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
          {(conversationPhase === 'summary' || conversationPhase === 'no_data') && (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-5 h-5" />
              {conversationPhase === 'no_data'
                ? (language === 'en' ? 'Close' : 'סגור')
                : (language === 'en' ? 'Close and View Daily Summary' : 'סגור וצפה בסיכום היומי')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySummaryBot;
