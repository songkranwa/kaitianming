// City search over the GeoNames extract in /data/cities.json (CC BY 4.0).

import type { Lang } from '../i18n/types'

export interface CityData {
  v: number
  source: string
  fields: string[]
  tz: string[]
  /** [name, nameTh, countryCode, lat, lon, tzIndex, population] */
  c: [string, string, string, number, number, number, number][]
}

export interface City {
  idx: number
  name: string
  nameTh: string
  cc: string
  lat: number
  lon: number
  tz: string
  pop: number
}

export const norm = (s: string): string => {
  let x = String(s || '').toLowerCase()
  try { x = x.normalize('NFD').replace(/[̀-ͯ]/g, '') } catch { /* old browsers */ }
  return x.trim()
}

const regionNames: Partial<Record<Lang, Intl.DisplayNames | null>> = {}

export function countryName(cc: string, lang: Lang): string {
  if (!(lang in regionNames)) {
    try { regionNames[lang] = new Intl.DisplayNames([lang], { type: 'region' }) } catch { regionNames[lang] = null }
  }
  try { return regionNames[lang]?.of(cc) || cc } catch { return cc }
}

export class CityIndex {
  private normNames: string[]

  constructor(private data: CityData) {
    this.normNames = data.c.map((r) => norm(r[0]))
  }

  get size(): number { return this.data.c.length }

  get(i: number): City {
    const r = this.data.c[i]
    return { idx: i, name: r[0], nameTh: r[1], cc: r[2], lat: r[3], lon: r[4], tz: this.data.tz[r[5]], pop: r[6] }
  }

  /** Up to `limit` matches: prefix or word-start matches first (list is sorted by population), then substrings. */
  search(q: string, limit = 8): number[] {
    const n = norm(q)
    if (n.length < 2) return []
    const qt = q.trim(), c = this.data.c, out: number[] = [], seen = new Set<number>()
    for (let i = 0; i < c.length && out.length < limit; i++) {
      const nm = this.normNames[i]
      if (nm.startsWith(n) || nm.includes(' ' + n) || nm.includes('-' + n) || (c[i][1] && c[i][1].startsWith(qt))) { out.push(i); seen.add(i) }
    }
    for (let i = 0; i < c.length && out.length < limit; i++) {
      if (!seen.has(i) && (this.normNames[i].indexOf(n) > 0 || (c[i][1] && c[i][1].indexOf(qt) > 0))) out.push(i)
    }
    return out
  }
}

export function cityLabel(c: City, lang: Lang): string {
  const nm = lang === 'th' && c.nameTh ? c.nameTh : c.name
  return nm + ', ' + countryName(c.cc, lang)
}

export const coordText = (lat: number, lon: number, digits = 2): string =>
  Math.abs(lat).toFixed(digits) + '°' + (lat >= 0 ? 'N' : 'S') + ' ' + Math.abs(lon).toFixed(digits) + '°' + (lon >= 0 ? 'E' : 'W')
