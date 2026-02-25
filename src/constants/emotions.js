// רגשות וצבעים - צבעים עזים
export const EMOTIONS = {
  happy: {
    id: 'happy',
    name: 'שמחה',
    nameEn: 'Happy',
    emoji: '😊',
    color: '#FBBF24', // זהב חם
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-950',
    borderColor: 'border-yellow-400'
  },
  sad: {
    id: 'sad',
    name: 'עצב',
    nameEn: 'Sad',
    emoji: '😢',
    color: '#2563EB', // כחול עמוק
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-950',
    borderColor: 'border-blue-400'
  },
  stress: {
    id: 'stress',
    name: 'לחץ',
    nameEn: 'Stress',
    emoji: '😰',
    color: '#DC2626', // אדום חד
    bgColor: 'bg-red-100',
    textColor: 'text-red-950',
    borderColor: 'border-red-400'
  },
  anger: {
    id: 'anger',
    name: 'כעס',
    nameEn: 'Anger',
    emoji: '😠',
    color: '#EA580C', // כתום חזק
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-950',
    borderColor: 'border-orange-400'
  },
  despair: {
    id: 'despair',
    name: 'ייאוש',
    nameEn: 'Despair',
    emoji: '😞',
    color: '#7C3AED', // סגול עז
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-950',
    borderColor: 'border-violet-400'
  },
  excitement: {
    id: 'excitement',
    name: 'התרגשות',
    nameEn: 'Excitement',
    emoji: '🤩',
    color: '#059669', // ירוק חזק
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-950',
    borderColor: 'border-emerald-400'
  }
};

export const EMOTION_IDS = Object.keys(EMOTIONS);
