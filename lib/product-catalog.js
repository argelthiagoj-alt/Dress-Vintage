// ============================================
// Loads product catalog from Supabase for server-side pricing.
// Cached per cold-start to avoid re-querying on every request.
// ============================================

import { supabaseAdmin } from './supabase-admin.js';

let _cache = null;
let _cacheAt = 0;
const TTL_MS = 60 * 1000; // 1 minute — fine since admin edits are rare

/**
 * Returns a Map<product_id, { id, name, price, primary_image }>.
 */
export async function loadProductsById() {
  const now = Date.now();
  if (_cache && (now - _cacheAt) < TTL_MS) return _cache;

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('products')
    .select('id, name, price, primary_image, active')
    .eq('active', true);

  if (error) throw new Error(`product_catalog_load_failed: ${error.message}`);

  const map = new Map();
  for (const row of data || []) {
    map.set(row.id, row);
  }
  _cache = map;
  _cacheAt = now;
  return map;
}

/** For tests / explicit cache busts. */
export function clearCatalogCache() {
  _cache = null;
  _cacheAt = 0;
}
