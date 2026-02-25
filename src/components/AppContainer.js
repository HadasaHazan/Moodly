import React, { useEffect, useState } from 'react';
import LoginScreen from './LoginScreen';
import BotModeSelection from './BotModeSelection';
import MainScreen from './MainScreen';
import Moodly from './Moodly';
import ChartsScreen from './ChartsScreen';
import Settings from './Settings';
import FixedNavigation from './FixedNavigation';
import TaskTracker from './TaskTracker';
import {
  getAuthSession,
  getBackgroundMusic,
  getBackgroundPalette,
  getBotMode,
  clearAuthSession,
  getCurrentUser,
  getLanguage,
  getUiTheme
} from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';
import { attachUnlockListeners, setMusicPreset, stopMusic } from '../utils/backgroundMusic';

const hasValidSession = (session, user) =>
  Boolean(user && session?.userKey && (session.role === 'general' || session.role === 'personal'));

const AppContainer = () => {
  const [currentScreen, setCurrentScreen] = useState('login'); // login, botMode, main, bottle, charts, tasks
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUser, setCurrentUserState] = useState(null);
  const [language, setLanguageState] = useState('he');
  const [uiTheme, setUiThemeState] = useState('dark');
  const [bgPalette, setBgPaletteState] = useState('calm');
  const [bgMusic, setBgMusicState] = useState('off');

  useEffect(() => {
    const session = getAuthSession();
    const user = getCurrentUser();
    setLanguageState(getLanguage());
    setUiThemeState(getUiTheme());
    setBgPaletteState(getBackgroundPalette());
    setBgMusicState(getBackgroundMusic());

    if (!hasValidSession(session, user)) {
      setCurrentUserState(null);
    }
    setCurrentScreen('login');
  }, []);

  useEffect(() => {
    attachUnlockListeners();
    return () => stopMusic();
  }, []);

  useEffect(() => {
    setMusicPreset(bgMusic);
  }, [bgMusic]);

  useEffect(() => {
    const isRtl = isRtlLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (!currentUser && currentScreen !== 'login') {
      setCurrentScreen('login');
      setIsSettingsOpen(false);
    }
  }, [currentScreen, currentUser]);

  useEffect(() => {
    document.body.style.overflow = isSettingsOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSettingsOpen]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageState(getLanguage());
    };
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const handleLogin = (session) => {
    if (!session?.userKey || (session.role !== 'general' && session.role !== 'personal')) {
      setCurrentScreen('login');
      return;
    }

    setCurrentUserState(session.userKey);
    // After login, refresh UI settings from the user scope (or global fallback)
    setLanguageState(getLanguage());
    setUiThemeState(getUiTheme());
    setBgPaletteState(getBackgroundPalette());
    setBgMusicState(getBackgroundMusic());
    const botMode = getBotMode();
    if (!botMode) {
      setCurrentScreen('botMode');
    } else {
      setCurrentScreen('main');
    }
  };

  const handleBotModeSelected = () => {
    setCurrentScreen('main');
  };

  const handleOpenBottle = () => {
    setCurrentScreen('bottle');
  };

  const handleOpenCharts = () => {
    setCurrentScreen('charts');
  };

  const handleOpenTasks = () => {
    setCurrentScreen('tasks');
  };

  const handleOpenSettings = () => {
    setLanguageState(getLanguage());
    setUiThemeState(getUiTheme());
    setBgPaletteState(getBackgroundPalette());
    setBgMusicState(getBackgroundMusic());
    setIsSettingsOpen(true);
  };

  const handleBackToMain = () => {
    setLanguageState(getLanguage());
    setUiThemeState(getUiTheme());
    setBgPaletteState(getBackgroundPalette());
    setBgMusicState(getBackgroundMusic());
    setIsSettingsOpen(false);
    setCurrentScreen('main');
  };

  const handleBackToLogin = () => {
    clearAuthSession();
    setCurrentUserState(null);
    setIsSettingsOpen(false);
    setCurrentScreen('login');
  };

  const screensWithNavigation = ['main', 'bottle', 'charts', 'tasks'];
  const showNavigation = currentUser && screensWithNavigation.includes(currentScreen);
  const authSession = getAuthSession();
  const isGeneral = authSession?.role === 'general';
  const isPersonal = authSession?.role === 'personal';
  const showBackToLoginOnMain = Boolean((isPersonal || isGeneral) && currentScreen === 'main');

  return (
    <div className={`App app-shell theme-${uiTheme} palette-${bgPalette}`}>
      {showNavigation && (
        <FixedNavigation
          currentScreen={currentScreen}
          onOpenSettings={handleOpenSettings}
          onBackToMain={handleBackToMain}
          alwaysShowBack={showBackToLoginOnMain}
          onBackOverride={showBackToLoginOnMain ? handleBackToLogin : undefined}
          language={language}
          hideSettings={isSettingsOpen}
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onOpenSettings={handleOpenSettings}
          isSettingsOpen={isSettingsOpen}
        />
      )}

      {currentScreen === 'botMode' && currentUser && (
        <BotModeSelection onSelect={handleBotModeSelected} />
      )}

      {currentScreen === 'main' && currentUser && (
        <MainScreen
          onOpenBottle={handleOpenBottle}
          onOpenCharts={handleOpenCharts}
          onOpenTasks={handleOpenTasks}
        />
      )}

      {currentScreen === 'bottle' && currentUser && (
        <Moodly onBack={handleBackToMain} />
      )}

      {currentScreen === 'charts' && currentUser && (
        <ChartsScreen onBack={handleBackToMain} onBackToLogin={handleBackToLogin} />
      )}

      {currentScreen === 'tasks' && currentUser && (
        <TaskTracker isModal={false} onClose={handleBackToMain} />
      )}

      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/35 backdrop-blur-md backdrop-saturate-150 flex items-center justify-center p-3 sm:p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSettingsOpen(false);
          }}
        >
          <div className="w-full max-w-3xl max-h-[94vh] overflow-y-auto">
            <Settings
              isModal
              hideBotMode={isGeneral}
              onBack={() => setIsSettingsOpen(false)}
              onThemePreview={setUiThemeState}
              onPalettePreview={setBgPaletteState}
              onMusicPreview={setBgMusicState}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppContainer;
