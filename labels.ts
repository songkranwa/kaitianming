// Astronomical and astrological vocabulary used by the engine.

import type { Body } from '../engine/sky'
import type { Lang } from './types'

export type OverlapLevel = 'overlap' | 'touch' | 'area'

export interface Labels {
  signs: string[]
  bodies: Record<Body, string>
  nums: Record<Body, string>
  dirs: string[]
  days: string[]
  animals: string[]
  states: string[]
  levels: Record<OverlapLevel, string>
  direct: string
  retro: string
  nodeRetro: string
  none: string
  waxing: string
  waning: string
  newMoon: string
  fullMoon: string
  lunarDay: (t: number) => string
  signChange: (b: string, a: string, z: string) => string
  thaiDayNote: (rise: string, prev: string) => string
  noCoords: string
  hours: string
  minutes: string
  above: string
  below: string
}

const en: Labels = {
  signs: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  bodies: { Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury', Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu (lunar node)', Uranus: 'Uranus' },
  nums: { Sun: '1', Moon: '2', Mars: '3', Mercury: '4', Jupiter: '5', Venus: '6', Saturn: '7', Rahu: '8', Uranus: '0' },
  dirs: ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  animals: ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'],
  states: ['Bright', 'Slightly dark', 'Dark', 'Very dark'],
  levels: { overlap: 'Overlapping', touch: 'Touching', area: 'Same area' },
  direct: 'Direct', retro: 'Retrograde', nodeRetro: 'Retrograde (always)', none: '—',
  waxing: 'Waxing', waning: 'Waning', newMoon: 'New moon', fullMoon: 'Full moon',
  lunarDay: (t) => (t <= 15 ? 'Waxing day ' + t : 'Waning day ' + (t - 15)),
  signChange: (b, a, z) => b + ' moves from ' + a + ' to ' + z + ' during that day; a birth time is needed to be certain (positions shown for 00:00).',
  thaiDayNote: (rise, prev) => 'In Thai astrology a new day starts at sunrise. Born before ' + rise + ', the day counts as ' + prev + '.',
  noCoords: 'Coordinates unknown, so sunrise cannot be computed.',
  hours: 'h', minutes: 'min', above: '', below: ' (below horizon)'
}

const th: Labels = {
  signs: ['เมษ', 'พฤษภ', 'เมถุน', 'กรกฎ', 'สิงห์', 'กันย์', 'ตุลย์', 'พิจิก', 'ธนู', 'มังกร', 'กุมภ์', 'มีน'],
  bodies: { Sun: 'อาทิตย์', Moon: 'จันทร์', Mars: 'อังคาร', Mercury: 'พุธ', Jupiter: 'พฤหัสบดี', Venus: 'ศุกร์', Saturn: 'เสาร์', Rahu: 'ราหู', Uranus: 'มฤตยู' },
  nums: { Sun: '๑', Moon: '๒', Mars: '๓', Mercury: '๔', Jupiter: '๕', Venus: '๖', Saturn: '๗', Rahu: '๘', Uranus: '๐' },
  dirs: ['เหนือ', 'ตะวันออกเฉียงเหนือ', 'ตะวันออก', 'ตะวันออกเฉียงใต้', 'ใต้', 'ตะวันตกเฉียงใต้', 'ตะวันตก', 'ตะวันตกเฉียงเหนือ'],
  days: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
  animals: ['ชวด', 'ฉลู', 'ขาล', 'เถาะ', 'มะโรง', 'มะเส็ง', 'มะเมีย', 'มะแม', 'วอก', 'ระกา', 'จอ', 'กุน'],
  states: ['สว่าง', 'มืดเล็กน้อย', 'มืด', 'มืดมาก'],
  levels: { overlap: 'ซ้อน', touch: 'เริ่มทับ', area: 'ร่วมพื้นที่' },
  direct: 'เดินหน้า', retro: 'พักร์ (ถอยหลัง)', nodeRetro: 'ถอยหลัง (ปกติ)', none: '—',
  waxing: 'ข้างขึ้น', waning: 'ข้างแรม', newMoon: 'เดือนดับ', fullMoon: 'เดือนเพ็ญ',
  lunarDay: (t) => (t <= 15 ? 'ขึ้น ' + t + ' ค่ำ' : 'แรม ' + (t - 15) + ' ค่ำ'),
  signChange: (b, a, z) => 'ดาว' + b + 'ย้ายจากราศี' + a + 'ไปราศี' + z + 'ในวันนั้น ต้องรู้เวลาเกิดจึงจะระบุได้แน่ชัด (ตารางแสดงตำแหน่ง ณ 00:00 น.)',
  thaiDayNote: (rise, prev) => 'โหราศาสตร์ไทยนับวันใหม่เมื่ออาทิตย์ขึ้น ถ้าเกิดก่อน ' + rise + ' จะนับเป็นวัน' + prev,
  noCoords: 'ไม่ทราบพิกัด จึงคำนวณเวลาอาทิตย์ขึ้นไม่ได้',
  hours: 'ชม.', minutes: 'นาที', above: '', below: ' (ใต้ขอบฟ้า)'
}

export const labels = (lang: Lang): Labels => (lang === 'th' ? th : en)
