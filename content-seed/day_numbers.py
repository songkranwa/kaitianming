# Topics 1–3 (part): birth number, birth number vs year power, bright/dark.
# Original wording, drawing on common numerology themes (numerologist.com and Thai numerology articles).

T = {}

DAY = {
 0: ("เลข 0 คือความว่างที่พร้อมจะเติมเต็ม คุณเป็นคนที่ไม่ยึดติดกับกรอบเดิม มองเห็นความเป็นไปได้ที่คนอื่นมองข้าม และปรับตัวเข้ากับสถานการณ์ใหม่ได้ดี ชีวิตมักมีจุดเปลี่ยนที่ทำให้ต้องเริ่มต้นใหม่หลายครั้ง และทุกครั้งคุณจะกลับมาแข็งแรงกว่าเดิม\n\nข้อควรระวัง: บางช่วงอาจรู้สึกไม่แน่ใจในตัวเองหรือไม่รู้ว่าจะไปทางไหน การมีเป้าหมายชัดเจนสักหนึ่งอย่างจะช่วยให้พลังของคุณไม่กระจัดกระจาย",
     "Zero is an empty space ready to be filled. You are not bound by old patterns, you see possibilities others miss, and you adapt well to new situations. Life tends to bring turning points that make you start again, and each time you come back stronger.\n\nWatch out for: periods of self-doubt or not knowing which way to go. One clear goal keeps your energy from scattering."),
 1: ("เลข 1 คือผู้นำและผู้บุกเบิก คุณมีความมั่นใจ กล้าคิดกล้าทำ ชอบเริ่มต้นสิ่งใหม่ และมักไม่ชอบรอให้ใครมาบอกว่าต้องทำอะไร เหมาะกับงานที่ได้ตัดสินใจเองหรือได้ริเริ่มโครงการ\n\nข้อควรระวัง: ความมุ่งมั่นอาจกลายเป็นความดื้อหรืออยากควบคุมทุกอย่าง การฟังคนรอบข้างจะทำให้คุณเป็นผู้นำที่คนอยากเดินตาม",
     "One is the leader and pioneer. You are confident, bold, and love to start new things, and you rarely wait for someone to tell you what to do. Work where you make the decisions or launch projects suits you.\n\nWatch out for: determination turning into stubbornness or a need to control everything. Listening to the people around you makes you a leader others want to follow."),
 2: ("เลข 2 คือความอ่อนโยนและการประสานงาน คุณอ่านใจคนเก่ง เข้าใจความรู้สึกผู้อื่น และเป็นคนกลางที่ช่วยให้ทุกฝ่ายเข้ากันได้ ความสัมพันธ์และการทำงานเป็นทีมคือจุดแข็งของคุณ\n\nข้อควรระวัง: ความอ่อนไหวอาจทำให้เก็บเรื่องเล็กมาคิดมากหรือไม่กล้าพูดสิ่งที่ต้องการ ลองบอกความรู้สึกออกไปตรงๆ บ้าง",
     "Two is gentleness and cooperation. You read people well, sense how others feel, and act as the bridge that helps everyone get along. Relationships and teamwork are your strengths.\n\nWatch out for: sensitivity that makes you dwell on small things or hold back what you want. Try saying how you feel more directly."),
 3: ("เลข 3 คือความคิดสร้างสรรค์และการแสดงออก คุณร่าเริง มีอารมณ์ขัน พูดเก่ง มีจินตนาการ และทำให้บรรยากาศรอบตัวสดใส งานด้านศิลปะ การสื่อสาร หรือการพบปะผู้คนเหมาะกับคุณ\n\nข้อควรระวัง: ความสนใจที่หลากหลายอาจทำให้ทำหลายอย่างแต่ไม่จบสักอย่าง การเลือกโฟกัสจะทำให้พรสวรรค์ของคุณออกผลเต็มที่",
     "Three is creativity and expression. You are cheerful, witty, articulate and imaginative, and you brighten the mood around you. Art, communication and work with people suit you.\n\nWatch out for: many interests that leave things half-finished. Choosing a focus lets your talents bear full fruit."),
 4: ("เลข 4 คือความมั่นคงและระเบียบ คุณเป็นคนจริงจัง ขยัน อดทน ทำงานเป็นขั้นตอน และสร้างผลงานที่อยู่ได้นาน คนรอบข้างไว้ใจคุณเพราะพูดแล้วทำจริง\n\nข้อควรระวัง: ความรอบคอบอาจกลายเป็นความเข้มงวดหรือไม่ยอมเปลี่ยนแปลง การเปิดรับวิธีใหม่ๆ บ้างจะช่วยให้งานเดินเร็วขึ้น",
     "Four is stability and order. You are serious, hardworking and patient, you work step by step, and what you build lasts. People trust you because you do what you say.\n\nWatch out for: carefulness turning into rigidity or resistance to change. Being open to new ways speeds things up."),
 5: ("เลข 5 คืออิสระและการเปลี่ยนแปลง คุณช่างสงสัย ชอบเรียนรู้ ชอบเดินทาง ปรับตัวเร็ว และมีเสน่ห์ในการพูดคุย ชีวิตที่มีความหลากหลายทำให้คุณมีพลัง\n\nข้อควรระวัง: ความเบื่อง่ายอาจทำให้เปลี่ยนงานหรือเป้าหมายบ่อยเกินไป การวางแผนการเงินและทำสิ่งที่เริ่มไว้ให้เสร็จจะทำให้อิสรภาพของคุณมั่นคง",
     "Five is freedom and change. You are curious, love learning and travel, adapt quickly, and are charming to talk to. Variety in life gives you energy.\n\nWatch out for: getting bored and changing jobs or goals too often. Planning your money and finishing what you start keeps your freedom secure."),
 6: ("เลข 6 คือความรักและความรับผิดชอบ คุณใส่ใจครอบครัวและคนใกล้ชิด ชอบดูแลผู้อื่น รักความสวยงามและความกลมกลืน เป็นที่พึ่งของคนรอบข้างได้เสมอ\n\nข้อควรระวัง: การให้มากเกินไปจนลืมดูแลตัวเองอาจทำให้เหนื่อยหรือน้อยใจ อย่าลืมว่าตัวคุณก็สมควรได้รับการดูแลเช่นกัน",
     "Six is love and responsibility. You care deeply for family and those close to you, enjoy looking after others, and love beauty and harmony. People can always lean on you.\n\nWatch out for: giving so much that you forget yourself, which can lead to exhaustion or resentment. You deserve care too."),
 7: ("เลข 7 คือปัญญาและการใคร่ครวญ คุณช่างสังเกต คิดลึก ชอบหาความจริงเบื้องหลังสิ่งต่างๆ และสนใจเรื่องจิตใจหรือความรู้เฉพาะทาง งานวิจัย การวิเคราะห์ หรือที่ต้องใช้ความเชี่ยวชาญเหมาะกับคุณ\n\nข้อควรระวัง: การเก็บตัวหรือคาดหวังให้คนอื่นเข้าใจโดยไม่อธิบาย อาจทำให้รู้สึกโดดเดี่ยว ลองเปิดใจให้คนที่ไว้ใจได้บ้าง",
     "Seven is wisdom and reflection. You are observant, think deeply, look for the truth behind things, and are drawn to the inner life or specialist knowledge. Research, analysis and expert work suit you.\n\nWatch out for: withdrawing, or expecting others to understand you without explanation, which can feel lonely. Let trusted people in."),
 8: ("เลข 8 คืออำนาจและความสำเร็จทางวัตถุ คุณมีความสามารถในการบริหาร จัดการเงินและทรัพยากรเก่ง มีความทะเยอทะยาน และกล้าตัดสินใจเรื่องใหญ่ มีโอกาสสร้างฐานะได้ด้วยตัวเอง\n\nข้อควรระวัง: การยึดติดกับสถานะหรือการควบคุม และการตัดสินใจเรื่องเงินอย่างใจร้อน ความสมดุลระหว่างงานกับชีวิตจะทำให้ความสำเร็จยั่งยืน",
     "Eight is power and material success. You manage well, handle money and resources skilfully, are ambitious, and dare to make big decisions. You can build your own wealth.\n\nWatch out for: fixation on status or control, and hasty money decisions. Balancing work and life makes success last."),
 9: ("เลข 9 คือความเมตตาและความสมบูรณ์ คุณใจกว้าง มองโลกกว้าง เห็นอกเห็นใจผู้อื่น และอยากทำสิ่งที่เป็นประโยชน์ต่อส่วนรวม มีความรู้รอบตัวและเป็นที่ปรึกษาที่ดี\n\nข้อควรระวัง: การให้จนตัวเองเหนื่อยหรือรับความช่วยเหลือจากคนอื่นไม่เป็น และอารมณ์ที่ขึ้นลง การรู้จักปล่อยวางเรื่องที่จบไปแล้วจะทำให้ใจเบา",
     "Nine is compassion and completion. You are generous, see the big picture, empathise with others, and want to do good for the wider world. You know a lot and give good advice.\n\nWatch out for: giving until you are drained, finding it hard to accept help, and mood swings. Letting go of what is finished lightens your heart."),
}
for n, (th, en) in DAY.items():
    T[f"day.{n}"] = {"th": th, "en": en}

DIFF = {
 0: ("เลขวันเกิดของคุณตรงกับกำลังปี ปีนี้จึงเป็นปีที่จังหวะชีวิตของคุณสอดคล้องกับพลังของปีพอดี สิ่งที่ตั้งใจทำมีแรงหนุนเต็มที่ เหมาะกับการลงมือทำเรื่องที่รอมานาน\n\nข้อควรระวัง: เมื่อพลังซ้ำกัน ทั้งจุดเด่นและจุดด้อยจะชัดขึ้นเป็นสองเท่า ระวังทำอะไรเกินตัว",
     "Your birth number matches this year's power, so the rhythm of your life is in step with the year. What you set out to do gets full support, which makes it a good time to act on plans you have been holding.\n\nWatch out for: with the same energy doubled, both strengths and weaknesses show twice as clearly. Don't overreach."),
 1: ("เลขวันเกิดกับกำลังปีต่างกันเพียง 1 ปีนี้เดินไปในทิศทางที่ใกล้กับธรรมชาติของคุณ การเปลี่ยนแปลงเกิดขึ้นทีละน้อยอย่างราบรื่น เหมาะกับการพัฒนาต่อยอดสิ่งที่มีอยู่",
     "Your birth number and the year's power differ by only 1. The year moves close to your nature, change comes smoothly a little at a time, and it suits building on what you already have."),
 2: ("เลขวันเกิดกับกำลังปีต่างกัน 2 ปีนี้มีโอกาสเข้ามาจากความร่วมมือและคนรอบข้าง การทำงานเป็นทีมหรือมีหุ้นส่วนจะช่วยให้ไปได้ไกลกว่าทำคนเดียว",
     "Your birth number and the year's power differ by 2. Opportunities this year come through cooperation and the people around you; working with a team or partner takes you further than going alone."),
 3: ("เลขวันเกิดกับกำลังปีต่างกัน 3 ปีนี้เปิดทางให้ความคิดใหม่และการแสดงออก เป็นช่วงที่ดีสำหรับการเรียนรู้ ทดลอง และสื่อสารสิ่งที่คุณมีให้คนอื่นเห็น",
     "Your birth number and the year's power differ by 3. The year opens the way for new ideas and self-expression, a good time to learn, experiment, and show people what you have."),
 4: ("เลขวันเกิดกับกำลังปีต่างกัน 4 ปีนี้ต้องใช้ความอดทนและการวางแผน สิ่งต่างๆ อาจช้ากว่าที่หวัง แต่ถ้าค่อยๆ สร้างฐานให้มั่นคง ผลจะอยู่ได้นาน",
     "Your birth number and the year's power differ by 4. This year asks for patience and planning; things may move slower than you hope, but a solid foundation built now will last."),
 5: ("เลขวันเกิดกับกำลังปีต่างกัน 5 ปีนี้เป็นปีแห่งการเปลี่ยนแปลง อาจมีการย้ายที่ เปลี่ยนงาน หรือเจอสถานการณ์ใหม่ ความยืดหยุ่นคือกุญแจสำคัญ อย่าตัดสินใจเรื่องใหญ่ด้วยอารมณ์",
     "Your birth number and the year's power differ by 5. This is a year of change: a move, a new job or unfamiliar situations. Flexibility is the key; don't make big decisions on impulse."),
 6: ("เลขวันเกิดกับกำลังปีต่างกัน 6 ปีนี้เรื่องครอบครัว ความรัก และความรับผิดชอบจะเด่นขึ้น อาจมีภาระเพิ่ม แต่ก็เป็นโอกาสให้ความสัมพันธ์แน่นแฟ้นขึ้น",
     "Your birth number and the year's power differ by 6. Family, love and responsibility come to the fore. You may carry more, but it is also a chance for relationships to grow closer."),
 7: ("เลขวันเกิดกับกำลังปีต่างกัน 7 ปีนี้เหมาะกับการทบทวนตัวเองมากกว่าการเร่งก้าวไปข้างหน้า ใช้เวลาศึกษา หาความรู้ และฟังเสียงภายใน คำตอบที่ได้จะชี้ทางให้ปีต่อไป",
     "Your birth number and the year's power differ by 7. The year favours reflection over pushing ahead. Study, learn and listen to yourself; the answers will point the way for next year."),
 8: ("เลขวันเกิดกับกำลังปีต่างกันมาก (8) ปีนี้พลังของปีต่างจากธรรมชาติของคุณ อาจต้องปรับตัวหลายเรื่อง แต่ก็เป็นโอกาสให้ได้ลองบทบาทใหม่ ระวังเรื่องการเงินและการลงทุนที่เสี่ยง",
     "Your birth number and the year's power differ widely (8). The year's energy is unlike your nature, so you may need to adjust in many ways, but it is also a chance to try a new role. Be careful with money and risky investments."),
 9: ("เลขวันเกิดกับกำลังปีอยู่คนละขั้ว (ต่างกัน 9) ปีนี้เป็นช่วงปิดฉากเรื่องเก่าเพื่อเริ่มต้นใหม่ สิ่งที่ไม่ใช่ของคุณจะค่อยๆ หลุดออกไป ปล่อยวางแล้วเตรียมพื้นที่ให้สิ่งใหม่",
     "Your birth number and the year's power are at opposite ends (a difference of 9). This year closes old chapters to make room for new beginnings; what isn't yours will fall away. Let go and make space for what comes next."),
}
for n, (th, en) in DIFF.items():
    T[f"dayYear.diff.{n}"] = {"th": th, "en": en}

BRIGHT = {
 0: ("ราศีเกิดของคุณสว่าง ไม่มีดาวใหญ่บัง ชีวิตมีทางที่เปิดกว้าง ความสามารถของคุณเป็นที่มองเห็นได้ง่าย และมักมีคนคอยสนับสนุนเมื่อถึงเวลาสำคัญ",
     "Your birth sign is bright, with no major body covering it. Your path is open, your abilities are easy for others to see, and support tends to arrive when it matters."),
 1: ("ราศีเกิดของคุณมืดเล็กน้อย มีดาวใหญ่บังอยู่บ้าง ความสำเร็จมาได้แต่ต้องออกแรงมากกว่าคนอื่นนิดหน่อย บางเรื่องอาจต้องพิสูจน์ตัวเองก่อนจึงจะได้รับการยอมรับ",
     "Your birth sign is slightly dark, partly covered by a major body. Success comes, but with a little more effort than others; sometimes you must prove yourself before you are recognised."),
 2: ("ราศีเกิดของคุณมืด มีดาวใหญ่บังหลายดวง ชีวิตช่วงแรกอาจต้องเจอบททดสอบและอุปสรรค แต่ประสบการณ์เหล่านี้หล่อหลอมให้คุณแข็งแกร่งและรู้จักพึ่งตัวเอง",
     "Your birth sign is dark, covered by several major bodies. Early life may bring tests and obstacles, but these experiences make you strong and self-reliant."),
 3: ("ราศีเกิดของคุณมืดมาก มีดาวใหญ่บังอยู่หนาแน่น เส้นทางของคุณไม่ใช่ทางเรียบ แต่คนที่ผ่านความมืดมาได้มักมีความลึกซึ้งและความอดทนเหนือคนทั่วไป ความสำเร็จของคุณจะมาจากความพยายามของตัวเองล้วนๆ",
     "Your birth sign is very dark, heavily covered by major bodies. Your road is not smooth, but people who come through the dark often gain unusual depth and endurance; your success will be entirely your own work."),
}
for n, (th, en) in BRIGHT.items():
    T[f"sky.bright.{n}"] = {"th": th, "en": en}
