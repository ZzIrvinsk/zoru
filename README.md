# Zoru - Redesign (skeleton)

Este repo es una base limpia y profesional para tu tienda **Zoru**.
Está pensada para trabajar con **Next.js + TailwindCSS + Framer Motion** y dejar la estructura lista para desarrollar.

## Qué contiene
- `app/` — rutas con `layout.js` y `page.js` (app router).
- `components/` — componentes base (Navbar, Hero, ProductGrid, ProductCard, Footer, CartContext).
- `pages/api/products.js` — endpoint GET que lee `data/products.json` (solo para prototipo).
- `data/products.json` — tu lista de productos (copiada desde tu proyecto original, si existía).
- `public/img/` — imágenes copiadas desde tu proyecto original (si existían).

## Notas importantes
- He dejado la **lógica JS intencionalmente mínima/placeholder** para que puedas arrancar el backend y la integración desde cero sin conflictos.
- Antes de ejecutar, instala dependencias:
  ```bash
  npm install
  npm run dev
  ```
- No olvides configurar `.env` y no subirlo a GitHub.

## Siguientes pasos recomendados
1. Implementar la lógica de productos (fetch desde API / DB).
2. Añadir autenticación para el panel admin.
3. Migrar la API a una base de datos para producción (Supabase, Postgres, etc.).
4. Iterar en diseño visual: paleta, tipografías y fotos de producto.

Si quieres, te entrego también una propuesta visual (maqueta en código) para la landing y la página de producto. Dime y la dejo lista en este mismo repo.


# Redesign notes
This branch includes enhanced components: CartContext, CartDrawer, Hero improvements, ProductGrid connected to data/products.json, and new product card interactions. Test with `npm run dev`.


## Nuevas mejoras añadidas
- Cargar más en la colección (botón 'Cargar más')
- Slider horizontal de destacados (scroll) en ProductGrid
- Páginas: /colecciones y /about creadas
- Página de producto dinámica en /producto/[slug]
- Botón 'Añadir' en ProductCard y componente AddToCartButton


## V3 Features added
- Wishlist (localStorage) + page /wishlist
- Back-in-stock fields added to products.json; notify-button (stored locally)
- Flying image animation when adding to cart
- Floating WhatsApp and Instagram buttons (WhatsApp number +51 934 569 960)
- Points system (localStorage) with simulated checkout earning
- Raffle system (localStorage) at /raffle
- Breadcrumbs with micro-animations
# 
