// Facts behind the 13 readings that compare the birth sky/numbers with now and the future.
// Language-free: returns indices and keys; texts are looked up in src/content/predictions.ts.

import { dayNum, lon, rev, type Planet } from './sky'
import { yearPower, type NumberPowers } from './numbers'

export const PLANETS: Planet[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus']

/** Same thresholds as the birth-sky overlaps: ≤1° overlapping, ≤5° touching, same sign = same area. */
export type ContactLevel = 'overlap' | 'touch' | 'area'
export interface Contact {
  transit: Planet; natal: Planet; level: ContactLevel; sep: number
  /** Days from today when the contact is closest (0 = today). */
  peakDay: number
}

const angDist = (a: number, b: number) => Math.abs(rev(a - b + 180) - 180)
const levelOf = (sep: number, sameSign: boolean): ContactLevel | null => (sep <= 1 ? 'overlap' : sep <= 5 ? 'touch' : sameSign ? 'area' : null)
const RANK: Record<ContactLevel, number> = { overlap: 0, touch: 1, area: 2 }

/**
 * Transiting planets that come onto the birth planets.
 * today: all planets on one day. month/year: scan day by day and keep each pair's closest approach.
 * Fast movers are left out of long windows (they touch everything every month/year anyway).
 */
export function transits(natal: Record<Planet, number>, startMs: number, days: number, movers: Planet[]): Contact[] {
  const d0 = dayNum(startMs)
  const best = new Map<string, Contact>()
  for (let i = 0; i <= days; i++) {
    for (const t of movers) {
      const L = lon(t, d0 + i)
      for (const n of PLANETS) {
        const sep = angDist(L, natal[n])
        const lvl = levelOf(sep, Math.floor(L / 30) === Math.floor(natal[n] / 30))
        if (!lvl || (days > 0 && lvl === 'area')) continue
        const k = t + '-' + n, prev = best.get(k)
        if (!prev || RANK[lvl] < RANK[prev.level] || (lvl === prev.level && sep < prev.sep)) best.set(k, { transit: t, natal: n, level: lvl, sep: Math.round(sep * 10) / 10, peakDay: i })
      }
    }
  }
  return [...best.values()].sort((a, b) => RANK[a.level] - RANK[b.level] || a.sep - b.sep)
}

/** Western (tropical) sign of a longitude, 0 = Aries. */
export const tropSign = (L: number) => Math.floor(rev(L) / 30)

/** Chinese zodiac relation between two animals (0 = Rat). */
export type AnimalRelation = 'same' | 'harmony' | 'trine' | 'clash' | 'harm' | 'neutral'
export function animalRelation(a: number, b: number): AnimalRelation {
  if (a === b) return 'same'
  if ((a + b) % 12 === 1) return 'harmony'          // 六合: Rat-Ox, Tiger-Pig, Rabbit-Dog, Dragon-Rooster, Snake-Monkey, Horse-Goat
  if (Math.abs(a - b) === 6) return 'clash'          // 六冲
  if ((a - b) % 4 === 0) return 'trine'              // 三合
  if ((a + b) % 12 === 7) return 'harm'              // 六害: Rat-Goat, Ox-Horse, Tiger-Snake, Rabbit-Dragon, Monkey-Pig, Rooster-Dog
  return 'neutral'
}
export const animalOf = (yearCE: number) => (((yearCE - 4) % 12) + 12) % 12

export interface Forecast {
  now: number
  natal: Record<Planet, number>
  /** 2: day power vs this year's power. */
  dayVsYear: { day: number; year: number; yearCE: number; diff: number }
  /** 12: day power vs next year's power. */
  dayVsNext: { day: number; year: number; yearCE: number; diff: number }
  today: Contact[]; month: Contact[]; year: Contact[]
  /** 7–8: tropical birth sign, today's Sun sign, and the distance between them (0–11 signs). */
  sign: { birth: number; current: number; distance: number }
  /** 9–10, 12: animals for birth year, this year and next year (Gregorian year; see caveat). */
  animal: { birth: number; current: number; next: number; relNow: AnimalRelation; relNext: AnimalRelation }
}

export function forecast(birthMs: number, birthYear: number, np: NumberPowers, now = new Date()): Forecast {
  const dB = dayNum(birthMs)
  const natal = Object.fromEntries(PLANETS.map((p) => [p, lon(p, dB)])) as Record<Planet, number>
  const nowMs = now.getTime(), cur = now.getFullYear()
  const nextP = yearPower(cur + 1)
  const birthSign = tropSign(natal.Sun), curSign = tropSign(lon('Sun', dayNum(nowMs)))
  const aB = animalOf(birthYear), aC = animalOf(cur), aN = animalOf(cur + 1)
  return {
    now: nowMs, natal,
    dayVsYear: { day: np.day.value, year: np.curYear.value, yearCE: cur, diff: Math.abs(np.day.value - np.curYear.value) },
    dayVsNext: { day: np.day.value, year: nextP.value, yearCE: cur + 1, diff: Math.abs(np.day.value - nextP.value) },
    today: transits(natal, nowMs, 0, PLANETS),
    month: transits(natal, nowMs, 30, ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus']),
    year: transits(natal, nowMs, 365, ['Mars', 'Jupiter', 'Saturn', 'Uranus']),
    sign: { birth: birthSign, current: curSign, distance: (curSign - birthSign + 12) % 12 },
    animal: { birth: aB, current: aC, next: aN, relNow: animalRelation(aB, aC), relNext: animalRelation(aB, aN) }
  }
}
