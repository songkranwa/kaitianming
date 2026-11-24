// Chinese New Year and lunar eclipses, from the Sun and Moon positions in ./sky.
//
// Chinese New Year: lunar month 11 is the month whose first day (new moon, Beijing date) is on or before
// the December solstice's Beijing date; New Year's day is two new moons later. Dated in Beijing time
// (UTC+8; before 1929 Beijing local mean time, UTC+7:45:40). Checked against a published table 1920–2030.
// The zodiac animal changes on that day (owner, 24 Nov 2026).

import { dayNum, ecl, lon, moonDistance, rev } from './sky'

const DAY_MS = 86400000
/** Schlyter day number back to UTC ms (dayNum's inverse). */
const msOf = (d: number) => dayNum(0) * -DAY_MS + d * DAY_MS

/** Signed elongation of the Moon from the Sun, −180…180°. */
const elong = (d: number) => rev(lon('Moon', d) - lon('Sun', d) + 180) - 180

/** Day number of the first new moon after day d0. */
function nextNewMoon(d0: number): number {
  let a = d0, fa = elong(a)
  for (let b = d0 + 0.5; b < d0 + 40; b += 0.5) {
    const fb = elong(b)
    if (fa < 0 && fb >= 0 && fb - fa < 90) {
      let lo = a, hi = b
      for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (elong(m) < 0) lo = m; else hi = m }
      return (lo + hi) / 2
    }
    a = b; fa = fb
  }
  throw new Error('new moon not found')
}

/** Day number of the December solstice (Sun at 270°) of a year. */
function decSolstice(year: number): number {
  let lo = dayNum(Date.UTC(year, 11, 15)), hi = dayNum(Date.UTC(year, 11, 27))
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (rev(lon('Sun', m) - 270 + 180) - 180 < 0) lo = m; else hi = m }
  return (lo + hi) / 2
}

/** Beijing-time calendar date of a moment (local mean time of Beijing before 1929). */
function beijingDate(d: number): { y: number; m: number; d: number } {
  const ms = msOf(d)
  const off = ms < Date.UTC(1929, 0, 1) ? (7 * 3600 + 45 * 60 + 40) * 1000 : 8 * 3600000
  const t = new Date(ms + off)
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }
}

const cnyCache = new Map<number, { y: number; m: number; d: number }>()
/** Chinese New Year's day (Gregorian date) for a Gregorian year. */
export function chineseNewYear(year: number): { y: number; m: number; d: number } {
  const hit = cnyCache.get(year)
  if (hit) return hit
  // Month 11 starts on the last new moon whose Beijing date is on or before the solstice's Beijing date.
  const sol = decSolstice(year - 1)
  const solKey = dateKey(beijingDate(sol))
  let m11 = nextNewMoon(sol - 31)
  for (let n = nextNewMoon(m11 + 1); dateKey(beijingDate(n)) <= solKey; n = nextNewMoon(n + 1)) m11 = n
  const second = nextNewMoon(nextNewMoon(m11 + 1) + 1)
  const out = beijingDate(second)
  cnyCache.set(year, out)
  return out
}
const dateKey = (x: { y: number; m: number; d: number }) => x.y * 10000 + x.m * 100 + x.d

/** Chinese zodiac animal (0 = Rat) for a Gregorian date, changing on Chinese New Year. */
export function animalOn(y: number, m: number, d: number): number {
  const c = chineseNewYear(y)
  const lunarYear = dateKey({ y, m, d }) < dateKey(c) ? y - 1 : y
  return (((lunarYear - 4) % 12) + 12) % 12
}

/**
 * Is the Moon inside the Earth's dark shadow (umbra) at some time within ±hours of this moment?
 * Shadow and Moon sizes follow the Moon's distance; any contact counts. Grazing eclipses (umbral
 * magnitude below ~0.1) can be misjudged by the position accuracy (~0.05°).
 */
export function lunarEclipseNear(ms: number, hours = 6): boolean {
  const d0 = dayNum(ms)
  for (let h = -hours; h <= hours; h += 0.25) {
    const d = d0 + h / 24
    const [ml, mb] = ecl('Moon', d)
    const anti = rev(lon('Sun', d) + 180)
    const dl = rev(ml - anti + 180) - 180
    const par = Math.asin(1 / moonDistance(d)) / (Math.PI / 180)   // Moon's horizontal parallax, degrees
    const umbra = 1.02 * (par + 0.0024 - 0.2666), moonR = 0.2725 * par
    if (Math.hypot(dl, mb) < umbra + moonR) return true
  }
  return false
}
