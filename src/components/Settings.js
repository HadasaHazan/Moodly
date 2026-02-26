import React, { useEffect, useState } from 'react';
import { Globe, Bot, Sparkles, Music, ChevronDown, X } from 'lucide-react';
import {
  getBotMode,
  setBotMode,
  getLanguage,
  setLanguage as saveLanguage,
  getUiTheme,
  setUiTheme,
  getBackgroundPalette,
  setBackgroundPalette,
  getBackgroundMusic,
  setBackgroundMusic
} from '../utils/storage';
import { translate as t, isRtlLanguage } from '../constants/i18n';
import HelpPopover from './HelpPopover';

const Settings = ({ onBack, onThemePreview, onPalettePreview, onMusicPreview, isModal = false, hideBotMode = false }) => {
  const [language, setLanguageState] = useState('he');
  const [botMode, setBotModeState] = useState('immediate');
  const [uiTheme, setUiThemeState] = useState('dark');
  const [bgPalette, setBgPaletteState] = useState('calm');
  const [bgMusic, setBgMusicState] = useState('off');
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [activeHelp, setActiveHelp] = useState(null);
  const isRtl = isRtlLanguage(language);
  const musicOptions = [
    { id: 'off', label: t(language, 'musicOff') },
    { id: 'melody_a', label: t(language, 'melodyA') },
    { id: 'melody_b', label: t(language, 'melodyB') },
    { id: 'melody_c', label: t(language, 'melodyC') },
    { id: 'melody_d', label: t(language, 'melodyD') }
  ];

  useEffect(() => {
    const savedLanguage = getLanguage();
    setLanguageState(savedLanguage);
    setBotModeState(getBotMode());
    setUiThemeState(getUiTheme());
    setBgPaletteState(getBackgroundPalette());
    setBgMusicState(getBackgroundMusic());
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguageState(lang);
    saveLanguage(lang);
    const rtl = isRtlLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.body.dir = rtl ? 'rtl' : 'ltr';
    // עדכון מיידי של הדף
    window.dispatchEvent(new Event('languagechange'));
  };

  const renderHelp = (id, text) => (
    <HelpPopover
      id={id}
      text={text}
      activeId={activeHelp}
      setActiveId={setActiveHelp}
      isRtl={isRtl}
      theme={uiTheme}
      ariaLabel={language === 'en' ? 'Help' : 'עזרה'}
      width={260}
      estimatedHeight={130}
      buttonClassName="text-slate-400 hover:text-slate-200"
      iconClassName="w-4 h-4"
    />
  );

  const selectedMusic = musicOptions.find((option) => option.id === bgMusic) || musicOptions[0];

  const showBotMode = !hideBotMode;

  const paletteButtonStyles = (paletteId) => {
    if (paletteId === 'calm') {
      return {
        base: 'bg-gradient-to-br from-emerald-200 via-lime-200 to-green-300 text-slate-900',
        selected: uiTheme === 'light' ? 'border-emerald-900 ring-2 ring-emerald-800/40 shadow-xl' : 'border-emerald-300 ring-2 ring-emerald-200 shadow-xl'
      };
    }
    if (paletteId === 'sky') {
      return {
        base: 'bg-gradient-to-br from-fuchsia-200 via-violet-200 to-indigo-300 text-slate-900',
        selected: uiTheme === 'light' ? 'border-violet-900 ring-2 ring-violet-800/40 shadow-xl' : 'border-violet-300 ring-2 ring-violet-200 shadow-xl'
      };
    }
    return {
      base: 'bg-gradient-to-br from-rose-200 via-red-200 to-orange-200 text-slate-900',
      selected: uiTheme === 'light' ? 'border-rose-900 ring-2 ring-rose-800/40 shadow-xl' : 'border-rose-300 ring-2 ring-rose-200 shadow-xl'
    };
  };

  return (
    <div className={isModal ? 'p-2' : 'min-h-screen p-4'}>
      <div className={`max-w-2xl mx-auto relative ${isModal ? 'rounded-3xl settings-shell p-4 sm:p-6' : 'pt-8'}`}>
        {isModal && onBack && (
	          <button
	            type="button"
	            onClick={onBack}
	            className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} z-[210] pointer-events-auto w-11 h-11 flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-xl shadow-lg transition-all duration-200 border border-slate-700`}
	            aria-label={language === 'en' ? 'Close settings' : 'סגור הגדרות'}
	            title={language === 'en' ? 'Close' : 'סגור'}
	          >
	            <X className="w-5 h-5" />
	          </button>
	        )}
        {/* כפתור חזרה - מוסר כי יש ניווט קבוע */}

	        <div className="text-center mb-8">
	          <h1
	            className={`text-4xl font-extrabold mb-2 inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-sm ${
	              uiTheme === 'light'
	                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-white/60 shadow-[0_26px_70px_rgba(15,23,42,0.28)]'
	                : 'bg-slate-950/45 border-slate-700 shadow-[0_24px_65px_rgba(0,0,0,0.35)]'
	            }`}
	          >
	            <Sparkles className={`w-10 h-10 ${uiTheme === 'light' ? 'text-white' : 'text-indigo-300'}`} />
	            <span
	              className={
	                uiTheme === 'light'
	                  ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]'
	                  : 'settings-hero-title'
	              }
	            >
	              {t(language, 'settings')}
	            </span>
	          </h1>
	        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100">{t(language, 'language')}</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleLanguageChange('he')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all border-2 ${
                  language === 'he'
                    ? uiTheme === 'light'
                      ? 'bg-indigo-600 text-white shadow-lg border-slate-900 ring-2 ring-slate-900/35'
                      : 'bg-indigo-600 text-white shadow-lg border-indigo-300'
                    : uiTheme === 'light'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-500'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-600'
                }`}
              >
                עברית
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all border-2 ${
                  language === 'en'
                    ? uiTheme === 'light'
                      ? 'bg-indigo-600 text-white shadow-lg border-slate-900 ring-2 ring-slate-900/35'
                      : 'bg-indigo-600 text-white shadow-lg border-indigo-300'
                    : uiTheme === 'light'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-500'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100">{t(language, 'theme')}</h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUiThemeState('dark');
                  setUiTheme('dark');
                  if (onThemePreview) onThemePreview('dark');
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  uiTheme === 'dark'
                    ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-200/70'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-slate-600'
                }`}
              >
                {t(language, 'darkMode')}
              </button>
              <button
                onClick={() => {
                  setUiThemeState('light');
                  setUiTheme('light');
                  if (onThemePreview) onThemePreview('light');
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  uiTheme === 'light'
                    ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-200/70'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-slate-600'
                }`}
              >
                {t(language, 'lightMode')}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-slate-100">{t(language, 'background')}</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setBgPaletteState('calm');
                  setBackgroundPalette('calm');
                  if (onPalettePreview) onPalettePreview('calm');
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  bgPalette === 'calm'
                    ? paletteButtonStyles('calm').selected
                    : uiTheme === 'light'
                      ? 'border-slate-500/80 shadow-md'
                      : 'border-slate-600 shadow-md'
                } ${paletteButtonStyles('calm').base} font-bold`}
              >
                {t(language, 'paletteCalm')}
              </button>
              <button
                onClick={() => {
                  setBgPaletteState('sky');
                  setBackgroundPalette('sky');
                  if (onPalettePreview) onPalettePreview('sky');
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  bgPalette === 'sky'
                    ? paletteButtonStyles('sky').selected
                    : uiTheme === 'light'
                      ? 'border-slate-500/80 shadow-md'
                      : 'border-slate-600 shadow-md'
                } ${paletteButtonStyles('sky').base} font-bold`}
              >
                {t(language, 'paletteSky')}
              </button>
              <button
                onClick={() => {
                  setBgPaletteState('mint');
                  setBackgroundPalette('mint');
                  if (onPalettePreview) onPalettePreview('mint');
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  bgPalette === 'mint'
                    ? paletteButtonStyles('mint').selected
                    : uiTheme === 'light'
                      ? 'border-slate-500/80 shadow-md'
                      : 'border-slate-600 shadow-md'
                } ${paletteButtonStyles('mint').base} font-bold`}
              >
                {t(language, 'paletteMint')}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-6 h-6 text-cyan-300" />
              <h2 className="text-xl font-bold text-slate-100">{t(language, 'music')}</h2>
              {renderHelp('music', t(language, 'musicHelp'))}
            </div>
            <div className={`relative ${isMusicOpen ? 'z-[130]' : ''}`}>
              <button
                onClick={() => setIsMusicOpen((prev) => !prev)}
                className={`w-full bg-slate-800 border-2 border-slate-600 hover:bg-slate-700 rounded-2xl px-4 py-3 text-slate-100 flex items-center justify-between transition-all`}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <span className={`font-semibold ${isRtl ? 'text-right' : 'text-left'}`}>{selectedMusic.label}</span>
                <ChevronDown className={`w-5 h-5 text-cyan-300 transition-transform ${isMusicOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMusicOpen && (
                <div className="absolute z-[140] top-full mt-2 w-full bg-slate-900/95 border border-slate-600 rounded-2xl shadow-2xl p-2 backdrop-blur-sm">
                  <div className="space-y-2">
                    {musicOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setBgMusicState(option.id);
                          setBackgroundMusic(option.id);
                          setIsMusicOpen(false);
                          if (onMusicPreview) onMusicPreview(option.id);
                        }}
                        className={`w-full py-3 px-4 rounded-xl font-semibold border transition-all ${isRtl ? 'text-right' : 'text-left'} ${
                          bgMusic === option.id
                            ? 'bg-indigo-600 text-white border-indigo-300'
                            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-600'
                        }`}
                        dir={isRtl ? 'rtl' : 'ltr'}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {showBotMode && (
          <div className="bg-slate-900/80 rounded-2xl shadow-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100">{t(language, 'botMode')}</h2>
              {renderHelp('botMode', t(language, 'chooseBotModeHelp'))}
            </div>
            <div className="space-y-3" dir={isRtl ? 'rtl' : 'ltr'}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setBotModeState('immediate');
                  setBotMode('immediate');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setBotModeState('immediate');
                    setBotMode('immediate');
                  }
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer ${isRtl ? 'text-right' : 'text-left'} ${
                  botMode === 'immediate' ? 'border-indigo-400 bg-indigo-900/40 ring-1 ring-indigo-300' : 'border-slate-700 hover:border-slate-500 bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 w-full justify-between">
                  <div className={`font-bold text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>{t(language, 'immediateBot')}</div>
                  {renderHelp('immediateBot', t(language, 'immediateBotHelp'))}
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setBotModeState('daily');
                  setBotMode('daily');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setBotModeState('daily');
                    setBotMode('daily');
                  }
                }}
                className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer ${isRtl ? 'text-right' : 'text-left'} ${
                  botMode === 'daily' ? 'border-indigo-400 bg-indigo-900/40 ring-1 ring-indigo-300' : 'border-slate-700 hover:border-slate-500 bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 w-full justify-between">
                  <div className={`font-bold text-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>{t(language, 'dailyBot')}</div>
                  {renderHelp('dailyBot', t(language, 'dailyBotHelp'))}
                </div>
              </div>
            </div>
          </div>
          )}

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold"
          >
            {t(language, 'saveAndClose')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
