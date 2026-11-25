// Text for the time-travel screen ("เดินทางข้ามช่วงเวลา"), English first.
// Event readings can be replaced in the admin with the keys travel.<kind> (e.g. travel.lunarEclipse);
// planet contacts use the same transit.<planet>-<planet> texts as the result page.

import type { SkyEvent } from '../engine/events'
import type { Labels } from '../i18n/labels'
import type { Lang } from '../i18n/types'

export function travelText(lang: Lang) {
  const th = lang === 'th'
  return {
    title: th ? 'เดินทางข้ามช่วงเวลา' : 'Travel through time',
    ctaKicker: th ? 'ท้องฟ้าของคุณในวันอื่น' : 'Your sky on any other day',
    ctaBody: th
      ? 'ย้อนกลับไปคืนที่คุณเกิด หรือไปข้างหน้าถึงจันทรุปราคาครั้งต่อไป ดูท้องฟ้าเหนือที่เกิดของคุณในวันใดก็ได้ และสิ่งที่มันหมายถึงสำหรับคุณ'
      : 'Go back to the night you were born, or forward to your next eclipse. See the sky over your birthplace on any day of your life, and what it means for you.',
    start: th ? 'เริ่มเดินทาง' : 'Start travelling',
    back: th ? 'กลับไปหน้าคำทำนาย' : 'Back to your reading',
    skyNote: (city: string) => (th ? `ท้องฟ้าเหนือ${city} เวลา 00:00 น. ของวันที่เลือก` : `The sky over ${city} at 00:00 on the chosen day`),
    dialLabel: th ? 'เลือกวัน: เลื่อนซ้าย–ขวา' : 'Choose a day: slide left or right',
    dialHint: th ? 'เลื่อนแถบเหมือนหมุนวงแหวนโฟกัส · ★ = ช่วงเวลาสำคัญบนท้องฟ้า' : 'Slide the dial like a focus ring · ★ = a key moment in the sky',
    minusDay: th ? '− 1 วัน' : '− 1 day',
    plusDay: th ? '+ 1 วัน' : '+ 1 day',
    tonight: th ? 'คืนนี้' : 'Tonight',
    now: th ? 'วันนี้' : 'NOW',
    view: th ? 'ดูคำทำนายของวันนี้' : 'View the prediction for this day',
    close: th ? 'ปิด' : 'Close',
    finding: th ? 'กำลังหาช่วงเวลาสำคัญในชีวิตคุณ…' : 'Finding the key moments of your life…',
    loadingSky: th ? 'กำลังโหลดข้อมูลดาว…' : 'Loading star data…',
    age: (n: number) => (th ? `อายุ ${n} ปี` : `Age ${n}`),
    beforeBirth: th ? 'ก่อนเกิด' : 'Before birth',
    rel: (diff: number) => {
      const a = Math.abs(diff)
      if (diff === 0) return th ? 'คืนนี้' : 'Tonight'
      if (a < 365) return th ? (diff > 0 ? `อีก ${a} วัน` : `${a} วันที่แล้ว`) : diff > 0 ? `In ${a} day${a > 1 ? 's' : ''}` : `${a} day${a > 1 ? 's' : ''} ago`
      const y = Math.round(a / 365.25)
      return th ? (diff > 0 ? `อีก ${y} ปี` : `${y} ปีที่แล้ว`) : diff > 0 ? `In ${y} year${y > 1 ? 's' : ''}` : `${y} year${y > 1 ? 's' : ''} ago`
    },
    jumpTo: th ? 'ไปที่' : 'Go to',
    touching: th ? 'ดาวจรที่แตะดาวกำเนิดในวันนี้' : 'Planets touching your birth sky on this day',
    noContacts: th ? 'วันนี้ไม่มีดาวจรเข้าใกล้ดาวกำเนิดของคุณ ท้องฟ้าค่อนข้างสงบสำหรับคุณ' : 'No moving planet is close to your birth planets on this day: a quiet sky for you.',
    fortune: th ? 'เลขดวงชะตารวม' : 'Overall number',
    yearPower: th ? 'กำลังปี' : 'Year power',
    animal: th ? 'ปีนักษัตร' : 'Animal year',
    quietTitle: th ? 'ท้องฟ้าของคุณในวันนี้' : 'Your sky on this day'
  }
}

/** Short name of an event, for the readout and the star buttons. */
export function eventLabel(e: SkyEvent, L: Labels, lang: Lang): string {
  const th = lang === 'th'
  const b = (p?: string) => (p ? L.bodies[p as keyof typeof L.bodies] : '')
  switch (e.kind) {
    case 'birth': return th ? 'คืนที่คุณเกิด' : 'The night you were born'
    case 'jupiterReturn': return th ? `ดาวพฤหัสกลับสู่ตำแหน่งกำเนิด (ครั้งที่ ${e.n})` : `Jupiter return #${e.n}`
    case 'saturnReturn': return th ? `ดาวเสาร์กลับสู่ตำแหน่งกำเนิด (ครั้งที่ ${e.n})` : `Saturn return #${e.n}`
    case 'contact': return th ? `${b(e.transit)}จรทับ${b(e.natal)}กำเนิด` : `${b(e.transit)} on your birth ${b(e.natal)}`
    case 'lunarEclipse': return th ? 'จันทรุปราคาเหนือที่เกิด' : 'Lunar eclipse over your birthplace'
    case 'age60': return th ? 'อายุครบ 60 ปี · ครบรอบ' : 'Age 60 · full circle'
  }
}

/** Default reading of an event, used until the owner writes travel.<kind> in the admin. */
export function eventReading(e: SkyEvent, L: Labels, lang: Lang): string {
  const th = lang === 'th'
  const b = (p?: string) => (p ? L.bodies[p as keyof typeof L.bodies] : '')
  switch (e.kind) {
    case 'birth': return th
      ? 'ท้องฟ้าคืนนี้คือจุดตั้งต้นของคุณ ทุกวันบนแถบเวลานี้วัดจากตำแหน่งดาวในคืนนี้'
      : 'This is the sky you started from. Every other day on this dial is measured against it.'
    case 'jupiterReturn': return th
      ? 'ดาวพฤหัสกลับมาอยู่ที่เดิมเหมือนตอนคุณเกิด ปิดรอบ 12 ปีและเปิดช่วงใหม่ของการเติบโต โอกาสและผู้คนใหม่ๆ'
      : 'Jupiter is back where it stood at your birth. A twelve-year chapter closes and a new season of growth, chances and people begins.'
    case 'saturnReturn': return th
      ? 'ดาวเสาร์โคจรครบรอบนับจากวันเกิด เป็นจุดเปลี่ยนสำคัญ สิ่งที่สร้างมาถูกทดสอบ และสิ่งที่มั่นคงจะอยู่กับคุณต่อไป'
      : 'Saturn completes a full lap since your birth: a turning point. What you have built is tested, and what is solid stays with you.'
    case 'contact': return th
      ? `${b(e.transit)}จรมาทับ${b(e.natal)}กำเนิดของคุณพอดี เป็นช่วงที่อิทธิพลของ${b(e.transit)}ชัดที่สุดในเรื่องที่${b(e.natal)}ดูแล`
      : `${b(e.transit)} lands exactly on your birth ${b(e.natal)}. Its influence is strongest now in everything your ${b(e.natal)} stands for.`
    case 'lunarEclipse': return th
      ? 'ดวงจันทร์เข้าไปในเงาโลกและมองเห็นได้จากที่เกิดของคุณ ตามหลักของเว็บนี้ จันทรุปราคานับเป็นจันทร์ดับ ควรพักและคิดให้รอบคอบก่อนตัดสินใจเรื่องใหญ่'
      : 'The Moon passes through the Earth’s shadow, visible from your birthplace. By this site’s rule an eclipsed Moon counts as a dark Moon: a time to pause before big decisions.'
    case 'age60': return th
      ? 'อายุครบ 60 ปี ส่วนต่าง |60 − อายุ| เป็นศูนย์ในสูตรดวงชะตารวม และปีนักษัตรวนกลับมาครบรอบ 60 ปีเหมือนปีเกิด'
      : 'You turn 60: the gap |60 − age| in the overall formula reaches zero, and the sixty-year cycle of the Chinese calendar comes full circle.'
  }
}
