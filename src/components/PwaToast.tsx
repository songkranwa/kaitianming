import { useRegisterSW } from 'virtual:pwa-register/react'
import type { Dict } from '../i18n/dict'

/** Shows a small notice when the app is ready offline or when a new version is waiting. */
export function PwaToast({ t }: { t: Dict }) {
  const { offlineReady: [offlineReady, setOfflineReady], needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW()
  if (!offlineReady && !needRefresh) return null
  const close = () => { setOfflineReady(false); setNeedRefresh(false) }
  return (
    <div className="toast" role="status">
      <span>{needRefresh ? t.updateReady : t.offlineReady}</span>
      {needRefresh && <button type="button" className="btn-ghost" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }} onClick={() => updateServiceWorker(true)}>{t.updateNow}</button>}
      <button type="button" className="btn-ghost" onClick={close}>{t.dismiss}</button>
    </div>
  )
}
