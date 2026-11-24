// The sky paper (spec sections A–F): zenith, personal star, bodies, overlaps, brightness, drawing paths.
// Star data, constellation lines and boundaries: d3-celestial (Olaf Frohn, BSD 3-Clause) in /data/sky-catalog.json.

import type { Labels, OverlapLevel } from '../i18n/labels'
import type { Lang } from '../i18n/types'
import { RAD, ayanamsa, dayNum, ecl, rev, type Planet } from './sky'
import { Areas, MAIN, RADIUS_RULE, isMain } from './areas'
import { ConstellationFinder, altaz, around, gmst, offset, precess, sep, type Bounds, type RaDec } from './skymap'

export interface SkyCatalog {
  cons: Record<string, { la: string; th: string; c: RaDec; c2?: RaDec }>
  lines: Record<string, RaDec[][]>
  bounds: Bounds
  /** [ra2000, dec2000, mag, designation, name] */
  stars: [number, number, number, string, string][]
}

export interface PaperInput { ms: number; lat: number; lon: number; tz: string; offsetMin: number }

interface Placed { alt: number; az: number; zd: number; x: number; y: number }

/**
 * Star value (owner's rule, 24 Nov 2026): height above the horizon seen from the birthplace,
 * horizon 0° … overhead 90°, in 10° steps: 0–10° → 1, 10–20° → 2 … 80–90° → 9.
 * Below the horizon there is no value yet (0) until the owner decides.
 */
export const starValue = (alt: number): number => (alt < 0 ? 0 : Math.min(9, Math.floor(alt / 10) + 1))

export interface StarInfo {
  name: string; designation: string; constellation: string | null; constellation_name: string
  mag: number; distance_from_zenith_deg: number; bearing: string
}

export interface PaperBody {
  key: Planet; name: string; color: string; weight: number; ra: number; dec: number
  /** con = deepest main-constellation area the body sits on; cons = all of them (owner's area rule). */
  con: string | null; cons: string[]; territory: string[]; sidI: number; trop: string; p: Placed
}

export interface Overlap {
  a: string; b: string; separation_deg: number; level: OverlapLevel; level_name: string; shared_constellation: string | null
}

export interface BrightnessResult {
  blockers: string[]; darkness: number; state_index: number; state: string
}

export interface MapLabel { text: string; left: string; top: string; weight: string; color: string; size: string }
export interface MapMarker { name: string; color: string; left: string; top: string; opacity: string; ring: string }

export interface Paper {
  lst: number; zenRa: number; zenCon: string | null; zenName: string
  /** false when the zenith lies on no main-constellation area and zenCon is only the nearest one. */
  zenOnArea: boolean; zenCons: string[]
  personal: StarInfo; bright: StarInfo | null; nearby: StarInfo[]
  surroundings: { bearing: string; at20: string | null; at20Name: string; at45: string | null; at45Name: string }[]
  bodies: PaperBody[]; overlaps: Overlap[]
  brightness: { birth_sign: BrightnessResult & { sign: string }; zenith_constellation: BrightnessResult & { constellation: string } }
  draw: { starsUp: string[]; starsDown: string; linesUp: string; linesDown: string; labels: MapLabel[]; markers: MapMarker[] }
  json: Record<string, unknown>
}

const BODIES: [Planet, string, number][] = [
  ['Sun', '#F2C94C', 3], ['Moon', '#ECEAE2', 3], ['Mercury', '#9DB4FF', 1], ['Venus', '#F7E3B5', 1],
  ['Mars', '#F28B6B', 1], ['Jupiter', '#E8B07A', 2], ['Saturn', '#CDB77E', 2], ['Uranus', '#8FD6D0', 1]
]

export const THRESHOLDS = { overlap_deg: 1, touching_deg: 5, territory_deg: 15, weights: { Sun: 3, Moon: 3, Jupiter: 2, Saturn: 2, other: 1 } }

const f1 = (v: number) => Math.round(v * 10) / 10

let finderCache: { bounds: Bounds; finder: ConstellationFinder } | null = null
function finderFor(bounds: Bounds): ConstellationFinder {
  if (!finderCache || finderCache.bounds !== bounds) finderCache = { bounds, finder: new ConstellationFinder(bounds) }
  return finderCache.finder
}
let areasCache: { cat: SkyCatalog; areas: Areas } | null = null
function areasFor(cat: SkyCatalog): Areas {
  if (!areasCache || areasCache.cat !== cat) areasCache = { cat, areas: new Areas(cat.lines, cat.stars) }
  return areasCache.areas
}

export function paperCompute(cat: SkyCatalog, inp: PaperInput, L: Labels, lang: Lang): Paper {
  const finder = finderFor(cat.bounds)
  const d = dayNum(inp.ms), jd = inp.ms / 86400000 + 2440587.5
  const lst = rev(gmst(jd) + inp.lon), lat = inp.lat
  const R = 480, C = 500
  const dirOf = (az: number) => L.dirs[Math.round(rev(az) / 45) % 8]
  const place = (ra: number, dec: number): Placed => {
    const aa = altaz(ra, dec, lst, lat), zd = 90 - aa[0], r = Math.sin(zd / 2 * RAD)
    return { alt: aa[0], az: aa[1], zd, x: -r * Math.sin(aa[1] * RAD), y: -r * Math.cos(aa[1] * RAD) }
  }
  const px = (p: Placed): [number, number] => [C + p.x * R, C + p.y * R]
  const conName = (id: string | null) => { const c = id ? cat.cons[id] : undefined; return c ? (lang === 'th' ? c.th : c.la) : '—' }
  const conAt = (ra2000: number, dec2000: number) => finder.at(ra2000, dec2000)

  const areas = areasFor(cat)
  const zj = precess(lst, lat, jd, -1)
  const zenHits = areas.at(zj[0], zj[1])
  /** Zenith constellation by the area rule; if the zenith lies on no area, the nearest main constellation. */
  const zenOnArea = zenHits.length > 0
  const zenCon = zenOnArea ? zenHits[0].id : areas.nearest(zj[0], zj[1]).id
  const zenCons = zenHits.map((h) => h.id)
  const areaAt = (ra2000: number, dec2000: number): string | null => areas.at(ra2000, dec2000)[0]?.id ?? null

  const stars = cat.stars.map((s) => {
    const e = precess(s[0], s[1], jd, 1)
    return { ra: s[0], dec: s[1], mag: s[2], desig: s[3], name: s[4], p: place(e[0], e[1]) }
  })
  type Star = (typeof stars)[number]
  const byZd = stars.slice().sort((a, b) => a.p.zd - b.p.zd)
  const label = (st: Star): StarInfo => {
    const con = conAt(st.ra, st.dec)
    const ds = st.desig.startsWith('HIP') ? st.desig : st.desig + ' ' + con
    return { name: st.name || '', designation: ds, constellation: con, constellation_name: conName(con), mag: st.mag, distance_from_zenith_deg: f1(st.p.zd), bearing: dirOf(st.p.az) }
  }
  const personal = label(byZd[0])
  const brightS = byZd.find((s) => s.mag <= 2.0)
  const nearby = byZd.filter((s) => s.p.zd <= 12).sort((a, b) => a.mag - b.mag).slice(0, 6).map(label)

  const surroundings = L.dirs.map((nm, i) => {
    const at = (z: number) => { const q = offset(lst, lat, z, i * 45), j = precess(q[0], q[1], jd, -1); return areaAt(j[0], j[1]) }
    const c20 = at(20), c45 = at(45)
    return { bearing: nm, at20: c20, at20Name: conName(c20), at45: c45, at45Name: conName(c45) }
  })

  const eps = 23.4393 - 3.563e-7 * d
  const toEq = (Lg: number, B: number): RaDec => {
    const l = Lg * RAD, b = B * RAD, e = eps * RAD
    const x = Math.cos(b) * Math.cos(l)
    const y = Math.cos(b) * Math.sin(l) * Math.cos(e) - Math.sin(b) * Math.sin(e)
    const z = Math.cos(b) * Math.sin(l) * Math.sin(e) + Math.sin(b) * Math.cos(e)
    return [rev(Math.atan2(y, x) / RAD), Math.asin(z) / RAD]
  }
  const aya = ayanamsa(d)
  const bodies: PaperBody[] = BODIES.map(([key, color, weight]) => {
    const ec = ecl(key, d), eq = toEq(ec[0], ec[1]), p = place(eq[0], eq[1]), j = precess(eq[0], eq[1], jd, -1)
    const cons = areas.at(j[0], j[1]).map((h) => h.id), con = cons[0] ?? null, terr = new Set<string>()
    for (const r of [5, 10, 15]) for (let t = 0; t < 360; t += 30) {
      const q = around(j[0], j[1], r, t)
      for (const h of areas.at(q[0], q[1])) if (!cons.includes(h.id)) terr.add(h.id)
    }
    return { key, name: L.bodies[key], color, weight, ra: eq[0], dec: eq[1], con, cons, territory: [...terr], sidI: Math.floor(rev(ec[0] - aya) / 30), trop: L.signs[Math.floor(ec[0] / 30)], p }
  })

  const overlaps: Overlap[] = []
  for (let a = 0; a < bodies.length; a++) for (let b = a + 1; b < bodies.length; b++) {
    const A = bodies[a], B = bodies[b], s = sep(A.ra, A.dec, B.ra, B.dec)
    const shared = A.cons.find((c) => B.cons.includes(c)) ?? null
    const lvl: OverlapLevel | null = s <= THRESHOLDS.overlap_deg ? 'overlap' : s <= THRESHOLDS.touching_deg ? 'touch' : shared ? 'area' : null
    if (lvl) overlaps.push({ a: A.name, b: B.name, separation_deg: f1(s), level: lvl, level_name: L.levels[lvl], shared_constellation: shared ? conName(shared) : null })
  }
  const rank: Record<OverlapLevel, number> = { overlap: 0, touch: 1, area: 2 }
  overlaps.sort((x, y) => rank[x.level] - rank[y.level] || x.separation_deg - y.separation_deg)

  const stateI = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : 3)
  const score = (arr: PaperBody[]) => arr.reduce((t, x) => t + x.weight, 0)
  const result = (arr: PaperBody[]): BrightnessResult => {
    const s = score(arr)
    return { blockers: arr.map((x) => x.name), darkness: s, state_index: stateI(s), state: L.states[stateI(s)] }
  }
  const sunB = bodies[0]
  const brightness = {
    birth_sign: { sign: L.signs[sunB.sidI], ...result(bodies.filter((x) => x.key !== 'Sun' && x.sidI === sunB.sidI)) },
    zenith_constellation: { constellation: conName(zenCon), ...result(bodies.filter((x) => x.cons.includes(zenCon))) }
  }

  // Drawing paths (SVG viewBox 0 0 1000 1000)
  const bins: [number, number, number][] = [[-9, 1, 9], [1, 2, 6.5], [2, 3, 4.6], [3, 4, 3.2], [4, 9, 2.1]]
  const dot = (x: number, y: number, r: number) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
  const starsUp = bins.map(() => '')
  let starsDown = ''
  for (const s of stars) {
    let bi = 0
    while (bi < bins.length - 1 && s.mag >= bins[bi][1]) bi++
    const q = px(s.p), str = dot(q[0], q[1], bins[bi][2])
    if (s.p.alt >= 0) starsUp[bi] += str; else starsDown += str
  }
  let linesUp = '', linesDown = ''
  for (const id of Object.keys(cat.lines)) {
    if (!isMain(id)) continue
    for (const pl of cat.lines[id]) {
      let prev: { p: Placed; q: [number, number] } | null = null
      for (const pt of pl) {
        const e = precess(pt[0], pt[1], jd, 1), p = place(e[0], e[1]), q = px(p)
        if (prev) {
          const jump = Math.abs(q[0] - prev.q[0]) + Math.abs(q[1] - prev.q[1])
          if (jump < 300) {
            const seg = `M${f1(prev.q[0])} ${f1(prev.q[1])}L${f1(q[0])} ${f1(q[1])}`
            if (p.alt >= 0 && prev.p.alt >= 0) linesUp += seg; else linesDown += seg
          }
        }
        prev = { p, q }
      }
    }
  }
  const labels: MapLabel[] = []
  for (const id of Object.keys(cat.cons)) {
    if (!isMain(id)) continue
    const cc = cat.cons[id]
    for (const c of [cc.c, cc.c2]) {
      if (!c) continue
      const e = precess(c[0], c[1], jd, 1), p = place(e[0], e[1])
      if (p.alt < 3 && id !== zenCon) continue
      const z = id === zenCon
      labels.push({ text: lang === 'th' ? cc.th : cc.la, left: f1(50 + p.x * 48) + '%', top: f1(50 + p.y * 48) + '%', weight: z ? '700' : '400', color: z ? '#F4F1E8' : '#9EA3C8', size: z ? '15px' : '12px' })
    }
  }
  const markers: MapMarker[] = bodies.map((b) => ({
    name: b.name, color: b.color, left: f1(50 + b.p.x * 48) + '%', top: f1(50 + b.p.y * 48) + '%',
    opacity: b.p.alt >= 0 ? '1' : '0.55', ring: b.p.alt >= 0 ? 'none' : '1px dashed ' + b.color
  }))

  return {
    lst, zenRa: lst, zenCon, zenName: zenCon ? conName(zenCon) : '—', zenOnArea, zenCons,
    personal, bright: brightS ? label(brightS) : null, nearby, surroundings,
    bodies, overlaps, brightness,
    draw: { starsUp, starsDown, linesUp, linesDown, labels, markers },
    json: {
      moment: { local: '00:00', utc_offset_min: inp.offsetMin, jd_ut: Math.round(jd * 100000) / 100000, lst_deg: f1(lst) },
      observer: { lat, lon: inp.lon, timezone: inp.tz },
      zenith: {
        ra_deg_date: f1(lst), dec_deg: lat, constellation: zenCon, constellation_name: zenCon ? conName(zenCon) : null,
        on_constellation_area: zenOnArea, constellations_covering: zenCons.map(conName),
        personal_star: personal, nearby_stars: nearby,
        surroundings: surroundings.map((r) => ({ bearing: r.bearing, at_20deg: r.at20Name, at_45deg: r.at45Name }))
      },
      bodies: bodies.map((b) => ({
        body: b.key, name: b.name, constellation: b.con, constellation_name: conName(b.con), constellations: b.cons.map(conName),
        territory_15deg: b.territory.map(conName), sign_sidereal: L.signs[b.sidI], sign_tropical: b.trop,
        paper: { distance_deg: f1(b.p.zd), bearing_deg: f1(b.p.az), bearing: dirOf(b.p.az), x: Math.round(b.p.x * 1000) / 1000, y: Math.round(b.p.y * 1000) / 1000 },
        above_horizon: b.p.alt >= 0,
        altitude_deg: f1(b.p.alt),
        star_value: starValue(b.p.alt)
      })),
      overlaps,
      brightness,
      thresholds: THRESHOLDS,
      constellation_areas: { main_constellations: MAIN, rule: 'union of circles around each figure star; ' + RADIUS_RULE },
      paper_projection: 'Lambert azimuthal equal-area, centre = zenith, horizon at r = 0.707, nadir at r = 1; x>0 = west, y>0 = south (as seen looking up)'
    }
  }
}
