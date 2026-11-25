import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { lookup, type Texts } from '../content/predictions'
import type { Result } from '../engine/compute'
import { lifeEvents, type SkyEvent } from '../engine/events'
import { PLANETS, overall, transits } from '../engine/forecast'
import { animalOn } from '../engine/lunar'
import { yearPower } from '../engine/numbers'
import { paperCompute, type SkyCatalog } from '../engine/paper'
import { localToUTC, tzOffsetMin } from '../engine/time'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import { AdSlot } from './AdSlot'
import { ICON, Icon } from './Icons'
import { SkyMap } from './SkyMap'
import { eventLabel, eventReading, travelText } from './travel'

const DAY = 86400000
/** Dial scale: pixels per day (one month ≈ 18 px, one year ≈ 219 px). */
const PX = 0.6
/** How far the dial reaches: from the birth date to this age. */
const YEARS = 90
const STAR = 'M12 2l2.6 6.9 7.4.4-5.8 4.6 2 7.1-6.2-4-6.2 4 2-7.1L2 9.3l7.4-.4z'

interface Props { t: Dict; lang: Lang; res: Result; cat: SkyCatalog | null; texts: Texts; onBack: () => void }

/**
 * Time travel: a focus-ring dial of days from birth to age 90. The sky map above redraws for the day
 * under the gold line (00:00 at the birthplace); ★ marks key sky moments. Everything is computed here,
 * in the browser: the birth date never leaves the device and the chosen day is not put in the URL.
 */
export function TravelView({ t, lang, res, cat, texts, onBack }: Props) {
  const tt = travelText(lang)
  const { inp, city, L, fc } = res
  const th = lang === 'th'
  const birthUtc = Date.UTC(inp.y, inp.m - 1, inp.d)
  const maxDay = Math.round(YEARS * 365.25)
  const clamp = (d: number) => Math.max(0, Math.min(maxDay, Math.round(d)))
  const todayIdx = useMemo(() => {
    const n = new Date()
    return Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - birthUtc) / DAY)
  }, [birthUtc])

  const [day, setDay] = useState(() => Math.max(0, Math.min(maxDay, todayIdx)))
  const [events, setEvents] = useState<SkyEvent[] | null>(null)
  const [sheet, setSheet] = useState(0)            // 0 = closed; otherwise counts openings (fresh ad each time)
  const [half, setHalf] = useState(180)
  const dial = useRef<HTMLDivElement | null>(null)
  const lockUntil = useRef(0)
  const closeBtn = useRef<HTMLButtonElement | null>(null)

  // Key sky moments: computed once, just after the first paint so the dial appears at once.
  useEffect(() => {
    setEvents(null)
    const id = setTimeout(() => {
      const cache = new Map<number, number>()
      const offsetMinAt = (ms: number) => {
        const k = Math.floor(ms / (30 * DAY))
        let v = cache.get(k)
        if (v === undefined) { v = tzOffsetMin(ms, city.tz); cache.set(k, v) }
        return v
      }
      setEvents(lifeEvents({ birth: inp, birthMs: res.ch.ms, natal: fc.natal, lat: city.lat, lon: city.lon, offsetMinAt, years: YEARS }))
    }, 30)
    return () => clearTimeout(id)
  }, [res])

  // Centre the dial on the chosen day; keep the gold line in the middle when the screen resizes.
  useLayoutEffect(() => {
    const el = dial.current
    if (!el) return
    const fit = () => setHalf(el.clientWidth / 2)
    fit()
    el.scrollLeft = day * PX
    addEventListener('resize', fit)
    return () => removeEventListener('resize', fit)
  }, [])

  useEffect(() => { if (sheet) closeBtn.current?.focus() }, [sheet])
  useEffect(() => {
    if (!sheet) return
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setSheet(0) }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [sheet])

  const goTo = (d: number) => {
    const target = clamp(d)
    lockUntil.current = performance.now() + 700
    dial.current?.scrollTo({ left: target * PX, behavior: 'smooth' })
    setDay(target)
  }
  const onScroll = () => {
    if (performance.now() < lockUntil.current || !dial.current) return
    const d = clamp(dial.current.scrollLeft / PX)
    if (d !== day) setDay(d)
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : e.key === 'PageUp' ? -30 : e.key === 'PageDown' ? 30 : 0
    if (e.key === 'Home') { e.preventDefault(); goTo(0) } else if (e.key === 'End') { e.preventDefault(); goTo(maxDay) } else if (step) { e.preventDefault(); goTo(day + step) }
  }

  const dateOf = (i: number) => { const d = new Date(birthUtc + i * DAY); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() } }
  const fmt = (i: number) => new Date(birthUtc + i * DAY).toLocaleDateString(th ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  const ageAt = (i: number) => { const c = dateOf(i); return c.y - inp.y - (c.m < inp.m || (c.m === inp.m && c.d < inp.d) ? 1 : 0) }

  // The sky for the day under the gold line. Deferred so sliding stays smooth.
  const skyDay = useDeferredValue(day)
  const paper = useMemo(() => {
    if (!cat) return null
    const c = dateOf(skyDay)
    const { ms, offsetMin } = localToUTC(c.y, c.m, c.d, 0, 0, city.tz)
    return paperCompute(cat, { ms, lat: city.lat, lon: city.lon, tz: city.tz, offsetMin }, L, lang)
  }, [cat, skyDay, city, L, lang])

  const here = events?.filter((e) => e.day === day) ?? []
  const near = here.length ? null : events?.find((e) => Math.abs(e.day - day) <= 10 && e.kind !== 'birth') ?? null
  const cityName = th ? city.nameTh || city.name : city.name

  // Ticks: months short, years long and labelled. One SVG for the whole dial.
  const dialSvg = useMemo(() => {
    let months = '', years = ''
    const labels: { x: number; y: number }[] = []
    for (let y = inp.y; y <= inp.y + YEARS; y++) {
      for (let m = 0; m < 12; m++) {
        const i = Math.round((Date.UTC(y, m, 1) - birthUtc) / DAY)
        if (i < 0 || i > maxDay) continue
        const x = (i * PX).toFixed(1)
        if (m === 0) { years += `M${x} 34v26`; labels.push({ x: i * PX, y }) } else months += `M${x} 46v14`
      }
    }
    return { months, years, labels }
  }, [inp.y, birthUtc, maxDay])

  // The prediction sheet for the chosen day.
  const reading = useMemo(() => {
    if (!sheet) return null
    const c = dateOf(day)
    const { ms } = localToUTC(c.y, c.m, c.d, 0, 0, city.tz)
    const list = transits(fc.natal, ms, 0, PLANETS).filter((x) => x.level !== 'area').slice(0, 5)
    const age = Math.max(0, ageAt(day))
    const evs = events?.filter((e) => e.day === day) ?? []
    const evText = evs.map((e) => lookup(texts, [`travel.${e.kind}`], lang) ?? eventReading(e, L, lang))
    const contactText = list.length ? lookup(texts, [...list.map((x) => `transit.${x.transit}-${x.natal}`), ...list.map((x) => `transit.${x.transit}`)], lang) : null
    return {
      title: evs.length ? eventLabel(evs[0], L, lang) : tt.quietTitle,
      body: [...evText, contactText ?? (list.length ? '' : tt.noContacts)].filter(Boolean).join('\n\n'),
      rows: list.map((x) => ({ k: th ? `${L.bodies[x.transit]} จร → ${L.bodies[x.natal]} กำเนิด` : `${L.bodies[x.transit]} → birth ${L.bodies[x.natal]}`, v: `${L.levels[x.level]} · ${x.sep}°` })),
      age,
      fortune: overall(age, fc.overallNow.illum, fc.overallNow.eclipsed).value,
      yearPower: yearPower(c.y).value,
      animal: L.animals[animalOn(c.y, c.m, c.d)]
    }
  }, [sheet, day, events, texts, lang])

  const diff = day - todayIdx
  const relClass = diff < 0 ? 'past' : diff > 0 ? 'future' : 'now'

  return (
    <section className="travel" aria-labelledby="travel-title">
      <div className="travel-sky">
        <div className="container travel-top">
          <button type="button" className="btn-ghost" onClick={onBack}><Icon d={ICON.back} size={16} width={1.8} />{tt.back}</button>
          <h1 id="travel-title" className="travel-title">{tt.title}</h1>
        </div>
        <div className="travel-map">
          {paper ? <SkyMap paper={paper} t={t} full /> : <p className="muted small travel-wait">{cat ? '' : tt.loadingSky}</p>}
        </div>
        <p className="muted-2 small travel-note">{tt.skyNote(cityName)}</p>
      </div>

      <div className="travel-readout" aria-live="polite">
        <div className={`travel-rel ${relClass}`}>{diff < 0 && day === 0 ? eventLabel({ day: 0, kind: 'birth' }, L, lang) : tt.rel(diff)}</div>
        <div className="travel-date">{fmt(day)}</div>
        <div className="travel-sub">
          {here.length ? <span className="accent">★ {eventLabel(here[0], L, lang)}</span>
            : near ? <button type="button" className="travel-near" onClick={() => goTo(near.day)}>★ {eventLabel(near, L, lang)} · {fmt(near.day)}</button>
            : <span>{tt.age(Math.max(0, ageAt(day)))}</span>}
        </div>
      </div>

      <div className="travel-dial-wrap">
        <div
          ref={dial} className="travel-dial" onScroll={onScroll} onKeyDown={onKey} tabIndex={0}
          role="slider" aria-label={tt.dialLabel} aria-valuemin={0} aria-valuemax={maxDay} aria-valuenow={day} aria-valuetext={fmt(day)}
        >
          <div className="travel-track" style={{ width: maxDay * PX + half * 2, paddingLeft: half }}>
            <svg width={maxDay * PX + 2} height="80" aria-hidden="true" style={{ position: 'absolute', left: half, top: 0 }}>
              <path d={dialSvg.months} stroke="var(--line-3)" strokeWidth="1" />
              <path d={dialSvg.years} stroke="var(--muted-2)" strokeWidth="1.2" />
              {dialSvg.labels.map((l) => <text key={l.y} x={l.x + 4} y="76" fontSize="11" fill="var(--faint)">{th ? l.y + 543 : l.y}</text>)}
            </svg>
            <span className="travel-nowtag" style={{ left: half + todayIdx * PX }} aria-hidden="true">{tt.now}</span>
            {events?.map((e, i) => (
              <button key={i} type="button" className={`travel-star k-${e.kind}`} style={{ left: half + e.day * PX }}
                onClick={() => goTo(e.day)} aria-label={`${tt.jumpTo} ${eventLabel(e, L, lang)}, ${fmt(e.day)}`} tabIndex={-1}>
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d={STAR} /></svg>
              </button>
            ))}
          </div>
        </div>
        <div className="travel-focus" aria-hidden="true" />
      </div>
      <p className="muted-2 small travel-hint">{events ? tt.dialHint : tt.finding}</p>

      <div className="container travel-actions">
        <div className="row-wrap gap-10 travel-steps">
          <button type="button" className="btn-ghost" onClick={() => goTo(day - 1)}>{tt.minusDay}</button>
          <button type="button" className="btn-ghost travel-today" onClick={() => goTo(todayIdx)}>{tt.tonight}</button>
          <button type="button" className="btn-ghost" onClick={() => goTo(day + 1)}>{tt.plusDay}</button>
        </div>
        <button type="button" className="btn-primary travel-view" onClick={() => setSheet((n) => n + 1)}>{tt.view}</button>
      </div>

      {sheet > 0 && reading && (
        <div className="travel-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setSheet(0) }}>
          <section className="travel-sheet" role="dialog" aria-modal="true" aria-labelledby="travel-sheet-title">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div className="stack gap-2" style={{ flex: 1 }}>
                <span className="muted-2 small">{fmt(day)} · {tt.age(reading.age)}</span>
                <h2 id="travel-sheet-title" className="deck-value" style={{ fontSize: 26 }}>{reading.title}</h2>
              </div>
              <button ref={closeBtn} type="button" className="btn-ghost" onClick={() => setSheet(0)} aria-label={tt.close}>✕</button>
            </div>
            <p className="deck-body">{reading.body}</p>
            {reading.rows.length > 0 && (
              <>
                <h3 className="deck-kicker">{tt.touching}</h3>
                <dl className="deck-rows">{reading.rows.map((r) => <div key={r.k}><dt>{r.k}</dt><dd>{r.v}</dd></div>)}</dl>
              </>
            )}
            <div className="travel-nums">
              <div><span>{tt.fortune}</span><strong>{reading.fortune}</strong></div>
              <div><span>{tt.yearPower}</span><strong>{reading.yearPower}</strong></div>
              <div><span>{tt.animal}</span><strong className="sm">{reading.animal}</strong></div>
            </div>
            <AdSlot key={sheet} label={t.adLabel} />
          </section>
        </div>
      )}
    </section>
  )
}
