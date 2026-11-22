import { useMemo } from 'react'
import { cityLabel, coordText, norm, type CityIndex } from '../engine/cities'
import type { LoadState } from '../hooks/useData'
import type { Dict } from '../i18n/dict'
import { readings } from '../i18n/readings'
import type { Lang } from '../i18n/types'
import type { BirthForm } from '../App'
import { AdSlot } from './AdSlot'
import { Icon } from './Icons'

interface Props {
  t: Dict; lang: Lang; form: BirthForm; setForm: (f: Partial<BirthForm>) => void
  cities: LoadState<CityIndex>; ready: boolean; onSubmit: () => void
}

const daysInMonth = (m: string, y: string) => new Date(y ? Number(y) : 2000, Number(m), 0).getDate()
const clampDay = (day: string, m: string, y: string) => (day && m && Number(day) > daysInMonth(m, y) ? '' : day)

export function HomeView({ t, lang, form, setForm, cities, ready, onSubmit }: Props) {
  const curCE = new Date().getFullYear()
  const months = useMemo(() => {
    const f = new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-GB', { month: 'long', timeZone: 'UTC' })
    return Array.from({ length: 12 }, (_, i) => ({ v: String(i + 1), label: f.format(new Date(Date.UTC(2000, i, 15))) }))
  }, [lang])
  const dim = form.month ? daysInMonth(form.month, form.year) : 31
  const years = useMemo(() => {
    const out: { v: string; label: string }[] = []
    for (let y = curCE; y >= 1917; y--) out.push({ v: String(y), label: lang === 'th' ? String(y + 543) : String(y) })
    return out
  }, [curCE, lang])

  const index = cities.status === 'ready' ? cities.data : null
  const picked = index && form.cityIdx >= 0 ? index.get(form.cityIdx) : null
  const suggestions = useMemo(() => (index && !picked ? index.search(form.cityQuery).map((i) => index.get(i)) : []), [index, picked, form.cityQuery])
  const noMatch = !!index && !picked && norm(form.cityQuery).length >= 2 && suggestions.length === 0
  const cityPlaceholder = cities.status === 'ready' ? t.cityPlaceholder : cities.status === 'error' ? t.cityError : t.cityLoading

  return (
    <>
      <section id="top" className="container hero" aria-labelledby="hero-title">
        <div className="stack" style={{ gap: 22 }}>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="hero-title"><span>{t.h1a}</span><span>{t.h1b}</span></h1>
          <p className="lead">{t.sub}</p>
          <div className="row-wrap muted gap-12" style={{ gap: 12, fontSize: 15 }}>
            <span className="chip">{t.chip1}</span><span className="chip">{t.chip2}</span><span className="chip">{t.chip3}</span>
          </div>
        </div>

        <form className="form-card" onSubmit={(e) => { e.preventDefault(); if (ready) onSubmit() }} noValidate>
          <div className="stack gap-2">
            <h2>{t.formTitle}</h2>
            <p className="muted-2" style={{ fontSize: 15 }}>{t.formSub}</p>
          </div>

          <fieldset>
            <legend>{t.step1}</legend>
            <div className="date-grid">
              <div className="field">
                <label htmlFor="f-day">{t.day}</label>
                <select id="f-day" className="control" value={form.day} onChange={(e) => setForm({ day: e.target.value })}>
                  <option value="">{t.choose}</option>
                  {Array.from({ length: dim }, (_, i) => String(i + 1)).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-month">{t.month}</label>
                <select id="f-month" className="control" value={form.month} onChange={(e) => setForm({ month: e.target.value, day: clampDay(form.day, e.target.value, form.year) })}>
                  <option value="">{t.choose}</option>
                  {months.map((m) => <option key={m.v} value={m.v}>{m.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-year">{t.year}</label>
                <select id="f-year" className="control" value={form.year} onChange={(e) => setForm({ year: e.target.value, day: clampDay(form.day, form.month, e.target.value) })}>
                  <option value="">{t.choose}</option>
                  {years.map((y) => <option key={y.v} value={y.v}>{y.label}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          <div className="stack gap-8">
            <span style={{ fontWeight: 600, fontSize: 16 }}>{t.step2}</span>
            {picked ? (
              <div className="picked">
                <div className="stack" style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 600 }}>{cityLabel(picked, lang)}</span>
                  <span className="muted-2 small">{t.cityPicked} · {picked.tz}</span>
                </div>
                <button type="button" className="btn-ghost" onClick={() => setForm({ cityQuery: '', cityIdx: -1 })}>{t.cityChange}</button>
              </div>
            ) : (
              <>
                {cities.status !== 'ready' && <p role="status" className="muted" style={{ fontSize: 15 }}>{cityPlaceholder}</p>}
                <div className="field">
                  <label htmlFor="f-city">{t.cityLabel}</label>
                  <input
                    id="f-city" className="control" type="text" autoComplete="off" spellCheck={false}
                    value={form.cityQuery} placeholder={cityPlaceholder} disabled={!index}
                    aria-controls="city-suggestions" aria-describedby={noMatch ? 'city-none' : undefined}
                    onChange={(e) => setForm({ cityQuery: e.target.value, cityIdx: -1 })}
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul id="city-suggestions" className="suggest" aria-label={t.citySuggestions}>
                    {suggestions.map((c) => (
                      <li key={c.idx}>
                        <button type="button" onClick={() => setForm({ cityIdx: c.idx, cityQuery: cityLabel(c, lang) })}>
                          <span>{cityLabel(c, lang)}</span>
                          <span className="muted-2" style={{ fontSize: 13 }}>{c.tz} · {coordText(c.lat, c.lon)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {noMatch && <p id="city-none" className="muted" style={{ fontSize: 15 }}>{t.cityNone}</p>}
              </>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={!ready}>{t.analyze}</button>
          {!ready && <p className="muted-2 small" style={{ textAlign: 'center' }}>{t.needAll}</p>}
        </form>
      </section>

      <section id="readings" className="section-alt" aria-labelledby="readings-title">
        <div className="container section-pad">
          <div className="stack gap-10" style={{ maxWidth: 660 }}>
            <h2 id="readings-title" className="section-title">{t.readingsTitle}</h2>
            <p className="muted">{t.readingsSub}</p>
          </div>
          <div className="grid grid-280">
            {readings(lang).map((r) => (
              <article key={r.title} className="reading">
                <div className="icon-box"><Icon d={r.icon} stroke="var(--accent)" /></div>
                <h3>{r.title}</h3>
                <p className="muted" style={{ fontSize: 16 }}>{r.body}</p>
              </article>
            ))}
          </div>
          <AdSlot label={t.adLabel} />
        </div>
      </section>

      <section id="how" className="container section-pad" aria-labelledby="how-title">
        <h2 id="how-title" className="section-title">{t.howTitle}</h2>
        <div className="grid grid-240">
          {([[t.how1t, t.how1b], [t.how2t, t.how2b], [t.how3t, t.how3b]] as const).map(([h, b], i) => (
            <div key={h} className="stack gap-8 step">
              <span className="step-num">{i + 1}</span>
              <h3>{h}</h3>
              <p className="muted" style={{ fontSize: 16 }}>{b}</p>
            </div>
          ))}
        </div>
        <a href="#top" className="btn-outline" style={{ alignSelf: 'flex-start' }}>{t.startNow}</a>
      </section>
    </>
  )
}
