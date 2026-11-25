import { useMemo } from 'react'
import { cityLabel } from '../engine/cities'
import type { Texts } from '../content/predictions'
import type { Result } from '../engine/compute'
import { fmtOffset } from '../engine/time'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import { AdSlot } from './AdSlot'
import { SIGN_EN, SIGN_TH, buildTopics, canRead, deckText, type DeckCard, type Locks, type Tier, type Topic } from './deck'
import { dateText, starText } from './format'
import { ICON, Icon } from './Icons'
import { SkyHero } from './SkyHero'
import { travelText } from './travel'

interface Props {
  t: Dict; lang: Lang; res: Result; texts: Texts; locks: Locks; catalogError: boolean; tier: Tier
  onBack: () => void; onCalc: () => void; onTravel: () => void; onUnlock: (level: 'member' | 'premium') => void
}

/** Topics in three chapters: who you are (birth), right now (today and this year), ahead. */
const CHAPTERS: { id: string; topics: string[] }[] = [
  { id: 'who', topics: ['day', 'sky', 'sign', 'animal', 'personal'] },
  { id: 'now', topics: ['dayYear', 'today', 'signNow', 'animalNow', 'overallNow'] },
  { id: 'ahead', topics: ['month', 'year', 'overallNext'] }
]

export function resultText(lang: Lang) {
  const th = lang === 'th'
  return {
    overhead: th ? 'เหนือศีรษะในคืนที่คุณเกิด' : 'Overhead the night you were born',
    near: (n: string) => (th ? `ใกล้${n}` : `Near ${n}`),
    yourStar: th ? 'ดาวของคุณ' : 'Your star',
    fromOverhead: (d: number) => (th ? `ห่างจากจุดเหนือศีรษะ ${d}°` : `${d}° from overhead`),
    you: th ? 'คุณ' : 'You',
    below: th ? 'อยู่ใต้ขอบฟ้า' : 'below the horizon',
    belowDay: th ? 'อยู่ใต้ขอบฟ้าในคืนนี้' : 'below the horizon this night',
    glance: th ? 'คุณในภาพรวม' : 'You at a glance',
    chapters: { who: th ? 'ตัวตนของคุณ' : 'Who you are', now: th ? 'ช่วงนี้' : 'Right now', ahead: th ? 'ข้างหน้า' : 'Ahead' } as Record<string, string>,
    chaptersLabel: th ? 'หมวดคำทำนาย' : 'Reading chapters',
    details: th ? 'ที่มาและรายละเอียด' : 'How it is worked out',
    howWorked: th ? 'ดูการคำนวณทั้งหมด' : 'All the calculations',
    tiles: {
      number: th ? 'เลขวันเกิด' : 'Birth number', zodiac: th ? 'ราศี' : 'Zodiac', animal: th ? 'ปีนักษัตร' : 'Chinese year',
      sky: th ? 'ท้องฟ้าคืนเกิด' : 'Birth sky', moon: th ? 'ดวงจันทร์' : 'Moon', year: (y: number) => (th ? `กำลังปี ${y + 543}` : `${y} power`), overall: th ? 'ดวงชะตารวม' : 'Fortune now'
    }
  }
}

/** One topic as a card: the reading first, the facts behind it folded away. */
function TopicCard({ topic, tier, lang, label, onUnlock }: { topic: Topic; tier: Tier; lang: Lang; label: string; onUnlock: (level: 'member' | 'premium') => void }) {
  const d = deckText(lang)
  const open = canRead(topic.lock, tier)
  const preview = !open && topic.scope === 'details'
  const [first, ...rest] = topic.cards
  const facts = rest.filter((c) => !c.skyMap)
  const headingId = `topic-${topic.id}`
  const fact = (c: DeckCard, i: number) => (
    <div key={i} className="topic-fact">
      {c.kicker && <p className="deck-kicker">{c.kicker}</p>}
      {c.value && <p className="topic-fact-value">{c.value}</p>}
      {c.rows && c.rows.length > 0 && <dl className="deck-rows">{c.rows.map((r, j) => <div key={j}><dt>{r.k}</dt><dd>{r.v}</dd></div>)}</dl>}
      {c.body && <p className="deck-body muted">{c.body}</p>}
    </div>
  )
  return (
    <article className="topic-card" aria-labelledby={headingId}>
      <p id={headingId} className="topic-kicker">{topic.title}</p>
      {(open || preview) && first && (
        <>
          {first.value && <h3 className="topic-value">{first.value}</h3>}
          {first.body && <p className={first.pending ? 'deck-body deck-pending' : 'deck-body'}>{first.body}</p>}
        </>
      )}
      {open && facts.length > 0 && (
        <details className="topic-more">
          <summary>{label}</summary>
          <div className="stack gap-14">{facts.map(fact)}</div>
        </details>
      )}
      {!open && (
        <div className="topic-lock">
          <p className="deck-kicker">{topic.lock === 'member' ? d.lockedMember : d.lockedPremium}</p>
          <button type="button" className="btn-outline" onClick={() => onUnlock(topic.lock === 'member' ? 'member' : 'premium')}>{topic.lock === 'member' ? d.unlockMember : d.unlockPremium}</button>
        </div>
      )}
    </article>
  )
}

/** Result page: the birth sky as a full-width hero, a summary row, then the readings in three chapters and time travel. */
export function ResultView({ t, lang, res, texts, locks, catalogError, tier, onBack, onCalc, onTravel, onUnlock }: Props) {
  const { ch, city, pp, np, fc } = res
  const th = lang === 'th'
  const cityName = th ? city.nameTh || city.name : city.name
  const topics = useMemo(() => buildTopics(res, lang, texts, locks), [res, lang, texts, locks])
  const byId = useMemo(() => Object.fromEntries(topics.map((x) => [x.id, x])), [topics])
  const r = resultText(lang)
  const tr = travelText(lang)
  const tiles = [
    { k: r.tiles.number, v: String(np.day.value), big: true },
    { k: r.tiles.zodiac, v: th ? SIGN_TH[fc.sign.birth] : SIGN_EN[fc.sign.birth] },
    { k: r.tiles.animal, v: res.animal },
    { k: r.tiles.sky, v: pp ? pp.brightness.birth_sign.state : '—' },
    { k: r.tiles.moon, v: `${ch.illum}% · ${ch.phase}` },
    { k: r.tiles.overall, v: String(fc.overallNow.value), big: true }
  ]

  return (
    <section className="result-page" aria-labelledby="result-title">
      <SkyHero paper={pp} t={t} youLabel={r.you} youBelow={r.below}
        footer={<p className="muted-2 small sky-hero-note">{t.timeNote(cityName, fmtOffset(ch.offsetMin), city.tz)}</p>}>
        <button type="button" className="btn-ghost pill" onClick={onBack}><Icon d={ICON.back} size={16} width={1.8} />{dateText(res, lang)} · {cityLabel(city, lang)}</button>
        <p className="hero-kicker">{r.overhead}</p>
        <h1 id="result-title" className="hero-title">{pp ? (pp.zenOnArea ? pp.zenName : r.near(pp.zenName)) : t.resultTitle}</h1>
        {pp && <p className="hero-sub">{r.yourStar}: <strong>{starText(pp.personal)}</strong> · {r.fromOverhead(pp.personal.distance_from_zenith_deg)}</p>}
        {!pp && <p className="muted small">{catalogError ? t.loadingError : t.loadingSky}</p>}
      </SkyHero>

      <div className="container stack gap-24 result-body">
        <div className="hero-actions">
          <button type="button" className="btn-ghost" onClick={onCalc}><Icon d={ICON.calc} size={18} width={1.8} />{r.howWorked}</button>
        </div>

        <section aria-labelledby="glance-title" className="stack gap-10">
          <h2 id="glance-title" className="section-kicker">{r.glance}</h2>
          <div className="glance">
            {tiles.map((x) => <div key={x.k} className="glance-tile"><span>{x.k}</span><strong className={x.big ? 'big' : ''}>{x.v}</strong></div>)}
          </div>
        </section>

        <nav className="chapters" aria-label={r.chaptersLabel}>
          {CHAPTERS.map((c) => <a key={c.id} href={`#ch-${c.id}`}>{r.chapters[c.id]}</a>)}
        </nav>

        {CHAPTERS.map((c, ci) => (
          <section key={c.id} id={`ch-${c.id}`} className="chapter" aria-labelledby={`ch-${c.id}-title`}>
            <h2 id={`ch-${c.id}-title`} className="chapter-title">{r.chapters[c.id]}</h2>
            {c.topics.map((id) => byId[id] && <TopicCard key={id} topic={byId[id]} tier={tier} lang={lang} label={r.details} onUnlock={onUnlock} />)}
            {ci === 1 && <AdSlot label={t.adLabel} />}
          </section>
        ))}

        <section className="card travel-cta" aria-labelledby="travel-cta-title">
          <span className="eyebrow">{tr.ctaKicker}</span>
          <h2 id="travel-cta-title" className="travel-cta-title">{tr.title}</h2>
          <p className="muted">{tr.ctaBody}</p>
          <div className="travel-cta-dial" aria-hidden="true"><span className="travel-cta-line" /></div>
          <button type="button" className="btn-primary" onClick={onTravel}>{tr.start}</button>
        </section>
      </div>
    </section>
  )
}
