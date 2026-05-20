import { layout, escapeHtml, fmtMoney, orderItemsTable, orderTotalsBlock, shippingSummary } from './_layout.js';

/** For transferencia / efectivo — payment pending. Includes bank details. */
export function orderTransferPendingEmail({ order, items, siteUrl }) {
  const holder  = process.env.BANK_ACCOUNT_HOLDER || '—';
  const cbu     = process.env.BANK_ACCOUNT_CBU    || '—';
  const alias   = process.env.BANK_ACCOUNT_ALIAS  || '—';
  const cuit    = process.env.BANK_ACCOUNT_CUIT   || '—';
  const orderUrl = `${siteUrl}/index.html#account:order:${encodeURIComponent(order.order_number)}`;
  const contact  = process.env.REPLY_TO_EMAIL || 'contacto@dressvintage.com.ar';

  const isCash = order.payment_method === 'efectivo';

  return {
    subject: `Pedido ${order.order_number} · pendiente de pago`,
    html: layout({
      preheader: isCash
        ? `Te esperamos en el taller para abonar y retirar. Total ${fmtMoney(order.total)}.`
        : `Total con descuento: ${fmtMoney(order.total)}. Datos para la transferencia abajo.`,
      title: isCash ? 'Pedido reservado' : 'Esperando tu transferencia',
      intro: `Hola <strong>${escapeHtml(order.customer_name)}</strong>, recibimos tu pedido <strong>${escapeHtml(order.order_number)}</strong>${order.discount > 0 ? ` con descuento por ${isCash ? 'efectivo' : 'transferencia'}` : ''}.`,
      body: `
        ${orderItemsTable(items)}
        ${orderTotalsBlock({
          subtotal:     order.subtotal,
          discount:     order.discount,
          shippingCost: order.shipping_cost,
          total:        order.total,
        })}

        ${isCash ? `
          <div style="margin-top:24px;padding:16px;border:1px solid #0a0a0a;background:#f7f7f2;">
            <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b6b;margin-bottom:8px;">
              Pago en taller
            </div>
            <div style="font-size:14px;">
              Te esperamos en <strong>Av. F. Lacroze 3500, CABA</strong> de Lun a Vie 12-19hs (Sáb 12-17hs).
            </div>
            <div style="font-size:13px;color:#6b6b6b;margin-top:6px;">
              Coordinamos día/hora exacta por WhatsApp.
            </div>
          </div>
        ` : `
          <div style="margin-top:24px;padding:16px;border:1px solid #0a0a0a;background:#f7f7f2;">
            <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b6b;margin-bottom:8px;">
              Datos para transferir
            </div>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:13px;line-height:1.7;">
              <tr><td style="color:#6b6b6b;width:120px;">Titular</td><td>${escapeHtml(holder)}</td></tr>
              <tr><td style="color:#6b6b6b;">CBU</td><td style="font-family:'Courier New',monospace;">${escapeHtml(cbu)}</td></tr>
              <tr><td style="color:#6b6b6b;">Alias</td><td style="font-family:'Courier New',monospace;">${escapeHtml(alias)}</td></tr>
              <tr><td style="color:#6b6b6b;">CUIT/CUIL</td><td style="font-family:'Courier New',monospace;">${escapeHtml(cuit)}</td></tr>
              <tr><td style="color:#6b6b6b;">Importe</td><td><strong>${fmtMoney(order.total)}</strong></td></tr>
              <tr><td style="color:#6b6b6b;">Referencia</td><td><strong>${escapeHtml(order.order_number)}</strong></td></tr>
            </table>
            <p style="margin:14px 0 0;font-size:13px;color:#0a0a0a;">
              Envianos el comprobante por mail a
              <a href="mailto:${contact}" style="color:#0a0a0a;">${escapeHtml(contact)}</a>
              o por WhatsApp citando el número de pedido.
            </p>
          </div>
        `}

        ${shippingSummary(order)}

        <p style="margin:18px 0 0;font-size:13px;color:#6b6b6b;">
          Una vez confirmado el pago empezamos la preparación y te avisamos por mail.
        </p>
      `,
      ctaText: 'Ver mi pedido',
      ctaUrl: orderUrl,
    }),
  };
}
