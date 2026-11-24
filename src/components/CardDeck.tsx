import { useRef, useState } from 'react'
import type { Paper } from '../engine/paper'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import { canRead, deckText, type Tier, type Topic } from './deck'
import { Icon } from './Icons'
import { SkyMap } from './SkyMap'

const LOCK = 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5zM12 15v2'
const LEFT = 'M15 18l-6-6 6-6'
const RIGHT = 'M9 6l6 6-6 6'

interface Props {
  topic: Topic; index: number; total: number; tier: Tier
  t: Dict; lang: Lang; paper: Paper | null
  onUnlock: (level: 'member' | 'premium') => void
}

/** One topic: a stack of cards. Swipe or use the arrows to move between cards. */
export function CardDeck({ topic, index, total, tier, t, lang, paper, onUnlock }: Props) {
  const d = deckText(lang)
  const track = useRef<HTMLDivElement | null>(null)
  const [at, setAt] = useState(0)
  const open = canRead(topic.lock, tier)
  const n = topic.cards.length
  const headingId = `topic-${topic.id}`

  const go = (i: number) => {
    const el = track.current
    if (!el) return
    const card = el.children[i] as HTMLElement | undefined
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current
    if (!el || !el.children.length) return
    const w = (el.children[0] as HTMLElement).offsetWidth + 16
    setAt(Math.max(0, Math.min(n - 1, Math.round(el.scrollLeft / w))))
  }

  return (
    <section className="topic" aria-labelledby={headingId}>
      <div className="topic-head">
        <span className="muted-2 small">{d.topicOf(index + 1, total)}</span>
        <h2 id={headingId} className="topic-title">{topic.title}</h2>
      </div>

      {open ? (
        <>
          <div className={'deck' + (n > 1 ? ' deck-stack' : '')}>
            <div className="deck-track" ref={track} onScroll={onScroll} tabIndex={0} aria-label={topic.title}>
              {topic.cards.map((c, i) => (
                <article key={i} className="deck-card" role="group" aria-roledescription={lang === 'th' ? 'บัตร' : 'card'} aria-label={d.cardOf(i + 1, n)}>
                  {c.kicker && <p className="deck-kicker">{c.kicker}</p>}
                  {c.value && <p className="deck-value">{c.value}</p>}
                  {c.skyMap && paper && <SkyMap paper={paper} t={t} />}
                  {c.rows && c.rows.length > 0 && (
                    <dl className="deck-rows">
                      {c.rows.map((r, j) => <div key={j}><dt>{r.k}</dt><dd>{r.v}</dd></div>)}
                    </dl>
                  )}
                  {c.body && <p className={c.pending ? 'deck-body deck-pending' : c.kicker && !c.value && !c.rows ? 'muted deck-body' : 'deck-body'}>{c.body}</p>}
                  <span className="deck-count muted-2 small">{i + 1} / {n}</span>
                </article>
              ))}
            </div>
          </div>
          {n > 1 && (
            <div className="deck-nav">
              <button type="button" className="deck-arrow" aria-label={d.prev} disabled={at === 0} onClick={() => go(at - 1)}><Icon d={LEFT} size={20} width={2} /></button>
              <div className="deck-dots" aria-hidden="true">
                {topic.cards.map((_, i) => <span key={i} className={i === at ? 'on' : ''} />)}
              </div>
              <button type="button" className="deck-arrow" aria-label={d.next} disabled={at === n - 1} onClick={() => go(at + 1)}><Icon d={RIGHT} size={20} width={2} /></button>
            </div>
          )}
        </>
      ) : (
        <div className={'deck' + (n > 1 ? ' deck-stack' : '')}>
          <div className="deck-card deck-locked">
            <svg className="deck-cross" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L100 100M100 0L0 100" /></svg>
            <span className="lock-badge"><Icon d={LOCK} size={34} stroke="var(--accent)" width={1.8} /></span>
            <p className="deck-kicker">{topic.lock === 'member' ? d.lockedMember : d.lockedPremium}</p>
            <p className="muted" style={{ textAlign: 'center', maxWidth: 360 }}>{topic.lock === 'member' ? d.lockedBodyMember(n) : d.lockedBodyPremium(n)}</p>
            <button type="button" className="btn-primary" style={{ padding: '0 24px' }} onClick={() => onUnlock(topic.lock === 'member' ? 'member' : 'premium')}>
              {topic.lock === 'member' ? d.unlockMember : d.unlockPremium}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
