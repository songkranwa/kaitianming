export type Lang = 'en' | 'th'

export const LANGS: { v: Lang; label: string; short: string }[] = [
  { v: 'en', label: 'English', short: 'EN' },
  { v: 'th', label: 'ไทย', short: 'ไทย' }
]

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem('ktm.lang')
    if (saved === 'en' || saved === 'th') return saved
  } catch { /* storage unavailable */ }
  try {
    if (String(navigator.language || '').toLowerCase().startsWith('th')) return 'th'
  } catch { /* no navigator */ }
  return 'en'
}
