# ENV_VARS — referencia rápida

Ver `.env.example` para la lista completa con descripciones.

## Cliente (browser)

Las que empiezan con `NEXT_PUBLIC_` se incluyen en el bundle público.
**No metas secretos acá.**

| Variable                          | Para qué                                        |
|-----------------------------------|-------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`        | URL del proyecto. Necesaria si activás Auth real|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Anon key (RLS la protege). Ídem.                |
| `NEXT_PUBLIC_SITE_URL`            | Base URL — usada en links de emails             |

## Server (solo serverless functions)

**Estas nunca deben aparecer en el bundle público.**

| Variable                          | Para qué                                          |
|-----------------------------------|---------------------------------------------------|
| `SUPABASE_SERVICE_ROLE_KEY`       | Service role — bypassea RLS. Escribir órdenes, suscriptores |
| `RESEND_API_KEY`                  | Enviar emails transaccionales                     |
| `RESEND_FROM_EMAIL`               | Dirección "From". Debe ser del dominio verificado |
| `RESEND_FROM_NAME`                | Nombre mostrado en el From                        |
| `ADMIN_ORDERS_EMAIL`              | Destinatario de notificación de pedido nuevo       |
| `REPLY_TO_EMAIL`                  | Reply-To en los emails al cliente                 |
| `ADMIN_API_SECRET`                | Bearer token para `/api/orders/update-status`      |
| `BANK_ACCOUNT_HOLDER` etc.        | Datos bancarios mostrados en mail de transferencia |
| `WHATSAPP_CONTACT`                | Número en E.164 para link wa.me                   |
| `INSTAGRAM_URL`                   | Link a perfil de Instagram                        |

## Cómo generar `ADMIN_API_SECRET`

```bash
openssl rand -base64 32
# o
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Pegá el resultado en `.env.local` y en Vercel → Environment Variables.
