# AUTH_MIGRATION — del demo localStorage a Supabase Auth

El frontend actual usa `auth.js` con `MOCK_USERS` + `localStorage`. Esta guía
describe cómo cambiarlo por Supabase Auth real **sin romper el demo**.
Se hace en una sola sentada si no hay usuarios reales todavía.

## Paso 1 — Cliente Supabase en browser

Crear `supabase-client.js` (carga directa, sin npm en el HTML):

```html
<script type="module">
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
  window.dvSupabase = createClient(
    'https://YOUR_PROJECT.supabase.co',
    'YOUR_ANON_KEY'
  );
</script>
```

> Pegá los valores reales o leelos de un `<meta>` que inyectes desde el server.
> Si migrás a Next.js, esto va en `lib/supabase-browser.js`.

## Paso 2 — Reemplazar `Auth` en `auth.js`

```js
const Auth = {
  async signUp(email, password) {
    return dvSupabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: SITE_URL + '/index.html#account' },
    });
  },
  async signIn(email, password) {
    return dvSupabase.auth.signInWithPassword({ email, password });
  },
  async signOut() {
    return dvSupabase.auth.signOut();
  },
  async current() {
    const { data: { user } } = await dvSupabase.auth.getUser();
    return user;
  },
  async requestPasswordReset(email) {
    return dvSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: SITE_URL + '/index.html#account:reset',
    });
  },
  async updatePassword(newPassword) {
    return dvSupabase.auth.updateUser({ password: newPassword });
  },
};
```

`UserStore` puede mantenerse para metadata custom (rol, status, datos extra)
pero leyendo de la tabla `profiles` que vos creés referenciando `auth.users(id)`,
no del localStorage.

## Paso 3 — Validar JWT en `/api/orders/create`

Hoy el endpoint acepta `userId` del body (no se valida). Para producción:

```js
// en el handler, antes de pricing
const jwt = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
let userId = null;
if (jwt) {
  const sb = supabaseAdmin();
  const { data: { user }, error } = await sb.auth.getUser(jwt);
  if (!error && user) userId = user.id;
}
// usar userId en lugar de body.userId
```

Desde el browser, mandá el access token:

```js
const { data: { session } } = await dvSupabase.auth.getSession();
fetch('/api/orders/create', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`,
  },
  body: JSON.stringify(payload),
});
```

## Paso 4 — Roles admin / superadmin

Tres opciones:

1. **Custom claims en JWT** (Supabase Auth Hooks o Edge Function):
   agregar `app_metadata.role = 'admin'`. Verificar con `user.app_metadata.role`.
2. **Tabla `profiles`** con columna `role`, leída server-side al hacer
   `auth.getUser(...)`.
3. Para acciones server-side puntuales (`/api/orders/update-status`), seguir usando
   `ADMIN_API_SECRET` como segundo factor — funciona ya y es a prueba de balas.

## Paso 5 — Verificación de email

Si activaste "Confirm email" en Supabase (default), el flujo es:

1. `signUp` → Supabase manda email con `{{ .ConfirmationURL }}`.
2. User toca → Supabase verifica → redirige a tu `redirectTo`.
3. El user ya puede iniciar sesión.

Mensajes en el frontend (toast / notification):
- "Revisá tu email para verificar la cuenta" (post-signUp)
- "Email verificado correctamente" (al volver del redirect con `?type=signup`)
- "Te enviamos un link para recuperar tu contraseña" (post-resetPasswordForEmail)
- "Contraseña actualizada" (post-updateUser)

## Paso 6 — Banear usuarios

Hoy el demo guarda `status: "banned"` en localStorage. Con Supabase Auth real:

```sql
-- en Supabase SQL
update auth.users set banned_until = '2099-12-31' where email = 'usuario@malo.com';
```

O por API:
```js
// server only, service_role
sb.auth.admin.updateUserById(userId, { ban_duration: 'forever' });
```

El front detecta sesión bloqueada porque `getUser()` devuelve error o
`user.banned_until` está en el futuro.
