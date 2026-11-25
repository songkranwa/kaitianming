import { useMemo } from 'react'

/** Decorative full-bleed night sky (same stars on every visit). The real sky of each date is drawn by SkyMap. */
export function NightSky() {
  const stars = useMemo(() => {
    let s = 7
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
    return Array.from({ length: 220 }, (_, i) => ({ x: rnd() * 100, y: rnd() * 100, r: [0.5, 0.6, 0.8, 1, 1.3, 1.7][Math.floor(rnd() * 6)], o: 0.35 + rnd() * 0.65, tw: i % 13 === 0 }))
  }, [])
  return (
    <svg className="night-sky" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
      {stars.map((st, i) => <circle key={i} className={st.tw ? 'tw' : undefined} cx={st.x} cy={st.y} r={st.r * 0.12} fill="#F4F1E8" opacity={st.o} />)}
    </svg>
  )
}
