# Topics 4–6: a moving planet comes over a birth planet. General text per moving planet, plus
# key pairs for the slower planets. Original wording, drawing on astrostyle.com and cafeastrology.com.

T = {}

T["transit.none"] = {
 "th": "ช่วงนี้ไม่มีดาวจรเข้ามาทับดาวกำเนิดของคุณ ดวงจึงค่อนข้างนิ่ง ไม่มีแรงกระตุ้นหรือแรงกดดันจากฟ้าเป็นพิเศษ เป็นช่วงที่ดีสำหรับการทำสิ่งที่วางแผนไว้อย่างต่อเนื่อง ดูแลเรื่องเดิมให้เรียบร้อย และพักฟื้นพลัง",
 "en": "No moving planet is crossing your birth planets right now, so things are fairly calm, with no special push or pressure from the sky. A good time to keep working steadily on your plans, tidy up what is already in motion, and recharge."}

GENERAL = {
 "Sun": ("อาทิตย์จรมาทับดาวกำเนิด ทำให้เรื่องนั้นเป็นจุดสนใจและได้รับพลังเพิ่ม ความมั่นใจสูงขึ้น เหมาะกับการแสดงตัวและเริ่มต้นสิ่งใหม่ ผลกระทบสั้นๆ ไม่กี่วัน",
         "The Sun crossing a birth planet puts that part of life in the spotlight and boosts it. Confidence rises, a good moment to step forward and start something. The effect lasts a few days."),
 "Moon": ("จันทร์จรมาทับดาวกำเนิด ส่งผลต่ออารมณ์และความรู้สึกในวันนั้น คุณอาจอ่อนไหวหรือมีสัญชาตญาณดีเป็นพิเศษ ฟังเสียงใจตัวเองให้ดี ผลกระทบสั้นราว 1–2 วัน",
          "The Moon crossing a birth planet colours your mood and feelings for the day. You may feel more sensitive or unusually intuitive; listen to yourself. The effect lasts a day or two."),
 "Mercury": ("พุธจรมาทับดาวกำเนิด เรื่องการติดต่อสื่อสาร เอกสาร การเรียน และการเดินทางระยะสั้นจะคึกคัก เหมาะกับการเจรจาและเขียนงาน ตรวจทานรายละเอียดให้ดี",
             "Mercury crossing a birth planet brings activity in communication, paperwork, study and short trips. Good for negotiating and writing; double-check the details."),
 "Venus": ("ศุกร์จรมาทับดาวกำเนิด ความรัก ความสัมพันธ์ ความสวยงาม และเรื่องเงินได้รับพลังดี มีเสน่ห์มากขึ้น เหมาะกับการพบปะ ขอความช่วยเหลือ หรือซื้อของที่ตั้งใจไว้",
           "Venus crossing a birth planet favours love, relationships, beauty and money. Your charm rises; a good time to meet people, ask for help or buy something you've wanted."),
 "Mars": ("อังคารจรมาทับดาวกำเนิด ให้พลัง ความกล้า และแรงขับเคลื่อน งานที่ค้างจะเดินหน้าได้เร็ว แต่ก็ใจร้อนและปะทะง่าย ระวังอุบัติเหตุและการโต้เถียง",
          "Mars crossing a birth planet brings energy, courage and drive; stalled work moves fast. But tempers run short and clashes come easily; watch for accidents and arguments."),
 "Jupiter": ("พฤหัสบดีจรมาทับดาวกำเนิด เป็นสัญญาณของโชค การขยายตัว และโอกาสใหม่ ผู้ใหญ่ให้การสนับสนุน เหมาะกับการเรียนต่อ เดินทาง หรือขยายงาน ระวังการใช้จ่ายเกินตัวเพราะมองโลกในแง่ดีเกินไป",
             "Jupiter crossing a birth planet signals luck, growth and new opportunities, with support from mentors. Good for study, travel or expanding your work; avoid overspending out of too much optimism."),
 "Saturn": ("เสาร์จรมาทับดาวกำเนิด เป็นช่วงแห่งบททดสอบ ความรับผิดชอบเพิ่มขึ้น สิ่งที่ไม่มั่นคงจะถูกเปิดเผย ต้องใช้ความอดทนและวินัย แต่สิ่งที่สร้างในช่วงนี้จะแข็งแรงและอยู่ได้นาน",
            "Saturn crossing a birth planet is a time of testing. Responsibilities grow and anything unstable is exposed. It takes patience and discipline, but what you build now will be strong and lasting."),
 "Uranus": ("มฤตยูจรมาทับดาวกำเนิด นำความเปลี่ยนแปลงแบบฉับพลันและไม่คาดคิด อาจเป็นโอกาสใหม่หรือการหลุดออกจากกรอบเดิม เปิดใจรับสิ่งใหม่ แต่อย่ารีบตัดสินใจเรื่องใหญ่โดยไม่ไตร่ตรอง",
            "Uranus crossing a birth planet brings sudden, unexpected change: a new opening or a break from old patterns. Be open to the new, but don't rush big decisions without thought."),
}
for p, (th, en) in GENERAL.items():
    T[f"transit.{p}"] = {"th": th, "en": en}

PAIRS = {
 ("Mars", "Sun"): ("อังคารจรทับอาทิตย์กำเนิด พลังและความมุ่งมั่นพุ่งสูง เหมาะกับการเริ่มโครงการหรือออกกำลังกาย แต่อาจปะทะกับผู้มีอำนาจได้ง่าย",
                   "Mars over your birth Sun: energy and determination surge, good for launching projects or exercise, but clashes with people in authority come easily."),
 ("Mars", "Moon"): ("อังคารจรทับจันทร์กำเนิด อารมณ์ร้อนและหงุดหงิดง่าย โดยเฉพาะกับคนในบ้าน ใช้พลังนี้จัดการเรื่องบ้านที่ค้างไว้แทนการทะเลาะ",
                    "Mars over your birth Moon: feelings run hot and irritable, especially at home. Put the energy into overdue household tasks instead of quarrels."),
 ("Mars", "Mercury"): ("อังคารจรทับพุธกำเนิด ความคิดเร็วและพูดตรง เหมาะกับการเจรจาที่ต้องใช้ความเด็ดขาด แต่ระวังคำพูดแรงและการเซ็นเอกสารด้วยความรีบ",
                       "Mars over your birth Mercury: quick thinking and blunt speech, good for decisive negotiation, but watch harsh words and signing papers in a hurry."),
 ("Mars", "Venus"): ("อังคารจรทับศุกร์กำเนิด ความรักและแรงดึงดูดร้อนแรง เหมาะกับการเปิดใจหรือเริ่มความสัมพันธ์ ระวังการใช้จ่ายตามอารมณ์",
                     "Mars over your birth Venus: love and attraction run hot, good for opening your heart or starting a relationship. Watch impulsive spending."),
 ("Jupiter", "Sun"): ("พฤหัสบดีจรทับอาทิตย์กำเนิด หนึ่งในช่วงเวลาที่ดีที่สุดในรอบ 12 ปี ความมั่นใจ ชื่อเสียง และโอกาสก้าวหน้าเปิดกว้าง เหมาะกับการขอเลื่อนตำแหน่งหรือเริ่มต้นสิ่งใหญ่",
                      "Jupiter over your birth Sun: one of the best times in a 12-year cycle. Confidence, reputation and chances to advance open wide; good for asking for promotion or starting something big."),
 ("Jupiter", "Moon"): ("พฤหัสบดีจรทับจันทร์กำเนิด จิตใจเบิกบาน ครอบครัวมีความสุข อาจมีเรื่องดีเกี่ยวกับบ้านหรือที่อยู่อาศัย มีคนเอ็นดูและช่วยเหลือ",
                       "Jupiter over your birth Moon: a happy heart and a happy home, perhaps good news about where you live, and people who care for and help you."),
 ("Jupiter", "Mercury"): ("พฤหัสบดีจรทับพุธกำเนิด ความคิดกว้างไกล เหมาะกับการเรียน สอบ เขียน เจรจาธุรกิจ และทำสัญญา ข่าวดีมาทางการติดต่อสื่อสาร",
                          "Jupiter over your birth Mercury: broad thinking, good for study, exams, writing, business talks and contracts. Good news comes through communication."),
 ("Jupiter", "Venus"): ("พฤหัสบดีจรทับศุกร์กำเนิด ความรักและการเงินรุ่งเรือง คนโสดมีโอกาสพบคนที่ใช่ คนมีคู่ความสัมพันธ์อบอุ่นขึ้น รายได้หรือของขวัญเข้ามา",
                        "Jupiter over your birth Venus: love and money flourish. Singles may meet someone right, couples grow warmer, and income or gifts arrive."),
 ("Saturn", "Sun"): ("เสาร์จรทับอาทิตย์กำเนิด ช่วงที่ต้องพิสูจน์ตัวเอง งานหนักขึ้นและอาจรู้สึกเหนื่อยหรือถูกจำกัด แต่ความพยายามตอนนี้วางรากฐานให้ความสำเร็จระยะยาว ดูแลสุขภาพให้ดี",
                     "Saturn over your birth Sun: a time to prove yourself. Work gets heavier and you may feel tired or held back, but effort now lays the foundation for long-term success. Look after your health."),
 ("Saturn", "Moon"): ("เสาร์จรทับจันทร์กำเนิด จิตใจอาจหนักและเหงา มีภาระครอบครัวเพิ่ม ให้เวลากับตัวเอง ระบายกับคนที่ไว้ใจ ช่วงนี้จะผ่านไปและทำให้ใจแข็งแรงขึ้น",
                      "Saturn over your birth Moon: the heart may feel heavy or lonely and family duties increase. Give yourself time and talk to someone you trust; this passes and leaves you stronger."),
 ("Saturn", "Mercury"): ("เสาร์จรทับพุธกำเนิด ความคิดจริงจังและรอบคอบ เหมาะกับงานที่ต้องการความละเอียดและการวางแผน แต่การสื่อสารอาจติดขัดหรือเอกสารล่าช้า",
                         "Saturn over your birth Mercury: serious, careful thinking, good for detailed work and planning, though communication may stall or paperwork run late."),
 ("Saturn", "Venus"): ("เสาร์จรทับศุกร์กำเนิด ความรักถูกทดสอบ ความสัมพันธ์ที่ไม่มั่นคงอาจจบลง ส่วนความสัมพันธ์ที่แท้จริงจะยิ่งแน่นแฟ้น ระวังเรื่องการเงินและการใช้จ่าย",
                       "Saturn over your birth Venus: love is tested. Unstable relationships may end while true ones grow firmer. Be careful with money and spending."),
 ("Uranus", "Sun"): ("มฤตยูจรทับอาทิตย์กำเนิด ช่วงแห่งการปฏิวัติตัวเอง อยากเป็นอิสระและเปลี่ยนทิศทางชีวิต อาจเปลี่ยนงานหรือภาพลักษณ์แบบไม่มีใครคาดคิด",
                     "Uranus over your birth Sun: a time of personal revolution. You crave freedom and a new direction, and may change job or image in ways no one expects."),
 ("Uranus", "Moon"): ("มฤตยูจรทับจันทร์กำเนิด อารมณ์ขึ้นลงเร็ว มีการเปลี่ยนแปลงเรื่องบ้าน ที่อยู่ หรือครอบครัวแบบกะทันหัน ยืดหยุ่นและหาความมั่นคงจากภายใน",
                      "Uranus over your birth Moon: quick mood changes and sudden shifts at home or in the family. Stay flexible and find stability within."),
 ("Uranus", "Mercury"): ("มฤตยูจรทับพุธกำเนิด ไอเดียใหม่ผุดขึ้นเร็ว เหมาะกับการเรียนรู้เทคโนโลยีหรือเรื่องแปลกใหม่ ข่าวที่ไม่คาดคิดอาจเปลี่ยนแผน",
                         "Uranus over your birth Mercury: new ideas arrive fast, good for learning technology or something unusual. Unexpected news may change your plans."),
 ("Uranus", "Venus"): ("มฤตยูจรทับศุกร์กำเนิด ความรักแบบไม่คาดฝัน อาจพบคนที่แตกต่างจากที่เคยรู้จัก หรือความสัมพันธ์เดิมต้องการอิสระมากขึ้น ระวังการเงินที่ผันผวน",
                       "Uranus over your birth Venus: unexpected love, perhaps someone unlike anyone you've known, or an existing relationship needing more freedom. Beware of volatile finances."),
}
for (t, n), (th, en) in PAIRS.items():
    T[f"transit.{t}-{n}"] = {"th": th, "en": en}
