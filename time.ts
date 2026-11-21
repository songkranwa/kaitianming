// Historical time-zone offsets from the IANA Time Zone Database, through the browser's Intl.

export function tzOffsetMin(ms: number, zone: string): number {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hourCycle: 'h23',
    year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
  })
  const p: Record<string, string> = {}
  for (const x of f.formatToParts(new Date(ms))) p[x.type] = x.value
  const asUTC = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour) % 24, Number(p.minute), Number(p.second))
  return Math.round((asUTC - ms) / 60000)
}

/** Local wall-clock time in `zone` → UTC timestamp and the offset in force then. */
export function localToUTC(y: number, m: number, d: number, hh: number, mm: number, zone: string): { ms: number; offsetMin: number } {
  const guess = Date.UTC(y, m - 1, d, hh, mm)
  const o1 = tzOffsetMin(guess, zone)
  let t = guess - o1 * 60000
  const o2 = tzOffsetMin(t, zone)
  if (o2 !== o1) t = guess - o2 * 60000
  return { ms: t, offsetMin: tzOffsetMin(t, zone) }
}

export function fmtOffset(min: number): string {
  const s = min < 0 ? '−' : '+', a = Math.abs(min)
  return 'UTC' + s + Math.floor(a / 60) + (a % 60 ? ':' + String(a % 60).padStart(2, '0') : '')
}
