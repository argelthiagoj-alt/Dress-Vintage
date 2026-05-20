// ============================================
// DRESSVINTAGE — admin panel pages
// ============================================
// AdminPanel dispatches by route; AdminLayout wraps every admin screen.
// All mutations go through Store / UserStore so the persistence boundary stays clean.

const { useState: adS, useMemo: adM, useEffect: adE } = React;

// ============================================
// LAYOUT
// ============================================
function AdminLayout({ user, route, go, logout, children }) {
  const navItems = [
    { id: "admin",          label: "Resumen",   match: r => r === "admin",                       perm: () => Perms.canAccessAdmin(user) },
    { id: "admin:orders",   label: "Pedidos",   match: r => r.startsWith("admin:orders") || r.startsWith("admin:order:"), perm: () => Perms.canManageOrders(user) },
    { id: "admin:products", label: "Productos", match: r => r.startsWith("admin:products"),       perm: () => Perms.canManageProducts(user) },
    { id: "admin:outfits",  label: "Outfits",   match: r => r.startsWith("admin:outfits"),        perm: () => Perms.canManageOutfits(user) },
    { id: "admin:landing",  label: "Landing",   match: r => r === "admin:landing",                perm: () => Perms.canManageLanding(user) },
    { id: "admin:users",    label: "Usuarios",  match: r => r === "admin:users",                  perm: () => Perms.canManageUsers(user) },
  ].filter(it => it.perm());

  return (
    <div className="admin-layout">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-head">
          <div className="eyebrow" style={{marginBottom: 6}}>DV / Admin</div>
          <div className="adm-userline">
            <span>{user.name}</span>
            <span className={`role-pill role-${user.role}`}>{ROLE_LABELS[user.role]}</span>
          </div>
        </div>
        <nav className="adm-nav">
          {navItems.map(it => (
            <button
              key={it.id}
              className={it.match(route) ? "on" : ""}
              onClick={() => go(it.id)}
            >
              {it.label}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <button className="adm-link" onClick={() => go("home")}>← Volver al sitio</button>
          <button className="adm-link" onClick={() => { logout(); go("home"); }}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="adm-content">{children}</main>
    </div>
  );
}

// ============================================
// PERMISSION DENIED
// ============================================
function AdminDenied({ reason, go }) {
  return (
    <main className="shell page-trans" style={{padding: "120px 0", textAlign: "center"}}>
      <div className="eyebrow" style={{marginBottom: 16}}>Acceso restringido</div>
      <h1 className="display" style={{fontSize: "clamp(40px, 7vw, 88px)"}}>{reason}</h1>
      <p style={{color: "var(--mute)", marginTop: 16, marginBottom: 32}}>
        Iniciá sesión con una cuenta autorizada para acceder a esta sección.
      </p>
      <div style={{display:"flex", gap: 12, justifyContent:"center"}}>
        <button className="btn" onClick={() => go("login")}>Iniciar sesión <span className="btn-arrow">→</span></button>
        <button className="btn ghost" onClick={() => go("home")}>Volver al inicio</button>
      </div>
    </main>
  );
}

// ============================================
// DASHBOARD
// ============================================
function AdminDashboard({ user, go }) {
  const totalStock = PRODUCTS.reduce((s, p) => s + (p.totalStock || 0), 0);
  const lowStock = PRODUCTS.filter(p => p.lowStock).length;
  const oos = PRODUCTS.filter(p => p.oos).length;
  const onSale = PRODUCTS.filter(p => p.isSale).length;
  const users = UserStore.list();
  const sales = OrdersStore.totals();
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <div className="eyebrow">Panel · {ROLE_LABELS[user.role]}</div>
          <h1 className="display" style={{fontSize: "clamp(32px, 5vw, 56px)"}}>Resumen</h1>
        </div>
      </div>

      {/* SALES & REVENUE */}
      <div className="adm-section-label">
        <span className="eyebrow">● Ventas e ingresos</span>
        <span className="mono" style={{color:"var(--mute)"}}>actualizado en vivo</span>
      </div>
      <div className="adm-cards">
        <div className="adm-card">
          <div className="eyebrow">Ventas (total)</div>
          <div className="adm-card-num">{sales.count}</div>
          <div className="mono" style={{color: "var(--mute)"}}>órdenes completadas</div>
        </div>
        <div className="adm-card">
          <div className="eyebrow">Ingresos (total)</div>
          <div className="adm-card-num adm-card-num-money">{fmt(sales.revenue)}</div>
          <div className="mono" style={{color: "var(--mute)"}}>desde el inicio</div>
        </div>
        <div className="adm-card">
          <div className="eyebrow">Hoy</div>
          <div className="adm-card-num">{sales.todayCount}</div>
          <div className="mono" style={{color: "var(--mute)"}}>
            {fmt(sales.todayRevenue)} hoy
          </div>
        </div>
        <div className="adm-card">
          <div className="eyebrow">Últimos 30 días</div>
          <div className="adm-card-num adm-card-num-money">{fmt(sales.last30Revenue)}</div>
          <div className="mono" style={{color: "var(--mute)"}}>
            {sales.last30Count} órdenes
          </div>
        </div>
      </div>

      {/* CATALOG OVERVIEW */}
      <div className="adm-section-label" style={{marginTop: 8}}>
        <span className="eyebrow">● Catálogo</span>
      </div>
      <div className="adm-cards">
        <div className="adm-card" onClick={() => go("admin:products")}>
          <div className="eyebrow">Productos</div>
          <div className="adm-card-num">{PRODUCTS.length}</div>
          <div className="mono" style={{color: "var(--mute)"}}>
            {oos} agotados · {lowStock} con poco stock · {onSale} en sale
          </div>
        </div>
        <div className="adm-card">
          <div className="eyebrow">Stock total</div>
          <div className="adm-card-num">{totalStock}</div>
          <div className="mono" style={{color: "var(--mute)"}}>unidades disponibles</div>
        </div>
        {Perms.canManageOutfits(user) && (
          <div className="adm-card" onClick={() => go("admin:outfits")}>
            <div className="eyebrow">Outfits</div>
            <div className="adm-card-num">{OUTFITS.length}</div>
            <div className="mono" style={{color: "var(--mute)"}}>
              {OUTFITS.filter(o => o.active).length} activos
            </div>
          </div>
        )}
        {Perms.canManageUsers(user) && (
          <div className="adm-card" onClick={() => go("admin:users")}>
            <div className="eyebrow">Usuarios</div>
            <div className="adm-card-num">{users.length}</div>
            <div className="mono" style={{color: "var(--mute)"}}>
              {users.filter(u => u.status === "banned").length} baneados
            </div>
          </div>
        )}
      </div>

      <div className="adm-callout" style={{marginTop: 24}}>
        <div className="eyebrow">Datos en localStorage</div>
        <p style={{color:"var(--mute)", marginTop: 4}}>
          Las ediciones se guardan en el navegador. Cuando conectes una base de datos real,
          solo hay que reemplazar el cuerpo de <code>Store</code>, <code>UserStore</code> y <code>OrdersStore</code>.
        </p>
      </div>
    </div>
  );
}

// ============================================
// PRODUCTS LIST
// ============================================
function AdminProducts({ go, refreshData }) {
  const [q, setQ] = adS("");
  const filtered = PRODUCTS.filter(p => {
    if (!q) return true;
    const s = q.toLowerCase();
    return p.name.toLowerCase().includes(s) ||
           (p.code || "").toLowerCase().includes(s) ||
           (p.slug || "").toLowerCase().includes(s);
  });
  const onDelete = (p) => {
    if (!confirm(`Eliminar "${p.name}"?\n\nEsta acción persiste en localStorage.`)) return;
    const raw = Store.loadProductsRaw().filter(x => x.id !== p.id);
    Store.saveProducts(raw);
    refreshData();
  };
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>Productos</h1>
          <div className="mono" style={{color:"var(--mute)"}}>{filtered.length} mostrados · {PRODUCTS.length} totales</div>
        </div>
        <div className="adm-page-actions">
          <input
            className="adm-input"
            placeholder="Buscar por nombre, código o slug…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button className="btn" onClick={() => go("admin:products:new")}>+ Nuevo producto</button>
        </div>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Variantes</th>
              <th>Stock</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  {p.img
                    ? <img src={p.img} className="adm-thumb" alt="" />
                    : <div className="adm-thumb adm-thumb-empty" />}
                </td>
                <td>
                  <div style={{fontVariationSettings:'"wght" 500'}}>{p.name}</div>
                  <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>{p.code || p.slug || p.id}</div>
                </td>
                <td className="mono">{PRODUCT_TYPES[p.type]?.label || p.type}</td>
                <td className="mono">
                  {p.was && <span style={{color:"var(--mute)", textDecoration:"line-through", marginRight: 6}}>{fmt(p.was)}</span>}
                  {fmt(p.price)}
                  {p.isSale && <span className="role-pill role-sale" style={{marginLeft: 8}}>−{p.discountPercent}%</span>}
                </td>
                <td className="mono">{p.variants?.length || 0}</td>
                <td className="mono">{p.totalStock}</td>
                <td>
                  <div className="adm-pill-row">
                    {p.isNew && <span className="role-pill role-new">NEW</span>}
                    {p.lowStock && <span className="role-pill role-low">Poco</span>}
                    {p.oos && <span className="role-pill role-oos">Agotado</span>}
                  </div>
                </td>
                <td>
                  <div className="adm-actions">
                    <button className="adm-link" onClick={() => go(`admin:products:edit:${p.id}`)}>Editar</button>
                    <button className="adm-link adm-link-danger" onClick={() => onDelete(p)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// PRODUCT FORM (create + edit)
// ============================================
function AdminProductForm({ productId, go, refreshData }) {
  const existing = productId ? Store.loadProductsRaw().find(p => p.id === productId) : null;
  const isEdit = !!existing;
  const emptyProduct = {
    id: "dv-" + Math.random().toString(36).slice(2, 8),
    slug: "",
    name: "",
    type: "remera",
    code: "",
    price: 0,
    originalPrice: null,
    tags: [],
    colorIds: [],
    variants: [],
    images: [""],
    imagesByColor: {},
    shortDescription: "",
    description: "",
    composition: "",
    care: "",
    measures: {},
    notes: "",
  };
  // Merge over empty defaults so optional fields (imagesByColor, measures, tags, etc.)
  // are always present and the form never crashes on undefined access.
  const [form, setForm] = adS(() => existing
    ? {
        ...emptyProduct,
        ...existing,
        tags:          existing.tags          || [],
        colorIds:      existing.colorIds      || [],
        variants:      existing.variants      || [],
        images:        (existing.images && existing.images.length) ? existing.images : [""],
        imagesByColor: existing.imagesByColor || {},
        measures:      existing.measures      || {},
      }
    : emptyProduct
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const rebuildVariants = (type, colorIds, prevVariants) => {
    const sizes = PRODUCT_TYPES[type]?.sizes || [];
    const out = [];
    colorIds.forEach(cid => {
      sizes.forEach(s => {
        const prev = prevVariants.find(v => v.colorId === cid && v.size === s);
        out.push({ colorId: cid, size: s, stock: prev?.stock ?? 0 });
      });
    });
    return out;
  };

  const setColors = (colorIds) => {
    setForm(f => {
      const ibc = {};
      colorIds.forEach(cid => { if (f.imagesByColor?.[cid]) ibc[cid] = f.imagesByColor[cid]; });
      return { ...f, colorIds, variants: rebuildVariants(f.type, colorIds, f.variants), imagesByColor: ibc };
    });
  };
  const setType = (type) => {
    setForm(f => ({ ...f, type, variants: rebuildVariants(type, f.colorIds, f.variants) }));
  };
  const setStock = (colorId, size, stock) => {
    setForm(f => ({
      ...f,
      variants: f.variants.map(v =>
        v.colorId === colorId && v.size === size
          ? { ...v, stock: Math.max(0, Number(stock) || 0) }
          : v
      ),
    }));
  };
  const setColorImage = (colorId, urls) => {
    // urls can be an array (from FilePicker) or a single string (legacy)
    setForm(f => ({ ...f, imagesByColor: { ...(f.imagesByColor || {}), [colorId]: urls } }));
  };
  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };
  const setMeasure = (size, val) => {
    setForm(f => ({ ...f, measures: { ...(f.measures || {}), [size]: val } }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("El nombre es obligatorio");
    if (!form.type) return alert("Elegí un tipo");
    if (form.colorIds.length === 0) return alert("Elegí al menos un color");
    if (!(Number(form.price) > 0)) return alert("Precio inválido");

    const clean = {
      ...form,
      slug: (form.slug || form.name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      price: Number(form.price),
      originalPrice: form.originalPrice && Number(form.originalPrice) > 0 ? Number(form.originalPrice) : null,
      images: (form.images || []).filter(x => x && (typeof x === "string") && x.trim()),
      imagesByColor: Object.fromEntries(
        Object.entries(form.imagesByColor || {})
          .map(([k, v]) => {
            // Normalize: store as array of non-empty strings
            const arr = Array.isArray(v) ? v : (v ? [v] : []);
            return [k, arr.filter(x => x && typeof x === "string" && x.trim())];
          })
          .filter(([, v]) => v.length > 0)
      ),
      measures: Object.fromEntries(
        Object.entries(form.measures || {}).filter(([, v]) => v && v.trim())
      ),
    };

    const raw = Store.loadProductsRaw();
    const i = raw.findIndex(p => p.id === clean.id);
    if (i >= 0) raw[i] = clean; else raw.push(clean);
    Store.saveProducts(raw);
    refreshData();
    go("admin:products");
  };

  const onDelete = () => {
    if (!confirm(`Eliminar "${form.name}"?`)) return;
    const raw = Store.loadProductsRaw().filter(p => p.id !== form.id);
    Store.saveProducts(raw);
    refreshData();
    go("admin:products");
  };

  const sizes = PRODUCT_TYPES[form.type]?.sizes || [];
  const isOnSale = form.originalPrice != null && Number(form.originalPrice) > Number(form.price);
  const discountPct = isOnSale
    ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
    : 0;

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <div className="eyebrow">
            <span style={{cursor:"pointer", textDecoration:"underline"}} onClick={() => go("admin:products")}>
              ← Productos
            </span>
          </div>
          <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h1>
        </div>
      </div>

      <form className="adm-form" onSubmit={onSubmit}>
        {/* BÁSICO */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">Información básica</div>
          <div className="adm-grid-2">
            <label className="adm-field">
              <span>Nombre *</span>
              <input value={form.name} onChange={e => set("name", e.target.value)} required />
            </label>
            <label className="adm-field">
              <span>Slug</span>
              <input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="se genera del nombre si vacío" />
            </label>
            <label className="adm-field">
              <span>Tipo *</span>
              <select value={form.type} onChange={e => setType(e.target.value)}>
                {Object.entries(PRODUCT_TYPES).map(([id, t]) => (
                  <option key={id} value={id}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="adm-field">
              <span>Código / SKU</span>
              <input value={form.code} onChange={e => set("code", e.target.value)} placeholder="DV/HO·001" />
            </label>
          </div>
        </div>

        {/* PRECIO */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">Precio y rebaja</div>
          <div className="adm-grid-2">
            <label className="adm-field">
              <span>Precio actual *</span>
              <input type="number" min="0" value={form.price} onChange={e => set("price", Number(e.target.value))} required />
            </label>
            <label className="adm-field">
              <span>Precio original (sin descuento)</span>
              <input
                type="number"
                min="0"
                value={form.originalPrice ?? ""}
                onChange={e => set("originalPrice", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="vacío = sin rebaja"
              />
            </label>
          </div>
          {isOnSale && (
            <div className="adm-callout">
              <span className="role-pill role-sale">SALE</span>
              <span className="mono" style={{marginLeft: 10}}>
                −{discountPct}% calculado automáticamente
              </span>
            </div>
          )}
          <div className="adm-tags" style={{marginTop: 12}}>
            <label className="adm-check">
              <input type="checkbox" checked={form.tags.includes("new")} onChange={() => toggleTag("new")} />
              <span>Marcar como NUEVO</span>
            </label>
          </div>
        </div>

        {/* COLORES */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">Colores</div>
          <div className="adm-color-grid">
            {COLOR_PALETTE.map(c => (
              <label
                key={c.id}
                className={`adm-color-chip ${form.colorIds.includes(c.id) ? "on" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={form.colorIds.includes(c.id)}
                  onChange={() => {
                    const next = form.colorIds.includes(c.id)
                      ? form.colorIds.filter(x => x !== c.id)
                      : [...form.colorIds, c.id];
                    setColors(next);
                  }}
                />
                <span className="swatch" style={{background: c.hex}} />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* IMAGENES */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">Imágenes del producto</div>
          <div className="adm-field">
            <span>Galería principal · arrastrá o tocá para subir</span>
            <FilePicker
              value={form.images || []}
              onChange={imgs => set("images", imgs)}
              multiple={true}
              label="Arrastrá hasta acá o tocá para elegir imágenes"
              hint="Se muestran como carrusel en la página del producto. La primera es la primaria."
            />
          </div>

          {form.colorIds.length > 0 && (
            <>
              <div className="mono" style={{color:"var(--mute)", fontSize: 11, margin: "16px 0 8px"}}>
                Imágenes por color (opcional · si está vacío usa la galería principal)
              </div>
              <div className="adm-stack">
                {form.colorIds.map(cid => {
                  const c = COLOR_PALETTE.find(x => x.id === cid);
                  const currentImgs = form.imagesByColor && form.imagesByColor[cid];
                  const valueArr = Array.isArray(currentImgs)
                    ? currentImgs
                    : (currentImgs ? [currentImgs] : []);
                  return (
                    <div key={cid} className="adm-color-images">
                      <div className="adm-color-images-head">
                        <span className="swatch" style={{background: c?.hex}} />
                        <span style={{fontVariationSettings:'"wght" 500'}}>{c?.name || cid}</span>
                        <span className="mono" style={{color:"var(--mute)", marginLeft: "auto", fontSize: 10}}>
                          {valueArr.length} imagen{valueArr.length === 1 ? "" : "es"}
                        </span>
                      </div>
                      <FilePicker
                        value={valueArr}
                        onChange={imgs => setColorImage(cid, imgs)}
                        multiple={true}
                        label={`Imágenes para ${c?.name || cid}`}
                        hint="Si subís acá, reemplazan la galería principal cuando elijas este color"
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* STOCK */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">Stock por talle y color</div>
          {form.colorIds.length === 0 ? (
            <div className="mono" style={{color:"var(--mute)"}}>
              Elegí al menos un color para configurar el stock.
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-variant-table">
                <thead>
                  <tr>
                    <th></th>
                    {sizes.map(s => <th key={s} className="mono">{s}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {form.colorIds.map(cid => {
                    const c = COLOR_PALETTE.find(x => x.id === cid);
                    return (
                      <tr key={cid}>
                        <th>
                          <span className="adm-row-label">
                            <span className="swatch" style={{background: c?.hex}} />
                            <span>{c?.name}</span>
                          </span>
                        </th>
                        {sizes.map(s => {
                          const v = form.variants.find(x => x.colorId === cid && x.size === s);
                          return (
                            <td key={s}>
                              <input
                                type="number"
                                min="0"
                                value={v?.stock ?? 0}
                                onChange={e => setStock(cid, s, e.target.value)}
                                className="adm-stock-input"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DESCRIPCIONES */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">Descripciones</div>
          <label className="adm-field">
            <span>Descripción corta</span>
            <input value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)} />
          </label>
          <label className="adm-field">
            <span>Descripción larga (opcional)</span>
            <textarea rows="4" value={form.description || ""} onChange={e => set("description", e.target.value)} />
          </label>
          <div className="adm-grid-2">
            <label className="adm-field">
              <span>Composición</span>
              <textarea rows="2" value={form.composition || ""} onChange={e => set("composition", e.target.value)} />
            </label>
            <label className="adm-field">
              <span>Cuidados</span>
              <textarea rows="2" value={form.care || ""} onChange={e => set("care", e.target.value)} />
            </label>
          </div>
          <label className="adm-field">
            <span>Notas internas (no se muestran en la web)</span>
            <textarea rows="2" value={form.notes || ""} onChange={e => set("notes", e.target.value)} />
          </label>
        </div>

        {/* MEDIDAS */}
        {sizes.length > 0 && form.colorIds.length > 0 && (
          <div className="adm-form-section">
            <div className="adm-form-section-title">Medidas por talle (opcional)</div>
            <div className="adm-stack">
              {sizes.map(s => (
                <label key={s} className="adm-row">
                  <span className="adm-row-label mono">{s}</span>
                  <input
                    value={form.measures[s] || ""}
                    onChange={e => setMeasure(s, e.target.value)}
                    placeholder="Ej: 68×62 (ancho × largo cm)"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ACCIONES */}
        <div className="adm-form-actions">
          <button type="button" className="btn ghost" onClick={() => go("admin:products")}>Cancelar</button>
          {isEdit && (
            <button type="button" className="adm-link adm-link-danger" onClick={onDelete} style={{marginRight: "auto"}}>
              Eliminar producto
            </button>
          )}
          <button type="submit" className="btn">{isEdit ? "Guardar cambios" : "Crear producto"}</button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// OUTFITS LIST (superadmin)
// ============================================
function AdminOutfits({ go, refreshData }) {
  const byId = adM(() => Object.fromEntries(PRODUCTS.map(p => [p.id, p])), []);
  const onDelete = (o) => {
    if (!confirm(`Eliminar outfit "${o.name}"?`)) return;
    const list = Store.loadOutfits().filter(x => x.id !== o.id);
    Store.saveOutfits(list);
    refreshData();
  };
  const toggleActive = (o) => {
    const list = Store.loadOutfits().map(x => x.id === o.id ? { ...x, active: !x.active } : x);
    Store.saveOutfits(list);
    refreshData();
  };
  const move = (o, dir) => {
    const list = [...Store.loadOutfits()].sort((a, b) => (a.order||0) - (b.order||0));
    const i = list.findIndex(x => x.id === o.id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    // Renumber
    list.forEach((x, k) => x.order = k + 1);
    Store.saveOutfits(list);
    refreshData();
  };

  const sorted = [...OUTFITS].sort((a, b) => (a.order||0) - (b.order||0));

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>Outfits</h1>
          <div className="mono" style={{color:"var(--mute)"}}>{sorted.length} outfits curados</div>
        </div>
        <div className="adm-page-actions">
          <button className="btn" onClick={() => go("admin:outfits:new")}>+ Nuevo outfit</button>
        </div>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Nombre</th>
              <th>Prendas</th>
              <th>Descuento</th>
              <th>Total estimado</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((o, i) => {
              const items = o.items.map(id => byId[id]).filter(Boolean);
              const sum = items.reduce((s, p) => s + p.price, 0);
              const final = Math.round(sum * (1 - (o.discount || 0)));
              const allOos = items.length > 0 && items.every(p => p.oos);
              return (
                <tr key={o.id}>
                  <td className="mono">
                    <div style={{display:"flex", flexDirection:"column", gap: 2}}>
                      <span>{o.order || (i+1)}</span>
                      <div style={{display:"flex", gap: 4}}>
                        <button className="adm-link" onClick={() => move(o, -1)} disabled={i === 0}>↑</button>
                        <button className="adm-link" onClick={() => move(o, +1)} disabled={i === sorted.length - 1}>↓</button>
                      </div>
                    </div>
                  </td>
                  <td>
                    {o.img
                      ? <img src={o.img} className="adm-thumb" alt="" />
                      : <div className="adm-thumb adm-thumb-empty" />}
                  </td>
                  <td>
                    <div style={{fontVariationSettings:'"wght" 500'}}>{o.name}</div>
                    <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>{o.id}</div>
                  </td>
                  <td className="mono">{items.length}</td>
                  <td className="mono">{Math.round((o.discount || 0) * 100)}%</td>
                  <td className="mono">
                    <div>{fmt(final)}</div>
                    <div style={{color:"var(--mute)", textDecoration:"line-through", fontSize: 10}}>{fmt(sum)}</div>
                  </td>
                  <td>
                    <div className="adm-pill-row">
                      <span className={`role-pill ${o.active ? "role-active" : "role-inactive"}`}>
                        {o.active ? "Activo" : "Inactivo"}
                      </span>
                      {allOos && <span className="role-pill role-oos">Sin stock</span>}
                    </div>
                  </td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-link" onClick={() => toggleActive(o)}>
                        {o.active ? "Desactivar" : "Activar"}
                      </button>
                      <button className="adm-link" onClick={() => go(`admin:outfits:edit:${o.id}`)}>Editar</button>
                      <button className="adm-link adm-link-danger" onClick={() => onDelete(o)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// OUTFIT FORM (superadmin)
// ============================================
function AdminOutfitForm({ outfitId, go, refreshData }) {
  const existing = outfitId ? Store.loadOutfits().find(o => o.id === outfitId) : null;
  const isEdit = !!existing;
  const byId = adM(() => Object.fromEntries(PRODUCTS.map(p => [p.id, p])), []);
  const empty = {
    id: "out-" + Math.random().toString(36).slice(2, 8),
    name: "",
    desc: "",
    items: [],
    discount: 0.15,
    img: "",
    active: true,
    order: (Store.loadOutfits().length || 0) + 1,
  };
  const [form, setForm] = adS(() => existing ? { ...existing, items: [...(existing.items || [])] } : empty);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Ordered item operations — the order of `items[]` is the visual order in the outfit.
  const addItem = (id) => {
    setForm(f => f.items.includes(id) ? f : { ...f, items: [...f.items, id] });
  };
  const removeItemAt = (idx) => {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };
  const moveItem = (idx, dir) => {
    setForm(f => {
      const j = idx + dir;
      if (j < 0 || j >= f.items.length) return f;
      const next = [...f.items];
      [next[idx], next[j]] = [next[j], next[idx]];
      return { ...f, items: next };
    });
  };

  const items = form.items.map(id => byId[id]).filter(Boolean);
  const sum = items.reduce((s, p) => s + p.price, 0);
  const final = Math.round(sum * (1 - (form.discount || 0)));
  const save = items.length ? sum - final : 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nombre obligatorio");
    if (form.items.length === 0) return alert("Elegí al menos una prenda");
    const list = Store.loadOutfits();
    const i = list.findIndex(o => o.id === form.id);
    if (i >= 0) list[i] = form;
    else list.push(form);
    Store.saveOutfits(list);
    refreshData();
    go("admin:outfits");
  };
  const onDelete = () => {
    if (!confirm("Eliminar outfit?")) return;
    Store.saveOutfits(Store.loadOutfits().filter(o => o.id !== form.id));
    refreshData();
    go("admin:outfits");
  };

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <div className="eyebrow">
            <span style={{cursor:"pointer", textDecoration:"underline"}} onClick={() => go("admin:outfits")}>
              ← Outfits
            </span>
          </div>
          <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>
            {isEdit ? "Editar outfit" : "Nuevo outfit"}
          </h1>
        </div>
      </div>
      <form className="adm-form" onSubmit={onSubmit}>
        <div className="adm-form-section">
          <div className="adm-form-section-title">Datos del outfit</div>
          <div className="adm-grid-2">
            <label className="adm-field">
              <span>Nombre *</span>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Capítulo 04 — Eco" required />
            </label>
            <label className="adm-field">
              <span>Descuento (0 a 1)</span>
              <input type="number" min="0" max="1" step="0.01" value={form.discount} onChange={e => set("discount", Number(e.target.value))} />
            </label>
            <label className="adm-field" style={{gridColumn:"1 / -1"}}>
              <span>Descripción</span>
              <textarea rows="3" value={form.desc} onChange={e => set("desc", e.target.value)} />
            </label>
            <label className="adm-field">
              <span>Orden (menor = primero)</span>
              <input type="number" min="1" value={form.order} onChange={e => set("order", Number(e.target.value))} />
            </label>
            <div className="adm-field" style={{gridColumn:"1 / -1"}}>
              <span>Imagen principal del outfit</span>
              <FilePicker
                value={form.img ? [form.img] : []}
                onChange={imgs => set("img", imgs[0] || "")}
                multiple={false}
                label="Arrastrá una imagen del outfit o tocá para elegir"
                hint="Una sola foto editorial · se muestra en la card del outfit"
              />
            </div>
          </div>
          <div className="adm-tags" style={{marginTop: 12}}>
            <label className="adm-check">
              <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} />
              <span>Outfit activo (visible en la web pública)</span>
            </label>
          </div>
        </div>

        {/* ORDERED SELECTION */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">
            Prendas en el outfit · orden visible ({form.items.length})
          </div>
          {form.items.length === 0 ? (
            <p className="mono" style={{color:"var(--mute)"}}>
              Sin prendas. Agregá desde el panel de abajo.
            </p>
          ) : (
            <div className="adm-ordered-list">
              {form.items.map((id, i) => {
                const p = byId[id];
                if (!p) {
                  return (
                    <div key={id + i} className="adm-ordered-row adm-ordered-row-missing">
                      <div className="mono adm-ordered-num">{i+1}</div>
                      <div className="adm-thumb adm-thumb-empty" />
                      <div className="adm-ordered-info">
                        <div className="mono" style={{color:"var(--accent)"}}>{id} (producto no existe)</div>
                      </div>
                      <div className="adm-ordered-actions">
                        <button type="button" className="adm-link adm-link-danger" onClick={() => removeItemAt(i)}>Quitar</button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={id} className="adm-ordered-row">
                    <div className="mono adm-ordered-num">{i+1}</div>
                    {p.img
                      ? <img src={p.img} className="adm-thumb" alt="" />
                      : <div className="adm-thumb adm-thumb-empty" />}
                    <div className="adm-ordered-info">
                      <div style={{fontVariationSettings:'"wght" 500'}}>{p.name}</div>
                      <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>
                        {PRODUCT_TYPES[p.type]?.label || p.type} · {fmt(p.price)}
                        {p.oos && <span style={{color:"var(--accent)"}}> · AGOTADO</span>}
                      </div>
                    </div>
                    <div className="adm-ordered-actions">
                      <button
                        type="button"
                        className="adm-link"
                        onClick={() => moveItem(i, -1)}
                        disabled={i === 0}
                        aria-label="Mover arriba"
                      >↑</button>
                      <button
                        type="button"
                        className="adm-link"
                        onClick={() => moveItem(i, +1)}
                        disabled={i === form.items.length - 1}
                        aria-label="Mover abajo"
                      >↓</button>
                      <button
                        type="button"
                        className="adm-link adm-link-danger"
                        onClick={() => removeItemAt(i)}
                      >Quitar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AVAILABLE TO ADD */}
        <div className="adm-form-section">
          <div className="adm-form-section-title">Agregar prendas</div>
          {(() => {
            const available = PRODUCTS.filter(p => !form.items.includes(p.id));
            if (available.length === 0) {
              return (
                <p className="mono" style={{color:"var(--mute)"}}>
                  Todos los productos ya están en este outfit.
                </p>
              );
            }
            return (
              <div className="adm-product-picker">
                {available.map(p => (
                  <button
                    type="button"
                    key={p.id}
                    className="adm-product-pick"
                    onClick={() => addItem(p.id)}
                    title="Agregar al outfit"
                  >
                    <div className="adm-pick-media">
                      {p.img ? <img src={p.img} alt="" /> : <div className="adm-thumb-empty" />}
                    </div>
                    <div className="adm-pick-info">
                      <div style={{fontSize: 13, fontVariationSettings:'"wght" 500'}}>{p.name}</div>
                      <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>
                        {PRODUCT_TYPES[p.type]?.label} · {fmt(p.price)}
                      </div>
                      {p.oos && <span className="role-pill role-oos">Agotado</span>}
                    </div>
                    <span className="adm-pick-add" aria-hidden="true">+</span>
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="adm-form-section">
          <div className="adm-form-section-title">Cálculo automático</div>
          <div className="adm-stack">
            <div className="adm-row"><span>Subtotal</span><span className="mono">{fmt(sum)}</span></div>
            <div className="adm-row"><span>Descuento ({Math.round((form.discount||0)*100)}%)</span><span className="mono" style={{color:"var(--accent)"}}>− {fmt(save)}</span></div>
            <div className="adm-row" style={{borderTop:"1px solid var(--fg)", paddingTop: 10, fontVariationSettings:'"wght" 600'}}>
              <span>Total outfit</span><span className="mono">{fmt(final)}</span>
            </div>
          </div>
        </div>

        <div className="adm-form-actions">
          <button type="button" className="btn ghost" onClick={() => go("admin:outfits")}>Cancelar</button>
          {isEdit && (
            <button type="button" className="adm-link adm-link-danger" onClick={onDelete} style={{marginRight:"auto"}}>
              Eliminar outfit
            </button>
          )}
          <button type="submit" className="btn">{isEdit ? "Guardar cambios" : "Crear outfit"}</button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// USERS (superadmin)
// ============================================
function AdminUsers({ user, refreshData }) {
  const [q, setQ] = adS("");
  const [version, setVersion] = adS(0);
  const reload = () => { setVersion(v => v + 1); refreshData(); };
  const users = adM(() => UserStore.list(), [version]);
  const filtered = users.filter(u => {
    if (!q) return true;
    const s = q.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
  });

  const setRole = (u, role) => {
    if (u.id === user.id && role !== ROLES.SUPERADMIN) {
      return alert("No podés quitarte tu propio rol de superadmin.");
    }
    UserStore.update(u.id, { role });
    reload();
  };
  const toggleBan = (u) => {
    if (u.id === user.id) {
      return alert("No podés banearte a vos mismo.");
    }
    UserStore.update(u.id, { status: u.status === "banned" ? "active" : "banned" });
    reload();
  };

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>Usuarios</h1>
          <div className="mono" style={{color:"var(--mute)"}}>
            {filtered.length} mostrados · {users.length} totales
          </div>
        </div>
        <div className="adm-page-actions">
          <input
            className="adm-input"
            placeholder="Buscar por nombre o email…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Creado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const self = u.id === user.id;
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{fontVariationSettings:'"wght" 500'}}>
                      {u.name} {self && <span className="mono" style={{color:"var(--mute)", fontSize: 10}}>(vos)</span>}
                    </div>
                    <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>{u.id}</div>
                  </td>
                  <td className="mono">{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => setRole(u, e.target.value)}
                      disabled={self}
                      className="adm-input"
                    >
                      {Object.entries(ROLE_LABELS).map(([id, label]) => (
                        <option key={id} value={id}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`role-pill role-${u.status === "banned" ? "oos" : "active"}`}>
                      {u.status === "banned" ? "Baneado" : "Activo"}
                    </span>
                  </td>
                  <td className="mono">{u.createdAt || "—"}</td>
                  <td>
                    <div className="adm-actions">
                      <button
                        className={`adm-link ${u.status === "banned" ? "" : "adm-link-danger"}`}
                        onClick={() => toggleBan(u)}
                        disabled={self}
                      >
                        {u.status === "banned" ? "Desbanear" : "Banear"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mono" style={{color:"var(--mute)", marginTop: 16, fontSize: 11}}>
        Un superadmin no puede banearse ni quitarse su propio rol.
      </p>
    </div>
  );
}

// ============================================
// ORDERS — admin list + detail (admin + superadmin)
// ============================================
function AdminOrders({ go, refreshData }) {
  const [q, setQ] = adS("");
  const [statusF, setStatusF] = adS("all");
  const orders = OrdersStore.list();
  const filtered = orders.filter(o => {
    if (statusF !== "all" && o.status !== statusF) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      o.id.toLowerCase().includes(s) ||
      (o.customerEmail || "").toLowerCase().includes(s) ||
      (o.customerName  || "").toLowerCase().includes(s)
    );
  });
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>Pedidos</h1>
          <div className="mono" style={{color:"var(--mute)"}}>
            {filtered.length} mostrados · {orders.length} totales
          </div>
        </div>
        <div className="adm-page-actions">
          <select
            className="adm-input"
            value={statusF}
            onChange={e => setStatusF(e.target.value)}
            style={{minWidth: 180}}
          >
            <option value="all">Todos los estados</option>
            {Object.values(ORDER_STATUS).map(s => (
              <option key={s} value={s}>{ORDER_STATUS_SHORT[s]}</option>
            ))}
          </select>
          <input
            className="adm-input"
            placeholder="Buscar por ID, email o nombre…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Prendas</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const qty = (o.items || []).reduce((s, it) => s + it.qty, 0);
              return (
                <tr key={o.id}>
                  <td className="mono" style={{fontSize: 11}}>{o.id}</td>
                  <td className="mono">{new Date(o.createdAt).toLocaleDateString("es-AR", {day:"2-digit", month:"short"})}</td>
                  <td>
                    <div style={{fontVariationSettings:'"wght" 500'}}>{o.customerName}</div>
                    <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>{o.customerEmail}</div>
                    <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>
                      {o.customerPhone ? o.customerPhone : <span style={{color:"var(--accent)"}}>sin teléfono</span>}
                    </div>
                  </td>
                  <td className="mono">{qty}</td>
                  <td className="mono">{fmt(o.total)}</td>
                  <td className="mono" style={{fontSize: 11}}>
                    {o.payment ? o.payment.method : "—"}
                  </td>
                  <td>
                    <span className={`role-pill status-pill-${o.status}`}>{ORDER_STATUS_SHORT[o.status]}</span>
                  </td>
                  <td>
                    <button className="adm-link" onClick={() => go(`admin:order:${o.id}`)}>Ver / Editar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminOrderDetail({ user, orderId, go, refreshData }) {
  const [version, setVersion] = adS(0);
  const order = adM(() => OrdersStore.get(orderId), [orderId, version]);
  const [newStatus, setNewStatus] = adS(order ? order.status : ORDER_STATUS.PAYMENT_PENDING);
  const [statusNote, setStatusNote] = adS("");
  const [trackInput, setTrackInput] = adS(order && order.shipping ? (order.shipping.trackingCode || "") : "");

  adE(() => {
    if (order) {
      setNewStatus(order.status);
      setTrackInput(order.shipping ? (order.shipping.trackingCode || "") : "");
    }
  }, [order && order.id, version]);

  if (!order) {
    return (
      <div className="adm-page">
        <div className="adm-page-head">
          <div>
            <div className="eyebrow"><span style={{cursor:"pointer", textDecoration:"underline"}} onClick={() => go("admin:orders")}>← Pedidos</span></div>
            <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>Pedido no encontrado</h1>
          </div>
        </div>
        <p className="mono" style={{color:"var(--mute)"}}>El ID {orderId} no existe.</p>
      </div>
    );
  }

  const applyStatus = () => {
    if (newStatus === order.status && !statusNote.trim()) {
      return alert("Cambiá el estado o agregá una nota.");
    }
    OrdersStore.updateStatus(order.id, newStatus, {
      note: statusNote.trim() || undefined,
      changedBy: user ? user.id : null,
    });
    setStatusNote("");
    setVersion(v => v + 1);
    refreshData();
  };

  const applyTracking = () => {
    OrdersStore.setTracking(order.id, trackInput.trim() || null, user ? user.id : null);
    setVersion(v => v + 1);
    refreshData();
  };

  const adminPanel = (
    <div className="order-section">
      <div className="order-section-title">Gestión del pedido</div>
      <div className="adm-stack">
        <div className="adm-row">
          <span>Cambiar estado</span>
          <select
            className="adm-input"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
          >
            {Object.values(ORDER_STATUS).map(s => (
              <option key={s} value={s}>{ORDER_STATUS_SHORT[s]}</option>
            ))}
          </select>
        </div>
        <div className="adm-row">
          <span>Nota (opcional)</span>
          <input
            className="adm-input"
            placeholder="Ej: Despachado por Andreani"
            value={statusNote}
            onChange={e => setStatusNote(e.target.value)}
          />
        </div>
        <div style={{display:"flex", gap: 12, justifyContent:"flex-end", marginTop: 6}}>
          <button type="button" className="btn" onClick={applyStatus}>
            Aplicar cambio <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      <div className="adm-stack" style={{marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--line)"}}>
        <div className="adm-row">
          <span>Código de seguimiento</span>
          <input
            className="adm-input"
            placeholder="Ej: AR1234567EX"
            value={trackInput}
            onChange={e => setTrackInput(e.target.value)}
          />
        </div>
        <div style={{display:"flex", gap: 12, justifyContent:"flex-end", marginTop: 6}}>
          <button type="button" className="btn ghost" onClick={applyTracking}>
            Guardar tracking
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <OrderDetailView
      order={order}
      go={go}
      backTo="admin:orders"
      backLabel="Pedidos"
      adminPanel={adminPanel}
    />
  );
}

// ============================================
// LANDING (superadmin only) — manual control over home page "Nuevo Drop"
// ============================================
function AdminLanding({ go, refreshData }) {
  const byId = adM(() => Object.fromEntries(PRODUCTS.map(p => [p.id, p])), []);
  const initial = (LANDING_CONFIG && LANDING_CONFIG.newDropProductIds) || [];
  const [selected, setSelected] = adS(() => [...initial]);
  const [savedAt, setSavedAt] = adS(null);

  // Auto-save to Store + window. Skips refreshData (we don't want admin page to remount).
  // Home page will pick up the new config on its next render after route change.
  adE(() => {
    const cfg = { ...(LANDING_CONFIG || {}), newDropProductIds: selected };
    Store.saveLanding(cfg);
    window.LANDING_CONFIG = cfg;
    setSavedAt(new Date());
  }, [selected]);

  const add = (id) => setSelected(s => s.includes(id) ? s : [...s, id]);
  const removeAt = (idx) => setSelected(s => s.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    setSelected(s => {
      const j = idx + dir;
      if (j < 0 || j >= s.length) return s;
      const next = [...s];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };
  const resetToSeed = () => {
    if (!confirm("¿Restaurar la selección a los productos NEW automáticos?")) return;
    Store.resetLanding();
    const reset = Store.loadLanding();
    setSelected([...(reset.newDropProductIds || [])]);
    window.LANDING_CONFIG = reset;
    refreshData();
  };

  const available = PRODUCTS.filter(p => !selected.includes(p.id));
  const savedLabel = savedAt
    ? `Guardado · ${savedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
    : "—";

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <div className="eyebrow">Landing · Home</div>
          <h1 className="display" style={{fontSize: "clamp(28px, 4vw, 44px)"}}>Nuevo Drop</h1>
          <div className="mono" style={{color:"var(--mute)"}}>
            Controlá qué productos aparecen en la sección "Nuevo Drop" de la landing y en qué orden.
          </div>
        </div>
        <div className="adm-page-actions">
          <span className="mono" style={{color:"var(--mute)", fontSize: 10}}>
            ● {savedLabel}
          </span>
          <button className="adm-link adm-link-danger" onClick={resetToSeed}>
            Restaurar (NEW automáticos)
          </button>
        </div>
      </div>

      <div className="adm-form-section">
        <div className="adm-form-section-title">
          Productos en Nuevo Drop · orden en la landing ({selected.length})
        </div>
        {selected.length === 0 ? (
          <p className="mono" style={{color:"var(--mute)"}}>
            Sin productos seleccionados. La sección Nuevo Drop quedará vacía en la landing.
          </p>
        ) : (
          <div className="adm-ordered-list">
            {selected.map((id, i) => {
              const p = byId[id];
              if (!p) {
                return (
                  <div key={id + i} className="adm-ordered-row adm-ordered-row-missing">
                    <div className="mono adm-ordered-num">{i+1}</div>
                    <div className="adm-thumb adm-thumb-empty" />
                    <div className="adm-ordered-info">
                      <div className="mono" style={{color:"var(--accent)"}}>{id} · producto eliminado</div>
                    </div>
                    <div className="adm-ordered-actions">
                      <button type="button" className="adm-link adm-link-danger" onClick={() => removeAt(i)}>Quitar</button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={id} className="adm-ordered-row">
                  <div className="mono adm-ordered-num">{i+1}</div>
                  {p.img
                    ? <img src={p.img} className="adm-thumb" alt="" />
                    : <div className="adm-thumb adm-thumb-empty" />}
                  <div className="adm-ordered-info">
                    <div style={{fontVariationSettings:'"wght" 500'}}>{p.name}</div>
                    <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>
                      {PRODUCT_TYPES[p.type]?.label || p.type} · {fmt(p.price)}
                      {p.isNew && <span style={{marginLeft: 6}}> · NEW</span>}
                      {p.isSale && <span style={{marginLeft: 6, color:"var(--accent)"}}> · SALE −{p.discountPercent}%</span>}
                      {p.oos && <span style={{marginLeft: 6, color:"var(--accent)"}}> · AGOTADO</span>}
                    </div>
                  </div>
                  <div className="adm-ordered-actions">
                    <button
                      type="button"
                      className="adm-link"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Mover arriba"
                    >↑</button>
                    <button
                      type="button"
                      className="adm-link"
                      onClick={() => move(i, +1)}
                      disabled={i === selected.length - 1}
                      aria-label="Mover abajo"
                    >↓</button>
                    <button
                      type="button"
                      className="adm-link adm-link-danger"
                      onClick={() => removeAt(i)}
                    >Quitar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="adm-form-section">
        <div className="adm-form-section-title">Productos disponibles</div>
        {available.length === 0 ? (
          <p className="mono" style={{color:"var(--mute)"}}>
            Todos los productos ya están en la selección.
          </p>
        ) : (
          <div className="adm-product-picker">
            {available.map(p => (
              <button
                type="button"
                key={p.id}
                className="adm-product-pick"
                onClick={() => add(p.id)}
                title="Agregar al Nuevo Drop"
              >
                <div className="adm-pick-media">
                  {p.img ? <img src={p.img} alt="" /> : <div className="adm-thumb-empty" />}
                </div>
                <div className="adm-pick-info">
                  <div style={{fontSize: 13, fontVariationSettings:'"wght" 500'}}>{p.name}</div>
                  <div className="mono" style={{color:"var(--mute)", fontSize: 10}}>
                    {PRODUCT_TYPES[p.type]?.label} · {fmt(p.price)}
                  </div>
                  <div className="adm-pill-row" style={{marginTop: 4}}>
                    {p.isNew && <span className="role-pill role-new">NEW</span>}
                    {p.isSale && <span className="role-pill role-sale">−{p.discountPercent}%</span>}
                    {p.oos && <span className="role-pill role-oos">Agotado</span>}
                  </div>
                </div>
                <span className="adm-pick-add" aria-hidden="true">+</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="adm-callout">
        <div className="eyebrow">Cómo funciona</div>
        <p style={{color:"var(--mute)", marginTop: 4}}>
          Los cambios se guardan automáticamente en <code>localStorage</code> (clave <code>dv-landing</code>).
          La etiqueta <code>NEW</code> sigue existiendo a nivel producto, pero esta lista es la que
          decide qué aparece en la landing y en qué orden. Si un producto se elimina del catálogo,
          se filtra automáticamente al renderizar la home.
        </p>
      </div>
    </div>
  );
}

// ============================================
// DISPATCHER
// ============================================
function AdminPanel({ user, route, go, logout, refreshData }) {
  // ---- Permission gates ----
  if (!Perms.canAccessAdmin(user)) {
    return <AdminDenied reason="No tenés permisos" go={go} />;
  }
  if ((route.startsWith("admin:outfits") || route === "admin:users" || route === "admin:landing") && !Perms.isSuperadmin(user)) {
    return (
      <AdminLayout user={user} route="admin" go={go} logout={logout}>
        <AdminDenied reason="Solo superadmin" go={go} />
      </AdminLayout>
    );
  }

  // ---- Page dispatch ----
  let content;
  if (route === "admin")                                content = <AdminDashboard user={user} go={go} />;
  else if (route === "admin:orders")                    content = <AdminOrders go={go} refreshData={refreshData} />;
  else if (route.startsWith("admin:order:")) {
    const id = route.split(":").slice(2).join(":");
    content = <AdminOrderDetail user={user} orderId={id} go={go} refreshData={refreshData} />;
  }
  else if (route === "admin:products")                  content = <AdminProducts go={go} refreshData={refreshData} />;
  else if (route === "admin:products:new")              content = <AdminProductForm productId={null} go={go} refreshData={refreshData} />;
  else if (route.startsWith("admin:products:edit:")) {
    const id = route.split(":").slice(3).join(":");
    content = <AdminProductForm productId={id} go={go} refreshData={refreshData} />;
  }
  else if (route === "admin:outfits")                   content = <AdminOutfits go={go} refreshData={refreshData} />;
  else if (route === "admin:outfits:new")               content = <AdminOutfitForm outfitId={null} go={go} refreshData={refreshData} />;
  else if (route.startsWith("admin:outfits:edit:")) {
    const id = route.split(":").slice(3).join(":");
    content = <AdminOutfitForm outfitId={id} go={go} refreshData={refreshData} />;
  }
  else if (route === "admin:landing")                   content = <AdminLanding go={go} refreshData={refreshData} />;
  else if (route === "admin:users")                     content = <AdminUsers user={user} refreshData={refreshData} />;
  else                                                  content = <AdminDashboard user={user} go={go} />;

  return (
    <AdminLayout user={user} route={route} go={go} logout={logout}>
      {content}
    </AdminLayout>
  );
}

window.AdminPanel = AdminPanel;
window.AdminDenied = AdminDenied;
