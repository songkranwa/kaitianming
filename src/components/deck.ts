// The 13 readings on the result page, as topics of swipeable cards.
// Swipe left/right = more cards in the same topic; scroll down = next topic.
// Card 1 of each topic is the reading (text from src/content/predictions.ts); the rest show the facts behind it.
// Lock levels: 'free' (everyone), 'member' (free sign-up), 'premium' (paid). Change a topic's level here.

import { lookup, type Texts } from '../content/predictions'
import type { Result } from '../engine/compute'
import type { AnimalRelation, Contact, Overall } from '../engine/forecast'
import type { Lang } from '../i18n/types'
import { starText } from './format'
import { starValue } from '../engine/paper'

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
  /** The reading text has not been written yet. */
  pending?: boolean
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
    loading: th ? 'กำลังโหลดข้อมูลดาว…' : 'Loading star data…',
    pending: th ? 'ข้อความคำทำนายของหัวข้อนี้กำลังจัดทำ' : 'The reading for this topic is being written.'
  }
}

const SIGN_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
const SIGN_TH = ['เมษ', 'พฤษภ', 'เมถุน', 'กรกฎ', 'สิงห์', 'กันย์', 'ตุลย์', 'พิจิก', 'ธนู', 'มังกร', 'กุมภ์', 'มีน']

export function buildTopics(res: Result, lang: Lang, texts: Texts): Topic[] {
  const th = lang === 'th'
  const d = deckText(lang)
  const { ch, np, pp, L, fc } = res
  const wait: DeckCard = { kicker: '', value: d.loading }
  const sign = (i: number) => (th ? 'ราศี' + SIGN_TH[i] : SIGN_EN[i])
  const animal = (i: number) => L.animals[i]
  const body = (p: string) => L.bodies[p as keyof typeof L.bodies]
  const when = (days: number) => new Date(fc.now + days * 86400000).toLocaleDateString(th ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  /** Card 1 of a topic: the reading itself. */
  const reading = (value: string, keys: string[], kicker = th ? 'คำทำนาย' : 'Reading'): DeckCard => {
    const text = lookup(texts, keys, lang)
    return { kicker, value, body: text ?? d.pending, pending: !text }
  }
  /** Like reading(), but shows every key that has text, one paragraph each. */
  const readingAll = (value: string, keys: string[]): DeckCard => {
    const parts = keys.map((k) => lookup(texts, [k], lang)).filter((x): x is string => !!x)
    return { kicker: th ? 'คำทำนาย' : 'Reading', value, body: parts.length ? parts.join('\n\n') : d.pending, pending: !parts.length }
  }
  const relText: Record<AnimalRelation, string> = th
    ? { same: 'ปีชง (ปีนักษัตรเดียวกับปีเกิด)', harmony: 'ปีที่เข้ากัน (หลักคู่มิตร)', trine: 'ปีที่หนุนกัน (สามประสาน)', clash: 'ปีที่ปะทะ (คู่ตรงข้าม)', harm: 'ปีที่ขัดกัน (คู่ทำร้าย)', neutral: 'ปีที่เป็นกลาง' }
    : { same: 'Your own animal year', harmony: 'A harmony year (six-harmony pair)', trine: 'A supporting year (trine)', clash: 'A clash year (opposite animal)', harm: 'A friction year (harm pair)', neutral: 'A neutral year' }
  const levelText = (c: Contact) => L.levels[c.level]
  const contactRows = (list: Contact[], withDate: boolean) =>
    list.map((c) => ({ k: (th ? `${body(c.transit)} จร → ${body(c.natal)} กำเนิด` : `${body(c.transit)} → birth ${body(c.natal)}`), v: `${levelText(c)} · ${c.sep}°` + (withDate ? ` · ${when(c.peakDay)}` : '') }))
  const contactKeys = (list: Contact[]) => list.length
    ? [...list.map((c) => `transit.${c.transit}-${c.natal}`), ...list.map((c) => `transit.${c.transit}`)]
    : ['transit.none']
  const transitTopic = (id: string, lock: LockLevel, title: string, list: Contact[], span: string, withDate: boolean): Topic => ({
    id, lock, title,
    cards: [
      reading(list.length ? (th ? `${list.length} จุดที่ดาวจรมาทับ` : `${list.length} contact${list.length > 1 ? 's' : ''}`) : (th ? 'ไม่มีดาวจรมาทับ' : 'No contacts'), contactKeys(list)),
      { kicker: th ? `ดาวจรที่มาทับดาวกำเนิด · ${span}` : `Planets reaching your birth planets · ${span}`, value: '', rows: contactRows(list, withDate),
        body: list.length ? undefined : (th ? 'ช่วงนี้ไม่มีดาวจรเข้ามาใกล้ดาวกำเนิดของคุณ' : 'No moving planet comes close to your birth planets in this period.') },
      { kicker: th ? 'วิธีดู' : 'How this is read', value: '',
        body: th ? 'เทียบตำแหน่งดาวบนท้องฟ้าจริงในช่วงเวลานั้นกับตำแหน่งดาวตอนคุณเกิด: ห่างไม่เกิน 1° = ซ้อน, ไม่เกิน 5° = เริ่มทับ, อยู่ราศีเดียวกัน = ร่วมพื้นที่ (ดูเฉพาะวันนี้)' : 'Planets in the real sky for that period are compared with where they were at your birth: within 1° = overlapping, within 5° = touching, same sign = same area (today only).' }
    ]
  })
  const overallCard = (o: Overall): DeckCard => ({
    kicker: th ? 'วิธีคิด' : 'How it is worked out', value: String(o.value),
    rows: [
      { k: th ? 'อายุ' : 'Age', v: th ? `${o.age} ปี` : `${o.age}` },
      { k: th ? 'ส่วนต่างอายุจาก 60' : 'Age gap from 60', v: String(o.ageGap) },
      { k: th ? 'ความสว่างดวงจันทร์คืนเกิด' : 'Birth-night Moon brightness', v: `${o.illum}% → ${o.moon}/15` },
      { k: th ? 'ส่วนต่างจาก 9' : 'Gap from 9', v: String(o.moonGap) },
      { k: th ? 'นำไปหาร' : 'Divide by', v: o.divisor === 1 ? (th ? 'ไม่หาร' : 'none') : String(o.divisor) },
      { k: th ? 'ผลหาร (ปัดขึ้น)' : 'Result (rounded up)', v: String(o.quotient) }
    ],
    body: o.working
  })

  return [
    // 1 — character from the day power
    {
      id: 'day', lock: 'free', title: th ? 'ลักษณะเจ้าของวันเกิด' : 'Your character from your birth number',
      cards: [
        reading(th ? `เลขประจำวันเกิด ${np.day.value}` : `Birth number ${np.day.value}`, [`day.${np.day.value}`]),
        { kicker: th ? 'วิธีคิด (วันที่ + เดือน)' : 'How it is worked out (day + month)', value: String(np.day.value), body: np.day.working }
      ]
    },
    // 2 — day power vs this year
    {
      id: 'dayYear', lock: 'member', title: th ? `ดวงปีนี้จากเลขวันเกิด (ค.ศ. ${fc.dayVsYear.yearCE})` : `Your ${fc.dayVsYear.yearCE} from your birth number`,
      cards: [
        reading(`${fc.dayVsYear.day} · ${fc.dayVsYear.year}`, [`dayYear.${fc.dayVsYear.day}-${fc.dayVsYear.year}`, `dayYear.diff.${fc.dayVsYear.diff}`]),
        { kicker: th ? 'เลขที่นำมาเทียบ' : 'The two numbers', value: '',
          rows: [{ k: th ? 'เลขประจำวันเกิด' : 'Birth number', v: String(fc.dayVsYear.day) }, { k: th ? `กำลังปี ค.ศ. ${fc.dayVsYear.yearCE}` : `Year power ${fc.dayVsYear.yearCE}`, v: String(fc.dayVsYear.year) },
            { k: th ? 'ผลต่าง' : 'Difference', v: fc.dayVsYear.diff === 0 ? (th ? 'ตรงกัน' : 'Same') : String(fc.dayVsYear.diff) }],
          body: np.curYear.working }
      ]
    },
    // 3 — the sky at birth
    {
      id: 'sky', lock: 'free', title: th ? 'ดวงดาวบนฟากฟ้าตอนเกิด' : 'The sky when you were born',
      cards: pp ? [
        readingAll(pp.zenName, [...(pp.zenCon ? [`sky.zenith.${pp.zenCon}`] : []), `sky.bright.${pp.brightness.birth_sign.state_index}`]),
        { kicker: th ? 'ดาวประจำตัว (ใกล้จุดเหนือศีรษะที่สุด)' : 'Your personal star (closest to overhead)', value: starText(pp.personal),
          rows: [{ k: th ? 'กลุ่มดาว' : 'Constellation', v: pp.personal.constellation_name }, { k: th ? 'โชติมาตร' : 'Magnitude', v: String(pp.personal.mag) },
            { k: th ? 'ห่างจากจุดเหนือศีรษะ' : 'From overhead', v: `${pp.personal.distance_from_zenith_deg}° · ${pp.personal.bearing}` }] },
        { kicker: th ? 'แผ่นฟากฟ้า ณ คืนวันเกิด' : 'Your sky on the night of birth', value: '', skyMap: true },
        { kicker: th ? 'ค่าดวงดาวคืนเกิด (ความสูงจากขอบฟ้า)' : 'Star values on the night of birth (height above the horizon)', value: '',
          rows: pp.bodies.map((b) => ({ k: b.name, v: b.p.alt >= 0 ? `${Math.round(b.p.alt)}° → ${starValue(b.p.alt)}` : (th ? `ใต้ขอบฟ้า (${Math.round(b.p.alt)}°)` : `below horizon (${Math.round(b.p.alt)}°)`) })),
          body: th ? 'ขอบฟ้า 0° ถึงเหนือศีรษะ 90° แบ่งช่วงละ 10°: 0–10° = 1 … 80–90° = 9 ดูจากที่เกิด เวลา 00:00 น.' : 'Horizon 0° to overhead 90° in 10° steps: 0–10° = 1 … 80–90° = 9, seen from your birthplace at 00:00.' },
        { kicker: th ? 'สว่างหรือมืด' : 'Bright or dark', value: pp.brightness.birth_sign.state,
          body: pp.brightness.birth_sign.blockers.length ? (th ? 'ดาวที่บัง: ' : 'Covered by: ') + pp.brightness.birth_sign.blockers.join(', ') : (th ? 'ไม่มีดาวใหญ่บังราศีเกิด' : 'No major body covers your birth sign') },
        { kicker: th ? 'ดาวใหญ่และการทับซ้อน' : 'Planets and overlaps', value: pp.overlaps.length ? String(pp.overlaps.length) : (th ? 'ไม่มี' : 'None'),
          rows: pp.overlaps.map((o) => ({ k: `${o.a} – ${o.b}`, v: `${o.level_name} · ${o.separation_deg}°` })) },
        { kicker: th ? 'ดวงจันทร์และวันเกิด' : 'Moon and weekday', value: L.days[ch.dowI],
          rows: [{ k: th ? 'ดิถี' : 'Lunar day', v: ch.lunar }, { k: th ? 'ช่วง' : 'Phase', v: ch.phase }, { k: th ? 'ส่วนที่สว่าง' : 'Illuminated', v: `${ch.illum}%` }] }
      ] : [wait]
    },
    // 4–6 — transits
    transitTopic('today', 'member', th ? 'ดวงดาววันนี้ที่มีผลต่อคุณ' : 'How today’s sky affects you', fc.today, when(0), false),
    transitTopic('month', 'premium', th ? 'ดวงดาวที่กำลังมาถึงในอีก 1 เดือน' : 'The sky over the next month', fc.month, th ? '30 วันข้างหน้า' : 'next 30 days', true),
    transitTopic('year', 'premium', th ? 'ดวงดาวที่กำลังมาถึงในอีก 1 ปี' : 'The sky over the next year', fc.year, th ? '12 เดือนข้างหน้า' : 'next 12 months', true),
    // 7 — birth sign (Western)
    {
      id: 'sign', lock: 'free', title: th ? 'ลักษณะตามราศีเกิด' : 'Your zodiac sign',
      cards: [
        reading(sign(fc.sign.birth), [`sign.${fc.sign.birth}`]),
        { kicker: th ? 'ราศีแบบสากล (ตามตำแหน่งดวงอาทิตย์)' : 'Western zodiac (from the Sun’s position)', value: sign(fc.sign.birth),
          body: th ? 'ใช้ราศีแบบสากล (สายนะ) ซึ่งต่างจากราศีแบบไทยประมาณ 1 ราศี' : 'Uses the Western (tropical) zodiac.' }
      ]
    },
    // 8 — the zodiac now
    {
      id: 'signNow', lock: 'member', title: th ? 'ผลของจักรราศีช่วงนี้' : 'The zodiac right now',
      cards: [
        reading(`${sign(fc.sign.birth)} → ${sign(fc.sign.current)}`, [`signNow.${fc.sign.birth}-${fc.sign.current}`, `signNow.dist.${fc.sign.distance}`]),
        { kicker: th ? 'ราศีที่ดวงอาทิตย์อยู่ตอนนี้ เทียบราศีเกิด' : 'Where the Sun is now, compared with your sign', value: '',
          rows: [{ k: th ? 'ราศีเกิด' : 'Your sign', v: sign(fc.sign.birth) }, { k: th ? 'ราศีปัจจุบัน' : 'Sun sign now', v: sign(fc.sign.current) },
            { k: th ? 'ห่างกัน' : 'Distance', v: th ? `${fc.sign.distance} ราศี` : `${fc.sign.distance} sign${fc.sign.distance === 1 ? '' : 's'}` }] }
      ]
    },
    // 9 — birth animal
    {
      id: 'animal', lock: 'free', title: th ? 'ปีนักษัตรที่เกิด' : 'Your Chinese zodiac animal',
      cards: [
        reading(th ? `ปี${animal(fc.animal.birth)}` : animal(fc.animal.birth), [`animal.${fc.animal.birth}`]),
        { kicker: th ? 'ปีเกิด ค.ศ.' : 'Birth year', value: String(res.inp.y),
          body: th ? 'นับปีนักษัตรตามปีปฏิทิน ผู้ที่เกิดช่วงต้นปีก่อนตรุษจีนอาจเป็นปีนักษัตรก่อนหน้า' : 'Counted by calendar year; if you were born before Chinese New Year it may be the previous animal.' }
      ]
    },
    // 10 — this year's animal
    {
      id: 'animalNow', lock: 'member', title: th ? `ผลของปีนักษัตรปัจจุบัน (ปี${animal(fc.animal.current)})` : `This year’s animal: ${animal(fc.animal.current)}`,
      cards: [
        reading(relText[fc.animal.relNow], [`animalNow.${fc.animal.birth}-${fc.animal.current}`, `animalNow.${fc.animal.relNow}`]),
        { kicker: th ? 'ปีนักษัตรที่นำมาเทียบ' : 'The two animals', value: '',
          rows: [{ k: th ? 'ปีเกิด' : 'Birth year', v: animal(fc.animal.birth) }, { k: th ? `ปี ค.ศ. ${fc.dayVsYear.yearCE}` : String(fc.dayVsYear.yearCE), v: animal(fc.animal.current) }] }
      ]
    },
    // 11 — overall, now (owner's formula: age gap from 60, shaped by the birth-night Moon)
    {
      id: 'overallNow', lock: 'premium', title: th ? 'ดวงชะตารวมช่วงนี้' : 'Your overall fortune now',
      cards: [reading(th ? `เลขดวงชะตารวม ${fc.overallNow.value}` : `Overall number ${fc.overallNow.value}`, [`overall.now.${fc.overallNow.value}`, `overall.${fc.overallNow.value}`, 'overall.now']), overallCard(fc.overallNow)]
    },
    // 12 — overall, next year (same formula with next year's age)
    {
      id: 'overallNext', lock: 'premium', title: th ? `ดวงชะตารวมปีหน้า (ค.ศ. ${fc.dayVsNext.yearCE})` : `Your overall fortune for ${fc.dayVsNext.yearCE}`,
      cards: [reading(th ? `เลขดวงชะตารวม ${fc.overallNext.value}` : `Overall number ${fc.overallNext.value}`, [`overall.next.${fc.overallNext.value}`, `overall.${fc.overallNext.value}`, 'overall.next']), overallCard(fc.overallNext)]
    },
    // 13 — personal number (to be defined)
    {
      id: 'personal', lock: 'free', title: th ? 'ความหมายเลขเฉพาะตัว' : 'Your personal number',
      cards: [reading(th ? 'เลขเฉพาะตัว' : 'Personal number', ['personal'])]
    }
  ]
}
