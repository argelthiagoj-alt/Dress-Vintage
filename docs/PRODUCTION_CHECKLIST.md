# PRODUCTION_CHECKLIST

Antes de apuntar el dominio productivo a este deploy:

## DNS / Email
- [ ] Dominio verificado en Resend (`Domains → Verified`).
- [ ] SPF, DKIM y DMARC publicados y propagados (`dig TXT dressvintage.com.ar`).
- [ ] Test de spam score: enviar a [mail-tester.com](https://mail-tester.com) → 9/10 o más.
- [ ] `RESEND_FROM_EMAIL` apunta al dominio verificado (no a `resend.dev`).
- [ ] `REPLY_TO_EMAIL=contacto@dressvintage.com.ar` configurado y la casilla existe.

## Supabase
- [ ] Migraciones `001-004` aplicadas en el proyecto **production** (no solo dev).
- [ ] `005_seed_demo.sql` **NO** aplicado en producción (ya tenés tu catálogo real).
- [ ] RLS habilitado en `orders`, `order_items`, `order_status_history`, `newsletter_subscribers`.
- [ ] Service role key rotada si la viste alguien que no debía.
- [ ] SMTP custom configurado para que Auth use Resend con tu dominio.
- [ ] Site URL y Redirect URLs incluyen el dominio production con HTTPS.

## Vercel
- [ ] Variables de entorno en **Production** scope (no solo Preview):
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `ADMIN_API_SECRET`
  - `BANK_ACCOUNT_*`
  - `NEXT_PUBLIC_SITE_URL=https://dressvintage.com.ar`
- [ ] `ADMIN_API_SECRET` regenerado y guardado en un password manager (no en git).
- [ ] Dominio custom `dressvintage.com.ar` apuntado al deploy (A/AAAA o CNAME).

## Funcional
- [ ] Suscripción de newsletter desde el footer en prod → email llega → fila en
      Supabase → unsubscribe funciona end-to-end.
- [ ] Compra real (o mock con Mercado Pago sandbox) → orden creada en Supabase →
      email al cliente y al admin → cambio de estado dispara email.
- [ ] Verificá que el frontend **no expone** la service role key
      (`view-source` y buscar el string `service_role`).

## Operativo
- [ ] Dashboard de Resend monitoreado (bounces, complaints).
- [ ] Alertas de tasa de error en Vercel (Project → Analytics / Logs).
- [ ] Backup automático de Supabase habilitado (Plan Pro+).
- [ ] Procedimiento de "rotate ADMIN_API_SECRET" documentado y compartido.

## Legal (Argentina)
- [ ] Texto de consentimiento de newsletter explícito ("acepto recibir...").
- [ ] Link de baja en TODO email enviado.
- [ ] Política de privacidad publicada en el sitio.
- [ ] Botón de arrepentimiento accesible (ya en el footer).

## Migración futura a Supabase Auth
- [ ] Reemplazar `auth.js` (demo) por `lib/supabase-client.js` con `@supabase/supabase-js` en browser.
- [ ] LoginPage usa `supabase.auth.signInWithPassword(...)` y `signUp(...)`.
- [ ] Password reset: `supabase.auth.resetPasswordForEmail(email, { redirectTo: SITE_URL + '/index.html#account:reset' })`.
- [ ] Sustituir el `userId` mandado en `/api/orders/create` por validación
      real de JWT en el servidor (Supabase incluye un helper `auth.getUser(jwt)`).
- [ ] Sustituir `ADMIN_API_SECRET` por verificación de rol vía JWT custom claims.
