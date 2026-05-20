// ============================================
// POST /api/newsletter/subscribe
// Body: { email: string, consent: true, source?: string }
// ============================================

import { supabaseAdmin } from '../../lib/supabase-admin.js';
import { sendEmail } from '../../lib/resend-client.js';
import { validateEmail } from '../../lib/validators.js';
import { readJsonBody, methodNotAllowed, badRequest, serverError, ok, created } from '../../lib/http.js';
import { newsletterWelcomeEmail } from '../../emails/newsletter-welcome.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  const body = readJsonBody(req);
  const emailCheck = validateEmail(body.email);
  if (!emailCheck.ok) return badRequest(res, emailCheck.error);
  if (body.consent !== true) return badRequest(res, 'consent_required');

  const email  = emailCheck.value;
  const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'footer';
  const sb     = supabaseAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  try {
    // Check existing subscriber
    const { data: existing, error: selErr } = await sb
      .from('newsletter_subscribers')
      .select('id, status, unsubscribe_token, email')
      .eq('email', email)
      .maybeSingle();

    if (selErr) return serverError(res, 'lookup_failed', selErr.message);

    let row;
    let isNew = false;

    if (!existing) {
      const { data, error } = await sb
        .from('newsletter_subscribers')
        .insert({ email, source })
        .select('id, email, unsubscribe_token')
        .single();
      if (error) {
        // race: another concurrent subscribe just inserted — treat as success
        if (error.code === '23505') {
          return ok(res, { alreadySubscribed: true });
        }
        return serverError(res, 'insert_failed', error.message);
      }
      row = data;
      isNew = true;
    } else if (existing.status === 'unsubscribed') {
      // re-activate
      const { data, error } = await sb
        .from('newsletter_subscribers')
        .update({
          status:        'active',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          consent_at:    new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('id, email, unsubscribe_token')
        .single();
      if (error) return serverError(res, 'reactivate_failed', error.message);
      row = data;
      isNew = true;
    } else {
      // already active
      return ok(res, { alreadySubscribed: true });
    }

    // Fire-and-forget welcome email; do not block the response on email failure
    if (process.env.RESEND_API_KEY) {
      try {
        const { subject, html } = newsletterWelcomeEmail({
          email: row.email,
          unsubscribeUrl: `${siteUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(row.unsubscribe_token)}`,
          siteUrl,
        });
        await sendEmail({
          to: row.email,
          subject,
          html,
          tags: { type: 'newsletter-welcome' },
        });
      } catch (e) {
        console.error('[subscribe] welcome email failed', e);
      }
    }

    return created(res, { isNew });
  } catch (e) {
    return serverError(res, e.message);
  }
}
