// Placeholder for an ad unit. Ads are not connected yet; when they are,
// they must never receive the visitor's birth date or place.
export function AdSlot({ label }: { label: string }) {
  return <div role="note" className="ad-slot">{label}</div>
}
