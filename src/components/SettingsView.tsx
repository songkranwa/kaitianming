import type { Dict } from '../i18n/dict'
import { LANGS, type Lang } from '../i18n/types'

interface Props {
  t: Dict; lang: Lang; onLang: (l: Lang) => void
  adsPersonal: boolean; onAdsPersonal: (v: boolean) => void
  canInstall: boolean; onInstall: () => void
}

export function SettingsView({ t, lang, onLang, adsPersonal, onAdsPersonal, canInstall, onInstall }: Props) {
  return (
    <section className="container narrow page" style={{ paddingTop: 56, gap: 20 }} aria-labelledby="settings-title">
      <h1 id="settings-title" className="page-title">{t.settingsTitle}</h1>
      <div className="card" style={{ gap: 8 }}>
        <label htmlFor="s-lang" style={{ fontWeight: 600 }}>{t.langTitle}</label>
        <select id="s-lang" className="control" value={lang} onChange={(e) => onLang(e.target.value as Lang)}>
          {LANGS.map((l) => <option key={l.v} value={l.v}>{l.label}</option>)}
        </select>
      </div>
      <div className="card" style={{ gap: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--sans)' }}>{t.adsTitle}</h2>
        <div className="check-row">
          <input id="s-ads" type="checkbox" checked={adsPersonal} onChange={(e) => onAdsPersonal(e.target.checked)} />
          <label htmlFor="s-ads" className="stack gap-2"><span>{t.adsPersonal}</span><span className="muted small">{t.adsPersonalDesc}</span></label>
        </div>
      </div>
      {canInstall && (
        <div className="card" style={{ gap: 10 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--sans)' }}>{t.installTitle}</h2>
          <p className="muted">{t.installBody}</p>
          <button type="button" className="btn-outline" style={{ alignSelf: 'flex-start' }} onClick={onInstall}>{t.installBtn}</button>
        </div>
      )}
      <div className="card" style={{ gap: 6 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--sans)' }}>{t.privacyTitle}</h2>
        <p className="muted">{t.privacyBody}</p>
      </div>
    </section>
  )
}
