# TESTING — pruebas locales

Asegurate de tener `.env.local` con las creds reales (ver `EMAIL_SETUP.md`).

```bash
npm install
npx vercel dev
# abre http://localhost:3000
```

## 1. Newsletter

### Vía UI
1. Abrir el sitio en `http://localhost:3000`.
2. Footer → ingresar email + tocar consent + Sumar.
3. Mensaje verde "✓ Listo" debería aparecer.
4. Revisar Supabase → **Table editor → newsletter_subscribers**: tu email
   está con `status='active'`.
5. Revisar tu casilla: llega `Bienvenido a DressVintage`.

### Vía curl
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email":"vos@gmail.com","consent":true,"source":"curl-test"}'
```

Respuestas esperadas:
- `201 {"ok":true,"isNew":true}` — primera vez
- `200 {"ok":true,"alreadySubscribed":true}` — ya estabas suscripto
- `400 {"error":"email_invalid"}` — email mal formado
- `400 {"error":"consent_required"}` — sin consentimiento

### Unsubscribe
1. En el mail de bienvenida, tocar "Darse de baja".
2. Se abre `/api/newsletter/unsubscribe?token=...` que muestra confirmación.
3. En Supabase, la fila pasa a `status='unsubscribed'`.

## 2. Orden con pago instantáneo (Mercado Pago)

### Vía UI
1. Carrito → agregar productos → Checkout.
2. Completar datos → elegir **Mercado Pago** → Pagar.
3. Te redirige a `order-success:DV-ORD-...`.
4. Supabase → `orders`: una fila con `payment_status='paid'` y `order_status='confirmed'`.
5. Mail al cliente: "Recibimos tu pedido DV-ORD-...".
6. Mail a `ADMIN_ORDERS_EMAIL`: "🔔 Nuevo pedido DV-ORD-...".

### Vía curl
```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H 'Content-Type: application/json' \
  -d @- <<'JSON'
{
  "customer": { "name": "Ana López", "email": "ana@test.com", "phone": "+5491155551234" },
  "shipping": { "method": "domicilio", "address": "Av. Corrientes 1234", "city": "CABA", "postalCode": "C1043" },
  "payment":  { "method": "mercado_pago" },
  "items": [
    { "product_id": "dv-001", "size": "M", "color": "negro", "qty": 1 },
    { "product_id": "dv-008", "size": "Único", "color": "negro", "qty": 1 }
  ]
}
JSON
```

## 3. Orden por transferencia

Mismo flujo, pero elegí **Transferencia bancaria** en checkout. El mail al
cliente debe traer los datos bancarios (`BANK_ACCOUNT_*` del `.env.local`)
y el descuento por transferencia aplicado (10% del subtotal).

`orders.payment_status='pending_payment'` · `order_status='pending'`.

## 4. Cambio de estado por admin

```bash
curl -X POST http://localhost:3000/api/orders/update-status \
  -H "Authorization: Bearer $ADMIN_API_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{
    "order_number": "DV-ORD-20260519-0001",
    "order_status": "shipped",
    "tracking_code": "AR1234567EX",
    "note": "Despachado por Andreani"
  }'
```

Responde `200 {"ok":true,"order":{...}}` y dispara el mail
"Despachado · DV-ORD-..." al cliente. La fila en `order_status_history`
queda registrada.

## 5. Auth (Supabase)

Esta integración no se incluyó en el frontend (sigue usando el demo local).
Para probar Auth real:

1. En el dashboard de Supabase, **Authentication → Users → Add user** con un
   email tuyo.
2. Te llega un mail "Confirmá tu email" (con el HTML que pegaste de
   `emails/supabase-templates/verify-email.html`) o, si activaste SMTP de
   Resend, desde tu dominio.
3. Probá password reset desde la app: requiere wiring del frontend a
   `supabase.auth.resetPasswordForEmail(...)` — ver `docs/PRODUCTION_CHECKLIST.md`.

## Troubleshooting

| Síntoma                            | Causa probable                                        |
|------------------------------------|-------------------------------------------------------|
| 404 en `/api/...`                  | `vercel dev` no está corriendo / package.json malo    |
| 500 con `supabase env vars missing`| Falta `SUPABASE_SERVICE_ROLE_KEY` o `URL`             |
| Mail no llega                      | Dominio no verificado en Resend / FROM no del dominio |
| `error: "consent_required"`        | El frontend no mandó `consent:true`                   |
| `error: "unknown_product:dv-XXX"`  | Falta correr `005_seed_demo.sql`                      |
| `unauthorized` en update-status    | `Authorization: Bearer ...` no matchea `ADMIN_API_SECRET` |
