// ============================================
// POST /api/orders/update-status
// Headers: Authorization: Bearer <ADMIN_API_SECRET>
// Body: {
//   order_number: string,
//   order_status?: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled',
//   payment_status?: 'pending_payment' | 'paid' | 'rejected' | 'refunded',
//   tracking_code?: string,
//   note?: string,
//   changed_by?: string  // optional uuid of admin user
// }
//
// On status change, sends the matching customer email.
// ============================================

import { supabaseAdmin } from '../../lib/supabase-admin.js';
import { sendEmail } from '../../lib/resend-client.js';
import {
  readJsonBody, methodNotAllowed, badRequest, serverError, ok, requireAdminSecret,
} from '../../lib/http.js';
import {
  paymentConfirmedEmail,
  orderPreparingEmail,
  orderShippedEmail,
  orderDeliveredEmail,
  orderCancelledEmail,
} from '../../emails/status-emails.js';

const VALID_ORDER_STATUS   = new Set(['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']);
const VALID_PAYMENT_STATUS = new Set(['pending_payment', 'paid', 'rejected', 'refunded']);

function emailForOrderStatus(status, args) {
  switch (status) {
    case 'confirmed':  return paymentConfirmedEmail(args);
    case 'preparing':  return orderPreparingEmail(args);
    case 'shipped':    return orderShippedEmail(args);
    case 'delivered':  return orderDeliveredEmail(args);
    case 'cancelled':  return orderCancelledEmail(args);
    default:           return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  if (!requireAdminSecret(req, res)) return; // 401 already sent

  const body = readJsonBody(req);
  const orderNumber = (body.order_number || '').trim();
  if (!orderNumber) return badRequest(res, 'order_number_required');

  if (body.order_status   != null && !VALID_ORDER_STATUS.has(body.order_status))
    return badRequest(res, 'order_status_invalid');
  if (body.payment_status != null && !VALID_PAYMENT_STATUS.has(body.payment_status))
    return badRequest(res, 'payment_status_invalid');

  const sb = supabaseAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  // Load order
  const { data: order, error: getErr } = await sb
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .maybeSingle();
  if (getErr)   return serverError(res, 'order_lookup_failed', getErr.message);
  if (!order)   return res.status(404).json({ error: 'order_not_found' });

  // Build patch
  const patch = {};
  if (body.order_status   != null) patch.order_status   = body.order_status;
  if (body.payment_status != null) patch.payment_status = body.payment_status;
  if (body.tracking_code  != null) patch.shipping_tracking_code = String(body.tracking_code).trim() || null;
  if (Object.keys(patch).length === 0) return badRequest(res, 'no_changes');

  // Apply
  const { data: updated, error: updErr } = await sb
    .from('orders')
    .update(patch)
    .eq('id', order.id)
    .select('*')
    .single();
  if (updErr) return serverError(res, 'order_update_failed', updErr.message);

  // History
  const hist = [];
  const changed_by = body.changed_by || null;
  if (patch.order_status && patch.order_status !== order.order_status) {
    hist.push({ order_id: order.id, status: patch.order_status, note: body.note || null, changed_by });
  }
  if (patch.payment_status && patch.payment_status !== order.payment_status) {
    hist.push({ order_id: order.id, status: 'payment:' + patch.payment_status, note: body.note || null, changed_by });
  }
  if (patch.shipping_tracking_code && patch.shipping_tracking_code !== order.shipping_tracking_code) {
    hist.push({ order_id: order.id, status: 'tracking_updated', note: patch.shipping_tracking_code, changed_by });
  }
  if (hist.length) {
    await sb.from('order_status_history').insert(hist);
  }

  // Customer email (fire and forget) — only when order_status actually changed
  if (process.env.RESEND_API_KEY && patch.order_status && patch.order_status !== order.order_status) {
    Promise.resolve().then(async () => {
      try {
        const tpl = emailForOrderStatus(patch.order_status, {
          order: updated,
          siteUrl,
          reason: body.note,
        });
        if (tpl) {
          await sendEmail({
            to: updated.customer_email,
            subject: tpl.subject,
            html: tpl.html,
            tags: { type: 'status-' + patch.order_status, order: updated.order_number },
          });
        }
      } catch (e) {
        console.error('[update-status] customer email failed', e);
      }
    });
  }

  return ok(res, {
    order: {
      order_number: updated.order_number,
      order_status: updated.order_status,
      payment_status: updated.payment_status,
      shipping_tracking_code: updated.shipping_tracking_code,
    },
  });
}
