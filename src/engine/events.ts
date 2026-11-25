// Notable sky moments across a lifetime, for the time-travel dial.
// Language-free: returns dates and keys; texts live in src/components/travel.ts.
//
// Kinds (all computed in the browser from ./sky, no network):
//  birth          the night of birth (day 0)
//  jupiterReturn  Jupiter back on its birth longitude (about every 12 years)
//  saturnReturn   Saturn back on its birth longitude (about every 29.5 years)
//  contact        Saturn or Uranus exactly on a birth Sun, Moon, Mercury, Venus or Mars
//  lunarEclipse   the Moon enters the Earth's shadow while above the horizon at the birthplace
//  age60          |60 − age| = 0 in the owner's overall-fortune formula
// A slow planet can cross the same point up to three times in a year (retrograde loops); only the first
// crossing in each 300-day window is kept, so the dial stays readable.

import { lunarEclipseNear } from './lunar'
import { RAD, dayNum, ecl, lon, rev, type Planet } from './sky'
import { altaz, gmst } from './skymap'

export type EventKind = 'birth' | 'jupiterReturn' | 'saturnReturn' | 'contact' | 'lunarEclipse' | 'age60'

export interface SkyEvent {
  /** Days after the birth date (calendar days, birthplace calendar). */
  day: number
  kind: EventKind
  transit?: Planet
  natal?: Planet
  /** Which return this is (1 = first). */
  n?: number
}

const DAY_MS = 86400000
const signed = (x: number) => rev(x + 180) - 180

/** Calendar-day index of a UTC moment, counted from the birth date, using the birthplace offset then. */
function dayIndex(ms: number, birthUtcDate: number, offsetMinAt: (ms: number) => number): number {
  const local = ms + offsetMinAt(ms) * 60000
  const t = new Date(local)
  return Math.round((Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) - birthUtcDate) / DAY_MS)
}

/** Daily longitudes of a planet from day d0 (index i = day d0 + i). */
function series(p: Planet, d0: number, days: number): Float64Array {
  const s = new Float64Array(days + 1)
  for (let i = 0; i <= days; i++) s[i] = lon(p, d0 + i)
  return s
}

/** First crossings of a moving planet over a fixed longitude, one per window (day numbers). */
function crossings(s: Float64Array, d0: number, target: number, from: number, window: number): number[] {
  const out: number[] = []
  let prev = signed(s[from] - target), last = -Infinity
  for (let i = from + 1; i < s.length; i++) {
    const cur = signed(s[i] - target)
    if (Math.abs(cur) < 10 && Math.sign(cur) !== Math.sign(prev)) {
      if (i - last > window) { out.push(d0 + i); last = i }
    }
    prev = cur
  }
  return out
}

/** Full moons after day d0, for `days` days (day numbers, ~0.01 day precision). */
function fullMoons(d0: number, days: number): number[] {
  const el = (d: number) => signed(lon('Moon', d) - lon('Sun', d) - 180)
  const out: number[] = []
  let a = d0, fa = el(a)
  for (let b = d0 + 1; b <= d0 + days; b += 1) {
    const fb = el(b)
    if (fa < 0 && fb >= 0 && fb - fa < 90) {
      let lo = a, hi = b
      for (let k = 0; k < 20; k++) { const m = (lo + hi) / 2; if (el(m) < 0) lo = m; else hi = m }
      out.push((lo + hi) / 2)
      b += 26                      // the next full moon is at least 29 days away
      fa = el(b); a = b; continue
    }
    a = b; fa = fb
  }
  return out
}

/** Moon altitude (degrees) at a moment, seen from lat/lon. */
function moonAltitude(d: number, lat: number, lonDeg: number): number {
  const [l, b] = ecl('Moon', d)
  const e = (23.4393 - 3.563e-7 * d) * RAD, lr = l * RAD, br = b * RAD
  const x = Math.cos(lr) * Math.cos(br), y = Math.sin(lr) * Math.cos(br), z = Math.sin(br)
  const ye = y * Math.cos(e) - z * Math.sin(e), ze = y * Math.sin(e) + z * Math.cos(e)
  const ra = rev(Math.atan2(ye, x) / RAD), dec = Math.atan2(ze, Math.hypot(x, ye)) / RAD
  const jd = d + 2451543.5
  return altaz(ra, dec, rev(gmst(jd) + lonDeg), lat)[0]
}

export interface LifeInput {
  birth: { y: number; m: number; d: number }
  birthMs: number
  natal: Record<Planet, number>
  lat: number; lon: number
  offsetMinAt: (ms: number) => number
  years: number
}

export function lifeEvents(inp: LifeInput): SkyEvent[] {
  const { birth, birthMs, natal, years } = inp
  const birthUtcDate = Date.UTC(birth.y, birth.m - 1, birth.d)
  const d0 = dayNum(birthMs), days = Math.round(years * 365.25)
  const msOf = (d: number) => birthMs + (d - d0) * DAY_MS
  const idx = (d: number) => dayIndex(msOf(d), birthUtcDate, inp.offsetMinAt)
  const ev: SkyEvent[] = [{ day: 0, kind: 'birth' }]

  const jup = series('Jupiter', d0, days), sat = series('Saturn', d0, days), ura = series('Uranus', d0, days)
  crossings(jup, d0, natal.Jupiter, 300, 3000).forEach((d, i) => ev.push({ day: idx(d), kind: 'jupiterReturn', transit: 'Jupiter', natal: 'Jupiter', n: i + 1 }))
  crossings(sat, d0, natal.Saturn, 3000, 6000).forEach((d, i) => ev.push({ day: idx(d), kind: 'saturnReturn', transit: 'Saturn', natal: 'Saturn', n: i + 1 }))
  for (const [t, s] of [['Saturn', sat], ['Uranus', ura]] as [Planet, Float64Array][]) {
    for (const n of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'] as Planet[]) {
      crossings(s, d0, natal[n], 30, 300).forEach((d) => ev.push({ day: idx(d), kind: 'contact', transit: t, natal: n }))
    }
  }
  for (const fm of fullMoons(d0 + 1, days)) {
    if (Math.abs(ecl('Moon', fm)[1]) < 1.6 && lunarEclipseNear(msOf(fm), 3) && moonAltitude(fm, inp.lat, inp.lon) > 0) ev.push({ day: idx(fm), kind: 'lunarEclipse' })
  }
  const sixty = Math.round((Date.UTC(birth.y + 60, birth.m - 1, birth.d) - birthUtcDate) / DAY_MS)
  if (sixty <= days) ev.push({ day: sixty, kind: 'age60' })

  return ev.filter((e) => e.day >= 0 && e.day <= days).sort((a, b) => a.day - b.day)
}
