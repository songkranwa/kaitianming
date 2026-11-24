// Every prediction text the site can show, grouped by the 13 readings. Used by the admin page.
// Keys must match the lookups in src/components/deck.ts.

import { isMain } from '../engine/areas'
import type { Planet } from '../engine/sky'

export interface Slot { key: string; label: string }
export interface SlotGroup { id: string; title: string; note: string; slots: Slot[] }

const SIGNS = ['เมษ (Aries)', 'พฤษภ (Taurus)', 'เมถุน (Gemini)', 'กรกฎ (Cancer)', 'สิงห์ (Leo)', 'กันย์ (Virgo)', 'ตุลย์ (Libra)', 'พิจิก (Scorpio)', 'ธนู (Sagittarius)', 'มังกร (Capricorn)', 'กุมภ์ (Aquarius)', 'มีน (Pisces)']
const ANIMALS = ['ชวด (Rat)', 'ฉลู (Ox)', 'ขาล (Tiger)', 'เถาะ (Rabbit)', 'มะโรง (Dragon)', 'มะเส็ง (Snake)', 'มะเมีย (Horse)', 'มะแม (Goat)', 'วอก (Monkey)', 'ระกา (Rooster)', 'จอ (Dog)', 'กุน (Pig)']
const PLANET_TH: Record<Planet, string> = { Sun: 'อาทิตย์', Moon: 'จันทร์', Mercury: 'พุธ', Venus: 'ศุกร์', Mars: 'อังคาร', Jupiter: 'พฤหัสบดี', Saturn: 'เสาร์', Uranus: 'มฤตยู' }
const PLANETS = Object.keys(PLANET_TH) as Planet[]
const range = (n: number, from = 0) => Array.from({ length: n }, (_, i) => i + from)
const BRIGHT = ['สว่าง', 'มืดเล็กน้อย', 'มืด', 'มืดมาก']
const REL: [string, string][] = [['same', 'ปีชง (ปีนักษัตรเดียวกับปีเกิด)'], ['harmony', 'ปีที่เข้ากัน (หลักคู่มิตร)'], ['trine', 'ปีที่หนุนกัน (สามประสาน)'], ['clash', 'ปีที่ปะทะ (คู่ตรงข้าม)'], ['harm', 'ปีที่ขัดกัน (คู่ทำร้าย)'], ['neutral', 'ปีที่เป็นกลาง']]

/** cons: IAU id → Thai name, from the sky catalog (88 constellations). */
export function slotGroups(cons: Record<string, string>): SlotGroup[] {
  return [
    { id: '1', title: '1. ลักษณะเจ้าของวันเกิด (เลขประจำวันเกิด)', note: 'เลขประจำวันเกิด = วันที่ + เดือน ถ้าได้สองหลัก ให้เอาผลต่างของสองหลัก (ได้ 0–9)',
      slots: range(10).map((n) => ({ key: `day.${n}`, label: `เลข ${n}` })) },
    { id: '2', title: '2. ดวงจากเลขวันเกิดเทียบกับปีปัจจุบัน (ใช้กับปีหน้าในหัวข้อ 12 ด้วย)', note: 'ถ้ามีข้อความของคู่เลขนั้นจะใช้ก่อน ถ้าไม่มีจะใช้ข้อความตามผลต่าง',
      slots: [...range(10).map((n) => ({ key: `dayYear.diff.${n}`, label: n === 0 ? 'ผลต่าง 0 (เลขตรงกัน)' : `ผลต่าง ${n}` })),
        ...range(10).flatMap((a) => range(10).map((b) => ({ key: `dayYear.${a}-${b}`, label: `เลขวันเกิด ${a} · กำลังปี ${b}` })))] },
    { id: '3', title: '3. ดวงดาวบนฟากฟ้าตอนเกิด', note: 'แสดงข้อความกลุ่มดาวเหนือศีรษะ (เฉพาะ 25 กลุ่มดาวหลัก) ต่อด้วยข้อความสว่าง/มืดของราศีเกิด',
      slots: [...BRIGHT.map((b, i) => ({ key: `sky.bright.${i}`, label: `ราศีเกิด: ${b}` })),
        ...Object.entries(cons).filter(([id]) => isMain(id)).sort((a, b) => a[1].localeCompare(b[1], 'th')).map(([id, name]) => ({ key: `sky.zenith.${id}`, label: `กลุ่มดาวเหนือศีรษะ: ${name} (${id})` }))] },
    { id: '4-6', title: '4–6. ผลของดวงดาวจร (วันนี้ · 1 เดือน · 1 ปี)', note: 'ดาวจรมาทับดาวกำเนิด ใช้ข้อความของคู่ดาวก่อน ถ้าไม่มีใช้ข้อความของดาวจรดวงนั้น',
      slots: [{ key: 'transit.none', label: 'ช่วงที่ไม่มีดาวจรมาทับ' },
        ...PLANETS.map((t) => ({ key: `transit.${t}`, label: `${PLANET_TH[t]}จร (ทั่วไป)` })),
        ...PLANETS.flatMap((t) => PLANETS.map((n) => ({ key: `transit.${t}-${n}`, label: `${PLANET_TH[t]}จร ทับ ${PLANET_TH[n]}กำเนิด` })))] },
    { id: '7', title: '7. ลักษณะตามราศีเกิด (แบบสากล)', note: '',
      slots: SIGNS.map((s, i) => ({ key: `sign.${i}`, label: `ราศี${s}` })) },
    { id: '8', title: '8. ผลของจักรราศีในปัจจุบัน', note: 'ราศีที่ดวงอาทิตย์อยู่ตอนนี้เทียบราศีเกิด ใช้ข้อความของคู่ราศีก่อน ถ้าไม่มีใช้ตามระยะห่าง',
      slots: [...range(12).map((n) => ({ key: `signNow.dist.${n}`, label: n === 0 ? 'ห่าง 0 ราศี (ราศีเดียวกัน)' : `ห่าง ${n} ราศี` })),
        ...range(12).flatMap((a) => range(12).map((b) => ({ key: `signNow.${a}-${b}`, label: `เกิดราศี${SIGNS[a]} · ตอนนี้ราศี${SIGNS[b]}` })))] },
    { id: '9', title: '9. ปีนักษัตรที่เกิด', note: '',
      slots: ANIMALS.map((a, i) => ({ key: `animal.${i}`, label: `ปี${a}` })) },
    { id: '10', title: '10. ผลของปีนักษัตรปัจจุบัน (ใช้กับปีหน้าในหัวข้อ 12 ด้วย)', note: 'ใช้ข้อความของคู่ปีก่อน ถ้าไม่มีใช้ตามความสัมพันธ์',
      slots: [...REL.map(([k, l]) => ({ key: `animalNow.${k}`, label: l })),
        ...range(12).flatMap((a) => range(12).map((b) => ({ key: `animalNow.${a}-${b}`, label: `เกิดปี${ANIMALS[a]} · ปีนี้ปี${ANIMALS[b]}` })))] },
    { id: '11-12', title: '11–12. ดวงชะตารวม (ช่วงนี้ · ปีหน้า)', note: 'เลขดวงชะตารวม 0–9 จาก |60 − อายุ| หารตามส่วนต่างของดวงจันทร์คืนเกิดจาก 9 ใช้ข้อความเฉพาะ "ช่วงนี้" หรือ "ปีหน้า" ก่อน ถ้าไม่มีใช้ข้อความร่วม',
      slots: [...range(10).map((n) => ({ key: `overall.${n}`, label: `เลข ${n} (ใช้ทั้งช่วงนี้และปีหน้า)` })),
        ...range(10).map((n) => ({ key: `overall.now.${n}`, label: `เลข ${n} · เฉพาะช่วงนี้` })),
        ...range(10).map((n) => ({ key: `overall.next.${n}`, label: `เลข ${n} · เฉพาะปีหน้า` }))] },
    { id: '13', title: '13. ความหมายเลขเฉพาะตัว', note: 'จะกำหนดวิธีคิดเลขภายหลัง', slots: [{ key: 'personal', label: 'เลขเฉพาะตัว' }] }
  ]
}
