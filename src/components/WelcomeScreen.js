import React, { useState } from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { getLanguage } from '../utils/storage';
import { translate as t, isRtlLanguage } from '../constants/i18n';

const WelcomeScreen = ({ onEnter }) => {
  const [showInfo, setShowInfo] = useState(false);
  const language = getLanguage();
  const isRtl = isRtlLanguage(language);

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

        {showInfo && (
          <div className="bg-slate-900/80 rounded-2xl shadow-xl p-6 mb-6 animate-slideUp border border-slate-700 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-100">{t(language, 'howItWorks')}</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className={`space-y-3 text-slate-300 ${isRtl ? 'text-right' : 'text-left'}`}>
              <p className="leading-relaxed">{t(language, 'markEmotionsDay')}</p>
              <p className="leading-relaxed">{t(language, 'botSuggestsTasks')}</p>
              <p className="leading-relaxed">{t(language, 'feedbackAfterTask')}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-center gap-3 bg-slate-900/70 hover:bg-slate-800 text-slate-200 py-4 px-6 rounded-xl font-semibold shadow-md transition-all duration-200 border border-slate-700"
          >
            <HelpCircle className="w-5 h-5" />
            <span>{t(language, 'appInfo')}</span>
          </button>

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
