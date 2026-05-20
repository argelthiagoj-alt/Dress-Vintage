// ============================================
// DRESSVINTAGE — secondary pages
// ============================================

const { useState: usS, useEffect: usE, useMemo: usM } = React;

/* ============================================
   OUTFITS
   ============================================ */

function OutfitsPage({ go, addToCart }) {
  useReveal();
  const byId = usM(() => Object.fromEntries(PRODUCTS.map(p => [p.id, p])), []);

  const addOutfit = (o) => {
    o.items.forEach(id => {
      const p = byId[id];
      if (p.oos) return; // skip out-of-stock items
      // Pick the first color × size combo that actually has stock
      const firstColor = ProductHelpers.availableColors(p)[0]?.id || p.colorIds[0];
      const firstSize = ProductHelpers.availableSizesForColor(p, firstColor)[0] || "M";
      addToCart(p, firstSize, firstColor);
    });
  };

  return (
    <main className="page-trans">
      <div className="shell">
        <div className="catalog-head">
          <div>
            <div className="crumbs eyebrow">
              <span onClick={() => go("home")} style={{cursor:"pointer"}}>Inicio</span>
              <span>/</span><span>Outfits</span>
            </div>
            <h1>Compra<br/>el outfit.</h1>
            <div className="count" style={{marginTop: 10}}>{OUTFITS.length} capítulos curados por el staff</div>
          </div>
          <p style={{maxWidth: 380, color: "var(--mute)", fontSize: 14, lineHeight: 1.6}}>
            Tres prendas que conversan entre sí. Llevátelas juntas y obtené descuento automático en el carrito.
          </p>
        </div>
      </div>

      <div className="outfit-list">
        {OUTFITS
          .filter(o => o.active !== false)
          .sort((a, b) => (a.order || 999) - (b.order || 999))
          .map((o, idx) => {
          const items = o.items.map(id => byId[id]).filter(Boolean);
          const sum   = items.reduce((s, p) => s + p.price, 0);
          const final = Math.round(sum * (1 - o.discount));
          const save  = sum - final;
          return (
            <article key={o.id} className="outfit-card reveal">
              <div className="o-media">
                {o.img
                  ? <img src={o.img} alt={o.name} className="o-img" />
                  : <Ph label={`OUTFIT 0${idx+1} · ${o.name.toUpperCase()}`} dark={idx % 2 === 1} />
                }
                <div className="o-media-tag">
                  <span>● OUTFIT 0{idx+1}</span>
                  <span>{o.name.split(" — ")[1] || ""}</span>
                </div>
              </div>
              <div className="o-text">
                <div className="eyebrow">Outfit · 0{idx+1} / 0{OUTFITS.length}</div>
                <h3>{o.name}</h3>
                <p className="desc">{o.desc}</p>
                <div className="o-items">
                  {items.map(p => (
                    <div key={p.id} className="o-item" onClick={() => go(`product:${p.id}`)} style={{cursor:"pointer"}}>
                      {p.img
                        ? <img src={p.img} alt={p.name} className="o-item-img" />
                        : <Ph label={p.cat} />}
                      <div>
                        <div className="cat">{p.cat}{p.oos ? " · sin stock" : ""}</div>
                        <div className="nm">{p.name}</div>
                      </div>
                      <div className="mono" style={{color:"var(--mute)"}}>{p.code}</div>
                      <div className="px">{fmt(p.price)}</div>
                    </div>
                  ))}
                </div>
                <div className="o-totals">
                  <div className="row"><span>Subtotal</span><span>{fmt(sum)}</span></div>
                  <div className="row save"><span>Descuento outfit ({Math.round(o.discount*100)}%)</span><span>− {fmt(save)}</span></div>
                  <div className="row sum"><span>Total outfit</span><span>{fmt(final)}</span></div>
                </div>
                <div style={{display:"flex", gap: 12}}>
                  {(() => {
                    const allOos = items.every(p => p.oos);
                    return (
                      <button className="btn" onClick={() => addOutfit(o)} disabled={allOos}>
                        {allOos
                          ? "Outfit sin stock"
                          : <>Comprar outfit <span className="btn-arrow">→</span></>}
                      </button>
                    );
                  })()}
                  <button className="btn ghost" onClick={() => go(`product:${items[0].id}`)}>
                    Ver prendas
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

/* ============================================
   ABOUT
   ============================================ */

function AboutPage({ go }) {
  useReveal();
  return (
    <main className="shell page-trans">
      <div className="about-hero">
        <div className="reveal">
          <div className="eyebrow" style={{marginBottom: 24}}>Manifiesto · 2024 →</div>
          <h1>
            Una<br/>marca<br/>
            <span style={{WebkitTextStroke:"1.5px var(--fg)", color:"transparent", fontStyle:"italic"}}>silenciosa.</span>
          </h1>
        </div>
        <div className="reveal" style={{transitionDelay: "120ms"}}>
          <p style={{marginBottom: 20}}>
            DressVintage nació en 2024 en Buenos Aires con una idea simple: hacer ropa que dure más de una temporada
            y que mejore con el uso. No diseñamos para el feed: diseñamos para la calle.
          </p>
          <p style={{marginBottom: 24}}>
            Trabajamos con confección local, telas pesadas, cortes amplios y tiradas cortas.
            Cada capítulo es una idea ejecutada en pocas piezas. Cuando se termina, no se reedita.
          </p>
          <button className="btn" onClick={() => go("catalog:all")}>
            Ver el catálogo <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      {/* full bleed photo */}
      <div style={{margin: "0 calc(-1 * var(--pad-x)) 0", aspectRatio: "21/8"}}>
        <Ph label="EQUIPO · TALLER 03" dark />
      </div>

      <section className="values reveal">
        <div className="value">
          <span className="num">01 / 03</span>
          <h4>Tiradas<br/>cortas.</h4>
          <p>Entre 60 y 120 unidades por modelo. Cuando se acaban, lanzamos otra cosa. No reeditamos drops anteriores.</p>
        </div>
        <div className="value">
          <span className="num">02 / 03</span>
          <h4>Confección<br/>local.</h4>
          <p>Tres talleres familiares en CABA y Quilmes. Pagamos en blanco, plazos cortos, sin tercerización opaca.</p>
        </div>
        <div className="value">
          <span className="num">03 / 03</span>
          <h4>Telas<br/>pesadas.</h4>
          <p>Algodón 320 g/m², denim 14 oz, fleece 380 g/m². Caída estructurada que se acomoda con el uso. Sin compresión.</p>
        </div>
      </section>

      <section className="timeline">
        <div className="section-head">
          <h2 className="reveal" style={{fontSize: "clamp(40px, 6vw, 88px)"}}>Línea<br/>de tiempo.</h2>
          <p className="reveal" style={{maxWidth: 320, color:"var(--mute)", fontSize: 14, lineHeight: 1.6}}>
            Tres años, seis capítulos. La historia es corta y por escrito.
          </p>
        </div>
        <div className="reveal">
          {[
            { y: "2024 · 04", t: "Origen", d: "Primera cápsula de 40 remeras en un altillo de Villa Crespo. Se agotaron en 11 días."},
            { y: "2024 · 11", t: "Capítulo 01 — Niebla", d: "Primer drop completo: 6 piezas, paleta crema y gris piedra. Pop-up de 3 días en Palermo."},
            { y: "2025 · 03", t: "Taller propio", d: "Mudanza al espacio actual en Chacarita. Producción semanal, atención con cita previa."},
            { y: "2025 · 09", t: "Capítulo 02 — Asfalto", d: "Apertura del ecommerce. Envíos a todo el país, 10 piezas, denim 14 oz por primera vez."},
            { y: "2026 · 05", t: "Capítulo 03 — Ruido", d: "Drop actual: 8 piezas, primera campera bomber, regreso a la edición numerada."},
          ].map((it, i) => (
            <div key={i} className="timeline-row">
              <div className="yr">{it.y}</div>
              <h5>{it.t}</h5>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{borderBottom: "none"}}>
        <div className="section-head">
          <div>
            <div className="eyebrow reveal" style={{marginBottom: 12}}>Pasá por el taller</div>
            <h2 className="reveal">Av. Federico<br/>Lacroze 3500.</h2>
          </div>
          <div className="right reveal">
            <p>Lun a Vie · 12:00 — 19:00<br/>Sáb · 12:00 — 17:00<br/>CABA, Argentina</p>
            <button className="btn ghost">Ver en mapa <span className="btn-arrow">↗</span></button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================
   FAQ / POLICY
   ============================================ */

function FaqPage({ go }) {
  const [active, setActive] = usS(FAQ[0].id);
  const block = FAQ.find(b => b.id === active);

  return (
    <main className="shell page-trans">
      <div className="faq-wrap">
        <aside>
          <div className="eyebrow" style={{marginBottom: 16}}>Centro de ayuda</div>
          {FAQ.map(b => (
            <button key={b.id} className={active===b.id?"on":""} onClick={() => setActive(b.id)}>
              <span>{b.title}</span>
              <span>{active===b.id ? "●" : "○"}</span>
            </button>
          ))}
          <div style={{marginTop: 24, padding: 14, border: "1px solid var(--line)"}}>
            <div className="eyebrow" style={{marginBottom: 8}}>¿No encontrás respuesta?</div>
            <p style={{fontSize: 13, color: "var(--mute)", marginBottom: 12}}>
              Escribinos por WhatsApp o mail. Te respondemos en horario hábil.
            </p>
            <button className="btn ghost block">Escribinos →</button>
          </div>
        </aside>
        <div className="faq-content">
          <h2>{block.title}</h2>
          {block.items.map((it, i) => (
            <details key={i} open={i===0}>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ============================================
   LOGIN
   ============================================ */

function LoginPage({ go, currentUser, loginAs, logout, refreshUser }) {
  const [mode, setMode] = usS("login");
  const [profileEdit, setProfileEdit] = usS(false);
  const [profileForm, setProfileForm] = usS(() => ({
    name:       currentUser ? (currentUser.name       || "") : "",
    phone:      currentUser ? (currentUser.phone      || "") : "",
    address:    currentUser ? (currentUser.address    || "") : "",
    city:       currentUser ? (currentUser.city       || "") : "",
    postalCode: currentUser ? (currentUser.postalCode || "") : "",
  }));
  const [profileSaved, setProfileSaved] = usS(false);

  // Re-sync local form whenever the user identity changes (e.g. switching demo accounts)
  usE(() => {
    if (!currentUser) return;
    setProfileForm({
      name:       currentUser.name       || "",
      phone:      currentUser.phone      || "",
      address:    currentUser.address    || "",
      city:       currentUser.city       || "",
      postalCode: currentUser.postalCode || "",
    });
    setProfileEdit(false);
    setProfileSaved(false);
  }, [currentUser && currentUser.id]);

  const setPf = (k, v) => setProfileForm(p => ({ ...p, [k]: v }));
  const saveProfile = () => {
    if (!currentUser) return;
    if (!profileForm.name.trim()) return alert("El nombre no puede estar vacío");
    UserStore.update(currentUser.id, {
      name:       profileForm.name.trim(),
      phone:      profileForm.phone.trim(),
      address:    profileForm.address.trim(),
      city:       profileForm.city.trim(),
      postalCode: profileForm.postalCode.trim(),
    });
    refreshUser && refreshUser();
    setProfileEdit(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2400);
  };
  const cancelProfile = () => {
    setProfileForm({
      name:       currentUser ? (currentUser.name       || "") : "",
      phone:      currentUser ? (currentUser.phone      || "") : "",
      address:    currentUser ? (currentUser.address    || "") : "",
      city:       currentUser ? (currentUser.city       || "") : "",
      postalCode: currentUser ? (currentUser.postalCode || "") : "",
    });
    setProfileEdit(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Demo email-based login: pick the user matching the email if it exists, else regular user
    const email = e.target.elements.email?.value?.trim().toLowerCase();
    const found = email && UserStore.findByEmail(email);
    const u = found ? loginAs(found.id) : loginAs(ROLES.USER);
    if (Perms.isBanned(u)) {
      alert(`Cuenta bloqueada: ${u.email}`);
    }
    go("home");
  };

  // Already logged in → show profile card
  if (currentUser) {
    return (
      <main className="auth-wrap page-trans">
        <div className="auth-media">
          <Ph label="ARCHIVO · CUENTA" dark />
          <div style={{position:"absolute", left: 32, bottom: 32, color: "#fff", mixBlendMode: "difference", maxWidth: 340}}>
            <div className="eyebrow" style={{marginBottom: 12, color:"rgba(255,255,255,0.7)"}}>Sesión activa</div>
            <div className="display" style={{fontSize: 56, lineHeight: 0.88}}>Hola,<br/>{currentUser.name.split(" ")[0]}.</div>
          </div>
        </div>
        <div className="auth-form">
          <div className="eyebrow">DV / Cuenta</div>
          <h2>Mi cuenta</h2>

          {/* ===== Identity (read-only) ===== */}
          <div className="adm-stack" style={{marginTop: 8}}>
            <div className="adm-row">
              <span>Rol</span>
              <span className={`role-pill role-${currentUser.role}`}>{ROLE_LABELS[currentUser.role]}</span>
            </div>
            <div className="adm-row">
              <span>Estado</span>
              <span className={`role-pill role-${currentUser.status === "banned" ? "oos" : "active"}`}>
                {currentUser.status === "banned" ? "Baneado" : "Activo"}
              </span>
            </div>
            <div className="adm-row">
              <span>Email</span>
              <span className="mono" style={{fontSize: 12}}>{currentUser.email}</span>
            </div>
          </div>

          {/* ===== Editable profile fields ===== */}
          <div className="profile-section">
            <div className="profile-section-head">
              <div>
                <div className="eyebrow">Datos para tus compras</div>
                <div className="mono" style={{color:"var(--mute)", fontSize: 10, marginTop: 4}}>
                  Se autocompletan en el checkout. Editalos cuando quieras.
                </div>
              </div>
              {!profileEdit && (
                <button type="button" className="adm-link" onClick={() => setProfileEdit(true)}>
                  Editar
                </button>
              )}
              {profileSaved && !profileEdit && (
                <span className="mono profile-saved-tag">✓ Guardado</span>
              )}
            </div>

            {profileEdit ? (
              <div className="profile-form">
                <div className="field">
                  <label>Nombre completo *</label>
                  <input type="text" value={profileForm.name} onChange={e => setPf("name", e.target.value)} />
                </div>
                <div className="field">
                  <label>Teléfono</label>
                  <input type="tel" placeholder="+54 9 11 1234-5678" value={profileForm.phone} onChange={e => setPf("phone", e.target.value)} />
                </div>
                <div className="field">
                  <label>Dirección</label>
                  <input type="text" placeholder="Calle y número, depto, piso" value={profileForm.address} onChange={e => setPf("address", e.target.value)} />
                </div>
                <div className="profile-form-row">
                  <div className="field">
                    <label>Ciudad</label>
                    <input type="text" value={profileForm.city} onChange={e => setPf("city", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Código postal</label>
                    <input type="text" placeholder="C1428" value={profileForm.postalCode} onChange={e => setPf("postalCode", e.target.value)} />
                  </div>
                </div>
                <div className="profile-form-actions">
                  <button type="button" className="btn ghost" onClick={cancelProfile}>Cancelar</button>
                  <button type="button" className="btn" onClick={saveProfile}>
                    Guardar datos <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="adm-stack" style={{marginTop: 12}}>
                <div className="adm-row"><span>Nombre</span><span>{currentUser.name || "—"}</span></div>
                <div className="adm-row">
                  <span>Teléfono</span>
                  <span className="mono" style={{fontSize: 12}}>
                    {currentUser.phone || <span style={{color:"var(--mute)"}}>—</span>}
                  </span>
                </div>
                <div className="adm-row">
                  <span>Dirección</span>
                  <span>{currentUser.address || <span style={{color:"var(--mute)"}}>—</span>}</span>
                </div>
                <div className="adm-row">
                  <span>Ciudad / CP</span>
                  <span>
                    {currentUser.city || "—"}
                    {currentUser.postalCode ? ` · ${currentUser.postalCode}` : ""}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button className="btn lg" type="button" onClick={() => go("account:orders")}>
            Mis compras <span className="btn-arrow">→</span>
          </button>
          {Perms.canAccessAdmin(currentUser) && (
            <button className="btn ghost" type="button" onClick={() => go("admin")}>
              Ir al panel admin
            </button>
          )}
          <button className="btn ghost" type="button" onClick={() => { logout(); }}>
            Cerrar sesión
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-wrap page-trans">
      <div className="auth-media">
        <Ph label="ARCHIVO · NEWSLETTER 03" dark />
        <div style={{position:"absolute", left: 32, bottom: 32, color: "#fff", mixBlendMode: "difference", maxWidth: 340}}>
          <div className="eyebrow" style={{marginBottom: 12, color:"rgba(255,255,255,0.7)"}}>Acceso</div>
          <div className="display" style={{fontSize: 56, lineHeight: 0.88}}>Bienvenido<br/>a la tienda.</div>
        </div>
      </div>
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="eyebrow">DV / Cuenta</div>
        <h2>{mode === "login" ? "Iniciá sesión" : "Crear cuenta"}</h2>
        <div className="tabs">
          <button type="button" className={mode==="login"?"on":""} onClick={() => setMode("login")}>Ingresar</button>
          <button type="button" className={mode==="register"?"on":""} onClick={() => setMode("register")}>Registrarme</button>
        </div>
        {mode === "register" && (
          <div className="field">
            <label>Nombre</label>
            <input type="text" placeholder="Cómo te llamás" required />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" placeholder="tu@email.com" required />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" placeholder="••••••••" required />
        </div>
        {mode === "login" && (
          <div className="row-sm">
            <label style={{display:"flex", alignItems:"center", gap: 8, cursor:"pointer"}}>
              <input type="checkbox" /> Recordarme
            </label>
            <a style={{cursor:"pointer", textDecoration: "underline"}}>Olvidé mi contraseña</a>
          </div>
        )}
        <button className="btn lg" type="submit">
          {mode === "login" ? "Entrar" : "Crear cuenta"} <span className="btn-arrow">→</span>
        </button>
        <div className="mono" style={{color: "var(--mute)", fontSize: 11, marginTop: 4}}>
          Al continuar aceptás nuestros términos y la política de privacidad.
        </div>

        {/* DEMO ROLE LOGIN — quitar cuando haya auth real */}
        <div className="demo-login">
          <div className="eyebrow" style={{marginBottom: 10}}>Demo · entrar como</div>
          <div className="demo-login-buttons">
            <button type="button" className="btn ghost" onClick={() => { loginAs(ROLES.USER); go("home"); }}>
              Usuario
            </button>
            <button type="button" className="btn ghost" onClick={() => { loginAs(ROLES.ADMIN); go("admin"); }}>
              Admin
            </button>
            <button type="button" className="btn ghost" onClick={() => { loginAs(ROLES.SUPERADMIN); go("admin"); }}>
              Superadmin
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

/* ============================================
   CHECKOUT
   ============================================ */

const SHIPPING_OPTIONS = [
  { id: "domicilio", name: "Envío a domicilio", desc: "1-3 días hábiles · Andreani",     cost: 5800, freeOver: 150000 },
  { id: "sucursal",  name: "Retiro en sucursal", desc: "Correo Argentino",                cost: 3400, freeOver: null },
  { id: "taller",    name: "Retiro en taller",   desc: "Av. F. Lacroze 3500 · sin costo", cost: 0,    freeOver: null },
];
const PAYMENT_OPTIONS = [
  { id: "mercado_pago",  name: "Mercado Pago",          desc: "Tarjeta · hasta 6 cuotas sin interés",  glyph: "MP" },
  { id: "transferencia", name: "Transferencia bancaria", desc: "10% off · CBU enviado por mail",        glyph: "★"  },
  { id: "efectivo",      name: "Efectivo en taller",     desc: "Pago al retirar",                       glyph: "$"  },
];

function CheckoutPage({ go, cart, products_byId, clearCart, currentUser, refreshUser }) {
  const [step, setStep] = usS(1);
  const lines = cart.map(c => ({ ...c, p: products_byId[c.id] })).filter(l => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);

  // ---- Controlled customer + selection state ----
  // When logged in, prefill every field from the saved profile so the user
  // doesn't have to retype on every checkout.
  const [email, setEmail]       = usS(currentUser ? (currentUser.email      || "") : "");
  const [name, setName]         = usS(currentUser ? (currentUser.name       || "") : "");
  const [phone, setPhone]       = usS(currentUser ? (currentUser.phone      || "") : "");
  const [address, setAddress]   = usS(currentUser ? (currentUser.address    || "") : "");
  const [city, setCity]         = usS(currentUser ? (currentUser.city       || "") : "");
  const [cp, setCp]             = usS(currentUser ? (currentUser.postalCode || "") : "");
  const [shipMethod, setShipMethod] = usS("domicilio");
  const [payMethod, setPayMethod]   = usS("mercado_pago");
  const [errors, setErrors]     = usS({});
  // Save updated data back to the profile on Pagar (only meaningful when logged in)
  const [saveToAccount, setSaveToAccount] = usS(true);

  // Clear a specific field's error when the user starts editing it
  const clearError = (key) => setErrors(prev => prev[key] ? { ...prev, [key]: undefined } : prev);

  const validateStep1 = () => {
    const e = {};
    if (!email.trim())                                                       e.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))            e.email = "Email inválido";
    if (!name.trim())                                                        e.name  = "El nombre es obligatorio";
    else if (name.trim().length < 2)                                         e.name  = "Nombre demasiado corto";
    if (!phone.trim())                                                       e.phone = "El teléfono es obligatorio";
    else if (phone.replace(/\D/g, "").length < 8)                            e.phone = "Teléfono inválido (mínimo 8 dígitos)";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (shipMethod === "taller") return e; // no shipping address needed for in-store pickup
    if (!address.trim())                                                     e.address = "La dirección es obligatoria";
    if (!city.trim())                                                        e.city    = "La ciudad es obligatoria";
    if (!cp.trim())                                                          e.cp      = "El código postal es obligatorio";
    else if (cp.replace(/\s/g, "").length < 4)                               e.cp      = "Código postal inválido";
    return e;
  };

  const shipOption = SHIPPING_OPTIONS.find(o => o.id === shipMethod) || SHIPPING_OPTIONS[0];
  const shippingCost = (shipOption.freeOver && subtotal >= shipOption.freeOver) ? 0 : shipOption.cost;
  const ship = shippingCost; // backward-compat alias used below
  const total = subtotal + shippingCost;

  // Banned-user block — superadmin-set status prevents purchase
  if (Perms.isBanned(currentUser)) {
    return (
      <main className="shell page-trans" style={{padding: "120px 0", textAlign: "center"}}>
        <div className="eyebrow" style={{marginBottom: 16, color: "var(--accent)"}}>● Cuenta bloqueada</div>
        <h1 className="display" style={{fontSize: "clamp(40px, 7vw, 96px)"}}>No podés finalizar la compra</h1>
        <p style={{color: "var(--mute)", marginTop: 16, marginBottom: 32, maxWidth: 520, marginInline: "auto"}}>
          Tu cuenta ({currentUser.email}) está suspendida. Contactá a soporte para revisar el estado.
        </p>
        <div style={{display:"flex", gap: 12, justifyContent: "center", flexWrap: "wrap"}}>
          <button className="btn" onClick={() => go("faq")}>Ir a Ayuda <span className="btn-arrow">→</span></button>
          <button className="btn ghost" onClick={() => go("home")}>Volver al inicio</button>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="shell page-trans" style={{padding: "120px 0", textAlign: "center"}}>
        <div className="eyebrow" style={{marginBottom: 16}}>Checkout</div>
        <h1 className="display" style={{fontSize: "clamp(48px, 8vw, 96px)"}}>Tu bolsa está vacía</h1>
        <p style={{color: "var(--mute)", marginTop: 16, marginBottom: 32}}>
          Necesitás al menos una prenda para finalizar la compra.
        </p>
        <button className="btn lg" onClick={() => go("catalog:all")}>
          Explorar tienda <span className="btn-arrow">→</span>
        </button>
      </main>
    );
  }

  return (
    <main className="shell page-trans">
      <div className="catalog-head">
        <div>
          <div className="crumbs eyebrow"><span>Bolsa</span><span>/</span><span>Checkout</span></div>
          <h1>Checkout</h1>
        </div>
        <div className="checkout-steps">
          {["Datos", "Envío", "Pago"].map((s, i) => (
            <div key={s} className="checkout-step" style={{opacity: step > i+1 ? 0.5 : 1, color: step === i+1 ? "var(--fg)" : "var(--mute)"}}>
              <span className="checkout-step-dot" style={{borderColor: step >= i+1 ? "var(--fg)" : "var(--line-strong)", background: step > i+1 ? "var(--fg)" : "transparent", color: step > i+1 ? "var(--bg)" : "inherit"}}>
                {step > i+1 ? "✓" : i+1}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-body">
        <div>
          {step === 1 && (
            <div style={{display:"flex", flexDirection:"column", gap: 18}}>
              <h2 className="display" style={{fontSize: 32}}>Datos de contacto</h2>
              {currentUser && (currentUser.phone || currentUser.address) && (
                <div className="checkout-prefill-tag mono">
                  ● Autocompletado con los datos de tu cuenta.
                  Editalos abajo si querés cambiarlos para este pedido.
                </div>
              )}
              <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Email *</label>
                <input type="email" required placeholder="tu@email.com" value={email}
                       onChange={e => { setEmail(e.target.value); clearError("email"); }}
                       className={errors.email ? "input-error" : ""}
                       style={{padding: "12px 0", border:"none", borderBottom: `1px solid ${errors.email ? "var(--accent)" : "var(--line-strong)"}`, background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                {errors.email && <div className="form-error mono">{errors.email}</div>}
              </div>
              <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Nombre completo *</label>
                <input type="text" required placeholder="Nombre y apellido" value={name}
                       onChange={e => { setName(e.target.value); clearError("name"); }}
                       style={{padding: "12px 0", border:"none", borderBottom: `1px solid ${errors.name ? "var(--accent)" : "var(--line-strong)"}`, background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                {errors.name && <div className="form-error mono">{errors.name}</div>}
              </div>
              <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Teléfono *</label>
                <input type="tel" required placeholder="+54 9 11 1234-5678" value={phone}
                       onChange={e => { setPhone(e.target.value); clearError("phone"); }}
                       style={{padding: "12px 0", border:"none", borderBottom: `1px solid ${errors.phone ? "var(--accent)" : "var(--line-strong)"}`, background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                {errors.phone && <div className="form-error mono">{errors.phone}</div>}
                {!errors.phone && (
                  <div className="mono" style={{fontSize: 9.5, color:"var(--mute)", letterSpacing:"0.08em"}}>
                    Lo usamos para coordinar la entrega.
                  </div>
                )}
              </div>
              <button className="btn lg" onClick={() => {
                const errs = validateStep1();
                setErrors(errs);
                if (Object.keys(errs).length > 0) return;
                setStep(2);
              }} style={{alignSelf:"flex-start", marginTop: 16}}>
                Continuar al envío <span className="btn-arrow">→</span>
              </button>
            </div>
          )}
          {step === 2 && (
            <div style={{display:"flex", flexDirection:"column", gap: 18}}>
              <h2 className="display" style={{fontSize: 32}}>Envío</h2>

              {/* Shipping method selector first so the required address fields adjust */}
              <div style={{display:"flex", flexDirection:"column", gap: 8}}>
                {SHIPPING_OPTIONS.map(opt => {
                  const cost = (opt.freeOver && subtotal >= opt.freeOver) ? 0 : opt.cost;
                  return (
                    <label key={opt.id} style={{display:"grid", gridTemplateColumns:"22px 1fr auto", gap: 12, padding: 14, border: shipMethod === opt.id ? "1px solid var(--fg)" : "1px solid var(--line)", alignItems:"center", cursor:"pointer"}}>
                      <input type="radio" name="ship" checked={shipMethod === opt.id} onChange={() => { setShipMethod(opt.id); setErrors({}); }} />
                      <div>
                        <div style={{fontSize: 14, fontVariationSettings: '"wght" 500'}}>{opt.name}</div>
                        <div className="mono" style={{color:"var(--mute)", fontSize: 10, letterSpacing:"0.14em"}}>{opt.desc}</div>
                      </div>
                      <div className="mono">{cost === 0 ? "Gratis" : fmt(cost)}</div>
                    </label>
                  );
                })}
              </div>

              {shipMethod === "taller" ? (
                <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                  <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>
                    Notas (opcional)
                  </label>
                  <input type="text" placeholder="Día/horario preferido para retirar" value={address}
                         onChange={e => setAddress(e.target.value)}
                         style={{padding: "12px 0", border:"none", borderBottom: "1px solid var(--line-strong)", background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                  <div className="mono" style={{fontSize: 9.5, color:"var(--mute)", letterSpacing:"0.08em"}}>
                    Retirás en Av. F. Lacroze 3500, CABA. Te coordinamos por WhatsApp.
                  </div>
                </div>
              ) : (
                <>
                  <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                    <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Dirección *</label>
                    <input type="text" required placeholder="Calle y número, depto, piso" value={address}
                           onChange={e => { setAddress(e.target.value); clearError("address"); }}
                           style={{padding: "12px 0", border:"none", borderBottom: `1px solid ${errors.address ? "var(--accent)" : "var(--line-strong)"}`, background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                    {errors.address && <div className="form-error mono">{errors.address}</div>}
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 16}}>
                    <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                      <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Ciudad *</label>
                      <input type="text" required placeholder="CABA, Mar del Plata..." value={city}
                             onChange={e => { setCity(e.target.value); clearError("city"); }}
                             style={{padding: "12px 0", border:"none", borderBottom: `1px solid ${errors.city ? "var(--accent)" : "var(--line-strong)"}`, background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                      {errors.city && <div className="form-error mono">{errors.city}</div>}
                    </div>
                    <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                      <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Código postal *</label>
                      <input type="text" required placeholder="C1428" value={cp}
                             onChange={e => { setCp(e.target.value); clearError("cp"); }}
                             style={{padding: "12px 0", border:"none", borderBottom: `1px solid ${errors.cp ? "var(--accent)" : "var(--line-strong)"}`, background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                      {errors.cp && <div className="form-error mono">{errors.cp}</div>}
                    </div>
                  </div>
                </>
              )}

              <div style={{display:"flex", gap: 12, marginTop: 16}}>
                <button className="btn ghost" onClick={() => { setErrors({}); setStep(1); }}>← Atrás</button>
                <button className="btn lg" onClick={() => {
                  const errs = validateStep2();
                  setErrors(errs);
                  if (Object.keys(errs).length > 0) return;
                  setStep(3);
                }}>Continuar al pago <span className="btn-arrow">→</span></button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{display:"flex", flexDirection:"column", gap: 18}}>
              <h2 className="display" style={{fontSize: 32}}>Pago</h2>
              <div style={{display:"flex", flexDirection:"column", gap: 8}}>
                {PAYMENT_OPTIONS.map(opt => (
                  <label key={opt.id} style={{display:"grid", gridTemplateColumns:"22px 1fr auto", gap: 12, padding: 14, border: payMethod === opt.id ? "1px solid var(--fg)" : "1px solid var(--line)", alignItems:"center", cursor:"pointer"}}>
                    <input type="radio" name="pay" checked={payMethod === opt.id} onChange={() => setPayMethod(opt.id)} />
                    <div>
                      <div style={{fontSize: 14, fontVariationSettings: '"wght" 500'}}>{opt.name}</div>
                      <div className="mono" style={{color:"var(--mute)", fontSize: 10, letterSpacing:"0.14em"}}>{opt.desc}</div>
                    </div>
                    <div className="mono" style={{fontSize: 14}}>{opt.glyph}</div>
                  </label>
                ))}
              </div>
              {currentUser && (
                <label className="adm-check checkout-save-toggle">
                  <input
                    type="checkbox"
                    checked={saveToAccount}
                    onChange={e => setSaveToAccount(e.target.checked)}
                  />
                  <span>
                    Guardar estos datos en mi cuenta
                    <span className="mono" style={{display:"block", color:"var(--mute)", fontSize:9.5, letterSpacing:"0.08em", textTransform:"none", marginTop: 4}}>
                      Reemplazan tu perfil. La próxima compra se autocompleta.
                    </span>
                  </span>
                </label>
              )}
              <div style={{display:"flex", gap: 12, marginTop: 16}}>
                <button className="btn ghost" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn lg" onClick={async () => {
                  // Defense in depth: re-validate before committing
                  const errs1 = validateStep1();
                  const errs2 = validateStep2();
                  const allErrs = { ...errs1, ...errs2 };
                  if (Object.keys(allErrs).length > 0) {
                    setErrors(allErrs);
                    if (errs1 && Object.keys(errs1).length > 0) setStep(1);
                    else setStep(2);
                    return;
                  }
                  // Persist updated profile if the user opted in
                  if (currentUser && saveToAccount) {
                    UserStore.update(currentUser.id, {
                      name:       name.trim(),
                      phone:      phone.trim(),
                      address:    address.trim(),
                      city:       city.trim(),
                      postalCode: cp.trim(),
                    });
                    refreshUser && refreshUser();
                  }

                  // ---- Try real backend first (Supabase + Resend) ----
                  if (window.dvApi) {
                    const apiPayload = {
                      customer: {
                        name:    name.trim(),
                        email:   email.trim(),
                        phone:   phone.trim(),
                      },
                      shipping: {
                        method:     shipMethod,
                        address:    address.trim(),
                        city:       city.trim(),
                        postalCode: cp.trim(),
                      },
                      payment: { method: payMethod },
                      items: lines.map(l => ({
                        product_id: l.p.id,
                        size:       l.size,
                        color:      l.color,
                        qty:        l.qty,
                      })),
                      userId: currentUser ? currentUser.id : null,
                    };
                    const r = await window.dvApi.createOrder(apiPayload);
                    if (r.ok && r.data && r.data.order) {
                      // Mirror to local OrdersStore so the user's "Mis compras"
                      // list still shows it offline-friendly.
                      try {
                        OrdersStore.createOrder({
                          user: currentUser,
                          customer: { name: name.trim(), email: email.trim(), phone: phone.trim(),
                                      address: address.trim(), city: city.trim(), postalCode: cp.trim() },
                          payment:  { method: payMethod },
                          shipping: { method: shipMethod },
                          items: lines.map(l => ({
                            productId: l.p.id, productName: l.p.name,
                            size: l.size, color: l.color, qty: l.qty,
                            unitPrice: l.p.price, subtotal: l.p.price * l.qty, image: l.p.img || null,
                          })),
                          subtotal, shippingCost, total,
                        });
                      } catch (e) { /* non-fatal */ }
                      clearCart();
                      go(`order-success:${r.data.order.order_number}`);
                      return;
                    }
                    // If the API is configured but returned an error, surface it
                    if (r.status && r.status !== 404 && r.status !== 0) {
                      alert(`Error al procesar el pedido: ${r.error}\nGuardando local como respaldo.`);
                    }
                    // status 404/0 → fall through to local-only path
                  }

                  // ---- Fallback: local OrdersStore only (demo mode) ----
                  const order = OrdersStore.createOrder({
                    user: currentUser,
                    customer: {
                      name:       name.trim() || (currentUser ? currentUser.name : "Invitado"),
                      email:      email.trim() || (currentUser ? currentUser.email : "guest@dressvintage.com"),
                      phone:      phone.trim(),
                      address:    address.trim(),
                      city:       city.trim(),
                      postalCode: cp.trim(),
                    },
                    payment:  { method: payMethod },
                    shipping: { method: shipMethod },
                    items: lines.map(l => ({
                      productId:   l.p.id,
                      productName: l.p.name,
                      size:        l.size,
                      color:       l.color,
                      qty:         l.qty,
                      unitPrice:   l.p.price,
                      subtotal:    l.p.price * l.qty,
                      image:       l.p.img || null,
                    })),
                    subtotal,
                    shippingCost,
                    total,
                  });
                  clearCart();
                  go(`order-success:${order.id}`);
                }}>
                  Pagar {fmt(total)} <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="checkout-summary">
          <div className="eyebrow" style={{marginBottom: 16}}>Tu pedido · {lines.length} prendas</div>
          {lines.map((l, i) => (
            <div key={i} style={{display:"grid", gridTemplateColumns: "56px 1fr auto", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)"}}>
              {l.p.img
                ? <img src={l.p.img} alt={l.p.name} style={{width: 56, height: 64, objectFit: "cover"}} />
                : <Ph label={l.p.cat} style={{width: 56, height: 64}} />}
              <div>
                <div style={{fontSize: 13}}>{l.p.name}</div>
                <div className="mono" style={{fontSize: 10, color: "var(--mute)", letterSpacing:"0.14em"}}>T:{l.size} · ×{l.qty}</div>
              </div>
              <div className="mono" style={{fontSize: 12}}>{fmt(l.p.price * l.qty)}</div>
            </div>
          ))}
          <div style={{display:"flex", flexDirection:"column", gap: 6, marginTop: 20, fontFamily:"var(--font-mono)", fontSize: 12}}>
            <div style={{display:"flex", justifyContent:"space-between"}}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div style={{display:"flex", justifyContent:"space-between", color: "var(--mute)"}}><span>Envío</span><span>{ship === 0 ? "Gratis" : fmt(ship)}</span></div>
            <div style={{display:"flex", justifyContent:"space-between", fontSize: 15, paddingTop: 12, marginTop: 8, borderTop: "1px solid var(--fg)"}}><span>Total</span><span>{fmt(total)}</span></div>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ============================================
   ORDER TRACKER (shared between user + admin views)
   ============================================ */

function OrderTracker({ order }) {
  if (order.status === ORDER_STATUS.CANCELLED) {
    return (
      <div className="tracker tracker-cancelled">
        <div className="eyebrow" style={{color:"var(--accent)", marginBottom: 6}}>● Cancelado</div>
        <div className="mono">{ORDER_STATUS_LABELS[ORDER_STATUS.CANCELLED]}</div>
      </div>
    );
  }
  const currentIdx = ORDER_FLOW.indexOf(order.status);
  return (
    <div className="tracker">
      {ORDER_FLOW.map((s, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;
        const histEntry = (order.history || []).slice().reverse().find(h => h.status === s);
        return (
          <div key={s} className={`tracker-step ${done ? "done" : ""} ${current ? "current" : ""}`}>
            <div className="step-dot">{done ? "✓" : i + 1}</div>
            <div className="step-label">{ORDER_STATUS_SHORT[s]}</div>
            {histEntry && (
              <div className="mono step-date">
                {new Date(histEntry.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================
   ORDER SUCCESS — confirmation after checkout
   ============================================ */

function OrderSuccessPage({ orderId, go }) {
  const order = OrdersStore.get(orderId);
  if (!order) {
    return (
      <main className="shell page-trans" style={{padding: "120px 0", textAlign: "center"}}>
        <h1 className="display" style={{fontSize: "clamp(40px, 7vw, 88px)"}}>Pedido no encontrado</h1>
        <p style={{color:"var(--mute)", marginTop: 16, marginBottom: 32}}>El ID {orderId} no existe.</p>
        <button className="btn lg" onClick={() => go("home")}>Volver al inicio</button>
      </main>
    );
  }
  return (
    <main className="shell page-trans" style={{padding:"clamp(56px, 8vw, 120px) 0", textAlign:"center"}}>
      <div style={{maxWidth: 720, marginInline: "auto"}}>
        <div className="eyebrow" style={{marginBottom: 12}}>● Compra realizada</div>
        <h1 className="display" style={{fontSize: "clamp(40px, 7vw, 96px)", lineHeight: 0.9, marginBottom: 18}}>
          Gracias por tu<br/>
          <span style={{WebkitTextStroke:"1.5px var(--fg)", color:"transparent", fontStyle:"italic"}}>compra.</span>
        </h1>
        <p style={{color:"var(--mute)", maxWidth: 480, marginInline:"auto", marginBottom: 24}}>
          Te enviamos los detalles a <strong>{order.customerEmail}</strong>. Guardá tu número
          de pedido para hacer el seguimiento.
        </p>
        <div className="order-id-box">
          <div className="eyebrow" style={{marginBottom: 8}}>Tu número de pedido</div>
          <div className="display" style={{fontSize: "clamp(22px, 3.5vw, 32px)", letterSpacing: "-0.02em"}}>
            {order.id}
          </div>
        </div>
        <div style={{margin: "40px 0 32px"}}>
          <OrderTracker order={order} />
        </div>
        <div style={{display:"flex", gap: 12, justifyContent:"center", flexWrap:"wrap"}}>
          <button className="btn lg" onClick={() => go(`account:order:${order.id}`)}>
            Ver seguimiento <span className="btn-arrow">→</span>
          </button>
          <button className="btn ghost" onClick={() => go("catalog:all")}>Seguir comprando</button>
        </div>
      </div>
    </main>
  );
}

/* ============================================
   ACCOUNT — MIS COMPRAS (list)
   ============================================ */

function AccountOrdersPage({ go, currentUser }) {
  if (!currentUser) {
    return (
      <main className="shell page-trans" style={{padding: "120px 0", textAlign: "center"}}>
        <div className="eyebrow" style={{marginBottom: 12}}>Iniciá sesión</div>
        <h1 className="display" style={{fontSize: "clamp(40px, 7vw, 88px)"}}>Mi cuenta</h1>
        <p style={{color:"var(--mute)", marginTop: 16, marginBottom: 32}}>
          Necesitás iniciar sesión para ver tus compras.
        </p>
        <button className="btn lg" onClick={() => go("login")}>
          Iniciar sesión <span className="btn-arrow">→</span>
        </button>
      </main>
    );
  }
  // Show orders the user made while logged in + guest orders matching their email
  const byUser = OrdersStore.listByUser(currentUser.id);
  const byEmail = OrdersStore.listByEmail(currentUser.email).filter(o => !o.userId);
  const all = [...byUser, ...byEmail].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="shell page-trans" style={{paddingBottom: 80}}>
      <div className="catalog-head">
        <div>
          <div className="crumbs eyebrow">
            <span onClick={() => go("home")} style={{cursor:"pointer"}}>Inicio</span>
            <span>/</span>
            <span onClick={() => go("account")} style={{cursor:"pointer"}}>Mi cuenta</span>
            <span>/</span>
            <span>Mis compras</span>
          </div>
          <h1>Mis compras</h1>
          <div className="count" style={{marginTop: 10}}>{all.length} pedidos</div>
        </div>
        <div className="adm-page-actions">
          <button className="btn ghost" onClick={() => go("account")}>← Mi cuenta</button>
        </div>
      </div>

      {all.length === 0 ? (
        <div style={{textAlign:"center", padding:"60px 0"}}>
          <p style={{color:"var(--mute)", marginBottom: 24}}>Todavía no hiciste compras.</p>
          <button className="btn lg" onClick={() => go("catalog:all")}>
            Explorar tienda <span className="btn-arrow">→</span>
          </button>
        </div>
      ) : (
        <div className="adm-table-wrap" style={{marginTop: 24}}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Prendas</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {all.map(o => {
                const qty = (o.items || []).reduce((s, it) => s + it.qty, 0);
                return (
                  <tr key={o.id} onClick={() => go(`account:order:${o.id}`)} style={{cursor:"pointer"}}>
                    <td className="mono" style={{fontSize: 11}}>{o.id}</td>
                    <td className="mono">{new Date(o.createdAt).toLocaleDateString("es-AR", {day:"2-digit", month:"short", year:"numeric"})}</td>
                    <td className="mono">{qty}</td>
                    <td className="mono">{fmt(o.total)}</td>
                    <td><span className={`role-pill status-pill-${o.status}`}>{ORDER_STATUS_SHORT[o.status]}</span></td>
                    <td><span className="adm-link">Ver →</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

/* ============================================
   ACCOUNT — DETALLE DE PEDIDO
   ============================================ */

function AccountOrderDetailPage({ orderId, go, currentUser }) {
  const order = OrdersStore.get(orderId);
  if (!order) {
    return (
      <main className="shell page-trans" style={{padding: "120px 0", textAlign: "center"}}>
        <h1 className="display" style={{fontSize: "clamp(32px, 5vw, 56px)"}}>Pedido no encontrado</h1>
        <p style={{color:"var(--mute)", marginTop: 16, marginBottom: 32}}>El ID {orderId} no existe.</p>
        <button className="btn" onClick={() => go("account:orders")}>← Mis compras</button>
      </main>
    );
  }
  // Permission: own user OR matching email (for guest orders)
  const isOwn = currentUser && (
    order.userId === currentUser.id ||
    String(order.customerEmail || "").toLowerCase() === String(currentUser.email || "").toLowerCase()
  );
  if (!isOwn) {
    return (
      <main className="shell page-trans" style={{padding: "120px 0", textAlign: "center"}}>
        <div className="eyebrow" style={{marginBottom: 12, color:"var(--accent)"}}>● Sin acceso</div>
        <h1 className="display" style={{fontSize: "clamp(32px, 5vw, 56px)"}}>Este pedido no es tuyo</h1>
        <p style={{color:"var(--mute)", marginTop: 16, marginBottom: 32}}>
          Solo podés ver tus propios pedidos.
        </p>
        <button className="btn" onClick={() => go("account:orders")}>← Mis compras</button>
      </main>
    );
  }
  return <OrderDetailView order={order} go={go} backTo="account:orders" backLabel="Mis compras" />;
}

/* ============================================
   ORDER DETAIL VIEW — shared layout for user + admin order detail
   ============================================ */

function OrderDetailView({ order, go, backTo, backLabel, adminPanel }) {
  return (
    <main className="shell page-trans" style={{paddingBottom: 80}}>
      <div className="catalog-head">
        <div>
          <div className="crumbs eyebrow">
            <span onClick={() => go(backTo)} style={{cursor:"pointer", textDecoration:"underline"}}>
              ← {backLabel}
            </span>
          </div>
          <div className="mono" style={{color:"var(--mute)", marginBottom: 6}}>Pedido</div>
          <h1 style={{fontSize: "clamp(24px, 4vw, 44px)"}}>{order.id}</h1>
          <div className="mono" style={{marginTop: 10, color:"var(--mute)"}}>
            {new Date(order.createdAt).toLocaleString("es-AR", {day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit"})}
          </div>
        </div>
        <div className="adm-page-actions">
          <span className={`role-pill status-pill-${order.status}`}>{ORDER_STATUS_SHORT[order.status]}</span>
        </div>
      </div>

      <div className="order-detail-grid">
        <div className="order-detail-main">
          <div className="order-section">
            <div className="order-section-title">Seguimiento</div>
            <OrderTracker order={order} />
            <div className="order-status-msg">
              {ORDER_STATUS_LABELS[order.status]}
            </div>
            {order.shipping && order.shipping.trackingCode && (
              <div className="order-tracking-code">
                <span className="mono" style={{color:"var(--mute)"}}>Código de seguimiento</span>
                <span className="mono" style={{fontSize: 14, fontVariationSettings:'"wght" 500'}}>
                  {order.shipping.trackingCode}
                </span>
              </div>
            )}
          </div>

          {adminPanel}

          <div className="order-section">
            <div className="order-section-title">Historial</div>
            <div className="order-history">
              {(order.history || []).slice().reverse().map((h, i) => (
                <div key={i} className="history-entry">
                  <div className="mono history-date">
                    {new Date(h.date).toLocaleString("es-AR", {day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit"})}
                  </div>
                  <div className="history-info">
                    <span className={`role-pill status-pill-${h.status}`}>{ORDER_STATUS_SHORT[h.status]}</span>
                    {h.note && <span style={{color:"var(--mute)"}}>{h.note}</span>}
                    {h.changedBy && <span className="mono" style={{color:"var(--mute)", fontSize: 10}}>· por {h.changedBy}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="order-detail-side">
          <div className="order-section">
            <div className="order-section-title">Resumen</div>
            <div className="order-items">
              {order.items.map((it, i) => (
                <div key={i} className="order-item">
                  {it.image
                    ? <img src={it.image} alt="" />
                    : <div className="adm-thumb-empty" style={{width: 56, height: 70}} />}
                  <div className="order-item-info">
                    <div style={{fontVariationSettings:'"wght" 500'}}>{it.productName}</div>
                    <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>
                      T:{it.size} · {it.color} · ×{it.qty}
                    </div>
                  </div>
                  <div className="mono">{fmt(it.subtotal != null ? it.subtotal : it.unitPrice * it.qty)}</div>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div><span>Subtotal</span><span className="mono">{fmt(order.subtotal)}</span></div>
              <div><span>Envío</span><span className="mono">{order.shippingCost === 0 ? "Gratis" : fmt(order.shippingCost)}</span></div>
              <div className="order-total-row"><span>Total</span><span className="mono">{fmt(order.total)}</span></div>
            </div>
          </div>

          <div className="order-section">
            <div className="order-section-title">Entrega</div>
            <div className="adm-stack">
              <div className="adm-row"><span>Método</span><span>{order.shipping ? order.shipping.method : "—"}</span></div>
              <div className="adm-row"><span>Dirección</span><span>{order.shipping ? (order.shipping.address || "—") : "—"}</span></div>
              <div className="adm-row"><span>Ciudad</span><span>{order.shipping ? (order.shipping.city || "—") : "—"}</span></div>
              <div className="adm-row"><span>CP</span><span>{order.shipping ? (order.shipping.postalCode || "—") : "—"}</span></div>
            </div>
          </div>

          <div className="order-section">
            <div className="order-section-title">Pago</div>
            <div className="adm-stack">
              <div className="adm-row"><span>Método</span><span>{order.payment ? order.payment.method : "—"}</span></div>
              <div className="adm-row">
                <span>Estado</span>
                <span className={`role-pill ${order.payment && order.payment.status === "confirmado" ? "role-active" : "role-low"}`}>
                  {order.payment ? order.payment.status : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="order-section">
            <div className="order-section-title">Contacto</div>
            <div className="adm-stack">
              <div className="adm-row"><span>Nombre</span><span>{order.customerName}</span></div>
              <div className="adm-row"><span>Email</span><span className="mono" style={{fontSize: 11}}>{order.customerEmail}</span></div>
              <div className="adm-row">
                <span>Teléfono</span>
                <span className="mono" style={{fontSize: 12}}>
                  {order.customerPhone
                    ? <a href={`tel:${order.customerPhone.replace(/\s|-/g, "")}`} style={{color:"var(--fg)"}}>{order.customerPhone}</a>
                    : <span style={{color:"var(--mute)"}}>—</span>}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

window.OutfitsPage              = OutfitsPage;
window.AboutPage                = AboutPage;
window.FaqPage                  = FaqPage;
window.LoginPage                = LoginPage;
window.CheckoutPage             = CheckoutPage;
window.OrderTracker             = OrderTracker;
window.OrderSuccessPage         = OrderSuccessPage;
window.AccountOrdersPage        = AccountOrdersPage;
window.AccountOrderDetailPage   = AccountOrderDetailPage;
window.OrderDetailView          = OrderDetailView;
