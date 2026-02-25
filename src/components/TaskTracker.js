import React, { useState, useEffect } from 'react';
import { CheckCircle, X, TrendingUp, TrendingDown, Minus, Clock3, ListTodo } from 'lucide-react';
import { getBotDailySummary, saveTaskFeedback, updateBotConversationTask } from '../utils/storage';
import { EMOTIONS } from '../constants/emotions';
import { getLanguage } from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';

const TaskTracker = ({ onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [moodChange, setMoodChange] = useState(null);
  const language = getLanguage();
  const isRtl = isRtlLanguage(language);

  useEffect(() => {
    const conversations = getBotDailySummary();
    const todayTasks = conversations
      .filter(conv => conv.task)
      .map(conv => ({
        id: conv.id || conv.timestamp,
        emotion: conv.emotionName,
        emotionId: conv.emotionId,
        task: conv.task,
        recommendation: conv.recommendation,
        timestamp: conv.timestamp,
        taskStatus: conv.taskCompleted ? 'completed' : (conv.taskStatus || 'pending')
      }))
      .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    setTasks(todayTasks);
  }, []);

  const handleCompleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setSelectedTask(task);
  };

  const handleSubmitFeedback = () => {
    if (!selectedTask || !moodChange) return;
    const normalizedFeedback = feedback.trim();

    // עדכון השיחה
    updateBotConversationTask(selectedTask.id, {
      taskStatus: 'completed',
      taskCompleted: true,
      taskMovedToTracker: true,
      feedback: normalizedFeedback,
      moodChange: moodChange
    });

    // שמירת פידבק
    saveTaskFeedback({
      taskId: selectedTask.id,
      task: selectedTask.task,
      feedback: normalizedFeedback,
      moodChange: moodChange,
      completedAt: new Date().toISOString()
    });

    // עדכון המשימה כמושלמת בתוך הרשימה
    setTasks(prev => prev.map((task) => (
      task.id === selectedTask.id
        ? { ...task, taskStatus: 'completed' }
        : task
    )));
    setSelectedTask(null);
    setFeedback('');
    setMoodChange(null);
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(task => task.taskStatus === 'pending').length,
    inProgress: tasks.filter(task => task.taskStatus === 'in_progress').length,
    completed: tasks.filter(task => task.taskStatus === 'completed').length
  };

  const groupedTasks = {
    pending: tasks.filter(task => task.taskStatus === 'pending'),
    in_progress: tasks.filter(task => task.taskStatus === 'in_progress'),
    completed: tasks.filter(task => task.taskStatus === 'completed')
  };

  if (tasks.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-slate-700">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {language === 'en' ? 'No Tasks Yet' : 'אין משימות עדיין'}
            </h2>
            <p className="text-slate-400 mb-6">
              {language === 'en' ? 'Add a mood entry to get personalized tasks.' : 'הוסיפי מצב רוח כדי לקבל משימות מותאמות.'}
            </p>
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {language === 'en' ? 'Close' : 'סגור'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {language === 'en' ? 'Task Tracker' : 'מעקב משימות'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">{language === 'en' ? 'Total' : 'סה״כ'}</p>
              <p className="text-2xl font-bold text-white">{taskStats.total}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">{language === 'en' ? 'Pending' : 'ממתינות'}</p>
              <p className="text-2xl font-bold text-yellow-400">{taskStats.pending}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">{language === 'en' ? 'In Progress' : 'בתהליך'}</p>
              <p className="text-2xl font-bold text-blue-400">{taskStats.inProgress}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">{language === 'en' ? 'Completed' : 'הושלמו'}</p>
              <p className="text-2xl font-bold text-green-400">{taskStats.completed}</p>
            </div>
          </div>

          {[
            {
              key: 'pending',
              title: language === 'en' ? 'Pending Tasks' : 'משימות ממתינות',
              icon: <Clock3 className="w-5 h-5 text-yellow-300" />
            },
            {
              key: 'in_progress',
              title: language === 'en' ? 'In Progress' : 'משימות בתהליך',
              icon: <ListTodo className="w-5 h-5 text-blue-300" />
            },
            {
              key: 'completed',
              title: language === 'en' ? 'Completed Tasks' : 'משימות שהושלמו',
              icon: <CheckCircle className="w-5 h-5 text-green-300" />
            }
          ].map((section) => (
            <div key={section.key}>
              <div className="flex items-center gap-2 mb-3">
                {section.icon}
                <h3 className="text-white font-semibold">{section.title}</h3>
                <span className="text-xs text-slate-400">
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
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded-lg text-xs font-semibold">
                                {language === 'en' && task.emotionId && EMOTIONS[task.emotionId]
                                  ? EMOTIONS[task.emotionId].nameEn || task.emotion
                                  : task.emotion}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                task.taskStatus === 'completed'
                                  ? 'bg-green-900/50 text-green-300'
                                  : task.taskStatus === 'in_progress'
                                    ? 'bg-blue-900/50 text-blue-300'
                                    : 'bg-yellow-900/50 text-yellow-300'
                              }`}>
                                {task.taskStatus === 'completed'
                                  ? (language === 'en' ? 'Completed' : 'הושלם')
                                  : task.taskStatus === 'in_progress'
                                    ? (language === 'en' ? 'In Progress' : 'בתהליך')
                                    : (language === 'en' ? 'Pending' : 'ממתין')}
                              </span>
                            </div>
                            <p className={`mb-3 font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                              {task.task}
                            </p>
                            {!isCompleted && (
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                              >
                                {language === 'en' ? 'Mark as Completed' : 'סמן כהושלם'}
                              </button>
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

        {/* טופס פידבק */}
        {selectedTask && (
          <div className="border-t border-slate-700 p-6 bg-slate-800/50">
            <h3 className="text-lg font-bold text-white mb-4">
              {language === 'en' ? 'How did it go?' : 'איך זה הלך?'}
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={language === 'en' ? 'Share your experience (optional)...' : 'שתפי את החוויה שלך (אופציונלי)...'}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl p-4 text-slate-200 placeholder-slate-400 mb-4 resize-none"
              rows="3"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <div className="mb-4">
              <p className="text-slate-300 mb-2 text-sm">
                {language === 'en' ? 'Did your mood change?' : 'האם המצב רוח שלך השתנה?'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMoodChange('better')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    moodChange === 'better'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                  {language === 'en' ? 'Better' : 'טוב יותר'}
                </button>
                <button
                  onClick={() => setMoodChange('same')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    moodChange === 'same'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Minus className="w-5 h-5 mx-auto mb-1" />
                  {language === 'en' ? 'Same' : 'זהה'}
                </button>
                <button
                  onClick={() => setMoodChange('worse')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    moodChange === 'worse'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                  {language === 'en' ? 'Worse' : 'פחות טוב'}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setFeedback('');
                  setMoodChange(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
              >
                {language === 'en' ? 'Cancel' : 'ביטול'}
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!moodChange}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-colors"
              >
                {language === 'en' ? 'Submit' : 'שלח'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTracker;
