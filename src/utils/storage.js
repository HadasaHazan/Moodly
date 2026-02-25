// ניהול שמירת נתונים ב-localStorage

const APP_STORAGE_PREFIX = 'moodly';
const LEGACY_STORAGE_PREFIX = 'mood' + 'Bottle';

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

const LEGACY_STORAGE_KEY = `${LEGACY_STORAGE_PREFIX}Data`;
const LEGACY_CURRENT_USER_KEY = `${LEGACY_STORAGE_PREFIX}CurrentUser`;
const LEGACY_AUTH_SESSION_KEY = `${LEGACY_STORAGE_PREFIX}AuthSession`;
const LEGACY_USER_CONTEXTS_KEY = `${LEGACY_STORAGE_PREFIX}UserContexts`;
const LEGACY_CLASS_AGGREGATES_KEY = `${LEGACY_STORAGE_PREFIX}ClassAggregates`;
const LEGACY_GLOBAL_LANGUAGE_KEY = `${LEGACY_STORAGE_PREFIX}GlobalLanguage`;
const LEGACY_GLOBAL_BG_PALETTE_KEY = `${LEGACY_STORAGE_PREFIX}GlobalBgPalette`;
const LEGACY_GLOBAL_UI_THEME_KEY = `${LEGACY_STORAGE_PREFIX}GlobalUiTheme`;
const LEGACY_GLOBAL_BG_MUSIC_KEY = `${LEGACY_STORAGE_PREFIX}GlobalBgMusic`;
const LEGACY_GLOBAL_BOT_MODE_KEY = `${LEGACY_STORAGE_PREFIX}GlobalBotMode`;

const getItemWithLegacy = (key, legacyKey) => {
  const value = localStorage.getItem(key);
  if (value !== null) return { value, fromLegacy: false };
  if (!legacyKey) return { value: null, fromLegacy: false };
  const legacyValue = localStorage.getItem(legacyKey);
  if (legacyValue !== null) return { value: legacyValue, fromLegacy: true };
  return { value: null, fromLegacy: false };
};

const migrateLegacyItem = (key, legacyKey, rawValue) => {
  if (!legacyKey) return;
  if (rawValue === null) return;
  if (localStorage.getItem(key) !== null) return;
  if (localStorage.getItem(legacyKey) === null) return;
  try {
    localStorage.setItem(key, rawValue);
  } catch (error) {
    console.error('Error migrating localStorage key:', error);
  }
};

const removeItemBoth = (key, legacyKey) => {
  localStorage.removeItem(key);
  if (legacyKey) localStorage.removeItem(legacyKey);
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
  botMode: 'immediate', // 'immediate' or 'daily'
  botConversations: {},
  language: 'he',
  uiTheme: 'dark',
  bgPalette: 'calm',
  bgMusic: 'off'
});

const ensureUserData = (data, username, today = getTodayDate()) => {
  if (!data[username]) {
    data[username] = createDefaultUserData(today);
    return data[username];
  }

  if (!data[username].dailyBottle) data[username].dailyBottle = {};
  if (!data[username].weeklyData) data[username].weeklyData = {};
  if (!data[username].lastResetDate) data[username].lastResetDate = today;
  if (!data[username].botMode) data[username].botMode = 'immediate';
  if (!data[username].botConversations) data[username].botConversations = {};
  if (!data[username].language) data[username].language = 'he';
  if (!data[username].uiTheme) data[username].uiTheme = 'dark';
  if (!data[username].bgPalette) data[username].bgPalette = 'calm';
  if (!data[username].bgMusic) data[username].bgMusic = 'off';

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
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
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
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  return storedUser || null;
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
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
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
    const raw = localStorage.getItem(USER_CONTEXTS_KEY);
    return raw ? JSON.parse(raw) : {};
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
    const raw = localStorage.getItem(CLASS_AGGREGATES_KEY);
    return raw ? JSON.parse(raw) : {};
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

const addEmotionToClassAggregate = (schoolId, classId, date, emotionId) => {
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
    addEmotionToClassAggregate(context.schoolId, context.classId, today, emotionId);
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

// קבלת מצב הבוט של המשתמש
export const getBotMode = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return localStorage.getItem(GLOBAL_BOT_MODE_KEY) || 'immediate';
  return data[username]?.botMode || 'immediate';
};

// עדכון מצב הבוט
export const setBotMode = (mode) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) {
    localStorage.setItem(GLOBAL_BOT_MODE_KEY, mode);
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
  if (!username) return localStorage.getItem(GLOBAL_LANGUAGE_KEY) || 'he';
  return data[username]?.language || 'he';
};

export const setLanguage = (language) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) {
    localStorage.setItem(GLOBAL_LANGUAGE_KEY, language);
    return;
  }

  const userData = ensureUserData(data, username);
  userData.language = language;
  saveData(data);
};

export const getUiTheme = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return localStorage.getItem(GLOBAL_UI_THEME_KEY) || 'dark';
  return data[username]?.uiTheme || 'dark';
};

export const setUiTheme = (theme) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) {
    localStorage.setItem(GLOBAL_UI_THEME_KEY, theme);
    return;
  }

  const userData = ensureUserData(data, username);
  userData.uiTheme = theme;
  saveData(data);
};

export const getBackgroundPalette = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return localStorage.getItem(GLOBAL_BG_PALETTE_KEY) || 'calm';
  return data[username]?.bgPalette || 'calm';
};

export const setBackgroundPalette = (palette) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) {
    localStorage.setItem(GLOBAL_BG_PALETTE_KEY, palette);
    return;
  }

  const userData = ensureUserData(data, username);
  userData.bgPalette = palette;
  saveData(data);
};

export const getBackgroundMusic = () => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) return localStorage.getItem(GLOBAL_BG_MUSIC_KEY) || 'off';
  return data[username]?.bgMusic || 'off';
};

export const setBackgroundMusic = (musicId) => {
  const data = getData();
  const username = getCurrentUser();
  if (!username) {
    localStorage.setItem(GLOBAL_BG_MUSIC_KEY, musicId);
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

  if (!data[username] || !data[username].botConversations) {
    return [];
  }

  const conversations = data[username].botConversations[today] || [];
  let hasChanges = false;

  const normalized = conversations.map((conversation) => {
    if (conversation.id && conversation.taskStatus) {
      return conversation;
    }

    hasChanges = true;
    return {
      id: conversation.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      taskStatus: conversation.taskStatus || 'pending',
      taskMovedToTracker: Boolean(conversation.taskMovedToTracker),
      feedback: conversation.feedback || '',
      afterEmotionId: conversation.afterEmotionId || null,
      updatedAt: conversation.updatedAt || null,
      ...conversation
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
      conversation.taskFeedback = feedbackData.feedback;
      conversation.moodChange = feedbackData.moodChange;
    }
  }

  saveData(data);
};
