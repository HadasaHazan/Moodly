import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EMOTIONS, EMOTION_IDS } from '../constants/emotions';
import { getAuthSession, getCurrentClassWeeklyData, getLanguage, getWeeklyData, getTodayDate, getUiTheme } from '../utils/storage';
import { getSchoolName } from '../constants/schools';
import { translate as t } from '../constants/i18n';

const ChartsScreen = ({ onBack: _onBack, onBackToLogin }) => {
  const language = getLanguage();
  const uiTheme = getUiTheme();
  const isDark = uiTheme === 'dark';
  const isRtl = language === 'he';
  const authSession = getAuthSession();
  const isGeneral = authSession?.role === 'general';

  const [weeklyData, setWeeklyData] = useState({});
  const [viewMode, setViewMode] = useState('weekly'); // daily | weekly

  useEffect(() => {
    setWeeklyData(isGeneral ? getCurrentClassWeeklyData() : getWeeklyData());
  }, [isGeneral]);

  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const locale = language === 'he' ? 'he-IL' : 'en-US';

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - dayOfWeek + i);
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const emotions = weeklyData[dateStr] || {};

      days.push({
        date: dateStr,
        dayShort: date.toLocaleDateString(locale, { weekday: 'short' }),
        isToday: dateStr === getTodayDate(),
        emotions
      });
    }

    return days;
  }, [language, weeklyData]);

  const todayEmotions = useMemo(() => {
    const today = getTodayDate();
    return weeklyData[today] || {};
  }, [weeklyData]);

  const maxTodayCount = useMemo(
    () => Math.max(1, ...EMOTION_IDS.map((id) => todayEmotions[id] || 0)),
    [todayEmotions]
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto pt-6">
        {/* כפתור חזרה - מוסר כי יש ניווט קבוע */}

        <div
          className={`max-w-3xl mx-auto rounded-[30px] border p-5 backdrop-blur-sm ${
            isDark
              ? 'bg-gradient-to-br from-slate-950/80 via-slate-900/90 to-slate-950/70 border-slate-600 shadow-[0_34px_90px_rgba(0,0,0,0.55)] ring-1 ring-white/10'
              : 'bg-white/90 border-slate-400 shadow-[0_28px_70px_rgba(15,23,42,0.22)] ring-1 ring-slate-300/70'
          }`}
        >
          {isGeneral && onBackToLogin && (
            <div className={`mb-4 flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
              <button
                onClick={onBackToLogin}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/70 text-slate-100 hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          {isGeneral && authSession?.schoolId && authSession?.classId && (
            <div className={`mb-4 text-sm ${isDark ? 'text-cyan-200' : 'text-cyan-800'}`}>
              {language === 'en'
                ? `Class Overview: ${getSchoolName(authSession.schoolId, language)} / ${authSession.classId}`
                : `מבט כיתתי: ${getSchoolName(authSession.schoolId, language)} / ${authSession.classId}`}
            </div>
          )}
          <div className={`flex flex-wrap items-center gap-3 mb-5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-full border p-1 flex ${isDark ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-slate-100'}`}>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 text-xs rounded-full font-semibold ${viewMode === 'daily' ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-300' : 'text-slate-700')}`}
              >
                {t(language, 'dailySummary')}
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 text-xs rounded-full font-semibold ${viewMode === 'weekly' ? 'bg-indigo-600 text-white' : (isDark ? 'text-slate-300' : 'text-slate-700')}`}
              >
                {t(language, 'weeklySummary')}
              </button>
            </div>
          </div>

          {viewMode === 'weekly' ? (
            <div className="grid grid-cols-7 gap-1 mb-4" dir={isRtl ? 'rtl' : 'ltr'}>
              {weekDays.map((day) => {
                const total = Object.values(day.emotions).reduce((sum, count) => sum + count, 0);
                const emotionsForDay = EMOTION_IDS.filter((emotionId) => (day.emotions[emotionId] || 0) > 0);
                return (
                  <div key={day.date} className="text-center">
                    <div 
                      className="w-10 mx-auto h-[150px] sm:h-[170px] rounded-xl relative overflow-hidden mb-1 p-1 border-2"
                      style={{
                        backgroundColor: total > 0
                          ? (isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.92)')
                          : (isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.65)'),
                        borderColor: total > 0 && emotionsForDay.length > 0
                          ? `${EMOTIONS[emotionsForDay[0]].color}80`
                          : (isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(148, 163, 184, 0.7)')
                      }}
                    >
                      {total === 0 ? (
                        <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">-</div>
                      ) : (
                        <div className="absolute inset-2 rounded-lg overflow-hidden border border-slate-500/20">
                          <div className="h-full w-full flex flex-col-reverse">
                            {emotionsForDay.map((emotionId) => {
                              const count = day.emotions[emotionId] || 0;
                              const emotion = EMOTIONS[emotionId];
                              const heightPct = (count / total) * 100;
                              return (
                                <div
                                  key={`${day.date}-${emotionId}`}
                                  className="relative w-full transition-all"
                                  style={{
                                    height: `${Math.max(6, heightPct)}%`,
                                    backgroundColor: emotion.color
                                  }}
                                >
                                  {heightPct > 18 && (
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">
                                      {count}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="absolute top-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-900/80 text-cyan-200 border border-cyan-400/40">
                            {total}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`text-[11px] font-semibold ${day.isToday ? 'text-indigo-500' : (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
                      {day.dayShort}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-1 mb-4" dir={isRtl ? 'rtl' : 'ltr'}>
              {EMOTION_IDS.map((emotionId) => {
                const value = todayEmotions[emotionId] || 0;
                const emotion = EMOTIONS[emotionId];
                return (
                  <div key={emotionId} className="text-center">
                    <div 
                      className="w-10 mx-auto h-[150px] sm:h-[170px] rounded-xl relative overflow-hidden mb-1 border-2"
                      style={{
                        backgroundColor: value > 0
                          ? `${emotion.color}${isDark ? '15' : '22'}`
                          : (isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.65)'),
                        borderColor: `${emotion.color}${isDark ? '60' : '88'}`
                      }}
                    >
                      {value === 0 ? (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-xs opacity-60" style={{ color: emotion.color }}>0</span>
                        </div>
                      ) : (
                        <div className="absolute inset-2 rounded-lg overflow-hidden border border-slate-500/20 flex items-end">
                          <div
                            className="w-full transition-all"
                            style={{
                              height: `${Math.max(8, (value / maxTodayCount) * 100)}%`,
                              backgroundColor: emotion.color
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-white/90 drop-shadow">
                              {value}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className="mx-auto mt-1 text-[10px] font-semibold max-w-[56px] truncate"
                      style={{ color: emotion.color }}
                      title={language === 'en' ? emotion.nameEn || emotion.name : emotion.name}
                    >
                      {language === 'en' ? emotion.nameEn || emotion.name : emotion.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className={`border-t pt-4 mt-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{t(language, 'moodHistory')}</h3>
            <div className="flex flex-wrap gap-2">
              {EMOTION_IDS.map((emotionId) => {
                const emotion = EMOTIONS[emotionId];
                const count = todayEmotions[emotionId] || 0;
                return (
                  <span
                    key={emotionId}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${isDark ? 'border-slate-600' : 'border-slate-300'}`}
                    style={{
                      backgroundColor: count > 0 ? `${emotion.color}20` : (isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)'),
                      color: isDark ? 'rgb(226, 232, 240)' : 'rgb(51, 65, 85)'
                    }}
                  >
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-sm border"
                      style={{ backgroundColor: `${emotion.color}55`, borderColor: `${emotion.color}AA` }}
                    >
                      {emotion.emoji}
                    </span>
                    <span>{language === 'en' ? emotion.nameEn || emotion.name : emotion.name}</span>
                    {count > 0 && <span className="opacity-70">({count})</span>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChartsScreen;
