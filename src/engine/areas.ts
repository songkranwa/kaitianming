// Constellation areas (owner's rule, 24 Nov 2026).
// Only the main constellations count: the 12 zodiac constellations plus every constellation that holds
// a star of magnitude 1.5 or brighter. A constellation's area is the union of circles drawn around each
// star of its figure; brighter stars reach further. A point (a planet, the zenith) is influenced by every
// main constellation whose area it lies on — possibly several, possibly none.

import { sep, type RaDec } from './skymap'

export const ZODIAC = ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc']
/** Constellations holding a star of magnitude ≤ 1.5 (from the star catalogue). */
export const BRIGHT_STAR = ['CMa', 'Car', 'Boo', 'Cen', 'Lyr', 'Aur', 'Ori', 'CMi', 'Eri', 'Aql', 'Cru', 'PsA', 'Cyg']
export const MAIN = [...ZODIAC, ...BRIGHT_STAR]
export const isMain = (id: string | null) => !!id && MAIN.includes(id)

/** Radius (degrees) that a figure star of this magnitude spreads around itself. */
export const radiusFor = (mag: number): number => (mag <= 1 ? 8 : mag <= 2 ? 6 : mag <= 3 ? 4 : 3)
export const RADIUS_RULE = 'magnitude ≤1 → 8°, ≤2 → 6°, ≤3 → 4°, fainter → 3°'

interface AreaStar { ra: number; dec: number; r: number }
export interface AreaHit { id: string; /** degrees inside the nearest star's circle (bigger = deeper) */ depth: number }

export class Areas {
  private stars: Record<string, AreaStar[]> = {}

  constructor(lines: Record<string, RaDec[][]>, catalogStars: [number, number, number, string, string][]) {
    for (const id of MAIN) {
      const seen = new Set<string>(), out: AreaStar[] = []
      for (const line of lines[id] ?? []) for (const [ra, dec] of line) {
        const k = ra + ',' + dec
        if (seen.has(k)) continue
        seen.add(k)
        const hit = catalogStars.find((s) => Math.abs(s[0] - ra) < 0.05 && Math.abs(s[1] - dec) < 0.05)
        out.push({ ra, dec, r: radiusFor(hit ? hit[2] : 9) })
      }
      this.stars[id] = out
    }
  }

  /** Main constellations whose area covers this J2000 point, deepest first. */
  at(ra: number, dec: number): AreaHit[] {
    const hits: AreaHit[] = []
    for (const id of MAIN) {
      let best = -Infinity
      for (const s of this.stars[id]) {
        const d = s.r - sep(ra, dec, s.ra, s.dec)
        if (d > best) best = d
      }
      if (best >= 0) hits.push({ id, depth: Math.round(best * 10) / 10 })
    }
    return hits.sort((a, b) => b.depth - a.depth)
  }

  /** The main constellation whose area edge is closest (used for the zenith when it lies on no area). */
  nearest(ra: number, dec: number): AreaHit {
    let id = MAIN[0], best = -Infinity
    for (const c of MAIN) for (const s of this.stars[c]) {
      const d = s.r - sep(ra, dec, s.ra, s.dec)
      if (d > best) { best = d; id = c }
    }
    return { id, depth: Math.round(best * 10) / 10 }
  }
}
