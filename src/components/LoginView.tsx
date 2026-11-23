import type { Dict } from '../i18n/dict'

/** Placeholder until accounts arrive with Premium. Nothing is collected here. */
export function LoginView({ t, onHome, onPremium }: { t: Dict; onHome: () => void; onPremium: () => void }) {
  return (
    <section className="container narrow page" style={{ paddingTop: 56, gap: 24 }} aria-labelledby="login-title">
      <h1 id="login-title" className="page-title">{t.loginTitle}</h1>
      <div className="card">
        <p className="muted">{t.loginBody}</p>
        <button type="button" className="btn-primary" disabled>{t.loginSoon}</button>
        <div className="row-wrap" style={{ gap: 12 }}>
          <button type="button" className="btn-ghost" onClick={onPremium}>{t.navPremium}</button>
          <button type="button" className="btn-ghost" onClick={onHome}>{t.backHome}</button>
        </div>
      </div>
    </section>
  )
}
