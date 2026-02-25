import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { getAuthSession, getLanguage, getUiTheme } from '../utils/storage';
import { getSchoolName } from '../constants/schools';
import { translate as t, isRtlLanguage } from '../constants/i18n';
import HelpPopover from './HelpPopover';

const MainScreen = ({ onOpenBottle, onOpenCharts, onOpenTasks }) => {
  const [activeHelp, setActiveHelp] = useState(null);
  const language = getLanguage();
  const uiTheme = getUiTheme();
  const isRtl = isRtlLanguage(language);
  const session = getAuthSession();
  const isGeneral = session?.role === 'general';
  const schoolName = getSchoolName(session?.schoolId, language);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto pt-8 relative">
        <div className="title-banner text-center mb-6 animate-fadeIn px-5 py-5 sm:px-7 sm:py-6">
          <h1 className="text-4xl font-extrabold hero-title mb-2">{t(language, 'moodly')}</h1>
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
                className="w-full teen-card bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800 text-slate-100 py-6 px-8 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-indigo-500/30 flex items-center justify-between btn-3d"
              >
                <span className="text-4xl">🫙</span>
                <span>{t(language, 'moodJar')}</span>
                <HelpPopover
                  id="moodJar"
                  text={t(language, 'botExplainer')}
                  activeId={activeHelp}
                  setActiveId={setActiveHelp}
                  isRtl={isRtl}
                  theme={uiTheme}
                  ariaLabel={language === 'en' ? 'Help' : 'עזרה'}
                  buttonClassName="text-indigo-300 hover:text-indigo-200 transition-colors"
                  iconClassName="w-6 h-6"
                  estimatedHeight={120}
                />
              </button>
            </div>
          )}

          <div className="relative">
            <button
              onClick={onOpenCharts}
              className="w-full teen-card bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800 text-slate-100 py-6 px-8 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-indigo-500/30 flex items-center justify-between btn-3d"
            >
              <span className="text-4xl">📊</span>
              <span>{isGeneral ? (language === 'en' ? 'Class Graphs' : 'גרפים כיתתיים') : t(language, 'viewCharts')}</span>
              <HelpPopover
                id="charts"
                text={
                  isGeneral
                    ? language === 'en'
                      ? 'This view shows class-level daily and weekly status.'
                      : 'תצוגה זו מציגה סטטוס כיתתי יומי ושבועי.'
                    : t(language, 'chartsExplainer')
                }
                activeId={activeHelp}
                setActiveId={setActiveHelp}
                isRtl={isRtl}
                theme={uiTheme}
                ariaLabel={language === 'en' ? 'Help' : 'עזרה'}
                buttonClassName="text-indigo-300 hover:text-indigo-200 transition-colors"
                iconClassName="w-6 h-6"
                estimatedHeight={120}
              />
            </button>
          </div>

          {!isGeneral && (
            <div className="relative">
              <button
                onClick={onOpenTasks}
                className="w-full teen-card bg-slate-900/70 backdrop-blur-sm hover:bg-slate-800 text-slate-100 py-6 px-8 rounded-2xl font-bold text-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-indigo-500/30 flex items-center justify-between btn-3d"
              >
                <span className="text-4xl">✅</span>
                <span>{language === 'en' ? 'Task Tracker' : 'מעקב משימות'}</span>
                <CheckSquare className="w-6 h-6 text-indigo-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
