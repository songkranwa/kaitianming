# Topics 7–10: Western sign, sign now vs birth sign, Chinese zodiac animal, this year's animal.
# Original wording, drawing on common traits (sanook.com horoscope articles, chinesenewyear.net, almanac.com).

T = {}

SIGN = [
 ("เมษ", "Aries",
  "ชาวราศีเมษเป็นคนกระตือรือร้น กล้าหาญ ชอบการแข่งขันและความท้าทาย ตัดสินใจเร็วและพร้อมเป็นคนแรกที่ลงมือ มีภาวะผู้นำตามธรรมชาติ พูดตรงไปตรงมา\n\nข้อควรระวัง: ใจร้อนและหุนหันพลันแล่น โกรธง่ายแต่ก็หายเร็ว การหยุดคิดสักนิดก่อนลงมือจะช่วยลดความผิดพลาด",
  "Aries are energetic, brave and competitive, thriving on challenge. You decide quickly, are ready to go first, lead naturally and speak plainly.\n\nWatch out for: impatience and impulsiveness; quick to anger but quick to forgive. A moment's pause before acting saves mistakes."),
 ("พฤษภ", "Taurus",
  "ชาวราศีพฤษภเป็นคนหนักแน่น อดทน มั่นคง ทำอะไรทำจริงและไม่ทิ้งกลางทาง รักความสะดวกสบาย ของดี อาหารอร่อย และบ้านที่อบอุ่น ซื่อสัตย์ต่อคนที่รัก รู้จักเก็บออม\n\nข้อควรระวัง: ความดื้อและการไม่ยอมเปลี่ยนแปลง บางครั้งการยอมปรับตัวจะพาไปเจอสิ่งที่ดีกว่า",
  "Taurus are steady, patient and dependable; you follow through and don't quit halfway. You love comfort, quality, good food and a warm home, stay loyal to those you love, and know how to save.\n\nWatch out for: stubbornness and resistance to change. Adapting sometimes leads somewhere better."),
 ("เมถุน", "Gemini",
  "ชาวราศีเมถุนเป็นคนช่างสงสัย คิดไว พูดเก่ง เข้าสังคมง่าย ปรับตัวเก่ง และมีเรื่องให้สนใจอยู่ตลอด เหมาะกับงานที่ใช้การสื่อสารและความคิดหลากหลาย\n\nข้อควรระวัง: เบื่อง่าย อารมณ์เปลี่ยนเร็ว และอาจทำอะไรไม่ต่อเนื่อง การเลือกเรื่องสำคัญมาทำให้จบจะสร้างความน่าเชื่อถือ",
  "Gemini are curious, quick-thinking, talkative and sociable; you adapt easily and always have something new to explore. Work built on communication and variety suits you.\n\nWatch out for: boredom, changing moods and inconsistency. Seeing important things through builds trust."),
 ("กรกฎ", "Cancer",
  "ชาวราศีกรกฎเป็นคนอ่อนไหว ใส่ใจ รักครอบครัวและคนใกล้ชิด ชอบปกป้องดูแลผู้อื่น ผูกพันกับความทรงจำและสิ่งของที่มีความหมาย มีสัญชาตญาณดี\n\nข้อควรระวัง: เก็บความรู้สึก น้อยใจง่าย และลังเลเมื่อต้องตัดสินใจ การพูดสิ่งที่รู้สึกออกมาจะทำให้คนรอบข้างเข้าใจคุณมากขึ้น",
  "Cancer are sensitive and caring, devoted to family and loved ones, protective of others, attached to memories and meaningful things, and strongly intuitive.\n\nWatch out for: bottling up feelings, getting hurt easily, and hesitating over decisions. Saying what you feel helps others understand you."),
 ("สิงห์", "Leo",
  "ชาวราศีสิงห์เป็นคนมั่นใจ ใจกว้าง มีศักดิ์ศรี ชอบเป็นจุดสนใจ และมีพลังดึงดูดผู้คน ให้ความสำคัญกับเกียรติและคำชม เป็นผู้นำที่อบอุ่นและปกป้องคนของตัวเอง\n\nข้อควรระวัง: ความถือตัว ดื้อ และอยากได้รับการยอมรับมากเกินไป การให้เครดิตผู้อื่นจะทำให้คุณยิ่งเปล่งประกาย",
  "Leos are confident, generous and dignified; you enjoy the spotlight and draw people in. Honour and praise matter to you, and you are a warm leader who protects your own.\n\nWatch out for: pride, stubbornness and needing too much recognition. Giving others credit makes you shine even more."),
 ("กันย์", "Virgo",
  "ชาวราศีกันย์เป็นคนละเอียด รอบคอบ เป็นระเบียบ ช่างสังเกต ถ่อมตัว และมีความจำดี ชอบทำสิ่งต่างๆ ให้ถูกต้องและมีประโยชน์ เป็นคนที่พึ่งพาได้ในงานที่ต้องการความแม่นยำ\n\nข้อควรระวัง: ความสมบูรณ์แบบที่อาจทำให้เครียดหรือวิจารณ์ตัวเองและคนอื่นมากเกินไป",
  "Virgos are meticulous, careful, orderly, observant and modest, with a good memory. You like things done right and done usefully, and people rely on you when precision matters.\n\nWatch out for: perfectionism that brings stress or too much criticism of yourself and others."),
 ("ตุลย์", "Libra",
  "ชาวราศีตุลย์เป็นคนมีเสน่ห์ สุภาพ ยุติธรรม รักความสวยงามและความสงบ เก่งเรื่องการเจรจาและประนีประนอม มีรสนิยมทางศิลปะ\n\nข้อควรระวัง: ลังเลตัดสินใจไม่ได้และหลีกเลี่ยงความขัดแย้งจนไม่พูดสิ่งที่คิด การยืนหยัดในจุดยืนของตัวเองก็เป็นความยุติธรรมอย่างหนึ่ง",
  "Libras are charming, polite and fair, love beauty and peace, and are skilled at negotiation and compromise, with an artistic eye.\n\nWatch out for: indecision and avoiding conflict so much that you don't say what you think. Standing your ground is a kind of fairness too."),
 ("พิจิก", "Scorpio",
  "ชาวราศีพิจิกเป็นคนลึกซึ้ง เข้มข้น มุ่งมั่น มองคนออก ทำอะไรทำจริงและทุ่มสุดตัว ซื่อสัตย์และปกป้องคนที่รักอย่างเต็มที่\n\nข้อควรระวัง: อารมณ์รุนแรง ความหึงหวง และการจำความเจ็บได้นาน การให้อภัยจะปลดภาระในใจของคุณเอง",
  "Scorpios are deep, intense and determined; you read people well, commit fully, and protect those you love with total loyalty.\n\nWatch out for: strong emotions, jealousy and holding on to hurt. Forgiving frees your own heart."),
 ("ธนู", "Sagittarius",
  "ชาวราศีธนูเป็นคนมองโลกในแง่ดี ร่าเริง รักอิสระ ชอบเดินทาง ชอบเรียนรู้สิ่งใหม่ และพูดตรงไปตรงมา มีอารมณ์ขันและทำให้คนรอบข้างสบายใจ\n\nข้อควรระวัง: พูดตรงจนบางครั้งทำร้ายใจคนอื่นโดยไม่ตั้งใจ และไม่ชอบถูกผูกมัดด้วยกฎ",
  "Sagittarians are optimistic, cheerful and freedom-loving; you love travel and new knowledge, speak frankly, and put people at ease with your humour.\n\nWatch out for: bluntness that can hurt without meaning to, and dislike of rules and commitment."),
 ("มังกร", "Capricorn",
  "ชาวราศีมังกรเป็นคนมีความทะเยอทะยาน มีวินัย รับผิดชอบ จริงจัง และวางแผนระยะยาวเก่ง ค่อยๆ ไต่ไปถึงเป้าหมายอย่างมั่นคง ระมัดระวังเรื่องเงิน\n\nข้อควรระวัง: ทำงานหนักจนลืมพักผ่อน และดูเย็นชาในสายตาคนอื่น การให้เวลากับคนที่รักก็เป็นการลงทุนที่คุ้มค่า",
  "Capricorns are ambitious, disciplined, responsible and serious, good at long-term planning, climbing steadily to your goals and careful with money.\n\nWatch out for: working so hard you forget to rest, and seeming cold to others. Time with loved ones is a worthwhile investment too."),
 ("กุมภ์", "Aquarius",
  "ชาวราศีกุมภ์เป็นคนคิดนอกกรอบ มีไอเดียใหม่ รักอิสระ ใส่ใจสังคมและส่วนรวม เป็นตัวของตัวเองสูง และเป็นเพื่อนที่ดี\n\nข้อควรระวัง: เข้าใจยาก เก็บความรู้สึก และดื้อในความคิดของตัวเอง การเปิดใจรับฟังมุมมองอื่นจะทำให้ไอเดียของคุณยิ่งแข็งแรง",
  "Aquarians think outside the box, are full of new ideas, love independence, care about society, are very much themselves, and make good friends.\n\nWatch out for: being hard to read, hiding feelings, and clinging to your own ideas. Hearing other views makes your ideas stronger."),
 ("มีน", "Pisces",
  "ชาวราศีมีนเป็นคนอ่อนโยน เห็นอกเห็นใจผู้อื่น มีจินตนาการ มีศิลปะ โรแมนติก และมีสัญชาตญาณดี พร้อมช่วยเหลือคนที่ลำบาก\n\nข้อควรระวัง: อารมณ์ขึ้นลง ลังเล และหลีกเลี่ยงความจริงที่ไม่อยากเผชิญ การตั้งขอบเขตให้ตัวเองจะช่วยรักษาพลังใจ",
  "Pisceans are gentle, compassionate, imaginative, artistic, romantic and intuitive, always ready to help someone in need.\n\nWatch out for: mood swings, indecision and avoiding hard truths. Setting boundaries protects your energy."),
]
for i, (_, _, th, en) in enumerate(SIGN):
    T[f"sign.{i}"] = {"th": th, "en": en}

# Today's Sun sign compared with the birth sign: signs apart → classical aspect.
DIST = {
 0: ("ดวงอาทิตย์กำลังเดินผ่านราศีเกิดของคุณ ช่วงนี้คือ 'เดือนเกิด' ทางโหราศาสตร์ พลังชีวิตและความมั่นใจสูงสุดในรอบปี เหมาะกับการตั้งเป้าหมายใหม่และเริ่มต้นสิ่งที่ตั้งใจ",
     "The Sun is passing through your birth sign: your astrological birthday month. Vitality and confidence peak for the year, a good time to set new goals and begin what you have planned."),
 1: ("ดวงอาทิตย์อยู่ถัดจากราศีเกิดของคุณไป 1 ราศี ช่วงนี้เป็นจังหวะของการเก็บเกี่ยวและจัดการเรื่องเงินทองและทรัพย์สิน เหมาะกับการวางแผนการเงิน",
     "The Sun is one sign past your birth sign. This is a time to gather and to manage money and possessions; good for financial planning."),
 2: ("ดวงอาทิตย์ทำมุมหนุน (เซ็กซ์ไทล์) กับราศีเกิด ช่วงนี้มีโอกาสดีจากการติดต่อสื่อสาร เพื่อนฝูง และการเรียนรู้ ลองเปิดรับข้อเสนอใหม่ๆ",
     "The Sun makes a supportive sextile to your birth sign. Opportunities come through conversations, friends and learning; be open to new offers."),
 3: ("ดวงอาทิตย์ทำมุมฉาก (สแควร์) กับราศีเกิด ช่วงนี้อาจเจอแรงเสียดทานหรือความตึงเครียด โดยเฉพาะเรื่องบ้านและครอบครัว ใช้แรงกดดันนี้เป็นแรงผลักให้แก้ปัญหาที่ค้างอยู่",
     "The Sun squares your birth sign. Expect some friction or tension, especially around home and family; use the pressure to fix what has been left unresolved."),
 4: ("ดวงอาทิตย์ทำมุมตรีโกณ (ไทรน์) กับราศีเกิด เป็นช่วงที่ราบรื่นที่สุดช่วงหนึ่งของปี ความคิดสร้างสรรค์ ความรัก และความสนุกไหลมาง่าย อย่าปล่อยให้ความสบายทำให้พลาดโอกาส",
     "The Sun is in trine to your birth sign, one of the smoothest times of the year. Creativity, romance and fun come easily; don't let comfort make you miss the opportunity."),
 5: ("ดวงอาทิตย์ทำมุม 150° (ควินคันซ์) กับราศีเกิด ช่วงนี้ต้องปรับตัวกับเรื่องงานประจำวันและสุขภาพ สิ่งที่ดูไม่เข้ากันต้องหาทางประสาน ดูแลร่างกายให้ดี",
     "The Sun is quincunx your birth sign. Daily routines and health need adjustment, and things that don't fit together need reconciling. Look after your body."),
 6: ("ดวงอาทิตย์อยู่ตรงข้ามราศีเกิด (ออปโพซิชัน) ช่วงนี้เรื่องคู่ครอง หุ้นส่วน และคนอื่นจะเด่นขึ้นมา อาจมีความเห็นไม่ตรงกัน การหาจุดกึ่งกลางจะเปลี่ยนความขัดแย้งให้เป็นความร่วมมือ",
     "The Sun is opposite your birth sign. Partners, colleagues and other people take centre stage, and views may clash; finding middle ground turns conflict into cooperation."),
 7: ("ดวงอาทิตย์อยู่ห่างจากราศีเกิด 7 ราศี (มุม 150°) ช่วงนี้เป็นเรื่องของการแบ่งปันทรัพยากร หนี้สิน และความไว้ใจ ต้องปรับความคาดหวังให้ตรงกับความจริง",
     "The Sun is seven signs from your birth sign (150°). Shared resources, debts and trust come up; align your expectations with reality."),
 8: ("ดวงอาทิตย์ทำมุมตรีโกณกับราศีเกิดอีกครั้ง ช่วงนี้เหมาะกับการเดินทาง การเรียน และการขยายมุมมอง โชคเข้าข้างคนที่กล้าลองสิ่งใหม่",
     "The Sun is in trine to your birth sign again. Good for travel, study and broadening your outlook; luck favours those willing to try something new."),
 9: ("ดวงอาทิตย์ทำมุมฉากกับราศีเกิดอีกครั้ง ช่วงนี้เรื่องงานและชื่อเสียงจะถูกทดสอบ อาจมีความกดดันจากหัวหน้าหรือเป้าหมาย ความรับผิดชอบที่แสดงออกตอนนี้จะถูกจดจำ",
     "The Sun squares your birth sign again. Career and reputation are tested, perhaps with pressure from bosses or targets; responsibility shown now will be remembered."),
 10: ("ดวงอาทิตย์ทำมุมหนุนกับราศีเกิดอีกครั้ง ช่วงนี้เพื่อนและเครือข่ายสังคมนำโอกาสมาให้ เหมาะกับการทำงานกลุ่มและการวางเป้าหมายระยะยาว",
      "The Sun makes a sextile to your birth sign again. Friends and networks bring opportunities; good for group work and long-term goals."),
 11: ("ดวงอาทิตย์อยู่ก่อนราศีเกิดของคุณ 1 ราศี ช่วงนี้คือช่วงปลายรอบปีส่วนตัว เหมาะกับการพักผ่อน ทบทวน และปล่อยวางเรื่องเก่า เพื่อเตรียมพลังสำหรับรอบใหม่ที่กำลังจะมาถึง",
      "The Sun is in the sign just before yours, the end of your personal year. Rest, reflect and let go of old things to gather strength for the new cycle that is about to begin."),
}
for n, (th, en) in DIST.items():
    T[f"signNow.dist.{n}"] = {"th": th, "en": en}

ANIMAL = [
 ("ชวด", "Rat", "คนเกิดปีชวดฉลาด ไหวพริบดี ปรับตัวเก่ง ช่างพูดโน้มน้าวใจ มีความทะเยอทะยาน และรู้จักเก็บออม มักมองเห็นโอกาสก่อนคนอื่น\n\nข้อควรระวัง: เก็บความรู้สึก ขี้หึง และบางครั้งไว้ใจคนง่ายเกินไป",
  "People born in the Year of the Rat are clever, quick-witted, adaptable, persuasive, ambitious and thrifty, and often spot opportunities before anyone else.\n\nWatch out for: hiding feelings, jealousy, and sometimes trusting too easily."),
 ("ฉลู", "Ox", "คนเกิดปีฉลูสุขุม อดทน มั่นคง ซื่อสัตย์ รับผิดชอบ และรักครอบครัว ทำงานหนักโดยไม่บ่น ความสำเร็จมาจากความพากเพียรอย่างต่อเนื่อง\n\nข้อควรระวัง: ดื้อ ยึดติดกับวิธีเดิม และเพื่อนสนิทไม่มาก",
  "People born in the Year of the Ox are calm, patient, steady, honest, responsible and devoted to family. You work hard without complaint, and success comes from steady perseverance.\n\nWatch out for: stubbornness, sticking to old ways, and a small circle of close friends."),
 ("ขาล", "Tiger", "คนเกิดปีขาลมั่นใจ กล้าหาญ รักอิสระ ชอบผจญภัยและการแข่งขัน ตัดสินใจเร็ว ใจกว้าง และมีความคิดสร้างสรรค์\n\nข้อควรระวัง: ใจร้อน โมโหง่ายแต่ก็ให้อภัยเร็ว และหวงของหรือคนที่รัก",
  "People born in the Year of the Tiger are confident, brave, independent, adventurous and competitive, quick to decide, generous and creative.\n\nWatch out for: impatience, a quick temper (though you forgive quickly), and possessiveness."),
 ("เถาะ", "Rabbit", "คนเกิดปีเถาะฉลาด พูดจาดี อ่อนโยน มีรสนิยม รักสงบ และเข้าใจความรู้สึกผู้อื่น ช่างสังเกตและรอบคอบ\n\nข้อควรระวัง: จุกจิกในรายละเอียดและหลีกเลี่ยงการเผชิญหน้าจนเสียโอกาส",
  "People born in the Year of the Rabbit are smart, well-spoken, gentle, refined, peace-loving and empathetic, observant and careful.\n\nWatch out for: fussing over details and avoiding confrontation to the point of missing chances."),
 ("มะโรง", "Dragon", "คนเกิดปีมะโรงมีเสน่ห์ มั่นใจ ทะเยอทะยาน ฉลาด และเป็นผู้นำโดยธรรมชาติ เป็นที่รู้จักและชื่นชอบของคนรอบข้าง ทำอะไรมักทำให้ดีที่สุด\n\nข้อควรระวัง: ชอบควบคุม ยึดตัวเองเป็นศูนย์กลาง และอยากได้รับความสนใจตลอดเวลา",
  "People born in the Year of the Dragon are charismatic, confident, ambitious, intelligent natural leaders, well known and well liked, who aim to do everything as well as possible.\n\nWatch out for: being controlling, self-centred, and always wanting attention."),
 ("มะเส็ง", "Snake", "คนเกิดปีมะเส็งมีเสน่ห์ลึกลับ เฉียบแหลม มองโลกตามความจริง มุ่งมั่น และสัญชาตญาณดี เรียนรู้เร็ว และนิ่งในสถานการณ์คับขัน\n\nข้อควรระวัง: เก็บตัว จำความแค้นนาน และอารมณ์แปรปรวนเมื่อถูกกดดัน",
  "People born in the Year of the Snake are quietly alluring, sharp, realistic, determined and intuitive; you learn fast and stay calm under pressure.\n\nWatch out for: withdrawing, holding grudges, and moodiness when pushed."),
 ("มะเมีย", "Horse", "คนเกิดปีมะเมียร่าเริง เปิดเผย รักอิสระ กระตือรือร้น เข้าสังคมเก่ง และหาเงินเก่ง ชอบการเดินทางและสิ่งใหม่\n\nข้อควรระวัง: ใจร้อน เบื่อง่าย และขาดความต่อเนื่อง",
  "People born in the Year of the Horse are cheerful, open, freedom-loving, energetic, sociable and good at earning money, and love travel and new things.\n\nWatch out for: a quick temper, boredom and lack of follow-through."),
 ("มะแม", "Goat", "คนเกิดปีมะแมอ่อนโยน ใจดี อดทน เห็นอกเห็นใจผู้อื่น โรแมนติก มีศิลปะ และให้อภัยง่าย สนใจเรื่องจิตใจและความเชื่อ\n\nข้อควรระวัง: ลังเล กังวลมาก และหลีกเลี่ยงความขัดแย้งจนไม่กล้าตัดสินใจ",
  "People born in the Year of the Goat are gentle, kind, patient, empathetic, romantic, artistic and forgiving, with an interest in the spiritual.\n\nWatch out for: indecision, worry, and avoiding conflict so much that you can't decide."),
 ("วอก", "Monkey", "คนเกิดปีวอกฉลาด มีไหวพริบ ตลก มีเสน่ห์ ปรับตัวเก่ง และคิดสร้างสรรค์ แก้ปัญหาเฉพาะหน้าได้ดีเยี่ยม เข้ากับคนง่าย\n\nข้อควรระวัง: หุนหันพลันแล่น ชอบความตื่นเต้น และไม่ชอบงานหนักที่จำเจ",
  "People born in the Year of the Monkey are clever, witty, funny, charming, adaptable and creative, superb at solving problems on the spot and easy to get along with.\n\nWatch out for: impulsiveness, thrill-seeking, and dislike of heavy, repetitive work."),
 ("ระกา", "Rooster", "คนเกิดปีระกาขยัน ตรงต่อเวลา กล้าพูด กล้าแสดงออก ภูมิใจในตัวเอง และใส่ใจรายละเอียด ซื่อสัตย์ต่อเพื่อนและมีความเป็นศิลปิน\n\nข้อควรระวัง: ชอบวิจารณ์ ช่างเถียง และสมบูรณ์แบบจนเครียด",
  "People born in the Year of the Rooster are hardworking, punctual, outspoken, proud and detail-minded, loyal to friends and artistic.\n\nWatch out for: criticism, argumentativeness, and perfectionism that brings stress."),
 ("จอ", "Dog", "คนเกิดปีจอซื่อสัตย์ จริงใจ ช่างสังเกต มีอารมณ์ขัน และปกป้องคนที่รัก เป็นเพื่อนแท้ที่ไว้ใจได้\n\nข้อควรระวัง: ระแวง ขี้บ่น และโกรธง่ายแต่หายเร็ว",
  "People born in the Year of the Dog are loyal, sincere, observant and humorous, protective of those they love, and true friends you can rely on.\n\nWatch out for: suspicion, nagging, and a quick (but short-lived) temper."),
 ("กุน", "Pig", "คนเกิดปีกุนอบอุ่น จริงใจ ใจดี อดทน ให้อภัยง่าย รักครอบครัว และรักความสนุก มีความเป็นศิลปินและเข้ากับคนได้ง่าย\n\nข้อควรระวัง: ไม่ค่อยทะเยอทะยาน ใจอ่อนเกินไป และดื้อในบางเรื่อง",
  "People born in the Year of the Pig are warm, sincere, kind, patient, forgiving, family-loving and fun-loving, artistic and easy to get along with.\n\nWatch out for: low ambition, being too soft-hearted, and stubbornness about some things."),
]
for i, (_, _, th, en) in enumerate(ANIMAL):
    T[f"animal.{i}"] = {"th": th, "en": en}

REL = {
 "same": ("ปีนี้เป็นปีนักษัตรเดียวกับปีเกิดของคุณ ตามความเชื่อจีนเรียกว่า 'ปีชง' (เปิ่นมิ่งเหนียน) ถือว่าดวงไม่ค่อยนิ่ง อาจมีอุปสรรคหรือการเปลี่ยนแปลงที่ไม่คาดคิด\n\nคำแนะนำ: ทำตัวให้เรียบง่าย ระวังการตัดสินใจเรื่องใหญ่ เช่น ย้ายบ้าน เปลี่ยนงาน หรือลงทุนก้อนใหญ่ ตามความเชื่อนิยมใส่สีแดงและไหว้ไท้ส่วยเอี๊ยเพื่อเสริมดวง",
          "This year shares your birth animal: in Chinese belief, your Ben Ming Nian. Luck is considered unsettled, with possible obstacles or unexpected changes.\n\nAdvice: keep a low profile and be careful with big decisions such as moving, changing jobs or large investments. Traditionally people wear red and pay respects to Tai Sui for protection."),
 "harmony": ("ปีนักษัตรของปีนี้เป็น 'คู่มิตร' (หลิวเหอ) กับปีเกิดของคุณ เป็นปีที่มีผู้ใหญ่และคนรอบข้างคอยช่วยเหลือในจังหวะสำคัญ เหมาะกับการร่วมมือ เจรจา และสร้างความสัมพันธ์ใหม่",
             "This year's animal forms a six-harmony pair (liu he) with yours. Helpful people and mentors appear at key moments; a good year for partnerships, negotiation and new relationships."),
 "trine": ("ปีนักษัตรของปีนี้อยู่ใน 'สามประสาน' (ซานเหอ) เดียวกับปีเกิดของคุณ ความคิดและเป้าหมายของคุณไปในทางเดียวกับพลังของปี งานและความสัมพันธ์ไหลลื่น เป็นปีที่ดีสำหรับการเริ่มต้นและขยายงาน",
           "This year's animal is in the same three-harmony group (san he) as yours. Your ideas and goals run with the year's energy; work and relationships flow, making it a good year to start and expand."),
 "clash": ("ปีนักษัตรของปีนี้เป็น 'คู่ปะทะ' (หลิวชง) กับปีเกิดของคุณ อยู่ตรงข้ามกันในวงนักษัตร ปีนี้อาจมีการเปลี่ยนแปลงกะทันหัน การเดินทาง หรือความขัดแย้ง\n\nคำแนะนำ: ใจเย็น ระวังอุบัติเหตุและการลงทุนเสี่ยง ใช้ความเปลี่ยนแปลงเป็นโอกาสในการปรับตัวแทนการต่อต้าน",
           "This year's animal clashes (liu chong) with yours, sitting opposite on the zodiac wheel. Expect sudden changes, travel or conflict.\n\nAdvice: stay calm, take care with accidents and risky investments, and use change as a chance to adapt rather than resist."),
 "harm": ("ปีนักษัตรของปีนี้เป็น 'คู่ขัด' (หลิวไห่) กับปีเกิดของคุณ อาจมีเรื่องเข้าใจผิด คำพูดที่ทำให้เสียใจ หรือคนที่ไม่จริงใจเข้ามาใกล้\n\nคำแนะนำ: ระวังคำพูด ตรวจสอบสัญญาและข้อตกลงให้รอบคอบ และเลือกคนที่จะไว้ใจ",
          "This year's animal forms a harm pair (liu hai) with yours. Misunderstandings, hurtful words or insincere people may come close.\n\nAdvice: mind your words, check contracts and agreements carefully, and choose carefully whom you trust."),
 "neutral": ("ปีนักษัตรของปีนี้เป็นกลางกับปีเกิดของคุณ ไม่มีแรงหนุนหรือแรงขัดเป็นพิเศษ ผลลัพธ์ของปีนี้จึงขึ้นอยู่กับความตั้งใจและการลงมือของคุณเองเป็นหลัก",
             "This year's animal is neutral towards yours, with no special support or friction. The year's results depend mainly on your own effort and choices."),
}
for k, (th, en) in REL.items():
    T[f"animalNow.{k}"] = {"th": th, "en": en}
