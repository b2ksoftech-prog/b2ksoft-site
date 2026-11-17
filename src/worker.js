// Cloudflare Pages Function: stores the shop's products and settings in KV.
// GET  /api/state  -> latest saved data (public, read by the website)
// POST /api/state  -> {"check":true} verifies the admin password
// PUT  /api/state  -> saves products + settings (needs the admin password)
const KEY = 'state';
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
function same(a, b) { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

async function handleState(request, env) {
  if (!env.B2K_KV) return json({ error: 'KV namespace B2K_KV is not connected' }, 501);
  if (request.method === 'GET') {
    const v = await env.B2K_KV.get(KEY);
    if (!v) return json({ empty: true }, 404);
    return new Response(v, { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  }
  if (request.method === 'POST' || request.method === 'PUT') {
    if (!env.ADMIN_PASSWORD) return json({ error: 'ADMIN_PASSWORD is not set' }, 501);
    const pw = request.headers.get('x-admin-password') || '';
    if (!same(pw, String(env.ADMIN_PASSWORD))) { await new Promise(r => setTimeout(r, 800)); return json({ error: 'Wrong password' }, 401); }
    const text = await request.text();
    if (text.length > 24 * 1024 * 1024) return json({ error: 'Too large. Remove some photos.' }, 413);
    let data; try { data = JSON.parse(text); } catch (e) { return json({ error: 'Bad data' }, 400); }
    if (request.method === 'POST') return json({ ok: true });
    if (!data || !Array.isArray(data.products) || typeof data.settings !== 'object' || !data.settings) return json({ error: 'Bad data' }, 400);
    const clean = { products: data.products, settings: Object.assign({}, data.settings) };
    delete clean.settings.adminHash;
    await env.B2K_KV.put(KEY, JSON.stringify(clean));
    return json({ ok: true });
  }
  return json({ error: 'Method not allowed' }, 405);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/state') return handleState(request, env);
    return env.ASSETS.fetch(request);
  }
};
