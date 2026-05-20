import { layout, escapeHtml, fmtMoney, orderItemsTable, orderTotalsBlock, shippingSummary } from './_layout.js';

/** Internal notification to ventas@ when a new order comes in. */
export function adminNewOrderEmail({ order, items, siteUrl }) {
  const adminUrl = `${siteUrl}/index.html#admin:order:${encodeURIComponent(order.order_number)}`;
  return {
    subject: `🔔 Nuevo pedido ${order.order_number} · ${fmtMoney(order.total)}`,
    html: layout({
      preheader: `${order.customer_name} · ${order.payment_method} · ${order.payment_status}`,
      title: 'Nuevo pedido recibido',
      intro: `Entró el pedido <strong>${escapeHtml(order.order_number)}</strong> de <strong>${escapeHtml(order.customer_name)}</strong>.`,
      body: `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
          <tr>
            <td style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.14em;color:#6b6b6b;text-transform:uppercase;padding:4px 0;">Cliente</td>
            <td align="right" style="font-size:13px;padding:4px 0;">${escapeHtml(order.customer_name)}</td>
          </tr>
          <tr>
            <td style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.14em;color:#6b6b6b;text-transform:uppercase;padding:4px 0;">Email</td>
            <td align="right" style="font-family:'Courier New',monospace;font-size:12px;padding:4px 0;">${escapeHtml(order.customer_email)}</td>
          </tr>
          ${order.customer_phone ? `
            <tr>
              <td style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.14em;color:#6b6b6b;text-transform:uppercase;padding:4px 0;">Teléfono</td>
              <td align="right" style="font-family:'Courier New',monospace;font-size:12px;padding:4px 0;">${escapeHtml(order.customer_phone)}</td>
            </tr>
          ` : ''}
          <tr>
            <td style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.14em;color:#6b6b6b;text-transform:uppercase;padding:4px 0;">Pago</td>
            <td align="right" style="font-size:13px;padding:4px 0;">${escapeHtml(order.payment_method)} · <strong>${escapeHtml(order.payment_status)}</strong></td>
          </tr>
        </table>

        ${orderItemsTable(items)}
        ${orderTotalsBlock({
          subtotal:     order.subtotal,
          discount:     order.discount,
          shippingCost: order.shipping_cost,
          total:        order.total,
        })}
        ${shippingSummary(order)}
      `,
      ctaText: 'Abrir en el panel',
      ctaUrl: adminUrl,
    }),
  };
}
