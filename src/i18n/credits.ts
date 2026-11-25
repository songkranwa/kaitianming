// Credits & references shown in the footer of every page (project rule: credit everything actually used).

import type { Lang } from './types'

export interface CreditItem { name: string; detail: string; links: { label: string; url: string }[] }
export interface CreditGroup { group: string; items: CreditItem[] }

export function credits(lang: Lang): CreditGroup[] {
  const th = lang === 'th'
  const t = (enText: string, thText: string) => (th ? thText : enText)
  return [
    { group: t('Fonts', 'ฟอนต์'), items: [
      { name: 'Noto Serif Thai', detail: t('Headings, by Google · SIL Open Font License 1.1', 'ฟอนต์หัวเรื่อง โดย Google · SIL Open Font License 1.1'), links: [{ label: 'Google Fonts', url: 'https://fonts.google.com/specimen/Noto+Serif+Thai' }, { label: 'OFL', url: 'https://openfontlicense.org' }] },
      { name: 'IBM Plex Sans Thai', detail: t('Body text, by IBM · SIL Open Font License 1.1', 'ฟอนต์เนื้อความ โดย IBM · SIL Open Font License 1.1'), links: [{ label: 'Google Fonts', url: 'https://fonts.google.com/specimen/IBM+Plex+Sans+Thai' }] },
      { name: 'Ma Shan Zheng', detail: t('Brush lettering of 开天命 in the logo, by Ma Shan Zheng · SIL Open Font License 1.1', 'ตัวอักษรพู่กัน 开天命 ในโลโก้ โดย Ma Shan Zheng · SIL Open Font License 1.1'), links: [{ label: 'Google Fonts', url: 'https://fonts.google.com/specimen/Ma+Shan+Zheng' }, { label: 'OFL', url: 'https://openfontlicense.org' }] }
    ] },
    { group: t('Services & tools', 'บริการและเครื่องมือ'), items: [
      { name: 'Google Fonts API', detail: t('Font delivery', 'บริการโหลดไฟล์ฟอนต์'), links: [{ label: 'fonts.google.com', url: 'https://fonts.google.com' }] },
      { name: 'React', detail: t('User-interface library, by Meta and contributors · MIT License', 'ไลบรารีสร้างหน้าจอ โดย Meta และผู้ร่วมพัฒนา · สัญญาอนุญาต MIT'), links: [{ label: 'react.dev', url: 'https://react.dev' }] },
      { name: 'Vite', detail: t('Build tool, by VoidZero and contributors · MIT License', 'เครื่องมือสร้างเว็บ โดย VoidZero และผู้ร่วมพัฒนา · สัญญาอนุญาต MIT'), links: [{ label: 'vite.dev', url: 'https://vite.dev' }] },
      { name: 'TypeScript', detail: t('Programming language, by Microsoft · Apache License 2.0', 'ภาษาเขียนโปรแกรม โดย Microsoft · Apache License 2.0'), links: [{ label: 'typescriptlang.org', url: 'https://www.typescriptlang.org' }] },
      { name: 'vite-plugin-pwa · Workbox', detail: t('Installable app and offline support · MIT License (Workbox by Google)', 'ทำให้ติดตั้งเป็นแอปและใช้ออฟไลน์ได้ · สัญญาอนุญาต MIT (Workbox โดย Google)'), links: [{ label: 'vite-pwa-org.netlify.app', url: 'https://vite-pwa-org.netlify.app' }, { label: 'Workbox', url: 'https://developer.chrome.com/docs/workbox' }] },
      { name: 'Cloudflare Workers', detail: t('Hosting of the site files (static assets); no birth details are sent to it', 'โฮสต์ไฟล์เว็บไซต์ (static assets) ไม่มีการส่งข้อมูลวันเกิดไปที่นี่'), links: [{ label: 'cloudflare.com', url: 'https://www.cloudflare.com' }] },
      { name: t('Claude by Anthropic', 'Claude โดย Anthropic'), detail: t('Used to design the pages, write the code and draft the text', 'ใช้ออกแบบหน้าเว็บ เขียนโค้ด และเรียบเรียงข้อความ'), links: [{ label: 'anthropic.com', url: 'https://www.anthropic.com' }] },
      { name: t('Icons', 'ไอคอน'), detail: t('Drawn for this site (SVG); no third-party icon set', 'วาดขึ้นใหม่สำหรับเว็บไซต์นี้ (SVG)'), links: [] },
      { name: t('Browser Intl (Unicode CLDR)', 'Intl ของเบราว์เซอร์ (Unicode CLDR)'), detail: t('Country names in many languages and date formats', 'ชื่อประเทศหลายภาษาและรูปแบบวันที่'), links: [{ label: 'cldr.unicode.org', url: 'https://cldr.unicode.org' }] }
    ] },
    { group: t('Places & time', 'สถานที่และเวลา'), items: [
      { name: 'GeoNames', detail: t('World city database, 49,708 places (population 5,000+, capitals, and all Thai entries in cities1000) with coordinates and time zones · CC BY 4.0 · 2020 snapshot via github.com/nabilashraf/cities1000', 'ฐานเมืองทั่วโลก 49,708 เมือง (ประชากร 5,000 ขึ้นไป เมืองหลวง และเมืองในไทยทั้งหมดในชุด cities1000) พร้อมพิกัดและเขตเวลา · CC BY 4.0 · ใช้สำเนาปี 2020 จาก github.com/nabilashraf/cities1000'), links: [{ label: 'geonames.org', url: 'https://www.geonames.org' }, { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' }, { label: 'cities1000', url: 'https://github.com/nabilashraf/cities1000' }] },
      { name: t('IANA Time Zone Database', 'ฐานข้อมูลเขตเวลา IANA'), detail: t('Historical offsets and daylight saving, used through the browser’s Intl (public domain)', 'ประวัติเขตเวลาและเวลาออมแสง ใช้ผ่าน Intl ของเบราว์เซอร์ (สาธารณสมบัติ)'), links: [{ label: 'iana.org/time-zones', url: 'https://www.iana.org/time-zones' }] }
    ] },
    { group: t('Astronomy', 'ดาราศาสตร์'), items: [
      { name: t('Planet positions', 'สูตรคำนวณตำแหน่งดาว'), detail: t('Paul Schlyter, "How to compute planetary positions"; accurate to about 1–2 arcminutes', 'Paul Schlyter, "How to compute planetary positions" คลาดเคลื่อนราว 1–2 ลิปดา'), links: [{ label: 'stjarnhimlen.se', url: 'https://stjarnhimlen.se/comp/ppcomp.html' }] },
      { name: t('Sunrise and sunset', 'เวลาอาทิตย์ขึ้น–ตก'), detail: t('Adapted from Paul Schlyter, "How to compute rise/set times"', 'ปรับจาก Paul Schlyter, "How to compute rise/set times"'), links: [{ label: 'stjarnhimlen.se', url: 'https://stjarnhimlen.se/comp/riset.html' }] },
      { name: t('Lahiri ayanamsa', 'อายนางศ์ลาหิรี'), detail: t('Indian Calendar Reform Committee (1955); may differ slightly from the Thai Suriyayatra system', 'คณะกรรมการปฏิรูปปฏิทินของอินเดีย (ค.ศ. 1955) อาจต่างจากระบบสุริยยาตร์ของไทยเล็กน้อย'), links: [] },
      { name: 'JPL Horizons System', detail: t('NASA/JPL Solar System Dynamics Group; used as verification links', 'NASA/JPL Solar System Dynamics Group ใช้เป็นลิงก์ตรวจสอบ'), links: [{ label: 'ssd.jpl.nasa.gov/horizons', url: 'https://ssd.jpl.nasa.gov/horizons/' }, { label: t('API docs', 'เอกสาร API'), url: 'https://ssd-api.jpl.nasa.gov/doc/horizons.html' }] }
    ] },
    { group: t('Sky map & constellations', 'แผ่นฟากฟ้าและกลุ่มดาว'), items: [
      { name: 'd3-celestial', detail: t('Stars, constellation lines and boundaries, by Olaf Frohn · BSD 3-Clause (stars brighter than magnitude 5)', 'ข้อมูลดาว เส้นและเขตกลุ่มดาว โดย Olaf Frohn · BSD 3-Clause (ดาวสว่างกว่าโชติมาตร 5)'), links: [{ label: 'github.com/ofrohn/d3-celestial', url: 'https://github.com/ofrohn/d3-celestial' }] },
      { name: 'XHIP', detail: t('Star positions, Anderson & Francis (2012)', 'ตำแหน่งดาวฤกษ์ Anderson & Francis (2012)'), links: [{ label: 'VizieR V/137D', url: 'https://cdsarc.cds.unistra.fr/viz-bin/cat/V/137D' }] },
      { name: t('Star names and designations', 'ชื่อและรหัสดาว'), detail: 'Kostjuk (2002); Smith (1996)', links: [{ label: 'VizieR IV/27A', url: 'https://cdsarc.cds.unistra.fr/viz-bin/cat/IV/27A' }] },
      { name: t('Constellation figures', 'เส้นกลุ่มดาว'), detail: t('IAU constellation charts', 'แผนภาพกลุ่มดาวของ IAU'), links: [{ label: 'IAU', url: 'https://www.iau.org/public/themes/constellations/' }] },
      { name: t('88 constellation boundaries', 'เขตกลุ่มดาว 88 กลุ่ม'), detail: 'Davenhall & Leggett (1989)', links: [{ label: 'VizieR VI/49', url: 'https://cdsarc.cds.unistra.fr/viz-bin/cat/VI/49' }] },
      { name: t('Thai constellation names', 'ชื่อกลุ่มดาวภาษาไทย'), detail: 'Siam Skies', links: [{ label: 'siamskies.com', url: 'https://www.siamskies.com/2018/11/blog-post.html' }] },
      { name: t('Precession and sidereal time', 'การหมุนแกนโลกและเวลาดาราคติ'), detail: t('IAU 1976 (Lieske et al., 1977) and Meeus, Astronomical Algorithms (1998)', 'IAU 1976 (Lieske et al., 1977) และ Meeus, Astronomical Algorithms (1998)'), links: [] }
    ] },
    { group: t('Methods', 'วิธีคำนวณ'), items: [
      { name: t('Day and year power', 'กำลังวันและกำลังปี'), detail: t('Site owner’s rules: day power = day + month, and if two digits the difference between them; year power = the last two digits of the CE year added, with the same two-digit rule', 'ตามหลักการที่เจ้าของเว็บไซต์กำหนด: กำลังวัน = วันที่ + เลขเดือน ถ้าได้สองหลักให้เอาผลต่างของสองหลัก กำลังปี = ผลบวกเลข 2 ตัวท้ายของปี ค.ศ. ถ้าได้สองหลักให้เอาผลต่างเช่นกัน'), links: [] },
      { name: t('Life number', 'เลขชีวิต'), detail: t('Pythagorean numerology', 'เลขศาสตร์แบบพีทาโกรัส'), links: [] },
      { name: t('Lunar day and retrograde motion', 'ดิถีและการโคจรพักร์'), detail: t('Lunar day from the Moon–Sun angle in 12° steps; retrograde by comparing longitude 12 hours before and after', 'ดิถีจากมุมห่างจันทร์–อาทิตย์ช่วงละ 12° · พักร์ เทียบลองจิจูดก่อนและหลัง 12 ชั่วโมง'), links: [] },
      { name: t('Chinese zodiac', 'ปีนักษัตร'), detail: t('12-year cycle; the year changes on Chinese New Year, computed as two new moons after the start of the lunar month holding the December solstice (Beijing time), checked against the Hong Kong Observatory calendar', 'วัฏจักร 12 ปี เปลี่ยนปีที่วันตรุษจีน คำนวณจากจันทร์ดับครั้งที่สองหลังเดือน 11 ที่มีวันเหมายัน (เวลาปักกิ่ง) ตรวจกับปฏิทินของหอดูดาวฮ่องกง'), links: [{ label: t('Hong Kong Observatory calendar (example: 1925)', 'ปฏิทินหอดูดาวฮ่องกง (ตัวอย่าง: ค.ศ. 1925)'), url: 'https://www.hko.gov.hk/en/gts/time/calendar/text/files/T1925e.txt' }] },
      { name: t('Lunar eclipse on the birth night', 'จันทรุปราคาคืนเกิด'), detail: t('Moon inside the Earth’s dark shadow within 6 hours of 00:00; counted as a dark moon in the overall-fortune number', 'ดวงจันทร์อยู่ในเงามืดของโลกภายใน 6 ชั่วโมงรอบ 00:00 น. นับเป็นจันทร์ดับในเลขดวงชะตารวม'), links: [] },
      { name: t('Star value', 'ค่าดวงดาว'), detail: t('Site owner’s rule: height above the horizon from the birthplace, 0–10° = 1 up to 80–90° = 9', 'ตามหลักการที่เจ้าของเว็บไซต์กำหนด: ความสูงจากขอบฟ้า ณ ที่เกิด 0–10° = 1 ถึง 80–90° = 9'), links: [] },
      { name: t('Overall-fortune number', 'เลขดวงชะตารวม'), detail: t('Site owner’s formula: |60 − age|, divided according to the birth-night Moon (brightness in fifteenths, gap from 9), rounded up, digits added to one digit', 'ตามสูตรที่เจ้าของเว็บไซต์กำหนด: |60 − อายุ| หารตามค่าดวงจันทร์คืนเกิด (ความสว่างเป็น 15 ส่วน ส่วนต่างจาก 9) ปัดขึ้น แล้วรวมหลักให้เหลือหลักเดียว'), links: [] },
      { name: t('Planets passing over birth planets', 'ดาวจรทับดาวกำเนิด'), detail: t('Moving planets compared with birth positions by ecliptic longitude: within 1° overlapping, within 5° touching, same sign same area', 'เทียบลองจิจูดสุริยวิถีของดาวจรกับดาวกำเนิด: ห่างไม่เกิน 1° ซ้อน ไม่เกิน 5° เริ่มทับ ราศีเดียวกันร่วมพื้นที่'), links: [] }
    ] },
    { group: t('Prediction texts', 'ข้อความคำทำนาย'), items: [
      { name: t('Starting texts for topics 1–10', 'ข้อความตั้งต้นหัวข้อ 1–10'), detail: t('Written for Kaitianming in our own words, drawing on common traditions described by these sources; the site owner edits them in the admin', 'เรียบเรียงใหม่สำหรับ Kaitianming โดยอิงความหมายตามตำราที่แพร่หลายจากแหล่งเหล่านี้ และเจ้าของเว็บไซต์แก้ไขได้ในระบบหลังบ้าน'), links: [] },
      { name: t('Number meanings', 'ความหมายของตัวเลข'), detail: 'Numerologist.com', links: [{ label: 'numerologist.com', url: 'https://numerologist.com/meanings/numbers-1-to-9' }] },
      { name: t('Zodiac sign traits', 'ลักษณะ 12 ราศี'), detail: 'Sanook Horoscope', links: [{ label: 'sanook.com', url: 'https://www.sanook.com/horoscope/18585/' }] },
      { name: t('Chinese zodiac traits', 'ลักษณะ 12 นักษัตร'), detail: 'Sanook Horoscope', links: [{ label: 'sanook.com', url: 'https://www.sanook.com/horoscope/57497/' }] },
      { name: t('Chinese zodiac relations and Ben Ming Nian', 'คู่มิตร สามประสาน คู่ปะทะ คู่ขัด และปีชง'), detail: 'ChineseNewYear.net', links: [{ label: t('Compatibility', 'ความเข้ากัน'), url: 'https://chinesenewyear.net/zodiac/compatibility' }, { label: 'Ben Ming Nian', url: 'https://chinesenewyear.net/zodiac/ben-ming-nian' }] },
      { name: t('Aspects between signs', 'มุมสัมพันธ์ระหว่างราศี'), detail: "The Old Farmer's Almanac", links: [{ label: 'almanac.com', url: 'https://www.almanac.com/what-do-aspects-mean-astrology' }] },
      { name: t('Planet transits', 'ความหมายของดาวจร'), detail: 'Astrostyle; Cafe Astrology', links: [{ label: 'astrostyle.com', url: 'https://astrostyle.com/learn-astrology/transiting-planets/' }, { label: 'cafeastrology.com', url: 'https://cafeastrology.com/transits.html' }] },
      { name: t('Constellation lore', 'ตำนานกลุ่มดาว'), detail: t('Figures and classical myths of the 88 IAU constellations', 'รูปและตำนานคลาสสิกของ 88 กลุ่มดาวตาม IAU'), links: [{ label: 'IAU', url: 'https://www.iau.org/public/themes/constellations/' }] }
    ] }
  ]
}
