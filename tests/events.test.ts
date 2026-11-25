// Checks for the time-travel dial's key sky moments (src/engine/events.ts).
// Run: npm test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lifeEvents } from '../src/engine/events'
import { PLANETS } from '../src/engine/forecast'
import { dayNum, lon, type Planet } from '../src/engine/sky'
import { localToUTC, tzOffsetMin } from '../src/engine/time'

const birth = { y: 1990, m: 6, d: 15 }
const { ms } = localToUTC(1990, 6, 15, 0, 0, 'Asia/Bangkok')
const natal = Object.fromEntries(PLANETS.map((p) => [p, lon(p, dayNum(ms))])) as Record<Planet, number>
const events = lifeEvents({ birth, birthMs: ms, natal, lat: 13.75, lon: 100.52, offsetMinAt: (x) => tzOffsetMin(x, 'Asia/Bangkok'), years: 90 })
const dateOf = (day: number) => new Date(Date.UTC(1990, 5, 15) + day * 86400000).toISOString().slice(0, 10)
const has = (kind: string, date: string) => events.some((e) => e.kind === kind && dateOf(e.day) === date)

test('the dial starts at birth and ends at age 90', () => {
  assert.equal(events[0].kind, 'birth')
  assert.equal(events[0].day, 0)
  assert.ok(events.every((e) => e.day >= 0 && e.day <= Math.round(90 * 365.25)))
})

test('lunar eclipses seen from Bangkok (3 Mar 2026 total, 31 Dec 2028 total)', () => {
  assert.ok(has('lunarEclipse', '2026-03-03'))
  assert.ok(has('lunarEclipse', '2028-12-31'))
})

test('Jupiter and Saturn returns for 15 Jun 1990', () => {
  assert.ok(events.some((e) => e.kind === 'jupiterReturn' && e.n === 1 && dateOf(e.day).startsWith('2002-05')))
  assert.ok(events.some((e) => e.kind === 'saturnReturn' && e.n === 1 && dateOf(e.day).startsWith('2020-01')))
})

test('age 60 lands on the 60th birthday', () => {
  assert.ok(has('age60', '2050-06-15'))
})
