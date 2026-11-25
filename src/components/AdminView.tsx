import { useEffect, useMemo, useState } from 'react'
import { slotGroups, type Slot } from '../content/slots'
import { ChecklistView } from './ChecklistView'

// Admin page for prediction texts (Thai UI: it is for the site owner).
// Sign-in is handled by Cloudflare Access in front of /admin and /api/admin; this page never sees a password.

interface Row { key: string; th: string; en: string; updated_at: string; updated_by: string }
interface Hist { th: string | null; en: string | null; action: string; at: string; by: string }
type Filter = 'all' | 'empty' | 'filled'

const HEAD = { 'content-type': 'application/json', 'x-kaitianming-admin': '1' }
const when = (iso: string) => new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })

type Section = 'texts' | 'checklist'
const sectionFromPath = (): Section => (location.pathname.startsWith('/admin/checklist') ? 'checklist' : 'texts')

export function AdminView({ cons }: { cons: Record<string, string> }) {
  const [section, setSection] = useState<Section>(sectionFromPath)
  useEffect(() => {
    const onPop = () => setSection(sectionFromPath())
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])
  const goSection = (s: Section) => {
    if (s === section) return
    history.pushState({ view: 'admin' }, '', s === 'checklist' ? '/admin/checklist' : '/admin')
    setSection(s)
    scrollTo(0, 0)
  }
  const [me, setMe] = useState<string | null | 'loading'>('loading')
  const [rows, setRows] = useState<Record<string, Row>>({})
  const groups = useMemo(() => slotGroups(cons), [cons])
  const [gid, setGid] = useState(groups[0].id)
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Slot | null>(null)
  const [th, setTh] = useState(''), [en, setEn] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [hist, setHist] = useState<Hist[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/me').then(async (r) => {
      if (!r.ok) return setMe(null)
      setMe(((await r.json()) as { email: string }).email)
      const list = (await (await fetch('/api/admin/predictions')).json()) as Row[]
      setRows(Object.fromEntries(list.map((x) => [x.key, x])))
    }).catch(() => setMe(null))
  }, [])

  const group = groups.find((g) => g.id === gid) ?? groups[0]
  const filled = (k: string) => !!(rows[k]?.th || rows[k]?.en)
  const shown = group.slots.filter((s) =>
    (filter === 'all' || (filter === 'filled') === filled(s.key)) && (!q || (s.label + ' ' + s.key).toLowerCase().includes(q.toLowerCase())))
  const dirty = sel && (th !== (rows[sel.key]?.th ?? '') || en !== (rows[sel.key]?.en ?? ''))

  const pick = (s: Slot) => {
    if (dirty && !confirmLeave()) return
    setSel(s); setTh(rows[s.key]?.th ?? ''); setEn(rows[s.key]?.en ?? ''); setMsg(''); setHist(null)
  }
  // An inline prompt instead of window.confirm: keep it simple — warn once via message.
  const confirmLeave = () => { setMsg('ยังไม่ได้บันทึก กดบันทึกก่อน หรือกด "ยกเลิกการแก้ไข"'); return false }

  const save = async () => {
    if (!sel) return
    setBusy(true); setMsg('')
    const r = await fetch('/api/admin/predictions/' + encodeURIComponent(sel.key), { method: 'PUT', headers: HEAD, body: JSON.stringify({ th, en }) })
    setBusy(false)
    if (!r.ok) return setMsg(r.status === 401 ? 'หมดเวลาเข้าสู่ระบบ กรุณาโหลดหน้าใหม่' : 'บันทึกไม่สำเร็จ')
    const row = (await r.json()) as Row
    setRows((x) => ({ ...x, [row.key]: row })); setTh(row.th); setEn(row.en); setMsg('บันทึกแล้ว · ขึ้นหน้าเว็บภายใน 1 นาที'); setHist(null)
  }
  const remove = async () => {
    if (!sel || !filled(sel.key)) return
    setBusy(true)
    const r = await fetch('/api/admin/predictions/' + encodeURIComponent(sel.key), { method: 'DELETE', headers: HEAD })
    setBusy(false)
    if (!r.ok) return setMsg('ลบไม่สำเร็จ')
    setRows((x) => { const y = { ...x }; delete y[sel.key]; return y }); setTh(''); setEn(''); setMsg('ลบข้อความแล้ว (ยังดูย้อนหลังได้ในประวัติ)'); setHist(null)
  }
  const loadHist = async () => {
    if (!sel) return
    const r = await fetch('/api/admin/predictions/' + encodeURIComponent(sel.key) + '/history')
    setHist(r.ok ? ((await r.json()) as Hist[]) : [])
  }

  if (me === 'loading') return <section className="container page"><p className="muted">กำลังตรวจสอบสิทธิ์…</p></section>
  if (!me) return (
    <section className="container narrow page" style={{ paddingTop: 56 }}>
      <h1 className="page-title">ระบบจัดการคำทำนาย</h1>
      <div className="card">
        <p>ต้องเข้าสู่ระบบในฐานะผู้ดูแลก่อน</p>
        <p className="muted small">หน้านี้ป้องกันด้วย Cloudflare Access ถ้าเห็นข้อความนี้ แปลว่ายังไม่ได้เข้าสู่ระบบ หรือยังไม่ได้ตั้งค่า Access</p>
        <button type="button" className="btn-primary" onClick={() => { location.href = '/admin?signin=' + Date.now() }}>เข้าสู่ระบบ</button>
      </div>
    </section>
  )

  const total = groups.reduce((n, g) => n + g.slots.length, 0), done = Object.keys(rows).length
  return (
    <section className="container page admin" aria-labelledby="admin-title">
      <div className="admin-top">
        <div>
          <h1 id="admin-title" className="page-title">{section === 'checklist' ? 'รายการตรวจก่อนเปิดตัว' : 'ระบบจัดการคำทำนาย'}</h1>
          <p className="muted small">เข้าสู่ระบบเป็น {me}{section === 'texts' && <> · มีข้อความแล้ว {done} จาก {total} ช่อง</>}</p>
        </div>
        <div className="row-wrap" style={{ gap: 8 }}>
          <nav className="admin-tabs" aria-label="หลังบ้าน">
            <button type="button" className={'cl-pill' + (section === 'texts' ? ' on' : '')} aria-current={section === 'texts' ? 'page' : undefined} onClick={() => goSection('texts')}>ข้อความคำทำนาย</button>
            <button type="button" className={'cl-pill' + (section === 'checklist' ? ' on' : '')} aria-current={section === 'checklist' ? 'page' : undefined} onClick={() => goSection('checklist')}>รายการตรวจก่อนเปิดตัว</button>
          </nav>
          <a className="btn-ghost" href="/api/admin/export" download>ดาวน์โหลดไฟล์สำรอง</a>
          <a className="btn-ghost" href="/cdn-cgi/access/logout">ออกจากระบบ</a>
        </div>
      </div>

      {section === 'checklist' ? <ChecklistView /> : (

      <div className="admin-grid">
        <div className="card admin-list">
          <div className="field">
            <label htmlFor="adm-group">หัวข้อ</label>
            <select id="adm-group" className="control" value={gid} onChange={(e) => { setGid(e.target.value); setSel(null) }}>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.title} ({g.slots.filter((s) => filled(s.key)).length}/{g.slots.length})</option>)}
            </select>
          </div>
          {group.note && <p className="muted small">{group.note}</p>}
          <div className="row-wrap" style={{ gap: 8 }}>
            <input className="control" aria-label="ค้นหา" placeholder="ค้นหา" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 120 }} />
            <select className="control" style={{ width: 'auto' }} aria-label="แสดง" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
              <option value="all">ทั้งหมด</option><option value="empty">ยังว่าง</option><option value="filled">มีข้อความแล้ว</option>
            </select>
          </div>
          <ul className="admin-slots">
            {shown.map((s) => (
              <li key={s.key}>
                <button type="button" className={'admin-slot' + (sel?.key === s.key ? ' on' : '')} onClick={() => pick(s)}>
                  <span className={'dot' + (filled(s.key) ? ' ok' : '')} aria-hidden="true" />
                  <span className="admin-slot-label">{s.label}</span>
                  <span className="sr-only">{filled(s.key) ? 'มีข้อความแล้ว' : 'ยังว่าง'}</span>
                </button>
              </li>
            ))}
            {!shown.length && <li className="muted small">ไม่พบ</li>}
          </ul>
        </div>

        <div className="card admin-edit">
          {!sel ? <p className="muted">เลือกช่องทางซ้ายเพื่อเขียนหรือแก้คำทำนาย</p> : (
            <>
              <div>
                <h2 className="topic-title" style={{ fontSize: 20 }}>{sel.label}</h2>
                <p className="muted-2 small"><code>{sel.key}</code>{rows[sel.key] && <> · แก้ล่าสุด {when(rows[sel.key].updated_at)} โดย {rows[sel.key].updated_by}</>}</p>
              </div>
              <div className="field">
                <label htmlFor="adm-th">ภาษาไทย</label>
                <textarea id="adm-th" rows={8} value={th} onChange={(e) => setTh(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="adm-en">English (ถ้าว่าง จะแสดงภาษาไทยแทน)</label>
                <textarea id="adm-en" rows={8} value={en} onChange={(e) => setEn(e.target.value)} />
              </div>
              <div className="row-wrap" style={{ gap: 12 }}>
                <button type="button" className="btn-primary" style={{ padding: '0 24px' }} disabled={busy || !dirty} onClick={save}>บันทึก</button>
                {dirty && <button type="button" className="btn-ghost" onClick={() => { setTh(rows[sel.key]?.th ?? ''); setEn(rows[sel.key]?.en ?? ''); setMsg('') }}>ยกเลิกการแก้ไข</button>}
                {filled(sel.key) && !dirty && <button type="button" className="btn-ghost" disabled={busy} onClick={remove}>ลบข้อความ</button>}
                <button type="button" className="btn-ghost" onClick={loadHist}>ประวัติการแก้ไข</button>
              </div>
              <p role="status" className="small" style={{ color: 'var(--accent)', minHeight: 20 }}>{msg}</p>
              {hist && (
                <ul className="admin-hist">
                  {!hist.length && <li className="muted small">ยังไม่มีประวัติ</li>}
                  {hist.map((h, i) => (
                    <li key={i}>
                      <p className="small muted-2">{when(h.at)} · {h.by} · {h.action === 'delete' ? 'ลบ' : 'บันทึก'}</p>
                      {h.th && <p className="small">{h.th}</p>}
                      {h.action === 'save' && <button type="button" className="link-btn small" onClick={() => { setTh(h.th ?? ''); setEn(h.en ?? '') }}>ใช้ฉบับนี้</button>}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
      )}
    </section>
  )
}
