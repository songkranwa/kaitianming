import type { StarInfo } from '../engine/paper'
import type { Result } from '../engine/compute'
import type { Dict } from '../i18n/dict'
import type { Lang } from '../i18n/types'

export const starText = (st: StarInfo | null): string => (!st ? '—' : st.name ? `${st.name} (${st.designation})` : st.designation)

export const starDetail = (st: StarInfo | null, t: Dict): string =>
  !st ? '' : `${t.conPrefix}${st.constellation_name} · ${t.magPrefix}${st.mag} · ${st.distance_from_zenith_deg}° ${t.toward}${st.bearing}`

export function dateText(res: Result, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH-u-ca-buddhist' : 'en-GB', { dateStyle: 'full', timeZone: 'UTC' })
      .format(new Date(Date.UTC(res.inp.y, res.inp.m - 1, res.inp.d)))
  } catch {
    return `${res.inp.y}-${res.inp.m}-${res.inp.d}`
  }
}
