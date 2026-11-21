// Planets, Moon, Sun and verification links for one birth date and place.

import type { Labels } from '../i18n/labels'
import type { City } from './cities'
import { RAD, ayanamsa, dayNum, lon, rev, sunTimes, type Body } from './sky'
import { localToUTC } from './time'

export interface BirthInput { y: number; m: number; d: number; city: City }

export interface PlanetRow {
  body: Body; num: string; name: string; signTh: string; degText: string; signTrop: string; status: string; retro: boolean | null
}

export interface PlanetData {
  body: Body; name: string; lon_tropical: number; lon_sidereal: number; sign_sidereal: string; sign_tropical: string; retrograde: boolean | null; sign_changes_that_day: boolean
}

export interface Chart {
  ms: number; jd: number; d: number; offsetMin: number; aya: number; ayaText: string
  planets: PlanetRow[]; notes: string[]; hzLinks: { label: string; url: string }[]; dowI: number
  sunSign: string; moonSign: string
  lunar: string; phase: string; illum: number; elong: number; tithi: number
  rise: string; set: string; dayLen: string; noon: string; sunNote: string
  planetData: PlanetData[]
}

const pad = (n: number) => String(n).padStart(2, '0')
export const dms = (x: number): string => { const deg = Math.floor(x), min = Math.floor((x - deg) * 60); return deg + '° ' + pad(min) + '′' }
const fmtH = (h: number | null): string => {
  if (h == null) return '—'
  h = ((h % 24) + 24) % 24
  let hh = Math.floor(h), mi = Math.round((h - hh) * 60)
  if (mi === 60) { hh = (hh + 1) % 24; mi = 0 }
  return pad(hh) + ':' + pad(mi)
}

const ORDER: Body[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Uranus']
const HORIZONS_ID: Partial<Record<Body, string>> = { Sun: '10', Moon: '301', Mercury: '199', Venus: '299', Mars: '499', Jupiter: '599', Saturn: '699', Uranus: '799' }

export function chart(inp: BirthInput, L: Labels): Chart {
  const tzr = localToUTC(inp.y, inp.m, inp.d, 0, 0, inp.city.tz)
  const ms = tzr.ms, offH = tzr.offsetMin / 60
  const d = dayNum(ms), dEnd = d + 0.9999, jd = ms / 86400000 + 2440587.5
  const aya = ayanamsa(d), lat = inp.city.lat, lonDeg = inp.city.lon
  const notes: string[] = [], planets: PlanetRow[] = [], data: PlanetData[] = []

  for (const b of ORDER) {
    const trop = lon(b, d), sid = rev(trop - aya), si = Math.floor(sid / 30)
    let status = L.none, retro: boolean | null = null
    if (b === 'Rahu') { status = L.nodeRetro; retro = true }
    else if (b !== 'Sun' && b !== 'Moon') {
      const mv = rev(lon(b, d + 0.5) - lon(b, d - 0.5) + 180) - 180
      retro = mv < 0; status = retro ? L.retro : L.direct
    }
    const s0 = Math.floor(rev(lon(b, d) - aya) / 30), s1 = Math.floor(rev(lon(b, dEnd) - aya) / 30)
    if (s0 !== s1) notes.push(L.signChange(L.bodies[b], L.signs[s0], L.signs[s1]))
    const signTrop = L.signs[Math.floor(trop / 30)]
    planets.push({ body: b, num: L.nums[b], name: L.bodies[b], signTh: L.signs[si], degText: dms(sid - si * 30), signTrop, status, retro })
    data.push({ body: b, name: L.bodies[b], lon_tropical: Math.round(trop * 1000) / 1000, lon_sidereal: Math.round(sid * 1000) / 1000, sign_sidereal: L.signs[si], sign_tropical: signTrop, retrograde: retro, sign_changes_that_day: s0 !== s1 })
  }

  const sunL = lon('Sun', d), moonL = lon('Moon', d)
  const elong = rev(moonL - sunL), tithi = Math.floor(elong / 12) + 1
  const illum = Math.round((1 - Math.cos(elong * RAD)) / 2 * 100)
  const phase = elong < 6 || elong > 354 ? L.newMoon : Math.abs(elong - 180) < 6 ? L.fullMoon : elong < 180 ? L.waxing : L.waning
  const st = sunTimes(d + 0.5, lat, lonDeg)
  const rise = st.rise != null ? fmtH(st.rise + offH) : '—'
  const set = st.set != null ? fmtH(st.set + offH) : '—'
  let dayLen = '—'
  if (st.rise != null && st.set != null) { const m = Math.round((st.set - st.rise) * 60); dayLen = Math.floor(m / 60) + ' ' + L.hours + ' ' + (m % 60) + ' ' + L.minutes }
  const dowI = new Date(Date.UTC(inp.y, inp.m - 1, inp.d)).getUTCDay()

  const hzLinks = ORDER.filter((b) => HORIZONS_ID[b]).map((b) => {
    const q: Record<string, string> = {
      format: 'text', COMMAND: `'${HORIZONS_ID[b]}'`, OBJ_DATA: "'NO'", MAKE_EPHEM: "'YES'", EPHEM_TYPE: "'OBSERVER'",
      CENTER: "'coord@399'", COORD_TYPE: "'GEODETIC'", SITE_COORD: `'${lonDeg},${lat},0'`, TIME_TYPE: "'UT'",
      START_TIME: `'JD ${jd.toFixed(5)}'`, STOP_TIME: `'JD ${(jd + 1 / 24).toFixed(5)}'`, STEP_SIZE: "'1h'", QUANTITIES: "'31'"
    }
    return { label: L.bodies[b], url: 'https://ssd.jpl.nasa.gov/api/horizons.api?' + Object.keys(q).map((k) => k + '=' + encodeURIComponent(q[k])).join('&') }
  })

  return {
    ms, jd, d, offsetMin: tzr.offsetMin, aya, ayaText: dms(aya),
    planets, notes, hzLinks, dowI,
    sunSign: L.signs[Math.floor(rev(sunL - aya) / 30)], moonSign: L.signs[Math.floor(rev(moonL - aya) / 30)],
    lunar: L.lunarDay(tithi), phase, illum, elong, tithi,
    rise, set, dayLen, noon: fmtH(st.noon + offH),
    sunNote: st.rise != null ? L.thaiDayNote(rise, L.days[(dowI + 6) % 7]) : L.noCoords,
    planetData: data
  }
}
