// ============================================
// Tiny HTTP helpers shared by all API routes.
// ============================================

export function readJsonBody(req) {
  // Vercel Node functions parse JSON bodies automatically if Content-Type is JSON.
  // For safety, normalize: if it's a string, parse it.
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

export function methodNotAllowed(res, allowed = 'POST') {
  res.setHeader('Allow', allowed);
  return res.status(405).json({ error: 'method_not_allowed' });
}

export function badRequest(res, error, extra) {
  return res.status(400).json({ error, ...(extra || {}) });
}

export function serverError(res, error, extra) {
  console.error('[api] 500', error, extra || '');
  return res.status(500).json({ error: typeof error === 'string' ? error : 'server_error' });
}

export function ok(res, body) {
  return res.status(200).json({ ok: true, ...body });
}

export function created(res, body) {
  return res.status(201).json({ ok: true, ...body });
}

/**
 * Verifies the admin shared secret on Authorization: Bearer <ADMIN_API_SECRET>.
 * Returns true if ok, false (and writes 401) otherwise.
 */
export function requireAdminSecret(req, res) {
  const expected = process.env.ADMIN_API_SECRET;
  const got = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!expected || got !== expected) {
    res.status(401).json({ error: 'unauthorized' });
    return false;
  }
  return true;
}
