import type { Lang } from './types'

export interface ReadingCard { title: string; body: string; icon: string }

export function readings(lang: Lang): ReadingCard[] {
  const th = lang === 'th'
  return [
    { title: th ? 'ดาวประจำตัว' : 'Your personal star', body: th ? 'ดาวที่อยู่ตรงเหนือศีรษะ ณ ที่และวันที่คุณเกิด' : 'The star directly overhead where and when you were born', icon: 'M12 3l2.6 5.6L20 9.4l-4 4.1L17 19l-5-2.8L7 19l1-5.5-4-4.1 5.4-.8z' },
    { title: th ? 'แผ่นฟากฟ้า' : 'Your sky map', body: th ? 'ตำแหน่งดาวทุกดวงบนท้องฟ้า โดยมีจุดเหนือศีรษะเป็นศูนย์กลาง' : 'Every star and planet placed around the point overhead', icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 3v18M3 12h18' },
    { title: th ? 'ดาวใหญ่และการทับซ้อน' : 'Planets and overlaps', body: th ? 'ดาวใหญ่แต่ละดวงอยู่ในกลุ่มดาวใด และดวงใดอยู่ชิดกัน' : 'Which constellation each planet sits in, and which ones crowd together', icon: 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 12h2M19 12h2' },
    { title: th ? 'สว่างหรือมืด' : 'Bright or dark', body: th ? 'ราศีเกิดของคุณมีดาวใหญ่บังอยู่หรือไม่' : 'Whether major bodies cover your birth sign', icon: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8' },
    { title: th ? 'กำลังวันและกำลังปี' : 'Day and year power', body: th ? 'ตัวเลขจากวันเกิด เทียบกับปีปัจจุบันและปีหน้า' : 'Numbers from your birth date, compared with this year and next', icon: 'M5 9h14M5 15h14M10 4L8 20M16 4l-2 16' },
    { title: th ? 'ดวงจันทร์และวันเกิด' : 'Moon and weekday', body: th ? 'ข้างขึ้นข้างแรม ดิถี และวันในสัปดาห์ที่คุณเกิด' : 'Moon phase, lunar day and the weekday you were born', icon: 'M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z' }
  ]
}
