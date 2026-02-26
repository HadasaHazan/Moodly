// ניהול שמירת נתונים ב-localStorage

import { getConversationTaskText } from './botTasks';

const APP_STORAGE_PREFIX = 'moodly';

const STORAGE_KEY = `${APP_STORAGE_PREFIX}Data`;
const CURRENT_USER_KEY = `${APP_STORAGE_PREFIX}CurrentUser`;
const AUTH_SESSION_KEY = `${APP_STORAGE_PREFIX}AuthSession`;
const USER_CONTEXTS_KEY = `${APP_STORAGE_PREFIX}UserContexts`;
const CLASS_AGGREGATES_KEY = `${APP_STORAGE_PREFIX}ClassAggregates`;
const GLOBAL_LANGUAGE_KEY = `${APP_STORAGE_PREFIX}GlobalLanguage`;
const GLOBAL_BG_PALETTE_KEY = `${APP_STORAGE_PREFIX}GlobalBgPalette`;
const GLOBAL_UI_THEME_KEY = `${APP_STORAGE_PREFIX}GlobalUiTheme`;
const GLOBAL_BG_MUSIC_KEY = `${APP_STORAGE_PREFIX}GlobalBgMusic`;
const GLOBAL_BOT_MODE_KEY = `${APP_STORAGE_PREFIX}GlobalBotMode`;

const getGlobalPreference = (key, fallback) => {
  const value = localStorage.getItem(key);
  return value || fallback;
};

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createDefaultUserData = (today) => ({
  dailyBottle: {},
  weeklyData: {},
  lastResetDate: today,
  botMode: getGlobalPreference(GLOBAL_BOT_MODE_KEY, 'immediate'), // 'immediate' or 'daily'
  botConversations: {},
  language: getGlobalPreference(GLOBAL_LANGUAGE_KEY, 'he'),
  uiTheme: getGlobalPreference(GLOBAL_UI_THEME_KEY, 'dark'),
  bgPalette: getGlobalPreference(GLOBAL_BG_PALETTE_KEY, 'calm'),
  bgMusic: getGlobalPreference(GLOBAL_BG_MUSIC_KEY, 'off')
});

const ensureUserData = (data, username, today = getTodayDate()) => {
  if (!data[username]) {
    data[username] = createDefaultUserData(today);
    return data[username];
  }

  if (!data[username].dailyBottle) data[username].dailyBottle = {};
  if (!data[username].weeklyData) data[username].weeklyData = {};
  if (!data[username].lastResetDate) data[username].lastResetDate = today;
  if (!data[username].botMode) data[username].botMode = getGlobalPreference(GLOBAL_BOT_MODE_KEY, 'immediate');
  if (!data[username].botConversations) data[username].botConversations = {};
  if (!data[username].language) data[username].language = getGlobalPreference(GLOBAL_LANGUAGE_KEY, 'he');
  if (!data[username].uiTheme) data[username].uiTheme = getGlobalPreference(GLOBAL_UI_THEME_KEY, 'dark');
  if (!data[username].bgPalette) data[username].bgPalette = getGlobalPreference(GLOBAL_BG_PALETTE_KEY, 'calm');
  if (!data[username].bgMusic) data[username].bgMusic = getGlobalPreference(GLOBAL_BG_MUSIC_KEY, 'off');

  return data[username];
};

// קבלת תאריך היום בפורמט YYYY-MM-DD
export const getTodayDate = () => {
  const today = new Date();
  return formatLocalDate(today);
};

// קבלת תאריך השבוע הנוכחי (יום ראשון)
export const getWeekStartDate = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday
  const diff = today.getDate() - day;
  const weekStart = new Date(today);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return formatLocalDate(weekStart);
};

// קבלת כל הנתונים
export const getData = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

// שמירת נתונים
export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// קבלת המשתמש הנוכחי
export const getCurrentUser = () => {
  return localStorage.getItem(CURRENT_USER_KEY) || null;
};

// הגדרת המשתמש הנוכחי
export const setCurrentUser = (username) => {
  if (!username) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }
  localStorage.setItem(CURRENT_USER_KEY, username);
};

export const getAuthSession = () => {
  try {
    const value = localStorage.getItem(AUTH_SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error reading auth session:', error);
    return null;
  }
};

export const setAuthSession = (session) => {
  if (!session || !session.userKey) return false;
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    setCurrentUser(session.userKey);
    return true;
  } catch (error) {
    console.error('Error saving auth session:', error);
    return false;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const isAuthenticated = () => {
  const session = getAuthSession();
  return Boolean(session?.userKey && (session.role === 'general' || session.role === 'personal'));
};

// Backward compatibility
export const isTeacherAuthenticated = isAuthenticated;

// התנתקות
export const logout = () => {
  clearAuthSession();
};

const getUserContexts = () => {
  try {
    const value = localStorage.getItem(USER_CONTEXTS_KEY);
    return value ? JSON.parse(value) : {};
  } catch (error) {
    console.error('Error reading user contexts:', error);
    return {};
  }
};

const saveUserContexts = (contexts) => {
  try {
    localStorage.setItem(USER_CONTEXTS_KEY, JSON.stringify(contexts));
    return true;
  } catch (error) {
    console.error('Error saving user contexts:', error);
    return false;
  }
};

const getClassAggregates = () => {
  try {
    const value = localStorage.getItem(CLASS_AGGREGATES_KEY);
    return value ? JSON.parse(value) : {};
  } catch (error) {
    console.error('Error reading class aggregates:', error);
    return {};
  }
};

const saveClassAggregates = (aggregates) => {
  try {
    localStorage.setItem(CLASS_AGGREGATES_KEY, JSON.stringify(aggregates));
    return true;
  } catch (error) {
    console.error('Error saving class aggregates:', error);
    return false;
  }
};

const normalizeClassValue = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, '-');

const getClassAggregateKey = (schoolId, classId) => `${normalizeClassValue(schoolId)}::${normalizeClassValue(classId)}`;

export const setUserContext = (userKey, context) => {
  if (!userKey || !context?.schoolId || !context?.classId || !context?.entryMode) return false;
  const contexts = getUserContexts();
  contexts[userKey] = {
    schoolId: context.schoolId,
    classId: context.classId,
    entryMode: context.entryMode
  };
  return saveUserContexts(contexts);
};

export const getUserContext = (userKey) => {
  const contexts = getUserContexts();
  return contexts[userKey] || null;
};

export const getCurrentUserContext = () => {
  const userKey = getCurrentUser();
  if (!userKey) return null;
  return getUserContext(userKey);
};

const addEmotionToClassAggregate = (schoolId, classId, date, emotionId, userKey) => {
  const aggregates = getClassAggregates();
  const classKey = getClassAggregateKey(schoolId, classId);

  if (!aggregates[classKey]) {
    aggregates[classKey] = {};
  }

  if (!aggregates[classKey][date]) {
    aggregates[classKey][date] = {};
  }

  if (!aggregates[classKey][date][emotionId]) {
    aggregates[classKey][date][emotionId] = 0;
  }

  aggregates[classKey][date][emotionId] += 1;
  if (!aggregates[classKey].__participantsByDate) {
    aggregates[classKey].__participantsByDate = {};
  }
  if (!aggregates[classKey].__participantsByDate[date]) {
    aggregates[classKey].__participantsByDate[date] = {};
  }
  if (userKey) {
    aggregates[classKey].__participantsByDate[date][userKey] = true;
  }
  saveClassAggregates(aggregates);
};

export const getClassWeeklyData = (schoolId, classId) => {
  const aggregates = getClassAggregates();
  const classKey = getClassAggregateKey(schoolId, classId);
  const classData = aggregates[classKey] || {};

  const weekStart = getWeekStartDate();
  const weekStartDate = new Date(weekStart);
  weekStartDate.setHours(0, 0, 0, 0);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  const result = {};
  Object.entries(classData).forEach(([dateStr, emotions]) => {
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);
    if (dateObj >= weekStartDate && dateObj <= weekEndDate) {
      result[dateStr] = emotions;
    }
  });

  return result;
};

export const getCurrentClassWeeklyData = () => {
  const context = getCurrentUserContext();
  if (!context?.schoolId || !context?.classId) return {};
  return getClassWeeklyData(context.schoolId, context.classId);
};

const getClassWeeklyParticipantCount = (schoolId, classId) => {
  const weekStart = getWeekStartDate();
  const today = getTodayDate();
  const aggregates = getClassAggregates();
  const contexts = getUserContexts();
  const data = getData();
  const normalizedSchool = normalizeClassValue(schoolId);
  const normalizedClass = normalizeClassValue(classId);
  const classKey = getClassAggregateKey(normalizedSchool, normalizedClass);
  const classAggregate = aggregates[classKey] || {};
  const participantsByDateFromAggregate = classAggregate.__participantsByDate || {};
  const weekStartDate = new Date(weekStart);
  weekStartDate.setHours(0, 0, 0, 0);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  const aggregateByDate = {};
  const aggregateWeeklyParticipants = new Set();

  Object.entries(participantsByDateFromAggregate).forEach(([dateStr, userMap]) => {
    const dateObj = new Date(dateStr);
    dateObj.setHours(0, 0, 0, 0);
    if (Number.isNaN(dateObj.getTime())) return;
    if (dateObj < weekStartDate || dateObj > weekEndDate) return;
    const dayParticipants = Object.keys(userMap || {});
    aggregateByDate[dateStr] = dayParticipants.length;
    dayParticipants.forEach((userKey) => aggregateWeeklyParticipants.add(userKey));
  });

  if (Object.keys(aggregateByDate).length > 0) {
    return {
      weeklyUnique: aggregateWeeklyParticipants.size,
      todayUnique: aggregateByDate[today] || 0,
      byDate: aggregateByDate
    };
  }

  const hasAggregateEmotionData = Object.entries(classAggregate).some(([key, value]) => {
    if (key === '__participantsByDate') return false;
    return Object.values(value || {}).some((count) => Number(count || 0) > 0);
  });

  if (!hasAggregateEmotionData) {
    return { weeklyUnique: 0, todayUnique: 0, byDate: {} };
  }

  const weeklyParticipants = new Set();
  const participantsByDate = {};
  Object.entries(contexts).forEach(([userKey, context]) => {
    if (!context?.schoolId || !context?.classId) return;
    if (normalizeClassValue(context.schoolId) !== normalizedSchool) return;
    if (normalizeClassValue(context.classId) !== normalizedClass) return;

    const weekData = data[userKey]?.weeklyData?.[weekStart] || {};
    let hasWeekData = false;
    Object.entries(weekData).forEach(([dateStr, dayData]) => {
      const hasDayData = Object.values(dayData || {}).some((count) => Number(count || 0) > 0);
      if (!hasDayData) return;
      hasWeekData = true;
      if (!participantsByDate[dateStr]) participantsByDate[dateStr] = new Set();
      participantsByDate[dateStr].add(userKey);
    });
    if (hasWeekData) weeklyParticipants.add(userKey);
  });

  const byDate = {};
  Object.entries(participantsByDate).forEach(([dateStr, participants]) => {
    byDate[dateStr] = participants.size;
  });

  return {
    weeklyUnique: weeklyParticipants.size,
    todayUnique: byDate[today] || 0,
    byDate
  };
};

export const getCurrentClassWeeklyParticipantCount = () => {
  const context = getCurrentUserContext();
  if (!context?.schoolId || !context?.classId) return 0;
  return getClassWeeklyParticipantCount(context.schoolId, context.classId).weeklyUnique;
};

export const getCurrentClassWeeklyParticipantStats = () => {
  const context = getCurrentUserContext();
  if (!context?.schoolId || !context?.classId) {
    return { weeklyUnique: 0, todayUnique: 0, byDate: {} };
  }
  return getClassWeeklyParticipantCount(context.schoolId, context.classId);
};

// בדיקה אם היום הוא יום חדש (לאפס את הצנצנת)
export const isNewDay = (lastResetDate) => {
  if (!lastResetDate) return true;
  const today = getTodayDate();
  return lastResetDate !== today;
};

// הוספת רגש לצנצנת היום
export const addEmotionToBottle = (emotionId) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return {};
  const context = getCurrentUserContext();

  const today = getTodayDate();
  const userData = ensureUserData(data, username, today);

  // אם זה יום חדש, אפס את הצנצנת היומית
  if (isNewDay(userData.lastResetDate)) {
    userData.dailyBottle = {};
    userData.lastResetDate = today;
  }

  // הוסף את הרגש לצנצנת
  if (!userData.dailyBottle[today]) {
    userData.dailyBottle[today] = {};
  }

  if (!userData.dailyBottle[today][emotionId]) {
    userData.dailyBottle[today][emotionId] = 0;
  }

  userData.dailyBottle[today][emotionId]++;

  // עדכן את הנתונים השבועיים
  const weekStart = getWeekStartDate();
  if (!userData.weeklyData[weekStart]) {
    userData.weeklyData[weekStart] = {};
  }

  if (!userData.weeklyData[weekStart][today]) {
    userData.weeklyData[weekStart][today] = {};
  }

  if (!userData.weeklyData[weekStart][today][emotionId]) {
    userData.weeklyData[weekStart][today][emotionId] = 0;
  }

  userData.weeklyData[weekStart][today][emotionId]++;
  if (context?.schoolId && context?.classId) {
    addEmotionToClassAggregate(context.schoolId, context.classId, today, emotionId, username);
  }

  saveData(data);
  return userData.dailyBottle[today];
};

// קבלת נתוני הצנצנת של היום
export const getTodayBottle = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return {};

  const today = getTodayDate();
  const userData = data[username];

  if (!userData || !userData.dailyBottle?.[today]) {
    return {};
  }

  return userData.dailyBottle[today];
};

// קבלת הרגש הדומיננטי של היום
export const getDominantEmotion = () => {
  const todayBottle = getTodayBottle();
  if (Object.keys(todayBottle).length === 0) {
    return null;
  }

  let maxCount = 0;
  let dominantEmotion = null;

  Object.entries(todayBottle).forEach(([emotionId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantEmotion = emotionId;
    }
  });

  return dominantEmotion;
};

// קבלת נתוני השבוע הנוכחי
export const getWeeklyData = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return {};

  const weekStart = getWeekStartDate();

  if (!data[username] || !data[username].weeklyData?.[weekStart]) {
    return {};
  }

  return data[username].weeklyData[weekStart];
};

export const getEmotionPatternInsights = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return { negativeFrequent: [], weekdayRecurring: [] };

  const userData = data[username];
  const weeklyData = userData?.weeklyData || {};
  const dateMap = {};

  Object.values(weeklyData).forEach((weekBlock) => {
    Object.entries(weekBlock || {}).forEach(([dateStr, emotions]) => {
      if (!dateMap[dateStr]) dateMap[dateStr] = {};
      Object.entries(emotions || {}).forEach(([emotionId, count]) => {
        dateMap[dateStr][emotionId] = (dateMap[dateStr][emotionId] || 0) + Number(count || 0);
      });
    });
  });

  const dates = Object.keys(dateMap).sort();
  if (dates.length === 0) return { negativeFrequent: [], weekdayRecurring: [] };

  const byEmotion = {};
  dates.forEach((dateStr) => {
    const emotions = dateMap[dateStr] || {};
    const dateObj = new Date(dateStr);
    const weekday = Number.isNaN(dateObj.getTime()) ? null : dateObj.getDay();
    Object.entries(emotions).forEach(([emotionId, count]) => {
      if (!byEmotion[emotionId]) {
        byEmotion[emotionId] = {
          totalCount: 0,
          daysCount: 0,
          weekdayCounts: {}
        };
      }
      byEmotion[emotionId].totalCount += count;
      if (count > 0) {
        byEmotion[emotionId].daysCount += 1;
        if (weekday !== null) {
          byEmotion[emotionId].weekdayCounts[weekday] = (byEmotion[emotionId].weekdayCounts[weekday] || 0) + 1;
        }
      }
    });
  });

  const negativeEmotionIds = ['sad', 'stress', 'anger', 'despair'];

  const negativeFrequent = negativeEmotionIds
    .map((emotionId) => ({
      emotionId,
      totalCount: byEmotion[emotionId]?.totalCount || 0,
      daysCount: byEmotion[emotionId]?.daysCount || 0
    }))
    .filter((item) => item.daysCount >= 3 || item.totalCount >= 5)
    .sort((a, b) => b.totalCount - a.totalCount);

  const weekdayRecurring = Object.entries(byEmotion)
    .map(([emotionId, stats]) => {
      const best = Object.entries(stats.weekdayCounts || {}).sort((a, b) => b[1] - a[1])[0];
      if (!best) return null;
      return {
        emotionId,
        weekday: Number(best[0]),
        times: Number(best[1]),
        totalCount: stats.totalCount
      };
    })
    .filter((item) => item && item.times >= 2)
    .sort((a, b) => b.times - a.times);

  return { negativeFrequent, weekdayRecurring };
};

// קבלת מצב הבוט של המשתמש
export const getBotMode = () => {
  const data = getData();
  const username = getCurrentUser();
  const globalValue = getGlobalPreference(GLOBAL_BOT_MODE_KEY, 'immediate');
  if (!username) {
    return globalValue;
  }
  return data[username]?.botMode || globalValue;
};

// עדכון מצב הבוט
export const setBotMode = (mode) => {
  const data = getData();
  const username = getCurrentUser();
  localStorage.setItem(GLOBAL_BOT_MODE_KEY, mode);
  if (!username) {
    window.dispatchEvent(new Event('botmodechange'));
    return;
  }

  const userData = ensureUserData(data, username);
  userData.botMode = mode;
  saveData(data);
  window.dispatchEvent(new Event('botmodechange'));
};

export const getLanguage = () => {
  const data = getData();
  const username = getCurrentUser();
  const globalValue = getGlobalPreference(GLOBAL_LANGUAGE_KEY, 'he');
  if (!username) {
    return globalValue;
  }
  return data[username]?.language || globalValue;
};

export const setLanguage = (language) => {
  const data = getData();
  const username = getCurrentUser();
  localStorage.setItem(GLOBAL_LANGUAGE_KEY, language);
  if (!username) {
    return;
  }

  const userData = ensureUserData(data, username);
  userData.language = language;
  saveData(data);
};

export const getUiTheme = () => {
  const data = getData();
  const username = getCurrentUser();
  const globalValue = getGlobalPreference(GLOBAL_UI_THEME_KEY, 'dark');
  if (!username) {
    return globalValue;
  }
  return data[username]?.uiTheme || globalValue;
};

export const setUiTheme = (theme) => {
  const data = getData();
  const username = getCurrentUser();
  localStorage.setItem(GLOBAL_UI_THEME_KEY, theme);
  if (!username) {
    return;
  }

  const userData = ensureUserData(data, username);
  userData.uiTheme = theme;
  saveData(data);
};

export const getBackgroundPalette = () => {
  const data = getData();
  const username = getCurrentUser();
  const globalValue = getGlobalPreference(GLOBAL_BG_PALETTE_KEY, 'calm');
  if (!username) {
    return globalValue;
  }
  return data[username]?.bgPalette || globalValue;
};

export const setBackgroundPalette = (palette) => {
  const data = getData();
  const username = getCurrentUser();
  localStorage.setItem(GLOBAL_BG_PALETTE_KEY, palette);
  if (!username) {
    return;
  }

  const userData = ensureUserData(data, username);
  userData.bgPalette = palette;
  saveData(data);
};

export const getBackgroundMusic = () => {
  const data = getData();
  const username = getCurrentUser();
  const globalValue = getGlobalPreference(GLOBAL_BG_MUSIC_KEY, 'off');
  if (!username) {
    return globalValue;
  }
  return data[username]?.bgMusic || globalValue;
};

export const setBackgroundMusic = (musicId) => {
  const data = getData();
  const username = getCurrentUser();
  localStorage.setItem(GLOBAL_BG_MUSIC_KEY, musicId);
  if (!username) {
    return;
  }

  const userData = ensureUserData(data, username);
  userData.bgMusic = musicId;
  saveData(data);
};

// קבלת סיכום שבועי
export const getWeeklySummary = () => {
  const weeklyData = getWeeklyData();
  const summary = {};

  Object.values(weeklyData).forEach((dayData) => {
    Object.entries(dayData).forEach(([emotionId, count]) => {
      if (!summary[emotionId]) {
        summary[emotionId] = 0;
      }
      summary[emotionId] += count;
    });
  });

  return summary;
};

// קבלת סיכום יומי
export const getDailySummary = () => {
  const todayBottle = getTodayBottle();
  const summary = {};

  Object.entries(todayBottle).forEach(([emotionId, count]) => {
    summary[emotionId] = count;
  });

  return summary;
};

// קבלת סיכום שיחות הבוט של היום
export const getBotDailySummary = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return [];

  const today = getTodayDate();
  const language = getLanguage();

  if (!data[username] || !data[username].botConversations) {
    return [];
  }

  const conversations = data[username].botConversations[today] || [];
  let hasChanges = false;

  const normalized = conversations.map((conversation) => {
    const derivedTask = getConversationTaskText(conversation, language);
    const shouldPatchTask = Boolean(derivedTask) && String(conversation.task || '').trim() !== derivedTask;

    if (conversation.id && conversation.taskStatus && !shouldPatchTask) {
      return conversation;
    }

    hasChanges = true;
    return {
      id: conversation.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...conversation,
      taskStatus: conversation.taskStatus || 'pending',
      taskMovedToTracker: Boolean(conversation.taskMovedToTracker),
      feedback: conversation.feedback || '',
      afterEmotionId: conversation.afterEmotionId || null,
      updatedAt: conversation.updatedAt || null,
      task: derivedTask || conversation.task || ''
    };
  });

  if (hasChanges) {
    data[username].botConversations[today] = normalized;
    saveData(data);
  }

  return normalized;
};

// שמירת שיחה עם הבוט
export const saveBotConversation = (conversation) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return;

  const today = getTodayDate();
  const userData = ensureUserData(data, username, today);

  if (!userData.botConversations[today]) {
    userData.botConversations[today] = [];
  }

  const normalizedConversation = {
    id: conversation.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    taskStatus: 'pending',
    taskMovedToTracker: false,
    feedback: '',
    afterEmotionId: null,
    updatedAt: null,
    ...conversation
  };

  userData.botConversations[today].push(normalizedConversation);
  saveData(data);
};

// עדכון ביצוע משימה ופידבק
export const updateBotConversationTask = (conversationId, updates) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username || !conversationId) return false;

  const today = getTodayDate();
  const userData = data[username];
  if (!userData?.botConversations?.[today]) return false;

  const idx = userData.botConversations[today].findIndex((conv) => conv.id === conversationId);
  if (idx === -1) return false;

  userData.botConversations[today][idx] = {
    ...userData.botConversations[today][idx],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveData(data);
  return true;
};

// שמירת פידבק על משימה
export const saveTaskFeedback = (feedbackData) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return;

  const today = getTodayDate();
  const userData = ensureUserData(data, username, today);

  if (!userData.taskFeedbacks) {
    userData.taskFeedbacks = {};
  }
  if (!userData.taskFeedbacks[today]) {
    userData.taskFeedbacks[today] = [];
  }

  userData.taskFeedbacks[today].push({
    ...feedbackData,
    timestamp: new Date().toISOString()
  });

  // עדכון המשימה כמושלמת
  if (userData.botConversations?.[today]) {
    const conversation = userData.botConversations[today].find(
      conv => conv.id === feedbackData.taskId || conv.timestamp === feedbackData.taskId
    );
    if (conversation) {
      conversation.taskCompleted = true;
      conversation.taskStatus = 'completed';
      conversation.taskMovedToTracker = true;
      conversation.feedback = feedbackData.feedback;
      conversation.taskFeedback = feedbackData.feedback;
      conversation.moodChange = feedbackData.moodChange;
      if (feedbackData.resultStatus) conversation.resultStatus = feedbackData.resultStatus;
      if (feedbackData.afterEmotionId) conversation.afterEmotionId = feedbackData.afterEmotionId;
    }
  }

  saveData(data);
};
