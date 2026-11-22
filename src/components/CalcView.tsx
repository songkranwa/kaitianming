import { useState, type KeyboardEvent } from 'react'
import { cityLabel, coordText } from '../engine/cities'
import type { Result } from '../engine/compute'
import { ENGINE_VERSION } from '../engine/compute'
import { fmtOffset } from '../engine/time'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'
import { AdSlot } from './AdSlot'
import { dateText, starDetail, starText } from './format'
import { ICON, Icon } from './Icons'
import { SkyMap } from './SkyMap'

export type CalcTab = 'time' | 'planets' | 'sky' | 'numbers' | 'raw'
const TABS: CalcTab[] = ['time', 'planets', 'sky', 'numbers', 'raw']

interface Props { t: Dict; lang: Lang; res: Result; catalogError: boolean; tab: CalcTab; setTab: (t: CalcTab) => void; onBack: () => void }

export function CalcView({ t, lang, res, catalogError, tab, setTab, onBack }: Props) {
  const tabLabel: Record<CalcTab, string> = { time: t.tabTime, planets: t.tabPlanets, sky: t.tabSky, numbers: t.tabNumbers, raw: t.tabRaw }
  const date = dateText(res, lang), place = cityLabel(res.city, lang)
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length]
    setTab(next)
    document.getElementById('tab-' + next)?.focus()
  }
  return (
    <section className="container page" style={{ gap: 24 }} aria-labelledby="calc-title">
      <div className="stack gap-10">
        <button type="button" className="btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={onBack}><Icon d={ICON.back} size={16} width={1.8} />{t.backToSummary}</button>
        <h1 id="calc-title" className="page-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}>{t.calcTitle}</h1>
        <p className="muted" style={{ fontSize: 16 }}>{t.calcSub} · {date} · {place}</p>
      </div>
      <div role="tablist" aria-label={t.calcTitle} className="tabs">
        {TABS.map((k, i) => (
          <button key={k} id={'tab-' + k} type="button" role="tab" aria-selected={tab === k} aria-controls={'panel-' + k} tabIndex={tab === k ? 0 : -1}
            onClick={() => setTab(k)} onKeyDown={(e) => onKey(e, i)}>{tabLabel[k]}</button>
        ))}
      </div>
      <div id={'panel-' + tab} role="tabpanel" aria-labelledby={'tab-' + tab} className="stack" style={{ gap: 20 }}>
        {tab === 'time' && <TimePanel t={t} res={res} date={date} place={place} />}
        {tab === 'planets' && <PlanetsPanel t={t} res={res} />}
        {tab === 'sky' && <SkyPanel t={t} res={res} catalogError={catalogError} />}
        {tab === 'numbers' && <NumbersPanel t={t} res={res} />}
        {tab === 'raw' && <RawPanel t={t} res={res} />}
      </div>
      <AdSlot label={t.adLabel} />
    </section>
  )
}

function TimePanel({ t, res, date, place }: { t: Dict; res: Result; date: string; place: string }) {
  const { ch, pp, city } = res
  const rows: [string, string][] = [
    [t.trDate, date], [t.trPlace, place], [t.trCoords, coordText(city.lat, city.lon).replace(' ', ', ')], [t.trTz, city.tz],
    [t.trLocal, '00:00'], [t.trOffset, fmtOffset(ch.offsetMin)], [t.trUT, new Date(ch.ms).toISOString().replace('.000Z', 'Z')],
    [t.trJD, (Math.round(ch.jd * 100000) / 100000).toFixed(5)],
    [t.trLST, pp ? `${Math.round(pp.lst / 15 * 1000) / 1000} h (${Math.round(pp.lst * 10) / 10}°)` : '…'],
    [t.trZenith, pp ? `${Math.round(pp.zenRa * 10) / 10}°, ${city.lat.toFixed(2)}°` : '…'],
    [t.trAya, ch.ayaText], [t.trEngine, ENGINE_VERSION]
  ]
  return (
    <div className="card" style={{ gap: 8 }}>
      <h2 style={{ marginBottom: 8 }}>{t.timeTrace}</h2>
      {rows.map(([k, v]) => <div key={k} className="trace-row"><span className="muted">{k}</span><span className="v">{v}</span></div>)}
    </div>
  )
}

function PlanetsPanel({ t, res }: { t: Dict; res: Result }) {
  const { ch } = res
  const kv = (rows: [string, string][]) => (
    <div className="kv">{rows.map(([k, v]) => <div key={k} className="stack"><span className="muted-2 small">{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>)}</div>
  )
  return (
    <>
      <div className="card">
        <div className="stack gap-4"><h2>{t.planetsTitle}</h2><p className="muted" style={{ fontSize: 15 }}>{t.planetsSub} ({ch.ayaText})</p></div>
        <div className="table-scroll"><div className="t-planets stack">
          <div className="trow head"><span>{t.colBody}</span><span>{t.colSignTh}</span><span>{t.colDeg}</span><span>{t.colSignTrop}</span><span>{t.colMotion}</span></div>
          {ch.planets.map((p) => (
            <div key={p.body} className="trow" style={{ fontSize: 16 }}>
              <span style={{ fontWeight: 600 }}><span className="serif accent" style={{ marginRight: 8 }}>{p.num}</span>{p.name}</span>
              <span>{p.signTh}</span><span className="num">{p.degText}</span><span className="muted">{p.signTrop}</span>
              <span style={{ color: p.retro && p.body !== 'Rahu' ? 'var(--warn)' : 'var(--muted)' }}>{p.status}</span>
            </div>
          ))}
        </div></div>
        {ch.notes.length > 0 && <ul className="muted" style={{ paddingLeft: 20, listStyle: 'disc', fontSize: 15 }}>{ch.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
      </div>
      <div className="grid grid-300">
        <div className="card" style={{ gap: 12 }}><h2 className="sm">{t.moonTitle}</h2>
          {kv([[t.lunarDay, ch.lunar], [t.moonPhase, ch.phase], [t.moonLit, ch.illum + '%'], [t.moonElong, Math.round(ch.elong) + '°']])}
        </div>
        <div className="card" style={{ gap: 12 }}><h2 className="sm">{t.sunTitle}</h2>
          {kv([[t.sunrise, ch.rise], [t.sunset, ch.set], [t.dayLength, ch.dayLen], [t.solarNoon, ch.noon]])}
          <p className="muted small">{ch.sunNote}</p>
        </div>
      </div>
    </>
  )
}

function SkyPanel({ t, res, catalogError }: { t: Dict; res: Result; catalogError: boolean }) {
  const { pp, L } = res
  if (!pp) return catalogError ? <p role="alert" style={{ color: 'var(--warn)' }}>{t.loadingError}</p> : <p role="status" className="muted">{t.loadingSky}</p>
  const json = pp.json as { bodies: { name: string; constellation_name: string; sign_sidereal: string; territory_15deg: string[]; paper: { distance_deg: number; bearing: string }; above_horizon: boolean }[] }
  const bs = pp.brightness
  const blockers = (b: { blockers: string[]; darkness: number }) => (b.blockers.length ? `${t.blockersBy}: ${b.blockers.join(', ')} (${b.darkness})` : t.blockersNone)
  return (
    <>
      <div className="card" style={{ gap: 18 }}>
        <div className="stack gap-4"><h2>{t.skyTitle}</h2><p className="muted" style={{ fontSize: 15, maxWidth: 820 }}>{t.skySub}</p></div>
        <div className="row-wrap" style={{ gap: 28, alignItems: 'flex-start' }}>
          <div className="stack gap-10" style={{ flex: '1 1 440px', minWidth: 0 }}>
            <SkyMap paper={pp} t={t} full />
            <p className="muted-2 small" style={{ textAlign: 'center' }}>{t.mapLegend}</p>
          </div>
          <div className="stack gap-16" style={{ flex: '1 1 300px', minWidth: 0 }}>
            <div className="stack gap-2"><span className="muted-2 small">{t.zenithCon}</span><span className="serif accent" style={{ fontSize: 24 }}>{pp.zenName}</span></div>
            <div className="stack gap-2"><span className="muted-2 small">{t.personalStar}</span><span style={{ fontSize: 19, fontWeight: 600 }}>{starText(pp.personal)}</span><span className="muted small">{starDetail(pp.personal, t)}</span></div>
            <div className="stack gap-2"><span className="muted-2 small">{t.brightStar}</span><span style={{ fontSize: 19, fontWeight: 600 }}>{starText(pp.bright)}</span><span className="muted small">{starDetail(pp.bright, t)}</span></div>
            <div className="stack gap-8"><span className="muted-2 small">{t.nearbyStars}</span>
              <ul className="stack gap-6">{pp.nearby.map((st) => (
                <li key={st.designation} className="row-wrap between" style={{ gap: 8, fontSize: 15, borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
                  <span>{starText(st)}</span><span className="muted-2">{t.magPrefix}{st.mag} · {st.distance_from_zenith_deg}°</span>
                </li>
              ))}</ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="stack gap-4"><h2 className="sm">{t.surroundTitle}</h2><p className="muted" style={{ fontSize: 15 }}>{t.surroundSub}</p></div>
        <div className="table-scroll"><div className="t-around stack">
          <div className="trow head"><span>{t.colDir}</span><span>{t.col20}</span><span>{t.col45}</span></div>
          {pp.surroundings.map((r) => <div key={r.bearing} className="trow" style={{ fontSize: 16, padding: '10px 4px' }}><span className="muted">{r.bearing}</span><span>{r.at20Name}</span><span>{r.at45Name}</span></div>)}
        </div></div>
      </div>

      <div className="card">
        <div className="stack gap-4"><h2 className="sm">{t.bodiesTitle}</h2><p className="muted" style={{ fontSize: 15 }}>{t.bodiesSub}</p></div>
        <div className="table-scroll"><div className="t-bodies stack">
          <div className="trow head"><span>{t.colBody}</span><span>{t.colCon}</span><span>{t.colSign}</span><span>{t.colDist}</span><span>{t.colDir}</span><span>{t.colTerr}</span></div>
          {json.bodies.map((b, i) => (
            <div key={b.name} className="trow">
              <span className="row-wrap gap-8" style={{ gap: 8, fontWeight: 600, flexWrap: 'nowrap' }}><span className="swatch" style={{ background: pp.bodies[i].color }} />{b.name}</span>
              <span>{b.constellation_name}</span><span>{b.sign_sidereal}</span>
              <span className="num">{b.paper.distance_deg}°{b.above_horizon ? L.above : L.below}</span>
              <span className="muted">{b.paper.bearing}</span><span className="muted">{b.territory_15deg.join(', ') || '—'}</span>
            </div>
          ))}
        </div></div>
      </div>

      <div className="grid grid-300">
        <div className="card" style={{ gap: 12 }}>
          <h2 className="sm">{t.overlapsTitle}</h2>
          <p className="muted small">{t.overlapsRule}</p>
          {pp.overlaps.length > 0 ? (
            <ul className="stack gap-10 list-rows">{pp.overlaps.map((o) => (
              <li key={o.a + o.b}>
                <span className="row-wrap" style={{ gap: 10, alignItems: 'baseline' }}><span style={{ fontWeight: 600 }}>{o.a} – {o.b}</span><span className="accent small" style={{ fontWeight: 600 }}>{o.level_name}</span></span>
                <span className="muted small">{o.separation_deg}°{o.shared_constellation ? ' · ' + o.shared_constellation : ''}</span>
              </li>
            ))}</ul>
          ) : <p>{t.noOverlaps}</p>}
        </div>
        <div className="card" style={{ gap: 12 }}>
          <h2 className="sm">{t.brightTitle}</h2>
          <p className="muted small">{t.brightRule}</p>
          {([[t.brightBirth, bs.birth_sign.sign, bs.birth_sign], [t.brightZenith, bs.zenith_constellation.constellation, bs.zenith_constellation]] as const).map(([label, target, b]) => (
            <div key={label} className="stack gap-2" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
              <span className="muted-2 small">{label}</span>
              <span className="row-wrap" style={{ gap: 10, alignItems: 'baseline' }}><span style={{ fontWeight: 600 }}>{target}</span><span className="serif accent" style={{ fontSize: 20 }}>{b.state}</span></span>
              <span className="muted small">{blockers(b)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function NumbersPanel({ t, res }: { t: Dict; res: Result }) {
  const { np, ch, L, animal } = res
  return (
    <div className="card" style={{ gap: 16 }}>
      <div className="stack gap-4"><h2>{t.powersTitle}</h2><p className="muted" style={{ fontSize: 15 }}>{t.powersSub}</p></div>
      <div className="grid grid-220">
        {np.rows.map((r) => (
          <div key={r.label} className="power"><span className="muted-2 small">{r.label}</span><span className="power-value">{r.value}</span><span className="muted small num">{r.working}</span></div>
        ))}
      </div>
      <div className="stack">
        {np.compare.map((c) => (
          <div key={c.label} className="trace-row" style={{ fontSize: 16, padding: '10px 4px', gap: '8px 16px' }}>
            <span className="muted">{c.label}</span><span><span style={{ fontWeight: 600 }}>{c.value}</span> · <span className="accent" style={{ fontWeight: 600 }}>{c.rel}</span></span>
          </div>
        ))}
      </div>
      <div className="grid grid-180">
        {([[t.lifeNumber, String(np.life)], [t.weekday, L.days[ch.dowI]], [t.chineseZodiac, animal]] as const).map(([k, v]) => (
          <div key={k} className="stack"><span className="muted-2 small">{k}</span><span style={{ fontWeight: 600, fontSize: 18 }}>{v}</span></div>
        ))}
      </div>
    </div>
  )
}

function RawPanel({ t, res }: { t: Dict; res: Result }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="card" style={{ gap: 12 }}>
        <h2 className="sm">{t.horizonsTitle}</h2>
        <p className="muted" style={{ fontSize: 15 }}>{t.horizonsSub}</p>
        <div className="row-wrap" style={{ gap: 10 }}>
          {res.ch.hzLinks.map((h) => <a key={h.label} className="btn-ghost" href={h.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{h.label}</a>)}
        </div>
      </div>
      <div className="card-alt" style={{ gap: 12, borderRadius: 18, padding: 24 }}>
        <div className="row-wrap between" style={{ gap: 12 }}>
          <div className="stack gap-2"><h2 style={{ fontSize: 18, fontWeight: 600 }}>{t.rawTitle}</h2><p className="muted small">{t.rawSub}</p></div>
          <button type="button" className="btn-ghost" aria-expanded={open} aria-controls="raw-json" onClick={() => setOpen(!open)}>{open ? t.hideData : t.showData}</button>
        </div>
        {open && <pre id="raw-json" className="json">{JSON.stringify(res.json, null, 2)}</pre>}
      </div>
    </>
  )
}
