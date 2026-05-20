import { layout, escapeHtml } from './_layout.js';

export function newsletterWelcomeEmail({ email, unsubscribeUrl, siteUrl }) {
  const shop = `${siteUrl}/index.html#catalog:all`;
  return {
    subject: 'Bienvenido a DressVintage',
    html: layout({
      preheader: 'Drops antes que nadie. Sin spam.',
      title: 'Estás dentro.',
      intro: `Gracias por sumarte a la lista, <strong>${escapeHtml(email)}</strong>. Vas a recibir nuestros drops antes que nadie, junto a notas editoriales y promos puntuales. Sin saturación.`,
      body: `
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#0a0a0a;">
          Mientras tanto, podés empezar a mirar el catálogo en curso —
          <strong>Capítulo 03 · Otoño 2026</strong>.
        </p>
      `,
      ctaText: 'Ver el drop',
      ctaUrl: shop,
      footerNote: `
        <p style="margin:0;">
          Recibís este email porque te suscribiste en <a href="${siteUrl}" style="color:#0a0a0a;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>.
          <a href="${unsubscribeUrl}" style="color:#6b6b6b;">Darse de baja</a>.
        </p>
      `,
    }),
  };
}
