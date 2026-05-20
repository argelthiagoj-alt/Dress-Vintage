// ============================================
// POST /api/orders/create
// Body: {
//   customer: { name, email, phone? },
//   shipping: { method, address?, city?, postalCode? },
//   payment:  { method },
//   items:    [{ product_id, size?, color?, qty }],
//   userId?:  string  // for logged-in users (server should ideally verify a JWT;
//                     // for now this is trusted as a hint and used only for the user_id column)
// }
//
// Returns: { ok: true, order: { order_number, id, total } }
//
// All pricing is recalculated server-side from the products table.
// Sends 2 emails: customer (order-created OR order-transfer-pending) + admin (admin-new-order).
// ============================================

import { supabaseAdmin } from '../../lib/supabase-admin.js';
import { sendEmail } from '../../lib/resend-client.js';
import {
  validateEmail, validateNonEmptyString, validatePhone,
  validateShippingMethod, validatePaymentMethod, validateInt,
} from '../../lib/validators.js';
import {
  readJsonBody, methodNotAllowed, badRequest, serverError, created,
} from '../../lib/http.js';
import { loadProductsById } from '../../lib/product-catalog.js';
import { priceOrder } from '../../lib/pricing.js';
import { nextOrderNumber } from '../../lib/order-id.js';
import { orderCreatedEmail } from '../../emails/order-created.js';
import { orderTransferPendingEmail } from '../../emails/order-transfer-pending.js';
import { adminNewOrderEmail } from '../../emails/admin-new-order.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');

  const body = readJsonBody(req);
  const customer = body.customer || {};
  const shipping = body.shipping || {};
  const payment  = body.payment  || {};
  const items    = Array.isArray(body.items) ? body.items : [];

  // ---- Validate ----
  const nameV    = validateNonEmptyString(customer.name, 120);
  if (!nameV.ok)  return badRequest(res, 'customer_name_' + nameV.error);
  const emailV   = validateEmail(customer.email);
  if (!emailV.ok) return badRequest(res, 'customer_email_' + emailV.error);
  const phoneV   = validatePhone(customer.phone);
  if (!phoneV.ok) return badRequest(res, 'customer_phone_' + phoneV.error);

  const shipMV = validateShippingMethod(shipping.method);
  if (!shipMV.ok) return badRequest(res, shipMV.error);
  const payMV  = validatePaymentMethod(payment.method);
  if (!payMV.ok)  return badRequest(res, payMV.error);

  // For domicilio/sucursal require address basics
  if (shipMV.value !== 'taller') {
    if (!shipping.address || typeof shipping.address !== 'string' || !shipping.address.trim()) {
      return badRequest(res, 'shipping_address_required');
    }
    if (!shipping.city || typeof shipping.city !== 'string' || !shipping.city.trim()) {
      return badRequest(res, 'shipping_city_required');
    }
    if (!shipping.postalCode || typeof shipping.postalCode !== 'string' || !shipping.postalCode.trim()) {
      return badRequest(res, 'shipping_postal_code_required');
    }
  }

  if (items.length === 0)  return badRequest(res, 'cart_empty');
  if (items.length > 50)   return badRequest(res, 'cart_too_large');

  for (const it of items) {
    if (!it.product_id || typeof it.product_id !== 'string') return badRequest(res, 'item_product_id_invalid');
    const q = validateInt(it.qty, { min: 1, max: 99 });
    if (!q.ok) return badRequest(res, 'item_qty_invalid');
  }

  // ---- Price (server-side) ----
  let priced;
  try {
    const catalog = await loadProductsById();
    priced = priceOrder({
      items,
      shippingMethod: shipMV.value,
      paymentMethod:  payMV.value,
      productsById:   catalog,
    });
  } catch (e) {
    return badRequest(res, e.message);
  }

  const sb = supabaseAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  // Determine initial payment + order status from payment method
  const instantPay = payMV.value === 'mercado_pago' || payMV.value === 'tarjeta';
  const paymentStatus = instantPay ? 'paid' : 'pending_payment';
  const orderStatus   = instantPay ? 'confirmed' : 'pending';

  // ---- Insert order ----
  let orderRow;
  try {
    const order_number = await nextOrderNumber();
    const insertPayload = {
      order_number,
      user_id:              body.userId || null,
      customer_email:       emailV.value,
      customer_name:        nameV.value,
      customer_phone:       phoneV.value || null,
      shipping_method:      shipMV.value,
      shipping_address:     shipping.address ? String(shipping.address).trim() : null,
      shipping_city:        shipping.city    ? String(shipping.city).trim()    : null,
      shipping_postal_code: shipping.postalCode ? String(shipping.postalCode).trim() : null,
      payment_method:       payMV.value,
      payment_status:       paymentStatus,
      order_status:         orderStatus,
      subtotal:             priced.subtotal,
      discount:             priced.discount,
      shipping_cost:        priced.shippingCost,
      total:                priced.total,
    };
    const { data, error } = await sb
      .from('orders')
      .insert(insertPayload)
      .select('*')
      .single();
    if (error) return serverError(res, 'order_insert_failed', error.message);
    orderRow = data;
  } catch (e) {
    return serverError(res, 'order_insert_threw', e.message);
  }

  // ---- Insert items ----
  try {
    const itemsPayload = priced.items.map(it => ({
      order_id:     orderRow.id,
      product_id:   it.product_id,
      product_name: it.product_name,
      size:         it.size,
      color:        it.color,
      qty:          it.qty,
      unit_price:   it.unit_price,
      subtotal:     it.subtotal,
      image:        it.image,
    }));
    const { error: itemsErr } = await sb.from('order_items').insert(itemsPayload);
    if (itemsErr) {
      console.error('[orders.create] items insert failed; rolling back order');
      await sb.from('orders').delete().eq('id', orderRow.id);
      return serverError(res, 'items_insert_failed', itemsErr.message);
    }
  } catch (e) {
    await sb.from('orders').delete().eq('id', orderRow.id);
    return serverError(res, 'items_insert_threw', e.message);
  }

  // ---- Initial history entries ----
  try {
    const history = [{ order_id: orderRow.id, status: 'pending', note: 'Pedido creado' }];
    if (orderStatus !== 'pending') {
      history.push({ order_id: orderRow.id, status: orderStatus, note: 'Pago confirmado' });
    }
    await sb.from('order_status_history').insert(history);
  } catch (e) {
    console.error('[orders.create] history insert failed (non-fatal)', e);
  }

  // ---- Emails (fire and forget) ----
  if (process.env.RESEND_API_KEY) {
    Promise.resolve().then(async () => {
      try {
        const tplArgs = { order: orderRow, items: priced.items, siteUrl };
        const customerTpl = instantPay
          ? orderCreatedEmail(tplArgs)
          : orderTransferPendingEmail(tplArgs);
        await sendEmail({
          to: orderRow.customer_email,
          subject: customerTpl.subject,
          html: customerTpl.html,
          tags: { type: instantPay ? 'order-created' : 'order-transfer-pending', order: orderRow.order_number },
        });
      } catch (e) {
        console.error('[orders.create] customer email failed', e);
      }
      try {
        const adminTpl = adminNewOrderEmail({ order: orderRow, items: priced.items, siteUrl });
        const to = process.env.ADMIN_ORDERS_EMAIL;
        if (to) {
          await sendEmail({
            to,
            subject: adminTpl.subject,
            html: adminTpl.html,
            tags: { type: 'admin-new-order', order: orderRow.order_number },
          });
        }
      } catch (e) {
        console.error('[orders.create] admin email failed', e);
      }
    });
  }

  return created(res, {
    order: {
      id:           orderRow.id,
      order_number: orderRow.order_number,
      total:        orderRow.total,
      payment_status: orderRow.payment_status,
      order_status:   orderRow.order_status,
    },
  });
}
