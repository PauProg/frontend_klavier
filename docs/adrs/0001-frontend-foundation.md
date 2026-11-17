# ADR-001: Base del frontend: Vite, React Router y Tailwind CSS

| Campo | Valor |
|---|---|
| **ID** | `ADR-001` |
| **Fecha** | 2026-11-16 |
| **Estado** | Aceptada |
| **Ámbito** | `frontend` |
| **Sesión** | Sesión 9 (14) |

## Contexto

El repositorio `frontend/` era un esqueleto de documentación: no había aplicación React, servidor de desarrollo ni dependencias instaladas. La primera sesión del frontend debía crear la base de la aplicación, instalar React Router y maquetar una UI básica que consumiera la API existente.

Había tres decisiones que condicionaban el resto del proyecto:

1. Cómo crear el proyecto sin perder la documentación ya existente (`AGENTS.md` y `README.md`).
2. Cómo gestionar los estilos y si introducir un framework CSS.
3. Cómo organizar las rutas y las llamadas a la API.

## Decisión

### 1. Vite + React + JavaScript

Se creó el proyecto con el template `react` de Vite, en una carpeta temporal dentro de `frontend/`, y se movieron a la raíz solo los archivos generados. Se conservaron intactos los archivos existentes del repositorio.

Se mantiene **JavaScript con JSX**, sin TypeScript, porque el enunciado pide el template `react` y no menciona tipos.

### 2. Tailwind CSS v4

Se instaló Tailwind CSS con la integración oficial para Vite:

- `tailwindcss` y `@tailwindcss/vite` en `devDependencies`.
- Plugin `tailwindcss()` en `vite.config.js`.
- `@import "tailwindcss";` en `src/index.css`.
- Tokens mínimos en el bloque `@theme` (fuente serif de marca).

No se creó `tailwind.config.js`. En esta sesión los estilos son **básicos y utilitarios**; la dirección visual definitiva y la guía de estilos se dejarán para la siguiente sesión.

### 3. React Router con rutas anidadas

- `BrowserRouter` vive únicamente en `src/main.jsx`.
- `App.jsx` actúa como layout: `Header`, `<main>` con `<Outlet />` y `Footer`.
- Las páginas son `Home`, `Login`, `Register` y `NotFound`.
- El 404 cubre cualquier ruta desconocida y ofrece un enlace de vuelta al inicio.

### 4. API centralizada

- `src/api/client.js` concentra la URL base (`VITE_API_URL` con fallback a `http://localhost:3000`), las cabeceras, el manejo de errores y `credentials: 'include'`.
- `src/api/products.js` expone funciones por recurso (`getProducts`).
- `src/hooks/useProducts.js` gestiona carga, error, cancelación y reintento.
- La Home muestra hasta 6 productos y cubre estados de carga, error y vacío.

`credentials: 'include'` se deja preparado para las futuras llamadas de autenticación con cookie `httpOnly`. No se envía ningún token en esta sesión.

## Alternativas consideradas

| Alternativa | Motivo del descarte |
|---|---|
| Ejecutar `npm create vite` directamente en `frontend/` | El directorio no estaba vacío; se arriesgaba a sobrescribir documentación. |
| CSS propio con variables | El usuario pidió Tailwind ahora para no rehacer la base en sesiones posteriores. |
| Bootstrap | No se pidió y añade un look genérico difícil de adaptar a una identidad propia. |
| Rutas planas sin layout | Duplicaría cabecera y pie en cada página. |
| Datos mock en la Home | La API ya existe; usar datos reales demuestra la integración y permite detectar problemas de CORS. |
| Implementar login real y rutas protegidas | Amplía el alcance de una sesión centrada en Vite, routing y UI. Se pospone a la sesión de autenticación. |
| TypeScript | El enunciado no lo pide y añade fricción a una primera sesión. |

## Consecuencias

### Positivas

- La base del proyecto queda creada y reproducible con `npm install && npm run dev`.
- Tailwind queda listo para la siguiente sesión sin deuda de configuración.
- El layout compartido evita duplicar cabecera y pie.
- La API está centralizada: añadir autenticación o catálogo no requerirá reescribir componentes.
- Los estados de carga, error y vacío están cubiertos desde el principio.

### Negativas y límites

- Tailwind v4 usa una integración distinta a la configuración clásica de v3 (`postcss` + `tailwind.config.js`). Si el curso exige v3, habrá que adaptar la configuración.
- Los estilos son intencionadamente básicos; no hay todavía una guía visual ni tokens completos.
- Login y Register no autentican: son maquetas validadas en cliente.
- No hay tests automatizados; la verificación de esta sesión es manual y está documentada en el `RESUMEN.md`.

## Referencias

- [Vite](https://vite.dev/)
- [Tailwind CSS + Vite](https://tailwindcss.com/docs/installation/using-vite)
- [React Router](https://reactrouter.com/)
