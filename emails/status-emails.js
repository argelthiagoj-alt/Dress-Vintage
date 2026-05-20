// ============================================
// Status-change emails to the customer.
// Bundled in one file because they share the same shape.
// ============================================

import { layout, escapeHtml, fmtMoney, shippingSummary } from './_layout.js';

function orderUrlFor(siteUrl, orderNumber) {
  return `${siteUrl}/index.html#account:order:${encodeURIComponent(orderNumber)}`;
}

export function paymentConfirmedEmail({ order, siteUrl }) {
  return {
    subject: `Pago confirmado · ${order.order_number}`,
    html: layout({
      preheader: 'Tu pago llegó. Empezamos la preparación.',
      title: 'Pago confirmado',
      intro: `Hola <strong>${escapeHtml(order.customer_name)}</strong>, registramos tu pago para el pedido <strong>${escapeHtml(order.order_number)}</strong> (${fmtMoney(order.total)}). Ahora pasa al taller para preparación.`,
      body: shippingSummary(order),
      ctaText: 'Ver mi pedido',
      ctaUrl: orderUrlFor(siteUrl, order.order_number),
    }),
  };
}

export function orderPreparingEmail({ order, siteUrl }) {
  return {
    subject: `Pedido en preparación · ${order.order_number}`,
    html: layout({
      preheader: 'Estamos preparando tu pedido en el taller.',
      title: 'En preparación',
      intro: `Hola <strong>${escapeHtml(order.customer_name)}</strong>, tu pedido <strong>${escapeHtml(order.order_number)}</strong> está siendo armado y revisado en el taller. Te avisamos en cuanto sale para envío.`,
      body: shippingSummary(order),
      ctaText: 'Ver seguimiento',
      ctaUrl: orderUrlFor(siteUrl, order.order_number),
    }),
  };
}

export function orderShippedEmail({ order, siteUrl }) {
  return {
    subject: `Despachado · ${order.order_number}`,
    html: layout({
      preheader: order.shipping_tracking_code
        ? `Tracking: ${order.shipping_tracking_code}`
        : 'Tu pedido salió hacia tu dirección.',
      title: 'En camino',
      intro: `Hola <strong>${escapeHtml(order.customer_name)}</strong>, tu pedido <strong>${escapeHtml(order.order_number)}</strong> ya está en manos del correo. Tiempo estimado de entrega: 1-3 días hábiles en CABA, 3-7 en el interior.`,
      body: `
        ${shippingSummary(order)}
        ${order.shipping_tracking_code ? `
          <div style="margin-top:18px;padding:14px;border:1px dashed #cdcdc6;">
            <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b6b;margin-bottom:4px;">
              Código de seguimiento
            </div>
            <div style="font-family:'Courier New',monospace;font-size:15px;font-weight:600;">
              ${escapeHtml(order.shipping_tracking_code)}
            </div>
          </div>
        ` : ''}
      `,
      ctaText: 'Ver seguimiento',
      ctaUrl: orderUrlFor(siteUrl, order.order_number),
    }),
  };
}

export function orderDeliveredEmail({ order, siteUrl }) {
  return {
    subject: `Entregado · ${order.order_number}`,
    html: layout({
      preheader: 'Pedido entregado. Gracias por elegirnos.',
      title: 'Entregado',
      intro: `Hola <strong>${escapeHtml(order.customer_name)}</strong>, marcamos tu pedido <strong>${escapeHtml(order.order_number)}</strong> como entregado. Si algo no llegó como esperabas, contestá este mail y lo resolvemos.`,
      body: `
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#0a0a0a;">
          ¿Querés contarnos cómo te quedó? Etiquetanos en
          <a href="${process.env.INSTAGRAM_URL || '#'}" style="color:#0a0a0a;">Instagram</a>
          o respondé este mail con una foto. Nos pone contentos.
        </p>
      `,
      ctaText: 'Ver el próximo drop',
      ctaUrl: `${siteUrl}/index.html#catalog:all`,
    }),
  };
}

export function orderCancelledEmail({ order, siteUrl, reason }) {
  return {
    subject: `Pedido cancelado · ${order.order_number}`,
    html: layout({
      preheader: 'Tu pedido fue cancelado.',
      title: 'Pedido cancelado',
      intro: `Hola <strong>${escapeHtml(order.customer_name)}</strong>, cancelamos tu pedido <strong>${escapeHtml(order.order_number)}</strong>.`,
      body: `
        ${reason ? `
          <div style="margin:8px 0 18px;padding:14px;border-left:3px solid #e8412a;background:#ffe7df;">
            <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b6b;margin-bottom:4px;">
              Motivo
            </div>
            <div style="font-size:14px;color:#0a0a0a;">${escapeHtml(reason)}</div>
          </div>
        ` : ''}
        <p style="margin:0;font-size:14px;line-height:1.6;color:#0a0a0a;">
          Si el pedido fue pagado, el reintegro se procesa por el mismo medio en 3-10 días hábiles
          según el banco/procesador. Cualquier duda, contestá este mail.
        </p>
      `,
      ctaText: 'Volver al catálogo',
      ctaUrl: `${siteUrl}/index.html#catalog:all`,
    }),
  };
}
