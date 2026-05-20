// ============================================
// Input validators for API routes.
// Returns { ok: boolean, value?: any, error?: string }.
// ============================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'email_required' };
  const value = raw.trim().toLowerCase();
  if (!value) return { ok: false, error: 'email_required' };
  if (value.length > 254) return { ok: false, error: 'email_too_long' };
  if (!EMAIL_RE.test(value)) return { ok: false, error: 'email_invalid' };
  return { ok: true, value };
}

export function validateNonEmptyString(raw, max = 200) {
  if (typeof raw !== 'string') return { ok: false, error: 'string_required' };
  const value = raw.trim();
  if (!value) return { ok: false, error: 'string_empty' };
  if (value.length > max) return { ok: false, error: 'string_too_long' };
  return { ok: true, value };
}

export function validatePhone(raw) {
  if (raw == null || raw === '') return { ok: true, value: '' };
  if (typeof raw !== 'string') return { ok: false, error: 'phone_invalid' };
  const value = raw.trim();
  const digits = value.replace(/\D/g, '');
  if (digits.length < 8) return { ok: false, error: 'phone_too_short' };
  if (value.length > 40) return { ok: false, error: 'phone_too_long' };
  return { ok: true, value };
}

const VALID_SHIPPING   = new Set(['domicilio', 'sucursal', 'taller']);
const VALID_PAYMENT    = new Set(['mercado_pago', 'transferencia', 'efectivo', 'tarjeta']);

export function validateShippingMethod(raw) {
  if (!VALID_SHIPPING.has(raw)) return { ok: false, error: 'shipping_method_invalid' };
  return { ok: true, value: raw };
}

export function validatePaymentMethod(raw) {
  if (!VALID_PAYMENT.has(raw)) return { ok: false, error: 'payment_method_invalid' };
  return { ok: true, value: raw };
}

export function validateInt(raw, { min = -Infinity, max = Infinity } = {}) {
  const n = typeof raw === 'number' ? raw : parseInt(raw, 10);
  if (!Number.isFinite(n)) return { ok: false, error: 'int_invalid' };
  if (n < min || n > max) return { ok: false, error: 'int_out_of_range' };
  return { ok: true, value: n };
}

/**
 * Sanitize a string for safe embedding in an SQL LIKE pattern.
 * (Not used directly — Supabase parameterizes queries — but helpful for ad-hoc.)
 */
export function escapeLike(s) {
  return String(s).replace(/[%_\\]/g, c => `\\${c}`);
}
