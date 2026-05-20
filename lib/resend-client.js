// ============================================
// Resend client + sendEmail helper.
// Wraps the SDK so all sends go through one place (logging, reply-to, from).
// ============================================

import { Resend } from 'resend';

let _resend = null;

function client() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is required');
  _resend = new Resend(key);
  return _resend;
}

function fromHeader() {
  const email = process.env.RESEND_FROM_EMAIL || 'no-reply@dressvintage.com.ar';
  const name  = process.env.RESEND_FROM_NAME  || 'DressVintage';
  return `${name} <${email}>`;
}

/**
 * Send a transactional email.
 * @param {object} opts
 * @param {string|string[]} opts.to
 * @param {string} opts.subject
 * @param {string} opts.html
 * @param {string} [opts.text]          plain-text fallback
 * @param {string} [opts.replyTo]       defaults to REPLY_TO_EMAIL
 * @param {object} [opts.tags]          e.g. { type: 'order-created', orderId: '...' }
 * @returns {Promise<{ id: string | null, error: string | null }>}
 */
export async function sendEmail({ to, subject, html, text, replyTo, tags }) {
  const r = client();
  const reply_to = replyTo || process.env.REPLY_TO_EMAIL || undefined;
  const payload = {
    from: fromHeader(),
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    reply_to,
    tags: tags
      ? Object.entries(tags).map(([name, value]) => ({ name, value: String(value) }))
      : undefined,
  };
  try {
    const { data, error } = await r.emails.send(payload);
    if (error) {
      console.error('[resend] send error', error);
      return { id: null, error: error.message || String(error) };
    }
    return { id: data?.id || null, error: null };
  } catch (e) {
    console.error('[resend] send threw', e);
    return { id: null, error: e.message || String(e) };
  }
}
