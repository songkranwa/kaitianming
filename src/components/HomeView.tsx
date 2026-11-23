import { useMemo } from 'react'
import { cityLabel, coordText, norm, type CityIndex } from '../engine/cities'
import type { LoadState } from '../hooks/useData'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import type { BirthForm } from '../App'
import { LogoMark } from './Icons'

interface Props {
  t: Dict; lang: Lang; form: BirthForm; setForm: (f: Partial<BirthForm>) => void
  cities: LoadState<CityIndex>; ready: boolean; onSubmit: () => void
}

const daysInMonth = (m: string, y: string) => new Date(y ? Number(y) : 2000, Number(m), 0).getDate()
const clampDay = (day: string, m: string, y: string) => (day && m && Number(day) > daysInMonth(m, y) ? '' : day)

/** Home: only what must be entered — logo, DD / MM / YYYY, place of birth, submit. */
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
  const cityPlaceholder = cities.status === 'ready' ? t.locationPh : cities.status === 'error' ? t.cityError : t.cityLoading

  return (
    <section className="container home" aria-labelledby="home-title">
      <h1 id="home-title" className="home-logo">
        <LogoMark size={72} />
        <span className="home-brand">{t.brand}</span>
        <span className="home-zh" lang="zh">{t.brandZh}</span>
      </h1>

      <form className="home-form" onSubmit={(e) => { e.preventDefault(); if (ready) onSubmit() }} noValidate>
        <fieldset>
          <legend className="sr-only">{t.step1}</legend>
          <div className="dmy">
            <div className="field">
              <label htmlFor="f-day" className="sr-only">{t.day}</label>
              <select id="f-day" className="control" value={form.day} onChange={(e) => setForm({ day: e.target.value })}>
                <option value="">{t.dayPh}</option>
                {Array.from({ length: dim }, (_, i) => String(i + 1)).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-month" className="sr-only">{t.month}</label>
              <select id="f-month" className="control" value={form.month} onChange={(e) => setForm({ month: e.target.value, day: clampDay(form.day, e.target.value, form.year) })}>
                <option value="">{t.monthPh}</option>
                {months.map((m) => <option key={m.v} value={m.v}>{m.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-year" className="sr-only">{t.year}</label>
              <select id="f-year" className="control" value={form.year} onChange={(e) => setForm({ year: e.target.value, day: clampDay(form.day, form.month, e.target.value) })}>
                <option value="">{t.yearPh}</option>
                {years.map((y) => <option key={y.v} value={y.v}>{y.label}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        {picked ? (
          <div className="picked">
            <div className="stack" style={{ minWidth: 0 }}>
              <span style={{ fontWeight: 600 }}>{cityLabel(picked, lang)}</span>
              <span className="muted-2 small">{picked.tz}</span>
            </div>
            <button type="button" className="btn-ghost" onClick={() => setForm({ cityQuery: '', cityIdx: -1 })}>{t.cityChange}</button>
          </div>
        ) : (
          <div className="stack gap-8">
            <div className="field">
              <label htmlFor="f-city" className="sr-only">{t.step2}</label>
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
            {noMatch && <p id="city-none" className="muted small">{t.cityNone}</p>}
          </div>
        )}

        <button type="submit" className="btn-primary home-submit" disabled={!ready}>{t.analyze}</button>
      </form>
    </section>
  )
}
