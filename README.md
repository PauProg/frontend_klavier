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
├── public/                 # favicon y estáticos
├── src/
│   ├── api/                # cliente HTTP y funciones por recurso
│   ├── components/         # Header, Footer, tarjetas, campos de formulario
│   ├── hooks/              # useProducts
│   ├── pages/              # Home, Login, Register, NotFound
│   ├── utils/              # formateadores (precio, año)
│   ├── App.jsx             # layout compartido
│   ├── index.css           # Tailwind y estilos base
│   └── main.jsx            # BrowserRouter y rutas
├── works/                  # unidades de trabajo por sesión
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

La base del frontend está terminada y la Home funciona con la API real. **Login y Register son maquetas**: validan los campos en cliente, pero no autentican ni llaman a la API. La autenticación, las rutas protegidas y la guía de estilos definitiva quedan para las siguientes sesiones.

Consulta [`works/0001-react-vite-router-setup`](./works/0001-react-vite-router-setup/) y el [ADR 001](./docs/adrs/0001-frontend-foundation.md) para el detalle de las decisiones.

## Autor

Pau Medina Vázquez — Proyecto académico, curso 2025-2026.
