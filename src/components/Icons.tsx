// Icons drawn for this site (SVG).

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="var(--accent)" strokeWidth="1.6" aria-hidden="true">
      <circle cx="16" cy="16" r="13" /><circle cx="16" cy="16" r="6" /><path d="M16 1v6M16 25v6M1 16h6M25 16h6" />
    </svg>
  )
}

export function Icon({ d, size = 24, stroke = 'currentColor', width = 1.6 }: { d: string; size?: number; stroke?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export const ICON = {
  back: 'M15 18l-6-6 6-6',
  calc: 'M4 6h16M4 12h10M4 18h7M17 15l3 3-3 3',
  book: 'M4 19.5V5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM8 7h6M8 11h6',
  check: 'M5 12l5 5L20 7'
}
