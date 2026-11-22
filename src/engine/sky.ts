// Planet, Moon and Sun positions.
// Source: Paul Schlyter, "How to compute planetary positions" — https://stjarnhimlen.se/comp/ppcomp.html
// Sunrise/sunset adapted from https://stjarnhimlen.se/comp/riset.html

export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus'
export type Body = Planet | 'Rahu'

export const RAD = Math.PI / 180

export const rev = (x: number): number => ((x % 360) + 360) % 360

/** Schlyter day number (days since 1999-12-31 00:00 UT) from a UTC timestamp in ms. */
export const dayNum = (ms: number): number => ms / 86400000 + 2440587.5 - 2451543.5

interface Elements { N: number; i: number; w: number; a: number; e: number; M: number }

export function elems(b: Planet, d: number): Elements {
  const table: Record<Planet, number[]> = {
    Sun: [0, 0, 282.9404 + 4.70935e-5 * d, 1, 0.016709 - 1.151e-9 * d, 356.047 + 0.9856002585 * d],
    Moon: [125.1228 - 0.0529538083 * d, 5.1454, 318.0634 + 0.1643573223 * d, 60.2666, 0.0549, 115.3654 + 13.0649929509 * d],
    Mercury: [48.3313 + 3.24587e-5 * d, 7.0047 + 5e-8 * d, 29.1241 + 1.01444e-5 * d, 0.387098, 0.205635 + 5.59e-10 * d, 168.6562 + 4.0923344368 * d],
    Venus: [76.6799 + 2.4659e-5 * d, 3.3946 + 2.75e-8 * d, 54.891 + 1.38374e-5 * d, 0.72333, 0.006773 - 1.302e-9 * d, 48.0052 + 1.6021302244 * d],
    Mars: [49.5574 + 2.11081e-5 * d, 1.8497 - 1.78e-8 * d, 286.5016 + 2.92961e-5 * d, 1.523688, 0.093405 + 2.516e-9 * d, 18.6021 + 0.5240207766 * d],
    Jupiter: [100.4542 + 2.76854e-5 * d, 1.303 - 1.557e-7 * d, 273.8777 + 1.64505e-5 * d, 5.20256, 0.048498 + 4.469e-9 * d, 19.895 + 0.0830853001 * d],
    Saturn: [113.6634 + 2.3898e-5 * d, 2.4886 - 1.081e-7 * d, 339.3939 + 2.97661e-5 * d, 9.55475, 0.055546 - 9.499e-9 * d, 316.967 + 0.0334442282 * d],
    Uranus: [74.0005 + 1.3978e-5 * d, 0.7733 + 1.9e-8 * d, 96.6612 + 3.0565e-5 * d, 19.18171 - 1.55e-8 * d, 0.047318 + 7.45e-9 * d, 142.5905 + 0.011725806 * d]
  }
  const E = table[b]
  return { N: E[0], i: E[1], w: E[2], a: E[3], e: E[4], M: rev(E[5]) }
}

interface Orbit { v: number; r: number; x: number; y: number; z: number }

export function orbit(o: Elements): Orbit {
  const M = o.M * RAD, e = o.e
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M))
  for (let n = 0; n < 8; n++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
  const xv = o.a * (Math.cos(E) - e), yv = o.a * Math.sqrt(1 - e * e) * Math.sin(E)
  const v = Math.atan2(yv, xv) / RAD, r = Math.sqrt(xv * xv + yv * yv)
  const N = o.N * RAD, vw = (v + o.w) * RAD, i = o.i * RAD
  return {
    v, r,
    x: r * (Math.cos(N) * Math.cos(vw) - Math.sin(N) * Math.sin(vw) * Math.cos(i)),
    y: r * (Math.sin(N) * Math.cos(vw) + Math.cos(N) * Math.sin(vw) * Math.cos(i)),
    z: r * Math.sin(vw) * Math.sin(i)
  }
}

const sn = (x: number) => Math.sin(x * RAD)
const cs = (x: number) => Math.cos(x * RAD)

/** Geocentric ecliptic longitude (tropical, equinox of date), degrees. */
export function lon(b: Body, d: number): number {
  const sun = elems('Sun', d), so = orbit(sun)
  const Ls = rev(so.v + sun.w)
  if (b === 'Sun') return Ls
  if (b === 'Rahu') return rev(elems('Moon', d).N)
  const o = elems(b, d), p = orbit(o)
  if (b === 'Moon') {
    let l = Math.atan2(p.y, p.x) / RAD
    const Ms = sun.M, Mm = o.M, Lsm = Ms + sun.w, Lm = Mm + o.w + o.N, D = Lm - Lsm, F = Lm - o.N
    l += -1.274 * sn(Mm - 2 * D) + 0.658 * sn(2 * D) - 0.186 * sn(Ms) - 0.059 * sn(2 * Mm - 2 * D)
      - 0.057 * sn(Mm - 2 * D + Ms) + 0.053 * sn(Mm + 2 * D) + 0.046 * sn(2 * D - Ms) + 0.041 * sn(Mm - Ms)
      - 0.035 * sn(D) - 0.031 * sn(Mm + Ms) - 0.015 * sn(2 * F - 2 * D) + 0.011 * sn(Mm - 4 * D)
    return rev(l)
  }
  let hl = Math.atan2(p.y, p.x) / RAD
  const hb = Math.atan2(p.z, Math.sqrt(p.x * p.x + p.y * p.y)) / RAD
  const Mj = elems('Jupiter', d).M, Msa = elems('Saturn', d).M, Mu = elems('Uranus', d).M
  if (b === 'Jupiter') hl += -0.332 * sn(2 * Mj - 5 * Msa - 67.6) - 0.056 * sn(2 * Mj - 2 * Msa + 21) + 0.042 * sn(3 * Mj - 5 * Msa + 21)
    - 0.036 * sn(Mj - 2 * Msa) + 0.022 * cs(Mj - Msa) + 0.023 * sn(2 * Mj - 3 * Msa + 52) - 0.016 * sn(Mj - 5 * Msa - 69)
  if (b === 'Saturn') hl += 0.812 * sn(2 * Mj - 5 * Msa - 67.6) - 0.229 * cs(2 * Mj - 4 * Msa - 2) + 0.119 * sn(Mj - 2 * Msa - 3)
    + 0.046 * sn(2 * Mj - 6 * Msa - 69) + 0.014 * sn(Mj - 3 * Msa + 32)
  if (b === 'Uranus') hl += 0.04 * sn(Msa - 2 * Mu + 6) + 0.035 * sn(Msa - 3 * Mu + 33) - 0.015 * sn(Mj - Mu + 20)
  const x = p.r * Math.cos(hl * RAD) * Math.cos(hb * RAD) + so.r * Math.cos(Ls * RAD)
  const y = p.r * Math.sin(hl * RAD) * Math.cos(hb * RAD) + so.r * Math.sin(Ls * RAD)
  return rev(Math.atan2(y, x) / RAD)
}

/** Geocentric ecliptic [longitude, latitude] in degrees. */
export function ecl(b: Body, d: number): [number, number] {
  const sun = elems('Sun', d), so = orbit(sun)
  const Ls = rev(so.v + sun.w)
  if (b === 'Sun') return [Ls, 0]
  if (b === 'Rahu') return [rev(elems('Moon', d).N), 0]
  const o = elems(b, d), p = orbit(o)
  if (b === 'Moon') {
    const Ms = sun.M, Mm = o.M, Lm = Mm + o.w + o.N, D = Lm - (Ms + sun.w), F = Lm - o.N
    const lat = Math.atan2(p.z, Math.sqrt(p.x * p.x + p.y * p.y)) / RAD
      - 0.173 * sn(F - 2 * D) - 0.055 * sn(Mm - F - 2 * D) - 0.046 * sn(Mm + F - 2 * D) + 0.033 * sn(F + 2 * D) + 0.017 * sn(2 * Mm + F)
    return [lon('Moon', d), lat]
  }
  const x = p.x + so.r * Math.cos(Ls * RAD), y = p.y + so.r * Math.sin(Ls * RAD)
  return [lon(b, d), Math.atan2(p.z, Math.sqrt(x * x + y * y)) / RAD]
}

/** Lahiri ayanamsa, approximate: 23.853° at J2000 + 50.29″ per year. */
export const ayanamsa = (d: number): number => 23.853 + (d - 1.5) / 365.25 * 0.0139694

export interface SunTimes { noon: number; rise: number | null; set: number | null }

/** d0 = day number at local noon; returns UT hours. */
export function sunTimes(d0: number, lat: number, lonDeg: number): SunTimes {
  const sun = elems('Sun', d0), so = orbit(sun), Ls = rev(so.v + sun.w)
  const eclObl = 23.4393 - 3.563e-7 * d0
  const xe = so.r * Math.cos(Ls * RAD), ye = so.r * Math.sin(Ls * RAD) * Math.cos(eclObl * RAD), ze = so.r * Math.sin(Ls * RAD) * Math.sin(eclObl * RAD)
  const ra = rev(Math.atan2(ye, xe) / RAD), dec = Math.atan2(ze, Math.sqrt(xe * xe + ye * ye)) / RAD
  const eot = rev(sun.M + sun.w - ra + 180) - 180
  const noon = 12 - lonDeg / 15 - eot / 15
  const c = (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * Math.sin(dec * RAD)) / (Math.cos(lat * RAD) * Math.cos(dec * RAD))
  if (c > 1 || c < -1) return { noon, rise: null, set: null }
  const h = Math.acos(c) / RAD / 15
  return { noon, rise: noon - h, set: noon + h }
}
