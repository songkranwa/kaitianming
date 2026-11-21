// Day power and year power — the site owner's own rules:
//   day power  = day of month + month number
//   year power = sum of the last two digits of the CE year
//   any result above 9 is reduced again (digit sum) until one digit remains.
// Life number: Pythagorean numerology (digit sum of day, month and CE year).

import type { Lang } from '../i18n/types'

export interface Reduced { value: number; working: string }
export interface YearPower extends Reduced { year: number }

export function reduce(x: number, expr: string): Reduced {
  let text = expr + ' = ' + x
  while (x > 9) {
    const ds = String(x).split('')
    const t = ds.reduce((s, c) => s + Number(c), 0)
    text += ' → ' + ds.join(' + ') + ' = ' + t
    x = t
  }
  return { value: x, working: text }
}

export function yearPower(y: number): YearPower {
  const a = Math.floor((y % 100) / 10), b = y % 10
  return { ...reduce(a + b, a + ' + ' + b), year: y }
}

export function lifeNumber(day: number, month: number, yearCE: number): number {
  let life = (String(day) + String(month) + String(yearCE)).split('').reduce((s, c) => s + Number(c), 0)
  while (life > 9) life = String(life).split('').reduce((s, c) => s + Number(c), 0)
  return life
}

export interface NumberPowers {
  day: Reduced; birthYear: YearPower; curYear: YearPower; nextYear: YearPower; life: number
  rows: { label: string; value: string; working: string }[]
  compare: { label: string; value: string; rel: string }[]
  json: Record<string, unknown>
}

export function numberPowers(day: number, month: number, yearCE: number, now: Date, lang: Lang): NumberPowers {
  const th = lang === 'th'
  const dayP = reduce(day + month, day + ' + ' + month)
  const curCE = now.getFullYear()
  const birthY = yearPower(yearCE), curY = yearPower(curCE), nextY = yearPower(curCE + 1)
  const rel = (a: number, b: number) => (a === b ? (th ? 'ตรงกัน' : 'Same') : (th ? 'ต่างกัน ' : 'Differ by ') + Math.abs(a - b))
  const cmp = (label: string, a: number, b: number) => ({ label, value: a + (th ? ' กับ ' : ' vs ') + b, rel: rel(a, b) })
  const life = lifeNumber(day, month, yearCE)
  return {
    day: dayP, birthYear: birthY, curYear: curY, nextYear: nextY, life,
    rows: [
      { label: th ? 'กำลังวัน (วันที่ + เดือน)' : 'Day power (day + month)', value: String(dayP.value), working: dayP.working },
      { label: (th ? 'กำลังปีเกิด (ค.ศ. ' : 'Birth-year power (') + yearCE + ')', value: String(birthY.value), working: birthY.working },
      { label: (th ? 'กำลังปีปัจจุบัน (ค.ศ. ' : 'Current-year power (') + curCE + ')', value: String(curY.value), working: curY.working },
      { label: (th ? 'กำลังปีหน้า (ค.ศ. ' : 'Next-year power (') + (curCE + 1) + ')', value: String(nextY.value), working: nextY.working }
    ],
    compare: [
      cmp(th ? 'กำลังปีเกิด เทียบ ปีปัจจุบัน' : 'Birth year vs current year', birthY.value, curY.value),
      cmp(th ? 'กำลังวัน เทียบ ปีปัจจุบัน' : 'Day power vs current year', dayP.value, curY.value),
      cmp(th ? 'กำลังปีเกิด เทียบ ปีหน้า' : 'Birth year vs next year', birthY.value, nextY.value),
      cmp(th ? 'กำลังวัน เทียบ ปีหน้า' : 'Day power vs next year', dayP.value, nextY.value)
    ],
    json: {
      day_power: { value: dayP.value, working: dayP.working },
      birth_year_power: { year_ce: yearCE, value: birthY.value, working: birthY.working },
      current_year_power: { year_ce: curCE, value: curY.value, working: curY.working },
      next_year_power: { year_ce: curCE + 1, value: nextY.value, working: nextY.working },
      life_number: life,
      calendar_used: 'CE',
      rule: 'day power = day + month; year power = sum of the last two digits of the CE year; reduce repeatedly to one digit'
    }
  }
}
