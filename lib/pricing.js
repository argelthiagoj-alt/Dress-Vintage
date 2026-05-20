// ============================================
// Server-side pricing logic.
// Never trust the client for unit prices, shipping cost, or totals.
// ============================================

// Shipping cost table (mirrors SHIPPING_OPTIONS in the frontend).
// Mutate here to keep server as source of truth.
const SHIPPING_RATES = {
  domicilio: { cost: 5800, freeOver: 150000 },
  sucursal:  { cost: 3400, freeOver: null },
  taller:    { cost: 0,    freeOver: null },
};

// Payment-method discounts (e.g. transferencia gets 10% off subtotal).
const PAYMENT_DISCOUNTS = {
  mercado_pago:  0,
  transferencia: 0.10,
  efectivo:      0.10,
  tarjeta:       0,
};

export function computeShipping(method, subtotal) {
  const r = SHIPPING_RATES[method];
  if (!r) return 0;
  if (r.freeOver && subtotal >= r.freeOver) return 0;
  return r.cost;
}

export function computeDiscount(paymentMethod, subtotal) {
  const rate = PAYMENT_DISCOUNTS[paymentMethod] || 0;
  return Math.round(subtotal * rate);
}

/**
 * Build a validated, server-priced order from a thin client payload.
 *
 * @param {object} args
 * @param {Array<{product_id, size, color, qty}>} args.items
 * @param {string} args.shippingMethod
 * @param {string} args.paymentMethod
 * @param {Map<string, {id, name, price, primary_image}>} args.productsById
 * @returns {{items, subtotal, discount, shippingCost, total}}
 */
export function priceOrder({ items, shippingMethod, paymentMethod, productsById }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('cart_empty');
  }

  const pricedItems = items.map((line, i) => {
    const product = productsById.get(line.product_id);
    if (!product) {
      throw new Error(`unknown_product:${line.product_id}`);
    }
    const qty = parseInt(line.qty, 10);
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      throw new Error(`bad_qty:${line.product_id}`);
    }
    const unitPrice = Number(product.price);
    const subtotal = Math.round(unitPrice * qty);
    return {
      product_id:   product.id,
      product_name: product.name,
      size:         typeof line.size  === 'string' ? line.size  : null,
      color:        typeof line.color === 'string' ? line.color : null,
      qty,
      unit_price:   unitPrice,
      subtotal,
      image:        product.primary_image || null,
    };
  });

  const subtotal     = pricedItems.reduce((s, it) => s + it.subtotal, 0);
  const discount     = computeDiscount(paymentMethod, subtotal);
  const shippingCost = computeShipping(shippingMethod, subtotal - discount);
  const total        = subtotal - discount + shippingCost;

  return {
    items: pricedItems,
    subtotal,
    discount,
    shippingCost,
    total,
  };
}
