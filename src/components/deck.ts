// Content of the result page as topics of swipeable cards.
// Swipe left/right = more cards in the same topic; scroll down = next topic.
// Lock levels: 'free' (everyone), 'member' (free sign-up), 'premium' (paid). Change a topic's level here.

import type { Result } from '../engine/compute'
import type { Lang } from '../i18n/types'
import { starText } from './format'

export type LockLevel = 'free' | 'member' | 'premium'
/** Who is looking. Accounts are not built yet, so everyone is a guest for now. */
export type Tier = 'guest' | 'member' | 'premium'

export interface DeckCard {
  kicker: string
  value: string
  body?: string
  rows?: { k: string; v: string }[]
  /** Renders the small sky map inside the card. */
  skyMap?: boolean
}
export interface Topic { id: string; title: string; lock: LockLevel; cards: DeckCard[] }

export const canRead = (lock: LockLevel, tier: Tier): boolean =>
  lock === 'free' || (lock === 'member' && tier !== 'guest') || (lock === 'premium' && tier === 'premium')

export function deckText(lang: Lang) {
  const th = lang === 'th'
  return {
    hint: th ? 'ปัดซ้าย–ขวาเพื่ออ่านต่อในหัวข้อเดียวกัน · เลื่อนลงเพื่อไปหัวข้อถัดไป' : 'Swipe left or right for more on a topic · scroll down for the next topic',
    prev: th ? 'บัตรก่อนหน้า' : 'Previous card',
    next: th ? 'บัตรถัดไป' : 'Next card',
    cardOf: (i: number, n: number) => (th ? `บัตร ${i} จาก ${n}` : `Card ${i} of ${n}`),
    topicOf: (i: number, n: number) => (th ? `หัวข้อ ${i}/${n}` : `Topic ${i}/${n}`),
    lockedMember: th ? 'สำหรับสมาชิก' : 'Members only',
    lockedPremium: th ? 'สำหรับสมาชิกพรีเมียม' : 'Premium only',
    lockedBodyMember: (n: number) => (th ? `สมัครสมาชิกฟรีเพื่อปลดล็อกบัตร ${n} ใบในหัวข้อนี้` : `Sign up free to unlock the ${n} cards in this topic.`),
    lockedBodyPremium: (n: number) => (th ? `อัปเกรดเป็นพรีเมียมเพื่อปลดล็อกบัตร ${n} ใบในหัวข้อนี้` : `Upgrade to Premium to unlock the ${n} cards in this topic.`),
    unlockMember: th ? 'สมัครสมาชิกเพื่อปลดล็อก' : 'Sign up to unlock',
    unlockPremium: th ? 'อัปเกรดเพื่อปลดล็อก' : 'Upgrade to unlock',
    loading: th ? 'กำลังโหลดข้อมูลดาว…' : 'Loading star data…'
  }
}

export function buildTopics(res: Result, lang: Lang): Topic[] {
  const th = lang === 'th'
  const { ch, np, pp, L } = res
  const wait: DeckCard = { kicker: '', value: deckText(lang).loading }
  const starRows = (st: NonNullable<typeof pp>['personal']) => [
    { k: th ? 'กลุ่มดาว' : 'Constellation', v: st.constellation_name },
    { k: th ? 'โชติมาตร' : 'Magnitude', v: String(st.mag) },
    { k: th ? 'ห่างจากจุดเหนือศีรษะ' : 'From overhead', v: `${st.distance_from_zenith_deg}° · ${st.bearing}` }
  ]
  const bodyJson = pp ? (pp.json as { bodies: { name: string; constellation_name: string }[] }).bodies : []

  return [
    {
      id: 'star', lock: 'free', title: th ? 'ดาวประจำตัว' : 'Your personal star',
      cards: pp ? [
        { kicker: th ? 'ดาวที่ใกล้จุดเหนือศีรษะที่สุด' : 'Closest to straight overhead', value: starText(pp.personal), rows: starRows(pp.personal),
          body: th ? 'ดาวที่อยู่ตรงเหนือศีรษะมากที่สุด เวลา 00:00 น. ของวันเกิด ณ ที่ที่คุณเกิด' : 'The star nearest the point straight overhead at 00:00 on your birth date, where you were born.' },
        ...(pp.bright ? [{ kicker: th ? 'ดาวสว่างเด่นที่ใกล้ที่สุด' : 'Closest bright star', value: starText(pp.bright), rows: starRows(pp.bright) }] : []),
        { kicker: th ? 'ดาวเด่นในรัศมี 12°' : 'Notable stars within 12°', value: String(pp.nearby.length),
          rows: pp.nearby.map((s) => ({ k: starText(s), v: `${s.distance_from_zenith_deg}°` })) }
      ] : [wait]
    },
    {
      id: 'zenith', lock: 'free', title: th ? 'กลุ่มดาวเหนือศีรษะ' : 'Constellation overhead',
      cards: pp ? [
        { kicker: th ? 'ศูนย์กลางแผ่นฟากฟ้าของคุณ' : 'The centre of your sky map', value: pp.zenName,
          body: th ? 'กลุ่มดาวที่ครอบจุดเหนือศีรษะ ณ ที่และวันที่คุณเกิด' : 'The constellation that held the point straight overhead, where and when you were born.' },
        { kicker: th ? 'แผ่นฟากฟ้า ณ คืนวันเกิด' : 'Your sky on the night of birth', value: '', skyMap: true },
        { kicker: th ? 'กลุ่มดาวรอบด้าน (ห่าง 20°)' : 'Around it (20° away)', value: '',
          rows: pp.surroundings.map((r) => ({ k: r.bearing, v: r.at20Name })) }
      ] : [wait]
    },
    {
      id: 'numbers', lock: 'free', title: th ? 'กำลังวันและกำลังปี' : 'Day and year power',
      cards: [
        { kicker: th ? 'กำลังวัน (วันที่ + เดือน)' : 'Day power (day + month)', value: String(np.day.value), body: np.day.working },
        { kicker: th ? `กำลังปีเกิด (ค.ศ. ${np.birthYear.year})` : `Birth-year power (${np.birthYear.year})`, value: String(np.birthYear.value), body: np.birthYear.working },
        { kicker: th ? 'เทียบกับปีนี้และปีหน้า' : 'Compared with this year and next', value: `${np.curYear.value} · ${np.nextYear.value}`,
          rows: np.compare.map((c) => ({ k: c.label, v: `${c.value} · ${c.rel}` })) }
      ]
    },
    {
      id: 'sunmoon', lock: 'free', title: th ? 'อาทิตย์ จันทร์ และวันเกิด' : 'Sun, Moon and weekday',
      cards: [
        { kicker: th ? 'อาทิตย์สถิตราศี (ไทย)' : 'Sun sign (Thai sidereal)', value: ch.sunSign,
          rows: [{ k: th ? 'อาทิตย์ขึ้น' : 'Sunrise', v: ch.rise }, { k: th ? 'อาทิตย์ตก' : 'Sunset', v: ch.set }, { k: th ? 'กลางวันยาว' : 'Day length', v: ch.dayLen }] },
        { kicker: th ? 'จันทร์สถิตราศี (ไทย)' : 'Moon sign (Thai sidereal)', value: ch.moonSign,
          rows: [{ k: th ? 'ดิถี' : 'Lunar day', v: ch.lunar }, { k: th ? 'ช่วง' : 'Phase', v: ch.phase }, { k: th ? 'ส่วนที่สว่าง' : 'Illuminated', v: `${ch.illum}%` }] },
        { kicker: th ? 'วันเกิดและปีเกิด' : 'Weekday and year', value: L.days[ch.dowI],
          rows: [{ k: th ? 'ปีนักษัตร' : 'Chinese zodiac', v: res.animal }, { k: th ? 'เลขชีวิต' : 'Life number', v: String(np.life) }] }
      ]
    },
    {
      id: 'bright', lock: 'member', title: th ? 'สว่างหรือมืด' : 'Bright or dark',
      cards: pp ? [
        { kicker: th ? `ราศีเกิด: ${pp.brightness.birth_sign.sign}` : `Birth sign: ${pp.brightness.birth_sign.sign}`, value: pp.brightness.birth_sign.state,
          body: pp.brightness.birth_sign.blockers.length ? (th ? 'ดาวที่บัง: ' : 'Blocked by: ') + pp.brightness.birth_sign.blockers.join(', ') : (th ? 'ไม่มีดาวใหญ่บัง' : 'Nothing blocks it') },
        { kicker: th ? `กลุ่มดาวเหนือศีรษะ: ${pp.brightness.zenith_constellation.constellation}` : `Overhead: ${pp.brightness.zenith_constellation.constellation}`, value: pp.brightness.zenith_constellation.state,
          body: pp.brightness.zenith_constellation.blockers.length ? (th ? 'ดาวที่บัง: ' : 'Blocked by: ') + pp.brightness.zenith_constellation.blockers.join(', ') : (th ? 'ไม่มีดาวใหญ่บัง' : 'Nothing blocks it') }
      ] : [wait]
    },
    {
      id: 'planets', lock: 'member', title: th ? 'ดาวใหญ่และการทับซ้อน' : 'Planets and overlaps',
      cards: pp ? [
        { kicker: th ? 'ดาวใหญ่อยู่ในกลุ่มดาวใด' : 'Where each planet sits', value: '',
          rows: bodyJson.map((b) => ({ k: b.name, v: b.constellation_name })) },
        { kicker: th ? 'การทับซ้อน' : 'Overlaps', value: pp.overlaps.length ? String(pp.overlaps.length) : (th ? 'ไม่มี' : 'None'),
          rows: pp.overlaps.map((o) => ({ k: `${o.a} – ${o.b}`, v: `${o.level_name} · ${o.separation_deg}°` })) }
      ] : [wait]
    },
    {
      id: 'year', lock: 'premium', title: th ? `ปีนี้และปีหน้าของคุณ` : 'Your year ahead',
      cards: [
        { kicker: th ? `ปี ค.ศ. ${np.curYear.year}` : `${np.curYear.year}`, value: String(np.curYear.value), body: th ? 'คำทำนายรายปีจะเพิ่มในขั้นถัดไป' : 'The yearly reading arrives in the next phase.' },
        { kicker: th ? `ปี ค.ศ. ${np.nextYear.year}` : `${np.nextYear.year}`, value: String(np.nextYear.value), body: th ? 'คำทำนายรายปีจะเพิ่มในขั้นถัดไป' : 'The yearly reading arrives in the next phase.' }
      ]
    },
    {
      id: 'reading', lock: 'premium', title: th ? 'คำทำนายฉบับเต็ม' : 'Your full reading',
      cards: [
        { kicker: th ? 'คำทำนายเฉพาะตัว' : 'Personal reading', value: '', body: th ? 'คำทำนายที่สร้างจากดาวและตัวเลขของคุณจะเพิ่มในขั้นถัดไป' : 'A reading built from your stars and numbers arrives in the next phase.' }
      ]
    }
  ]
}
