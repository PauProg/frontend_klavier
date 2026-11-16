# RESUMEN — Sesión 9 (14): base del frontend con React, Vite, React Router y Home

**Proyecto:** Klavier — frontend de e-commerce de pianos  
**Sesión:** 9 (14), curso 2025-2026  
**Fecha de cierre:** 16 de noviembre de 2026  
**Rama:** `feature/react-vite-router-setup`  
**Autor:** Pau Medina Vázquez

---

## Qué se ha hecho

Se ha creado desde cero la aplicación React del frontend de Klavier. Hasta esta sesión el repositorio solo contenía documentación y un `package.json` de ejemplo; ahora hay un proyecto real que arranca con `npm run dev`, compila con `npm run build` y consume la API existente del backend.

La aplicación se ha montado con **Vite + React + JavaScript** y utiliza **React Router** para moverse entre tres páginas: inicio, inicio de sesión y registro. Las tres comparten la misma cabecera y el mismo pie mediante un layout común, de forma que la navegación no recarga la página. Además se ha añadido una página 404 para las direcciones que no existen.

La página de inicio tiene un hero de presentación, una sección con tres motivos para comprar en Klavier y un bloque de **productos destacados** que se leen de la API real (`GET /api/products`). De cada piano se muestra la imagen o un dibujo de respaldo, la marca, el modelo, el nombre, el año, la disponibilidad y el precio en euros. La Home contempla cuatro situaciones: mientras carga muestra esqueletos; si la API falla muestra un aviso con botón de reintento; si no hay productos muestra un estado vacío; y si hay datos muestra hasta seis tarjetas.

Las páginas de login y registro están **maquetadas y validadas en el navegador**, pero no autentican todavía. El registro reproduce los campos del modelo de usuario del backend (nombre, apellidos, fecha de nacimiento, correo, teléfono, nacionalidad y contraseña) con las mismas reglas básicas: contraseña de 12 caracteres y teléfono de 9 dígitos. Ambas pantallas avisan de que la conexión real llegará en la siguiente sesión y enlazan entre sí.

Se ha instalado **Tailwind CSS 4** con su integración oficial para Vite. Los estilos de esta sesión son deliberadamente básicos: la dirección visual definitiva y la guía de estilos se han dejado para la siguiente sesión, tal y como se acordó. Aun así se ha definido una paleta sobria de piedra y ámbar, una tipografía serif para los títulos y un foco visible para navegar con teclado.

La URL de la API se centraliza en `VITE_API_URL`, con `http://localhost:3000` como valor por defecto. Todas las llamadas pasan por `src/api/client.js`, que también prepara `credentials: 'include'` para las futuras peticiones autenticadas. No se ha tocado el backend.

---

## Decisiones y por qué

| Decisión | Por qué |
|---|---|
| Crear el proyecto de Vite en una carpeta temporal y mover solo lo generado. | `frontend/` no estaba vacío: así se conservaron `AGENTS.md`, `enunciado.md`, `works/` y el `README.md` sin riesgo de sobrescribirlos. |
| Usar Tailwind CSS en lugar de CSS propio. | El usuario lo pidió expresamente para no rehacer la base en sesiones posteriores. En esta sesión se usa de forma sencilla. |
| Mantener Login y Register como UI, sin autenticación real. | El enunciado detallado solo pide las páginas; la autenticación con access token y cookie se trabajará en la siguiente sesión. |
| Consumir la API real en la Home en lugar de datos de ejemplo. | La API ya existe y así se comprueba de verdad la integración, el CORS y el formato de respuesta. |
| Usar rutas anidadas con `App.jsx` como layout. | Evita duplicar cabecera y pie en cada página y deja una estructura clara para crecer. |
| Centralizar la API en `src/api/` y el estado de carga en un hook. | Los componentes quedan simples y el manejo de errores y reintentos está en un único sitio. |
| Añadir un 404 explícito. | Demuestra que el routing funciona y ofrece una salida clara al usuario. |
| No implementar tests automatizados. | El enunciado no los pide; la verificación se ha hecho en navegador y queda documentada. |

El detalle completo está en el [ADR 001](../../docs/adrs/001-frontend-foundation.md).

---

## Problemas encontrados y cómo se resolvieron

1. **El directorio `frontend/` ya tenía documentación.** Ejecutar el scaffold de Vite directamente podía sobrescribirla. Se creó en `.vite-tmp` y se copiaron a la raíz solo los archivos generados.
2. **El `package.json` inicial era un esqueleto CommonJS.** Se sustituyó por el del template de React, con `type: module` y los scripts de Vite, y se conservaron el nombre y la descripción del proyecto.
3. **Tailwind v4 no usa la configuración clásica.** En lugar de `tailwind.config.js` y PostCSS se usó `@tailwindcss/vite` con `@import "tailwindcss"` en `src/index.css`. Queda documentado en el ADR por si el curso exige la configuración de v3.
4. **Oxlint avisó de `new Date()` durante el render en el pie.** Se movió el cálculo del año a una constante de módulo. Ahora `npm run lint` termina sin avisos.
5. **Las capturas de móvil en Chrome headless parecían recortadas.** Era una limitación de `--window-size` en macOS, no un desbordamiento real. Se verificó con Playwright y un viewport real: en las 12 combinaciones de página y tamaño, `scrollWidth` coincide con `clientWidth`.
6. **La API estaba arrancada y respondió a la primera.** No hizo falta tocar CORS ni el backend; la petición `GET http://localhost:3000/api/products` devolvió `200`.

---

## Qué se ha verificado

Todas las comprobaciones se ejecutaron con el frontend en `http://localhost:5173` y el backend en `http://localhost:3000`.

| Comprobación | Resultado |
|---|---|
| `npm run dev` | Arranca con Vite 8.3.8 sin errores. |
| `npm run build` | Termina correctamente; genera `dist/index.html` y assets. |
| `npm run lint` | Oxlint sin errores ni avisos. |
| Home con API real | Se renderizan 6 tarjetas con productos reales y precios en EUR. |
| Home sin backend | Aparece el aviso de error y el botón «Reintentar» recupera los productos al volver la API. |
| Home sin productos | Se muestra el estado vacío «Todavía no hay pianos publicados». |
| Rutas `/`, `/login`, `/register`, `/no-existe` | Cada una muestra su página; el 404 incluye enlace al inicio. |
| Navegación SPA | El objeto `window` se conserva al cambiar de página: no hay recarga completa. |
| Validación de login | Con campos vacíos aparecen los dos errores; con datos válidos se muestra el aviso de maqueta. |
| Validación de registro | Se muestran los siete errores esperados; con datos válidos aparece el aviso de maqueta. |
| Responsive | Sin desbordamiento horizontal en 375, 768 y 1440 px en las cuatro rutas. |
| Teclado y foco | Los cinco primeros elementos reciben un foco visible de 2 px. |
| Consola y red | Sin errores propios; la única entrada `ERR_FAILED` fue la caída de API simulada a propósito. |
| Almacenamiento | `localStorage` y `sessionStorage` vacíos; no se guardan tokens. |

Las capturas concretas que faltan por hacer están descritas en el PDF del entregable, con archivo, líneas y estado de la aplicación.

---

## Qué queda pendiente o fuera de alcance

- **Autenticación real:** login, registro, refresh token, logout, contexto de sesión y rutas protegidas.
- **Guía de estilos y acabado visual definitivo:** tokens completos, tipografía, componentes y revisión de diseño.
- **Catálogo completo:** listado con filtros, búsqueda, paginación y detalle de producto.
- **Carrito, favoritos y checkout.**
- **Tests automatizados** y despliegue en producción.

Nada de esto se ha tocado en el backend: el contrato de la API se mantiene igual.

---

## Enlaces

- [SPEC.md](./SPEC.md) — alcance, requisitos, decisiones y tabla evaluativa.
- [README.md](./README.md) — guía práctica, rutas, API y puesta en marcha.
- [ADR 001](../../docs/adrs/001-frontend-foundation.md) — base del frontend.
- [PDF del entregable](./MedinaPau_MOptSesion9.pdf) — informe con placeholders de capturas.
- [Repositorio](https://github.com/PauProg/frontend_klavier) — rama `feature/react-vite-router-setup`.
