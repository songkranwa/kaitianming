import { CONTACT_EMAIL } from '../config'
import type { Lang } from '../i18n/types'

// Privacy policy and terms of use. They describe what the site does today; update them before
// adding ads, accounts or payments. Drafted by Claude, to be reviewed by a lawyer.

const UPDATED = { en: '25 November 2026', th: '25 พฤศจิกายน 2569' }

type Block = { h: string; p: string[] }
type Doc = { title: string; intro: string; blocks: Block[] }

const PRIVACY: Record<Lang, Doc> = {
  en: {
    title: 'Privacy policy',
    intro: 'Kaitianming is built so that your birth details never leave your device. This page explains exactly what is and isn’t collected.',
    blocks: [
      { h: 'Your date and place of birth', p: [
        'Everything you type into the form is processed only in your browser. Your birth date and place are not sent to our server or anyone else’s, are not stored, and never appear in the page address.',
        'To find your birthplace, the site downloads a list of world cities to your device and searches it there.'] },
      { h: 'What is kept on your device', p: [
        'Your language choice and your choice about personalised ads are saved in your browser’s storage so the site remembers them. The site also keeps a copy of its own files so it works offline. You can clear all of this in your browser settings at any time.'] },
      { h: 'What our server sees', p: [
        'The site is hosted by Cloudflare. Like any website, Cloudflare processes technical details such as your IP address and browser type to deliver the pages and protect them from attacks. We do not use these details to identify you.',
        'The site fetches the prediction texts from our server as one file for everyone. That request carries no birth details.',
        'The site’s fonts are loaded from Google Fonts, so Google also receives your IP address and browser details when a page loads.',
        'We do not currently use analytics, tracking cookies or advertising.'] },
      { h: 'Email', p: [`If you write to ${CONTACT_EMAIL}, we use your address and message only to reply to you.`] },
      { h: 'Ads, accounts and payments', p: [
        'The site has no ads, member accounts or payments yet. Before any of these are added, this policy will be updated and, where the law requires it, we will ask for your consent first. Your birth details will never be shared with advertisers.'] },
      { h: 'Your rights', p: [
        'Under Thailand’s Personal Data Protection Act and, for visitors from Europe, the GDPR, you can ask to see, correct or delete personal data we hold about you, or object to its use. Because we keep almost nothing, most requests will concern email you sent us. Write to us at the address below.'] },
      { h: 'Children', p: ['The site is not intended for children under 13.'] },
      { h: 'Changes and contact', p: [`We will post any change to this policy here with a new date. Questions: ${CONTACT_EMAIL}.`] }
    ]
  },
  th: {
    title: 'นโยบายความเป็นส่วนตัว',
    intro: 'Kaitianming ออกแบบให้ข้อมูลวันเกิดของคุณไม่ออกจากอุปกรณ์ของคุณเลย หน้านี้อธิบายว่าเราเก็บอะไรและไม่เก็บอะไร',
    blocks: [
      { h: 'วันเกิดและสถานที่เกิดของคุณ', p: [
        'ทุกอย่างที่คุณกรอกในแบบฟอร์มถูกประมวลผลในเบราว์เซอร์ของคุณเท่านั้น วันเกิดและสถานที่เกิดไม่ถูกส่งไปยังเซิร์ฟเวอร์ของเราหรือของใคร ไม่ถูกเก็บไว้ และไม่ปรากฏในที่อยู่ของหน้าเว็บ',
        'ในการค้นหาสถานที่เกิด เว็บไซต์จะดาวน์โหลดรายชื่อเมืองทั่วโลกมาไว้ในเครื่องของคุณ แล้วค้นหาในเครื่อง'] },
      { h: 'สิ่งที่เก็บไว้ในอุปกรณ์ของคุณ', p: [
        'ภาษาที่คุณเลือก และตัวเลือกเรื่องโฆษณาที่ปรับตามความสนใจ ถูกบันทึกในพื้นที่เก็บข้อมูลของเบราว์เซอร์เพื่อให้เว็บไซต์จำได้ เว็บไซต์ยังเก็บสำเนาไฟล์ของตัวเองไว้เพื่อให้ใช้งานแบบออฟไลน์ได้ คุณล้างข้อมูลเหล่านี้ได้ทุกเมื่อในการตั้งค่าเบราว์เซอร์'] },
      { h: 'สิ่งที่เซิร์ฟเวอร์ของเราเห็น', p: [
        'เว็บไซต์โฮสต์โดย Cloudflare เช่นเดียวกับเว็บไซต์ทั่วไป Cloudflare ประมวลผลข้อมูลทางเทคนิค เช่น ที่อยู่ IP และชนิดของเบราว์เซอร์ เพื่อส่งหน้าเว็บและป้องกันการโจมตี เราไม่ได้ใช้ข้อมูลเหล่านี้เพื่อระบุตัวคุณ',
        'เว็บไซต์ดึงข้อความคำทำนายจากเซิร์ฟเวอร์ของเราเป็นไฟล์เดียวที่ทุกคนได้เหมือนกัน คำขอนั้นไม่มีข้อมูลวันเกิดใดๆ',
        'ตัวอักษรของเว็บไซต์โหลดจาก Google Fonts ดังนั้น Google จะได้รับที่อยู่ IP และข้อมูลเบราว์เซอร์ของคุณเมื่อเปิดหน้าเว็บด้วย',
        'ขณะนี้เราไม่ได้ใช้เครื่องมือวิเคราะห์สถิติ คุกกี้ติดตาม หรือโฆษณา'] },
      { h: 'อีเมล', p: [`ถ้าคุณเขียนถึง ${CONTACT_EMAIL} เราใช้อีเมลและข้อความของคุณเพื่อตอบกลับเท่านั้น`] },
      { h: 'โฆษณา บัญชีสมาชิก และการชำระเงิน', p: [
        'ขณะนี้เว็บไซต์ยังไม่มีโฆษณา บัญชีสมาชิก หรือการชำระเงิน ก่อนเพิ่มสิ่งเหล่านี้ เราจะปรับปรุงนโยบายนี้ และจะขอความยินยอมจากคุณก่อนในกรณีที่กฎหมายกำหนด ข้อมูลวันเกิดของคุณจะไม่ถูกส่งให้ผู้ลงโฆษณาเด็ดขาด'] },
      { h: 'สิทธิของคุณ', p: [
        'ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 และ GDPR สำหรับผู้เข้าชมจากยุโรป คุณมีสิทธิขอดู แก้ไข หรือลบข้อมูลส่วนบุคคลที่เรามีเกี่ยวกับคุณ หรือคัดค้านการใช้ข้อมูลนั้น เนื่องจากเราแทบไม่เก็บข้อมูลใดเลย คำขอส่วนใหญ่จะเกี่ยวกับอีเมลที่คุณส่งถึงเรา ติดต่อเราได้ที่อีเมลด้านล่าง'] },
      { h: 'เด็ก', p: ['เว็บไซต์นี้ไม่ได้มีไว้สำหรับเด็กอายุต่ำกว่า 13 ปี'] },
      { h: 'การเปลี่ยนแปลงและการติดต่อ', p: [`เราจะประกาศการเปลี่ยนแปลงนโยบายนี้ในหน้านี้พร้อมวันที่ใหม่ สอบถามได้ที่ ${CONTACT_EMAIL}`] }
    ]
  }
}

const TERMS: Record<Lang, Doc> = {
  en: {
    title: 'Terms of use',
    intro: 'By using Kaitianming you agree to these terms.',
    blocks: [
      { h: 'For entertainment and reflection', p: [
        'Kaitianming combines real astronomy with traditional number and zodiac readings. The readings are for entertainment and personal reflection. They are not predictions of fact and are not medical, legal, financial or psychological advice. Don’t base important decisions on them.'] },
      { h: 'How accurate the sky is', p: [
        'Star and planet positions are calculated with published astronomical methods and checked against published sky events, but small differences from professional ephemerides are possible. Because you enter no time of birth, the sky shown is the sky at 00:00 on your birth date at your birthplace.'] },
      { h: 'Using the site', p: [
        'You may use the site for your own personal, non-commercial purposes. Please don’t copy the prediction texts in bulk, overload the site with automated requests, or try to get into areas that aren’t meant for you.'] },
      { h: 'Ownership', p: [
        'The prediction texts, design and code belong to Kaitianming. Star catalogues, city data and other sources belong to their owners and are used under their licences, listed under “Credits & references”.'] },
      { h: 'Premium membership', p: ['Premium is not on sale yet. Its price, billing and cancellation terms will be published here before it opens.'] },
      { h: 'Limits of responsibility', p: [
        'The site is provided as it is. To the extent the law allows, Kaitianming is not responsible for decisions you make based on a reading, or for the site being unavailable from time to time.'] },
      { h: 'Changes, law and contact', p: [
        `We may update these terms; the date below shows the latest version. These terms are governed by the laws of Thailand. Questions: ${CONTACT_EMAIL}.`] }
    ]
  },
  th: {
    title: 'ข้อกำหนดการใช้งาน',
    intro: 'การใช้งาน Kaitianming ถือว่าคุณยอมรับข้อกำหนดเหล่านี้',
    blocks: [
      { h: 'เพื่อความบันเทิงและการทบทวนตนเอง', p: [
        'Kaitianming ผสานดาราศาสตร์จริงเข้ากับศาสตร์ตัวเลขและจักรราศีตามตำรา คำทำนายมีไว้เพื่อความบันเทิงและการทบทวนตนเอง ไม่ใช่การพยากรณ์ข้อเท็จจริง และไม่ใช่คำแนะนำทางการแพทย์ กฎหมาย การเงิน หรือจิตวิทยา โปรดอย่าใช้เป็นเหตุผลหลักในการตัดสินใจเรื่องสำคัญ'] },
      { h: 'ความแม่นยำของท้องฟ้า', p: [
        'ตำแหน่งดาวฤกษ์และดาวเคราะห์คำนวณด้วยวิธีทางดาราศาสตร์ที่เผยแพร่ และตรวจกับปรากฏการณ์บนฟ้าที่มีการเผยแพร่แล้ว แต่อาจต่างจากปฏิทินดาราศาสตร์ระดับมืออาชีพเล็กน้อย เนื่องจากไม่ได้ถามเวลาเกิด ท้องฟ้าที่แสดงคือท้องฟ้าเวลา 00:00 น. ของวันเกิด ณ ที่ที่คุณเกิด'] },
      { h: 'การใช้งานเว็บไซต์', p: [
        'คุณใช้เว็บไซต์เพื่อประโยชน์ส่วนตัวที่ไม่ใช่เชิงพาณิชย์ได้ โปรดอย่าคัดลอกข้อความคำทำนายจำนวนมาก ส่งคำขออัตโนมัติจนเว็บไซต์ทำงานหนัก หรือพยายามเข้าส่วนที่ไม่ได้เปิดให้คุณ'] },
      { h: 'ความเป็นเจ้าของ', p: [
        'ข้อความคำทำนาย การออกแบบ และโค้ดเป็นของ Kaitianming แคตตาล็อกดาว ข้อมูลเมือง และแหล่งข้อมูลอื่นเป็นของเจ้าของแต่ละราย และใช้ตามสัญญาอนุญาตที่ระบุไว้ใน “เครดิตและแหล่งอ้างอิง”'] },
      { h: 'สมาชิกพรีเมียม', p: ['ยังไม่เปิดขายสมาชิกพรีเมียม ราคา การเรียกเก็บเงิน และการยกเลิกจะประกาศในหน้านี้ก่อนเปิดขาย'] },
      { h: 'ขอบเขตความรับผิดชอบ', p: [
        'เว็บไซต์ให้บริการตามสภาพที่เป็นอยู่ ภายในขอบเขตที่กฎหมายอนุญาต Kaitianming ไม่รับผิดชอบต่อการตัดสินใจที่คุณทำจากคำทำนาย หรือการที่เว็บไซต์ใช้งานไม่ได้เป็นครั้งคราว'] },
      { h: 'การเปลี่ยนแปลง กฎหมาย และการติดต่อ', p: [
        `เราอาจปรับปรุงข้อกำหนดเหล่านี้ วันที่ด้านล่างแสดงฉบับล่าสุด ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย สอบถามได้ที่ ${CONTACT_EMAIL}`] }
    ]
  }
}

export function LegalView({ kind, lang, onBack, backLabel }: { kind: 'privacy' | 'terms'; lang: Lang; onBack: () => void; backLabel: string }) {
  const doc = (kind === 'privacy' ? PRIVACY : TERMS)[lang]
  return (
    <article className="container narrow page legal" aria-labelledby="legal-title">
      <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={onBack}>{backLabel}</button>
      <h1 id="legal-title" className="page-title">{doc.title}</h1>
      <p className="muted small">{lang === 'th' ? 'ปรับปรุงล่าสุด ' : 'Last updated '}{UPDATED[lang]}</p>
      <p style={{ fontSize: 17 }}>{doc.intro}</p>
      {doc.blocks.map((b) => (
        <section key={b.h} className="stack gap-8">
          <h2 className="legal-h">{b.h}</h2>
          {b.p.map((x, i) => <p key={i} className="legal-p">{x}</p>)}
        </section>
      ))}
    </article>
  )
}
