// ============================================
// Order number generator: DV-ORD-YYYYMMDD-NNNN.
// NNNN is the rank within the day (4-digit padded).
// ============================================

import { supabaseAdmin } from './supabase-admin.js';

function todayYmd() {
  const d = new Date();
  return (
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
  );
}

/**
 * Atomically pick the next order number for today.
 * Uses count() of today's orders; assumes serialized inserts on a low-volume tier.
 * For high volume, switch to a dedicated `order_counters` table with `update ... returning`.
 */
export async function nextOrderNumber() {
  const ymd = todayYmd();
  const sb = supabaseAdmin();
  const { count, error } = await sb
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', `${new Date().toISOString().slice(0, 10)}T00:00:00Z`);
  if (error) throw new Error(`order_number_count_failed: ${error.message}`);
  const seq = String((count || 0) + 1).padStart(4, '0');
  return `DV-ORD-${ymd}-${seq}`;
}
