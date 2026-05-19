// ============================================
// DRESSVINTAGE — shared components
// ============================================

const { useState, useEffect, useRef, useCallback, useMemo } = React;

const fmt = (n) =>
  "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const Ph = ({ label, dark, style, className }) => (
  <div
    className={`ph ${dark ? "dark" : ""} ${className || ""}`}
    data-label={label}
    style={style}
  />
);

/* ===== CURSOR ============================== */

function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      if (!dot.current || !ring.current) return;
      dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      ring.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    const onOver = (e) => {
      const t = e.target;
      const isInter =
        t.closest('button, a, [role="button"], input, select, summary, .cat-card, .product, [data-cursor="hover"]');
      const isText = t.closest('input[type="text"], input[type="email"], input[type="password"], textarea');
      ring.current?.classList.toggle("hover", !!isInter && !isText);
      ring.current?.classList.toggle("text", !!isText);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);
  return (
    <>
      <div className="cursor-ring" ref={ring} />
      <div className="cursor-dot" ref={dot} />
    </>
  );
}

/* ===== MARQUEE ============================ */

function PromoMarquee() {
  const items = [
    "ENVÍO GRATIS DESDE $150.000",
    "10% OFF PAGANDO POR TRANSFERENCIA",
    "NUEVO DROP — CAPÍTULO 03",
    "HASTA 6 CUOTAS SIN INTERÉS",
    "CAMBIOS DENTRO DE 15 DÍAS",
  ];
  const seq = [...items, ...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {seq.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

/* ===== HEADER ============================ */

function Header({ route, go, theme, setTheme, cartCount, openCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: "home",     label: "Inicio" },
    { id: "catalog",  label: "Tienda" },
    { id: "outfits",  label: "Outfits" },
    { id: "about",    label: "Quiénes Somos" },
    { id: "faq",      label: "Ayuda" },
  ];
  const active = route.startsWith("catalog") ? "catalog"
    : route.startsWith("product") ? "catalog"
    : route;

  useEffect(() => { setMenuOpen(false); }, [route]);
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const goAndClose = (r) => { setMenuOpen(false); go(r); };
  const bagSvg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
      <path d="M5 7h14l-1.2 13.5a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 7z" />
      <path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7" />
    </svg>
  );

  return (
    <>
      <header className="header">
        <PromoMarquee />
        <div className="shell">
          <div className="header-row">
            <div className="header-left">
              <button
                className="hamburger"
                aria-label="Abrir menú"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <span /><span /><span />
              </button>
              <nav className="header-nav">
                {navItems.map(it => (
                  <button
                    key={it.id}
                    className={active === it.id ? "active" : ""}
                    onClick={() => go(it.id === "catalog" ? "catalog:all" : it.id)}
                  >
                    {it.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="brand" onClick={() => go("home")}>
              <div className="brand-mark" />
              <div className="brand-word">DressVintage</div>
            </div>
            <div className="header-actions">
              <button className="hide-mobile" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              <button className="hide-mobile" onClick={() => go("login")}>Cuenta</button>
              <button onClick={openCart} aria-label="Abrir bolsa" className="bag-btn">
                {bagSvg}
                {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`nav-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={`nav-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Menú principal"
      >
        <div className="nav-drawer-head">
          <div className="brand" onClick={() => goAndClose("home")}>
            <div className="brand-mark" />
            <div className="brand-word">DressVintage</div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="mono nav-close"
            aria-label="Cerrar menú"
          >
            Cerrar ✕
          </button>
        </div>
        <nav className="nav-drawer-body">
          {navItems.map(it => (
            <button
              key={it.id}
              className={active === it.id ? "active" : ""}
              onClick={() => goAndClose(it.id === "catalog" ? "catalog:all" : it.id)}
            >
              <span>{it.label}</span>
              <span className="arr">→</span>
            </button>
          ))}
        </nav>
        <div className="nav-drawer-foot">
          <button onClick={() => goAndClose("login")}>
            <span>Cuenta</span><span className="arr">→</span>
          </button>
          <button onClick={() => { setMenuOpen(false); openCart(); }}>
            <span className="nav-bag">
              {bagSvg}
              <span>Bolsa</span>
              {cartCount > 0 && <span className="nav-bag-count">({cartCount})</span>}
            </span>
            <span className="arr">→</span>
          </button>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <span>Modo {theme === "dark" ? "claro" : "oscuro"}</span>
            <span className="arr">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

/* ===== FOOTER ============================ */

function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="display">DRESSVINTAGE</div>
        <div className="footer-cols">
          <div>
            <h5>Newsletter</h5>
            <p style={{fontSize: 13, marginBottom: 16, color: "color-mix(in oklab, var(--bg) 70%, transparent)"}}>
              Drops antes que nadie. Sin spam, sin saturación.
            </p>
            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="tu@email.com" />
              <button type="submit">Sumar →</button>
            </form>
          </div>
          <div>
            <h5>Tienda</h5>
            {CATEGORIES.map(c => (
              <a key={c.id} onClick={() => go(`catalog:${c.id}`)}>{c.name}</a>
            ))}
            <a onClick={() => go("catalog:sale")}>On Sale</a>
          </div>
          <div>
            <h5>Ayuda</h5>
            <a onClick={() => go("faq")}>Envíos</a>
            <a onClick={() => go("faq")}>Cambios y devoluciones</a>
            <a onClick={() => go("faq")}>Guía de talles</a>
            <a onClick={() => go("faq")}>Pagos</a>
            <a onClick={() => go("faq")}>Contacto</a>
          </div>
          <div>
            <h5>Marca</h5>
            <a onClick={() => go("about")}>Quiénes somos</a>
            <a onClick={() => go("outfits")}>Outfits curados</a>
            <a>Instagram ↗</a>
            <a>TikTok ↗</a>
            <a>WhatsApp ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 DRESSVINTAGE · BUENOS AIRES</div>
          <div>DEFENSA DEL CONSUMIDOR / BOTÓN DE ARREPENTIMIENTO</div>
        </div>
      </div>
    </footer>
  );
}

/* ===== PRODUCT CARD ========================== */

function ProductCard({ product, go, onQuickAdd, onWish, wished }) {
  const sale = product.isSale;
  const oos = product.oos;
  return (
    <div className={`product ${oos ? "oos" : ""}`} onClick={() => go(`product:${product.id}`)}>
      <div className="product-media">
        <div className="product-badges">
          {product.isNew && !oos && <span className="badge new">NEW</span>}
          {sale && <span className="badge sale">−{Math.round((1 - product.price/product.was)*100)}%</span>}
          {product.lowStock && !oos && <span className="badge low">Últimas unidades</span>}
          {oos && <span className="badge oos">Agotado</span>}
        </div>
        <button
          className={`product-wish ${wished ? "active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
          aria-label="Agregar a wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {product.img
          ? <img src={product.img} alt={product.name} className="prod-img main" loading="lazy" />
          : <Ph label={`${product.cat} · ${product.code}`} className="main" />}
        {!oos && (
          <div className="product-quick" onClick={(e) => e.stopPropagation()}>
            <div className="quick-label">
              <span>Quick add</span>
              <span>{product.code}</span>
            </div>
            <div className="sizes">
              {product.sizes.map(s => (
                <button
                  key={s.s}
                  className={s.stock === 0 ? "oos" : ""}
                  disabled={s.stock === 0}
                  onClick={() => s.stock > 0 && onQuickAdd(product, s.s)}
                >
                  {s.s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="product-meta">
        <div>
          <div className="product-cat">{product.cat}</div>
          <div className="product-name">{product.name}</div>
        </div>
        <div className="product-price">
          {product.was && <span className="strike">{fmt(product.was)}</span>}
          <span className={`now ${sale ? "sale" : ""}`}>{fmt(product.price)}</span>
        </div>
      </div>
    </div>
  );
}

/* ===== ROTATOR LOGO ========================== */

function CircleType({ text = "DRESSVINTAGE" }) {
  const id = "rot-" + Math.random().toString(36).slice(2, 7);
  // r = 38 → circumference = 2π·38 ≈ 238.76, half = 119.38
  // Two identical halves, each forced to occupy exactly 180° of the path,
  // guarantees rotational symmetry regardless of glyph metrics.
  const HALF = 119.38;
  const half = "DRESSVINTAGE  •  ";
  return (
    <svg viewBox="0 0 100 100">
      <defs>
        <path id={id} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
      </defs>
      <text fontFamily="JetBrains Mono, monospace" fontSize="10" fill="currentColor">
        <textPath href={`#${id}`} startOffset="0" textLength={HALF} lengthAdjust="spacingAndGlyphs">{half}</textPath>
      </text>
      <text fontFamily="JetBrains Mono, monospace" fontSize="10" fill="currentColor">
        <textPath href={`#${id}`} startOffset={HALF} textLength={HALF} lengthAdjust="spacingAndGlyphs">{half}</textPath>
      </text>
    </svg>
  );
}

/* ===== CART DRAWER ============================ */

function CartDrawer({ open, onClose, cart, removeItem, updateQty, go, products, products_byId }) {
  const lines = cart.map(c => ({ ...c, p: products_byId[c.id] })).filter(l => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const ship = subtotal >= 150000 ? 0 : 5800;

  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <h4>Tu bolsa <span className="mono" style={{marginLeft: 8, color: "var(--mute)"}}>({lines.length})</span></h4>
          <button onClick={onClose} className="mono">Cerrar ✕</button>
        </div>
        <div className="drawer-body">
          {lines.length === 0 && (
            <div style={{padding: "48px 0", textAlign: "center", color: "var(--mute)"}}>
              <div className="mono" style={{marginBottom: 16}}>Tu bolsa está vacía.</div>
              <button className="btn ghost" onClick={() => { onClose(); go("catalog:all"); }}>
                Explorar tienda <span className="btn-arrow">→</span>
              </button>
            </div>
          )}
          {lines.map((l, i) => (
            <div className="cart-line" key={i}>
              {l.p.img
                ? <img src={l.p.img} alt={l.p.name} className="cart-img" />
                : <Ph label={l.p.cat} />}
              <div className="info">
                <div className="nm">{l.p.name}</div>
                <div className="sub">Talle {l.size} · {l.color}</div>
                <div className="qty">
                  <button onClick={() => updateQty(i, l.qty - 1)}>−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => updateQty(i, l.qty + 1)}>+</button>
                </div>
              </div>
              <div className="right">
                <div className="px">{fmt(l.p.price * l.qty)}</div>
                <button className="rm" onClick={() => removeItem(i)}>Quitar</button>
              </div>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="drawer-foot">
            <div style={{display:"flex", justifyContent:"space-between", fontFamily:"var(--font-mono)", fontSize: 12}}>
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", fontFamily:"var(--font-mono)", fontSize: 12, color: "var(--mute)"}}>
              <span>Envío</span><span>{ship === 0 ? "Gratis" : fmt(ship)}</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", fontFamily:"var(--font-mono)", fontSize: 14, paddingTop: 8, borderTop: "1px solid var(--fg)"}}>
              <span>Total</span><span>{fmt(subtotal + ship)}</span>
            </div>
            <button className="btn block lg" onClick={() => { onClose(); go("checkout"); }}>
              Finalizar compra <span className="btn-arrow">→</span>
            </button>
            <button className="btn ghost block" onClick={onClose}>Seguir comprando</button>
          </div>
        )}
      </aside>
    </>
  );
}

/* ===== REVEAL OBSERVER ======================== */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

Object.assign(window, {
  fmt, Ph, CustomCursor, PromoMarquee, Header, Footer,
  ProductCard, CircleType, CartDrawer, useReveal,
});
