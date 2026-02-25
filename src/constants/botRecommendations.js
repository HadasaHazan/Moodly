// המלצות ומשימות לפי רגש - מותאמות לפי סוג התשובה

export const BOT_EXPLANATION = `הבוט שלי כאן כדי לעזור לך להבין את הרגשות שלך טוב יותר! 💙

אני אשאל אותך למה בחרת ברגש הזה, ואתה תענה לי בכנות.
לפי התשובה שלך אני אתן לך המלצה לשיפור או משימה קטנה שיכולה לעזור לך, ואתמוך בך.

השיחה שלך נשמרת אצלך - בסוף היום תוכל לראות סיכום של כל ההמלצות שקיבלת.`;

export const BOT_EXPLANATION_EN = `I am here to help you understand your emotions better. 💙

I will ask what led to this feeling, and then suggest a focused task.
Your conversation is saved locally so you can track progress in your daily summary.`;

const SUPPORTIVE_MESSAGES = {
  positive: [
    'נשמע שאת במקום טוב, שווה לשמור על המומנטום הזה ✨',
    'איזה יופי לראות רגע חיובי, תני לעצמך קרדיט אמיתי 🌈',
    'אנרגיה מעולה, אפשר למנף אותה לעוד משהו קטן ומיטיב 🚀',
    'כל כך טוב לשמוע רגעים חיוביים! תמשיכי לשמור על זה 💫',
    'השמחה שלך מדבקת, תני לזה מקום 🌟',
    'רגעים כאלה שווים זהב, תזכרי אותם בימים קשים יותר 💎'
  ],
  challenge: [
    'גם ימים מורכבים עוברים, את לא לבד בתוך זה 🤝',
    'עצם השיתוף שלך הוא צעד חזק מאוד, כל הכבוד על הכנות 💛',
    'מותר להתקדם בצעדים קטנים, וזה עדיין נחשב התקדמות 🌱',
    'כל רגש הוא לגיטימי, ואת עושה את זה נכון בכך שאת משתפת 💙',
    'אני כאן איתך, ואנחנו נעבור את זה יחד 🌸',
    'לפעמים רק לדבר על זה עוזר, ואת כבר עשית את הצעד הראשון 🦋',
    'את חזקה יותר ממה שאת חושבת, ואני מאמין בך 🌺',
    'כל יום הוא הזדמנות חדשה, ואת בדרך הנכונה 💪'
  ],
  neutral: [
    'תודה על השיתוף, זה עוזר לדייק את ההכוונה להמשך 🧭',
    'אני איתך בתהליך הזה ונמשיך לבנות יציבות יחד 💙',
    'מעולה ששיתפת, עכשיו אפשר לבחור פעולה שמתאימה בדיוק לך ✅',
    'כל שיחה כזו מקרבת אותנו להבנה טובה יותר 🌿',
    'אני מעריך את הכנות שלך, זה עוזר לנו לעבוד יחד 🎯'
  ]
};

const SUPPORTIVE_MESSAGES_EN = {
  positive: [
    'You are in a good place, try to keep this momentum.',
    'Great positive moment, give yourself real credit.',
    'Strong energy. You can channel it into one more useful step.',
    'So good to hear positive moments! Keep it up 💫',
    'Your joy is contagious, give it space 🌟',
    'Moments like these are gold, remember them on harder days 💎'
  ],
  challenge: [
    'Hard days pass too. You are not alone in this.',
    'Sharing this is a strong step and it matters.',
    'Small steps are still real progress.',
    'Every emotion is valid, and you are doing it right by sharing 💙',
    'I am here with you, and we will get through this together 🌸',
    'Sometimes just talking about it helps, and you already took the first step 🦋',
    'You are stronger than you think, and I believe in you 🌺',
    'Every day is a new opportunity, and you are on the right path 💪'
  ],
  neutral: [
    'Thanks for the context, this helps tailor the next step.',
    'We can keep building stability one action at a time.',
    'Good share. Now let us choose one fitting action.',
    'Every conversation like this brings us closer to better understanding 🌿',
    'I appreciate your honesty, it helps us work together 🎯'
  ]
};

const RECOMMENDATIONS_BY_MODE = {
  immediate: {
    happy: [
      { type: 'recommendation', text: 'כל כך טוב לשמוע! 🎉 המשימה שלי: שתף את השמחה שלך עם מישהו קרוב היום - זה יכול להפוך את היום שלהם לטוב יותר.',
        task: 'שתף את השמחה שלך עם מישהו קרוב' },
      { type: 'recommendation', text: 'שמחה היא מתנה! 🌟 המשימה: כתוב 3 דברים שגרמו לך להרגיש כך - כך תוכל לחזור אליהם בימים קשים.',
        task: 'כתוב 3 דברים שגרמו לך לשמחה' },
      { type: 'recommendation', text: 'זה נהדר! 😊 המשימה: קח רגע להכיר תודה על הרגע הזה - הכרת תודה מחזקת רגשות חיוביים.',
        task: 'הכר תודה על הרגע הזה' },
      { type: 'recommendation', text: 'יופי של אנרגיה ✨ המשימה: שלחי הודעה טובה למישהי שצריכה חיזוק.',
        task: 'שלחי הודעה טובה למישהי אחת' }
    ],
    sad: [
      { type: 'recommendation', text: 'אני מבין שזה קשה 💙 זכור שזה בסדר להרגיש כך. המשימה: קח 5 דקות לעשות משהו שמרגיע אותך - האזנה למוזיקה, הליכה קצרה, או שיחה עם חבר.',
        task: 'עשה משהו שמרגיע אותך - 5 דקות' },
      { type: 'recommendation', text: 'תודה על האומץ לשתף 💜 המשימה: פנה למישהו שאתה סומך עליו ושוחח איתו. לפעמים רק לדבר עוזר.',
        task: 'שוחח עם מישהו שאתה סומך עליו' },
      { type: 'recommendation', text: 'אני כאן בשבילך 🤗 המשימה: כתוב את מה שאתה מרגיש על דף - לפעמים להוציא החוצה עוזר.',
        task: 'כתוב את הרגשות שלך על דף' }
    ],
    stress: [
      { type: 'recommendation', text: 'לחץ זה משהו שכולנו חווים 😌 המשימה: נסה תרגיל נשימה - 4 שניות שאיפה, 4 שניות עצירה, 4 שניות נשיפה. חזור על זה 3 פעמים.',
        task: 'תרגיל נשימה עמוקה - 3 פעמים' },
      { type: 'recommendation', text: 'תודה ששיתפת 💙 המשימה: קח הפסקה של 10 דקות - עש משהו שאתה נהנה ממנו, או פשוט תנוח.',
        task: 'הפסקה של 10 דקות - מנוחה או פעילות מהנה' },
      { type: 'recommendation', text: 'לחץ הוא תגובה טבעית 😰 המשימה: רשום את 3 הדברים שעליהם אתה יכול לשלוט כרגע - התמקד בהם.',
        task: 'רשום 3 דברים שאתה יכול לשלוט בהם' },
      { type: 'recommendation', text: 'נורמלי להרגיש עומס. המשימה: חלקי משימה גדולה ל-2 צעדים קטנים ובצעי את הראשון עכשיו.',
        task: 'פירוק משימה גדולה לשני צעדים וביצוע הצעד הראשון' }
    ],
    anger: [
      { type: 'recommendation', text: 'כעס הוא רגש טבעי 😤 המשימה: קח 5 נשימות עמוקות לפני שאתה מגיב. זה יכול לעזור לך להגיב בצורה בריאה יותר.',
        task: '5 נשימות עמוקות לפני תגובה' },
      { type: 'recommendation', text: 'אני מבין את הכעס שלך 💢 המשימה: מצא דרך בריאה לבטא - ספורט, כתיבה, או שיחה עם מישהו שאתה סומך עליו.',
        task: 'בטא את הכעס בדרך בריאה - ספורט/כתיבה/שיחה' },
      { type: 'recommendation', text: 'כעס יכול להיות קשה 😠 המשימה: התרחק מהמצב לרגע, קח אוויר, וחזור כשאתה רגוע יותר.',
        task: 'התרחק מהמצב, קח אוויר, חזור רגוע' },
      { type: 'recommendation', text: 'בואי נהפוך את זה לפעולה בטוחה. המשימה: כתבי מה בדיוק עצבן אותך במשפט אחד בלי האשמה.',
        task: 'כתבי במשפט אחד מה הפריע לך, בלי האשמה' }
    ],
    despair: [
      { type: 'recommendation', text: 'אני מבין שזה קשה מאוד 😞 זכור שאתה לא לבד. המשימה: פנה למישהו שאתה סומך עליו - חבר, מבוגר, או הורה. חשוב לדבר.',
        task: 'פנה למישהו שאתה סומך עליו' },
      { type: 'recommendation', text: 'תודה על האומץ לשתף 💙 אם אתה מרגיש שזה נמשך, חשוב מאוד לדבר עם מבוגר או איש מקצוע. המשימה: קבע שיחה עם מישהו שאתה סומך עליו.',
        task: 'קבע שיחה עם מישהו שאתה סומך עליו' },
      { type: 'recommendation', text: 'ייאוש יכול להרגיש מכריע, אבל יש תקווה 🌟 המשימה: כתוב דבר אחד קטן שאתה יכול לעשות היום שיעזור לך להרגיש קצת יותר טוב.',
        task: 'כתוב דבר אחד קטן שיעזור לך היום' },
      { type: 'recommendation', text: 'כדי לייצר אחיזה, המשימה: הגדירי פעולה אחת של 3 דקות בלבד ועשי אותה עכשיו.',
        task: 'בחרי פעולה של 3 דקות ובצעי מיד' }
    ],
    excitement: [
      { type: 'recommendation', text: 'זה כל כך מרגש! 🎉 המשימה: שתף את ההתרגשות שלך עם מישהו - זה יכול להכפיל את השמחה!',
        task: 'שתף את ההתרגשות עם מישהו' },
      { type: 'recommendation', text: 'וואו, זה נשמע מדהים! 🌟 המשימה: כתוב מה אתה מרגיש - כך תוכל לזכור את הרגע הזה.',
        task: 'כתוב מה אתה מרגיש - לזכור את הרגע' },
      { type: 'recommendation', text: 'התרגשות היא רגש נפלא 😊 המשימה: נצל את האנרגיה החיובית - עשה משהו פרודוקטיבי או מהנה.',
        task: 'נצל את האנרגיה - עשה משהו פרודוקטיבי או מהנה' },
      { type: 'recommendation', text: 'אנרגיה כזו שווה לתעד. המשימה: כתבי מה בדיוק ריגש אותך כדי לחזור לזה בהמשך.',
        task: 'תעדי מה ריגש אותך' }
    ]
  },
  daily: {
    happy: [
      { type: 'recommendation', text: 'נשמע שהיה יום טוב. משימת סוף יום: רשמי 3 רגעים חיוביים מהיום.',
        task: 'רשמי 3 רגעים חיוביים מהיום' },
      { type: 'recommendation', text: 'כדי לשמר יציבות, בחרי הרגל אחד קטן שתרצי לחזור עליו גם מחר.',
        task: 'בחרי הרגל חיובי אחד למחר' }
    ],
    sad: [
      { type: 'recommendation', text: 'לסיום היום, המשימה: כתבי מה היה קשה ומה עזר אפילו קצת.',
        task: 'כתבי מה היה קשה ומה עזר מעט' },
      { type: 'recommendation', text: 'לפני שינה, נסי פעולה מרגיעה אחת של 10 דקות.',
        task: 'פעילות מרגיעה של 10 דקות לפני שינה' }
    ],
    stress: [
      { type: 'recommendation', text: 'סיכום יום בלחץ: רשמי את 2 המשימות החשובות למחר בלבד.',
        task: 'הגדרת 2 משימות עיקריות למחר' },
      { type: 'recommendation', text: 'כדי לסיים יום רגוע יותר: תרגיל נשימה של 3 סבבים לפני שינה.',
        task: '3 סבבי נשימה לפני שינה' }
    ],
    anger: [
      { type: 'recommendation', text: 'משימת סיום: כתבי מה היה הטריגר ומה תעשי אחרת בפעם הבאה.',
        task: 'כתיבת טריגר ותגובה חלופית' },
      { type: 'recommendation', text: 'לשחרור עומס: פעילות פיזית קלה של 8-12 דקות.',
        task: 'פעילות פיזית קלה 8-12 דקות' }
    ],
    despair: [
      { type: 'recommendation', text: 'סיכום חשוב להיום: שתפי אדם אחד שאת סומכת עליו במה שעובר עלייך.',
        task: 'שיתוף אדם קרוב בתחושות' },
      { type: 'recommendation', text: 'משימה עדינה לסוף יום: בחרי פעולה קטנה אחת למחר בבוקר.',
        task: 'הגדרת פעולה קטנה לבוקר' }
    ],
    excitement: [
      { type: 'recommendation', text: 'לסיכום: תרגמי את ההתרגשות לצעד פרקטי אחד למחר.',
        task: 'צעד פרקטי אחד למחר' },
      { type: 'recommendation', text: 'תעדי את שיא היום במשפט קצר כדי לשמור את האנרגיה הזו.',
        task: 'תיעוד שיא היום במשפט אחד' }
    ]
  }
};

const DEFAULT_REC = { type: 'recommendation', text: 'תודה ששיתפת אותי 💙 זכור שכל הרגשות שלך תקפים. המשימה: קח רגע להכיר ברגש שלך ולהבין אותו.',
  task: 'הכר ברגש שלך והבן אותו' };

const REASON_BASED_RECS_HE = {
  stress: [
    { keywords: ['מבחן', 'מבחנים', 'לימודים', 'ציונים'], text: 'נשמע שזה לחץ לימודי. משימה: 20 דקות למידה ממוקדת + 5 דקות הפסקה, ואז לסמן מה הושלם.', task: '20/5 למידה ממוקדת וסימון התקדמות' },
    { keywords: ['עבודה', 'מנהל', 'משימה', 'דדליין', 'פרויקט'], text: 'כשיש עומס עבודה, חשוב לצמצם. משימה: לבחור רק 2 משימות קריטיות להיום ולדחות את השאר.', task: 'בחירת 2 משימות קריטיות בלבד להיום' },
    { keywords: ['כסף', 'כלכלי', 'חובות'], text: 'לחץ כלכלי מכביד. משימה: לרשום 3 צעדים פיננסיים קטנים לשבוע הקרוב ולבצע את הראשון.', task: 'תכנון 3 צעדים כלכליים קטנים וביצוע הראשון' }
  ],
  sad: [
    { keywords: ['לבד', 'בדידות', 'חברים', 'חבר', 'זוגיות'], text: 'כשיש תחושת בדידות, חיבור קטן עוזר. משימה: לשלוח הודעה לאדם אחד וליזום שיחה קצרה היום.', task: 'יזום שיחה קצרה עם אדם קרוב' },
    { keywords: ['פרידה', 'אכזבה', 'כישלון'], text: 'אכזבה דורשת רכות. משימה: כתבי 5 משפטים של חמלה עצמית כאילו היית מדברת לחברה טובה.', task: 'כתיבת 5 משפטי חמלה עצמית' },
    { keywords: ['עייפות', 'שינה', 'מותש'], text: 'עייפות מגבירה עצב. משימה: 30 דקות בלי מסכים לפני שינה והכנת שעת שינה קבועה להיום.', task: '30 דקות בלי מסך לפני שינה' }
  ],
  anger: [
    { keywords: ['ריב', 'ויכוח', 'פגעו', 'צעקו'], text: 'במצב של קונפליקט, עדיף ניסוח ברור. משימה: לנסח הודעה קצרה עם "אני מרגישה..." בלי האשמה.', task: 'ניסוח הודעת "אני מרגישה" ללא האשמה' },
    { keywords: ['עומס', 'פקק', 'לחץ'], text: 'כעס ועומס הולכים יחד. משימה: לפרוק אנרגיה ב-10 דקות הליכה מהירה ואז לחזור לקבלת החלטה.', task: '10 דקות הליכה מהירה לשחרור כעס' }
  ],
  despair: [
    { keywords: ['לבד', 'אין', 'לא יכול', 'לא יכולה', 'חסר תקווה'], text: 'אני שומע שזה כבד מאוד. משימה: לבחור אדם בטוח אחד ולשלוח הודעה: "קשה לי, אפשר לדבר?"', task: 'פנייה לאדם בטוח עם בקשת שיחה' },
    { keywords: ['לא ישן', 'לא ישנה', 'עייפות'], text: 'כשאין שינה הכל מרגיש קשה יותר. משימה: שגרת לילה קצרה של מקלחת חמה + נשימות + כיבוי מסך 20 דקות.', task: 'שגרת לילה קצרה לייצוב' }
  ],
  happy: [
    { keywords: ['חברים', 'משפחה', 'בן זוג', 'בת זוג'], text: 'שמחה חברתית שווה חיזוק. משימה: לקבוע עוד רגע חיובי קטן עם האנשים שעשו לך טוב.', task: 'קביעת רגע חיובי נוסף עם אנשים קרובים' },
    { keywords: ['הצלחה', 'הישג', 'פרויקט'], text: 'הצלחה היא בסיס מצוין. משימה: לתעד מה בדיוק עבד לך כדי לשחזר את זה שוב.', task: 'תיעוד מה עבד בהצלחה האחרונה' }
  ],
  excitement: [
    { keywords: ['פרויקט', 'רעיון', 'מיזם'], text: 'התרגשות מרעיון דורשת תרגום לפעולה. משימה: לבחור צעד ביצוע ראשון של 15 דקות ולעשות אותו עכשיו.', task: 'צעד ביצוע ראשון של 15 דקות' },
    { keywords: ['טיסה', 'נסיעה', 'אירוע'], text: 'התרגשות מאירוע קרוב מעולה לתכנון. משימה: להכין checklist קצר של 5 פריטים הכרחיים.', task: 'Checklist קצר של 5 פריטים' }
  ]
};

const EN_RECOMMENDATIONS = {
  happy: [
    { type: 'recommendation', text: 'Great energy. Task: share one positive moment with someone close.', task: 'Share one positive moment with someone close' },
    { type: 'recommendation', text: 'Task: write 3 reasons this felt good, so you can revisit them later.', task: 'Write 3 reasons this felt good' }
  ],
  sad: [
    { type: 'recommendation', text: 'Task: do one soothing 5-minute action: music, short walk, or deep breathing.', task: 'Do one soothing 5-minute action' },
    { type: 'recommendation', text: 'Task: message one trusted person and share how you feel.', task: 'Message one trusted person' }
  ],
  stress: [
    { type: 'recommendation', text: 'Task: 3 rounds of 4-4-4 breathing.', task: '3 rounds of 4-4-4 breathing' },
    { type: 'recommendation', text: 'Task: define only your top 2 priorities for the next step.', task: 'Define top 2 priorities' }
  ],
  anger: [
    { type: 'recommendation', text: 'Task: pause, take 5 deep breaths, then write one clear sentence about what upset you.', task: '5 breaths + one clear sentence' },
    { type: 'recommendation', text: 'Task: release physically with 8 minutes of light movement.', task: '8 minutes of light movement' }
  ],
  despair: [
    { type: 'recommendation', text: 'Task: reach out to one trusted person today.', task: 'Reach out to one trusted person' },
    { type: 'recommendation', text: 'Task: choose one 3-minute action and complete it now.', task: 'Complete one 3-minute action now' }
  ],
  excitement: [
    { type: 'recommendation', text: 'Task: convert this excitement into one practical next step for tomorrow.', task: 'Define one practical next step' },
    { type: 'recommendation', text: 'Task: capture today’s high point in one sentence.', task: 'Capture today’s high point in one sentence' }
  ]
};

export const getRecommendationsByEmotion = (emotionId) => {
  const emotionRecs = RECOMMENDATIONS_BY_MODE.immediate[emotionId] || [
    DEFAULT_REC
  ];

  return emotionRecs[Math.floor(Math.random() * emotionRecs.length)];
};

// התאמת המלצה לפי מילות מפתח בתשובה
export const getRecommendationByAnswer = (emotionId, userAnswer, options = {}) => {
  const mode = options.mode || 'immediate';
  const language = options.language || 'he';
  const answer = (userAnswer || '').toLowerCase();

  if (language !== 'en') {
    const reasonPool = (REASON_BASED_RECS_HE[emotionId] || []).filter((entry) =>
      entry.keywords.some((keyword) => answer.includes(keyword))
    );
    if (reasonPool.length > 0) {
      const selected = reasonPool[Math.floor(Math.random() * reasonPool.length)];
      return { type: 'recommendation', text: selected.text, task: selected.task };
    }
  }

  if (language === 'en') {
    const english = EN_RECOMMENDATIONS[emotionId] || [EN_RECOMMENDATIONS.stress[0]];
    return english[Math.floor(Math.random() * english.length)];
  }
  const recs = RECOMMENDATIONS_BY_MODE[mode]?.[emotionId] || RECOMMENDATIONS_BY_MODE.immediate[emotionId] || [DEFAULT_REC];

  // מילות מפתח - אם מופיעות, נבחר המלצה ספציפית
  const keywordMap = {
    stress: {
      'מבחן': [0], 'מבחנים': [0], 'לימודים': [0], 'עבודה': [0], 'עומס': [0],
      'נשימה': [0, 1], 'הפסקה': [1], 'שלוט': [1], 'שליטה': [1], 'לחוץ': [0]
    },
    sad: {
      'חבר': [1], 'חברים': [1], 'משפחה': [1], 'לדבר': [1], 'שיחה': [1],
      'לכתוב': [0], 'כתיבה': [0], 'מוזיקה': [0], 'הליכה': [0]
    },
    anger: {
      'נשימה': [0], 'להתרחק': [0], 'ספורט': [1], 'כתיבה': [1], 'עצבים': [0]
    },
    happy: {
      'חברים': [0], 'הודעה': [3], 'תודה': [2], 'שמח': [1, 2]
    },
    despair: {
      'לבד': [0], 'קשה': [1], 'אין כוח': [2]
    },
    excitement: {
      'מבחן': [2], 'פרויקט': [2], 'חלום': [1], 'הצלחה': [0]
    }
  };

  const keywords = keywordMap[emotionId];
  if (keywords) {
    for (const [keyword, indexes] of Object.entries(keywords)) {
      if (answer.includes(keyword)) {
        const candidates = indexes.map((idx) => recs[idx]).filter(Boolean);
        if (candidates.length > 0) {
          return candidates[Math.floor(Math.random() * candidates.length)];
        }
      }
    }
  }

  return recs[Math.floor(Math.random() * recs.length)];
};

const parseSleepHours = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const raw = String(value).trim().replace(',', '.');
  const num = Number(raw);
  if (!Number.isFinite(num)) return null;
  return num;
};

const parseScaleNumber = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const raw = String(value).trim().replace(',', '.');
  const num = Number(raw);
  if (!Number.isFinite(num)) return null;
  return num;
};

const hasCrisisSignals = (text = '') => {
  const t = String(text || '').toLowerCase();
  if (!t) return false;
  const needles = [
    // English
    'suicide',
    'kill myself',
    'end my life',
    'self harm',
    'harm myself',
    // Hebrew (common)
    'אובד',
    'אובדני',
    'להתאבד',
    'להרוג את עצמי',
    'לגמור עם זה',
    'לא רוצה לחיות',
    'לפגוע בעצמי',
    'פגיעה עצמית'
  ];
  return needles.some((needle) => t.includes(needle));
};

export const getGuidedRecommendation = (emotionId, answers = {}, options = {}) => {
  const language = options.language || 'he';
  const mode = options.mode || 'immediate';
  const sleepHours = parseSleepHours(answers.sleepHours);
  const energyLevel = parseScaleNumber(answers.energyLevel);
  const stressLevel = parseScaleNumber(answers.stressLevel);
  const contextText = String(answers.hardThing || answers.mainThing || answers.context || '').trim();
  const helpNowText = String(answers.helpNow || '').trim();

  if (hasCrisisSignals(`${contextText}\n${helpNowText}`)) {
    if (language === 'en') {
      return {
        type: 'recommendation',
        text:
          `I’m really sorry you’re dealing with this. You deserve support right now.\n\n` +
          `If you are in immediate danger, call your local emergency number.\n` +
          `If you are in the US, you can call or text 988 (Suicide & Crisis Lifeline).\n\n` +
          `Task (right now): reach out to one trusted adult/person and say: “I’m not feeling safe. Can you stay with me / talk with me?”`,
        task: 'Reach out to a trusted person now'
      };
    }
    return {
      type: 'recommendation',
      text:
        `אני ממש מצטער/ת לשמוע שזה מרגיש ככה. מגיע לך לקבל תמיכה עכשיו.\n\n` +
        `אם יש סכנה מיידית — פנה/י מיד למספר החירום המקומי או למבוגר אחראי קרוב.\n` +
        `אם את/ה בארה״ב אפשר להתקשר/לשלוח הודעה ל‑988.\n\n` +
        `משימה (עכשיו): לפנות לאדם בטוח אחד ולכתוב: “לא בטוח/ה לי. אפשר לדבר/להיות איתי?”`,
      task: 'פנייה לאדם בטוח עכשיו'
    };
  }

  // Start with the existing keyword-based recommendation to keep behavior familiar.
  const base = getRecommendationByAnswer(emotionId, contextText || ' ', { mode, language });

  if (language === 'en') {
    const preface = [];
    if (sleepHours !== null && sleepHours <= 5) {
      preface.push(
        `Low sleep can intensify ${emotionId === 'anger' ? 'irritability' : 'stress'}.\n` +
          `Mini-task: tonight, try a simple wind-down: 20 minutes without screens + 5 slow breaths.`
      );
    }
    if (stressLevel !== null && stressLevel >= 7) {
      preface.push(
        `High stress (7/10+). Mini-task: do 60 seconds of slow breathing (in 4, out 6) before you act.`
      );
    }
    if (energyLevel !== null && energyLevel <= 3) {
      preface.push(
        `Low energy (3/10 or less). Choose the smallest possible step: 2 minutes of movement or a glass of water.`
      );
    }

    if (sleepHours !== null && sleepHours <= 5) {
      return {
        type: 'recommendation',
        text:
          `${preface.length ? `${preface.join('\n')}\n\n` : ''}` +
          `${base.text}`,
        task: '20 minutes no screens + 5 breaths'
      };
    }
    if (preface.length > 0) {
      return { ...base, text: `${preface.join('\n')}\n\n${base.text}` };
    }
    return base;
  }

  const preface = [];
  if (sleepHours !== null && sleepHours <= 5) {
    preface.push(
      `חוסר שינה יכול להגביר לחץ/עצבנות ולהקשות על ויסות רגשי.\n` +
        `מיני־משימה להיום בערב: “נחיתה רכה” — 20 דקות בלי מסכים + 5 נשימות איטיות.`
    );
  }
  if (stressLevel !== null && stressLevel >= 7) {
    preface.push(
      `נשמע שיש הרבה לחץ (7/10+). מיני־משימה: 60 שניות נשימה איטית (שאיפה 4, נשיפה 6) לפני פעולה/תגובה.`
    );
  }
  if (energyLevel !== null && energyLevel <= 3) {
    preface.push(
      `האנרגיה נמוכה (3/10 או פחות). כדאי לבחור צעד הכי קטן שיש: 2 דקות תנועה או כוס מים.`
    );
  }

  if (preface.length > 0) {
    return {
      ...base,
      text: `${preface.join('\n')}\n\n${base.text}`
    };
  }

  return base;
};

export const getProfessionalBotReply = ({ emotionId, emotionName, language, answers, mode = 'immediate' }) => {
  const mainThing = String(answers?.mainThing || '').trim();
  const context = String(answers?.context || '').trim();
  const helpNow = String(answers?.helpNow || '').trim();
  const sleepHours = parseSleepHours(answers?.sleepHours);
  const energyLevel = parseScaleNumber(answers?.energyLevel);
  const stressLevel = parseScaleNumber(answers?.stressLevel);
  const topics = extractTopics(`${mainThing}\n${context}\n${helpNow}`);
  const label = topicLabel(topics, language);

  const rec = getGuidedRecommendation(emotionId, { ...answers, mainThing }, { mode, language });

  if (language === 'en') {
    const bullets = [
      mainThing ? `- Context: ${mainThing}` : null,
      context ? `- Detail: ${context}` : null,
      label ? `- Theme: ${label}` : null,
      sleepHours !== null ? `- Sleep: ${sleepHours}h` : null,
      energyLevel !== null ? `- Energy: ${energyLevel}/10` : null,
      stressLevel !== null ? `- Stress: ${stressLevel}/10` : null
    ].filter(Boolean);

    const regulation =
      stressLevel !== null && stressLevel >= 7
        ? 'Regulate first (60 seconds): inhale 4, exhale 6, repeat 6 times.'
        : energyLevel !== null && energyLevel <= 3
          ? 'Keep it tiny: drink water + 2 minutes of movement.'
          : 'Quick reset: 3 slow breaths and relax your shoulders.';

    const action =
      topics.exam || topics.school
        ? 'School step: pick the *smallest* next action (10 minutes) and start it now.'
        : topics.conflict
          ? 'Conflict step: write one “I feel… I need…” sentence (no blame).'
          : topics.loneliness
            ? 'Connection step: message one safe person with one honest sentence.'
            : 'Next step: choose one small action you can do in the next 15 minutes.';

    const helpLine = helpNow ? `What you asked for: ${helpNow}` : null;

    const text =
      `Here’s what I’m hearing about${emotionName ? ` ${emotionName}` : ''}:\n` +
      `${bullets.length ? `${bullets.join('\n')}\n\n` : ''}` +
      `${regulation}\n${action}\n\n` +
      `${helpLine ? `${helpLine}\n\n` : ''}` +
      `${rec.text}`;

    return { text, task: rec.task };
  }

  const bullets = [
    mainThing ? `- הקשר: ${mainThing}` : null,
    context ? `- פרט חשוב: ${context}` : null,
    label ? `- נושא מרכזי: ${label}` : null,
    sleepHours !== null ? `- שינה: ${sleepHours} שעות` : null,
    energyLevel !== null ? `- אנרגיה: ${energyLevel}/10` : null,
    stressLevel !== null ? `- לחץ: ${stressLevel}/10` : null
  ].filter(Boolean);

  const regulation =
    stressLevel !== null && stressLevel >= 7
      ? 'קודם נרגיע (60 שניות): שאיפה 4, נשיפה 6 — 6 פעמים.'
      : energyLevel !== null && energyLevel <= 3
        ? 'נלך על הכי קטן: כוס מים + 2 דקות תנועה.'
        : 'איפוס קצר: 3 נשימות איטיות ושחרור כתפיים.';

  const action =
    topics.exam || topics.school
      ? 'צעד לימודי: לבחור *את הצעד הכי קטן* (10 דקות) ולהתחיל עכשיו.'
      : topics.conflict
        ? 'צעד לקונפליקט: לנסח משפט “אני מרגיש/ה… ואני צריך/ה…” בלי האשמה.'
        : topics.loneliness
          ? 'צעד לחיבור: לשלוח הודעה לאדם בטוח במשפט אחד אמיתי.'
          : 'צעד הבא: לבחור פעולה קטנה שאפשר לעשות ב־15 דקות הקרובות.';

  const helpLine = helpNow ? `מה שביקשת: ${helpNow}` : null;

  const text =
    `מה שאני מבין לגבי${emotionName ? ` ${emotionName}` : ''}:\n` +
    `${bullets.length ? `${bullets.join('\n')}\n\n` : ''}` +
    `${regulation}\n${action}\n\n` +
    `${helpLine ? `${helpLine}\n\n` : ''}` +
    `${rec.text}`;

  return { text, task: rec.task };
};

export const getSupportiveMessageByEmotion = (emotionId, language = 'he') => {
  const source = language === 'en' ? SUPPORTIVE_MESSAGES_EN : SUPPORTIVE_MESSAGES;
  if (emotionId === 'happy' || emotionId === 'excitement') {
    const messages = source.positive;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (emotionId === 'sad' || emotionId === 'stress' || emotionId === 'anger' || emotionId === 'despair') {
    const messages = source.challenge;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  const messages = source.neutral;
  return messages[Math.floor(Math.random() * messages.length)];
};

const pickOne = (items) => items[Math.floor(Math.random() * items.length)];

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractTopics = (rawText) => {
  const text = normalizeText(rawText);
  const has = (needles) => needles.some((n) => text.includes(n));
  return {
    exam: has(['מבחן', 'מבחנים', 'בגרות', 'test', 'exam', 'quiz']),
    school: has(['בית ספר', 'כיתה', 'שיעור', 'מורה', 'homework', 'school', 'class', 'teacher']),
    friends: has(['חבר', 'חברים', 'bestie', 'friend', 'friends']),
    family: has(['אמא', 'אבא', 'הורים', 'משפחה', 'mom', 'dad', 'parents', 'family']),
    conflict: has(['ריב', 'ויכוח', 'צעק', 'כעס', 'fight', 'argu', 'yell', 'conflict']),
    loneliness: has(['לבד', 'בודד', 'אין לי', 'lonely', 'alone']),
    sleep: has(['שינה', 'ישנתי', 'לא ישנתי', 'sleep', 'slept', 'insomnia']),
    body: has(['כאב', 'ראש', 'בטן', 'חולה', 'pain', 'sick', 'headache', 'stomach'])
  };
};

const topicLabel = (topics, language) => {
  const order = ['exam', 'school', 'friends', 'family', 'conflict', 'loneliness', 'sleep', 'body'];
  const labelsHe = {
    exam: 'מבחנים/לחץ לימודי',
    school: 'מסגרת בית הספר',
    friends: 'חברים',
    family: 'משפחה',
    conflict: 'קונפליקט/ריב',
    loneliness: 'בדידות',
    sleep: 'שינה',
    body: 'הגוף/עייפות'
  };
  const labelsEn = {
    exam: 'tests / school pressure',
    school: 'school context',
    friends: 'friends',
    family: 'family',
    conflict: 'conflict',
    loneliness: 'loneliness',
    sleep: 'sleep',
    body: 'your body / fatigue'
  };
  const labels = language === 'en' ? labelsEn : labelsHe;
  const key = order.find((k) => topics[k]);
  return key ? labels[key] : null;
};

export const getBotIntroText = ({ emotionLabel, language, mode = 'immediate' }) => {
  const isDaily = mode === 'daily';
  if (language === 'en') {
    return isDaily
      ? `Quick check-in about your day. I’ll ask 2–4 short questions and then suggest one practical next step.`
      : `Got it: ${emotionLabel}. I’ll ask 2–4 short questions and then suggest one practical next step.`;
  }
  return isDaily
    ? `צ׳ק־אין קצר על היום. אשאל 2–4 שאלות קצרות ואז אתן צעד פרקטי אחד להמשך.`
    : `קיבלתי: ${emotionLabel}. אשאל 2–4 שאלות קצרות ואז אתן צעד פרקטי אחד להמשך.`;
};

export const getBotQuestionText = ({ questionId, emotionName, language }) => {
  const emotionPart =
    emotionName ? (language === 'en' ? ` ${emotionName}` : ` ${emotionName}`) : '';

  if (questionId === 'mainThing') {
    return language === 'en'
      ? pickOne([
          `What made you pick${emotionPart} just now?`,
          `What happened (or what went through your mind) that fits${emotionPart}?`,
          `If you had to name the main trigger for${emotionPart}—what was it?`,
          `What’s the story behind choosing${emotionPart}?`
        ])
      : pickOne([
          `למה בחרת${emotionPart}? מה קרה/מה עבר עליך?`,
          `מה הדבר המרכזי שהוביל אותך לבחור${emotionPart}?`,
          `אם היית מסביר/ה בשורה אחת למה בחרת${emotionPart}—מה היית אומר/ת?`,
          `איזה רגע/מחשבה גרמו לך לבחור${emotionPart}?`
        ]);
  }

  if (questionId === 'sleepHours') {
    return language === 'en'
      ? pickOne([
          'Roughly how many hours did you sleep last night?',
          'How was your sleep last night (hours)?',
          'Sleep check: about how many hours?'
        ])
      : pickOne([
          'בדיקת שינה: כמה שעות ישנת בערך בלילה האחרון?',
          'כמה שעות שינה היו לך אתמול בלילה בערך?',
          'איך הייתה השינה אתמול? כמה שעות בערך?'
        ]);
  }

  if (questionId === 'energyLevel') {
    return language === 'en'
      ? pickOne([
          'Right now, what is your energy level (1–10)?',
          'Energy check (1–10): where are you right now?',
          'If 1 is empty and 10 is full—what’s your energy now?'
        ])
      : pickOne([
          'כמה אנרגיה יש לך עכשיו (1–10)?',
          'אם 1 זה “אין כוח” ו־10 זה “מלא אנרגיה” — איפה אתה/את עכשיו?',
          'בדיקת אנרגיה (1–10): כמה יש לך עכשיו?'
        ]);
  }

  if (questionId === 'stressLevel') {
    return language === 'en'
      ? pickOne([
          'Right now, how stressed do you feel (1–10)?',
          'Stress check (1–10): where are you at?',
          'If 10 is “too much”—how high is your stress right now (1–10)?'
        ])
      : pickOne([
          'כמה לחץ יש לך עכשיו (1–10)?',
          'בדיקת לחץ (1–10): איפה זה עומד עכשיו?',
          'אם 10 זה “ממש הרבה” — כמה לחץ יש כרגע (1–10)?'
        ]);
  }

  if (questionId === 'helpNow') {
    return language === 'en'
      ? pickOne([
          'What would help you most right now (even something small)?',
          'What do you need most right now?',
          'If I could help with one small thing—what would it be?'
        ])
      : pickOne([
          'מה הכי היה יכול לעזור לך עכשיו (גם משהו קטן)?',
          'מה היית צריך/ה עכשיו כדי להרגיש קצת יותר טוב?',
          'אם הייתי יכול/ה לעזור בדבר קטן אחד — מה זה היה?'
        ]);
  }

  if (questionId === 'context') {
    return language === 'en'
      ? pickOne([
          'What part of this situation is the biggest piece right now?',
          'What is the hardest part about it?',
          'If we focus on one detail—what matters most here?'
        ])
      : pickOne([
          'מה החלק הכי משמעותי בסיטואציה הזאת כרגע?',
          'מה הכי קשה בזה?',
          'אם נתמקד בפרט אחד — מה הכי חשוב כאן?'
        ]);
  }

  return language === 'en' ? 'Tell me more.' : 'ספר/י לי עוד.';
};

export const getContextualReflectionText = ({ questionId, answer, emotionName, language, answers }) => {
  const topics = extractTopics(`${answer}\n${answers?.mainThing || ''}\n${answers?.helpNow || ''}`);
  const label = topicLabel(topics, language);
  const emotionPart = emotionName ? ` (${emotionName})` : '';

  if (language === 'en') {
    if (questionId === 'mainThing') {
      return label
        ? pickOne([`Got it — ${label}.`, `Thanks. Sounds like ${label}.`, `Okay — ${label}.`])
        : pickOne([`Got it${emotionPart}.`, 'Thanks — got it.', 'Okay, I hear you.']);
    }

    if (questionId === 'sleepHours') {
      return pickOne(['Got it.', 'Thanks.', 'Okay.']);
    }

    if (questionId === 'energyLevel') {
      return pickOne(['Okay.', 'Got it.', 'Thanks.']);
    }

    if (questionId === 'stressLevel') {
      return pickOne(['Got it.', 'Okay.', 'Thanks.']);
    }

    return pickOne(['Thanks.', 'Got it.', 'Okay.']);
  }

  if (questionId === 'mainThing') {
    return label
      ? pickOne([`הבנתי — ${label}.`, `תודה. נשמע שזה סביב ${label}.`, `אוקיי — ${label}.`])
      : pickOne([`הבנתי${emotionPart}.`, 'תודה, הבנתי.', 'אוקיי, איתך.']);
  }

  if (questionId === 'sleepHours') {
    return pickOne(['הבנתי.', 'תודה.', 'אוקיי.']);
  }

  if (questionId === 'energyLevel') {
    return pickOne(['אוקיי.', 'הבנתי.', 'תודה.']);
  }

  if (questionId === 'stressLevel') {
    return pickOne(['הבנתי.', 'אוקיי.', 'תודה.']);
  }

  return pickOne(['תודה.', 'הבנתי.', 'אוקיי.']);
};

export const buildAdaptiveQuestionPlan = ({ emotionLabel, emotionId, language, mode = 'immediate', mainThing = '' }) => {
  const topics = extractTopics(mainThing);
  const ids = [];
  const isDaily = mode === 'daily';
  const prefix = emotionLabel ? (language === 'en' ? `About ${emotionLabel}: ` : `לגבי ${emotionLabel}: `) : '';

  const contextQuestionText = () => {
    if (language === 'en') {
      if (topics.exam || topics.school) {
        return pickOne([
          `${prefix}School detail: what exactly is coming up, and what part feels hardest?`,
          `${prefix}Is this about an assignment/test? What’s the most stressful piece?`,
          `${prefix}What is the one school thing that is sitting on your mind the most?`
        ]);
      }
      if (topics.conflict) {
        return pickOne([
          `${prefix}Conflict detail: what happened, and what do you wish the other side understood?`,
          `${prefix}In one sentence—what was the trigger and what do you need now?`,
          `${prefix}What part of the conflict feels unresolved?`
        ]);
      }
      if (topics.friends || topics.family) {
        return pickOne([
          `${prefix}Relationship detail: what changed, and what do you need from them?`,
          `${prefix}What was the key moment in that relationship situation?`,
          `${prefix}What would “better” look like in that situation?`
        ]);
      }
      if (topics.loneliness) {
        return pickOne([
          `${prefix}Loneliness detail: when did it feel strongest today, and were you with anyone?`,
          `${prefix}What makes it feel most lonely right now—missing someone, feeling left out, or something else?`,
          `${prefix}Is there one person you’d feel okay reaching out to?`
        ]);
      }
      if (topics.body) {
        return pickOne([
          `${prefix}Body check: where do you feel it (head/stomach/chest), and what helps even a bit?`,
          `${prefix}Are there any physical signs (tension, headache, nausea)?`,
          `${prefix}What did your body need today that it didn’t get (food, water, rest, movement)?`
        ]);
      }
      return getBotQuestionText({ questionId: 'context', emotionName: '', language });
    }

    if (topics.exam || topics.school) {
      return pickOne([
        `${prefix}פרט לימודי: מה בדיוק עומד לקרות, ומה החלק שהכי מלחיץ?`,
        `${prefix}זה קשור למטלה/מבחן? מה החלק הכי קשה שם?`,
        `${prefix}מה הדבר הלימודי שהכי “יושב לך בראש” כרגע?`
      ]);
    }
    if (topics.conflict) {
      return pickOne([
        `${prefix}פרט על הקונפליקט: מה קרה, ומה היית רוצה שיבינו?`,
        `${prefix}במשפט אחד—מה הפעיל את זה ומה אתה/את צריך/ה עכשיו?`,
        `${prefix}מה מרגיש עדיין לא פתור בסיטואציה?`
      ]);
    }
    if (topics.friends || topics.family) {
      return pickOne([
        `${prefix}פרט על הקשר: מה השתנה, ומה היית צריך/ה מהם?`,
        `${prefix}מה היה הרגע המרכזי בסיטואציה עם אנשים קרובים?`,
        `${prefix}איך היה נראה “שיפור” בסיטואציה הזאת?`
      ]);
    }
    if (topics.loneliness) {
      return pickOne([
        `${prefix}פרט על בדידות: מתי זה היה הכי חזק היום, והיית עם עוד אנשים?`,
        `${prefix}מה הכי יוצר את תחושת הבדידות—געגוע, להרגיש בחוץ, או משהו אחר?`,
        `${prefix}יש אדם אחד שהיית יכול/ה לפנות אליו?`
      ]);
    }
    if (topics.body) {
      return pickOne([
        `${prefix}בדיקת גוף: איפה מרגישים את זה (ראש/בטן/חזה), ומה קצת עוזר?`,
        `${prefix}יש סימנים בגוף (מתח, כאב ראש, בחילה)?`,
        `${prefix}מה הגוף היה צריך היום ולא קיבל (אוכל, מים, מנוחה, תנועה)?`
      ]);
    }
    return getBotQuestionText({ questionId: 'context', emotionName: '', language });
  };

  // Keep it short: 2–4 follow-ups max (plus the final help question).
  // We bias to: (1) sleep if mentioned or challenging emotion, (2) one context question, (3) one scale if needed, (4) helpNow.
  const challenging = ['sad', 'stress', 'anger', 'despair'].includes(emotionId);

  if (topics.sleep || challenging) ids.push('sleepHours');

  // One context-specific question (professionally narrows the situation).
  ids.push('context');

  if (topics.exam || topics.school) {
    ids.push('stressLevel');
  } else if (topics.conflict || topics.friends || topics.family) {
    ids.push('stressLevel');
  } else if (topics.body) {
    ids.push('energyLevel');
  } else if (topics.loneliness) {
    ids.push('energyLevel');
  } else {
    ids.push(challenging ? 'stressLevel' : 'energyLevel');
  }

  // Add one more scale if we still have room and it helps.
  // Daily mode: keep it slightly shorter.
  if (!isDaily && ids.length < 3) ids.push('energyLevel');
  if (ids.length < 4 && !ids.includes('stressLevel')) ids.push('stressLevel');

  // Always end with helpNow.
  ids.push('helpNow');

  // Ensure max 4 follow-ups, but always keep 'helpNow' as the last one.
  const withoutHelp = ids.filter((id) => id !== 'helpNow');
  const trimmed = [...withoutHelp.slice(0, 3), 'helpNow'];
  return trimmed.map((id) => ({
    id,
    text: id === 'context'
      ? contextQuestionText()
      : getBotQuestionText({ questionId: id, emotionName: id === 'mainThing' ? emotionLabel : '', language })
  }));
};

export const getBotClosingMessageShort = (language = 'he') => (
  language === 'en'
    ? 'Saved to your daily summary.'
    : 'שמתי את זה בסיכום היומי שלך.'
);

export const getBotClosingMessage = (language = 'he') => (
  language === 'en'
    ? 'This chat was saved to your daily summary. You can keep tracking your task progress there.'
    : 'השיחה נשמרה בסיכום היומי, וניתן לעקוב שם אחרי המשימה וההתקדמות שלך.\nאפשר לדבר שוב בכל זמן דרך בחירת רגש נוסף.'
);

const BOT_QUESTIONS = {
  immediate: {
    happy: [
      'מה היה הרגע המרכזי שגרם לשמחה הזו?',
      'איזו פעולה תרצי לשמר מהיום הזה?'
    ],
    sad: [
      'מה בעיקר הכביד עלייך ברגע הזה?',
      'מה הכי היית צריכה לקבל כרגע?'
    ],
    stress: [
      'מה הכי מלחיץ אותך כרגע?',
      'איזה חלק מהעומס הכי דחוף לטיפול?'
    ],
    anger: [
      'מה הפעיל את הכעס הזה?',
      'מה חשוב לך שיבינו בסיטואציה הזאת?'
    ],
    despair: [
      'מה הכי קשה לך כרגע לשאת?',
      'איזה תמיכה קטנה הייתה עוזרת עכשיו?'
    ],
    excitement: [
      'מה מרגש אותך במיוחד עכשיו?',
      'לאיזה צעד ראשון תרצי לתעל את האנרגיה הזאת?'
    ]
  },
  daily: {
    default: [
      'מה היה הרגע הכי משמעותי עבורך היום?',
      'אם היית מסכמת את היום במשפט אחד, מה הוא היה?'
    ]
  }
};

export const getBotQuestionByContext = ({ mode = 'immediate', emotionId }) => {
  if (mode === 'daily') {
    const pool = BOT_QUESTIONS.daily.default;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const pool = BOT_QUESTIONS.immediate[emotionId] || [
    'מה גרם לך להרגיש כך?',
    'מה קרה היום שהוביל לרגש הזה?'
  ];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getBotQuestionByContextEn = ({ mode = 'immediate', emotionId }) => {
  if (mode === 'daily') {
    const pool = [
      'What was the most meaningful moment in your day?',
      'If you had to summarize your day in one sentence, what would it be?'
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const byEmotion = {
    happy: ['What was the key moment behind this happiness?', 'How can you keep this positive momentum?'],
    sad: ['What felt heaviest right now?', 'What support would help you most at this moment?'],
    stress: ['What is stressing you the most right now?', 'Which part of the load is most urgent?'],
    anger: ['What triggered this anger?', 'What do you want to be understood in this situation?'],
    despair: ['What feels hardest to carry right now?', 'What tiny support step can help now?'],
    excitement: ['What exactly is exciting you most?', 'What first step can channel this energy well?']
  };

  const pool = byEmotion[emotionId] || ['What led to this emotion right now?', 'What happened today that shaped this feeling?'];
  return pool[Math.floor(Math.random() * pool.length)];
};
