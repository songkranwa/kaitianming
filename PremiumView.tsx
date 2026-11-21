import type { Dict } from '../i18n/dict'
import { ICON, Icon } from './Icons'

export function PremiumView({ t }: { t: Dict }) {
  return (
    <section className="container narrow page" style={{ paddingTop: 56, gap: 24 }} aria-labelledby="premium-title">
      <div className="stack gap-8">
        <h1 id="premium-title" className="page-title">{t.premiumTitle}</h1>
        <p className="muted" style={{ fontSize: 18 }}>{t.premiumSub}</p>
      </div>
      <div className="premium-card">
        <span className="serif accent" style={{ fontSize: 30 }}>{t.price}</span>
        <ul className="stack gap-12">
          {t.benefits.map((b) => (
            <li key={b} className="row-wrap" style={{ gap: 12, alignItems: 'flex-start', flexWrap: 'nowrap' }}>
              <span style={{ marginTop: 4, flex: 'none' }}><Icon d={ICON.check} size={20} stroke="var(--accent)" width={2} /></span><span>{b}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="btn-primary" disabled>{t.subscribe}</button>
        <button type="button" className="btn-ghost" style={{ justifyContent: 'center' }} disabled>{t.restore}</button>
      </div>
    </section>
  )
}
