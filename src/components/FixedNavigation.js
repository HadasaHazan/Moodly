import React, { useState, useEffect } from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import { getLanguage } from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';

const FixedNavigation = ({
  currentScreen,
  onOpenSettings,
  onBackToMain,
  language: propLanguage,
  hideSettings = false,
  hideBack = false,
  alwaysShowBack = false,
  onBackOverride,
  backTitle
}) => {
  const [language, setLanguage] = useState(propLanguage || getLanguage());
  const isRtl = isRtlLanguage(language);
  const showBackButton = alwaysShowBack || currentScreen !== 'main';
  const handleBack = onBackOverride || onBackToMain;
  const resolvedTitle =
    backTitle || (language === 'en' ? 'Back to Home' : 'חזרה למסך הבית');

  // עדכון שפה כשמשתנה
  useEffect(() => {
    const updateLanguage = () => {
      if (propLanguage) {
        setLanguage(propLanguage);
      } else {
        setLanguage(getLanguage());
      }
    };
    
    updateLanguage();
    window.addEventListener('languagechange', updateLanguage);
    return () => window.removeEventListener('languagechange', updateLanguage);
  }, [propLanguage]);

  return (
    <div className={`fixed ${isRtl ? 'top-4 right-4 flex-row-reverse' : 'top-4 left-4 flex-row'} z-50 flex gap-3`}>
      {/* כפתור הגדרות */}
      {!hideSettings && (
        <button
          onClick={onOpenSettings}
          className="w-11 h-11 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-slate-200 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 border border-slate-700"
          title={language === 'en' ? 'Settings' : 'הגדרות'}
        >
          <Settings className="w-5 h-5" />
        </button>
      )}

      {/* כפתור חזרה */}
      {!hideBack && (
        <button
          onClick={showBackButton ? handleBack : undefined}
          disabled={!showBackButton}
          className={`w-11 h-11 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm text-slate-200 rounded-xl shadow-lg transition-all duration-200 border border-slate-700 ${
            showBackButton
              ? 'hover:bg-slate-800 transform hover:scale-105'
              : 'opacity-0 pointer-events-none'
          }`}
          title={resolvedTitle}
        >
          <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default FixedNavigation;
