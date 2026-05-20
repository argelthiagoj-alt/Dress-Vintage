// ============================================
// Shared email layout — header + body slot + footer.
// All styles are inline / table-based for cross-client compatibility.
// ============================================

export function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

export function fmtMoney(n) {
  const v = Number(n) || 0;
  return '$' + v.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function layout({ preheader, title, intro, body, ctaText, ctaUrl, footerNote }) {
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || 'https://dressvintage.com.ar';
  const instagram = process.env.INSTAGRAM_URL        || '';
  const whatsRaw  = process.env.WHATSAPP_CONTACT     || '';
  const whatsapp  = whatsRaw ? `https://wa.me/${whatsRaw.replace(/\D/g, '')}` : '';
  const contact   = process.env.REPLY_TO_EMAIL       || 'contacto@dressvintage.com.ar';
  const domain    = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4ef;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0a0a0a;-webkit-font-smoothing:antialiased;">
  <div style="display:none;font-size:1px;color:#f4f4ef;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(preheader || '')}
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f4f4ef;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e6e6e1;">

          <!-- HEADER -->
          <tr>
            <td style="padding:28px 32px 18px;border-bottom:1px solid #e6e6e1;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="font-family:'Archivo Black','Helvetica Neue',sans-serif;font-weight:900;font-size:22px;letter-spacing:-0.02em;text-transform:uppercase;color:#0a0a0a;">
                    DRESSVINTAGE
                  </td>
                  <td align="right" style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;color:#6b6b6b;text-transform:uppercase;">
                    BUENOS AIRES · CAP·03
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <h1 style="margin:0 0 14px;font-family:'Archivo Black','Helvetica Neue',sans-serif;font-weight:900;font-size:32px;line-height:1.05;letter-spacing:-0.03em;text-transform:uppercase;color:#0a0a0a;">
                ${escapeHtml(title)}
              </h1>
              ${intro ? `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#0a0a0a;">${intro}</p>` : ''}
              ${body || ''}
              ${ctaText && ctaUrl ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 12px;">
                  <tr>
                    <td bgcolor="#0a0a0a" style="border:1px solid #0a0a0a;">
                      <a href="${ctaUrl}" style="display:inline-block;padding:14px 24px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                        ${escapeHtml(ctaText)} →
                      </a>
                    </td>
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>

          ${footerNote ? `
            <tr>
              <td style="padding:0 32px 28px;font-size:12px;line-height:1.6;color:#6b6b6b;">
                ${footerNote}
              </td>
            </tr>
          ` : `<tr><td style="padding:0 32px 28px;"></td></tr>`}

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 32px;background:#0a0a0a;color:#ffffff;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#cdcdc6;margin-bottom:10px;">
                DressVintage · Buenos Aires
              </div>
              <div style="font-size:12px;color:#ffffff;line-height:1.7;">
                <a href="mailto:${contact}" style="color:#ffffff;text-decoration:underline;">${contact}</a>
                ${instagram ? ` · <a href="${instagram}" style="color:#ffffff;text-decoration:underline;">Instagram</a>` : ''}
                ${whatsapp ? ` · <a href="${whatsapp}" style="color:#ffffff;text-decoration:underline;">WhatsApp</a>` : ''}
              </div>
              <div style="margin-top:14px;font-size:10px;color:#6b6b6b;font-family:'Courier New',monospace;letter-spacing:0.14em;text-transform:uppercase;">
                © 2026 DRESSVINTAGE · <a href="${siteUrl}" style="color:#6b6b6b;text-decoration:underline;">${escapeHtml(domain)}</a>
              </div>
            </td>
          </tr>
        </table>

        ${footerNote ? '' : ''}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Renders the order line items as a simple table. */
export function orderItemsTable(items) {
  const rows = items.map(it => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #e6e6e1;vertical-align:top;">
        <div style="font-size:14px;font-weight:600;">${escapeHtml(it.product_name || it.productName)}</div>
        <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.14em;color:#6b6b6b;text-transform:uppercase;margin-top:2px;">
          T:${escapeHtml(it.size || '—')} · ${escapeHtml(it.color || '—')} · ×${it.qty}
        </div>
      </td>
      <td align="right" style="padding:10px 8px;border-bottom:1px solid #e6e6e1;font-family:'Courier New',monospace;font-size:13px;white-space:nowrap;vertical-align:top;">
        ${fmtMoney(it.subtotal != null ? it.subtotal : (it.unit_price * it.qty))}
      </td>
    </tr>
  `).join('');
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:8px 0 16px;">
      ${rows}
    </table>
  `;
}

/** Totals block with subtotal, discount, shipping, total. */
export function orderTotalsBlock({ subtotal, discount, shippingCost, total }) {
  const row = (label, value, opts = {}) => `
    <tr>
      <td style="padding:6px 0;font-size:13px;${opts.mute ? 'color:#6b6b6b;' : ''}">${escapeHtml(label)}</td>
      <td align="right" style="padding:6px 0;font-family:'Courier New',monospace;font-size:13px;${opts.mute ? 'color:#6b6b6b;' : ''}">${value}</td>
    </tr>
  `;
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:8px;">
      ${row('Subtotal', fmtMoney(subtotal))}
      ${discount > 0 ? row('Descuento', '− ' + fmtMoney(discount), { mute: true }) : ''}
      ${row('Envío', shippingCost === 0 ? 'Gratis' : fmtMoney(shippingCost), { mute: true })}
      <tr>
        <td style="padding:14px 0 6px;border-top:1px solid #0a0a0a;font-size:15px;font-weight:700;">Total</td>
        <td align="right" style="padding:14px 0 6px;border-top:1px solid #0a0a0a;font-family:'Courier New',monospace;font-size:15px;font-weight:700;">${fmtMoney(total)}</td>
      </tr>
    </table>
  `;
}

/** Address summary block for shipping. */
export function shippingSummary(order) {
  const method = ({
    domicilio: 'Envío a domicilio',
    sucursal:  'Retiro en sucursal',
    taller:    'Retiro en taller (Av. F. Lacroze 3500)',
  })[order.shipping_method] || order.shipping_method;

  const addr = [order.shipping_address, order.shipping_city, order.shipping_postal_code]
    .filter(Boolean).join(' · ');

  return `
    <div style="margin-top:18px;padding:14px;border:1px solid #e6e6e1;background:#f7f7f2;">
      <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6b6b6b;margin-bottom:6px;">Entrega</div>
      <div style="font-size:13px;">${escapeHtml(method)}</div>
      ${addr ? `<div style="font-size:13px;color:#6b6b6b;margin-top:4px;">${escapeHtml(addr)}</div>` : ''}
      ${order.shipping_tracking_code ? `
        <div style="margin-top:8px;font-family:'Courier New',monospace;font-size:12px;">
          Código de seguimiento: <strong>${escapeHtml(order.shipping_tracking_code)}</strong>
        </div>
      ` : ''}
    </div>
  `;
}
