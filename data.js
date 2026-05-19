// ============================================
// DRESSVINTAGE — sample data (real products)
// ============================================

const CATEGORIES = [
  { id: "remeras",    name: "Remeras",    label: "T-SHIRTS",   img: R("catRemeras",    "assets/cat-remeras.png")    },
  { id: "hoodies",    name: "Hoodies",    label: "HOODIES",    img: R("catHoodies",    "assets/cat-hoodies.png"),    objectPosition: "70% 30%" },
  { id: "sweaters",   name: "Sweaters",   label: "KNITS",      img: R("catSweaters",   "assets/cat-sweaters.png"),   objectPosition: "75% 30%" },
  { id: "camperas",   name: "Camperas",   label: "JACKETS",    img: R("catCamperas",   "assets/cat-camperas.png"),   objectPosition: "55% 35%" },
  { id: "pantalones", name: "Pantalones", label: "BOTTOMS",    img: R("catPantalones", "assets/cat-pantalones.png"), objectPosition: "55% 50%" },
  { id: "accesorios", name: "Accesorios", label: "ACCESSORIES",img: R("catAccesorios", "assets/cat-accesorios.png"), objectPosition: "50% 40%" },
];

// Size sets per silhouette
const SIZES_APPAREL_S_XL = ["S","M","L","XL"];
const SIZES_APPAREL_S_L  = ["S","M","L"];
const SIZES_PANTS        = ["38","40","42","44"];
const SIZES_UNICO        = ["Único"];

// Filter chips (catalog sidebar) — covers tops only; pant sizes shown separately
const SIZES = ["S","M","L","XL"];

const COLORS = [
  { id: "negro",   name: "Negro",   hex: "#0a0a0a" },
  { id: "crema",   name: "Crema",   hex: "#e8dfcc" },
  { id: "blanco",  name: "Blanco",  hex: "#f4f4ef" },
  { id: "gris",    name: "Gris",    hex: "#6e6e6e" },
  { id: "camo",    name: "Camo",    hex: "#8b8264" },
];

// helper — builds sizes array w/ stock per size
function S(list, stockFn) {
  return list.map(s => ({ s, stock: stockFn ? stockFn(s) : 4 + Math.floor(Math.random()*8) }));
}
function p(o) {
  return {
    isNew: false, isSale: false, lowStock: false, oos: false,
    ...o,
  };
}

const PRODUCTS = [
  p({
    id: "dv-001",
    name: "Hoodie Estelar",
    cat: "hoodies",
    code: "DV/HO·001",
    price: 55000,
    was: null,
    isNew: true,
    colorIds: ["negro","gris"],
    sizes: S(SIZES_APPAREL_S_L, s => ({S:3, M:6, L:5})[s] ?? 4),
    desc: "Buzo de algodón frizado, estampados en serigrafía y corte boxy fit. Capucha amplia, terminaciones a doble pespunte. Tirada corta.",
    composition: "100% algodón frizado · 380 g/m². Origen Argentina.",
    img: R("prodHoodieEstelar", "assets/prod-hoodie-estelar.jpeg"),
  }),
  p({
    id: "dv-002",
    name: "Last Jean Hoodie Zip",
    cat: "camperas",
    code: "DV/CA·002",
    price: 65000,
    was: null,
    isNew: true,
    colorIds: ["negro"],
    sizes: S(SIZES_APPAREL_S_XL, s => ({S:2, M:4, L:5, XL:3})[s] ?? 3),
    desc: "Hoodie zip confeccionado en denim con un leve lavado, capucha súper amplia y detalles bordados. Cierre metálico.",
    composition: "100% denim · 14 oz. Lavado en frío. Origen Argentina.",
    img: R("prodCamperaLastjean", "assets/prod-campera-lastjean.jpeg"),
    measures: { S: "66×60", M: "68×62", L: "70×64", XL: "72×66" },
    lowStock: true,
  }),
  p({
    id: "dv-003",
    name: "Remera Square Black",
    cat: "remeras",
    code: "DV/RE·003",
    price: 38000,
    was: null,
    isNew: true,
    colorIds: ["crema","negro","gris"],
    sizes: S(SIZES_APPAREL_S_L, s => ({S:6, M:8, L:4})[s] ?? 5),
    desc: "Remera oversize confeccionada en jersey 24/7, 100% algodón. Estampado en serigrafía de alta densidad, hombros caídos, cuello redondo reforzado.",
    composition: "100% algodón jersey 24/7. Origen Argentina.",
    img: R("prodRemeraSquare", "assets/prod-remera-square.jpeg"),
    measures: { S: "69×67", M: "71×69", L: "73×71" },
  }),
  p({
    id: "dv-004",
    name: "Súper Baggy Oxid",
    cat: "pantalones",
    code: "DV/PA·004",
    price: 60000,
    was: null,
    colorIds: ["negro"],
    sizes: S(SIZES_PANTS, s => ({"38":3, "40":5, "42":6, "44":2})[s] ?? 4),
    desc: "Super Baggy Jean confeccionado en denim de tela rígida, lavado oxid. Tiro medio, caída amplia y corte open leg.",
    composition: "100% denim rígido. Origen Argentina.",
    img: R("prodBaggyOxid", "assets/prod-baggy-oxid.jpeg"),
  }),
  p({
    id: "dv-005",
    name: "Suéter Brand",
    cat: "sweaters",
    code: "DV/SW·005",
    price: 55000,
    was: null,
    isNew: true,
    colorIds: ["negro"],
    sizes: S(SIZES_UNICO, () => 7),
    desc: "Suéter corte boxy fit confeccionado en lana, escote en V y detalle de franjas en cuello y puños. Logotipo intarsia en frente.",
    composition: "70% lana · 30% acrílico. Lavado a mano.",
    img: R("prodSweaterBrand", "assets/prod-sweater-brand.jpeg"),
    measures: { "Único": "64×65" },
  }),
  p({
    id: "dv-006",
    name: "Pin Suéter",
    cat: "sweaters",
    code: "DV/SW·006",
    price: 55000,
    was: null,
    oos: true,
    colorIds: ["crema"],
    sizes: S(SIZES_UNICO, () => 0),
    desc: "Suéter regular fit, diseño exclusivo en jacquard, confeccionado con tela de algodón y poliéster. Calidad de materiales 🔝.",
    composition: "60% algodón · 40% poliéster.",
    img: R("prodSweaterPin", "assets/prod-sweater-pin.jpeg"),
  }),
  p({
    id: "dv-007",
    name: "Denim Hoja Seca",
    cat: "pantalones",
    code: "DV/PA·007",
    price: 60000,
    was: null,
    oos: true,
    colorIds: ["camo"],
    sizes: S(SIZES_PANTS, () => 0),
    desc: "Jean Baggy tiro medio confeccionado en denim rígido con estampado camo all-over. Bolsillos amplios y muy buena caída.",
    composition: "100% algodón. Estampado tree-camo.",
    img: R("prodHojaseca", "assets/prod-hojaseca.jpeg"),
  }),
  p({
    id: "dv-008",
    name: "Gorros · Variedad",
    cat: "accesorios",
    code: "DV/AC·008",
    price: 26000,
    was: null,
    colorIds: ["negro","crema","gris"],
    sizes: S(SIZES_UNICO, () => 12),
    desc: "Gorros de jacquard, talle único. Variedad de gráficos y colores: cross, BRZ, star, tribal blanco y tribal grafito.",
    composition: "Mezcla acrílico · viscosa.",
    img: R("prodGorros", "assets/prod-gorros.jpeg"),
  }),
];

// outfits curated by staff — IDs reference real products above
const OUTFITS = [
  {
    id: "out-001",
    name: "Capítulo 01 — Niebla",
    desc: "Capas suaves, paleta crema y negro. Suéter de lana, baggy denim y gorro tejido. Silencio largo.",
    items: ["dv-005", "dv-004", "dv-008"],
    discount: 0.15,
    img: R("outfit01", "assets/outfit-01.png"),
  },
  {
    id: "out-002",
    name: "Capítulo 02 — Asfalto",
    desc: "Hoodie pesado, denim zip lavado y gorro. Volumen, fricción, ruido contenido.",
    items: ["dv-001", "dv-002", "dv-008"],
    discount: 0.18,
    img: R("outfit02", "assets/outfit-02.png"),
  },
  {
    id: "out-003",
    name: "Capítulo 03 — Hueco",
    desc: "Crema sobre crema. Remera oversize y suéter de gráfica. Editorial, transparente, casi monocromo.",
    items: ["dv-003", "dv-006", "dv-008"],
    discount: 0.12,
    img: R("outfit03", "assets/outfit-03.png"),
  },
];

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

Object.assign(window, { CATEGORIES, PRODUCTS, OUTFITS, SIZES, COLORS, FAQ });
