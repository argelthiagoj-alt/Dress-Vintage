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
      const firstSize = p.sizes.find(s => s.stock > 0)?.s || "M";
      addToCart(p, firstSize);
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
        {OUTFITS.map((o, idx) => {
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

function LoginPage({ go }) {
  const [mode, setMode] = usS("login");
  const onSubmit = (e) => {
    e.preventDefault();
    alert(mode === "login" ? "Sesión iniciada (demo)" : "Cuenta creada (demo)");
    go("home");
  };
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
          <input type="email" placeholder="tu@email.com" required />
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
      </form>
    </main>
  );
}

/* ============================================
   CHECKOUT
   ============================================ */

function CheckoutPage({ go, cart, products_byId, clearCart }) {
  const [step, setStep] = usS(1);
  const lines = cart.map(c => ({ ...c, p: products_byId[c.id] })).filter(l => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const ship = subtotal >= 150000 ? 0 : 5800;
  const total = subtotal + ship;

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
        <div style={{display: "flex", gap: 24, fontFamily:"var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform:"uppercase"}}>
          {["Datos", "Envío", "Pago"].map((s, i) => (
            <div key={s} style={{display:"flex", alignItems:"center", gap: 8, opacity: step > i+1 ? 0.5 : 1, color: step === i+1 ? "var(--fg)" : "var(--mute)"}}>
              <span style={{display:"inline-block", width: 22, height: 22, border: "1px solid", borderColor: step >= i+1 ? "var(--fg)" : "var(--line-strong)", textAlign:"center", lineHeight: "22px", background: step > i+1 ? "var(--fg)" : "transparent", color: step > i+1 ? "var(--bg)" : "inherit"}}>
                {step > i+1 ? "✓" : i+1}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, paddingBottom: 96}}>
        <div>
          {step === 1 && (
            <div style={{display:"flex", flexDirection:"column", gap: 18}}>
              <h2 className="display" style={{fontSize: 32}}>Datos de contacto</h2>
              <div className="field auth-form-field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Email</label>
                <input type="email" placeholder="tu@email.com" style={{padding: "12px 0", border:"none", borderBottom: "1px solid var(--line-strong)", background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
              </div>
              <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Nombre completo</label>
                <input type="text" placeholder="Nombre y apellido" style={{padding: "12px 0", border:"none", borderBottom: "1px solid var(--line-strong)", background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
              </div>
              <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Teléfono</label>
                <input type="tel" placeholder="+54 9 11 ..." style={{padding: "12px 0", border:"none", borderBottom: "1px solid var(--line-strong)", background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
              </div>
              <button className="btn lg" onClick={() => setStep(2)} style={{alignSelf:"flex-start", marginTop: 16}}>
                Continuar al envío <span className="btn-arrow">→</span>
              </button>
            </div>
          )}
          {step === 2 && (
            <div style={{display:"flex", flexDirection:"column", gap: 18}}>
              <h2 className="display" style={{fontSize: 32}}>Envío</h2>
              <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Dirección</label>
                <input type="text" placeholder="Calle y número" style={{padding: "12px 0", border:"none", borderBottom: "1px solid var(--line-strong)", background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 16}}>
                <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                  <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Ciudad</label>
                  <input type="text" placeholder="CABA, Mar del Plata..." style={{padding: "12px 0", border:"none", borderBottom: "1px solid var(--line-strong)", background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                </div>
                <div className="field" style={{display:"flex", flexDirection:"column", gap: 6}}>
                  <label className="mono" style={{fontSize: 10, letterSpacing:"0.16em", color: "var(--mute)"}}>Código postal</label>
                  <input type="text" placeholder="C1428" style={{padding: "12px 0", border:"none", borderBottom: "1px solid var(--line-strong)", background:"transparent", fontSize: 15, outline:"none", color: "var(--fg)"}}/>
                </div>
              </div>
              <div style={{marginTop: 12, display:"flex", flexDirection:"column", gap: 8}}>
                {[
                  { id: "domicilio", n: "Envío a domicilio", d: "1-3 días hábiles · Andreani", p: ship },
                  { id: "sucursal",  n: "Retiro en sucursal", d: "Correo Argentino", p: 3400 },
                  { id: "taller",    n: "Retiro en taller", d: "Av. F. Lacroze 3500 · sin costo", p: 0 },
                ].map((opt, i) => (
                  <label key={opt.id} style={{display:"grid", gridTemplateColumns:"22px 1fr auto", gap: 12, padding: 14, border:"1px solid var(--line)", alignItems:"center", cursor:"pointer"}}>
                    <input type="radio" name="ship" defaultChecked={i===0} />
                    <div>
                      <div style={{fontSize: 14, fontVariationSettings: '"wght" 500'}}>{opt.n}</div>
                      <div className="mono" style={{color:"var(--mute)", fontSize: 10, letterSpacing:"0.14em"}}>{opt.d}</div>
                    </div>
                    <div className="mono">{opt.p === 0 ? "Gratis" : fmt(opt.p)}</div>
                  </label>
                ))}
              </div>
              <div style={{display:"flex", gap: 12, marginTop: 16}}>
                <button className="btn ghost" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn lg" onClick={() => setStep(3)}>Continuar al pago <span className="btn-arrow">→</span></button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{display:"flex", flexDirection:"column", gap: 18}}>
              <h2 className="display" style={{fontSize: 32}}>Pago</h2>
              <div style={{display:"flex", flexDirection:"column", gap: 8}}>
                {[
                  { id: "mp",   n: "Mercado Pago", d: "Tarjeta · hasta 6 cuotas sin interés", e: "MP" },
                  { id: "tx",   n: "Transferencia bancaria", d: "10% off · CBU envíado por mail", e: "★" },
                  { id: "cash", n: "Efectivo en taller", d: "Pago al retirar", e: "$" },
                ].map((opt, i) => (
                  <label key={opt.id} style={{display:"grid", gridTemplateColumns:"22px 1fr auto", gap: 12, padding: 14, border:"1px solid var(--line)", alignItems:"center", cursor:"pointer"}}>
                    <input type="radio" name="pay" defaultChecked={i===0} />
                    <div>
                      <div style={{fontSize: 14, fontVariationSettings: '"wght" 500'}}>{opt.n}</div>
                      <div className="mono" style={{color:"var(--mute)", fontSize: 10, letterSpacing:"0.14em"}}>{opt.d}</div>
                    </div>
                    <div className="mono" style={{fontSize: 14}}>{opt.e}</div>
                  </label>
                ))}
              </div>
              <div style={{display:"flex", gap: 12, marginTop: 16}}>
                <button className="btn ghost" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn lg" onClick={() => { alert("¡Compra realizada! (demo)"); clearCart(); go("home"); }}>
                  Pagar {fmt(total)} <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <aside style={{position:"sticky", top: 120, alignSelf:"start", border: "1px solid var(--line)", padding: 24}}>
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

window.OutfitsPage = OutfitsPage;
window.AboutPage = AboutPage;
window.FaqPage = FaqPage;
window.LoginPage = LoginPage;
window.CheckoutPage = CheckoutPage;
