// ============================================
// DRESSVINTAGE — data model
// ============================================
// Canonical schema (per product):
//   id            string         unique identifier
//   slug          string         url-friendly handle
//   name          string         display name
//   type          string         pantalon|hoodie|campera|sweater|remera|accesorio
//   category      string         plural slug, matches CATEGORIES.id  (derived from type if absent)
//   code          string?        internal SKU
//   price         number         current price
//   originalPrice number?        original price (if present and > price → on_sale)
//   tags          string[]       manual tags, e.g. ["new"]
//   colorIds      string[]       color ids referenced in COLOR_PALETTE
//   variants      Variant[]      [{ colorId, size, stock }]  ← per (color × size) stock
//   images        string[]       image urls (first is primary)
//   shortDescription string
//   description   string?
//   composition   string?
//   care          string?
//   measures      Record<size,string>?
//   notes         string?        internal admin notes (not rendered)
//
// On load, normalizeProduct() decorates each raw product with legacy fields
// (cat, was, isSale, isNew, oos, lowStock, sizes aggregated, img, desc) so
// existing UI keeps working without changes.

// ============================================
// CATEGORIES (display + navigation slugs)
// ============================================
const CATEGORIES = [
  { id: "remeras",    name: "Remeras",    label: "T-SHIRTS",    img: R("catRemeras",    "assets/cat-remeras.png")    },
  { id: "hoodies",    name: "Hoodies",    label: "HOODIES",     img: R("catHoodies",    "assets/cat-hoodies.png"),    objectPosition: "70% 30%" },
  { id: "sweaters",   name: "Sweaters",   label: "KNITS",       img: R("catSweaters",   "assets/cat-sweaters.png"),   objectPosition: "75% 30%" },
  { id: "camperas",   name: "Camperas",   label: "JACKETS",     img: R("catCamperas",   "assets/cat-camperas.png"),   objectPosition: "55% 35%" },
  { id: "pantalones", name: "Pantalones", label: "BOTTOMS",     img: R("catPantalones", "assets/cat-pantalones.png"), objectPosition: "55% 50%" },
  { id: "accesorios", name: "Accesorios", label: "ACCESSORIES", img: R("catAccesorios", "assets/cat-accesorios.png"), objectPosition: "50% 40%" },
];

// ============================================
// PRODUCT TYPES (admin-facing canonical types)
// Each type maps to a display category + supported size set.
// ============================================
const PRODUCT_TYPES = {
  pantalon:  { label: "Pantalón",  category: "pantalones", sizes: ["36","38","40","42","44","46","48"] },
  hoodie:    { label: "Hoodie",    category: "hoodies",    sizes: ["S","M","L","XL","XXL","Único"]    },
  campera:   { label: "Campera",   category: "camperas",   sizes: ["S","M","L","XL","XXL","Único"]    },
  sweater:   { label: "Sweater",   category: "sweaters",   sizes: ["S","M","L","XL","XXL","Único"]    },
  remera:    { label: "Remera",    category: "remeras",    sizes: ["S","M","L","XL","XXL","Único"]    },
  accesorio: { label: "Accesorio", category: "accesorios", sizes: ["Único"]                            },
};

// ============================================
// COLOR PALETTE
// Expanded vocabulary for the admin model. UI filters only render colors in use.
// ============================================
const COLOR_PALETTE = [
  { id: "negro",      name: "Negro",      hex: "#0a0a0a" },
  { id: "blanco",     name: "Blanco",     hex: "#f4f4ef" },
  { id: "gris",       name: "Gris",       hex: "#6e6e6e" },
  { id: "azul",       name: "Azul",       hex: "#1d3a8a" },
  { id: "celeste",    name: "Celeste",    hex: "#7fb6e8" },
  { id: "marron",     name: "Marrón",     hex: "#5b3a2a" },
  { id: "beige",      name: "Beige",      hex: "#cdb89c" },
  { id: "crema",      name: "Crema",      hex: "#e8dfcc" },
  { id: "verde",      name: "Verde",      hex: "#3a6b3f" },
  { id: "rojo",       name: "Rojo",       hex: "#c43b2a" },
  { id: "bordo",      name: "Bordó",      hex: "#5b1a22" },
  { id: "rosa",       name: "Rosa",       hex: "#e6a3ad" },
  { id: "violeta",    name: "Violeta",    hex: "#6b3a8a" },
  { id: "amarillo",   name: "Amarillo",   hex: "#e8c33b" },
  { id: "naranja",    name: "Naranja",    hex: "#e87a3b" },
  { id: "camo",       name: "Camo",       hex: "#8b8264" },
  { id: "denim",      name: "Denim",      hex: "#2c4a6b" },
  { id: "multicolor", name: "Multicolor", hex: "linear-gradient(135deg, #e8412a, #e8c33b, #3a6b3f, #1d3a8a)" },
  { id: "otro",       name: "Otro",       hex: "#8a8a86" },
];

// Back-compat alias — old UI imports `COLORS`
const COLORS = COLOR_PALETTE;

// Catalog filter chips (kept restricted to common apparel sizes; numeric pants are filtered by other criteria)
const SIZES = ["S", "M", "L", "XL", "XXL"];

// ============================================
// VARIANT BUILDER
// Helper to build a flat list of { colorId, size, stock } variants from a per-color stock map.
//
// mkVariants({
//   negro: { S: 3, M: 6, L: 2 },
//   gris:  { S: 1, M: 4, L: 0 },
// })
// ============================================
function mkVariants(perColorPerSize) {
  const variants = [];
  Object.entries(perColorPerSize).forEach(([colorId, perSize]) => {
    Object.entries(perSize).forEach(([size, stock]) => {
      variants.push({ colorId, size, stock });
    });
  });
  return variants;
}

// ============================================
// SEED PRODUCTS (canonical, what an admin would author)
// On boot, merged with localStorage overlay (Store.loadProducts).
// ============================================
const SEED_PRODUCTS = [
  {
    id: "dv-001",
    slug: "hoodie-estelar",
    name: "Hoodie Estelar",
    type: "hoodie",
    code: "DV/HO·001",
    price: 55000,
    originalPrice: null,
    tags: ["new"],
    colorIds: ["negro", "gris"],
    variants: mkVariants({
      negro: { S: 3, M: 6, L: 2 },
      gris:  { S: 1, M: 4, L: 0 },
    }),
    images: [R("prodHoodieEstelar", "assets/prod-hoodie-estelar.jpeg")],
    imagesByColor: {
      negro: R("prodHoodieEstelar", "assets/prod-hoodie-estelar.jpeg"),
      // gris uses primary image by default until admin uploads a gris-specific photo
    },
    shortDescription: "Buzo de algodón frizado, corte boxy fit.",
    description: "Buzo de algodón frizado, estampados en serigrafía y corte boxy fit. Capucha amplia, terminaciones a doble pespunte. Tirada corta.",
    composition: "100% algodón frizado · 380 g/m². Origen Argentina.",
    care: "Lavar en frío, ciclo suave. Secar a la sombra. No usar lavandina.",
  },
  {
    id: "dv-002",
    slug: "last-jean-hoodie-zip",
    name: "Last Jean Hoodie Zip",
    type: "campera",
    code: "DV/CA·002",
    price: 65000,
    originalPrice: null,
    tags: ["new"],
    colorIds: ["denim"],
    variants: mkVariants({
      denim: { S: 2, M: 4, L: 5, XL: 3 },
    }),
    images: [R("prodCamperaLastjean", "assets/prod-campera-lastjean.jpeg")],
    shortDescription: "Hoodie zip de denim lavado con capucha amplia.",
    description: "Hoodie zip confeccionado en denim con un leve lavado, capucha súper amplia y detalles bordados. Cierre metálico.",
    composition: "100% denim · 14 oz. Lavado en frío. Origen Argentina.",
    care: "Lavar del revés en frío. Secado a la sombra. Planchar a baja temperatura.",
    measures: { S: "66×60", M: "68×62", L: "70×64", XL: "72×66" },
  },
  {
    id: "dv-003",
    slug: "remera-square-black",
    name: "Remera Square Black",
    type: "remera",
    code: "DV/RE·003",
    price: 38000,
    originalPrice: null,
    tags: ["new"],
    colorIds: ["crema", "negro", "gris"],
    variants: mkVariants({
      crema: { S: 2, M: 3, L: 1 },
      negro: { S: 6, M: 8, L: 4 },
      gris:  { S: 0, M: 1, L: 2 },
    }),
    images: [R("prodRemeraSquare", "assets/prod-remera-square.jpeg")],
    shortDescription: "Remera oversize jersey 24/7 con estampado serigrafía alta densidad.",
    description: "Remera oversize confeccionada en jersey 24/7, 100% algodón. Estampado en serigrafía de alta densidad, hombros caídos, cuello redondo reforzado.",
    composition: "100% algodón jersey 24/7. Origen Argentina.",
    care: "Lavar del revés en frío, ciclo suave. No usar secadora.",
    measures: { S: "69×67", M: "71×69", L: "73×71" },
  },
  {
    id: "dv-004",
    slug: "super-baggy-oxid",
    name: "Súper Baggy Oxid",
    type: "pantalon",
    code: "DV/PA·004",
    price: 60000,
    originalPrice: null,
    tags: [],
    colorIds: ["negro"],
    variants: mkVariants({
      negro: { "38": 3, "40": 5, "42": 6, "44": 2 },
    }),
    images: [R("prodBaggyOxid", "assets/prod-baggy-oxid.jpeg")],
    shortDescription: "Super baggy de denim rígido, lavado oxid, corte open leg.",
    description: "Super Baggy Jean confeccionado en denim de tela rígida, lavado oxid. Tiro medio, caída amplia y corte open leg.",
    composition: "100% denim rígido. Origen Argentina.",
    care: "Lavar del revés en frío. Secado al aire.",
  },
  {
    id: "dv-005",
    slug: "sueter-brand",
    name: "Suéter Brand",
    type: "sweater",
    code: "DV/SW·005",
    price: 55000,
    originalPrice: null,
    tags: ["new"],
    colorIds: ["negro"],
    variants: mkVariants({
      negro: { "Único": 7 },
    }),
    images: [R("prodSweaterBrand", "assets/prod-sweater-brand.jpeg")],
    shortDescription: "Suéter boxy fit de lana con escote V y logo intarsia.",
    description: "Suéter corte boxy fit confeccionado en lana, escote en V y detalle de franjas en cuello y puños. Logotipo intarsia en frente.",
    composition: "70% lana · 30% acrílico.",
    care: "Lavar a mano en agua fría. Secar en plano. No usar secadora ni lavandina.",
    measures: { "Único": "64×65" },
  },
  {
    id: "dv-006",
    slug: "pin-sueter",
    name: "Pin Suéter",
    type: "sweater",
    code: "DV/SW·006",
    price: 55000,
    originalPrice: null,
    tags: [],
    colorIds: ["crema"],
    variants: mkVariants({
      crema: { "Único": 0 },
    }),
    images: [R("prodSweaterPin", "assets/prod-sweater-pin.jpeg")],
    shortDescription: "Suéter regular fit jacquard, algodón + poliéster.",
    description: "Suéter regular fit, diseño exclusivo en jacquard, confeccionado con tela de algodón y poliéster.",
    composition: "60% algodón · 40% poliéster.",
    care: "Lavar a mano en agua fría. Secar en plano.",
  },
  {
    id: "dv-007",
    slug: "denim-hoja-seca",
    name: "Denim Hoja Seca",
    type: "pantalon",
    code: "DV/PA·007",
    price: 60000,
    originalPrice: null,
    tags: [],
    colorIds: ["camo"],
    variants: mkVariants({
      camo: { "38": 0, "40": 0, "42": 0, "44": 0 },
    }),
    images: [R("prodHojaseca", "assets/prod-hojaseca.jpeg")],
    shortDescription: "Baggy denim rígido con estampado tree-camo all-over.",
    description: "Jean Baggy tiro medio confeccionado en denim rígido con estampado camo all-over. Bolsillos amplios y muy buena caída.",
    composition: "100% algodón. Estampado tree-camo.",
    care: "Lavar del revés en frío.",
  },
  {
    id: "dv-008",
    slug: "gorros-variedad",
    name: "Gorros · Variedad",
    type: "accesorio",
    code: "DV/AC·008",
    price: 26000,
    originalPrice: null,
    tags: [],
    colorIds: ["negro", "crema", "gris"],
    variants: mkVariants({
      negro: { "Único": 12 },
      crema: { "Único": 8 },
      gris:  { "Único": 0 },
    }),
    images: [R("prodGorros", "assets/prod-gorros.jpeg")],
    shortDescription: "Gorros jacquard talle único, variedad de gráficos.",
    description: "Gorros de jacquard, talle único. Variedad de gráficos y colores: cross, BRZ, star, tribal blanco y tribal grafito.",
    composition: "Mezcla acrílico · viscosa.",
  },
];

// ============================================
// NORMALIZER
// Decorates raw product with derived + legacy fields for UI compatibility.
// ============================================
function normalizeProduct(raw) {
  const typeConfig = PRODUCT_TYPES[raw.type] || {};
  const category = raw.category || typeConfig.category || raw.type;

  const colorIds = raw.colorIds || (raw.colors || []).map(c => c.id);
  const colors = colorIds
    .map(cid => COLOR_PALETTE.find(c => c.id === cid))
    .filter(Boolean);

  // Aggregate sizes for legacy UI: sum stock across colors per size
  const sizesMap = {};
  (raw.variants || []).forEach(v => {
    sizesMap[v.size] = (sizesMap[v.size] || 0) + v.stock;
  });
  const canonicalOrder = typeConfig.sizes || [];
  const sizes = Object.entries(sizesMap)
    .map(([s, stock]) => ({ s, stock }))
    .sort((a, b) => {
      const ia = canonicalOrder.indexOf(a.s);
      const ib = canonicalOrder.indexOf(b.s);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });

  const totalStock = (raw.variants || []).reduce((s, v) => s + v.stock, 0);
  const isOOS = (raw.variants || []).length > 0 && totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isOnSale = raw.originalPrice != null && raw.originalPrice > raw.price;
  const isNewTag = (raw.tags || []).includes("new");
  const discountPercent = isOnSale
    ? Math.round((1 - raw.price / raw.originalPrice) * 100)
    : 0;

  return {
    // ---- canonical / new fields ----
    ...raw,
    category,
    colors,
    totalStock,
    discountPercent,

    // ---- legacy back-compat fields (do not use in new code) ----
    cat: category,
    was: raw.originalPrice,
    isNew: isNewTag,
    isSale: isOnSale,
    oos: isOOS,
    lowStock: isLowStock,
    colorIds,
    sizes,
    img: (raw.images && raw.images[0]) || null,
    desc: raw.description || raw.shortDescription || "",
  };
}

// Initial load — merges seed with localStorage overlay (admin edits)
let PRODUCTS = []; // populated below after Store is defined

// ============================================
// HELPERS
// Single source of truth for stock + sale queries.
// ============================================
const ProductHelpers = {
  isNew: (p) => Array.isArray(p.tags) && p.tags.includes("new"),

  isOnSale: (p) =>
    p.originalPrice != null && p.originalPrice > p.price,

  discountPercent: (p) =>
    ProductHelpers.isOnSale(p)
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : 0,

  stockOf: (p, colorId, size) => {
    const v = (p.variants || []).find(x => x.colorId === colorId && x.size === size);
    return v ? v.stock : 0;
  },

  totalStock: (p) =>
    (p.variants || []).reduce((s, v) => s + v.stock, 0),

  isProductOOS: (p) =>
    (p.variants || []).length > 0 &&
    (p.variants || []).every(v => v.stock === 0),

  isColorOOS: (p, colorId) => {
    const colorVariants = (p.variants || []).filter(v => v.colorId === colorId);
    return colorVariants.length > 0 && colorVariants.every(v => v.stock === 0);
  },

  isSizeOOSForColor: (p, colorId, size) =>
    ProductHelpers.stockOf(p, colorId, size) === 0,

  availableSizesForColor: (p, colorId) =>
    (p.variants || [])
      .filter(v => v.colorId === colorId && v.stock > 0)
      .map(v => v.size),

  availableColors: (p) =>
    (p.colors || []).filter(c => !ProductHelpers.isColorOOS(p, c.id)),

  // Returns array of images for a color (or product fallback).
  // Supports both legacy string form (imagesByColor[color] = "url") and array form (= ["url1", "url2"]).
  imagesForColor: (p, colorId) => {
    const byColor = p.imagesByColor && p.imagesByColor[colorId];
    if (Array.isArray(byColor) && byColor.length) return byColor;
    if (typeof byColor === "string" && byColor) return [byColor];
    return (p.images && p.images.length) ? p.images : [];
  },

  imageForColor: (p, colorId) => {
    const arr = ProductHelpers.imagesForColor(p, colorId);
    return arr[0] || null;
  },

  // Alias matching the public docs naming
  isProductOutOfStock: (p) => ProductHelpers.isProductOOS(p),
};

// ============================================
// SEED OUTFITS (curated by staff; reference product ids)
// Schema per outfit: { id, name, desc, items[productId], discount, img, active, order }
// ============================================
const SEED_OUTFITS = [
  {
    id: "out-001",
    name: "Capítulo 01 — Niebla",
    desc: "Capas suaves, paleta crema y negro. Suéter de lana, baggy denim y gorro tejido. Silencio largo.",
    items: ["dv-005", "dv-004", "dv-008"],
    discount: 0.15,
    img: R("outfit01", "assets/outfit-01.png"),
    active: true,
    order: 1,
  },
  {
    id: "out-002",
    name: "Capítulo 02 — Asfalto",
    desc: "Hoodie pesado, denim zip lavado y gorro. Volumen, fricción, ruido contenido.",
    items: ["dv-001", "dv-002", "dv-008"],
    discount: 0.18,
    img: R("outfit02", "assets/outfit-02.png"),
    active: true,
    order: 2,
  },
  {
    id: "out-003",
    name: "Capítulo 03 — Hueco",
    desc: "Crema sobre crema. Remera oversize y suéter de gráfica. Editorial, transparente, casi monocromo.",
    items: ["dv-003", "dv-006", "dv-008"],
    discount: 0.12,
    img: R("outfit03", "assets/outfit-03.png"),
    active: true,
    order: 3,
  },
];
let OUTFITS = []; // populated below after Store is defined

// ============================================
// STORE — localStorage overlay for admin edits
// Reads return seed merged with stored overrides.
// Writes persist diffs (and _deleted markers for removed seed items).
// This shape is the migration boundary: replace with fetch('/api/...') later.
// ============================================
const Store = {
  // ---- PRODUCTS ----
  _PRODUCTS_KEY: "dv-products-overlay",
  loadProductsRaw() {
    const overlay = JSON.parse(localStorage.getItem(Store._PRODUCTS_KEY) || "{}");
    const out = [];
    const seenIds = new Set();
    SEED_PRODUCTS.forEach(p => {
      const ov = overlay[p.id];
      seenIds.add(p.id);
      if (ov && ov._deleted) return;
      out.push(ov || p);
    });
    Object.entries(overlay).forEach(([id, p]) => {
      if (seenIds.has(id)) return;
      if (p && !p._deleted) out.push(p);
    });
    return out;
  },
  saveProducts(rawList) {
    const overlay = {};
    const seedIds = new Set(SEED_PRODUCTS.map(p => p.id));
    const listIds = new Set(rawList.map(p => p.id));
    // Seed items missing from list → mark deleted
    SEED_PRODUCTS.forEach(s => {
      if (!listIds.has(s.id)) overlay[s.id] = { _deleted: true, id: s.id };
    });
    // Items in list → store override unless identical to seed
    rawList.forEach(p => {
      const clean = Store._stripDerived(p);
      const seed = SEED_PRODUCTS.find(s => s.id === p.id);
      if (!seed || JSON.stringify(seed) !== JSON.stringify(clean)) {
        overlay[p.id] = clean;
      }
    });
    try {
      localStorage.setItem(Store._PRODUCTS_KEY, JSON.stringify(overlay));
    } catch (e) {
      if (e && e.name === "QuotaExceededError") {
        alert(
          "Quota de localStorage excedida.\n\n" +
          "Las imágenes ocupan demasiado espacio. Reducí el tamaño de las imágenes " +
          "o quitá productos viejos. En producción esto va a backend, este límite no aplica."
        );
      }
      throw e;
    }
  },
  resetProducts() {
    localStorage.removeItem(Store._PRODUCTS_KEY);
  },
  _stripDerived(p) {
    // Remove fields added by normalizeProduct so storage only holds raw schema
    const {
      cat, was, isNew, isSale, oos, lowStock, sizes, img, desc,
      colors, totalStock, discountPercent,
      ...raw
    } = p;
    return raw;
  },

  // ---- OUTFITS ----
  _OUTFITS_KEY: "dv-outfits",
  loadOutfits() {
    const stored = JSON.parse(localStorage.getItem(Store._OUTFITS_KEY) || "null");
    if (stored && Array.isArray(stored)) return stored;
    return SEED_OUTFITS.map(o => ({ ...o }));
  },
  saveOutfits(list) {
    localStorage.setItem(Store._OUTFITS_KEY, JSON.stringify(list));
  },
  resetOutfits() {
    localStorage.removeItem(Store._OUTFITS_KEY);
  },

  // ---- LANDING CONFIG ----
  _LANDING_KEY: "dv-landing",
  loadLanding() {
    const stored = JSON.parse(localStorage.getItem(Store._LANDING_KEY) || "null");
    if (stored && typeof stored === "object") {
      return { ...SEED_LANDING, ...stored }; // merge with seed for forward-compat
    }
    return { ...SEED_LANDING };
  },
  saveLanding(cfg) {
    localStorage.setItem(Store._LANDING_KEY, JSON.stringify(cfg));
  },
  resetLanding() {
    localStorage.removeItem(Store._LANDING_KEY);
  },
};

// ============================================
// SEED LANDING (superadmin-controlled landing sections)
// Future: heroProductIds, featuredCategoryId, etc.
// ============================================
const SEED_LANDING = {
  // Manually curated featured products for the home "Nuevo Drop" section.
  // The order here is the display order on the landing.
  newDropProductIds: SEED_PRODUCTS
    .filter(p => (p.tags || []).includes("new"))
    .map(p => p.id),
};

// Bootstrap PRODUCTS + OUTFITS + LANDING_CONFIG from Store (seed merged with localStorage overlay)
PRODUCTS = Store.loadProductsRaw().map(normalizeProduct);
OUTFITS = Store.loadOutfits();
let LANDING_CONFIG = Store.loadLanding();

// ============================================
// FAQ (unchanged)
// ============================================
const FAQ = [
  {
    id: "envios",
    title: "Envíos",
    items: [
      { q: "¿Cuánto tarda mi envío?",
        a: "Procesamos pedidos en 24-48hs hábiles. CABA: 1-3 días hábiles. Interior: 3-7 días hábiles vía Andreani / Correo Argentino." },
      { q: "¿Hacen envíos al exterior?",
        a: "Sí, llegamos a Chile, Uruguay y Paraguay. Una vez confirmado el pago coordinamos por mail el seguimiento internacional." },
      { q: "¿Cuánto cuesta el envío?",
        a: "Envío gratis a partir de $150.000. Para compras menores, el costo se calcula al ingresar tu código postal en el checkout." },
    ],
  },
  {
    id: "cambios",
    title: "Cambios y Devoluciones",
    items: [
      { q: "¿Puedo cambiar el talle?",
        a: "Sí. Tenés 15 días corridos desde la entrega para solicitar cambio. La prenda debe estar sin uso, con etiquetas y empaque original." },
      { q: "¿Cómo inicio el cambio?",
        a: "Escribinos a hola@dressvintage.com con tu número de orden y el talle nuevo. Te coordinamos retiro/envío sin costo dentro de CABA." },
      { q: "¿Aceptan devoluciones?",
        a: "Aceptamos devoluciones por fallas de fábrica dentro de los 30 días. No aceptamos devolución por arrepentimiento; solo cambios." },
    ],
  },
  {
    id: "pagos",
    title: "Pagos y Facturación",
    items: [
      { q: "¿Qué medios de pago aceptan?",
        a: "Mercado Pago (todas las tarjetas, hasta 6 cuotas sin interés en bancos seleccionados), transferencia bancaria (10% off) y efectivo en local." },
      { q: "¿Emiten factura?",
        a: "Sí. Emitimos factura B por defecto. Si necesitás factura A, escribinos antes de finalizar la compra con tu CUIT y razón social." },
    ],
  },
  {
    id: "talles",
    title: "Guía de Talles",
    items: [
      { q: "¿Cómo encuentro mi talle?",
        a: "Todas nuestras fichas técnicas incluyen medidas planas en cm: largo × ancho. Si dudás entre dos talles, te sugerimos el más grande para mantener la silueta oversize." },
      { q: "¿Tienen unisex?",
        a: "Toda nuestra línea es de corte unisex. Las referencias de talle siguen estándar internacional (S–XL para tops, 38–44 para pantalones)." },
    ],
  },
  {
    id: "cuidado",
    title: "Cuidado de las Prendas",
    items: [
      { q: "¿Cómo lavo mis prendas?",
        a: "Lavado a máquina con agua fría, ciclo suave. Secar a la sombra. Planchar del revés a temperatura media. Suéteres: lavar a mano. Estampas: no planchar directamente sobre la gráfica." },
    ],
  },
];

// ============================================
// EXPORTS
// ============================================
Object.assign(window, {
  CATEGORIES,
  PRODUCT_TYPES,
  COLOR_PALETTE,
  COLORS,
  SIZES,
  SEED_PRODUCTS,
  SEED_OUTFITS,
  SEED_LANDING,
  PRODUCTS,
  OUTFITS,
  LANDING_CONFIG,
  FAQ,
  ProductHelpers,
  normalizeProduct,
  mkVariants,
  Store,
});

// Alias for back-compat (old name)
window.RAW_PRODUCTS = SEED_PRODUCTS;

// ============================================
// ORDERS — model, helpers, seed, store
// Schema per order (the migration boundary to a real DB):
//   { id, userId?, customerName, customerEmail, customerPhone, createdAt,
//     status, payment: { method, status },
//     shipping: { method, address, city, postalCode, cost, trackingCode? },
//     items: [{ productId, productName, size, color, qty, unitPrice, subtotal, image }],
//     subtotal, shippingCost, total,
//     history: [{ status, date, note, changedBy? }] }
// ============================================

const ORDER_STATUS = {
  PAYMENT_PENDING:   "pago_pendiente",
  PAYMENT_CONFIRMED: "pago_confirmado",
  PREPARING:         "en_preparacion",
  SHIPPED:           "despachado",
  RECEIVED:          "recibido",
  CANCELLED:         "cancelado",
};

const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PAYMENT_PENDING]:   "Esperando confirmación de pago",
  [ORDER_STATUS.PAYMENT_CONFIRMED]: "Pago confirmado",
  [ORDER_STATUS.PREPARING]:         "Estamos preparando tu pedido",
  [ORDER_STATUS.SHIPPED]:           "Tu pedido fue despachado",
  [ORDER_STATUS.RECEIVED]:          "Pedido recibido",
  [ORDER_STATUS.CANCELLED]:         "Pedido cancelado",
};

const ORDER_STATUS_SHORT = {
  [ORDER_STATUS.PAYMENT_PENDING]:   "Pago pendiente",
  [ORDER_STATUS.PAYMENT_CONFIRMED]: "Pago confirmado",
  [ORDER_STATUS.PREPARING]:         "En preparación",
  [ORDER_STATUS.SHIPPED]:           "Despachado",
  [ORDER_STATUS.RECEIVED]:          "Recibido",
  [ORDER_STATUS.CANCELLED]:         "Cancelado",
};

// Linear progression for the tracker (cancelled is shown separately)
const ORDER_FLOW = [
  ORDER_STATUS.PAYMENT_PENDING,
  ORDER_STATUS.PAYMENT_CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.RECEIVED,
];

// Helpers
function _daysAgoISO(days, hours, minutes) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours != null ? hours : 12, minutes != null ? minutes : 0, 0, 0);
  return d.toISOString();
}
function _addHoursISO(baseISO, hours) {
  const d = new Date(baseISO);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

// Generates unique order id: DV-ORD-YYYYMMDD-NNNN (counter scoped per day)
function generateOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const all = OrdersStore.list();
  const sameDay = all.filter(o => typeof o.id === "string" && o.id.indexOf(`-${ymd}-`) >= 0);
  const n = String(sameDay.length + 1).padStart(4, "0");
  return `DV-ORD-${ymd}-${n}`;
}

// ---- Seed orders (demo data with realistic status distribution) ----
const _ORDER_SEEDS_RAW = [
  { d: 0,  email: "ana.lopez@gmail.com",    name: "Ana López",         phone: "+54 9 11 5234-1820", items: [["dv-001","M","negro",1], ["dv-008","Único","negro",1]], pay: "mercado_pago",  ship: "domicilio", addr: "Av. Corrientes 1234, Piso 4 B", city: "CABA", cp: "C1043" },
  { d: 0,  email: "maxi.b@gmail.com",       name: "Maxi B.",           phone: "+54 9 11 6720-9344", items: [["dv-003","L","negro",1]],                                pay: "mercado_pago",  ship: "domicilio", addr: "Honduras 5400",                  city: "CABA", cp: "C1414" },
  { d: 1,  email: "lautaro.f@hotmail.com",  name: "Lautaro Figueroa",  phone: "+54 9 11 4128-7766", items: [["dv-002","L","denim",1]],                                pay: "transferencia", ship: "sucursal",  addr: "Sucursal Correo Caballito",       city: "CABA", cp: "C1424" },
  { d: 2,  email: "vicky@gmail.com",        name: "Victoria Pereyra",  phone: "+54 9 11 3019-5588", items: [["dv-005","Único","negro",1], ["dv-008","Único","crema",1]], pay: "mercado_pago", ship: "domicilio", addr: "San Martín 220",            city: "CABA", cp: "C1004" },
  { d: 3,  email: "juan.r@outlook.com",     name: "Juan Rodríguez",    phone: "+54 9 11 2244-8902", items: [["dv-004","40","negro",1]],                               pay: "transferencia", ship: "domicilio", addr: "Av. Las Heras 2890",              city: "CABA", cp: "C1425" },
  { d: 4,  email: "sofia.m@gmail.com",      name: "Sofía Martínez",    phone: "+54 9 11 5871-3306", items: [["dv-001","S","negro",1]],                                pay: "mercado_pago",  ship: "domicilio", addr: "Cabildo 3500, 8 C",               city: "CABA", cp: "C1429" },
  { d: 5,  email: "marco.t@gmail.com",      name: "Marco Tassi",       phone: "+54 9 11 6604-1129", items: [["dv-003","M","crema",1], ["dv-001","M","gris",1]],       pay: "mercado_pago",  ship: "domicilio", addr: "Olleros 2400",                     city: "CABA", cp: "C1426" },
  { d: 7,  email: "ana.lopez@gmail.com",    name: "Ana López",         phone: "+54 9 11 5234-1820", items: [["dv-008","Único","negro",2]],                            pay: "mercado_pago",  ship: "domicilio", addr: "Av. Corrientes 1234, Piso 4 B", city: "CABA", cp: "C1043" },
  { d: 9,  email: "tomas.c@gmail.com",      name: "Tomás Castro",      phone: "+54 9 11 3812-4475", items: [["dv-002","XL","denim",1]],                               pay: "mercado_pago",  ship: "domicilio", addr: "Av. Pueyrredón 1500",              city: "CABA", cp: "C1118" },
  { d: 12, email: "carla.n@gmail.com",      name: "Carla Núñez",       phone: "+54 9 11 4490-2237", items: [["dv-005","Único","negro",1]],                            pay: "transferencia", ship: "taller",    addr: "Retira en Av. F. Lacroze 3500",    city: "CABA", cp: "C1427" },
  { d: 15, email: "diego.s@gmail.com",      name: "Diego Sosa",        phone: "+54 9 11 7702-9954", items: [["dv-004","42","negro",1], ["dv-003","L","negro",1]],     pay: "mercado_pago",  ship: "domicilio", addr: "Mitre 540, Adrogué",               city: "BA",   cp: "B1846" },
  { d: 22, email: "florencia@gmail.com",    name: "Florencia Quintero",phone: "+54 9 11 6815-3340", items: [["dv-001","L","negro",1]],                                pay: "mercado_pago",  ship: "domicilio", addr: "Av. Santa Fe 4100",                city: "CABA", cp: "C1425" },
];

// Status by age in days (newest = early stages, oldest = received)
function _statusByAge(d) {
  if (d === 0)  return ORDER_STATUS.PAYMENT_CONFIRMED;
  if (d <= 2)   return ORDER_STATUS.PREPARING;
  if (d <= 7)   return ORDER_STATUS.SHIPPED;
  return ORDER_STATUS.RECEIVED;
}

// Build a plausible history chain ending at `endStatus`
function _buildSeedHistory(createdAt, endStatus, payMethod) {
  const noteFor = (s) => {
    switch (s) {
      case ORDER_STATUS.PAYMENT_PENDING:   return "Pedido creado";
      case ORDER_STATUS.PAYMENT_CONFIRMED: return payMethod === "mercado_pago" ? "Pago confirmado vía Mercado Pago" : "Pago acreditado";
      case ORDER_STATUS.PREPARING:         return "Pedido en preparación en el taller";
      case ORDER_STATUS.SHIPPED:           return "Despachado por Andreani";
      case ORDER_STATUS.RECEIVED:          return "Entregado y recibido por el cliente";
      default: return "";
    }
  };
  const offsetByStatus = {
    [ORDER_STATUS.PAYMENT_PENDING]:   0,
    [ORDER_STATUS.PAYMENT_CONFIRMED]: 2,
    [ORDER_STATUS.PREPARING]:         8,
    [ORDER_STATUS.SHIPPED]:           36,
    [ORDER_STATUS.RECEIVED]:          84,
  };
  const out = [];
  for (const s of ORDER_FLOW) {
    out.push({ status: s, date: _addHoursISO(createdAt, offsetByStatus[s]), note: noteFor(s) });
    if (s === endStatus) break;
  }
  return out;
}

const SEED_ORDERS = _ORDER_SEEDS_RAW.map((b, i) => {
  const items = b.items.map(([pid, size, color, qty]) => {
    const p = SEED_PRODUCTS.find(x => x.id === pid);
    const unitPrice = p ? p.price : 0;
    return {
      productId: pid,
      productName: p ? p.name : pid,
      size, color, qty, unitPrice,
      subtotal: unitPrice * qty,
      image: (p && p.images && p.images[0]) || null,
    };
  });
  const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
  const shippingCost = b.ship === "taller" ? 0 : (subtotal >= 150000 ? 0 : 5800);
  const createdAt = _daysAgoISO(b.d, 10 + (i % 8), (i * 7) % 60);
  const status = _statusByAge(b.d);
  // Build YYYYMMDD from createdAt for the new ID format
  const _ad = new Date(createdAt);
  const ymd = `${_ad.getFullYear()}${String(_ad.getMonth()+1).padStart(2,"0")}${String(_ad.getDate()).padStart(2,"0")}`;
  return {
    id: `DV-ORD-${ymd}-${String(i + 1).padStart(4, "0")}`,
    userId: null, // guest seed orders
    customerName:  b.name,
    customerEmail: b.email,
    customerPhone: b.phone || "",
    createdAt,
    status,
    payment: {
      method: b.pay,
      status: status === ORDER_STATUS.PAYMENT_PENDING ? "pendiente" : "confirmado",
    },
    shipping: {
      method: b.ship,
      address: b.addr,
      city: b.city,
      postalCode: b.cp,
      cost: shippingCost,
      trackingCode: (status === ORDER_STATUS.SHIPPED || status === ORDER_STATUS.RECEIVED)
        ? `AR${1000000 + i * 7}EX`
        : null,
    },
    items,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    history: _buildSeedHistory(createdAt, status, b.pay),
  };
});

const OrdersStore = {
  _KEY: "dv-orders",

  // ---- low-level CRUD ----
  list() {
    const stored = JSON.parse(localStorage.getItem(OrdersStore._KEY) || "null");
    if (Array.isArray(stored)) {
      // Forward-migrate legacy seed orders that lack a history/status mapping
      return stored.map(_migrateOrderShape);
    }
    return SEED_ORDERS.map(o => ({ ...o }));
  },
  save(orders) {
    localStorage.setItem(OrdersStore._KEY, JSON.stringify(orders));
  },
  add(order) {
    const list = OrdersStore.list();
    list.unshift(order); // newest first
    OrdersStore.save(list);
    return order;
  },
  reset() {
    localStorage.removeItem(OrdersStore._KEY);
  },

  // ---- query helpers ----
  get(id) {
    return OrdersStore.list().find(o => o.id === id) || null;
  },
  listByUser(userId) {
    if (!userId) return [];
    return OrdersStore.list().filter(o => o.userId === userId);
  },
  listByEmail(email) {
    if (!email) return [];
    const e = String(email).toLowerCase();
    return OrdersStore.list().filter(o =>
      String(o.customerEmail || o.email || "").toLowerCase() === e
    );
  },

  // ---- mutations ----
  createOrder(payload) {
    const { user, customer = {}, payment = {}, shipping = {}, items = [], subtotal = 0, shippingCost = 0, total = 0 } = payload;
    const id = generateOrderId();
    const createdAt = new Date().toISOString();

    // Initial status by payment method (demo rule)
    let initStatus = ORDER_STATUS.PAYMENT_PENDING;
    let paymentStatus = "pendiente";
    if (payment.method === "mercado_pago" || payment.method === "tarjeta") {
      initStatus = ORDER_STATUS.PAYMENT_CONFIRMED;
      paymentStatus = "confirmado";
    }

    const history = [{
      status: ORDER_STATUS.PAYMENT_PENDING,
      date: createdAt,
      note: "Pedido creado",
    }];
    if (initStatus !== ORDER_STATUS.PAYMENT_PENDING) {
      history.push({
        status: initStatus,
        date: createdAt,
        note: payment.method === "mercado_pago" ? "Pago confirmado vía Mercado Pago" : "Pago confirmado",
      });
    }

    const order = {
      id,
      userId: user ? user.id : null,
      customerName:  customer.name  || (user ? user.name  : "Invitado"),
      customerEmail: customer.email || (user ? user.email : ""),
      customerPhone: customer.phone || "",
      createdAt,
      status: initStatus,
      payment: { method: payment.method || "mercado_pago", status: paymentStatus },
      shipping: {
        method: shipping.method || "domicilio",
        address: customer.address || "",
        city: customer.city || "",
        postalCode: customer.postalCode || "",
        cost: shippingCost,
        trackingCode: null,
      },
      items: items.map(it => ({
        productId:   it.productId,
        productName: it.productName,
        size:        it.size,
        color:       it.color,
        qty:         it.qty,
        unitPrice:   it.unitPrice,
        subtotal:    it.subtotal != null ? it.subtotal : (it.unitPrice * it.qty),
        image:       it.image || null,
      })),
      subtotal,
      shippingCost,
      total,
      history,
    };

    return OrdersStore.add(order);
  },

  updateStatus(orderId, newStatus, opts) {
    opts = opts || {};
    const list = OrdersStore.list();
    const i = list.findIndex(o => o.id === orderId);
    if (i < 0) return null;
    const updated = {
      ...list[i],
      status: newStatus,
      // Keep payment.status consistent when status changes
      payment: list[i].payment ? {
        ...list[i].payment,
        status: (newStatus === ORDER_STATUS.PAYMENT_PENDING) ? "pendiente"
              : (newStatus === ORDER_STATUS.CANCELLED) ? (list[i].payment.status || "cancelado")
              : "confirmado",
      } : list[i].payment,
      history: [
        ...(list[i].history || []),
        {
          status: newStatus,
          date: new Date().toISOString(),
          note: opts.note || "",
          changedBy: opts.changedBy || null,
        },
      ],
    };
    list[i] = updated;
    OrdersStore.save(list);
    return updated;
  },

  setTracking(orderId, trackingCode, changedBy) {
    const list = OrdersStore.list();
    const i = list.findIndex(o => o.id === orderId);
    if (i < 0) return null;
    list[i] = {
      ...list[i],
      shipping: { ...(list[i].shipping || {}), trackingCode: trackingCode || null },
      history: [
        ...(list[i].history || []),
        {
          status: list[i].status,
          date: new Date().toISOString(),
          note: trackingCode ? `Código de seguimiento actualizado: ${trackingCode}` : "Código de seguimiento eliminado",
          changedBy: changedBy || null,
        },
      ],
    };
    OrdersStore.save(list);
    return list[i];
  },

  // ---- aggregates ----
  totals() {
    const all = OrdersStore.list();
    const totalRevenue = all.reduce((s, o) => s + (o.total || 0), 0);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayOrders = all.filter(o => new Date(o.createdAt) >= startOfToday);
    const startOf30d = new Date();
    startOf30d.setDate(startOf30d.getDate() - 30);
    const recent = all.filter(o => new Date(o.createdAt) >= startOf30d);
    return {
      count: all.length,
      revenue: totalRevenue,
      todayCount: todayOrders.length,
      todayRevenue: todayOrders.reduce((s, o) => s + (o.total || 0), 0),
      last30Count: recent.length,
      last30Revenue: recent.reduce((s, o) => s + (o.total || 0), 0),
    };
  },
};

// Migrates an old-schema order (e.g. status:"completed", no history) into the new shape
function _migrateOrderShape(o) {
  if (!o || typeof o !== "object") return o;
  const isNew = ORDER_FLOW.includes(o.status) || o.status === ORDER_STATUS.CANCELLED;
  if (isNew && Array.isArray(o.history)) return o; // already up to date

  // Map legacy "completed" to RECEIVED, else PAYMENT_CONFIRMED
  const status = (o.status === "completed" || o.status === "complete")
    ? ORDER_STATUS.RECEIVED
    : (ORDER_FLOW.includes(o.status) ? o.status : ORDER_STATUS.PAYMENT_CONFIRMED);

  const customerEmail = o.customerEmail || o.email || "";
  const shippingCost = o.shippingCost != null ? o.shippingCost : (o.shipping || 0);
  const subtotal = o.subtotal || 0;
  const total = o.total != null ? o.total : (subtotal + shippingCost);

  return {
    id: o.id,
    userId: o.userId || null,
    customerName:  o.customerName  || "Invitado",
    customerEmail,
    customerPhone: o.customerPhone || "",
    createdAt: o.createdAt || new Date().toISOString(),
    status,
    payment: o.payment || { method: "mercado_pago", status: "confirmado" },
    shipping: typeof o.shipping === "object" && o.shipping !== null
      ? o.shipping
      : { method: "domicilio", address: "", city: "", postalCode: "", cost: shippingCost, trackingCode: null },
    items: (o.items || []).map(it => ({
      productId:   it.productId,
      productName: it.productName || it.name,
      size: it.size, color: it.color, qty: it.qty,
      unitPrice:   it.unitPrice,
      subtotal:    it.subtotal != null ? it.subtotal : (it.unitPrice * it.qty),
      image:       it.image || null,
    })),
    subtotal,
    shippingCost,
    total,
    history: o.history || [
      { status: ORDER_STATUS.PAYMENT_PENDING, date: o.createdAt || new Date().toISOString(), note: "Pedido creado" },
      { status,                                date: o.createdAt || new Date().toISOString(), note: "Estado migrado del modelo anterior" },
    ],
  };
}

window.ORDER_STATUS        = ORDER_STATUS;
window.ORDER_STATUS_LABELS = ORDER_STATUS_LABELS;
window.ORDER_STATUS_SHORT  = ORDER_STATUS_SHORT;
window.ORDER_FLOW          = ORDER_FLOW;
window.OrdersStore         = OrdersStore;
window.SEED_ORDERS         = SEED_ORDERS;
window.generateOrderId     = generateOrderId;
