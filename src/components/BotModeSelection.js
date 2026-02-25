import React, { useState } from 'react';
import { Bot, MessageCircle, Calendar } from 'lucide-react';
import { setBotMode } from '../utils/storage';
import { translate as t, isRtlLanguage } from '../constants/i18n';
import { getLanguage } from '../utils/storage';

const BotModeSelection = ({ onSelect }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const language = getLanguage();
  const isRtl = isRtlLanguage(language);

  const handleSelect = (mode) => {
    setSelectedMode(mode);
    setBotMode(mode);
    setTimeout(() => {
      onSelect();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* רקע מעניין ויזואלי */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2),transparent_50%)]" />
        {/* חלקיקים נעים */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{t(language, 'chooseBotMode')}</h1>
          <p className="text-lg text-slate-300">{t(language, 'chooseBotModeDesc')}</p>
        </div>

        <div className="space-y-4">
          {/* מצב מיידי */}
          <button
            onClick={() => handleSelect('immediate')}
            className={`w-full bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 border-2 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
              selectedMode === 'immediate' 
                ? 'border-indigo-400 ring-4 ring-indigo-400/30 shadow-2xl' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-bold text-white mb-2">{t(language, 'immediateBot')}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{t(language, 'immediateBotDesc')}</p>
              </div>
            </div>
          </button>

          {/* מצב יומי */}
          <button
            onClick={() => handleSelect('daily')}
            className={`w-full bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 border-2 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
              selectedMode === 'daily' 
                ? 'border-indigo-400 ring-4 ring-indigo-400/30 shadow-2xl' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl font-bold text-white mb-2">{t(language, 'dailyBot')}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{t(language, 'dailyBotDesc')}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotModeSelection;
