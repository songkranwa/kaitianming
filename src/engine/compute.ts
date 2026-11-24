// One complete result for a birth date + city, in one language.

import { labels, type Labels } from '../i18n/labels'
import type { Lang } from '../i18n/types'
import { chart, type Chart } from './chart'
import type { City } from './cities'
import { forecast, type Forecast } from './forecast'
import { animalOn } from './lunar'
import { numberPowers, type NumberPowers } from './numbers'
import { paperCompute, type Paper, type SkyCatalog } from './paper'

export const ENGINE_VERSION = '0.4.0'

export interface Result {
  L: Labels; city: City; inp: { y: number; m: number; d: number }
  ch: Chart; np: NumberPowers; pp: Paper | null; animal: string; fc: Forecast
  json: Record<string, unknown>
}

export function computeResult(y: number, m: number, d: number, city: City, lang: Lang, catalog: SkyCatalog | null, now = new Date()): Result {
  const L = labels(lang)
  const ch = chart({ y, m, d, city }, L)
  const np = numberPowers(d, m, y, now, lang)
  const animal = L.animals[animalOn(y, m, d)]
  const fc = forecast(ch.ms, { y, m, d }, ch.illum, np, now)
  const pp = catalog ? paperCompute(catalog, { ms: ch.ms, lat: city.lat, lon: city.lon, tz: city.tz, offsetMin: ch.offsetMin }, L, lang) : null
  const json: Record<string, unknown> = {
    engine_version: ENGINE_VERSION,
    birth: {
      date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, weekday: L.days[ch.dowI],
      city: city.name, city_th: city.nameTh || null, country: city.cc, lat: city.lat, lon: city.lon,
      timezone: city.tz, utc_offset_min: ch.offsetMin, time_assumed: '00:00 local'
    },
    julian_day_ut: Math.round(ch.jd * 100000) / 100000,
    ayanamsa_lahiri_deg: Math.round(ch.aya * 10000) / 10000,
    planets: ch.planetData,
    moon: { elongation_deg: Math.round(ch.elong * 100) / 100, tithi: ch.tithi, lunar_day: ch.lunar, phase: ch.phase, illumination_pct: ch.illum },
    sun: { rise_local: ch.rise, set_local: ch.set, day_length: ch.dayLen },
    basics: { chinese_zodiac: animal },
    number_powers: np.json,
    forecast: {
      computed_at: new Date(fc.now).toISOString(), natal_tropical_lon: fc.natal,
      day_vs_year: fc.dayVsYear, day_vs_next_year: fc.dayVsNext,
      transits_today: fc.today, transits_next_30_days: fc.month, transits_next_365_days: fc.year,
      sign_tropical: fc.sign, chinese_zodiac: fc.animal,
      overall_now: fc.overallNow, overall_next_year: fc.overallNext
    },
    caveats: ch.notes
  }
  if (pp) json.sky_paper = pp.json
  return { L, city, inp: { y, m, d }, ch, np, pp, animal, fc, json }
}
