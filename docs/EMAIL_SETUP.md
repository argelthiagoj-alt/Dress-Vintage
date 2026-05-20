# EMAIL_SETUP — DNS, Resend, Supabase Auth

Pasos de una sola vez para que los mails salgan desde `no-reply@dressvintage.com.ar`
y los de auth desde `noreply@dressvintage.com.ar` (Supabase).

---

## 1. Resend — verificar el dominio

1. Entrar a [resend.com](https://resend.com) → **Domains** → **Add domain** → `dressvintage.com.ar`.
2. Resend te muestra 3-4 registros DNS para crear en tu proveedor de dominio
   (Hostinger / Cloudflare / Route 53 / etc.). Aproximadamente:

   | Tipo  | Nombre/Host                               | Valor                                                    |
   |-------|-------------------------------------------|----------------------------------------------------------|
   | TXT   | `dressvintage.com.ar`                     | `v=spf1 include:_spf.resend.com ~all`                    |
   | TXT   | `resend._domainkey.dressvintage.com.ar`   | `p=MIGfMA0GCSqGSIb3DQEB...` (el valor exacto que muestra Resend) |
   | CNAME | `email.dressvintage.com.ar`               | `email.resend.com` (para tracking opcional)              |
   | TXT   | `_dmarc.dressvintage.com.ar`              | `v=DMARC1; p=quarantine; rua=mailto:contacto@dressvintage.com.ar` |

3. Aplicar los registros en tu DNS y esperar ~30 min. Resend marca el dominio
   como **Verified** cuando detecta SPF + DKIM.
4. Crear la API key: **API Keys → Create API Key → Full access**.
   Copiarla a `.env.local` como `RESEND_API_KEY=re_...`.

> Mientras el dominio no esté verificado, Resend permite enviar solo desde
> `onboarding@resend.dev` y solo a la dirección de la cuenta. Usá ese
> remitente para testear (`RESEND_FROM_EMAIL=onboarding@resend.dev`).

---

## 2. Supabase — proyecto + auth + SMTP

### 2.1 Crear el proyecto
1. [supabase.com](https://supabase.com) → **New project**. Anotar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

### 2.2 Aplicar migraciones SQL
En **Database → SQL Editor → New query**, ejecutar en orden:

```
db/migrations/001_newsletter.sql
db/migrations/002_orders.sql
db/migrations/003_products.sql
db/migrations/004_rls_policies.sql
db/migrations/005_seed_demo.sql      # solo dev/staging
```

### 2.3 Configurar Auth
**Authentication → URL Configuration**:

- **Site URL**: `https://dressvintage.com.ar`
- **Redirect URLs** (agregar todas):
  - `https://dressvintage.com.ar/index.html`
  - `https://dressvintage.com.ar/index.html#account`
  - `http://localhost:3000/index.html` (dev)
  - `http://localhost:3000/index.html#account` (dev)

**Authentication → Email Templates**: pegar el HTML de los archivos en
`emails/supabase-templates/`:

| Template Supabase            | Archivo a pegar                              |
|------------------------------|----------------------------------------------|
| Confirm signup               | `emails/supabase-templates/verify-email.html`|
| Reset password               | `emails/supabase-templates/reset-password.html`|
| Magic Link                   | `emails/supabase-templates/magic-link.html`  |

> Supabase reemplaza `{{ .ConfirmationURL }}` con la URL real al enviar.

### 2.4 Que Supabase use Resend como SMTP (recomendado)
**Authentication → Settings → SMTP Settings → Enable Custom SMTP**:

| Campo            | Valor                                  |
|------------------|----------------------------------------|
| Host             | `smtp.resend.com`                      |
| Port             | `465` (SSL)                            |
| Username         | `resend`                               |
| Password         | tu `RESEND_API_KEY`                    |
| Sender email     | `noreply@dressvintage.com.ar`          |
| Sender name      | `DressVintage`                         |

Sin esto, los emails de auth salen desde `noreply@mail.app.supabase.io` con
template default y baja deliverability.

---

## 3. Local dev

```bash
npm install
cp .env.example .env.local
# editar .env.local con tus credenciales reales
npx vercel dev
```

`vercel dev` levanta el sitio en `http://localhost:3000` y simula las
serverless functions de `/api/*`. El frontend (HTML/JSX) se sirve estático.

Test rápido:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","consent":true}'
```

---

## 4. Producción (Vercel)

1. `vercel link` desde el repo → crear/atar al proyecto.
2. **Project → Settings → Environment Variables**: copiar todas las del
   `.env.example` (no `.env.local`, solo los nombres). Marcar
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ADMIN_API_SECRET` como
   **Production / Preview / Development** según corresponda — pero **nunca**
   exponerlas como `NEXT_PUBLIC_*`.
3. `vercel --prod` o push a main si tenés auto-deploy.
