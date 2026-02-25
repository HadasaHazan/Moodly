import React, { useEffect, useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, CheckCircle, Lightbulb } from 'lucide-react';
import { EMOTIONS } from '../constants/emotions';
import { getBotDailySummary, updateBotConversationTask, getLanguage, getUiTheme } from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';

const TASK_STATUS_LABEL = {
  he: {
    pending: 'ממתינה לביצוע',
    in_progress: 'בביצוע',
    completed: 'בוצעה'
  },
  en: {
    pending: 'Pending',
    in_progress: 'In progress',
    completed: 'Completed'
  }
};

const SECTION_LABEL = {
  he: {
    pending: 'עוד לא ביצעתי',
    in_progress: 'בביצוע',
    completed: 'ביצעתי'
  },
  en: {
    pending: 'Not done yet',
    in_progress: 'In progress',
    completed: 'Done'
  }
};

const RESULT_OPTIONS = [
  { id: 'improved', label: { he: 'המצב השתפר', en: 'Improved' } },
  { id: 'same', label: { he: 'המצב נשאר דומה', en: 'About the same' } },
  { id: 'worse', label: { he: 'המצב החמיר', en: 'Worse' } }
];

const BotDailySummary = ({ onOpenBot }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [reactionBurst, setReactionBurst] = useState([]);
  const [movedTaskId, setMovedTaskId] = useState(null);
  const language = getLanguage();
  const uiTheme = getUiTheme();
  const isLight = uiTheme === 'light';
  const isRtl = isRtlLanguage(language);

  const loadConversations = () => {
    setConversations(getBotDailySummary());
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const updateConversation = (conversationId, updates) => {
    const previous = conversations.find((conv) => conv.id === conversationId);
    const updated = updateBotConversationTask(conversationId, updates);
    if (updated) {
      loadConversations();

      if (updates.taskStatus === 'completed' && previous?.taskStatus !== 'completed') {
        const emojis = ['🎉', '✨', '😍', '👏', '💫', '🥳', '😊', '💚'];
        const burst = Array.from({ length: 16 }, (_, idx) => ({
          id: `${Date.now()}-${idx}`,
          emoji: emojis[idx % emojis.length],
          left: 5 + Math.random() * 90,
          duration: 1.8 + Math.random() * 1.4,
          delay: Math.random() * 0.6
        }));
        setReactionBurst(burst);

        setTimeout(() => {
          setReactionBurst([]);
        }, 3200);
      }
    }
  };

  if (conversations.length === 0) {
    return null;
  }

  const isConversationInSection = (conv, sectionKey) => {
    const status = conv.taskStatus || 'pending';
    if (status !== sectionKey) return false;
    if (!conv.task) return false;
    if (sectionKey === 'completed' && conv.taskMovedToTracker) return false;
    return true;
  };

  const groupedConversations = {
    pending: conversations.filter((conv) => isConversationInSection(conv, 'pending')),
    in_progress: conversations.filter((conv) => isConversationInSection(conv, 'in_progress')),
    completed: conversations.filter((conv) => isConversationInSection(conv, 'completed'))
  };

  const sections = [
    { key: 'pending', accent: 'text-yellow-300', border: 'border-yellow-500/30' },
    { key: 'in_progress', accent: 'text-blue-300', border: 'border-blue-500/30' },
    { key: 'completed', accent: 'text-emerald-300', border: 'border-emerald-500/30' }
  ];

  return (
    <div className="mt-6 bg-slate-900/75 backdrop-blur-sm rounded-2xl border border-indigo-500/30 overflow-hidden shadow-lg relative">
      {reactionBurst.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-30">
          {reactionBurst.map((item) => (
            <span
              key={item.id}
              className="absolute top-0 text-2xl animate-reaction-fall"
              style={{
                left: `${item.left}%`,
                animationDuration: `${item.duration}s`,
                animationDelay: `${item.delay}s`
              }}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <h3 className="text-xl font-bold text-slate-100">
              {language === 'en' ? 'Conversations & Tasks Tracking Today' : 'מעקב שיחות ומשימות להיום'}
            </h3>
            <p className="text-sm text-slate-400">
              {language === 'en'
                ? `${conversations.length} conversation${conversations.length === 1 ? '' : 's'} • task and emotion tracking`
                : `${conversations.length} ${conversations.length === 1 ? 'שיחה' : 'שיחות'} • מעקב ביצוע ופידבק רגשי`}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-indigo-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-indigo-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 pt-0 space-y-4 animate-slideUp">
          <div className="border-t border-slate-700 pt-4">
            <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-indigo-400" />
              {language === 'en' ? 'Your tasks + post-task reflection' : 'המשימות שלך + איך הרגשת אחרי הביצוע'}
            </h4>
            {movedTaskId && (
              <div className="mb-4 bg-emerald-900/20 border border-emerald-600/40 rounded-xl p-3 text-sm text-emerald-100">
                {language === 'en'
                  ? 'Task closed and moved to Home → Task Tracker.'
                  : 'המשימה נסגרה והועברה לעמוד הבית → מעקב משימות.'}
              </div>
            )}
            <div className="space-y-6">
              {sections.map((section) => {
                const sectionKey = section.key;
                const items = groupedConversations[sectionKey] || [];
                return (
                  <div key={sectionKey}>
                    <div className={`flex items-center justify-between mb-3 px-1 ${isRtl ? '' : 'flex-row-reverse'}`}>
                      <div className={`text-sm font-bold ${section.accent}`}>
                        {SECTION_LABEL[language][sectionKey]}
                      </div>
                      <div className="text-xs text-slate-400">({items.length})</div>
                    </div>

                    {items.length === 0 ? (
                      <div className={`bg-slate-800/60 rounded-xl p-4 border border-dashed ${section.border} text-slate-400 text-sm`}>
                        {language === 'en' ? 'No conversations here yet.' : 'אין כאן שיחות עדיין.'}
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {items.map((conv, index) => {
                          const selectedAfterEmotion = conv.afterEmotionId ? EMOTIONS[conv.afterEmotionId] : null;
                          const hasReflectionSummary = Boolean(conv.resultStatus || conv.afterEmotionId || (conv.feedback || '').trim());

                          return (
                            <li
                              key={conv.id || index}
                              className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-900/60 flex items-center justify-center">
                                  <span className="text-xl">
                                    {conv.emotionId && EMOTIONS[conv.emotionId]
                                      ? EMOTIONS[conv.emotionId].emoji
                                      : '💬'}
                                  </span>
                                </div>
                                <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                                  <div className={`flex items-center mb-2 gap-3 ${isRtl ? 'justify-between' : 'justify-between flex-row-reverse'}`}>
                                    <span className="px-2 py-1 bg-indigo-900/60 text-indigo-200 rounded-lg text-sm font-semibold">
                                      {language === 'en' && conv.emotionId && EMOTIONS[conv.emotionId] 
                                        ? EMOTIONS[conv.emotionId].nameEn || conv.emotionName
                                        : conv.emotionName}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      {language === 'en' ? 'Status:' : 'סטטוס:'} {TASK_STATUS_LABEL[language][conv.taskStatus] || TASK_STATUS_LABEL[language].pending}
                                    </span>
                                  </div>

                                  <p className="text-slate-300 mb-2 text-sm">
                                    <span className="font-semibold text-slate-100">{language === 'en' ? 'You shared: ' : 'מה שיתפת: '}</span>
                                    {conv.userAnswer}
                                  </p>

                                  <div className="bg-emerald-900/20 border border-emerald-600/40 rounded-lg p-3 mt-2">
                                    <div className={`flex items-start gap-2 ${isRtl ? '' : 'flex-row-reverse'}`}>
                                      <CheckCircle className={`w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 ${isRtl ? '' : 'order-2'}`} />
                                      <div className={isRtl ? '' : 'text-right'}>
                                        <p className="font-bold text-emerald-300 text-sm mb-1">{language === 'en' ? 'Suggested task:' : 'משימה שהבוט הציע:'}</p>
                                        <p className="text-emerald-100 text-sm">{conv.task}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {conv.taskStatus === 'completed' && hasReflectionSummary && (
                                    <div className="mt-3 rounded-lg bg-slate-950/30 border border-slate-700 p-3">
                                      <div className="text-sm font-bold text-slate-100 mb-2">
                                        {language === 'en' ? 'Conversation Summary' : 'סיכום קצר'}
                                      </div>
                                      {conv.resultStatus && (
                                        <div className="text-sm text-slate-200">
                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'After the task: ' : 'אחרי המשימה: '}</span>
                                          {RESULT_OPTIONS.find((opt) => opt.id === conv.resultStatus)?.label?.[language] || conv.resultStatus}
                                        </div>
                                      )}
                                      {selectedAfterEmotion && (
                                        <div className="text-sm text-slate-200 mt-1">
                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'Now you feel: ' : 'עכשיו את מרגישה: '}</span>
                                          {selectedAfterEmotion.emoji} {language === 'en' ? selectedAfterEmotion.nameEn || selectedAfterEmotion.name : selectedAfterEmotion.name}
                                        </div>
                                      )}
                                      {(conv.feedback || '').trim() && (
                                        <div className="text-sm text-slate-200 mt-1">
                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'Experience: ' : 'חוויה: '}</span>
                                          {conv.feedback}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className={`mt-3 flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                                    <button
                                      onClick={() => updateConversation(conv.id, { taskStatus: 'pending' })}
                                      className={`px-3 py-1.5 rounded-lg text-xs border ${
                                        conv.taskStatus === 'pending'
                                          ? isLight
                                            ? 'bg-white text-slate-800 border-slate-300'
                                            : 'bg-slate-700 text-slate-100 border-slate-500'
                                          : 'bg-slate-900 text-slate-400 border-slate-700'
                                      }`}
                                    >
                                      {SECTION_LABEL[language].pending}
                                    </button>
                                    <button
                                      onClick={() => updateConversation(conv.id, { taskStatus: 'in_progress' })}
                                      className={`px-3 py-1.5 rounded-lg text-xs border ${
                                        conv.taskStatus === 'in_progress'
                                          ? 'bg-blue-900/60 text-blue-100 border-blue-500/70'
                                          : 'bg-slate-900 text-slate-400 border-slate-700'
                                      }`}
                                    >
                                      {SECTION_LABEL[language].in_progress}
                                    </button>
                                    <button
                                      onClick={() => updateConversation(conv.id, { taskStatus: 'completed' })}
                                      className={`px-3 py-1.5 rounded-lg text-xs border ${
                                        conv.taskStatus === 'completed'
                                          ? 'bg-emerald-900/60 text-emerald-100 border-emerald-500/70'
                                          : 'bg-slate-900 text-slate-400 border-slate-700'
                                      }`}
                                    >
                                      {SECTION_LABEL[language].completed}
                                    </button>
                                  </div>

                                  {conv.taskStatus === 'completed' && (
                                    <div className="mt-4 space-y-3 bg-slate-900/70 border border-slate-700 rounded-lg p-3">
                                      <div className="text-sm font-semibold text-slate-200">{language === 'en' ? 'What happened after this task?' : 'מה קרה אחרי המשימה?'}</div>

                                      <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                                        {RESULT_OPTIONS.map((option) => (
                                          <button
                                            key={option.id}
                                            onClick={() => updateConversation(conv.id, { resultStatus: option.id })}
                                            className={`px-3 py-1 rounded-md text-xs border ${
                                              conv.resultStatus === option.id
                                                ? 'bg-indigo-700 text-white border-indigo-400'
                                                : 'bg-slate-800 text-slate-300 border-slate-600'
                                            }`}
                                          >
                                            {option.label[language]}
                                          </button>
                                        ))}
                                      </div>

                                      <div>
                                        <p className="text-xs text-slate-400 mb-2">{language === 'en' ? 'What emotion do you feel now?' : 'איזה רגש את מרגישה עכשיו?'}</p>
                                        <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                                          {Object.values(EMOTIONS).map((emotion) => (
                                            <button
                                              key={emotion.id}
                                              onClick={() => updateConversation(conv.id, { afterEmotionId: emotion.id })}
                                              className={`px-2 py-1 rounded-lg border text-sm ${
                                                conv.afterEmotionId === emotion.id
                                                  ? 'bg-indigo-700 text-white border-indigo-400'
                                                  : 'bg-slate-800 text-slate-200 border-slate-600'
                                              }`}
                                            >
                                              {emotion.emoji} {language === 'en' ? emotion.nameEn || emotion.name : emotion.name}
                                            </button>
                                          ))}
                                        </div>
                                        {selectedAfterEmotion && (
                                          <p className="text-xs text-slate-400 mt-2">
                                            {language === 'en' ? 'Selected post-task emotion:' : 'נבחר רגש אחרי ביצוע:'} {selectedAfterEmotion.emoji} {language === 'en' ? selectedAfterEmotion.nameEn || selectedAfterEmotion.name : selectedAfterEmotion.name}
                                          </p>
                                        )}
                                      </div>

                                      <textarea
                                        value={conv.feedback || ''}
                                        onChange={(e) => updateConversation(conv.id, { feedback: e.target.value })}
                                        rows={2}
                                        className="w-full rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm p-2 placeholder:text-slate-500"
                                        placeholder={language === 'en' ? 'Short feedback on this task (optional)' : 'פידבק קצר על המשימה (אופציונלי)'}
                                        dir={isRtl ? 'rtl' : 'ltr'}
                                      />

                                      <button
                                        onClick={() => {
                                          const canMove = Boolean(conv.resultStatus && conv.afterEmotionId);
                                          if (!canMove) return;
                                          setMovedTaskId(conv.id);
                                          updateConversation(conv.id, {
                                            taskCompleted: true,
                                            taskMovedToTracker: true
                                          });
                                          window.setTimeout(() => setMovedTaskId(null), 5000);
                                        }}
                                        disabled={!(conv.resultStatus && conv.afterEmotionId)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-semibold transition-colors"
                                      >
                                        {language === 'en' ? 'Close task & move to Task Tracker' : 'סגור משימה והעבר למעקב משימות'}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {onOpenBot && (
            <button
              onClick={onOpenBot}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {language === 'en' ? 'Another chat with bot' : 'שיחה נוספת עם הבוט'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BotDailySummary;
