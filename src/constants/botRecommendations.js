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

export const getGuidedRecommendation = (emotionId, answers = {}, options = {}) => {
  const language = options.language || 'he';
  const mode = options.mode || 'immediate';
  const sleepHours = parseSleepHours(answers.sleepHours);
  const contextText = String(answers.hardThing || answers.mainThing || answers.context || '').trim();

  // Start with the existing keyword-based recommendation to keep behavior familiar.
  const base = getRecommendationByAnswer(emotionId, contextText || ' ', { mode, language });

  if (language === 'en') {
    if (sleepHours !== null && sleepHours <= 5) {
      return {
        type: 'recommendation',
        text:
          `Low sleep can intensify ${emotionId === 'anger' ? 'irritability' : 'stress'}.\n` +
          `Task: tonight, aim for a simple wind-down: 20 minutes without screens + 5 slow breaths + set one small plan for tomorrow.\n\n` +
          `${base.text}`,
        task: '20 minutes no screens + 5 breaths'
      };
    }
    return base;
  }

  if (sleepHours !== null && sleepHours <= 5) {
    return {
      type: 'recommendation',
      text:
        `חוסר שינה יכול להגביר לחץ/עצבנות ולהקשות על ויסות רגשי.\n` +
        `משימה: היום בערב לעשות “נחיתה רכה”: 20 דקות בלי מסכים + 5 נשימות איטיות + לבחור פעולה קטנה אחת למחר.\n\n` +
        `${base.text}`,
      task: '20 דקות בלי מסכים + 5 נשימות'
    };
  }

  return base;
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
