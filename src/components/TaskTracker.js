import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, X, Clock3, ListTodo, ChevronDown, ChevronUp } from 'lucide-react';
import { getBotDailySummary, saveTaskFeedback, updateBotConversationTask } from '../utils/storage';
import { EMOTIONS } from '../constants/emotions';
import { getLanguage, getUiTheme } from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';

const STATUS_LABEL = {
  he: {
    pending: 'ממתינה',
    in_progress: 'בתהליך',
    completed: 'הושלם'
  },
  en: {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed'
  }
};

const RESULT_OPTIONS = [
  { id: 'improved', label: { he: 'המצב השתפר', en: 'Improved' } },
  { id: 'same', label: { he: 'המצב נשאר דומה', en: 'About the same' } },
  { id: 'worse', label: { he: 'המצב החמיר', en: 'Worse' } }
];

const moodChangeFromResult = (resultStatus) => {
  if (resultStatus === 'improved') return 'better';
  if (resultStatus === 'worse') return 'worse';
  return 'same';
};

const TaskTracker = ({ onClose, isModal = true }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [resultStatus, setResultStatus] = useState(null);
  const [afterEmotionId, setAfterEmotionId] = useState(null);
  const [reactionBurst, setReactionBurst] = useState([]);
  const [expandedTaskIds, setExpandedTaskIds] = useState({});
  const language = getLanguage();
  const uiTheme = getUiTheme();
  const isLight = uiTheme === 'light';
  const isRtl = isRtlLanguage(language);

  const loadTasks = () => {
    const conversations = getBotDailySummary();
    const todayTasks = conversations
      .filter(conv => conv.task)
      .map(conv => ({
        id: conv.id || conv.timestamp,
        emotionName: conv.emotionName,
        emotionId: conv.emotionId || null,
        task: conv.task || '',
        recommendation: conv.recommendation || '',
        userAnswer: conv.userAnswer || '',
        context: conv.context || '',
        sleepHours: conv.sleepHours ?? null,
        energyLevel: conv.energyLevel ?? null,
        stressLevel: conv.stressLevel ?? null,
        helpNow: conv.helpNow || '',
        timestamp: conv.timestamp,
        updatedAt: conv.updatedAt || null,
        taskStatus: conv.taskStatus || (conv.taskCompleted ? 'completed' : 'pending'),
        taskCompleted: Boolean(conv.taskCompleted),
        resultStatus: conv.resultStatus || null,
        afterEmotionId: conv.afterEmotionId || null,
        feedback: conv.feedback || conv.taskFeedback || '',
        moodChange: conv.moodChange || null
      }))
      .sort((a, b) => new Date(b.updatedAt || b.timestamp || 0) - new Date(a.updatedAt || a.timestamp || 0));
    setTasks(todayTasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateTask = (taskId, updates) => {
    const ok = updateBotConversationTask(taskId, updates);
    if (!ok) return;
    loadTasks();
  };

  const openCompletion = (task) => {
    setSelectedTask(task);
    setFeedback(task.feedback || '');
    setResultStatus(task.resultStatus || null);
    setAfterEmotionId(task.afterEmotionId || null);
  };

  const closeCompletion = () => {
    setSelectedTask(null);
    setFeedback('');
    setResultStatus(null);
    setAfterEmotionId(null);
  };

  const toggleExpanded = (taskId) => {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleSubmitCompletion = () => {
    if (!selectedTask || !resultStatus || !afterEmotionId) return;
    const normalizedFeedback = feedback.trim();

    updateTask(selectedTask.id, {
      taskStatus: 'completed',
      taskCompleted: true,
      taskMovedToTracker: true,
      resultStatus,
      afterEmotionId,
      feedback: normalizedFeedback,
      moodChange: moodChangeFromResult(resultStatus)
    });

    saveTaskFeedback({
      taskId: selectedTask.id,
      task: selectedTask.task,
      feedback: normalizedFeedback,
      moodChange: moodChangeFromResult(resultStatus),
      resultStatus,
      afterEmotionId,
      completedAt: new Date().toISOString()
    });

    const emojis = ['🎉', '✨', '😍', '👏', '💫', '🥳', '😊', '💚', '⭐️', '🔥', '🌈', '🟣', '🟦', '🟢', '🫶', '🚀'];
    const burst = Array.from({ length: 18 }, (_, idx) => ({
      id: `${Date.now()}-${idx}`,
      emoji: emojis[idx % emojis.length],
      left: 5 + Math.random() * 90,
      duration: 1.8 + Math.random() * 1.4,
      delay: Math.random() * 0.6
    }));
    setReactionBurst(burst);
    window.setTimeout(() => setReactionBurst([]), 3200);

    closeCompletion();
  };

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(task => task.taskStatus === 'pending').length,
      inProgress: tasks.filter(task => task.taskStatus === 'in_progress').length,
      completed: tasks.filter(task => task.taskStatus === 'completed').length
    };
  }, [tasks]);

  const groupedTasks = useMemo(() => {
    return {
      pending: tasks.filter(task => task.taskStatus === 'pending'),
      in_progress: tasks.filter(task => task.taskStatus === 'in_progress'),
      completed: tasks.filter(task => task.taskStatus === 'completed')
    };
  }, [tasks]);

  const overlayClassName = `fixed inset-0 ${isLight ? 'bg-slate-950/35' : 'bg-black/50'} backdrop-blur-sm flex items-center justify-center z-50 p-4`;
  const screenWrapperClassName = 'min-h-screen p-4';
  const screenInnerClassName = 'max-w-4xl mx-auto pt-6';
  const cardClassName = `rounded-3xl shadow-2xl w-full ${isModal ? 'max-w-2xl max-h-[90vh]' : ''} overflow-hidden flex flex-col border ${
    isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900 border-slate-700'
  } relative`;

  if (tasks.length === 0) {
    const emptyBody = (
      <div className={`${isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900 border-slate-700'} rounded-3xl shadow-2xl w-full max-w-md p-8 border`}>
        <div className="text-center">
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isLight ? 'text-emerald-600' : 'text-green-500'}`} />
          <h2 className={`text-2xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {language === 'en' ? 'No Tasks Yet' : 'אין משימות עדיין'}
          </h2>
          <p className={`mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {language === 'en' ? 'Add a mood entry to get personalized tasks.' : 'הוסיפי מצב רוח כדי לקבל משימות מותאמות.'}
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold"
              type="button"
            >
              {language === 'en' ? 'Back' : 'חזרה'}
            </button>
          )}
        </div>
      </div>
    );

    if (isModal) {
      return <div className={overlayClassName}>{emptyBody}</div>;
    }

    return (
      <div className={screenWrapperClassName}>
        <div className={screenInnerClassName}>{emptyBody}</div>
      </div>
    );
  }

  const trackerCard = (
    <div className={cardClassName}>
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

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{language === 'en' ? 'Task Tracker' : 'מעקב משימות'}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label={language === 'en' ? 'Close' : 'סגור'}
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${isLight ? 'bg-white/75' : ''}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`rounded-xl p-4 border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
              <p className={`text-xs mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{language === 'en' ? 'Total' : 'סה״כ'}</p>
              <p className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{taskStats.total}</p>
            </div>
            <div className={`rounded-xl p-4 border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
              <p className={`text-xs mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{language === 'en' ? 'Pending' : 'ממתינות'}</p>
              <p className={`text-2xl font-bold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>{taskStats.pending}</p>
            </div>
            <div className={`rounded-xl p-4 border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
              <p className={`text-xs mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{language === 'en' ? 'In Progress' : 'בתהליך'}</p>
              <p className={`text-2xl font-bold ${isLight ? 'text-sky-700' : 'text-sky-300'}`}>{taskStats.inProgress}</p>
            </div>
            <div className={`rounded-xl p-4 border ${isLight ? 'bg-white/90 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
              <p className={`text-xs mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{language === 'en' ? 'Completed' : 'הושלמו'}</p>
              <p className={`text-2xl font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>{taskStats.completed}</p>
            </div>
          </div>

          {[
	            {
	              key: 'pending',
	              title: language === 'en' ? 'Pending Tasks' : 'משימות ממתינות',
	              icon: <Clock3 className={`w-5 h-5 ${isLight ? 'text-amber-700' : 'text-amber-300'}`} />
	            },
	            {
	              key: 'in_progress',
	              title: language === 'en' ? 'In Progress' : 'משימות בתהליך',
	              icon: <ListTodo className={`w-5 h-5 ${isLight ? 'text-sky-700' : 'text-sky-300'}`} />
	            },
	            {
	              key: 'completed',
	              title: language === 'en' ? 'Completed Tasks' : 'משימות שהושלמו',
	              icon: <CheckCircle className={`w-5 h-5 ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`} />
	            }
	          ].map((section) => (
            <div key={section.key}>
              <div className="flex items-center gap-2 mb-3">
                {section.icon}
                <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{section.title}</h3>
                <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  ({groupedTasks[section.key].length})
                </span>
              </div>

              {groupedTasks[section.key].length === 0 ? (
                <div className="bg-slate-800/70 rounded-xl p-4 border border-dashed border-slate-700 text-slate-400 text-sm">
                  {language === 'en' ? 'No tasks in this status.' : 'אין משימות בסטטוס הזה.'}
                </div>
              ) : (
                <div className="space-y-3">
	                  {groupedTasks[section.key].map((task) => {
	                    const emotion = EMOTIONS[task.emotionId];
	                    const isCompleted = task.taskStatus === 'completed';
	                    const isExpanded = Boolean(expandedTaskIds[task.id]);
	                    const selectedAfterEmotion = task.afterEmotionId ? EMOTIONS[task.afterEmotionId] : null;
	                    const completedSummaryAvailable = Boolean(task.resultStatus || task.afterEmotionId || (task.feedback || '').trim());

	                    const statusChipClass =
	                      task.taskStatus === 'completed'
	                        ? 'bg-gradient-to-r from-emerald-600/25 to-teal-500/15 text-emerald-200 border border-emerald-400/35'
	                        : task.taskStatus === 'in_progress'
	                          ? 'bg-gradient-to-r from-sky-600/25 to-indigo-500/15 text-sky-200 border border-sky-400/35'
	                          : 'bg-gradient-to-r from-amber-600/25 to-yellow-500/15 text-amber-200 border border-amber-400/35';

	                    return (
	                      <div
	                        key={task.id}
	                        className="bg-slate-800 rounded-xl p-5 border border-slate-700"
	                      >
	                        <div className="flex items-start gap-4">
	                          <div className="flex-shrink-0">
	                            <span className="text-3xl">{emotion?.emoji || '🙂'}</span>
	                          </div>
	                          <div className="flex-1">
	                            <div className="flex items-start justify-between gap-3 mb-2">
	                              <div className="flex items-center flex-wrap gap-2">
	                                <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-lg text-xs font-semibold">
	                                  {language === 'en' && task.emotionId && EMOTIONS[task.emotionId]
	                                    ? EMOTIONS[task.emotionId].nameEn || task.emotionName
	                                    : task.emotionName}
	                                </span>
	                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusChipClass}`}>
	                                  {STATUS_LABEL[language][task.taskStatus] || STATUS_LABEL[language].pending}
	                                </span>
	                              </div>
	                              <button
	                                onClick={() => toggleExpanded(task.id)}
	                                className="shrink-0 p-2 rounded-lg border border-slate-600 bg-slate-900/40 hover:bg-slate-900/70 text-slate-200 transition-colors"
	                                aria-label={isExpanded ? (language === 'en' ? 'Collapse task' : 'הסתר משימה') : (language === 'en' ? 'Expand task' : 'הרחב משימה')}
	                                type="button"
	                              >
	                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
	                              </button>
	                            </div>

	                            <p className={`font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'} ${isExpanded ? 'mb-3' : ''}`}>
	                              {task.task}
	                            </p>

	                            {isExpanded && (
	                              !isCompleted ? (
	                                <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
	                                  <button
	                                    onClick={() => updateTask(task.id, { taskStatus: 'pending' })}
	                                    className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
	                                      task.taskStatus === 'pending'
	                                        ? 'bg-gradient-to-r from-amber-600/35 to-yellow-500/20 text-amber-100 border-amber-300/40 shadow-[0_10px_24px_rgba(245,158,11,0.12)]'
	                                        : 'bg-slate-900/40 text-slate-200 border-slate-600 hover:bg-slate-900/70'
	                                    }`}
	                                    type="button"
	                                  >
	                                    {STATUS_LABEL[language].pending}
	                                  </button>
	                                  <button
	                                    onClick={() => updateTask(task.id, { taskStatus: 'in_progress' })}
	                                    className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
	                                      task.taskStatus === 'in_progress'
	                                        ? 'bg-gradient-to-r from-sky-600/35 to-indigo-500/20 text-sky-100 border-sky-300/40 shadow-[0_10px_24px_rgba(56,189,248,0.12)]'
	                                        : 'bg-slate-900/40 text-slate-200 border-slate-600 hover:bg-slate-900/70'
	                                    }`}
	                                    type="button"
	                                  >
	                                    {STATUS_LABEL[language].in_progress}
	                                  </button>
	                                  <button
	                                    onClick={() => openCompletion(task)}
	                                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_12px_30px_rgba(16,185,129,0.18)]"
	                                    type="button"
	                                  >
	                                    {language === 'en' ? 'Completed' : 'הושלם'}
	                                  </button>
	                                </div>
	                              ) : (
	                                <div className="space-y-3">
	                                  {completedSummaryAvailable && (
	                                    <div className="rounded-2xl bg-slate-950/25 border border-slate-700 p-4">
	                                      <div className={`text-sm font-bold text-slate-100 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
	                                        {language === 'en' ? 'Completed Summary' : 'סיכום השלמה'}
	                                      </div>

	                                      {task.resultStatus && (
	                                        <div className={`text-sm text-slate-200 ${isRtl ? 'text-right' : 'text-left'}`}>
	                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'After the task: ' : 'אחרי המשימה: '}</span>
	                                          {RESULT_OPTIONS.find((opt) => opt.id === task.resultStatus)?.label?.[language] || task.resultStatus}
	                                        </div>
	                                      )}

	                                      {selectedAfterEmotion && (
	                                        <div className={`text-sm text-slate-200 mt-1 ${isRtl ? 'text-right' : 'text-left'}`}>
	                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'Now you feel: ' : 'עכשיו אני מרגיש/ה: '}</span>
	                                          {selectedAfterEmotion.emoji} {language === 'en' ? selectedAfterEmotion.nameEn || selectedAfterEmotion.name : selectedAfterEmotion.name}
	                                        </div>
	                                      )}

	                                      {(task.feedback || '').trim() && (
	                                        <div className={`text-sm text-slate-200 mt-1 ${isRtl ? 'text-right' : 'text-left'}`}>
	                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'Notes: ' : 'הערות: '}</span>
	                                          {task.feedback}
	                                        </div>
	                                      )}

	                                      {(task.userAnswer || '').trim() && (
	                                        <div className={`text-sm text-slate-200 mt-2 ${isRtl ? 'text-right' : 'text-left'}`}>
	                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'You shared: ' : 'מה שיתפת: '}</span>
	                                          {task.userAnswer}
	                                        </div>
	                                      )}

	                                      {(task.recommendation || '').trim() && (
	                                        <div className={`text-sm text-slate-200 mt-2 ${isRtl ? 'text-right' : 'text-left'}`}>
	                                          <span className="font-semibold text-slate-100">{language === 'en' ? 'Bot said: ' : 'הבוט אמר: '}</span>
	                                          {task.recommendation}
	                                        </div>
	                                      )}
	                                    </div>
	                                  )}

	                                  <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
	                                    <button
	                                      onClick={() => openCompletion(task)}
	                                      className="px-3 py-2 rounded-xl text-sm font-semibold bg-slate-900/40 hover:bg-slate-900/70 border border-slate-600 text-white transition-colors"
	                                      type="button"
	                                    >
	                                      {language === 'en' ? 'Edit summary' : 'ערוך סיכום'}
	                                    </button>
	                                  </div>
	                                </div>
	                              )
	                            )}
	                          </div>
	                        </div>
	                      </div>
	                    );
	                  })}
                </div>
              )}
            </div>
          ))}
        </div>

      {/* טופס השלמה */}
        {selectedTask && (
          <div className={`border-t p-6 ${isLight ? 'border-slate-200 bg-white/85' : 'border-slate-700 bg-slate-800/50'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {language === 'en' ? 'Complete task' : 'השלמת משימה'}
            </h3>

            <div className="mb-4">
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} mb-2 text-sm`}>
                {language === 'en' ? 'After the task:' : 'אחרי המשימה:'}
              </p>
              <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                {RESULT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setResultStatus(option.id)}
                    className={`px-3 py-2 rounded-xl font-semibold transition-all border text-sm ${
                      resultStatus === option.id
                        ? 'bg-indigo-700 text-white border-indigo-400'
                        : isLight
                          ? 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600'
                    }`}
                    type="button"
                  >
                    {option.label[language]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className={`${isLight ? 'text-slate-700' : 'text-slate-300'} mb-2 text-sm`}>
                {language === 'en' ? 'What emotion do you feel now?' : 'איזה רגש את/ה מרגיש/ה עכשיו?'}
              </p>
              <div className={`flex flex-wrap gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                {Object.values(EMOTIONS).map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => setAfterEmotionId(emotion.id)}
                    className={`px-2 py-1 rounded-lg border text-sm ${
                      afterEmotionId === emotion.id
                        ? 'bg-indigo-700 text-white border-indigo-400'
                        : isLight
                          ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                          : 'bg-slate-800 text-slate-200 border-slate-600'
                    }`}
                    type="button"
                  >
                    {emotion.emoji} {language === 'en' ? emotion.nameEn || emotion.name : emotion.name}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={language === 'en' ? 'Short notes (optional)...' : 'הערות קצרות (אופציונלי)...'}
              className={`w-full border rounded-xl p-4 mb-4 resize-none ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500'
                  : 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400'
              }`}
              rows={3}
              dir={isRtl ? 'rtl' : 'ltr'}
            />

            <div className="flex gap-3">
              <button
                onClick={closeCompletion}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
                type="button"
              >
                {language === 'en' ? 'Cancel' : 'ביטול'}
              </button>
              <button
                onClick={handleSubmitCompletion}
                disabled={!(resultStatus && afterEmotionId)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                type="button"
              >
                {language === 'en' ? 'Save' : 'שמור'}
              </button>
            </div>
          </div>
        )}
    </div>
  );

  if (isModal) {
    return <div className={overlayClassName}>{trackerCard}</div>;
  }

  return (
    <div className={screenWrapperClassName}>
      <div className={screenInnerClassName}>{trackerCard}</div>
    </div>
  );
};

export default TaskTracker;
