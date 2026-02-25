import React, { useState } from 'react';
import { HelpCircle, ArrowLeft, CheckSquare } from 'lucide-react';
import { getAuthSession, getLanguage } from '../utils/storage';
import { getSchoolName } from '../constants/schools';
import { translate as t, isRtlLanguage } from '../constants/i18n';
import TaskTracker from './TaskTracker';

const MainScreen = ({ onOpenBottle, onOpenCharts }) => {
  const [showTaskTracker, setShowTaskTracker] = useState(false);
  const [showBottleInfo, setShowBottleInfo] = useState(false);
  const [showChartsInfo, setShowChartsInfo] = useState(false);
  const language = getLanguage();
  const isRtl = isRtlLanguage(language);
  const session = getAuthSession();
  const isGeneral = session?.role === 'general';
  const schoolName = getSchoolName(session?.schoolId, language);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto pt-8 relative">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-4xl font-extrabold hero-title mb-2">{t(language, 'moodly')}</h1>
          <p className="text-lg text-slate-200 hero-subtitle">{t(language, 'chooseAction')}</p>
        </div>

        {session?.schoolId && session?.classId && (
          <div className="mb-8 bg-slate-900/80 rounded-2xl border border-cyan-600/40 px-4 py-3 text-slate-200 text-sm">
            {language === 'en'
              ? `School: ${schoolName} | Class: ${session.classId} | Mode: ${isGeneral ? 'General' : 'Personal'}`
              : `בית ספר: ${schoolName} | כיתה: ${session.classId} | מצב: ${isGeneral ? 'כללי' : 'אישי'}`}
          </div>
        )}

        <div className="space-y-6 mb-8">
          {!isGeneral && (
            <div className="relative">
              <button
                onClick={onOpenBottle}
                className="w-full bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800 text-slate-100 py-6 px-8 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-indigo-500/30 flex items-center justify-between btn-3d"
              >
                <span className="text-4xl">🫙</span>
                <span>{t(language, 'moodJar')}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBottleInfo(!showBottleInfo);
                  }}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors"
                >
                  <HelpCircle className="w-6 h-6" />
                </span>
              </button>

              {showBottleInfo && (
                <div className="mt-3 bg-slate-900/90 rounded-xl shadow-lg p-4 border border-slate-700 animate-slideUp">
                  <div className={`flex items-start justify-between mb-2 ${isRtl ? '' : 'flex-row-reverse'}`}>
                    <p className={`text-sm text-slate-300 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t(language, 'botExplainer')}
                    </p>
                    <button
                      onClick={() => setShowBottleInfo(false)}
                      className={`${isRtl ? 'mr-2' : 'ml-2'} text-slate-500 hover:text-slate-300`}
                    >
                      <ArrowLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={onOpenCharts}
              className="w-full bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800 text-slate-100 py-6 px-8 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-indigo-500/30 flex items-center justify-between btn-3d"
            >
              <span className="text-4xl">📊</span>
              <span>{isGeneral ? (language === 'en' ? 'Class Graphs' : 'גרפים כיתתיים') : t(language, 'viewCharts')}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChartsInfo(!showChartsInfo);
                }}
                className="text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                <HelpCircle className="w-6 h-6" />
              </span>
            </button>

            {showChartsInfo && (
              <div className="mt-3 bg-slate-900/90 rounded-xl shadow-lg p-4 border border-slate-700 animate-slideUp">
                <div className={`flex items-start justify-between mb-2 ${isRtl ? '' : 'flex-row-reverse'}`}>
                  <p className={`text-sm text-slate-300 flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {isGeneral
                      ? language === 'en'
                        ? 'This view shows class-level daily and weekly status.'
                        : 'תצוגה זו מציגה סטטוס כיתתי יומי ושבועי.'
                      : t(language, 'chartsExplainer')}
                  </p>
                  <button
                    onClick={() => setShowChartsInfo(false)}
                    className={`${isRtl ? 'mr-2' : 'ml-2'} text-slate-500 hover:text-slate-300`}
                  >
                    <ArrowLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isGeneral && (
            <div className="relative">
              <button
                onClick={() => setShowTaskTracker(true)}
                className="w-full bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800 text-slate-100 py-6 px-8 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-indigo-500/30 flex items-center justify-between btn-3d"
              >
                <span className="text-4xl">✅</span>
                <span>{language === 'en' ? 'Task Tracker' : 'מעקב משימות'}</span>
                <CheckSquare className="w-6 h-6 text-indigo-300" />
              </button>
            </div>
          )}
        </div>

        {showTaskTracker && (
          <TaskTracker onClose={() => setShowTaskTracker(false)} />
        )}
      </div>
    </div>
  );
};

export default MainScreen;
