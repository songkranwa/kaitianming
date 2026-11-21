import { cityLabel } from '../engine/cities'
import type { Result } from '../engine/compute'
import { fmtOffset } from '../engine/time'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import { AdSlot } from './AdSlot'
import { dateText, starDetail, starText } from './format'
import { ICON, Icon } from './Icons'
import { SkyMap } from './SkyMap'

interface Props { t: Dict; lang: Lang; res: Result; catalogError: boolean; onBack: () => void; onCalc: () => void }

export function ResultView({ t, lang, res, catalogError, onBack, onCalc }: Props) {
  const { ch, np, pp, city, L } = res
  const loading = !pp && !catalogError
  const cityName = lang === 'th' ? city.nameTh || city.name : city.name
  const summary = [
    { label: t.cardPersonal, value: pp ? starText(pp.personal) : '…', detail: pp ? starDetail(pp.personal, t) : t.loadingSky },
    { label: t.cardZenith, value: pp ? pp.zenName : '…', detail: pp ? t.zenithCentre : '' },
    {
      label: t.cardBright, value: pp ? pp.brightness.birth_sign.state : '…',
      detail: pp ? `${t.signPrefix}${pp.brightness.birth_sign.sign} · ${pp.brightness.birth_sign.blockers.length ? t.blockersBy + ': ' + pp.brightness.birth_sign.blockers.join(', ') : t.blockersNone}` : ''
    },
    { label: t.cardPowers, value: `${np.day.value} · ${np.birthYear.value}`, detail: `${t.thisYear(np.curYear.year)}: ${np.curYear.value}` },
    { label: t.cardSunMoon, value: `${ch.sunSign} · ${ch.moonSign}`, detail: `${t.trAya} ${ch.ayaText}` },
    { label: t.cardLunar, value: `${L.days[ch.dowI]} · ${ch.lunar}`, detail: `${ch.phase} · ${ch.illum}%` }
  ]
  return (
    <section className="container page" aria-labelledby="result-title">
      <div className="stack gap-12">
        <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={onBack}><Icon d={ICON.back} size={16} width={1.8} />{t.back}</button>
        <p className="eyebrow">{t.resultEyebrow}</p>
        <h1 id="result-title" className="page-title">{t.resultTitle}</h1>
        <p style={{ fontSize: 19 }}>{dateText(res, lang)} · {cityLabel(city, lang)}</p>
        <p className="muted" style={{ fontSize: 15, maxWidth: 780 }}>{t.timeNote(cityName, fmtOffset(ch.offsetMin), city.tz)}</p>
      </div>

      <div className="grid grid-260">
        {summary.map((x) => (
          <div key={x.label} className="stat">
            <span className="muted-2 small">{x.label}</span>
            <span className="stat-value">{x.value}</span>
            <span className="muted small">{x.detail}</span>
          </div>
        ))}
      </div>

      <div className="card-alt">
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>{t.readingSoonTitle}</h2>
        <p className="muted" style={{ fontSize: 15 }}>{t.readingSoonBody}</p>
      </div>

      <AdSlot label={t.adLabel} />

      <div className="card" style={{ alignItems: 'center', gap: 16 }}>
        <h2 style={{ alignSelf: 'flex-start' }}>{t.miniMapTitle}</h2>
        {loading && <p role="status" className="muted">{t.loadingSky}</p>}
        {!pp && catalogError && <p role="alert" style={{ color: 'var(--warn)' }}>{t.loadingError}</p>}
        {pp && <SkyMap paper={pp} t={t} />}
        <button type="button" className="btn-outline" onClick={onCalc}><Icon d={ICON.calc} size={18} width={1.8} />{t.showCalc}</button>
      </div>
    </section>
  )
}
