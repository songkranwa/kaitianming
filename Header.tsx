import type { Dict } from '../i18n/dict'
import { LANGS, type Lang } from '../i18n/types'
import type { View } from '../App'
import { LogoMark } from './Icons'

interface Props { t: Dict; lang: Lang; view: View; onNav: (v: View) => void; onLang: (l: Lang) => void }

export function Header({ t, lang, view, onNav, onLang }: Props) {
  const items: [View, string][] = [['home', t.navHome], ['premium', t.navPremium], ['settings', t.navSettings]]
  const isCurrent = (v: View) => view === v || (v === 'home' && (view === 'result' || view === 'calc'))
  return (
    <header className="site-header">
      <div className="container">
        <button type="button" className="brand" onClick={() => onNav('home')} aria-label={`${t.brand} ${t.brandZh} — ${t.navHome}`}>
          <LogoMark />
          <span className="brand-name">{t.brand}<span className="brand-zh" lang="zh">{t.brandZh}</span></span>
        </button>
        <div className="row-wrap" style={{ gap: '8px 20px' }}>
          <nav aria-label={t.navMain} className="nav">
            {items.map(([v, label]) => (
              <button key={v} type="button" className="nav-btn" aria-current={isCurrent(v) ? 'page' : undefined} onClick={() => onNav(v)}>{label}</button>
            ))}
          </nav>
          <div role="group" aria-label={t.navLang} className="seg">
            {LANGS.map((l) => (
              <button key={l.v} type="button" aria-pressed={lang === l.v} onClick={() => onLang(l.v)} lang={l.v}>{l.short}</button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
