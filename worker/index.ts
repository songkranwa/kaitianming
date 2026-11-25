// Kaitianming Worker: serves the static site, plus a small API for prediction texts.
//   GET  /api/predictions                public, all texts at once (no birth data ever reaches the server)
//   *    /api/admin/...                  site admins only, signed in through Cloudflare Access
// Texts live in Cloudflare D1 (binding DB). Every change is also written to a history table.

interface D1Result<T> { results: T[] }
interface D1Stmt { bind(...v: unknown[]): D1Stmt; all<T>(): Promise<D1Result<T>>; run(): Promise<unknown> }
interface D1 { prepare(sql: string): D1Stmt; batch(s: D1Stmt[]): Promise<unknown> }
interface Env {
  ASSETS: { fetch(r: Request): Promise<Response> }
  DB: D1
  /** e.g. "kaitianming.cloudflareaccess.com" — from Zero Trust → Settings. */
  ACCESS_TEAM_DOMAIN: string
  /** "Application Audience (AUD) Tag" of the Access application that protects /admin and /api/admin. */
  ACCESS_AUD: string
}

import seed from './seed.json'
import checklistSeed from './checklist-seed.json'

const KEY_RE = /^[A-Za-z0-9.\-]{1,64}$/
const MAX_TEXT = 20000

const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } })

let schemaReady: Promise<unknown> | null = null
function ensureSchema(db: D1) {
  schemaReady ??= db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS predictions (key TEXT PRIMARY KEY, th TEXT NOT NULL DEFAULT \'\', en TEXT NOT NULL DEFAULT \'\', updated_at TEXT NOT NULL, updated_by TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS prediction_history (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL, th TEXT, en TEXT, action TEXT NOT NULL, at TEXT NOT NULL, by TEXT NOT NULL)'),
    db.prepare('CREATE INDEX IF NOT EXISTS prediction_history_key ON prediction_history (key, id)'),
    db.prepare('CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS checklist (id TEXT PRIMARY KEY, grp TEXT NOT NULL, ord INTEGER NOT NULL, who TEXT NOT NULL, stage TEXT NOT NULL, status TEXT NOT NULL, title_en TEXT NOT NULL, title_th TEXT NOT NULL, note_en TEXT NOT NULL DEFAULT \'\', note_th TEXT NOT NULL DEFAULT \'\', updated_at TEXT NOT NULL, updated_by TEXT NOT NULL, rank INTEGER NOT NULL DEFAULT 0, priority TEXT NOT NULL DEFAULT \'soon\', eta_th TEXT NOT NULL DEFAULT \'\', eta_en TEXT NOT NULL DEFAULT \'\')')
  ]).then(() => seedTexts(db)).then(() => seedChecklist(db)).catch((e) => { schemaReady = null; throw e })
  return schemaReady
}

/**
 * Launch checklist (admin only). Each seed version: add any missing columns, insert new items, then
 * refresh order, urgency, time estimates and wording from the seed. Ticks made in the admin are kept;
 * a seed only moves an item forward (to "done", or from "to do" to "in progress"), never back.
 */
async function seedChecklist(db: D1) {
  const { results } = await db.prepare("SELECT v FROM meta WHERE k = 'checklist_seed_version'").all<{ v: string }>()
  if (Number(results[0]?.v ?? 0) >= checklistSeed.version) return
  for (const col of ['rank INTEGER NOT NULL DEFAULT 0', "priority TEXT NOT NULL DEFAULT 'soon'", "eta_th TEXT NOT NULL DEFAULT ''", "eta_en TEXT NOT NULL DEFAULT ''"]) {
    try { await db.prepare('ALTER TABLE checklist ADD COLUMN ' + col).run() } catch { /* column already there */ }
  }
  const now = new Date().toISOString()
  const rows = checklistSeed.items as (typeof checklistSeed.items[number] & { set_status?: string })[]
  for (let i = 0; i < rows.length; i += 25) {
    const chunk = rows.slice(i, i + 25)
    await db.batch([
      ...chunk.map((x) => db.prepare('INSERT OR IGNORE INTO checklist (id, grp, ord, who, stage, status, title_en, title_th, note_en, note_th, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(x.id, x.group, x.order, x.who, x.stage, x.status, x.title_en, x.title_th, x.note_en, x.note_th, now, 'seed')),
      ...chunk.map((x) => {
        const st = x.set_status ?? null
        return db.prepare(`UPDATE checklist SET grp = ?, ord = ?, who = ?, stage = ?, title_en = ?, title_th = ?, note_en = ?, note_th = ?, rank = ?, priority = ?, eta_th = ?, eta_en = ?,
            status = CASE WHEN ? IS NULL THEN status WHEN ? = 'done' THEN 'done' WHEN status = 'todo' THEN ? ELSE status END WHERE id = ?`)
          .bind(x.group, x.order, x.who, x.stage, x.title_en, x.title_th, x.note_en, x.note_th, x.rank, x.priority, x.eta_th, x.eta_en, st, st, st, x.id)
      })
    ])
  }
  await db.prepare("INSERT INTO meta (k, v) VALUES ('checklist_seed_version', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(String(checklistSeed.version)).run()
}

/**
 * Loads the starting texts (worker/seed.json) once per seed version. INSERT OR IGNORE never touches a key
 * that already exists, so the admin's edits stay; a text the admin deleted only returns if the version is bumped.
 */
async function seedTexts(db: D1) {
  const { results } = await db.prepare("SELECT v FROM meta WHERE k = 'seed_version'").all<{ v: string }>()
  const done = Number(results[0]?.v ?? 0)
  if (done >= seed.version) return
  const now = new Date().toISOString()
  const rows = Object.entries(seed.texts as Record<string, { th: string; en: string }>)
  for (let i = 0; i < rows.length; i += 50) {
    await db.batch(rows.slice(i, i + 50).map(([k, t]) =>
      db.prepare('INSERT OR IGNORE INTO predictions (key, th, en, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)').bind(k, t.th, t.en, now, 'seed')))
  }
  await db.prepare("INSERT INTO meta (k, v) VALUES ('seed_version', ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(String(seed.version)).run()
}

// ---- Cloudflare Access sign-in check (fails closed if not configured) ----
const b64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0))
let certs: { at: number; keys: Record<string, CryptoKey> } | null = null

async function accessKeys(team: string): Promise<Record<string, CryptoKey>> {
  if (certs && Date.now() - certs.at < 3600_000) return certs.keys
  const r = await fetch(`https://${team}/cdn-cgi/access/certs`)
  if (!r.ok) throw new Error('certs')
  const { keys } = (await r.json()) as { keys: (JsonWebKey & { kid: string })[] }
  const out: Record<string, CryptoKey> = {}
  for (const k of keys) out[k.kid] = await crypto.subtle.importKey('jwk', k, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
  certs = { at: Date.now(), keys: out }
  return out
}

async function adminEmail(req: Request, env: Env): Promise<string | null> {
  const token = req.headers.get('cf-access-jwt-assertion')
  if (!token || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null
  const [h, p, s] = token.split('.')
  if (!h || !p || !s) return null
  try {
    const head = JSON.parse(new TextDecoder().decode(b64url(h))) as { kid: string; alg: string }
    if (head.alg !== 'RS256') return null
    const key = (await accessKeys(env.ACCESS_TEAM_DOMAIN))[head.kid]
    if (!key) return null
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(s), new TextEncoder().encode(h + '.' + p))
    if (!ok) return null
    const claims = JSON.parse(new TextDecoder().decode(b64url(p))) as { aud: string | string[]; exp: number; iss: string; email?: string }
    const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
    if (!aud.includes(env.ACCESS_AUD) || claims.exp * 1000 < Date.now() || claims.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null
    return claims.email || 'admin'
  } catch {
    return null
  }
}

// ---- Routes ----
async function api(req: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname
  await ensureSchema(env.DB)

  if (path === '/api/predictions' && req.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT key, th, en FROM predictions').all<{ key: string; th: string; en: string }>()
    const out: Record<string, { th?: string; en?: string }> = {}
    for (const r of results) out[r.key] = { ...(r.th ? { th: r.th } : {}), ...(r.en ? { en: r.en } : {}) }
    return json(out, 200, { 'cache-control': 'public, max-age=60' })
  }

  if (path.startsWith('/api/admin/')) {
    const who = await adminEmail(req, env)
    if (!who) return json({ error: 'not_signed_in' }, 401)
    if (req.method !== 'GET' && req.headers.get('x-kaitianming-admin') !== '1') return json({ error: 'bad_request' }, 400)
    const now = new Date().toISOString()

    if (path === '/api/admin/me') return json({ email: who })

    if (path === '/api/admin/export' && req.method === 'GET') {
      const [p, h, c] = await Promise.all([
        env.DB.prepare('SELECT key, th, en, updated_at, updated_by FROM predictions ORDER BY key').all(),
        env.DB.prepare('SELECT id, key, th, en, action, at, by FROM prediction_history ORDER BY id').all(),
        env.DB.prepare('SELECT * FROM checklist ORDER BY grp, ord').all()
      ])
      const day = now.slice(0, 10)
      return json({ exported_at: now, exported_by: who, predictions: p.results, prediction_history: h.results, checklist: c.results }, 200,
        { 'content-disposition': `attachment; filename="kaitianming-backup-${day}.json"` })
    }

    if (path === '/api/admin/checklist' && req.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, grp AS "group", ord AS "order", rank, priority, eta_th, eta_en, who, stage, status, title_en, title_th, note_en, note_th, updated_at, updated_by FROM checklist ORDER BY rank').all()
      return json(results)
    }
    const cm = path.match(/^\/api\/admin\/checklist\/([A-Za-z0-9_-]{1,40})$/)
    if (cm && req.method === 'PUT') {
      const body = (await req.json().catch(() => null)) as { status?: unknown } | null
      const status = body?.status
      if (status !== 'todo' && status !== 'doing' && status !== 'done') return json({ error: 'bad_status' }, 400)
      await env.DB.prepare('UPDATE checklist SET status = ?, updated_at = ?, updated_by = ? WHERE id = ?').bind(status, now, who, cm[1]).run()
      return json({ id: cm[1], status, updated_at: now, updated_by: who })
    }

    if (path === '/api/admin/predictions' && req.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT key, th, en, updated_at, updated_by FROM predictions').all()
      return json(results)
    }

    const m = path.match(/^\/api\/admin\/predictions\/([^/]+)(\/history)?$/)
    if (m) {
      const key = decodeURIComponent(m[1])
      if (!KEY_RE.test(key)) return json({ error: 'bad_key' }, 400)
      if (m[2] && req.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT th, en, action, at, by FROM prediction_history WHERE key = ? ORDER BY id DESC LIMIT 30').bind(key).all()
        return json(results)
      }
      if (req.method === 'PUT') {
        const body = (await req.json().catch(() => null)) as { th?: unknown; en?: unknown } | null
        const th = typeof body?.th === 'string' ? body.th.trim() : '', en = typeof body?.en === 'string' ? body.en.trim() : ''
        if (th.length > MAX_TEXT || en.length > MAX_TEXT) return json({ error: 'too_long' }, 400)
        await env.DB.batch([
          env.DB.prepare('INSERT INTO predictions (key, th, en, updated_at, updated_by) VALUES (?, ?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET th = excluded.th, en = excluded.en, updated_at = excluded.updated_at, updated_by = excluded.updated_by').bind(key, th, en, now, who),
          env.DB.prepare('INSERT INTO prediction_history (key, th, en, action, at, by) VALUES (?, ?, ?, ?, ?, ?)').bind(key, th, en, 'save', now, who)
        ])
        return json({ key, th, en, updated_at: now, updated_by: who })
      }
      if (req.method === 'DELETE') {
        await env.DB.batch([
          env.DB.prepare('DELETE FROM predictions WHERE key = ?').bind(key),
          env.DB.prepare('INSERT INTO prediction_history (key, th, en, action, at, by) VALUES (?, NULL, NULL, ?, ?, ?)').bind(key, 'delete', now, who)
        ])
        return json({ key, deleted: true })
      }
    }
  }
  return json({ error: 'not_found' }, 404)
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    if (url.pathname.startsWith('/api/')) {
      try { return await api(req, env, url) } catch { return json({ error: 'server_error' }, 500) }
    }
    return env.ASSETS.fetch(req)
  }
}
