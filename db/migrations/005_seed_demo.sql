-- ============================================
-- 005 — Seed demo products (mirrors data.js SEED_PRODUCTS)
-- ============================================
-- Optional: run only on dev / staging projects to populate the products table
-- with the same 8 demo products the frontend already knows about.
-- ============================================

insert into public.products (id, slug, name, type, category, code, price, primary_image, short_description, active)
values
  ('dv-001', 'hoodie-estelar',       'Hoodie Estelar',        'hoodie',    'hoodies',    'DV/HO·001', 55000, 'assets/prod-hoodie-estelar.jpeg',    'Buzo de algodón frizado, corte boxy fit.',                       true),
  ('dv-002', 'last-jean-hoodie-zip', 'Last Jean Hoodie Zip',  'campera',   'camperas',   'DV/CA·002', 65000, 'assets/prod-campera-lastjean.jpeg',  'Hoodie zip de denim lavado con capucha amplia.',                 true),
  ('dv-003', 'remera-square-black',  'Remera Square Black',   'remera',    'remeras',    'DV/RE·003', 38000, 'assets/prod-remera-square.jpeg',     'Remera oversize jersey 24/7 con serigrafía alta densidad.',      true),
  ('dv-004', 'super-baggy-oxid',     'Súper Baggy Oxid',      'pantalon',  'pantalones', 'DV/PA·004', 60000, 'assets/prod-baggy-oxid.jpeg',        'Super baggy de denim rígido, lavado oxid, corte open leg.',      true),
  ('dv-005', 'sueter-brand',         'Suéter Brand',          'sweater',   'sweaters',   'DV/SW·005', 55000, 'assets/prod-sweater-brand.jpeg',     'Suéter boxy fit de lana con escote V y logo intarsia.',          true),
  ('dv-006', 'pin-sueter',           'Pin Suéter',            'sweater',   'sweaters',   'DV/SW·006', 55000, 'assets/prod-sweater-pin.jpeg',       'Suéter regular fit jacquard, algodón + poliéster.',              true),
  ('dv-007', 'denim-hoja-seca',      'Denim Hoja Seca',       'pantalon',  'pantalones', 'DV/PA·007', 60000, 'assets/prod-hojaseca.jpeg',          'Baggy denim rígido con estampado tree-camo all-over.',           true),
  ('dv-008', 'gorros-variedad',      'Gorros · Variedad',     'accesorio', 'accesorios', 'DV/AC·008', 26000, 'assets/prod-gorros.jpeg',            'Gorros jacquard talle único, variedad de gráficos.',             true)
on conflict (id) do update set
  name           = excluded.name,
  price          = excluded.price,
  primary_image  = excluded.primary_image,
  short_description = excluded.short_description,
  active         = excluded.active;
