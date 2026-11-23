# Klavier — Frontend

Aplicación web de **Klavier**, un e-commerce de pianos. Este repositorio contiene el frontend en React y consume la API REST del repositorio [`../backend/`](../backend/).

## Stack

- **React 19** con componentes funcionales y hooks.
- **Vite 8** como servidor de desarrollo y empaquetador.
- **React Router DOM 7** para las rutas.
- **Tailwind CSS 4** con `@tailwindcss/vite`.
- **Oxlint** para el análisis estático.
- **JavaScript + JSX** (sin TypeScript).

## Requisitos

- Node.js 20 o superior (probado con Node 25).
- npm.
- El backend arrancado en `http://localhost:3000` para ver productos reales.

## Instalación

Desde `frontend/`:

```bash
npm install
```

Copia `.env.example` a `.env` si quieres cambiar la URL de la API:

```env
VITE_API_URL=http://localhost:3000
```

Si no existe `.env`, el cliente usa `http://localhost:3000` por defecto.

> Cualquier variable `VITE_*` acaba en el bundle y es pública. No metas secretos.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Arranca el servidor de desarrollo en `http://localhost:5173/`. |
| `npm run build` | Genera la build de producción en `dist/`. |
| `npm run preview` | Sirve localmente la build de producción. |
| `npm run lint` | Ejecuta Oxlint. |

## Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | `Home` | Hero, propuesta de valor y hasta 6 productos destacados. |
| `/login` | `Login` | Formulario de inicio de sesión (maqueta). |
| `/register` | `Register` | Formulario de registro (maqueta). |
| `*` | `NotFound` | Página 404 con enlace al inicio. |

Las rutas se declaran en `src/main.jsx` con `BrowserRouter` y `Routes`. `App.jsx` es el layout compartido (`Header`, `main` con `Outlet`, `Footer`).

## Estructura

```text
frontend/
├── docs/adrs/              # decisiones arquitectónicas
├── public/
│   ├── audio/piano/        # muestras del teclado (VSCO 2 CE, CC0)
│   └── favicon.svg
├── src/
│   ├── api/                # cliente HTTP y funciones por recurso
│   ├── audio/              # motor de audio del teclado (Web Audio)
│   ├── components/         # Header, Footer, tarjetas, campos de formulario
│   │   └── home/           # secciones de la Home (hero, manifiesto, pilares...)
│   ├── hooks/              # useProducts, usePiano
│   ├── motion/             # registro de GSAP y ScrollTrigger
│   ├── pages/              # Home, Login, Register, NotFound
│   ├── utils/              # formateadores (precio, año) y modelo de notas
│   ├── App.jsx             # layout compartido
│   ├── index.css           # Tailwind, tokens y estilos base
│   └── main.jsx            # BrowserRouter y rutas
├── .env.example
├── vite.config.js
└── package.json
```

## API

La Home consume `GET /api/products`. La respuesta esperada es:

```json
{
  "status": "success",
  "data": [
    {
      "_id": "...",
      "name": "Steinway & Sons Model B-211",
      "brand": "Steinway & Sons",
      "model": "Model B-211",
      "manufacturingYear": 2024,
      "price": 125000,
      "currentStock": 2,
      "images": []
    }
  ]
}
```

`src/api/client.js` centraliza la URL base, las cabeceras y los errores. Si la API no responde, la Home muestra un mensaje con botón de reintento; si no hay productos, muestra un estado vacío.

## Estado actual

La base del frontend está terminada y la Home funciona con la API real. **Login y Register son maquetas**: validan los campos en cliente, pero no autentican ni llaman a la API.

La interfaz sigue la dirección visual **«Lacquer»**: papel marfil, negro laca, rojo fieltro como único acento, esquinas rectas y tipografía del sistema. La Home incorpora animaciones de scroll con GSAP (entrada del hero, teclado que se hunde, manifiesto pinneado por palabras, pilares, grid de productos y cierre); todas se desactivan con `prefers-reduced-motion: reduce`.

La autenticación real y las rutas protegidas quedan para las siguientes sesiones.

El teclado del hero es un instrumento real: se toca con el ratón, el dedo o el teclado del
ordenador, y suena con dieciséis muestras de piano cargadas de forma perezosa. Ver
[`public/audio/piano/README.md`](./public/audio/piano/README.md) para el detalle del recorte y la
licencia.

Consulta el [ADR 001](./docs/adrs/0001-frontend-foundation.md) para la base técnica y el [ADR 002](./docs/adrs/0002-visual-direction-and-motion.md) para la dirección visual y la decisión de usar GSAP.

## Créditos

Las muestras de piano son de **VSCO 2 Community Edition**, de Versilian Studios LLC (grabadas por
Sam Gossner y Simon Dalzell), distribuidas bajo **CC0 1.0**. Se descargaron desde el repositorio
público de [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) y se recortaron y
recomprimieron para esta web.

## Autor

Pau Medina Vázquez — Proyecto académico, curso 2025-2026.
