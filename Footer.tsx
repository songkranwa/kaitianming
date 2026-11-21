import { useState } from 'react'
import { credits } from '../i18n/credits'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import { ICON, Icon } from './Icons'

export function Footer({ t, lang }: { t: Dict; lang: Lang }) {
  const [open, setOpen] = useState(false)
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row-wrap between gap-16 muted-2 small" style={{ gap: 16 }}>
          <span>{t.copyright(new Date().getFullYear())}</span>
          <span>{t.disclaimer}</span>
          <button type="button" className="btn-ghost" aria-expanded={open} aria-controls="credits" onClick={() => setOpen(!open)}>
            <Icon d={ICON.book} size={16} width={1.8} />{open ? t.creditsHide : t.creditsShow}
          </button>
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
