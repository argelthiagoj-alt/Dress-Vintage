// ============================================
// GET /api/newsletter/unsubscribe?token=...
// Renders a simple HTML confirmation page.
// ============================================

import { supabaseAdmin } from '../../lib/supabase-admin.js';

function page({ title, message, accent = '#0a0a0a' }) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · DressVintage</title>
  <style>
    body {
      margin: 0; padding: 0;
      background: #f4f4ef; color: #0a0a0a;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      min-height: 100vh; display: grid; place-items: center;
    }
    .box {
      max-width: 460px; margin: 24px;
      padding: 36px 28px;
      background: #fff; border: 1px solid #e6e6e1;
      text-align: center;
    }
    h1 {
      font-family: 'Archivo Black', sans-serif; font-weight: 900;
      font-size: 32px; letter-spacing: -0.03em; text-transform: uppercase;
      margin: 0 0 12px;
    }
    p { font-size: 14px; line-height: 1.6; color: #0a0a0a; margin: 0 0 18px; }
    a.btn {
      display: inline-block; padding: 12px 20px;
      background: ${accent}; color: #fff; text-decoration: none;
      font-family: 'Courier New', monospace; font-size: 11px;
      letter-spacing: 0.18em; text-transform: uppercase;
    }
    .brand {
      font-family: 'Archivo Black', sans-serif; font-weight: 900;
      font-size: 14px; letter-spacing: -0.02em; text-transform: uppercase;
      color: #6b6b6b; margin-bottom: 24px;
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="brand">DRESSVINTAGE</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a class="btn" href="${process.env.NEXT_PUBLIC_SITE_URL || '/'}">Volver al sitio →</a>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  const token = (req.query.token || '').trim();
  if (!token) {
    return res.status(400).send(page({
      title: 'Token faltante',
      message: 'El link de baja parece incompleto. Si el problema persiste, escribinos a contacto@dressvintage.com.ar.',
      accent: '#e8412a',
    }));
  }

  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('unsubscribe_token', token)
      .select('email')
      .maybeSingle();

    if (error) {
      console.error('[unsubscribe] update error', error);
      return res.status(500).send(page({
        title: 'Algo falló',
        message: 'No pudimos procesar la baja. Probá de nuevo en un rato o escribinos.',
        accent: '#e8412a',
      }));
    }

    if (!data) {
      return res.status(404).send(page({
        title: 'Link inválido',
        message: 'No encontramos esa suscripción. Tal vez el link expiró o ya te diste de baja antes.',
      }));
    }

    return res.status(200).send(page({
      title: 'Listo',
      message: `Te dimos de baja del newsletter (${data.email}). No vas a recibir más mails de DressVintage. Volvé cuando quieras.`,
    }));
  } catch (e) {
    console.error('[unsubscribe] threw', e);
    return res.status(500).send(page({
      title: 'Error',
      message: 'Algo no anduvo. Intentá de nuevo en un rato.',
      accent: '#e8412a',
    }));
  }
}
