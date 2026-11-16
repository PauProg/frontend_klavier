# SPEC 0001 — Sesión 9 (14): base del frontend con React, Vite, React Router y Home

| Campo | Valor |
|---|---|
| **ID** | `0001` |
| **Título** | Base del frontend con React, Vite, React Router y página de inicio |
| **Proyecto** | Klavier — frontend de e-commerce de pianos |
| **Sesión** | Sesión 9 (14) · Curso 2025-2026 |
| **Autor** | Pau Medina Vázquez |
| **Fecha** | 2026-11-16 |
| **Estado** | `Completado` — implementado, verificado y documentado |
| **Rama prevista** | `feature/react-vite-router-setup` |
| **Documentos relacionados** | [`enunciado.md`](./enunciado.md) (copia archivada), [`README.md`](./README.md), [`../../AGENTS.md`](../../AGENTS.md), [`../../../AGENTS.md`](../../../AGENTS.md) |

---

## 1. Descripción breve

Primera sesión del frontend de Klavier. El objetivo es crear la base de la aplicación React con Vite, instalar React Router y dejar navegables las páginas de inicio, login y registro. La página de inicio debe tener una UI sencilla pero funcional, con los productos destacados de la tienda.

La sesión no toca el backend. La API existente se usará en modo lectura para mostrar productos en la Home.

---

## 2. Contexto y estado inicial

### Lo que existe

| Elemento | Estado actual |
|---|---|
| `frontend/` | Repositorio independiente con `README.md`, `package.json`, `.gitignore`, `AGENTS.md` y `enunciado.md`. |
| Aplicación React | No existe. No hay `src/`, `index.html`, `vite.config.js` ni dependencias instaladas. |
| `package.json` | Es un esqueleto de metadata (`type: commonjs`, sin scripts de desarrollo ni dependencias de React). |
| Backend | API REST operativa en `http://localhost:3000` con productos, categorías, usuarios y autenticación. |
| CORS | El backend permite `http://localhost:5173` por defecto (`FRONTEND_URL`). |
| `GET /api/products` | Devuelve `{ status: 'success', data: Product[] }`. Actualmente no pagina. |
| Repositorio Git | `frontend/` tiene su propio `.git`; la raíz `klavier/` no es un repositorio. |

### Lo que falta

- Proyecto React creado con Vite.
- Dependencias y scripts de npm.
- React Router DOM instalado y configurado.
- Páginas `Home`, `Login` y `Register`.
- Layout compartido con navegación.
- UI de la Home con productos destacados.
- Cliente de API para leer productos.
- Estados de carga, error y vacío.
- README, ADR y documentación de la sesión.

---

## 3. Objetivo

1. Crear un proyecto React con Vite dentro de `frontend/`, sin crear una carpeta anidada innecesaria.
2. Instalar y configurar React Router DOM.
3. Crear y enrutar las páginas `Home`, `Login` y `Register`.
4. Construir una Home funcional y responsive con productos destacados.
5. Verificar el arranque, las rutas, la integración con la API, el responsive y el build.
6. Dejar documentada la base para las siguientes sesiones.

---

## 4. Alcance

### Incluido

- Aplicación React + Vite con Tailwind CSS.
- `package.json` con scripts `dev`, `build`, `preview` y `lint` si el template lo incluye.
- Dependencia `react-router-dom` y dependencias de Tailwind CSS.
- Estructura `src/pages/`, `src/components/`, `src/api/`, `src/hooks/` y `src/utils/` según necesidad real. Los estilos serán básicos y se harán con Tailwind; la guía de estilos definitiva se dejará para la siguiente sesión.
- `src/main.jsx` con `BrowserRouter`.
- `src/App.jsx` como layout compartido con `Header`, `Footer` y `Outlet`.
- Rutas `/` (Home), `/login` (Login) y `/register` (Register); 404 como detalle mínimo de routing.
- Home con:
  - cabecera/hero de la tienda,
  - productos destacados leídos de `GET /api/products`,
  - estados de carga, error con reintento y vacío,
  - tarjetas de producto con imagen o fallback, nombre, marca/modelo, año y precio en EUR,
  - sección breve de propuesta de valor o categorías,
  - CTA hacia el catálogo o registro.
- Páginas Login y Register con formularios maquetados, etiquetas, validación básica y mensajes claros.
- Diseño responsive mobile-first con utilidades de Tailwind.
- Accesibilidad básica: HTML semántico, foco visible, etiquetas, `alt` y contraste.
- `.env.example` con `VITE_API_URL=http://localhost:3000`.
- README del proyecto actualizado.
- ADR sobre la base del frontend y las decisiones de scaffold/Tailwind/API.
- `SPEC.md`, `README.md`, `RESUMEN.md` y PDF del entregable en `works/0001-react-vite-router-setup/`.

### Fuera de alcance

- Autenticación real: login, registro, refresh token, contexto de sesión y logout.
- Rutas protegidas reales; se posponen a la sesión de autenticación (D5).
- Carrito, checkout, pedidos, pagos y área de usuario.
- CRUD de productos o administración.
- Cambios en el backend.
- Tests automatizados (no los pide el enunciado; la verificación será manual y documentada).
- Despliegue en producción.
- Internacionalización; la UI será en español.
- Bootstrap u otro framework visual distinto de Tailwind. Tailwind sí se incluye en esta sesión.

---

## 5. Decisiones de diseño

| ID | Decisión | Alternativa descartada | Motivo |
|---|---|---|---|
| **D1** | Crear el scaffold de Vite en una carpeta temporal dentro de `frontend/` y mover los archivos generados a la raíz, preservando `AGENTS.md`, `enunciado.md`, `works/` y `README.md`. | Ejecutar `npm create vite@latest .` directamente en `frontend/`. | El directorio no está vacío y Vite puede pedir sobrescribir o ignorar archivos. No queremos perder documentación ni el enunciado. |
| **D2** | Usar React Router DOM con `BrowserRouter`, rutas anidadas y `App` como layout con `<Outlet />`. | Rutas planas sin layout compartido. | El ejemplo del enunciado usa rutas anidadas y un layout común evita duplicar cabecera y pie. |
| **D3** | Usar **Tailwind CSS** con estilos básicos, sin crear todavía una guía de estilos definitiva. | Bootstrap o CSS propio. | El usuario quiere dejar Tailwind instalado para las siguientes sesiones. En esta sesión se usa de forma sencilla; la dirección visual y la guía de estilos se harán más adelante. |
| **D4** | La Home consume `GET /api/products` y muestra los primeros 6 productos como destacados. | Datos mock locales. | La API ya existe y permite demostrar la integración real. Si la API falla, la Home muestra un error con reintento; si no hay productos, muestra un estado vacío. |
| **D5** | Login y Register quedan como **UI maquetada y validada**, sin conectar a la API ni crear rutas protegidas reales. | Implementar ya `AuthContext`, login real y una ruta `/account` protegida. | El usuario ha confirmado que la autenticación se deja para la siguiente sesión; esta sesión se centra en Vite, routing, Tailwind y Home. |
| **D6** | Centralizar la URL de la API en `VITE_API_URL`, con fallback a `http://localhost:3000`. | Hardcodear la URL en cada componente. | Una única fuente de verdad y facilidad para cambiar de entorno. |
| **D7** | Añadir una página 404 para rutas desconocidas. | Redirigir siempre a `/`. | Un 404 explícito es más claro y demuestra que el routing está configurado; es un detalle mínimo, no una pantalla elaborada. |
| **D8** | Mantener el frontend en JavaScript + JSX, sin TypeScript. | Añadir TypeScript. | El enunciado pide el template `react` y no menciona TypeScript. |
| **D9** | Instalar Tailwind con la integración oficial para Vite (`tailwindcss` + `@tailwindcss/vite`) y usar `@import "tailwindcss"` en `src/index.css`. | Instalación clásica de Tailwind v3 con `postcss` + `autoprefixer` y `tailwind.config.js`. | Es la integración recomendada actualmente para Vite y evita configuración redundante. Si el curso exige la configuración clásica, se puede adaptar; se documentará en el ADR. |

---

## 6. Requisitos funcionales

| ID | Requisito | Prioridad |
|---|---|---|
| **RF-01** | El proyecto arranca con `npm run dev` desde `frontend/` y sirve la app en `http://localhost:5173/`. | Alta |
| **RF-02** | `npm run build` genera una build de producción sin errores. | Alta |
| **RF-03** | La ruta `/` renderiza la página Home. | Alta |
| **RF-04** | La ruta `/login` renderiza la página Login. | Alta |
| **RF-05** | La ruta `/register` renderiza la página Register. | Alta |
| **RF-06** | La navegación entre páginas funciona sin recargar el navegador. | Alta |
| **RF-07** | Una ruta desconocida muestra una página 404 con enlace a la Home. | Media |
| **RF-08** | La Home muestra un hero con el nombre de la tienda y una llamada a la acción. | Alta |
| **RF-09** | La Home muestra hasta 6 productos destacados obtenidos de `GET /api/products`. | Alta |
| **RF-10** | Cada tarjeta muestra imagen o fallback, nombre, marca/modelo, año y precio en EUR. | Alta |
| **RF-11** | La Home muestra estados de carga, error con reintento y vacío. | Alta |
| **RF-12** | Login y Register muestran formularios con etiquetas, campos obligatorios y validación básica en cliente. | Media |
| **RF-13** | La UI es responsive y usable en 375, 768 y 1440 px. | Alta |
| **RF-14** | La navegación principal es accesible por teclado y tiene foco visible. | Media |
| **RF-15** | El enlace “Iniciar sesión” y “Crear cuenta” navegan a sus rutas correspondientes. | Media |

### Criterios de aceptación funcionales

- **RF-01:** `npm run dev` arranca sin errores y la consola de Vite muestra la URL local.
- **RF-02:** `npm run build` termina con código 0 y genera `dist/`.
- **RF-03–RF-05:** cada URL renderiza su página y el título del documento es coherente.
- **RF-06:** al pulsar un enlace del menú cambia la vista sin recarga completa.
- **RF-07:** `/ruta-inexistente` muestra 404 y un enlace a `/`.
- **RF-08:** la Home tiene un `h1` visible y un CTA claro.
- **RF-09:** con el backend arrancado, la Home muestra productos reales; sin backend, muestra el error controlado.
- **RF-10:** el precio se muestra con `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`.
- **RF-11:** los tres estados son visibles y no dejan la pantalla en blanco.
- **RF-12:** los formularios no se envían con campos vacíos y muestran mensajes en español.
- **RF-13:** no hay desbordes horizontales ni elementos cortados en los tres anchos.
- **RF-14:** se puede recorrer el menú y los formularios con `Tab` y el foco es visible.
- **RF-15:** los enlaces llevan a `/login` y `/register`.

---

## 7. Requisitos técnicos

| ID | Requisito |
|---|---|
| **RT-01** | Crear el proyecto con Vite + React + JavaScript, sin TypeScript. |
| **RT-02** | Ejecutar los comandos de npm desde `frontend/`; no desde la raíz `klavier/`. |
| **RT-03** | Instalar `react-router-dom` y usarlo para todas las rutas. |
| **RT-04** | Mantener una única instancia de `BrowserRouter` en `src/main.jsx`. |
| **RT-05** | Usar `App.jsx` como layout con `Header`, `Footer` y `Outlet`. |
| **RT-06** | Centralizar las llamadas a la API en `src/api/`. |
| **RT-07** | Usar `import.meta.env.VITE_API_URL || 'http://localhost:3000'` como base de la API. |
| **RT-08** | Incluir `credentials: 'include'` en las llamadas de auth que lo necesiten; para `GET /api/products` no es necesario, pero el cliente debe dejar la puerta abierta. |
| **RT-09** | No hardcodear precios, textos de error repetidos ni URLs de API en los componentes. |
| **RT-10** | Usar Tailwind CSS para la UI, con estilos básicos y sin crear todavía una guía de estilos definitiva. |
| **RT-11** | No añadir dependencias fuera de React, React DOM, Vite, React Router DOM, Tailwind CSS y las del template. |
| **RT-12** | No tocar `backend/` ni asumir cambios de contrato. |
| **RT-13** | No incluir secretos en variables `VITE_*`; son públicas. |
| **RT-14** | Mantener el código en inglés y los textos de UI/documentación en español. |
| **RT-15** | Actualizar `README.md` y `.env.example` con la puesta en marcha y las variables. |
| **RT-16** | Documentar la decisión de scaffold/estilos/API en un ADR. |

---

## 8. Flujo de usuario esperado

```text
1. El usuario abre http://localhost:5173/
   → Home con hero, navegación y productos destacados.
   → Mientras carga: skeleton o mensaje de carga.
   → Si la API responde: hasta 6 tarjetas de producto.
   → Si la API falla: mensaje de error + botón “Reintentar”.
   → Si no hay productos: estado vacío con CTA.

2. El usuario pulsa “Iniciar sesión”
   → /login con formulario de email y contraseña.
   → Validación en cliente y mensaje de que la conexión real llegará en la siguiente sesión.

3. El usuario pulsa “Crear cuenta”
   → /register con formulario de registro.
   → Validación en cliente y mensaje informativo.

4. El usuario escribe una URL inexistente
   → página 404 con enlace “Volver al inicio”.

5. El usuario navega con el teclado
   → enlaces y campos reciben foco visible.
```

---

## 9. Plan de implementación

### Fase 0 — Preparación

- [x] Crear la rama `feature/react-vite-router-setup`.
- [x] Revisar el estado del repositorio y el enunciado.
- [x] Crear `works/0001-react-vite-router-setup/` y archivar el enunciado.
- [x] Scaffold de Vite en una carpeta temporal.
- [x] Mover `index.html`, `src/`, `vite.config.js`, `package.json` y configuración de lint a `frontend/`.
- [x] Conservar `AGENTS.md`, `enunciado.md`, `works/` y `README.md`.
- [x] Ejecutar `npm install`.
- [x] Ejecutar `npm install react-router-dom`.
- [x] Ejecutar `npm install tailwindcss @tailwindcss/vite`.
- [x] Configurar Tailwind en `vite.config.js` y `src/index.css`.
- [x] Verificar que `npm run dev` arranca.

### Fase 1 — Estructura y estilos base

- [x] Configurar Tailwind en `src/index.css`.
- [x] Añadir estilos base mínimos (fondo, tipografía, foco visible) con Tailwind.
- [x] Crear `Header`, `Footer` y el layout de `App.jsx`.
- [x] Usar utilidades de Tailwind para maquetar, sin crear todavía una guía de estilos definitiva.
- [x] Comprobar que la app base se ve sin errores.

### Fase 2 — Routing y páginas

- [x] Configurar `BrowserRouter` en `src/main.jsx`.
- [x] Crear `src/pages/Home.jsx`, `Login.jsx`, `Register.jsx` y `NotFound.jsx`.
- [x] Configurar rutas anidadas en `App.jsx` con `<Outlet />`.
- [x] Añadir navegación con `NavLink`/`Link`.
- [x] Verificar `/`, `/login`, `/register` y 404.
- [ ] Actualizar el título del documento por página si se implementa un helper. → **Descartado:** el enunciado no lo pide; el título global es suficiente y se valorará en la sesión de estilos.

### Fase 3 — Home y productos

- [x] Crear `src/api/client.js` y `src/api/products.js`.
- [x] Crear `src/hooks/useProducts.js`.
- [x] Crear `src/components/ProductCard.jsx` y `ProductGrid.jsx`.
- [x] Implementar hero, sección de productos, propuesta de valor y CTA.
- [x] Implementar estados de carga, error con reintento y vacío.
- [x] Formatear precios en EUR y años.
- [x] Añadir fallback de imagen.
- [x] Verificar con el backend arrancado y con el backend parado.

### Fase 4 — Login y Register

- [x] Crear formularios con etiquetas y campos controlados.
- [x] Añadir validación básica y mensajes en español.
- [x] Deshabilitar el envío mientras se procesa (simulado) y evitar dobles envíos.
- [x] Mostrar un aviso claro de que la conexión real con la API llega en la siguiente sesión.
- [x] Enlazar Login ↔ Register.

### Fase 5 — Responsive y accesibilidad

- [x] Revisar 375, 768 y 1440 px.
- [x] Revisar foco visible, orden de tabulación y etiquetas.
- [x] Revisar contraste y jerarquía de encabezados.
- [x] Revisar `alt` de imágenes y estados de error.
- [x] Añadir `prefers-reduced-motion` si hay animaciones.

### Fase 6 — Documentación

- [x] Actualizar `README.md` con stack, scripts, rutas y variables.
- [x] Crear `.env.example`.
- [x] Crear `docs/adrs/001-frontend-foundation.md`.
- [x] Actualizar `AGENTS.md` si la estructura final difiere de la prevista.
- [x] Crear `works/README.md` con la sesión.

### Fase 7 — Verificación

- [x] `npm run dev` sin errores.
- [x] Rutas y navegación.
- [x] Home con API real, API caída y lista vacía.
- [x] Consola sin errores (salvo el `ERR_FAILED` provocado a propósito al simular la caída).
- [x] Network con `GET /api/products` correcto.
- [x] Responsive en 375, 768 y 1440 px.
- [x] Navegación por teclado.
- [x] `npm run build`.
- [x] `git diff` y `git status`.

### Fase 8 — Cierre

- [x] Crear `RESUMEN.md`.
- [x] Crear el PDF con placeholders de capturas.
- [x] Rellenar la tabla evaluativa y el registro de progreso.
- [x] Actualizar `works/README.md`.
- [x] Hacer commits descriptivos.

---

## 10. Tabla evaluativa

**Leyenda:** `⬜ Pendiente` · `🟨 En curso` · `✅ Cumplido` · `❌ No cumplido`

> El enunciado asigna 0,33 a cada bloque. La suma exacta es 0,99; se mantiene el peso literal del enunciado y se redondea a 1,00 en la nota final.

### 10.1 Instalar React con Vite — 0,33

| ID | Criterio | Peso | Estado | Evidencia | Notas |
|---|---|---:|---|---|---|
| V1 | Proyecto React + Vite creado en `frontend/` | 0,12 | ✅ | `package.json`, `vite.config.js`, `index.html`, `src/` | Template `react`; Tailwind v4 añadido. |
| V2 | `npm run dev` arranca en `http://localhost:5173/` | 0,11 | ✅ | Verificado con Playwright/Chromium headless | Vite 8.3.8, sin errores. |
| V3 | `npm run build` termina correctamente | 0,10 | ✅ | `dist/index.html` + `dist/assets/*` | Build en ~75 ms; 37 módulos. |

### 10.2 Routing — 0,33

| ID | Criterio | Peso | Estado | Evidencia | Notas |
|---|---|---:|---|---|---|
| R1 | `react-router-dom` instalado y configurado | 0,10 | ✅ | `package.json`, `src/main.jsx` | Versión 7.18.5; `BrowserRouter` único. |
| R2 | Rutas `/`, `/login`, `/register` operativas | 0,13 | ✅ | `h1` verificado en cada ruta | Navegación SPA sin recarga comprobada. |
| R3 | Navegación sin recarga y 404 | 0,10 | ✅ | Playwright: `window` preservado; `/no-existe` → 404 | 404 con enlace al inicio. |

### 10.3 UI Básica — 0,33

| ID | Criterio | Peso | Estado | Evidencia | Notas |
|---|---|---:|---|---|---|
| U1 | Home con hero, navegación y jerarquía visual clara | 0,10 | ✅ | Captura 1440×900 y 375×812 | Un `h1` por página; layout compartido. |
| U2 | Productos destacados con imagen/fallback, datos y precio | 0,10 | ✅ | 6 tarjetas con datos reales; fallback de piano | Precio en EUR y año formateados. |
| U3 | Login y Register maquetados y validados | 0,07 | ✅ | Errores por campo y aviso de maqueta | Sin llamadas de autenticación (D5). |
| U4 | Responsive y accesibilidad básica | 0,06 | ✅ | 375/768/1440 sin overflow; foco visible | `scrollWidth === clientWidth` en las 12 combinaciones. |

### 10.4 Resumen

| Bloque | Peso | Estado |
|---|---:|---|
| React + Vite | 0,33 | ✅ |
| Routing | 0,33 | ✅ |
| UI Básica | 0,33 | ✅ |
| **Total** | **0,99 → 1,00** | **✅** |

---

## 11. Evidencias y entregables

| ID | Evidencia | Formato |
|---|---|---|
| **E1** | Proyecto Vite + React arrancando | Captura de terminal y navegador |
| **E2** | Home en desktop con productos | Captura de navegador |
| **E3** | Home en móvil y tablet | Capturas 375/768 |
| **E4** | Login y Register | Capturas de navegador |
| **E5** | Navegación y 404 | Capturas de navegador |
| **E6** | Petición `GET /api/products` correcta | Captura de DevTools/Network |
| **E7** | Build de producción | Salida de `npm run build` |
| **E8** | README y ADR | Markdown |
| **E9** | `RESUMEN.md` | Markdown |
| **E10** | PDF con explicaciones y placeholders de capturas | PDF |

---

## 12. Riesgos y casos límite

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El scaffold de Vite sobrescribe `AGENTS.md` o `enunciado.md` | Pérdida de documentación | Scaffold en carpeta temporal y mover solo los archivos generados. |
| El puerto 5173 está ocupado | El backend CORS no coincide | Liberar el puerto o coordinar `FRONTEND_URL`; documentar. |
| El backend no está arrancado | La Home muestra error | Verificar ambos casos; el error debe ser claro y permitir reintento. |
| La base de datos no tiene productos | Home vacía | Implementar estado vacío y sembrar datos de prueba si hace falta. |
| Productos sin imágenes | Tarjetas rotas | Fallback visual con inicial o icono de piano. |
| CORS mal configurado | `GET /api/products` falla | Arrancar frontend en 5173; si cambia, actualizar `FRONTEND_URL` en backend con permiso. |
| El package.json actual es CommonJS | Conflicto con Vite/ESM | Reemplazar por el `package.json` de Vite y verificar scripts. |
| Ruta directa en producción sin fallback SPA | 404 al recargar | Documentar que el hosting debe redirigir a `index.html`; fuera de alcance del despliegue. |
| Autenticación fuera de alcance | Login/Register no funcionan de verdad | Aviso claro en la UI y decisión D5 confirmada con el usuario. |
| Tailwind v4 usa una integración distinta a la del enunciado | Confusión con `tailwind.config.js` o `npx tailwindcss init` | Documentar la decisión en el ADR y usar `@tailwindcss/vite` + `@import "tailwindcss"`. Si el curso exige v3, adaptar la configuración. |
| Estilos básicos poco trabajados | La UI puede verse sencilla | Es intencional en esta sesión; la guía de estilos y el acabado visual se harán en la siguiente. |
| Accesibilidad incompleta | Mala experiencia con teclado/lector | Checklist de foco, etiquetas, contraste y HTML semántico. |

---

## 13. Definition of Done

- [x] Proyecto React + Vite creado y arrancando.
- [x] React Router configurado.
- [x] Rutas `/`, `/login`, `/register` y 404 operativas.
- [x] Home con hero, productos destacados y estados de carga/error/vacío.
- [x] Login y Register con formularios y validación básica.
- [x] Diseño responsive en 375, 768 y 1440 px.
- [x] Accesibilidad básica revisada.
- [x] `npm run build` correcto.
- [x] README, `.env.example` y ADR actualizados.
- [x] Tabla evaluativa completa con evidencias.
- [x] `RESUMEN.md` creado.
- [x] PDF con placeholders de capturas creado y enlazado.
- [x] `works/README.md` actualizado.
- [x] Sin secretos ni cambios accidentales.
- [x] Commits descriptivos.

---

## 14. Registro de progreso

| Fecha | Fase | Estado | Notas |
|---|---|---|---|
| 2026-11-16 | Especificación | ✅ | `SPEC.md` y `README.md` creados y aprobados con Tailwind y autenticación solo UI. |
| 2026-11-16 | Fase 0 | ✅ | Scaffold de Vite en carpeta temporal y merge controlado. |
| 2026-11-16 | Fase 1 | ✅ | Tailwind v4 configurado; layout con Header/Footer. |
| 2026-11-16 | Fase 2 | ✅ | Rutas anidadas, 404 y SPA verificada. |
| 2026-11-16 | Fase 3 | ✅ | Home con 6 productos reales, skeletons, error y vacío. |
| 2026-11-16 | Fase 4 | ✅ | Login/Register con validación; sin auth real. |
| 2026-11-16 | Fase 5 | ✅ | Sin overflow en 375/768/1440; foco de 2 px visible. |
| 2026-11-16 | Fase 6 | ✅ | README, `.env.example`, ADR y AGENTS actualizados. |
| 2026-11-16 | Fase 7 | ✅ | `lint` y `build` correctos; consola limpia. |
| 2026-11-16 | Fase 8 | ✅ | `RESUMEN.md`, PDF y cierre documental. |

### Desviaciones respecto a lo previsto

| Fecha | Desviación | Motivo |
|---|---|---|
| 2026-11-16 | D3 cambia de CSS propio a Tailwind CSS. | El usuario lo pidió para no rehacer la base en sesiones posteriores. |
| 2026-11-16 | No se crea `src/styles/tokens.css` ni `global.css`. | Tailwind v4 concentra los estilos base en `src/index.css` y el tema en `@theme`. |
| 2026-11-16 | No se implementa título de documento por página. | Fuera del alcance del enunciado; se valorará con la guía de estilos. |
| 2026-11-16 | El formulario de registro usa los campos reales del modelo `User`. | Mantiene coherencia con el contrato del backend para la futura conexión. |

---

## 15. Trazabilidad con el enunciado

| Apartado del enunciado | Requisito de esta SPEC |
|---|---|
| 2. Objetivos: Instalar React con Vite (0,33) | RF-01, RF-02, RT-01, V1–V3 |
| 2. Objetivos: Routing (0,33) | RF-03–RF-07, RT-03–RT-05, R1–R3 |
| 2. Objetivos: UI Básica (0,33) | RF-08–RF-15, RT-06–RT-13, U1–U4 |
| 4.1 Crear un proyecto React con Vite | Fase 0, D1, RT-01 |
| 4.2 Instalar React Router | Fase 2, RT-03 |
| 4.3 Crear estructura de rutas y páginas | Fase 2, RF-03–RF-05 |
| 4.4 Configurar React Router en `src/main.jsx` | Fase 2, RT-04, D2 |
| 4.5 Modificar las páginas y Home con productos | Fase 3–4, RF-08–RF-12, D3–D4 |
| Entregable: PDF con explicaciones y enlace a GitHub | E10, Fase 8 |

---

## 16. Referencias

- [`enunciado.md`](./enunciado.md) — copia archivada del enunciado de la Sesión 9 (14).
- [`README.md`](./README.md) — guía práctica de esta tarea.
- [`../../AGENTS.md`](../../AGENTS.md) — convenciones del frontend.
- [`../../../AGENTS.md`](../../../AGENTS.md) — enrutado y reglas comunes del proyecto.
- [`../../../backend/README.md`](../../../backend/README.md) — contrato y puesta en marcha de la API.
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
