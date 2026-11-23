import { useState } from 'react'
import { credits } from '../i18n/credits'
import type { Dict } from '../i18n/dict'
import { LANGS, type Lang } from '../i18n/types'
import type { View } from '../App'

interface Props { t: Dict; lang: Lang; onNav: (v: View) => void; onLang: (l: Lang) => void }

/** Three columns (contact · information · more), then copyright and disclaimer. Credits open under them. */
export function Footer({ t, lang, onNav, onLang }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="foot-cols">
          <div className="stack gap-8">
            <h2 className="foot-h">{t.footContact}</h2>
            <span className="muted">{t.contactEmail}</span>
          </div>
          <div className="stack gap-8">
            <h2 className="foot-h">{t.footInfo}</h2>
            <button type="button" className="link-btn" onClick={() => onNav('settings')}>{t.privacyLink}</button>
            <button type="button" className="link-btn" aria-expanded={open} aria-controls="credits" onClick={() => setOpen(!open)}>{open ? t.creditsHide : t.creditsShow}</button>
          </div>
          <div className="stack gap-8">
            <h2 className="foot-h">{t.footMore}</h2>
            <button type="button" className="link-btn" onClick={() => onNav('premium')}>{t.navPremium}</button>
            <button type="button" className="link-btn" onClick={() => onNav('settings')}>{t.navSettings}</button>
            <div role="group" aria-label={t.navLang} className="seg" style={{ alignSelf: 'flex-start' }}>
              {LANGS.map((l) => (
                <button key={l.v} type="button" aria-pressed={lang === l.v} onClick={() => onLang(l.v)} lang={l.v}>{l.short}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="foot-bottom muted-2 small">
          <span>{t.copyright(new Date().getFullYear())}</span>
          <span>{t.disclaimer}</span>
        </div>

        {open && (
          <section id="credits" className="credits" aria-labelledby="credits-title">
            <div className="stack gap-6">
              <h2 id="credits-title" className="serif" style={{ fontSize: 24 }}>{t.creditsTitle}</h2>
              <p className="muted" style={{ fontSize: 15 }}>{t.creditsSub}</p>
            </div>
            <div className="grid grid-300" style={{ gap: '24px 32px' }}>
              {credits(lang).map((g) => (
                <div key={g.group} className="stack gap-12">
                  <h3>{g.group}</h3>
                  <ul className="stack" style={{ gap: 14 }}>
                    {g.items.map((c) => (
                      <li key={c.name}>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                        <span className="muted">{c.detail}</span>
                        {c.links.length > 0 && (
                          <span className="credit-links">
                            {c.links.map((lk) => <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer">{lk.label}</a>)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </footer>
  )
}
