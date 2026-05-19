// ============================================
// DRESSVINTAGE — root app
// ============================================

const { useState: U, useEffect: E, useMemo: M, useCallback: C } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "typography": "archivo",
  "animation": 8
}/*EDITMODE-END*/;

const TYPE_PRESETS = {
  archivo: {
    label: "Archivo · Mono",
    display: '"Archivo", system-ui, sans-serif',
    ui:      '"Archivo", system-ui, sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, monospace',
  },
  grotesk: {
    label: "Space Grotesk · Mono",
    display: '"Space Grotesk", system-ui, sans-serif',
    ui:      '"Space Grotesk", system-ui, sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, monospace',
  },
  helvetica: {
    label: "Helvetica · Mono",
    display: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
    ui:      'Helvetica, "Helvetica Neue", Arial, sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, monospace',
  },
  display: {
    label: "Bebas + Inter",
    display: '"Bebas Neue", "Archivo", sans-serif',
    ui:      '"Archivo", system-ui, sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, monospace',
  },
};

function App() {
  const t = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = U("home");
  const [theme, setTheme] = U(() => localStorage.getItem("dv-theme") || "light");
  const [cart, setCart]   = U(() => {
    try { return JSON.parse(localStorage.getItem("dv-cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = U(() => {
    try { return JSON.parse(localStorage.getItem("dv-wish") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = U(false);
  const [toast, setToast] = U(null);

  // persist
  E(() => { localStorage.setItem("dv-theme", theme); document.documentElement.dataset.theme = theme; }, [theme]);
  E(() => { localStorage.setItem("dv-cart", JSON.stringify(cart)); }, [cart]);
  E(() => { localStorage.setItem("dv-wish", JSON.stringify(wishlist)); }, [wishlist]);

  // apply tweaks
  E(() => {
    const preset = TYPE_PRESETS[t.typography] || TYPE_PRESETS.archivo;
    const root = document.documentElement;
    root.style.setProperty("--font-display", preset.display);
    root.style.setProperty("--font-ui", preset.ui);
    root.style.setProperty("--font-mono", preset.mono);
    const animMult = (t.animation || 5) / 5; // 1 = normal at 5; 10 = 2x
    root.style.setProperty("--anim", animMult.toFixed(2));
  }, [t.typography, t.animation]);

  // scroll to top on route change
  E(() => { window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); }, [route]);

  const go = C((r) => setRoute(r), []);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const products_byId = M(() => Object.fromEntries(PRODUCTS.map(p => [p.id, p])), []);

  const addToCart = (p, size = "M", color = null) => {
    const c = color || p.colorIds[0];
    setCart(prev => {
      const i = prev.findIndex(x => x.id === p.id && x.size === size && x.color === c);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { id: p.id, size, color: c, qty: 1 }];
    });
    setToast(`✓ ${p.name} (talle ${size})`);
    setTimeout(() => setToast(null), 2200);
    // brief auto-open
    setCartOpen(true);
    setTimeout(() => { /* keep open; user closes */ }, 0);
  };

  const updateQty = (idx, qty) => {
    setCart(prev => {
      if (qty <= 0) return prev.filter((_, i) => i !== idx);
      const next = [...prev];
      next[idx] = { ...next[idx], qty };
      return next;
    });
  };
  const removeItem = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));
  const clearCart = () => setCart([]);
  const toggleWish = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  let page = null;
  if (route === "home") page = <HomePage go={go} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} />;
  else if (route.startsWith("catalog:")) {
    const slug = route.split(":")[1] || "all";
    page = <CatalogPage catSlug={slug} go={go} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} />;
  }
  else if (route.startsWith("product:")) {
    const id = route.split(":")[1];
    page = <ProductPage productId={id} go={go} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} />;
  }
  else if (route === "outfits")  page = <OutfitsPage go={go} addToCart={addToCart} />;
  else if (route === "about")    page = <AboutPage go={go} />;
  else if (route === "faq")      page = <FaqPage go={go} />;
  else if (route === "login")    page = <LoginPage go={go} />;
  else if (route === "checkout") page = <CheckoutPage go={go} cart={cart} products_byId={products_byId} clearCart={clearCart} />;
  else page = <HomePage go={go} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} />;

  return (
    <div className="app" key={route}>
      <CustomCursor />
      <Header
        route={route}
        go={go}
        theme={theme}
        setTheme={setTheme}
        cartCount={cartCount}
        openCart={openCart}
      />
      {page}
      <Footer go={go} />
      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
        cart={cart}
        removeItem={removeItem}
        updateQty={updateQty}
        go={go}
        products={PRODUCTS}
        products_byId={products_byId}
      />
      {toast && (
        <div style={{
          position: "fixed",
          left: "50%", bottom: 32,
          transform: "translateX(-50%)",
          background: "var(--fg)", color: "var(--bg)",
          padding: "12px 20px",
          fontFamily: "var(--font-mono)",
          fontSize: 11, letterSpacing: "0.16em",
          textTransform: "uppercase",
          zIndex: 200,
          animation: "rise 320ms var(--ease-out) forwards"
        }}>
          {toast}
        </div>
      )}

      {/* TWEAKS PANEL */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Tipografía">
          <TweakSelect
            label="Familia"
            value={t.typography}
            onChange={(v) => t.setTweak('typography', v)}
            options={Object.entries(TYPE_PRESETS).map(([id, p]) => ({ value: id, label: p.label }))}
          />
        </TweakSection>
        <TweakSection title="Animación">
          <TweakSlider
            label="Intensidad"
            value={t.animation}
            min={1}
            max={10}
            step={1}
            onChange={(v) => t.setTweak('animation', v)}
          />
          <div style={{fontFamily:'var(--font-mono)', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', textTransform: 'uppercase'}}>
            {t.animation <= 3 ? "● Discreto" : t.animation <= 6 ? "● Equilibrado" : "● Pronunciado"}
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
