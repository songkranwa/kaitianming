import { useEffect, useState } from 'react'

// Launch checklist (admin only, under /admin/checklist). Items live in D1 and are edited through /api/admin/checklist.

type Status = 'todo' | 'doing' | 'done'
interface Item {
  id: string; group: string; order: number; rank: number; priority: Band; eta_th: string; eta_en: string; who: 'owner' | 'claude' | 'both'; stage: 'web' | 'ios' | 'both'; status: Status
  title_en: string; title_th: string; note_en: string; note_th: string; updated_at: string; updated_by: string
}
type Filter = 'all' | 'owner' | 'claude' | 'open'
type Band = 'now' | 'soon' | 'ios' | 'later' | 'done'
type Sort = 'rank' | 'group'
const BANDS: { id: Band; th: string; en: string; sub_th: string; sub_en: string }[] = [
  { id: 'now', th: 'ด่วน — ทำก่อน', en: 'Urgent — do first', sub_th: 'งานที่งานอื่นรออยู่ และสิ่งที่ต้องมีก่อนสมัครโฆษณาและเปิดตัว', sub_en: 'Things other work waits on, and what ads and launch need first' },
  { id: 'soon', th: 'สำคัญ — ภายใน 2–4 สัปดาห์', en: 'Important — next 2–4 weeks', sub_th: 'สมาชิก รายได้ และความพร้อมของเว็บก่อนเปิดตัว', sub_en: 'Membership, income and launch readiness for the website' },
  { id: 'ios', th: 'ก่อนส่งแอป iOS', en: 'Before the iOS submission', sub_th: 'เรียงตามลำดับที่ต้องทำจนถึงส่งให้ Apple ตรวจ', sub_en: 'In the order they need doing, through to App Review' },
  { id: 'later', th: 'ไม่รีบ', en: 'Not urgent', sub_th: '', sub_en: '' },
  { id: 'done', th: 'เสร็จแล้ว', en: 'Done', sub_th: '', sub_en: '' }
]
type L = 'th' | 'en'

const GROUPS: { id: string; th: string; en: string }[] = [
  { id: 'predict', th: 'คำทำนายและสูตร', en: 'Predictions and formulas' },
  { id: 'product', th: 'หน้าเว็บและการใช้งาน', en: 'Website and experience' },
  { id: 'legal', th: 'กฎหมายและความเป็นส่วนตัว', en: 'Legal and privacy' },
  { id: 'money', th: 'รายได้: โฆษณาและสมาชิก', en: 'Income: ads and membership' },
  { id: 'ops', th: 'ระบบและความปลอดภัย', en: 'Reliability and security' },
  { id: 'brand', th: 'แบรนด์และการตลาด', en: 'Brand and marketing' },
  { id: 'ios', th: 'แอป iOS (App Store)', en: 'iOS app (App Store)' }
]
const TXT = {
  th: { web: 'เปิดตัวเว็บ', ios: 'แอป iOS', of: (a: number, b: number) => `เสร็จ ${a} จาก ${b}`, next: 'ถัดไป: ', allDone: 'เสร็จครบแล้ว',
    all: 'ทั้งหมด', owner: 'งานของคุณ', claude: 'งานของ Claude', open: 'ยังไม่เสร็จ', todo: 'ยังไม่ทำ', doing: 'กำลังทำ', done: 'เสร็จแล้ว',
    who: { owner: 'คุณ', claude: 'Claude', both: 'คุณ + Claude' }, stage: { web: 'เว็บ', ios: 'iOS', both: 'เว็บ + iOS' },
    hint: 'แตะช่องสี่เหลี่ยมเพื่อเปลี่ยนสถานะ ยังไม่ทำ → กำลังทำ → เสร็จแล้ว', loading: 'กำลังโหลดรายการ…', failed: 'บันทึกไม่สำเร็จ ลองอีกครั้ง', loadFailed: 'โหลดรายการไม่สำเร็จ', none: 'ไม่มีรายการที่ตรงกับตัวกรองนี้' },
  en: { web: 'Web launch', ios: 'iOS app', of: (a: number, b: number) => `${a} of ${b} done`, next: 'Next up: ', allDone: 'All done',
    all: 'All', owner: 'For you', claude: 'For Claude', open: 'Not done', todo: 'To do', doing: 'In progress', done: 'Done',
    who: { owner: 'You', claude: 'Claude', both: 'You + Claude' }, stage: { web: 'Web', ios: 'iOS', both: 'Web + iOS' },
    hint: 'Tap the box to move an item: to do → in progress → done', loading: 'Loading checklist…', failed: 'Couldn’t save. Try again.', loadFailed: 'Couldn’t load the checklist.', none: 'Nothing matches this filter.' }
}
const NEXT: Record<Status, Status> = { todo: 'doing', doing: 'done', done: 'todo' }
const bandOf = (i: Item): Band => (i.status === 'done' ? 'done' : i.priority === 'done' ? 'later' : i.priority)
const HEAD = { 'content-type': 'application/json', 'x-kaitianming-admin': '1' }

function Gauge({ title, list, t, l }: { title: string; list: Item[]; t: typeof TXT.th; l: L }) {
  const done = list.filter((i) => i.status === 'done').length, pct = list.length ? Math.round((done / list.length) * 100) : 0
  const C = 2 * Math.PI * 34
  const next = list.filter((i) => i.status !== 'done').sort((a, b) => (a.status === 'doing' ? -1 : 0) - (b.status === 'doing' ? -1 : 0) || a.rank - b.rank)[0]
  return (
    <div className="cl-gauge">
      <svg viewBox="0 0 84 84" aria-hidden="true">
        <circle cx="42" cy="42" r="34" fill="none" strokeWidth="8" className="cl-ring-bg" />
        <circle cx="42" cy="42" r="34" fill="none" strokeWidth="8" strokeLinecap="round" className="cl-ring" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 42 42)" />
        <text x="42" y="49" textAnchor="middle" className="cl-ring-text">{pct}%</text>
      </svg>
      <div style={{ minWidth: 0 }}>
        <h2 className="cl-gauge-title">{title}</h2>
        <p className="muted small">{t.of(done, list.length)}</p>
        <p className="muted small">{next ? t.next + (l === 'th' ? next.title_th : next.title_en) : t.allDone}</p>
      </div>
    </div>
  )
}

export function ChecklistView() {
  const [items, setItems] = useState<Item[] | null>(null)
  const [err, setErr] = useState('')
  const [lang, setLang] = useState<L>(() => { try { return localStorage.getItem('ktm.cl.lang') === 'en' ? 'en' : 'th' } catch { return 'th' } })
  const [filter, setFilter] = useState<Filter>('all')
  const [busy, setBusy] = useState('')
  const [sort, setSort] = useState<Sort>('rank')
  const t = TXT[lang]

  useEffect(() => {
    fetch('/api/admin/checklist').then(async (r) => {
      if (!r.ok) throw new Error()
      setItems((await r.json()) as Item[])
    }).catch(() => setErr(TXT.th.loadFailed))
  }, [])

  const pickLang = (l: L) => { setLang(l); try { localStorage.setItem('ktm.cl.lang', l) } catch { /* storage unavailable */ } }

  const advance = async (it: Item) => {
    if (busy) return
    setBusy(it.id); setErr('')
    const status = NEXT[it.status]
    try {
      const r = await fetch('/api/admin/checklist/' + it.id, { method: 'PUT', headers: HEAD, body: JSON.stringify({ status }) })
      if (!r.ok) throw new Error()
      const saved = (await r.json()) as { status: Status; updated_at: string; updated_by: string }
      setItems((xs) => xs && xs.map((x) => (x.id === it.id ? { ...x, ...saved } : x)))
    } catch { setErr(t.failed) }
    setBusy('')
  }

  const row = (it: Item, numbered: boolean) => {
    const eta = lang === 'th' ? it.eta_th : it.eta_en
    const title = lang === 'th' ? it.title_th : it.title_en, note = lang === 'th' ? it.note_th : it.note_en
    return (
      <li key={it.id} className={'cl-item' + (it.status === 'done' ? ' done' : '')}>
        <button type="button" className="cl-check" data-s={it.status} disabled={busy === it.id} aria-label={`${title}: ${t[it.status]}`} onClick={() => advance(it)}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
        </button>
        <div style={{ minWidth: 0 }}>
          <p className="cl-title">{numbered && <span className="cl-rank">{it.rank}.</span>}{title}</p>
          {note && <p className="muted small">{note}</p>}
          {eta && it.status !== 'done' && <p className="cl-eta small">{(lang === 'th' ? 'ใช้เวลา: ' : 'Time: ') + eta}</p>}
        </div>
        <div className="cl-tags">
          <span className={'cl-chip' + (it.who !== 'claude' ? ' owner' : '')}>{t.who[it.who]}</span>
          <span className="cl-chip">{t.stage[it.stage]}</span>
          {it.status === 'doing' && <span className="cl-chip doing">{t.doing}</span>}
        </div>
      </li>
    )
  }

  if (!items) return <p className="muted" role="status">{err || t.loading}</p>
  const shown = items.filter((i) => filter === 'all' || (filter === 'open' ? i.status !== 'done' : i.who === filter || i.who === 'both'))

  return (
    <div className="cl stack gap-20">
      <div className="cl-gauges">
        <Gauge title={t.web} list={items.filter((i) => i.stage !== 'ios')} t={t} l={lang} />
        <Gauge title={t.ios} list={items.filter((i) => i.stage !== 'web')} t={t} l={lang} />
      </div>

      <div className="row-wrap" style={{ gap: 8, justifyContent: 'space-between' }}>
        <div className="row-wrap" style={{ gap: 8 }} role="group" aria-label="ตัวกรอง">
          {(['all', 'owner', 'claude', 'open'] as Filter[]).map((f) => (
            <button key={f} type="button" className={'cl-pill' + (filter === f ? ' on' : '')} aria-pressed={filter === f} onClick={() => setFilter(f)}>{t[f]}</button>
          ))}
        </div>
        <div className="row-wrap" style={{ gap: 4 }} role="group" aria-label={lang === 'th' ? 'การเรียง' : 'Sort'}>
          <button type="button" className={'cl-pill' + (sort === 'rank' ? ' on' : '')} aria-pressed={sort === 'rank'} onClick={() => setSort('rank')}>{lang === 'th' ? 'ตามลำดับ' : 'By order'}</button>
          <button type="button" className={'cl-pill' + (sort === 'group' ? ' on' : '')} aria-pressed={sort === 'group'} onClick={() => setSort('group')}>{lang === 'th' ? 'ตามหมวด' : 'By category'}</button>
        </div>
        <div className="row-wrap" style={{ gap: 4 }} role="group" aria-label="ภาษา / Language">
          <button type="button" className={'cl-pill' + (lang === 'th' ? ' on' : '')} aria-pressed={lang === 'th'} onClick={() => pickLang('th')}>ไทย</button>
          <button type="button" className={'cl-pill' + (lang === 'en' ? ' on' : '')} aria-pressed={lang === 'en'} onClick={() => pickLang('en')}>EN</button>
        </div>
      </div>
      <p className="muted small">{t.hint}</p>
      {err && <p role="alert" style={{ color: 'var(--warn)' }}>{err}</p>}

      {!shown.length && <p className="muted">{t.none}</p>}
      {sort === 'rank' && BANDS.map((band) => {
        const rows = shown.filter((i) => bandOf(i) === band.id).sort((a, b) => a.rank - b.rank)
        if (!rows.length) return null
        const sub = lang === 'th' ? band.sub_th : band.sub_en
        return (
          <section key={band.id} className={'cl-group cl-band-' + band.id} aria-labelledby={'band-' + band.id}>
            <div className="cl-group-head">
              <div>
                <h2 id={'band-' + band.id} className="topic-title" style={{ fontSize: 20 }}>{lang === 'th' ? band.th : band.en}</h2>
                {sub && <p className="muted small">{sub}</p>}
              </div>
              <span className="muted-2 small">{rows.length}</span>
            </div>
            <ul className="cl-items">{rows.map((it) => row(it, true))}</ul>
          </section>
        )
      })}
      {sort === 'group' && GROUPS.map((g) => {
        const all = items.filter((i) => i.group === g.id), rows = shown.filter((i) => i.group === g.id).sort((a, b) => a.order - b.order)
        if (!rows.length) return null
        return (
          <section key={g.id} className="cl-group" aria-labelledby={'cl-' + g.id}>
            <div className="cl-group-head">
              <h2 id={'cl-' + g.id} className="topic-title" style={{ fontSize: 20 }}>{g[lang]}</h2>
              <span className="muted-2 small">{t.of(all.filter((i) => i.status === 'done').length, all.length)}</span>
            </div>
            <ul className="cl-items">
              {rows.map((it) => row(it, false))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
