import { layout, escapeHtml } from './_layout.js';

/**
 * Generic newsletter for a new drop / capítulo.
 * Pass `products` (array of { name, price, image, url }) and the template lists them.
 */
export function newsletterDropEmail({
  email,
  unsubscribeUrl,
  siteUrl,
  capitulo = 'Capítulo 03 · Otoño 2026',
  headline = 'Ruido contenido, forma nueva.',
  subhead  = '8 piezas. Tiradas cortas. Sin reposición.',
  products = [],
}) {
  const productRows = products.length === 0 ? '' : products.map(p => `
    <td width="50%" style="padding:8px;vertical-align:top;">
      <a href="${p.url || siteUrl}" style="text-decoration:none;color:#0a0a0a;">
        ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" width="260" style="display:block;width:100%;max-width:260px;height:auto;border:1px solid #e6e6e1;" />` : ''}
        <div style="margin-top:8px;font-size:13px;font-weight:600;">${escapeHtml(p.name)}</div>
        <div style="font-family:'Courier New',monospace;font-size:12px;color:#6b6b6b;">${escapeHtml(p.priceFormatted || '')}</div>
      </a>
    </td>
  `).join('');

  return {
    subject: `Nuevo drop · ${capitulo}`,
    html: layout({
      preheader: subhead,
      title: headline,
      intro: `<strong>${escapeHtml(capitulo)}</strong> ya está online. ${escapeHtml(subhead)}`,
      body: products.length === 0 ? '' : `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:16px 0;">
          <tr>${productRows}</tr>
        </table>
      `,
      ctaText: 'Explorar el drop',
      ctaUrl: `${siteUrl}/index.html#catalog:all`,
      footerNote: `
        <p style="margin:0;">
          ¿No querés más mails? <a href="${unsubscribeUrl}" style="color:#6b6b6b;">Date de baja</a>.
        </p>
      `,
    }),
  };
}
