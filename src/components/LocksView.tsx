import { useEffect, useState } from 'react'

// Admin tool: choose which result-page topics are locked, for whom, and how much of each topic.

type Level = 'free' | 'member' | 'premium'
type Scope = 'all' | 'details'
interface Row { topic: string; level: Level; scope: Scope; updated_at?: string; updated_by?: string }

const TOPICS: { id: string; title: string; about: string }[] = [
  { id: 'day', title: '1. ลักษณะเจ้าของวันเกิด', about: 'เลขประจำวันเกิด' },
  { id: 'dayYear', title: '2. ดวงจากเลขวันเกิดเทียบปีปัจจุบัน', about: 'เลขวันเกิดกับกำลังปี' },
  { id: 'sky', title: '3. ดวงดาวบนฟากฟ้าตอนเกิด', about: 'กลุ่มดาวเหนือศีรษะ แผ่นฟากฟ้า ค่าดวงดาว' },
  { id: 'today', title: '4. ดวงดาววันนี้', about: 'ดาวจรวันนี้' },
  { id: 'month', title: '5. ดวงดาว 1 เดือนข้างหน้า', about: 'ดาวจร 30 วัน' },
  { id: 'year', title: '6. ดวงดาว 1 ปีข้างหน้า', about: 'ดาวจร 12 เดือน' },
  { id: 'sign', title: '7. ลักษณะตามราศีเกิด', about: 'ราศีสากล' },
  { id: 'signNow', title: '8. ผลของจักรราศีปัจจุบัน', about: 'ราศีตอนนี้เทียบราศีเกิด' },
  { id: 'animal', title: '9. ปีนักษัตรที่เกิด', about: 'ปีนักษัตร' },
  { id: 'animalNow', title: '10. ผลของปีนักษัตรปัจจุบัน', about: 'ปีนี้เทียบปีเกิด' },
  { id: 'overallNow', title: '11. ดวงชะตารวมช่วงนี้', about: 'เลขดวงชะตารวม' },
  { id: 'overallNext', title: '12. ดวงชะตารวมปีหน้า', about: 'เลขดวงชะตารวมปีหน้า' },
  { id: 'personal', title: '13. ความหมายเลขเฉพาะตัว', about: 'เลขเฉพาะตัว' }
]
const LEVELS: { v: Level; label: string }[] = [
  { v: 'free', label: 'เปิดให้ทุกคน' },
  { v: 'member', label: 'สมาชิก (สมัครฟรี)' },
  { v: 'premium', label: 'สมาชิกพรีเมียม' }
]
const SCOPES: { v: Scope; label: string; hint: string }[] = [
  { v: 'all', label: 'ล็อกทั้งหัวข้อ', hint: 'ผู้ที่ยังไม่ปลดล็อกจะเห็นแค่บัตรล็อก' },
  { v: 'details', label: 'เปิดบัตรคำทำนายใบแรก ล็อกรายละเอียด', hint: 'อ่านคำทำนายได้ แต่บัตรที่เหลือถูกล็อก' }
]
const HEAD = { 'content-type': 'application/json', 'x-kaitianming-admin': '1' }
const when = (iso: string) => new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })

export function LocksView() {
  const [rows, setRows] = useState<Record<string, Row> | null>(null)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/locks').then(async (r) => {
      if (!r.ok) throw new Error()
      const list = (await r.json()) as Row[]
      setRows(Object.fromEntries(list.map((x) => [x.topic, x])))
    }).catch(() => setMsg('โหลดการตั้งค่าไม่สำเร็จ'))
  }, [])

  const save = async (topic: string, level: Level, scope: Scope) => {
    setBusy(topic); setMsg('')
    try {
      const r = await fetch('/api/admin/locks/' + topic, { method: 'PUT', headers: HEAD, body: JSON.stringify({ level, scope }) })
      if (!r.ok) throw new Error()
      const row = (await r.json()) as Row
      setRows((x) => ({ ...(x ?? {}), [topic]: row }))
      setMsg('บันทึกแล้ว · มีผลบนหน้าเว็บภายใน 1 นาที')
    } catch { setMsg('บันทึกไม่สำเร็จ ลองอีกครั้ง') }
    setBusy('')
  }

  if (!rows) return <p className="muted" role="status">{msg || 'กำลังโหลด…'}</p>
  const lockedCount = TOPICS.filter((tp) => (rows[tp.id]?.level ?? 'free') !== 'free').length

  return (
    <div className="stack gap-20">
      <div className="card stack gap-8">
        <p>ล็อกอยู่ {lockedCount} จาก {TOPICS.length} หัวข้อ</p>
        <p className="muted small">ตอนนี้ยังไม่มีระบบบัญชีสมาชิก ทุกคนจึงเป็นผู้เยี่ยมชม หัวข้อที่ตั้งเป็น “สมาชิก” หรือ “พรีเมียม” จะแสดงเป็นบัตรล็อกกับทุกคนทันที เมื่อระบบสมาชิกเปิด ผู้ที่อยู่ในระดับนั้นจึงจะอ่านได้</p>
      </div>
      <p role="status" className="small" style={{ color: 'var(--accent)', minHeight: 20 }}>{msg}</p>
      <ul className="cl-items">
        {TOPICS.map((tp) => {
          const cur = rows[tp.id] ?? { topic: tp.id, level: 'free' as Level, scope: 'all' as Scope }
          return (
            <li key={tp.id} className="cl-item lock-row">
              <div style={{ minWidth: 0 }}>
                <p className="cl-title">{tp.title}</p>
                <p className="muted small">{tp.about}{cur.updated_at && <> · แก้ล่าสุด {when(cur.updated_at)}</>}</p>
              </div>
              <div className="stack gap-8 lock-controls">
                <label className="sr-only" htmlFor={'lv-' + tp.id}>ระดับของ {tp.title}</label>
                <select id={'lv-' + tp.id} className="control" value={cur.level} disabled={busy === tp.id}
                  onChange={(e) => save(tp.id, e.target.value as Level, cur.scope)}>
                  {LEVELS.map((l) => <option key={l.v} value={l.v}>{l.label}</option>)}
                </select>
                {cur.level !== 'free' && (
                  <fieldset className="lock-scope">
                    <legend className="sr-only">ล็อกแค่ไหน</legend>
                    {SCOPES.map((sc) => (
                      <label key={sc.v} className="small" title={sc.hint}>
                        <input type="radio" name={'sc-' + tp.id} value={sc.v} checked={cur.scope === sc.v} disabled={busy === tp.id}
                          onChange={() => save(tp.id, cur.level, sc.v)} /> {sc.label}
                      </label>
                    ))}
                  </fieldset>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
