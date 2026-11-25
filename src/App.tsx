import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminView } from './components/AdminView'
import { CalcView, type CalcTab } from './components/CalcView'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HomeView } from './components/HomeView'
import { LegalView } from './components/LegalView'
import { LoginView } from './components/LoginView'
import { PremiumView } from './components/PremiumView'
import { PwaToast } from './components/PwaToast'
import { ResultView } from './components/ResultView'
import { SettingsView } from './components/SettingsView'
import { TravelView } from './components/TravelView'
import { usePredictionTexts, useTopicLocks } from './content/predictions'
import { cityLabel } from './engine/cities'
import { computeResult } from './engine/compute'
import { useCatalog, useCities } from './hooks/useData'
import { dict } from './i18n/dict'
import { detectLang, type Lang } from './i18n/types'

export type View = 'home' | 'result' | 'calc' | 'travel' | 'premium' | 'settings' | 'login' | 'admin' | 'privacy' | 'terms'

/** Birth details live only in memory: never in the URL, storage, or any request. */
export interface BirthForm { day: string; month: string; year: string; cityQuery: string; cityIdx: number }

const PATHS: Partial<Record<View, string>> = { premium: '/premium', settings: '/settings', login: '/login', admin: '/admin', privacy: '/privacy', terms: '/terms' }
const viewFromPath = (): View => {
  const p = location.pathname
  return p.startsWith('/premium') ? 'premium' : p.startsWith('/settings') ? 'settings' : p.startsWith('/login') ? 'login' : p.startsWith('/admin') ? 'admin' : p.startsWith('/privacy') ? 'privacy' : p.startsWith('/terms') ? 'terms' : 'home'
}

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
  const texts = usePredictionTexts()
  const locks = useTopicLocks()
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
  const showResult = (view === 'result' || view === 'calc' || view === 'travel') && ready
  const shown: View = showResult ? view : view === 'premium' || view === 'settings' || view === 'login' || view === 'admin' || view === 'privacy' || view === 'terms' ? view : 'home'

  const cat = catalog.status === 'ready' ? catalog.data : null
  const cons = useMemo(() => (cat ? Object.fromEntries(Object.entries(cat.cons).map(([id, c]) => [id, c.th || c.la])) : {}), [cat])
  const res = useMemo(() => {
    if (!showResult || cities.status !== 'ready') return null
    return computeResult(Number(form.year), Number(form.month), Number(form.day), cities.data.get(form.cityIdx), lang, cat)
  }, [showResult, cities, form.year, form.month, form.day, form.cityIdx, lang, cat])

  useEffect(() => {
    const titles: Record<View, string> = { home: '', result: t.resultTitle, calc: t.calcTitle, travel: lang === 'th' ? 'เดินทางข้ามช่วงเวลา' : 'Travel through time', premium: t.premiumTitle, settings: t.settingsTitle, login: t.loginTitle, admin: 'Admin', privacy: lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy policy', terms: lang === 'th' ? 'ข้อกำหนดการใช้งาน' : 'Terms of use' }
    document.title = (titles[shown] ? titles[shown] + ' · ' : '') + 'Kaitianming 开天命'
  }, [shown, t])

  const navTo = (v: View) => go(v === 'home' && ready && (view === 'result' || view === 'calc' || view === 'travel') ? 'result' : v)

  return (
    <>
      <a className="skip-link" href="#main">{t.skipToContent}</a>
      <Header t={t} view={shown} onNav={navTo} />
      <main id="main">
        {shown === 'home' && <HomeView t={t} lang={lang} form={form} setForm={setForm} cities={cities} ready={ready} onSubmit={() => { setCalcTab('time'); go('result') }} />}
        {shown === 'result' && res && (
          <ResultView t={t} lang={lang} res={res} texts={texts} locks={locks} catalogError={catalog.status === 'error'} tier="guest"
            onBack={() => go('home')} onCalc={() => go('calc')} onTravel={() => go('travel')} onUnlock={(level) => go(level === 'member' ? 'login' : 'premium')} />
        )}
        {shown === 'travel' && res && <TravelView t={t} lang={lang} res={res} cat={cat} texts={texts} onBack={() => go('result')} />}
        {shown === 'calc' && res && <CalcView t={t} lang={lang} res={res} catalogError={catalog.status === 'error'} tab={calcTab} setTab={setCalcTab} onBack={() => go('result')} />}
        {shown === 'premium' && <PremiumView t={t} />}
        {shown === 'admin' && <AdminView cons={cons} />}
        {(shown === 'privacy' || shown === 'terms') && <LegalView kind={shown} lang={lang} onBack={() => navTo('home')} backLabel={t.backHome} />}
        {shown === 'login' && <LoginView t={t} onHome={() => navTo('home')} onPremium={() => go('premium')} />}
        {shown === 'settings' && (
          <SettingsView t={t} lang={lang} onLang={setLang}
            adsPersonal={adsPersonal} onAdsPersonal={(v) => { setAdsPersonal(v); writeSetting('ktm.adsPersonal', v ? '1' : '0') }}
            canInstall={!!installEvt} onInstall={() => { installEvt?.prompt(); setInstallEvt(null) }} />
        )}
      </main>
      <Footer t={t} lang={lang} onNav={navTo} onLang={setLang} />
      <PwaToast t={t} />
    </>
  )
}
