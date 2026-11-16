# README — Sesión 9 (14): base del frontend con React, Vite y React Router

## Qué es y por qué existe

Esta es la primera sesión del frontend de Klavier. Hasta ahora solo existía la API; ahora se crea la aplicación React que usará el cliente para ver la tienda, iniciar sesión y registrarse.

El objetivo de la sesión es dejar una base sólida: proyecto React con Vite, rutas con React Router, una página de inicio con productos y dos páginas de formulario (login y registro). No se implementa todavía la autenticación real ni el carrito.

---

## Punto de partida

`frontend/` solo contiene documentación y un `package.json` de ejemplo. No hay `src/`, no hay React instalado y no hay servidor de desarrollo.

El backend ya está construido y expone `GET /api/products`, que devuelve los productos de la tienda. La API arranca en `http://localhost:3000` y permite CORS desde `http://localhost:5173`.

---

## Resultado esperado

Al terminar:

- `npm run dev` arranca la aplicación en `http://localhost:5173/`.
- La Home muestra una cabecera, un hero, productos destacados y un pie de página.
- Los productos se leen de la API real; si la API falla, se muestra un error con botón de reintento.
- `/login` y `/register` muestran formularios maquetados y validados.
- Una ruta desconocida muestra una página 404.
- La interfaz funciona en móvil, tablet y escritorio.
- Tailwind CSS está instalado y configurado, con estilos básicos.
- `npm run build` genera la versión de producción.

---

## Archivos que se van a tocar

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
├── .oxlintrc.json
├── .env.example
├── src/
│   ├── api/
│   │   ├── client.js
│   │   └── products.js
│   ├── components/
│   │   ├── AuthShell.jsx
│   │   ├── Footer.jsx
│   │   ├── FormField.jsx
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductGrid.jsx
│   ├── hooks/
│   │   └── useProducts.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   └── Register.jsx
│   ├── utils/
│   │   └── format.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/
│   └── adrs/
│       └── 001-frontend-foundation.md
├── README.md
└── works/
    └── 0001-react-vite-router-setup/
        ├── enunciado.md
        ├── SPEC.md
        ├── README.md
        ├── RESUMEN.md
        └── MedinaPau_MOptSesion9.pdf
```

---

## Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | `Home` | Página principal con hero y productos destacados. |
| `/login` | `Login` | Formulario de inicio de sesión (maqueta). |
| `/register` | `Register` | Formulario de registro (maqueta). |
| `*` | `NotFound` | Página 404 con enlace al inicio. |

Las rutas se configuran en `src/main.jsx` con `BrowserRouter` y en `src/App.jsx` con `Routes`/`Route` y `<Outlet />`.

---

## Estilos con Tailwind

La UI se maqueta con **Tailwind CSS** y estilos básicos. La dirección visual definitiva y la guía de estilos se dejarán para la siguiente sesión.

La integración usada es la oficial para Vite:

- `tailwindcss` y `@tailwindcss/vite` en `devDependencies`.
- Plugin `tailwindcss()` en `vite.config.js`.
- `@import "tailwindcss";` en `src/index.css`.
- Utilidades de Tailwind en los componentes (`className`).

No se crea un `tailwind.config.js` salvo que haga falta una personalización avanzada.

---

## API utilizada

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/api/products` | Obtener los productos para la Home. |

La respuesta tiene la forma:

```json
{
  "status": "success",
  "data": [
    {
      "_id": "...",
      "name": "Piano vertical ...",
      "brand": "...",
      "model": "...",
      "manufacturingYear": 1998,
      "price": 3200,
      "images": ["..."],
      "categories": []
    }
  ]
}
```

La Home toma los primeros 6 productos como destacados. Si la API devuelve una lista vacía, se muestra un estado vacío. Si la petición falla, se muestra un error con reintento.

No se modifica el backend en esta sesión.

---

## Variables de entorno

Crear `frontend/.env` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

Si no se crea el `.env`, el código usa `http://localhost:3000` como valor por defecto.

> Recuerda: cualquier variable que empiece por `VITE_` acaba en el bundle y es pública. No metas secretos.

---

## Puesta en marcha

### 1. Instalar dependencias

Desde `frontend/`:

```bash
npm install
```

### 2. Arrancar el frontend

```bash
npm run dev
```

Abre `http://localhost:5173/`.

### 3. Arrancar el backend (opcional, para ver productos reales)

Desde `backend/api/`:

```bash
npm run dev
```

La API debe responder en `http://localhost:3000`. Si no está arrancada, la Home mostrará el estado de error.

### 4. Build de producción

```bash
npm run build
npm run preview
```

---

## Flujo de prueba manual

1. Abrir `http://localhost:5173/`.
2. Comprobar que la Home carga con el hero y el menú.
3. Con el backend arrancado, comprobar que aparecen hasta 6 productos.
4. Pulsar “Iniciar sesión” y comprobar que navega a `/login`.
5. Pulsar “Crear cuenta” y comprobar que navega a `/register`.
6. Enviar un formulario vacío y comprobar los mensajes de validación.
7. Escribir una URL inexistente, por ejemplo `/no-existe`, y comprobar la página 404.
8. Parar el backend y recargar la Home: debe aparecer el error con “Reintentar”.
9. Volver a arrancar el backend y pulsar “Reintentar”: deben volver los productos.
10. Reducir la ventana a 375, 768 y 1440 px y comprobar que no hay desbordes.
11. Recorrer el menú y los formularios con `Tab`.
12. Ejecutar `npm run build` y comprobar que termina sin errores.

---

## Checklist de aceptación

- [ ] `npm run dev` arranca sin errores.
- [ ] La app se ve en `http://localhost:5173/`.
- [ ] `/` muestra la Home.
- [ ] `/login` muestra el formulario de login.
- [ ] `/register` muestra el formulario de registro.
- [ ] La navegación no recarga la página.
- [ ] Una ruta desconocida muestra 404.
- [ ] La Home muestra productos de la API.
- [ ] La Home tiene estados de carga, error y vacío.
- [ ] Tailwind está instalado y se usa en la UI con estilos básicos.
- [ ] Los precios se muestran en EUR.
- [ ] Los formularios validan campos obligatorios.
- [ ] La interfaz es responsive en 375, 768 y 1440 px.
- [ ] La navegación por teclado y el foco funcionan.
- [ ] `npm run build` termina correctamente.
- [ ] No hay secretos en el código ni en `VITE_*`.
- [ ] README, `.env.example` y ADR actualizados.
- [ ] `RESUMEN.md` y PDF del entregable creados.

---

## Entregables

- Aplicación React + Vite funcionando.
- Rutas y páginas base.
- Home con productos destacados.
- Formularios de login y registro maquetados.
- `README.md` actualizado.
- `.env.example`.
- ADR de la base del frontend.
- `works/0001-react-vite-router-setup/` con `SPEC.md`, `README.md`, `RESUMEN.md` y PDF con placeholders de capturas.
- Enlace al repositorio en el PDF.

---

## Estado actual

`Completado`. Implementado, verificado y documentado el 2026-11-16. Consulta [`RESUMEN.md`](./RESUMEN.md) y el PDF del entregable.
