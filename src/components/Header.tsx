import type { Dict } from '../i18n/dict'
import type { View } from '../App'
import { LogoMark } from './Icons'

interface Props { t: Dict; view: View; onNav: (v: View) => void }

/** Minimal header: Log in on the right; a small brand on the left everywhere except Home (Home shows the big logo). */
export function Header({ t, view, onNav }: Props) {
  return (
    <header className={'site-header' + (view === 'home' ? ' is-home' : '')}>
      <div className="container">
        {view === 'home' ? <span /> : (
          <button type="button" className="brand" onClick={() => onNav('home')} aria-label={`${t.brand} ${t.brandZh} — ${t.navHome}`}>
            <LogoMark />
            <span className="brand-name">{t.brand}<span className="brand-zh brush" lang="zh">{t.brandZh}</span></span>
          </button>
        )}
        <button type="button" className="btn-ghost" aria-current={view === 'login' ? 'page' : undefined} onClick={() => onNav('login')}>{t.login}</button>
      </div>
    </header>
  )
}
