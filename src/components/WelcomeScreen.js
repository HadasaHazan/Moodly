import React, { useState } from 'react';
import { getLanguage, getUiTheme } from '../utils/storage';
import { translate as t, isRtlLanguage } from '../constants/i18n';
import HelpPopover from './HelpPopover';

const WelcomeScreen = ({ onEnter }) => {
  const [activeHelp, setActiveHelp] = useState(null);
  const language = getLanguage();
  const uiTheme = getUiTheme();
  const isRtl = isRtlLanguage(language);
  const appInfoText = `${t(language, 'howItWorks')}\n\n${t(language, 'markEmotionsDay')}\n${t(language, 'botSuggestsTasks')}\n${t(language, 'feedbackAfterTask')}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mb-6 shadow-2xl animate-float-in-bottle">
            <span className="text-6xl">🫙</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-300 to-cyan-200 bg-clip-text text-transparent mb-3">
            {t(language, 'moodly')}
          </h1>
          <p className="text-xl text-slate-300">{t(language, 'appSubtitle')}</p>
        </div>

        <div className="space-y-4">
          <HelpPopover
            id="appInfo"
            text={appInfoText}
            activeId={activeHelp}
            setActiveId={setActiveHelp}
            isRtl={isRtl}
            theme={uiTheme}
            ariaLabel={language === 'en' ? 'App Info' : 'מידע על האפליקציה'}
            width={360}
            estimatedHeight={170}
            buttonClassName="w-full flex items-center justify-center gap-3 bg-slate-900/70 hover:bg-slate-800 text-slate-200 py-4 px-6 rounded-xl font-semibold shadow-md transition-all duration-200 border border-slate-700"
            iconClassName="w-5 h-5"
            label={<span>{t(language, 'appInfo')}</span>}
          />

          <button
            onClick={() => onEnter()}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            {t(language, 'enterSystem')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
