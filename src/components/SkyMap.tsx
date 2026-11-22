import type { Paper } from '../engine/paper'
import type { Dict } from '../i18n/dict'

/** The sky paper: zenith at the centre, equal-area projection, horizon at r = 0.707. */
export function SkyMap({ paper, t, full }: { paper: Paper; t: Dict; full?: boolean }) {
  const dw = paper.draw
  const fills = ['#FFFFFF', '#F7F6F0', '#ECECF4', '#DADCEB', '#C9CBE0']
  const markerSize = full ? 14 : 12
  return (
    <div className="sky-wrap" style={{ maxWidth: full ? 640 : 460 }}>
      <svg viewBox="0 0 1000 1000" role="img" aria-label={t.mapAria + paper.zenName}>
        <circle cx="500" cy="500" r="480" fill="#0A0C1C" stroke="#2E325A" strokeWidth="2" />
        <circle cx="500" cy="500" r="339.4" fill="#161A3C" stroke="#5A6098" strokeWidth="2.5" />
        {full && <circle cx="500" cy="500" r="240" fill="none" stroke="#2E325A" strokeWidth="1.5" strokeDasharray="6 8" />}
        {full && <circle cx="500" cy="500" r="124.2" fill="none" stroke="#2E325A" strokeWidth="1.5" strokeDasharray="6 8" />}
        <path d={dw.linesDown} fill="none" stroke="#2F3460" strokeWidth="1.4" />
        <path d={dw.linesUp} fill="none" stroke="#6C75B6" strokeWidth="1.8" />
        <path d={dw.starsDown} fill="#7E83A8" opacity="0.5" />
        {[4, 3, 2, 1, 0].map((i) => <path key={i} d={dw.starsUp[i]} fill={fills[i]} />)}
        <circle cx="500" cy="500" r={full ? 20 : 22} fill="none" stroke="var(--accent)" strokeWidth={full ? 2.5 : 3} />
        <path d={full ? 'M480 500h40M500 480v40' : 'M478 500h44M500 478v44'} stroke="var(--accent)" strokeWidth={full ? 2.5 : 3} />
        {full && (
          <g fontSize="24" fill="#B8BAD3" textAnchor="middle">
            <text x="500" y="146">{t.mapN}</text><text x="500" y="872">{t.mapS}</text>
            <text x="128" y="508">{t.mapE}</text><text x="872" y="508">{t.mapW}</text>
          </g>
        )}
      </svg>
      {full && dw.labels.map((lo, i) => (
        <span key={i} className="sky-label" aria-hidden="true" style={{ left: lo.left, top: lo.top, fontSize: lo.size, fontWeight: Number(lo.weight), color: lo.color }}>{lo.text}</span>
      ))}
      {dw.markers.map((mk) => (
        <span key={mk.name} className="sky-marker" aria-hidden="true" style={{ left: mk.left, top: mk.top, transform: `translate(-${markerSize / 2}px, -${markerSize / 2}px)`, opacity: Number(mk.opacity) }}>
          <span className="dot" style={{ width: markerSize, height: markerSize, background: mk.color, outline: mk.ring }} />
          <span className="name" style={{ fontSize: full ? 13 : 12, color: mk.color }}>{mk.name}</span>
        </span>
      ))}
    </div>
  )
}
