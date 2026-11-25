// Automated checks for every formula the owner has set, plus the astronomy they rest on.
// Run: npm test   (Node's built-in test runner through tsx)
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { radiusFor } from '../src/engine/areas'
import { ageOn, animalRelation, moonFifteenths, overall } from '../src/engine/forecast'
import { animalOn, chineseNewYear, lunarEclipseNear } from '../src/engine/lunar'
import { dayPower, yearPower } from '../src/engine/numbers'
import { starValue } from '../src/engine/paper'
import { dayNum, ecl, lon, rev } from '../src/engine/sky'

test('birth number: day + month, two digits → difference (owner, 24 Nov 2026)', () => {
  assert.equal(dayPower(3, 4).value, 7)
  assert.equal(dayPower(11, 3).value, 3) // 14 → 4 − 1
  assert.equal(dayPower(15, 6).value, 1) // 21 → 2 − 1
  assert.equal(dayPower(5, 6).value, 0) // 11 → 0
  assert.equal(dayPower(31, 12).value, 1) // 43 → 4 − 3
})

test('year power: last two CE digits, same rule', () => {
  assert.equal(yearPower(2026).value, 8)
  assert.equal(yearPower(2027).value, 9)
  assert.equal(yearPower(2012).value, 3)
  assert.equal(yearPower(1999).value, 7) // 18 → 8 − 1
  assert.equal(yearPower(2019).value, 1) // 10 → 1 − 0
  assert.equal(yearPower(2000).value, 0)
})

test('overall-fortune number (owner formula)', () => {
  assert.equal(overall(36, 66).value, 3) // 24 ÷ 10 = 2.4 → 3
  assert.equal(overall(36, 100).value, 8) // 24 ÷ 3
  assert.equal(overall(36, 0).value, 6) // 24, no division → 2 + 4
  assert.equal(overall(26, 30).value, 9) // 34 ÷ 4 = 8.5 → 9
  assert.equal(overall(85, 73).value, 4) // 25 ÷ 2 = 12.5 → 13 → 4
  assert.equal(overall(60, 40).value, 0)
  assert.equal(Object.is(overall(60, 40).value, -0), false)
})

test('Moon in fifteenths; an eclipse counts as a dark moon', () => {
  assert.equal(moonFifteenths(0), 1)
  assert.equal(moonFifteenths(100), 15)
  assert.equal(moonFifteenths(50), 8)
  assert.equal(moonFifteenths(100, true), 1)
})

test('star value: 10° steps, below the horizon counts the same way down', () => {
  assert.equal(starValue(0), 1)
  assert.equal(starValue(9.9), 1)
  assert.equal(starValue(10), 2)
  assert.equal(starValue(85), 9)
  assert.equal(starValue(90), 9)
  assert.equal(starValue(-52.7), 6)
  assert.equal(starValue(-90), 9)
})

test('constellation area radius by star brightness, never below the minimum', () => {
  assert.deepEqual([0, 1, 1.5, 2, 2.5, 3, 4, 6].map(radiusFor), [8, 8, 6, 6, 4, 4, 3, 3])
})

test('age on a date', () => {
  assert.equal(ageOn(1990, 6, 15, new Date(2026, 10, 24)), 36)
  assert.equal(ageOn(1990, 11, 30, new Date(2026, 10, 24)), 35)
})

test('Chinese zodiac relations', () => {
  assert.equal(animalRelation(6, 6), 'same')
  assert.equal(animalRelation(0, 1), 'harmony') // Rat–Ox
  assert.equal(animalRelation(0, 6), 'clash') // Rat–Horse
  assert.equal(animalRelation(0, 4), 'trine') // Rat–Dragon
  assert.equal(animalRelation(0, 7), 'harm') // Rat–Goat
  assert.equal(animalRelation(0, 2), 'neutral')
})

test('Chinese New Year matches published dates (HKO confirms 1925-01-24)', () => {
  const want: [number, number, number][] = [[1925, 1, 24], [1930, 1, 30], [1985, 2, 20], [1990, 1, 27], [2000, 2, 5], [2015, 2, 19], [2023, 1, 22], [2024, 2, 10], [2025, 1, 29], [2026, 2, 17], [2027, 2, 6], [2030, 2, 3]]
  for (const [y, m, d] of want) assert.deepEqual(chineseNewYear(y), { y, m, d }, String(y))
  assert.equal(animalOn(2015, 2, 18), 6) // Horse until New Year's eve
  assert.equal(animalOn(2015, 2, 19), 7) // Goat from New Year
})

test('lunar eclipses', () => {
  for (const t of ['2025-03-14T06:58Z', '2022-11-08T10:59Z', '2018-07-27T20:22Z', '2025-09-07T18:12Z', '2021-11-19T09:03Z']) assert.equal(lunarEclipseNear(Date.parse(t), 0.5), true, t)
  for (const t of ['2024-03-25T07:13Z', '2023-05-05T17:23Z', '2025-04-13T00:22Z']) assert.equal(lunarEclipseNear(Date.parse(t), 0.5), false, t)
})

/** Moment (UTC ms) when the planet is opposite the Sun, searched day-by-day from `from`. */
function opposition(body: 'Mars' | 'Saturn' | 'Uranus', from: string, days: number): number {
  const f = (d: number) => rev(lon(body, d) - lon('Sun', d) - 180 + 180) - 180
  const start = dayNum(Date.parse(from))
  let a = start, fa = f(a)
  for (let b = start + 0.25; b < start + days; b += 0.25) {
    const fb = f(b)
    if (Math.sign(fa) !== Math.sign(fb) && Math.abs(fb - fa) < 90) {
      let lo = a, hi = b
      const up = fa < 0
      for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if ((f(m) < 0) === up) lo = m; else hi = m }
      return dayNum(0) * -86400000 + ((lo + hi) / 2) * 86400000
    }
    a = b; fa = fb
  }
  throw new Error('no opposition found')
}
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10)

test('planet positions match published oppositions and the 2020 great conjunction', () => {
  assert.equal(isoDay(opposition('Mars', '2018-07-01', 60)), '2018-07-27')
  assert.equal(isoDay(opposition('Mars', '2020-09-20', 60)), '2020-10-13')
  assert.equal(isoDay(opposition('Mars', '2022-11-20', 60)), '2022-12-08')
  assert.equal(isoDay(opposition('Mars', '2025-01-01', 40)), '2025-01-16')
  assert.equal(isoDay(opposition('Uranus', '2025-11-01', 60)), '2025-11-21')
  assert.equal(isoDay(opposition('Saturn', '2026-09-15', 60)), '2026-10-04')
  let best = 9
  for (let d = dayNum(Date.parse('2020-12-20')); d < dayNum(Date.parse('2020-12-23')); d += 0.02) {
    const [a1, b1] = ecl('Jupiter', d), [a2, b2] = ecl('Saturn', d)
    best = Math.min(best, Math.hypot(rev(a1 - a2 + 180) - 180, b1 - b2))
  }
  assert.ok(best * 60 < 8, `closest ${best * 60}′`)
})
