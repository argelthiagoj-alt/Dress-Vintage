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

function Header({ route, go, theme, setTheme, cartCount, openCart, currentUser, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const showAdmin = Perms.canAccessAdmin(currentUser);
  const accountLabel = currentUser
    ? (currentUser.name.split(" ")[0] || "Cuenta")
    : "Cuenta";
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
              {showAdmin && (
                <button className="hide-mobile header-admin-link" onClick={() => go("admin")}>
                  Panel
                </button>
              )}
              <button className="hide-mobile" onClick={() => go(currentUser ? "account" : "login")}>{accountLabel}</button>
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
          {showAdmin && (
            <button onClick={() => goAndClose("admin")}>
              <span>Panel admin</span><span className="arr">→</span>
            </button>
          )}
          <button onClick={() => goAndClose(currentUser ? "account" : "login")}>
            <span>{currentUser ? `Mi cuenta · ${accountLabel}` : "Cuenta"}</span><span className="arr">→</span>
          </button>
          {currentUser && (
            <>
              <button onClick={() => goAndClose("account:orders")}>
                <span>Mis compras</span><span className="arr">→</span>
              </button>
              <button onClick={() => { setMenuOpen(false); logout && logout(); }}>
                <span>Cerrar sesión</span><span className="arr">×</span>
              </button>
            </>
          )}
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
  const [newsEmail, setNewsEmail] = useState("");
  const [newsConsent, setNewsConsent] = useState(true);
  const [newsStatus, setNewsStatus] = useState(null); // null | "loading" | "success" | "already" | "error" | "no-api"
  const [newsErrorMsg, setNewsErrorMsg] = useState("");

  const onSubscribe = async (e) => {
    e.preventDefault();
    setNewsErrorMsg("");
    if (!newsEmail.trim()) { setNewsStatus("error"); setNewsErrorMsg("Ingresá un email"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newsEmail.trim())) {
      setNewsStatus("error"); setNewsErrorMsg("Email inválido"); return;
    }
    if (!newsConsent) { setNewsStatus("error"); setNewsErrorMsg("Necesitamos tu consentimiento"); return; }

    setNewsStatus("loading");
    if (!window.dvApi) { setNewsStatus("no-api"); return; }

    const r = await window.dvApi.newsletterSubscribe({
      email: newsEmail.trim(),
      consent: true,
      source: "footer",
    });
    if (r.ok) {
      setNewsStatus(r.data && r.data.alreadySubscribed ? "already" : "success");
      setNewsEmail("");
    } else if (r.status === 404) {
      setNewsStatus("no-api");
    } else {
      setNewsStatus("error");
      setNewsErrorMsg(r.error || "Algo falló");
    }
  };

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
            <form className="footer-newsletter" onSubmit={onSubscribe}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={newsEmail}
                onChange={e => { setNewsEmail(e.target.value); if (newsStatus === "error") setNewsStatus(null); }}
                disabled={newsStatus === "loading"}
                required
              />
              <button type="submit" disabled={newsStatus === "loading"}>
                {newsStatus === "loading" ? "..." : "Sumar →"}
              </button>
            </form>
            <label className="footer-newsletter-consent">
              <input
                type="checkbox"
                checked={newsConsent}
                onChange={e => setNewsConsent(e.target.checked)}
              />
              <span>Acepto recibir novedades y promociones.</span>
            </label>
            {newsStatus === "success" && (
              <div className="footer-newsletter-msg ok mono">✓ Listo. Te suscribimos. Revisá tu inbox.</div>
            )}
            {newsStatus === "already" && (
              <div className="footer-newsletter-msg ok mono">● Ya estabas suscripto. Todo bien.</div>
            )}
            {newsStatus === "error" && (
              <div className="footer-newsletter-msg err mono">✗ {newsErrorMsg}</div>
            )}
            {newsStatus === "no-api" && (
              <div className="footer-newsletter-msg ok mono">
                ✓ Gracias. Te avisamos del próximo drop.
              </div>
            )}
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
  // Default color for quick-add: first color with any stock, else first declared
  const defaultColor =
    product.colorIds.find(cid => !ProductHelpers.isColorOOS(product, cid)) ||
    product.colorIds[0];
  return (
    <div className={`product ${oos ? "oos" : ""}`} onClick={() => go(`product:${product.id}`)}>
      <div className="product-media">
        <div className="product-badges">
          {product.isNew && !oos && <span className="badge new">NEW</span>}
          {sale && <span className="badge sale">−{ProductHelpers.discountPercent(product)}%</span>}
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
              {product.sizes.map(s => {
                const stockHere = ProductHelpers.stockOf(product, defaultColor, s.s);
                const noStock = stockHere === 0;
                return (
                  <button
                    key={s.s}
                    className={noStock ? "oos" : ""}
                    disabled={noStock}
                    onClick={() => !noStock && onQuickAdd(product, s.s, defaultColor)}
                  >
                    {s.s}
                  </button>
                );
              })}
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

/* ===== IMAGE UTILITIES ======================== */

// Compress a File → data URL JPEG. Returns existing URL strings unchanged.
async function compressImage(file, maxW = 1200, quality = 0.85) {
  if (typeof file === "string") return file; // already a URL/path, no-op
  const dataURL = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  // Skip compression for SVG / GIF (preserve)
  if (file.type === "image/svg+xml" || file.type === "image/gif") return dataURL;

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataURL;
  });
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) return dataURL;
  if (w <= maxW) {
    // Still re-encode to JPEG if it's PNG/large to shrink — but only if file is big
    if (file.size < 250 * 1024) return dataURL;
  }
  const scale = Math.min(1, maxW / w);
  const canvas = document.createElement("canvas");
  canvas.width  = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff"; // for transparent PNG → JPEG fallback bg
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

/* ===== FILE PICKER (drag & drop, click, mobile) ===== */

function FilePicker({ value = [], onChange, multiple = true, label, hint, accept = "image/*" }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const list = Array.isArray(value) ? value : (value ? [value] : []);

  const ingest = async (files) => {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
      const compressed = await Promise.all(arr.map(f => compressImage(f)));
      const next = multiple ? [...list, ...compressed] : compressed.slice(-1);
      onChange(next);
    } catch (e) {
      console.error(e);
      alert("No se pudo procesar la imagen. Probá con otra.");
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files) ingest(e.dataTransfer.files);
  };
  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const onChangeInput = (e) => {
    ingest(e.target.files);
    e.target.value = ""; // allow re-picking the same file
  };

  const remove = (i) => {
    const next = list.filter((_, j) => j !== i);
    onChange(next);
  };
  const makePrimary = (i) => {
    if (i === 0) return;
    const next = [list[i], ...list.filter((_, j) => j !== i)];
    onChange(next);
  };

  return (
    <div className="filepicker">
      <div
        className={`filepicker-drop ${dragOver ? "is-drag" : ""} ${busy ? "is-busy" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current && inputRef.current.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChangeInput}
          style={{display:"none"}}
        />
        <div className="filepicker-icon" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
            <path d="M12 16V4"/><path d="M6 10l6-6 6 6"/><path d="M4 20h16"/>
          </svg>
        </div>
        <div className="filepicker-label">
          {busy
            ? "Procesando…"
            : (label || (multiple ? "Arrastrá imágenes o tocá para subir" : "Arrastrá una imagen o tocá para subir"))}
        </div>
        <div className="mono filepicker-hint">{hint || "PNG · JPG · WEBP · se comprime a 1200px"}</div>
      </div>

      {list.length > 0 && (
        <div className="filepicker-previews">
          {list.map((url, i) => (
            <div key={i} className="filepicker-preview">
              <img src={url} alt={`imagen ${i+1}`} />
              {i === 0 && <span className="filepicker-primary-tag mono">PRIMARIA</span>}
              <div className="filepicker-preview-actions">
                {i > 0 && (
                  <button
                    type="button"
                    className="mono"
                    onClick={(e) => { e.stopPropagation(); makePrimary(i); }}
                    title="Marcar como primaria"
                  >
                    ★
                  </button>
                )}
                <button
                  type="button"
                  className="mono"
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  aria-label="Eliminar imagen"
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== IMAGE CAROUSEL ========================= */

function ImageCarousel({ images = [], alt = "", oosLabel }) {
  const [idx, setIdx] = useState(0);
  const touch = useRef({ x: null, y: null });

  // Reset when image set changes (e.g., user switches color)
  useEffect(() => { setIdx(0); }, [images]);

  if (!images.length) {
    return (
      <div className="carousel">
        <div className="carousel-frame">
          <Ph label={alt || "SIN IMAGEN"} />
        </div>
      </div>
    );
  }

  const safe = (i) => ((i % images.length) + images.length) % images.length;
  const next = () => setIdx(i => safe(i + 1));
  const prev = () => setIdx(i => safe(i - 1));

  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (touch.current.x == null) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
    touch.current = { x: null, y: null };
  };

  return (
    <div className="carousel">
      <div
        className="carousel-frame"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {images.map((src, i) => (
            <div className="carousel-slide" key={i}>
              <img src={src} alt={`${alt} ${i+1}/${images.length}`} draggable="false" />
            </div>
          ))}
        </div>
        {oosLabel && (
          <div className="oos-overlay">
            <span>{oosLabel}</span>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-prev"
              onClick={prev}
              aria-label="Imagen anterior"
            >←</button>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-next"
              onClick={next}
              aria-label="Imagen siguiente"
            >→</button>
            <div className="carousel-counter mono">{idx + 1} / {images.length}</div>
            <div className="carousel-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`carousel-dot ${i === idx ? "on" : ""}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Ir a imagen ${i+1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="carousel-thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-thumb ${i === idx ? "on" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Imagen ${i+1}`}
            >
              <img src={src} alt="" draggable="false" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  fmt, Ph, CustomCursor, PromoMarquee, Header, Footer,
  ProductCard, CircleType, CartDrawer, useReveal,
  FilePicker, ImageCarousel, compressImage,
});
