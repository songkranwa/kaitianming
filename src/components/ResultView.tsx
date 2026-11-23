import { useMemo } from 'react'
import { cityLabel } from '../engine/cities'
import type { Result } from '../engine/compute'
import { fmtOffset } from '../engine/time'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import { AdSlot } from './AdSlot'
import { CardDeck } from './CardDeck'
import { buildTopics, deckText, type Tier } from './deck'
import { dateText } from './format'
import { ICON, Icon } from './Icons'

interface Props {
  t: Dict; lang: Lang; res: Result; catalogError: boolean; tier: Tier
  onBack: () => void; onCalc: () => void; onUnlock: (level: 'member' | 'premium') => void
}

/** Result page: one topic per deck of cards. Swipe sideways within a topic, scroll down for the next. */
export function ResultView({ t, lang, res, catalogError, tier, onBack, onCalc, onUnlock }: Props) {
  const { ch, city } = res
  const cityName = lang === 'th' ? city.nameTh || city.name : city.name
  const topics = useMemo(() => buildTopics(res, lang), [res, lang])
  const d = deckText(lang)
  return (
    <section className="container page result" aria-labelledby="result-title">
      <div className="stack gap-12">
        <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={onBack}><Icon d={ICON.back} size={16} width={1.8} />{t.back}</button>
        <h1 id="result-title" className="page-title">{t.resultTitle}</h1>
        <p style={{ fontSize: 18 }}>{dateText(res, lang)} · {cityLabel(city, lang)}</p>
        <p className="muted small" style={{ maxWidth: 780 }}>{t.timeNote(cityName, fmtOffset(ch.offsetMin), city.tz)}</p>
        <p className="deck-hint small">{d.hint}</p>
      </div>

      {!res.pp && catalogError && <p role="alert" style={{ color: 'var(--warn)' }}>{t.loadingError}</p>}

      {topics.flatMap((tp, i) => [
        <CardDeck key={tp.id} topic={tp} index={i} total={topics.length} tier={tier} t={t} lang={lang} paper={res.pp} onUnlock={onUnlock} />,
        ...(i === 3 ? [<AdSlot key="ad" label={t.adLabel} />] : [])
      ])}

      <button type="button" className="btn-outline" style={{ alignSelf: 'center' }} onClick={onCalc}><Icon d={ICON.calc} size={18} width={1.8} />{t.showCalc}</button>
    </section>
  )
}
