import { useEffect, useState } from 'react'
import { CityIndex, type CityData } from '../engine/cities'
import type { SkyCatalog } from '../engine/paper'

export type LoadState<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error' }

function useJson<T, R>(url: string, build: (raw: T) => R): LoadState<R> {
  const [state, setState] = useState<LoadState<R>>({ status: 'loading' })
  useEffect(() => {
    let alive = true
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() as Promise<T> })
      .then((raw) => { if (alive) setState({ status: 'ready', data: build(raw) }) })
      .catch(() => { if (alive) setState({ status: 'error' }) })
    return () => { alive = false }
  }, [url])
  return state
}

export const useCities = () => useJson<CityData, CityIndex>('/data/cities.json', (raw) => new CityIndex(raw))
export const useCatalog = () => useJson<SkyCatalog, SkyCatalog>('/data/sky-catalog.json', (raw) => raw)
