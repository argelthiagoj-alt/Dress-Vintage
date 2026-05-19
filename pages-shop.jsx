// ============================================
// DRESSVINTAGE — pages
// ============================================

const { useState: uS, useEffect: uE, useMemo: uM, useRef: uR } = React;

/* ============================================
   HOME
   ============================================ */

function HomePage({ go, addToCart, wishlist, toggleWish }) {
  useReveal();
  const byId = uM(() => Object.fromEntries(PRODUCTS.map(p => [p.id, p])), []);
  const featured = uM(() => PRODUCTS.filter(p => p.isNew || p.isSale).slice(0, 4), []);
  const newDrop  = uM(() => PRODUCTS.filter(p => p.isNew), []);

  return (
    <main className="page-trans">
      {/* HERO */}
      <section className="hero">
        <div className="hero-stage">
          <div className="hero-media">
            <img src={R("heroImg", "assets/hero.png")} alt="DressVintage — Capítulo 03" className="hero-img" />
            <div className="hero-tag">
              <span>● LOOKBOOK</span>
              <span>CAP 03 / SHOT 01</span>
            </div>
          </div>
          <div className="hero-text">
            <div className="hero-rotator">
              <CircleType />
              <div className="pin">EST·24</div>
            </div>

            <div>
              <div className="eyebrow" style={{marginBottom: 20}}>
                Capítulo 03 · OTOÑO 2026 · Drop limitado
              </div>
              <h1 className="display hero-title">
                <span className="line"><span>RUIDO</span></span>
                <span className="line"><span>CONTENIDO,</span></span>
                <span className="line"><span>FORMA NUEVA.</span></span>
              </h1>
            </div>

            <div className="hero-meta">
              <div className="col">
                <div className="eyebrow">Coordenadas</div>
                <p>34.6°S · 58.4°O — Una marca de ropa vintage moderna nacida en Buenos Aires.</p>
                <button
                  className="btn"
                  style={{alignSelf: "flex-start", marginTop: 14}}
                  onClick={() => go("catalog:all")}
                >
                  Ver el drop <span className="btn-arrow">→</span>
                </button>
              </div>
              <div className="col" style={{alignItems: "flex-end", textAlign: "right"}}>
                <div className="eyebrow">Edición</div>
                <p style={{textAlign:"right"}}>14 piezas · 5 capítulos · stock numerado</p>
                <button
                  className="btn ghost"
                  style={{alignSelf: "flex-end", marginTop: 14}}
                  onClick={() => go("outfits")}
                >
                  Outfits curados <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="cat-strip bleed">
        <div className="shell" style={{paddingBlock: "32px 16px"}}>
          <div className="section-head" style={{marginBottom: 24}}>
            <h2 className="reveal">Categorías</h2>
            <div className="right reveal">
              <div className="eyebrow">Index · 06</div>
              <p>Línea base de armado: empieza por una prenda y construye desde ahí.</p>
            </div>
          </div>
        </div>
        <div className="cat-grid bleed">
          {CATEGORIES.map((c, i) => (
            <div key={c.id} className="cat-card reveal" onClick={() => go(`catalog:${c.id}`)} style={{transitionDelay: `${i*60}ms`}}>
              {c.img
                ? <img src={c.img} alt={c.name} className="cat-img" style={c.objectPosition ? {objectPosition: c.objectPosition} : undefined} />
                : <Ph label={c.label} dark={i % 2 === 0} />
              }
              <div className="label">
                <span className="num">0{i+1} / 06</span>
                <span className="name">{c.name}</span>
              </div>
              <div className="arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW DROP */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <div className="eyebrow reveal" style={{marginBottom: 12}}>Capítulo 03 · 08 piezas</div>
              <h2 className="reveal">Nuevo<br/><span style={{WebkitTextStroke: "1.5px var(--fg)", color: "transparent", fontStyle:"italic"}}>drop</span></h2>
            </div>
            <div className="right reveal">
              <p>Las primeras 24 horas: stock limitado, sin reposición. Lo que se va, se va.</p>
              <button className="btn ghost" onClick={() => go("catalog:all")}>Ver todo <span className="btn-arrow">→</span></button>
            </div>
          </div>
          <div className="products reveal">
            {newDrop.map(p => (
              <ProductCard key={p.id} product={p} go={go} onQuickAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="editorial">
        <div className="ed-media">
          <img src={R("manifestoImg", "assets/manifesto.png")} alt="Manifesto DressVintage" className="ed-img" />
          <div className="ed-tag">
            <span>● MANIFESTO</span>
            <span>CAP 03 / SHOT 04</span>
          </div>
        </div>
        <div className="ed-text reveal">
          <div className="eyebrow">Manifesto</div>
          <h3>
            Lo viejo<br/>vuelve.<br/>
            <span style={{WebkitTextStroke: "1.5px var(--fg)", color: "transparent", fontStyle:"italic"}}>Mejor.</span>
          </h3>
          <p>
            DressVintage es una tienda de ropa urbana con vocación vintage moderna.
            Tiradas cortas, telas pesadas, cortes amplios. Cada drop es una sola idea
            ejecutada en 6 a 12 prendas.
          </p>
          <div style={{display: "flex", gap: 12, marginTop: 8}}>
            <button className="btn" onClick={() => go("about")}>Nuestra historia <span className="btn-arrow">→</span></button>
            <button className="btn ghost" onClick={() => go("outfits")}>Ver outfits</button>
          </div>
        </div>
      </section>

      {/* OUTFITS PREVIEW */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <div className="eyebrow reveal" style={{marginBottom: 12}}>Curaduría del staff</div>
              <h2 className="reveal">Outfits<br/>completos.</h2>
            </div>
            <div className="right reveal">
              <p>Tres prendas, una idea. Comprá todo el outfit junto y ahorrás hasta 18%.</p>
              <button className="btn ghost" onClick={() => go("outfits")}>Ver todos <span className="btn-arrow">→</span></button>
            </div>
          </div>
          <div className="products cols-3 reveal">
            {OUTFITS.map((o, i) => {
              const items = o.items.map(id => byId[id]).filter(Boolean);
              const sum   = items.reduce((s, p) => s + p.price, 0);
              const final = Math.round(sum * (1 - o.discount));
              return (
                <div key={o.id} className="product" onClick={() => go("outfits")}>
                  <div className="product-media">
                    <div className="product-badges">
                      <span className="badge sale">Outfit −{Math.round(o.discount*100)}%</span>
                    </div>
                    {o.img
                      ? <img src={o.img} alt={o.name} className="outfit-thumb main" />
                      : <Ph label={`OUTFIT · 0${i+1}`} dark={i % 2 === 1} className="main" />
                    }
                  </div>
                  <div className="product-meta">
                    <div>
                      <div className="product-cat">{items.length} prendas</div>
                      <div className="product-name">{o.name}</div>
                    </div>
                    <div className="product-price">
                      <span className="strike">{fmt(sum)}</span>
                      <span className="now sale">{fmt(final)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SALE STRIP */}
      {PRODUCTS.some(x => x.isSale) && (
        <section className="section" style={{borderBottom: "none", paddingTop: 0}}>
          <div className="shell">
            <div className="section-head">
              <div>
                <div className="eyebrow reveal" style={{marginBottom: 12, color:"var(--accent)"}}>● ON SALE</div>
                <h2 className="reveal">Últimas<br/>oportunidades.</h2>
              </div>
              <div className="right reveal">
                <p>Drops anteriores en liquidación. Precios fijos hasta agotar stock.</p>
                <button className="btn" onClick={() => go("catalog:sale")} style={{background: "var(--accent)", borderColor: "var(--accent)"}}>Ver SALE <span className="btn-arrow">→</span></button>
              </div>
            </div>
            <div className="products reveal">
              {PRODUCTS.filter(p => p.isSale).slice(0,4).map(p => (
                <ProductCard key={p.id} product={p} go={go} onQuickAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ============================================
   CATALOG
   ============================================ */

function CatalogPage({ catSlug, go, addToCart, wishlist, toggleWish }) {
  useReveal();
  const isSale = catSlug === "sale";
  const isAll  = catSlug === "all";
  const cat = CATEGORIES.find(c => c.id === catSlug);
  const title = isSale ? "On Sale" : isAll ? "Toda la tienda" : (cat?.name || "Tienda");

  const [sortBy, setSortBy] = uS("featured");
  const [sizeF, setSizeF] = uS([]);
  const [colorF, setColorF] = uS([]);
  const [priceMax, setPriceMax] = uS(150000);
  const [showOnly, setShowOnly] = uS(null); // 'new'|'sale'|'low'|null

  const filtered = uM(() => {
    let list = PRODUCTS.filter(p => {
      if (isSale) return p.isSale;
      if (isAll)  return true;
      return p.cat === catSlug;
    });
    if (showOnly === "new")  list = list.filter(p => p.isNew);
    if (showOnly === "sale") list = list.filter(p => p.isSale);
    if (showOnly === "low")  list = list.filter(p => p.lowStock);
    if (sizeF.length)  list = list.filter(p => p.sizes.some(s => sizeF.includes(s.s) && s.stock > 0));
    if (colorF.length) list = list.filter(p => p.colorIds.some(c => colorF.includes(c)));
    list = list.filter(p => p.price <= priceMax);

    if (sortBy === "price-asc")  list = [...list].sort((a,b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a,b) => b.price - a.price);
    if (sortBy === "new")        list = [...list].sort((a,b) => (b.isNew?1:0) - (a.isNew?1:0));
    return list;
  }, [catSlug, sortBy, sizeF, colorF, priceMax, showOnly, isSale, isAll]);

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  return (
    <main className="shell page-trans">
      <div className="catalog-head">
        <div>
          <div className="crumbs eyebrow">
            <span onClick={() => go("home")} style={{cursor: "pointer"}}>Inicio</span>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1>{title}</h1>
          <div className="count" style={{marginTop: 10}}>{filtered.length} piezas</div>
        </div>
        <p style={{maxWidth: 360, color: "var(--mute)", fontSize: 14, lineHeight: 1.6}}>
          Cada prenda viene con guía de medidas en cm y ficha de tela. Stock real, sin reservas. Filtros a la izquierda.
        </p>
      </div>

      <div className="catalog-body">
        <aside className="filters">
          <div className="filter-block">
            <h6>Mostrar</h6>
            <ul>
              {[{id:null,n:"Todo"},{id:"new",n:"Nuevos"},{id:"sale",n:"En oferta"},{id:"low",n:"Últimas unidades"}].map(o => (
                <li key={o.id||"all"} className={showOnly===o.id?"active":""} onClick={() => setShowOnly(o.id)}>
                  <span>{o.n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-block">
            <h6>Categoría</h6>
            <ul>
              <li className={isAll?"active":""} onClick={() => go("catalog:all")}><span>Todas</span><span className="mono">{PRODUCTS.length}</span></li>
              {CATEGORIES.map(c => (
                <li key={c.id} className={catSlug===c.id?"active":""} onClick={() => go(`catalog:${c.id}`)}>
                  <span>{c.name}</span><span className="mono">{PRODUCTS.filter(p=>p.cat===c.id).length}</span>
                </li>
              ))}
              <li className={isSale?"active":""} onClick={() => go("catalog:sale")} style={{color: "var(--accent)"}}>
                <span>SALE</span><span className="mono">{PRODUCTS.filter(p=>p.isSale).length}</span>
              </li>
            </ul>
          </div>
          <div className="filter-block">
            <h6>Talle</h6>
            <div className="size-chips">
              {SIZES.map(s => (
                <button key={s} className={sizeF.includes(s)?"on":""} onClick={() => toggle(sizeF, setSizeF, s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="filter-block">
            <h6>Color</h6>
            <div className="size-chips">
              {COLORS.map(c => (
                <button key={c.id} className={colorF.includes(c.id)?"on":""} onClick={() => toggle(colorF, setColorF, c.id)} style={{padding:"0 10px"}}>
                  <span style={{display:"inline-block", width: 10, height: 10, borderRadius: "50%", background: c.hex, border: "1px solid var(--line-strong)", marginRight: 8, verticalAlign:"middle"}}/>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-block">
            <h6>Precio máx.</h6>
            <div className="range">
              <span>{fmt(20000)}</span>
              <input type="range" min={20000} max={200000} step={5000} value={priceMax} onChange={(e) => setPriceMax(+e.target.value)} />
              <span>{fmt(priceMax)}</span>
            </div>
          </div>
        </aside>

        <div>
          <div className="toolbar">
            <div className="sort">
              <span style={{color:"var(--mute)"}}>Filtros activos:</span>
              <span>{(sizeF.length + colorF.length + (showOnly?1:0)) || 0}</span>
              {(sizeF.length || colorF.length || showOnly) ? (
                <button onClick={() => { setSizeF([]); setColorF([]); setShowOnly(null); setPriceMax(150000);}}>Limpiar</button>
              ) : null}
            </div>
            <div className="sort">
              <span>Ordenar:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Destacados</option>
                <option value="new">Nuevos</option>
                <option value="price-asc">Precio · menor a mayor</option>
                <option value="price-desc">Precio · mayor a menor</option>
              </select>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{padding: "80px 0", textAlign: "center", color: "var(--mute)"}}>
              <div className="display" style={{fontSize: 48, marginBottom: 12}}>Sin resultados</div>
              <p>Probá ajustando los filtros.</p>
            </div>
          ) : (
            <div className="products">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} go={go} onQuickAdd={addToCart} wished={wishlist.includes(p.id)} onWish={toggleWish} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ============================================
   PRODUCT DETAIL
   ============================================ */

function ProductPage({ productId, go, addToCart, wishlist, toggleWish }) {
  const p = PRODUCTS.find(x => x.id === productId);
  const [size, setSize] = uS(null);
  const [color, setColor] = uS(p?.colorIds[0]);
  const [added, setAdded] = uS(false);
  useReveal();
  uE(() => { window.scrollTo(0, 0); }, [productId]);

  if (!p) {
    return (
      <main className="shell" style={{padding: "120px 0"}}>
        <h1 className="display" style={{fontSize: 64}}>404</h1>
        <p>No encontramos ese producto.</p>
      </main>
    );
  }

  const related = (() => {
    let list = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id);
    if (list.length < 4) {
      const fill = PRODUCTS.filter(x => x.id !== p.id && !list.includes(x)).slice(0, 4 - list.length);
      list = [...list, ...fill];
    }
    return list.slice(0, 4);
  })();
  const onAdd = () => {
    if (p.oos) return;
    if (!size) return alert("Elegí un talle");
    addToCart(p, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const wished = wishlist.includes(p.id);

  return (
    <main className="shell page-trans">
      <div className="crumbs eyebrow" style={{padding: "32px 0 0", display:"flex", gap: 8}}>
        <span onClick={() => go("home")} style={{cursor: "pointer"}}>Inicio</span>
        <span>/</span>
        <span onClick={() => go(`catalog:${p.cat}`)} style={{cursor: "pointer"}}>{p.cat}</span>
        <span>/</span>
        <span>{p.code}</span>
      </div>
      <div className="product-page">
        <div className="gallery">
          <div className="gallery-main">
            {p.img
              ? <img src={p.img} alt={p.name} className="prod-img-main" />
              : <Ph label={`${p.code} · front`} />}
            {p.oos && (
              <div className="oos-overlay">
                <span>Agotado</span>
              </div>
            )}
          </div>
          {p.img && (
            <div className="gallery-detail">
              <img src={p.img} alt={`${p.name} detalle`} className="prod-img-zoom" />
              <div className="gallery-tag">● {p.code} · DETALLE</div>
            </div>
          )}
        </div>
        <aside className="p-info">
          <div className="eyebrow">{p.code} · {p.cat}</div>
          <h1>{p.name}</h1>
          <div className="px">
            {p.was && <span className="strike">{fmt(p.was)}</span>}
            <span style={{color: p.isSale ? "var(--accent)" : "inherit"}}>{fmt(p.price)}</span>
            {p.isSale && <span className="mono" style={{marginLeft: 10, color:"var(--accent)"}}>−{Math.round((1-p.price/p.was)*100)}%</span>}
            {p.oos && <span className="mono" style={{marginLeft: 10, color:"var(--accent)"}}>● Agotado</span>}
          </div>
          <p className="desc">{p.desc || "Pieza pensada para layering. Corte oversize, hombros caídos. Tirada corta."}</p>

          <div>
            <div className="label"><span>Color · {COLORS.find(c=>c.id===color)?.name}</span></div>
            <div className="colors">
              {p.colorIds.map(cid => {
                const c = COLORS.find(x => x.id === cid);
                return (
                  <button
                    key={cid}
                    className={color===cid?"on":""}
                    onClick={() => setColor(cid)}
                    style={{background: c.hex}}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <div className="label">
              <span>Talle</span>
              <span style={{cursor:"pointer", textDecoration: "underline"}}>Guía de talles</span>
            </div>
            <div className="sizes-row">
              {p.sizes.map(s => (
                <button
                  key={s.s}
                  className={`${size===s.s?"on":""} ${s.stock===0?"oos":""}`}
                  disabled={s.stock===0}
                  onClick={() => s.stock>0 && setSize(s.s)}
                >
                  {s.s}
                </button>
              ))}
            </div>
            {size && (
              <div className="mono" style={{marginTop: 10, color: "var(--mute)"}}>
                {p.sizes.find(s => s.s === size).stock <= 5
                  ? <>● Quedan {p.sizes.find(s => s.s === size).stock} unidades</>
                  : <>● Stock disponible</>
                }
              </div>
            )}
          </div>

          <div style={{display:"flex", gap: 8, marginTop: 12}}>
            <button className="btn block lg" onClick={onAdd} disabled={added || p.oos}>
              {p.oos
                ? "Sin stock — avisame cuando vuelva"
                : added
                  ? "✓ Agregado a tu bolsa"
                  : <>Agregar a la bolsa <span className="btn-arrow">→</span></>}
            </button>
            <button
              className="btn ghost"
              onClick={() => toggleWish(p.id)}
              aria-label="Wishlist"
              style={{padding: "0 18px"}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished?"currentColor":"none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          <div className="p-acc">
            <details open>
              <summary>Descripción · Detalles</summary>
              <p>{p.desc || `${p.name}. Una pieza pensada para layering. Tirada corta.`}</p>
              {p.measures && (
                <table className="measures">
                  <thead><tr><th>Talle</th><th>Ancho × Largo (cm)</th></tr></thead>
                  <tbody>
                    {Object.entries(p.measures).map(([k, v]) => (
                      <tr key={k}><td>{k}</td><td>{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </details>
            <details>
              <summary>Composición</summary>
              <p>{p.composition || "100% algodón peinado · 320 g/m². Origen Argentina. Confección local."}</p>
            </details>
            <details>
              <summary>Envíos y cambios</summary>
              <p>
                Envío gratis a partir de $150.000. CABA en 1-3 días hábiles, resto del país 3-7 días.
                Cambios dentro de 15 días desde la entrega, sin uso.
              </p>
            </details>
            <details>
              <summary>Cuidado</summary>
              <p>Lavar en frío, ciclo suave. Secar a la sombra. No usar lavandina.</p>
            </details>
          </div>
        </aside>
      </div>

      {/* RELATED */}
      <section className="section" style={{borderTop: "1px solid var(--line)", borderBottom: "none"}}>
        <div className="section-head">
          <h2 className="reveal" style={{fontSize: "clamp(32px, 4vw, 56px)"}}>Te puede gustar</h2>
        </div>
        <div className="products reveal">
          {related.map(rp => (
            <ProductCard key={rp.id} product={rp} go={go} onQuickAdd={(pp, s) => addToCart(pp, s)} wished={wishlist.includes(rp.id)} onWish={toggleWish} />
          ))}
        </div>
      </section>
    </main>
  );
}

window.HomePage = HomePage;
window.CatalogPage = CatalogPage;
window.ProductPage = ProductPage;
