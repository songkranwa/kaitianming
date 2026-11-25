import type { ReactNode } from 'react'
import type { Paper } from '../engine/paper'
import type { Dict } from '../i18n/dict'
import { SkyMap } from './SkyMap'

/** Full-width night sky with no border: the real sky map, bleeding off the edges, with text laid over it. */
export function SkyHero({ paper, t, youLabel, youBelow, children, footer }: { paper: Paper | null; t: Dict; youLabel?: string; youBelow?: string; children?: ReactNode; footer?: ReactNode }) {
  return (
    <div className="sky-hero">
      <div className="sky-hero-map">{paper && <SkyMap paper={paper} t={t} full bare youLabel={youLabel} youBelow={youBelow} />}</div>
      <div className="container sky-hero-top">{children}</div>
      {footer && <div className="container sky-hero-foot">{footer}</div>}
    </div>
  )
}
