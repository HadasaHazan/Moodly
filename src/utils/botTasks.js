export const extractTaskFromBotText = (text, language = 'he') => {
  const raw = String(text || '').trim();
  if (!raw) return '';

  const enPatterns = [
    /(?:^|\n)\s*(?:task(?:\s*\([^)]*\))?|mini-task)\s*:\s*(.+?)(?=\n|$)/gi
  ];

  const hePatterns = [
    /(?:^|\n)\s*(?:ה?משימה(?:\s*שלי)?(?:\s*\([^)]*\))?|מיני[־-]?משימה(?:\s+להיום(?:\s+בערב)?)?)\s*:\s*(.+?)(?=\n|$)/g
  ];

  const patterns = language === 'en' ? enPatterns : hePatterns;

  let lastMatch = '';
  const run = (list) => {
    list.forEach((pattern) => {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(raw))) {
        if (match[1]) lastMatch = String(match[1]).trim();
      }
    });
  };

  run(patterns);
  if (!lastMatch) run(language === 'en' ? hePatterns : enPatterns);

  return lastMatch;
};

export const getConversationTaskText = (conversation, language = 'he') => {
  const fromRecommendation = extractTaskFromBotText(conversation?.recommendation || '', language);
  if (fromRecommendation) return fromRecommendation;
  return String(conversation?.task || '').trim();
};
