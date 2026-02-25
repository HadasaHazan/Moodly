import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings as SettingsIcon, Sparkles, Users, User, HelpCircle, ChevronDown } from 'lucide-react';
import {
  getLanguage,
  setAuthSession,
  setUserContext
} from '../utils/storage';
import { isRtlLanguage } from '../constants/i18n';
import { SCHOOLS } from '../constants/schools';

const TEXTS = {
  he: {
    title: 'כניסה למערכת',
    subtitle: 'בחרו סוג כניסה והזינו פרטים',
    general: 'צפייה בנתוני הכיתה',
    personal: 'כניסה',
    generalHelp: 'צפייה בנתוני הכיתה מציגה סטטוס כיתה (גרפים יומיים/שבועיים) בלי נתונים אישיים.',
    personalHelp: 'כניסה שומרת נתונים למכשיר/לתלמיד: צנצנת רגשות, משימות, בוט וסיכומים.',
    school: 'בית ספר',
    class: 'כיתה',
    studentName: 'שם תלמיד/ה',
    studentNamePlaceholder: 'הזינו שם',
    studentNameRequired: 'בכניסה אישית חובה להזין שם תלמיד/ה',
    schoolRequired: 'חובה לבחור בית ספר',
    classRequired: 'חובה להזין כיתה',
    schoolPlaceholder: 'בחרו בית ספר',
    classPlaceholder: 'לדוגמה: י׳2',
    enterGeneral: 'כניסה לנתוני כיתה',
    enterPersonal: 'כניסה אישית'
  },
  en: {
    title: 'System Login',
    subtitle: 'Choose login type and fill in details',
    general: 'Class View',
    personal: 'Login',
    generalHelp: 'Class view shows class status (daily/weekly charts) without personal data.',
    personalHelp: 'Login stores individual data: emotion jar, tasks, bot, and summaries.',
    school: 'School',
    class: 'Class',
    studentName: 'Student Name',
    studentNamePlaceholder: 'Enter name',
    studentNameRequired: 'Personal login requires a student name',
    schoolRequired: 'School is required',
    classRequired: 'Class is required',
    schoolPlaceholder: 'Select school',
    classPlaceholder: 'Example: 10-B',
    enterGeneral: 'Enter Class View',
    enterPersonal: 'Enter Personal View'
  }
};

const getDeviceId = () => {
  const key = 'moodlyDeviceId';
  const existing = localStorage.getItem(key);
  if (existing) {
    return existing;
  }
  const value = Math.random().toString(36).slice(2, 10);
  localStorage.setItem(key, value);
  return value;
};

const LoginScreen = ({ onLogin, onOpenSettings, isSettingsOpen }) => {
  const language = getLanguage();
  const isRtl = isRtlLanguage(language);
  const t = language === 'en' ? TEXTS.en : TEXTS.he;

  const [mode, setMode] = useState('personal');
  const [schoolId, setSchoolId] = useState('');
  const [classId, setClassId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const [activeHelp, setActiveHelp] = useState(null); // 'general' | 'personal' | null
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const schoolDropdownRef = useRef(null);

  const selectedSchool = SCHOOLS.find((school) => school.id === schoolId) || null;

  useEffect(() => {
    if (!isSchoolOpen) return undefined;

    const onMouseDown = (event) => {
      const target = event.target;
      if (schoolDropdownRef.current && schoolDropdownRef.current.contains(target)) return;
      setIsSchoolOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isSchoolOpen]);

  const HelpPopover = ({ id, text }) => {
    const buttonRef = useRef(null);
    const popoverRef = useRef(null);
    const isOpen = activeHelp === id;
    const [anchorRect, setAnchorRect] = useState(null);

    const updateRect = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) setAnchorRect(rect);
    };

    useEffect(() => {
      if (!isOpen) return undefined;
      updateRect();

      const onScroll = () => updateRect();
      const onResize = () => updateRect();
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', onResize);

      const onMouseDown = (event) => {
        const target = event.target;
        if (buttonRef.current && buttonRef.current.contains(target)) return;
        if (popoverRef.current && popoverRef.current.contains(target)) return;
        setActiveHelp(null);
      };
      document.addEventListener('mousedown', onMouseDown);

      return () => {
        window.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('mousedown', onMouseDown);
      };
    }, [isOpen]);

    const tooltip = (() => {
      if (!isOpen || !anchorRect) return null;

      const padding = 12;
      const tooltipWidth = 280;
      const estimatedHeight = 110;

      let left = isRtl ? anchorRect.right - tooltipWidth : anchorRect.left;
      left = Math.min(Math.max(padding, left), window.innerWidth - tooltipWidth - padding);

      let top = anchorRect.bottom + 8;
      if (top + estimatedHeight > window.innerHeight - padding) {
        top = anchorRect.top - 8 - estimatedHeight;
      }
      top = Math.min(Math.max(padding, top), window.innerHeight - estimatedHeight - padding);

      return createPortal(
        <div
          ref={popoverRef}
          className="text-xs rounded-xl border p-3 shadow-xl backdrop-blur-sm bg-slate-900/95 text-slate-100 border-slate-600"
          style={{ position: 'fixed', top, left, width: tooltipWidth, zIndex: 200 }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {text}
        </div>,
        document.body
      );
    })();

    return (
      <span className="inline-flex">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            setActiveHelp(isOpen ? null : id);
          }}
          className="text-slate-300 hover:text-slate-100"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-label={language === 'en' ? 'Help' : 'עזרה'}
          type="button"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        {tooltip}
      </span>
    );
  };

  const handleLogin = () => {
    const normalizedClass = classId.trim();
    const normalizedName = studentName.trim();
    const role = mode === 'general' ? 'general' : 'personal';
    const deviceId = getDeviceId();

    if (!schoolId) {
      setError(t.schoolRequired);
      return;
    }

    if (!normalizedClass) {
      setError(t.classRequired);
      return;
    }

    if (role === 'personal' && !normalizedName) {
      setError(t.studentNameRequired);
      return;
    }

    const userKey =
      role === 'general'
        ? `general:${(schoolId || 'unknown').toLowerCase()}:${(normalizedClass || 'unknown').toLowerCase()}:${deviceId}`
        : `personal:${deviceId}:${normalizedName.toLowerCase().replace(/\\s+/g, '-')}`;

    const session = {
      role,
      provider: 'basic',
      email: '',
      name: role === 'general' ? `general:${normalizedClass || 'no-class'}` : normalizedName,
      picture: '',
      userKey,
      schoolId: schoolId || '',
      classId: normalizedClass || '',
      entryMode: role,
      studentName: role === 'personal' ? normalizedName : '',
      loginAt: new Date().toISOString()
    };

    setAuthSession(session);
    if (schoolId && normalizedClass) {
      setUserContext(userKey, { schoolId, classId: normalizedClass, entryMode: role });
    }
    onLogin(session);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`fixed top-4 ${isRtl ? 'right-4' : 'left-4'} z-50 flex flex-col gap-3`}>
        <button
          onClick={onOpenSettings}
          disabled={!onOpenSettings || isSettingsOpen}
          className={`w-11 h-11 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-slate-200 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 border border-slate-700 ${
            !onOpenSettings || isSettingsOpen ? 'opacity-50 pointer-events-none' : ''
          }`}
          title={language === 'en' ? 'Settings' : 'הגדרות'}
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold hero-title mb-2">{t.title}</h1>
          <p className="text-slate-200 hero-subtitle">{t.subtitle}</p>
        </div>

        <div className="bg-slate-900/85 rounded-3xl shadow-2xl p-8 border border-slate-700 panel-3d">

          <div className="mb-5 rounded-xl border border-slate-700 bg-slate-800/70 p-1 grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                setMode('personal');
                setError('');
              }}
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                mode === 'personal' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {t.personal}
                <HelpPopover id="personal" text={t.personalHelp} />
              </span>
            </button>
            <button
              onClick={() => {
                setMode('general');
                setError('');
              }}
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                mode === 'general' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {t.general}
                <HelpPopover id="general" text={t.generalHelp} />
              </span>
            </button>
          </div>

          <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
            {error && (
              <div className="text-sm text-red-200 bg-red-950/40 border border-red-500/40 rounded-xl px-4 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">{t.school}</label>
              <div className="relative" ref={schoolDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsSchoolOpen((prev) => !prev)}
                  className={`w-full bg-slate-800 border border-slate-600 hover:bg-slate-700 rounded-xl px-4 py-3 text-slate-100 flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    isRtl ? '' : 'flex-row-reverse'
                  }`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                  aria-haspopup="listbox"
                  aria-expanded={isSchoolOpen ? 'true' : 'false'}
                >
                  <span className={`font-semibold ${selectedSchool ? '' : 'text-slate-300'}`}>
                    {selectedSchool ? (language === 'en' ? selectedSchool.nameEn : selectedSchool.nameHe) : t.schoolPlaceholder}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-cyan-300 transition-transform ${isSchoolOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSchoolOpen && (
                  <div
                    className="absolute z-20 mt-2 w-full bg-slate-900/95 border border-slate-600 rounded-2xl shadow-2xl p-2 backdrop-blur-sm max-h-64 overflow-y-auto"
                    role="listbox"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  >
                    <div className="space-y-2">
                      {SCHOOLS.map((school) => (
                        <button
                          key={school.id}
                          type="button"
                          onClick={() => {
                            setSchoolId(school.id);
                            setError('');
                            setIsSchoolOpen(false);
                          }}
                          className={`w-full py-3 px-4 rounded-xl font-semibold border transition-all ${
                            isRtl ? 'text-right' : 'text-left'
                          } ${
                            schoolId === school.id
                              ? 'bg-indigo-600 text-white border-indigo-300'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-600'
                          }`}
                          role="option"
                          aria-selected={schoolId === school.id ? 'true' : 'false'}
                        >
                          {language === 'en' ? school.nameEn : school.nameHe}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">{t.class}</label>
              <input
                type="text"
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setError('');
                }}
                placeholder={t.classPlaceholder}
                className="w-full px-4 py-3 border border-slate-600 bg-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {mode === 'personal' && (
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">{t.studentName}</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setError('');
                  }}
                  placeholder={t.studentNamePlaceholder}
                  className="w-full px-4 py-3 border border-slate-600 bg-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}

            <button
              onClick={() => {
                setError('');
                handleLogin();
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {mode === 'general' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
              {mode === 'general' ? t.enterGeneral : t.enterPersonal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
