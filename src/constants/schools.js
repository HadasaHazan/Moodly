export const SCHOOLS = [
  { id: 'shuvu-petah-tikva', nameHe: 'שובו פתח תקווה', nameEn: 'Shuvu Petah Tikva' },
  { id: 'alon', nameHe: 'תיכון אלון', nameEn: 'Alon High School' },
  { id: 'raziel', nameHe: 'תיכון רזיאל', nameEn: 'Raziel High School' },
  { id: 'galim', nameHe: 'בית ספר גלים', nameEn: 'Galim School' },
  { id: 'ramot', nameHe: 'תיכון רמות', nameEn: 'Ramot High School' },
  { id: 'negev', nameHe: 'תיכון הנגב', nameEn: 'Negev High School' }
];

export const getSchoolName = (schoolId, language = 'he') => {
  const school = SCHOOLS.find((item) => item.id === schoolId);
  if (!school) return schoolId || '';
  return language === 'en' ? school.nameEn : school.nameHe;
};
