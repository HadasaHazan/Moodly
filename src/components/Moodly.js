import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, HelpCircle } from 'lucide-react';
import { EMOTIONS } from '../constants/emotions';
import { 
  addEmotionToBottle, 
  getTodayBottle, 
  getDominantEmotion,
  getBotMode,
  getLanguage,
  getUiTheme
} from '../utils/storage';
import MoodBot from './MoodBot';
import DailySummaryBot from './DailySummaryBot';
import BotDailySummary from './BotDailySummary';
import { translate as t, isRtlLanguage } from '../constants/i18n';

const Moodly = ({ onBack }) => {
  const [bottleData, setBottleData] = useState({});
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showBot, setShowBot] = useState(false);
  const [showDailyBot, setShowDailyBot] = useState(false);
  const [botMode, setBotMode] = useState('immediate');
  const [summaryRefresh, setSummaryRefresh] = useState(0);
  
  // אנימציית סמילי נופל
  const [flyingEmoji, setFlyingEmoji] = useState(null);
  const [showSplash, setShowSplash] = useState(false);
  const [newEmojiKey, setNewEmojiKey] = useState(0);
  const [isDesktopWide, setIsDesktopWide] = useState(() => window.innerWidth >= 1024);
  const [language, setLanguage] = useState('he');
  const [uiTheme, setUiTheme] = useState('dark');
  const [showEmotionBotHelp, setShowEmotionBotHelp] = useState(false);
  const [showDailyBotHelp, setShowDailyBotHelp] = useState(false);
  const isRtl = isRtlLanguage(language);
  
  const bottleRef = useRef(null);
  const emojiButtonsRef = useRef({});

  useEffect(() => {
    updateBottleData();
    setBotMode(getBotMode());
    setLanguage(getLanguage());
    setUiTheme(getUiTheme());
  }, []);

  useEffect(() => {
    const onBotModeChange = () => setBotMode(getBotMode());
    window.addEventListener('botmodechange', onBotModeChange);
    return () => window.removeEventListener('botmodechange', onBotModeChange);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktopWide(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateBottleData = () => {
    const todayBottle = getTodayBottle();
    const dominant = getDominantEmotion();
    setBottleData(todayBottle);
    setDominantEmotion(dominant);
  };

  const handleEmotionClick = (emotionId) => {
    if (flyingEmoji) return;
    const emotion = EMOTIONS[emotionId];
    
    // מיקום הכפתור ללחיצה
    const buttonEl = emojiButtonsRef.current[emotionId];
    const buttonRect = buttonEl?.getBoundingClientRect();
    const bottleRect = bottleRef.current?.getBoundingClientRect();
    const startX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2;
    const startY = buttonRect ? buttonRect.top + buttonRect.height / 2 : window.innerHeight * 0.55;
    const targetX = bottleRect ? bottleRect.left + bottleRect.width / 2 : window.innerWidth / 2;
    const targetY = bottleRect ? bottleRect.top + Math.max(72, bottleRect.height * 0.2) : window.innerHeight * 0.3;
    
    setFlyingEmoji({
      emotionId,
      emoji: emotion.emoji,
      startX,
      startY,
      deltaX: targetX - startX,
      deltaY: targetY - startY
    });
    
    // אחרי האנימציה - עדכון נתונים
    setTimeout(() => {
      addEmotionToBottle(emotionId);
      setShowSplash(true);
      setNewEmojiKey(prev => prev + 1);
      
      setTimeout(() => {
        setShowSplash(false);
        setFlyingEmoji(null);
        updateBottleData();
        
        if (botMode === 'immediate') {
          setSelectedEmotion(emotionId);
          setShowBot(true);
        } else {
          setSelectedEmotion(null);
        }
      }, 450);
    }, 760);
  };

  const getTotalEmotions = () => {
    return Object.values(bottleData).reduce((sum, count) => sum + count, 0);
  };

  const renderEmotionsInBottle = () => {
    const emotions = [];
    let index = 0;
    const total = getTotalEmotions();
    Object.entries(bottleData).forEach(([emotionId, count]) => {
      const emotion = EMOTIONS[emotionId];
      for (let i = 0; i < count; i++) {
        const isNewest = index === total - 1 && flyingEmoji === null && newEmojiKey > 0;
        emotions.push(
          <div
            key={`${emotionId}-${i}-${newEmojiKey}`}
            className={`inline-block text-3xl sm:text-4xl m-0.5 sm:m-1 ${
              isNewest ? 'animate-plop-in' : 'animate-float-in-bottle'
            }`}
            style={{ 
              animationDelay: isNewest ? '0s' : `${(index % 6) * 0.15}s`,
              animationDuration: isNewest ? undefined : `${2.5 + (index % 3) * 0.5}s`
            }}
          >
            {emotion.emoji}
          </div>
        );
        index++;
      }
    });
    return emotions;
  };

  const renderEmotionButton = (emotion, idx) => {
    const count = bottleData[emotion.id] || 0;
    const isSelected = selectedEmotion === emotion.id;

    return (
      <button
        key={emotion.id}
        ref={el => emojiButtonsRef.current[emotion.id] = el}
        onClick={() => handleEmotionClick(emotion.id)}
        disabled={!!flyingEmoji}
        className={`
          flex items-center gap-3 px-5 py-4 rounded-2xl
          border-2 transition-all duration-300 transform
          hover:scale-105 hover:shadow-xl active:scale-95
          disabled:opacity-70 disabled:cursor-wait disabled:transform-none
          ${emotion.bgColor} ${emotion.borderColor}
          ${isSelected ? 'ring-4 ring-cyan-500 ring-offset-2 ring-offset-slate-900 scale-105' : ''}
        `}
        style={{ 
          animationDelay: `${idx * 0.08}s`,
          minWidth: isDesktopWide ? '190px' : '140px'
        }}
      >
        <span className="text-4xl">{emotion.emoji}</span>
        <div className={`${isRtl ? 'text-right' : 'text-left'} flex-1`}>
                <div className={`font-bold ${emotion.textColor}`}>{language === 'en' ? emotion.nameEn || emotion.name : emotion.name}</div>
          {count > 0 && (
            <div className={`text-sm ${emotion.textColor} opacity-80`}>
              {count}×
            </div>
          )}
        </div>
      </button>
    );
  };

  const emotionList = Object.values(EMOTIONS);
  const splitIndex = Math.ceil(emotionList.length / 2);
  const leftEmotions = emotionList.slice(0, splitIndex);
  const rightEmotions = emotionList.slice(splitIndex);
  const totalEmotions = getTotalEmotions();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto pt-6">
        {/* כפתור חזרה - מוסר כי יש ניווט קבוע */}

        {/* כותרת */}
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-200 to-sky-100 bg-clip-text text-transparent mb-2">
            {t(language, 'jarTitle')}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg text-slate-300">{t(language, 'clickEmotionToAdd')}</p>
            {botMode === 'immediate' && (
              <button
                onClick={() => setShowEmotionBotHelp((prev) => !prev)}
                className="text-cyan-300 hover:text-cyan-200 transition-colors"
                title={language === 'en' ? 'About Bot per Emotion' : 'הסבר על בוט לכל רגש'}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            )}
          </div>
          {showEmotionBotHelp && botMode === 'immediate' && (
            <div className={`mt-3 max-w-xl mx-auto border rounded-xl p-3 text-sm ${isRtl ? 'text-right' : 'text-left'} ${
              uiTheme === 'light'
                ? 'bg-white/95 border-slate-300 text-slate-800'
                : 'bg-slate-800/95 border-slate-500 text-slate-100'
            }`}>
              {t(language, 'immediateBotHelp')}
            </div>
          )}
        </div>

        {/* אזור הצנצנת והרגשות */}
        {isDesktopWide ? (
          <div className="grid grid-cols-[minmax(220px,1fr)_minmax(320px,420px)_minmax(220px,1fr)] gap-8 items-center mb-8">
            <div className="flex flex-col items-end gap-4">{leftEmotions.map((emotion, idx) => renderEmotionButton(emotion, idx))}</div>
            <div className="w-full flex justify-center">
              <div 
                ref={bottleRef}
                className="relative w-full max-w-[320px] flex-shrink-0 flex flex-col items-center"
              >
                <div className="relative z-20 w-36 h-14 jam-cloth-lid">
                  <div className="jam-lid-rim" />
                  <div className="jam-lid-bow" />
                </div>
                <div className="relative z-10 w-24 h-10 -mt-2 flex justify-center">
                  <div className="w-full h-full jar-neck-glass" />
                </div>
                <div className="relative z-20 w-28 h-5 -mt-1 jar-neck-rope" />
                <div className="jar-body jam-jar-body -mt-0.5 min-h-[360px] overflow-hidden relative">
                  <div className="jar-top-rim pointer-events-none" />
                  <div className="absolute inset-0 jar-body-inner overflow-hidden pointer-events-none">
                    <div className="jar-glass-highlight-left" />
                    <div className="jar-glass-highlight-right" />
                    <div className="jar-bottom-thickness" />
                  </div>
                  <div className="relative z-20 h-full min-h-[340px] p-4 pt-6 flex flex-wrap content-end justify-center items-end gap-1">
                    {totalEmotions === 0 && !flyingEmoji ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pt-6">
                        <p className="text-lg font-medium mb-1">{t(language, 'jarEmpty')}</p>
                        <p className="text-sm">{t(language, 'chooseEmotionSlide')}</p>
                      </div>
                    ) : (
                      renderEmotionsInBottle()
                    )}
                  </div>
                  {showSplash && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-cyan-300/50 animate-splash pointer-events-none" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4">{rightEmotions.map((emotion, idx) => renderEmotionButton(emotion, idx + leftEmotions.length))}</div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-stretch mb-8">
            <div 
              ref={bottleRef}
              className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto lg:mx-0 flex-shrink-0 flex flex-col items-center"
            >
              <div className="relative z-20 w-32 sm:w-36 h-12 sm:h-14 jam-cloth-lid">
                <div className="jam-lid-rim" />
                <div className="jam-lid-bow" />
              </div>
              <div className="relative z-10 w-20 sm:w-24 h-8 sm:h-10 -mt-2 flex justify-center">
                <div className="w-full h-full jar-neck-glass" />
              </div>
              <div className="relative z-20 w-24 sm:w-28 h-5 -mt-1 jar-neck-rope" />
              <div className="jar-body jam-jar-body -mt-0.5 min-h-[280px] sm:min-h-[340px] overflow-hidden relative">
                <div className="jar-top-rim pointer-events-none" />
                <div className="absolute inset-0 jar-body-inner overflow-hidden pointer-events-none">
                  <div className="jar-glass-highlight-left" />
                  <div className="jar-glass-highlight-right" />
                  <div className="jar-bottom-thickness" />
                </div>
                <div className="relative z-20 h-full min-h-[260px] sm:min-h-[320px] p-4 pt-6 flex flex-wrap content-end justify-center items-end gap-1">
                  {totalEmotions === 0 && !flyingEmoji ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pt-6">
                      <p className="text-lg font-medium mb-1">{t(language, 'jarEmpty')}</p>
                      <p className="text-sm">{t(language, 'chooseEmotionDrop')}</p>
                    </div>
                  ) : (
                    renderEmotionsInBottle()
                  )}
                </div>
                {showSplash && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-cyan-300/50 animate-splash pointer-events-none" />
                )}
              </div>
            </div>
            <div className="flex flex-row flex-wrap lg:flex-col gap-3 lg:gap-4 justify-center lg:justify-start w-full lg:w-auto">
              {emotionList.map((emotion, idx) => renderEmotionButton(emotion, idx))}
            </div>
          </div>
        )}

        {/* סמילי נופל מלמעלה דרך הפתח לצנצנת */}
        {flyingEmoji && (
          <div
            className="fixed z-50 pointer-events-none text-5xl sm:text-6xl animate-emoji-slide-into-jar drop-shadow-2xl"
            style={{
              left: `${flyingEmoji.startX}px`,
              top: `${flyingEmoji.startY}px`,
              '--emoji-delta-x': `${flyingEmoji.deltaX}px`,
              '--emoji-delta-y': `${flyingEmoji.deltaY}px`
            }}
          >
            {flyingEmoji.emoji}
          </div>
        )}

        {/* סיכום יומי */}
        {dominantEmotion && (
          <div className={`mb-6 p-5 rounded-2xl ${EMOTIONS[dominantEmotion].bgColor} border-2 ${EMOTIONS[dominantEmotion].borderColor} animate-slideUp shadow-lg`}>
            <p className={`text-center font-bold text-lg ${EMOTIONS[dominantEmotion].textColor}`}>
              {t(language, 'dominantEmotionToday')} {EMOTIONS[dominantEmotion].emoji} {language === 'en' ? EMOTIONS[dominantEmotion].nameEn || EMOTIONS[dominantEmotion].name : EMOTIONS[dominantEmotion].name}
            </p>
            <p className={`text-center text-sm mt-2 ${EMOTIONS[dominantEmotion].textColor}`}>
              {t(language, 'totalEmotionsToday', { count: totalEmotions })}
            </p>
          </div>
        )}

        {/* כפתור סיכום יומי */}
        {totalEmotions > 0 && botMode === 'daily' && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => setShowDailyBot(true)}
              className="bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-600 hover:to-sky-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{t(language, 'talkWithBot')}</span>
            </button>
            <button
              onClick={() => setShowDailyBotHelp((prev) => !prev)}
              className="text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-2 text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'What is this bot?' : 'מה זה הבוט הזה?'}</span>
            </button>
            {showDailyBotHelp && (
              <div className={`max-w-xl border rounded-xl p-3 text-sm ${isRtl ? 'text-right' : 'text-left'} ${
                uiTheme === 'light'
                  ? 'bg-white/95 border-slate-300 text-slate-800'
                  : 'bg-slate-800/95 border-slate-500 text-slate-100'
              }`}>
                {t(language, 'dailyBotHelp')}
              </div>
            )}
          </div>
        )}

        {/* סיכום שיחות הבוט */}
        <BotDailySummary 
          key={summaryRefresh}
          onOpenBot={() => setShowDailyBot(true)}
        />

        {/* הודעה */}
        <div className="mt-6 bg-slate-900/70 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-4 text-center shadow-md">
          <p className="text-sm text-indigo-200">
            💡 {t(language, 'canEnterMultiple')}
          </p>
        </div>
      </div>

      {/* בוט רגש מיידי */}
      {showBot && selectedEmotion && (
        <MoodBot
          emotionId={selectedEmotion}
          onClose={() => {
            setShowBot(false);
            setSelectedEmotion(null);
            setSummaryRefresh(prev => prev + 1);
          }}
        />
      )}

      {/* בוט סיכום יומי */}
      {showDailyBot && (
        <DailySummaryBot
          onClose={() => {
            setShowDailyBot(false);
            setSummaryRefresh(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
};

export default Moodly;
