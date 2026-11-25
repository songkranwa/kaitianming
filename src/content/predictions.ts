// Prediction texts. The site owner edits them at /admin; they are stored in the D1 database and
// served (all at once, never per visitor) from GET /api/predictions. The browser picks the right
// ones itself, so no birth data is ever sent.
//
// Each reading looks up a list of keys and shows the first one that has text, so a specific text
// (e.g. one number pair) overrides a general one (e.g. the difference between the numbers).
// The full list of keys lives in ./slots.ts.

import { useEffect, useState } from 'react'
import type { Lang } from '../i18n/types'

export interface PredictionText { th?: string; en?: string }
export type Texts = Record<string, PredictionText>

export function lookup(texts: Texts, keys: string[], lang: Lang): string | null {
  const other: Lang = lang === 'th' ? 'en' : 'th'
  for (const k of keys) {
    const t = texts[k]?.[lang] || texts[k]?.[other]
    if (t) return t
  }
  return null
}

/** Loads the lock level of each topic once (set in the admin). Until it arrives, every topic is open. */
export type TopicLocks = Record<string, { level: 'free' | 'member' | 'premium'; scope: 'all' | 'details' }>
export function useTopicLocks(): TopicLocks {
  const [locks, setLocks] = useState<TopicLocks>({})
  useEffect(() => {
    let alive = true
    fetch('/api/locks')
      .then((r) => (r.ok ? (r.json() as Promise<TopicLocks>) : {}))
      .then((l) => { if (alive) setLocks(l) })
      .catch(() => { /* offline: everything stays open */ })
    return () => { alive = false }
  }, [])
  return locks
}

/** Loads all texts once. Falls back to none (the page then shows "being written"). */
export function usePredictionTexts(): Texts {
  const [texts, setTexts] = useState<Texts>({})
  useEffect(() => {
    let alive = true
    fetch('/api/predictions')
      .then((r) => (r.ok ? (r.json() as Promise<Texts>) : {}))
      .then((t) => { if (alive) setTexts(t) })
      .catch(() => { /* offline or API not set up yet */ })
    return () => { alive = false }
  }, [])
  return texts
}
