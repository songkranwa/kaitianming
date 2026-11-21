import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalcView, type CalcTab } from './components/CalcView'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HomeView } from './components/HomeView'
import { PremiumView } from './components/PremiumView'
import { PwaToast } from './components/PwaToast'
import { ResultView } from './components/ResultView'
import { SettingsView } from './components/SettingsView'
import { cityLabel } from './engine/cities'
import { computeResult } from './engine/compute'
import { useCatalog, useCities } from './hooks/useData'
import { dict } from './i18n/dict'
import { detectLang, type Lang } from './i18n/types'

export type View = 'home' | 'result' | 'calc' | 'premium' | 'settings'

/** Birth details live only in memory: never in the URL, storage, or any request. */
export interface BirthForm { day: string; month: string; year: string; cityQuery: string; cityIdx: number }

const PATHS: Partial<Record<View, string>> = { premium: '/premium', settings: '/settings' }
const viewFromPath = (): View => (location.pathname.startsWith('/premium') ? 'premium' : location.pathname.startsWith('/settings') ? 'settings' : 'home')

interface InstallEvent extends Event { prompt: () => Promise<void> }

function readBool(key: string): boolean {
  try { return localStorage.getItem(key) === '1' } catch { return false }
}
function writeSetting(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* storage unavailable */ }
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(detectLang)
  const [view, setView] = useState<View>(viewFromPath)
  const [form, setFormState] = useState<BirthForm>({ day: '', month: '', year: '', cityQuery: '', cityIdx: -1 })
  const [calcTab, setCalcTab] = useState<CalcTab>('time')
  const [adsPersonal, setAdsPersonal] = useState(() => readBool('ktm.adsPersonal'))
  const [installEvt, setInstallEvt] = useState<InstallEvent | null>(null)
  const cities = useCities()
  const catalog = useCatalog()
  const t = dict(lang)

  const setForm = useCallback((f: Partial<BirthForm>) => setFormState((s) => ({ ...s, ...f })), [])

  const setLang = (l: Lang) => {
    setLangState(l)
    writeSetting('ktm.lang', l)
    if (cities.status === 'ready' && form.cityIdx >= 0) setForm({ cityQuery: cityLabel(cities.data.get(form.cityIdx), l) })
  }

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  useEffect(() => {
    const onPop = (e: PopStateEvent) => setView((e.state && (e.state as { view?: View }).view) || viewFromPath())
    const onInstall = (e: Event) => { e.preventDefault(); setInstallEvt(e as InstallEvent) }
    addEventListener('popstate', onPop)
    addEventListener('beforeinstallprompt', onInstall)
    history.replaceState({ view: viewFromPath() }, '')
    return () => { removeEventListener('popstate', onPop); removeEventListener('beforeinstallprompt', onInstall) }
  }, [])

  const go = (v: View) => {
    setView(v)
    history.pushState({ view: v }, '', PATHS[v] ?? '/')
    scrollTo(0, 0)
  }

  const ready = !!(form.day && form.month && form.year) && form.cityIdx >= 0 && cities.status === 'ready'
  const showResult = (view === 'result' || view === 'calc') && ready
  const shown: View = showResult ? view : view === 'premium' || view === 'settings' ? view : 'home'

  const cat = catalog.status === 'ready' ? catalog.data : null
  const res = useMemo(() => {
    if (!showResult || cities.status !== 'ready') return null
    return computeResult(Number(form.year), Number(form.month), Number(form.day), cities.data.get(form.cityIdx), lang, cat)
  }, [showResult, cities, form.year, form.month, form.day, form.cityIdx, lang, cat])

  useEffect(() => {
    const titles: Record<View, string> = { home: '', result: t.resultTitle, calc: t.calcTitle, premium: t.premiumTitle, settings: t.settingsTitle }
    document.title = (titles[shown] ? titles[shown] + ' · ' : '') + 'Kaitianming 开天命'
  }, [shown, t])

  const navTo = (v: View) => go(v === 'home' && ready && (view === 'result' || view === 'calc') ? 'result' : v)

  return (
    <>
      <a className="skip-link" href="#main">{t.skipToContent}</a>
      <Header t={t} lang={lang} view={shown} onNav={navTo} onLang={setLang} />
      <main id="main">
        {shown === 'home' && <HomeView t={t} lang={lang} form={form} setForm={setForm} cities={cities} ready={ready} onSubmit={() => { setCalcTab('time'); go('result') }} />}
        {shown === 'result' && res && <ResultView t={t} lang={lang} res={res} catalogError={catalog.status === 'error'} onBack={() => go('home')} onCalc={() => go('calc')} />}
        {shown === 'calc' && res && <CalcView t={t} lang={lang} res={res} catalogError={catalog.status === 'error'} tab={calcTab} setTab={setCalcTab} onBack={() => go('result')} />}
        {shown === 'premium' && <PremiumView t={t} />}
        {shown === 'settings' && (
          <SettingsView t={t} lang={lang} onLang={setLang}
            adsPersonal={adsPersonal} onAdsPersonal={(v) => { setAdsPersonal(v); writeSetting('ktm.adsPersonal', v ? '1' : '0') }}
            canInstall={!!installEvt} onInstall={() => { installEvt?.prompt(); setInstallEvt(null) }} />
        )}
      </main>
      <Footer t={t} lang={lang} />
      <PwaToast t={t} />
    </>
  )
}
