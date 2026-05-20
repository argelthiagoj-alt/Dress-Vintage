import { layout, escapeHtml, fmtMoney, orderItemsTable, orderTotalsBlock, shippingSummary } from './_layout.js';

/** For payments that confirm instantly (Mercado Pago, tarjeta). */
export function orderCreatedEmail({ order, items, siteUrl }) {
  const orderUrl = `${siteUrl}/index.html#account:order:${encodeURIComponent(order.order_number)}`;
  return {
    subject: `Recibimos tu pedido ${order.order_number}`,
    html: layout({
      preheader: `${order.order_number} · total ${fmtMoney(order.total)}`,
      title: 'Compra confirmada',
      intro: `Hola <strong>${escapeHtml(order.customer_name)}</strong>, registramos tu pedido <strong>${escapeHtml(order.order_number)}</strong>. Lo preparamos en el taller en las próximas 24-48hs hábiles.`,
      body: `
        ${orderItemsTable(items)}
        ${orderTotalsBlock({
          subtotal:     order.subtotal,
          discount:     order.discount,
          shippingCost: order.shipping_cost,
          total:        order.total,
        })}
        ${shippingSummary(order)}
        <p style="margin:18px 0 0;font-size:13px;color:#6b6b6b;">
          Te avisamos por mail cuando lo despachemos.
        </p>
      `,
      ctaText: 'Ver mi pedido',
      ctaUrl: orderUrl,
    }),
  };
}
