// Coordinate tools for the sky map.
// Precession: IAU 1976 (Lieske et al., 1977). GMST: Meeus, Astronomical Algorithms (1998).

import { RAD, rev } from './sky'

export type Vec3 = [number, number, number]
export type RaDec = [number, number]

export const gmst = (jd: number): number => rev(280.46061837 + 360.98564736629 * (jd - 2451545.0))

/** Precess between J2000 and the epoch of jd. dir = 1: J2000 → date; dir = -1: date → J2000. */
export function precess(ra: number, dec: number, jd: number, dir: 1 | -1): RaDec {
  const T = (jd - 2451545.0) / 36525
  const zeta = (2306.2181 * T + 0.30188 * T * T) / 3600
  const z = (2306.2181 * T + 1.09468 * T * T) / 3600
  const th = (2004.3109 * T - 0.42665 * T * T) / 3600
  if (dir < 0) {
    const a0 = (ra - z) * RAD, d0 = dec * RAD, t = th * RAD
    const A1 = Math.cos(d0) * Math.sin(a0)
    const B1 = Math.cos(t) * Math.cos(d0) * Math.cos(a0) + Math.sin(t) * Math.sin(d0)
    const C1 = -Math.sin(t) * Math.cos(d0) * Math.cos(a0) + Math.cos(t) * Math.sin(d0)
    return [rev(Math.atan2(A1, B1) / RAD - zeta), Math.asin(C1) / RAD]
  }
  const a = (ra + zeta) * RAD, d = dec * RAD, tt = th * RAD
  const A = Math.cos(d) * Math.sin(a)
  const B = Math.cos(tt) * Math.cos(d) * Math.cos(a) - Math.sin(tt) * Math.sin(d)
  const C = Math.sin(tt) * Math.cos(d) * Math.cos(a) + Math.cos(tt) * Math.sin(d)
  return [rev(Math.atan2(A, B) / RAD + z), Math.asin(C) / RAD]
}

/** [altitude, azimuth] in degrees (azimuth from north through east). */
export function altaz(ra: number, dec: number, lst: number, lat: number): [number, number] {
  const H = (lst - ra) * RAD, d = dec * RAD, p = lat * RAD
  const sa = Math.sin(d) * Math.sin(p) + Math.cos(d) * Math.cos(p) * Math.cos(H)
  const alt = Math.asin(Math.max(-1, Math.min(1, sa)))
  const az = Math.atan2(-Math.cos(d) * Math.sin(H), Math.sin(d) * Math.cos(p) - Math.cos(d) * Math.sin(p) * Math.cos(H))
  return [alt / RAD, rev(az / RAD)]
}

/** The point at zenith distance zd toward azimuth az, as RA/Dec of date. */
export function offset(lst: number, lat: number, zd: number, az: number): RaDec {
  const alt = (90 - zd) * RAD, A = az * RAD, p = lat * RAD
  const sd = Math.sin(alt) * Math.sin(p) + Math.cos(alt) * Math.cos(p) * Math.cos(A)
  const dec = Math.asin(sd)
  const H = Math.atan2(-Math.sin(A) * Math.cos(alt), Math.sin(alt) * Math.cos(p) - Math.cos(alt) * Math.sin(p) * Math.cos(A))
  return [rev(lst - H / RAD), dec / RAD]
}

export const vec = (ra: number, dec: number): Vec3 => [
  Math.cos(dec * RAD) * Math.cos(ra * RAD),
  Math.cos(dec * RAD) * Math.sin(ra * RAD),
  Math.sin(dec * RAD)
]

/** Stereographic projection centred on (ra, dec). */
export function frame(ra: number, dec: number): (v: Vec3) => [number, number] {
  const c = vec(ra, dec)
  const e: Vec3 = [-Math.sin(ra * RAD), Math.cos(ra * RAD), 0]
  const n: Vec3 = [c[1] * e[2] - c[2] * e[1], c[2] * e[0] - c[0] * e[2], c[0] * e[1] - c[1] * e[0]]
  return (v) => {
    const s = 1 + v[0] * c[0] + v[1] * c[1] + v[2] * c[2]
    return [(v[0] * e[0] + v[1] * e[1] + v[2] * e[2]) / s, (v[0] * n[0] + v[1] * n[1] + v[2] * n[2]) / s]
  }
}

function densify(ring: RaDec[]): RaDec[] {
  const out: RaDec[] = []
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    const dra = ((b[0] - a[0] + 540) % 360) - 180, ddec = b[1] - a[1]
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dra), Math.abs(ddec))))
    for (let s = 0; s < steps; s++) out.push([a[0] + dra * s / steps, a[1] + ddec * s / steps])
  }
  return out
}

export type Bounds = Record<string, RaDec[][]>

/** Finds which IAU constellation contains a J2000 point. */
export class ConstellationFinder {
  private dense: Record<string, { ring: RaDec[]; vecs: Vec3[] }[]> = {}

  constructor(bounds: Bounds) {
    for (const id of Object.keys(bounds)) {
      this.dense[id] = bounds[id].map((r) => {
        const ring = densify(r)
        return { ring, vecs: ring.map((q) => vec(q[0], q[1])) }
      })
    }
  }

  at(ra: number, dec: number): string | null {
    const proj = frame(ra, dec), c0 = vec(ra, dec)
    for (const id of Object.keys(this.dense)) {
      for (const { vecs } of this.dense[id]) {
        if (!vecs.some((v) => v[0] * c0[0] + v[1] * c0[1] + v[2] * c0[2] > 0)) continue
        const P = vecs.map(proj)
        let inside = false
        for (let a = 0, b = P.length - 1; a < P.length; b = a++) {
          if ((P[a][1] > 0) !== (P[b][1] > 0) && 0 < (P[b][0] - P[a][0]) * (0 - P[a][1]) / (P[b][1] - P[a][1]) + P[a][0]) inside = !inside
        }
        if (inside) return id
      }
    }
    return null
  }
}

/** The point `dist` degrees from (ra, dec) toward position angle `bearing`. */
export function around(ra: number, dec: number, dist: number, bearing: number): RaDec {
  const d = dec * RAD, r = dist * RAD, b = bearing * RAD
  const d2 = Math.asin(Math.sin(d) * Math.cos(r) + Math.cos(d) * Math.sin(r) * Math.cos(b))
  const ra2 = ra * RAD + Math.atan2(Math.sin(b) * Math.sin(r) * Math.cos(d), Math.cos(r) - Math.sin(d) * Math.sin(d2))
  return [rev(ra2 / RAD), d2 / RAD]
}

/** Angular separation in degrees. */
export function sep(ra1: number, d1: number, ra2: number, d2: number): number {
  const a = vec(ra1, d1), b = vec(ra2, d2)
  return Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) / RAD
}
