import type { Paper } from '../engine/paper'
import type { Dict } from '../i18n/dict'

interface Props {
  paper: Paper; t: Dict; full?: boolean
  /** Borderless: no discs or rings, only the sky above the horizon, for full-width night-sky heroes. */
  bare?: boolean
  /** Draws the chart owner's star ("You") with this label. */
  youLabel?: string
  /** Added to the label when the owner's star is below the horizon on this night. */
  youBelow?: string
}

/** The sky paper: zenith at the centre, equal-area projection, horizon at r = 0.707. */
export function SkyMap({ paper, t, full, bare, youLabel, youBelow }: Props) {
  const dw = paper.draw
  const fills = ['#FFFFFF', '#F7F6F0', '#ECECF4', '#DADCEB', '#C9CBE0']
  const markerSize = full ? 14 : 12
  const markers = bare ? dw.markers.filter((m) => m.opacity === '1') : dw.markers
  return (
    <div className={'sky-wrap' + (bare ? ' sky-bare' : '')} style={bare ? undefined : { maxWidth: full ? 640 : 460 }}>
      <svg viewBox="0 0 1000 1000" role="img" aria-label={t.mapAria + paper.zenName}>
        {!bare && <circle cx="500" cy="500" r="480" fill="#0A0C1C" stroke="#2E325A" strokeWidth="2" />}
        {!bare && <circle cx="500" cy="500" r="339.4" fill="#161A3C" stroke="#5A6098" strokeWidth="2.5" />}
        {full && !bare && <circle cx="500" cy="500" r="240" fill="none" stroke="#2E325A" strokeWidth="1.5" strokeDasharray="6 8" />}
        {full && !bare && <circle cx="500" cy="500" r="124.2" fill="none" stroke="#2E325A" strokeWidth="1.5" strokeDasharray="6 8" />}
        {!bare && <path d={dw.linesDown} fill="none" stroke="#2F3460" strokeWidth="1.4" />}
        <path d={dw.linesUp} fill="none" stroke="#6C75B6" strokeWidth={bare ? 1.4 : 1.8} opacity={bare ? 0.7 : 1} />
        {!bare && <path d={dw.starsDown} fill="#7E83A8" opacity="0.5" />}
        {[4, 3, 2, 1, 0].map((i) => <path key={i} d={dw.starsUp[i]} fill={fills[i]} />)}
        {!bare && <circle cx="500" cy="500" r={full ? 20 : 22} fill="none" stroke="var(--accent)" strokeWidth={full ? 2.5 : 3} />}
        {!bare && <path d={full ? 'M480 500h40M500 480v40' : 'M478 500h44M500 478v44'} stroke="var(--accent)" strokeWidth={full ? 2.5 : 3} />}
        {full && !bare && (
          <g fontSize="24" fill="#B8BAD3" textAnchor="middle">
            <text x="500" y="146">{t.mapN}</text><text x="500" y="872">{t.mapS}</text>
            <text x="128" y="508">{t.mapE}</text><text x="872" y="508">{t.mapW}</text>
          </g>
        )}
      </svg>
      {full && dw.labels.map((lo, i) => (
        <span key={i} className="sky-label" aria-hidden="true" style={{ left: lo.left, top: lo.top, fontSize: lo.size, fontWeight: Number(lo.weight), color: lo.color }}>{lo.text}</span>
      ))}
      {markers.map((mk) => (
        <span key={mk.name} className="sky-marker" aria-hidden="true" style={{ left: mk.left, top: mk.top, transform: `translate(-${markerSize / 2}px, -${markerSize / 2}px)`, opacity: Number(mk.opacity) }}>
          <span className="dot" style={{ width: markerSize, height: markerSize, background: mk.color, outline: mk.ring }} />
          <span className="name" style={{ fontSize: full ? 13 : 12, color: mk.color }}>{mk.name}</span>
        </span>
      ))}
      {youLabel && (
        <span className={'sky-you' + (dw.you.above ? '' : ' below')} style={{ left: dw.you.left, top: dw.you.top }}>
          <span className="sky-you-glow" aria-hidden="true" />
          <span className="sky-you-text"><strong>{youLabel}</strong>{dw.you.name && <small>{dw.you.name}{!dw.you.above && youBelow ? ' · ' + youBelow : ''}</small>}</span>
        </span>
      )}
    </div>
  )
}
