# AGENTS.md — Instrucciones para agentes de IA

> Instrucciones obligatorias para cualquier agente que trabaje dentro de `frontend/`.
> Léelo completo, junto con el [`AGENTS.md` de la raíz](../AGENTS.md), antes de modificar código, documentación o la carpeta `works/`.

## 1. Propósito

Este archivo define el flujo de trabajo, las convenciones y las reglas de seguridad del frontend de Klavier. El objetivo es que cada sesión se trabaje de forma predecible: **primero se entiende el enunciado, después se especifica, luego se implementa y finalmente se verifica y se documenta**.

El [`AGENTS.md` de la raíz](../AGENTS.md) decide en qué subproyecto se trabaja según dónde esté `enunciado.md`; este archivo rige todo lo que ocurre dentro de `frontend/`.

Orden de prioridad:

1. Instrucciones explícitas del usuario en la conversación.
2. `../AGENTS.md` (enrutado y reglas comunes del proyecto).
3. Este `AGENTS.md`.
4. `enunciado.md` de la sesión.
5. `README.md`, ADRs y documentación existente.
6. Convenciones generales.

Si hay conflicto entre fuentes, pregunta antes de asumir.

---

## 2. Contexto del proyecto

Klavier es la aplicación web de un e-commerce de pianos. El frontend consume la API REST que vive en `../backend/`.

### Stack previsto

- **UI:** React con componentes funcionales y hooks.
- **Build:** **Vite + React + JavaScript** con npm. Proyecto creado con el template `react`.
- **Lenguaje:** JavaScript moderno (ES modules) y JSX. No TypeScript salvo que el enunciado lo pida.
- **Estilos:** **Tailwind CSS v4** mediante `@tailwindcss/vite` y `@import "tailwindcss"` en `src/index.css`. En la primera sesión los estilos son básicos; la guía de estilos y el acabado visual definitivo se harán en una sesión posterior. No se añade Bootstrap, Material UI ni otra librería visual sin justificarlo y sin un ADR.
- **Rutas:** React Router solo cuando la tarea necesite más de una vista. Si se añade, se documenta la decisión.
- **Estado:** `useState`, `useReducer` y Context. No se añade Redux, Zustand ni otra librería de estado sin necesidad justificada.
- **Datos:** `fetch` centralizado en `src/api/`. No se hacen llamadas sueltas desde los componentes.
- **Tests:** si el enunciado los pide, se añadirá Vitest + React Testing Library; si no, la verificación es manual y queda documentada.

### Estado actual

El frontend ya es una aplicación React creada con Vite. La base incluye React Router, Tailwind CSS, un layout compartido (`Header` + `Footer`), las rutas `/`, `/login`, `/register` y una página 404, además de la Home conectada a `GET /api/products`. Login y Register son **maquetas** validadas en cliente: la autenticación real se implementará en una sesión posterior.

La estilización es deliberadamente básica. La guía de estilos, los tokens definitivos y el acabado visual se abordarán en la siguiente sesión.

### Estructura actual

```text
frontend/
├── public/                 # imágenes y archivos estáticos
├── src/
│   ├── api/                # cliente HTTP y funciones por recurso
│   ├── components/         # componentes reutilizables
│   ├── context/            # auth, carrito, preferencias... (pendiente)
│   ├── hooks/              # hooks reutilizables
│   ├── pages/              # vistas por ruta
│   ├── utils/              # formateadores y helpers
│   ├── App.jsx             # layout con Header, Footer y Outlet
│   ├── index.css           # Tailwind y estilos base
│   └── main.jsx            # BrowserRouter y rutas
├── docs/adrs/              # decisiones arquitectónicas
├── .env.example
├── package.json
├── vite.config.js
├── works/
├── enunciado.md
└── README.md
```

Si el enunciado propone otra estructura, se puede adaptar, pero hay que dejar constancia en el `SPEC.md` y actualizar esta sección.

### Contrato de la API

La API está en `http://localhost:3000` por defecto. La URL se configura en el frontend con `VITE_API_URL`.

Formato general:

- Éxito: `{ "status": "success", "data": ... }`
- Éxito con listado paginado: `{ "status": "success", "data": [...], "pagination": { "page", "limit", "total", "totalPages" } }`
- Error: `{ "status": "error", "statusCode": 400, "message": "..." }`
- Borrado correcto: `204 No Content`

| Recurso | Endpoints principales | Notas para el frontend |
|---|---|---|
| Auth | `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/auth/me` | El login devuelve `accessToken` y `user`; el refresh viaja en una cookie `httpOnly`. `/me` exige `Authorization: Bearer`. |
| Products | `GET /api/products`, `GET /api/products/:id`, `POST`, `PATCH`, `DELETE` | `GET /api/products` devuelve un array dentro de `data`; actualmente no pagina. |
| Categories | `GET /api/categories`, `GET /api/categories/:id`, `POST`, `PATCH`, `DELETE` | El listado admite `active`, `name`, `sort`, `page` y `limit`, y devuelve `pagination`. |
| Users | `GET /api/users`, `GET /api/users/:id`, `POST`, `PATCH`, `DELETE` | El listado pagina y acepta filtros. `DELETE` desactiva al usuario. Zona de administración. |

**Autenticación en el cliente:**

- El **access token** se guarda en memoria (Context de auth), nunca en `localStorage` ni en una URL.
- El **refresh token** vive en una cookie `httpOnly` que JavaScript no puede leer. Para `/api/auth/refresh` y `/api/auth/logout` hay que usar `credentials: 'include'`.
- Al cargar la app, si no hay access token, se intenta recuperar la sesión con `POST /api/auth/refresh`; si falla, se muestra el login.
- Si una petición normal devuelve `401`, se intenta un refresh **una sola vez** y se repite la petición. Si el refresh falla, se limpia la sesión y se redirige al login. Evita bucles infinitos y no apliques ese reintento a `login`, `refresh` ni `logout`.
- El backend configura CORS con `FRONTEND_URL` (por defecto `http://localhost:5173`) y credenciales. Arranca el frontend en ese puerto o coordina el cambio de `FRONTEND_URL` con el backend.

**Seguridad importante:** hoy solo `/api/auth/me` está protegido en el backend. No uses la UI como barrera de seguridad: si una pantalla de administración necesita protección real, propón el cambio correspondiente en `backend/` y no lo des por hecho.

**Importante:** los comandos de npm se ejecutan desde `frontend/`, nunca desde la raíz `klavier/`.

---

## 3. Idioma

- **Código, nombres de archivos, componentes, hooks, campos, rutas y claves JSON:** inglés.
- **Textos de interfaz, mensajes de error, comentarios, README, ADRs, SPEC, RESUMEN y documentación:** español.
- **Contenido visible:** español de España. Moneda en EUR y fechas en formato `es-ES`.
- No mezcles idiomas dentro del mismo identificador.
- Los textos de la UI deben ser claros y naturales; evita mensajes técnicos o en inglés.

---

## 4. Flujo obligatorio por sesión

Cada sesión empieza con un `enunciado.md` en la raíz de `frontend/`.

### Paso 0 — Leer y entender

- Lee el `enunciado.md` completo.
- Revisa el código actual relacionado.
- Ejecuta `git status` y `git log --oneline -10`.
- Comprueba si el backend está arrancado y si la API responde, si la tarea lo necesita.
- **No escribas código todavía.**

### Paso 1 — Crear la unidad de trabajo

Crea `works/NNNN-slug/`:

- `NNNN`: siguiente número secuencial con 4 dígitos (`0001`, `0002`...).
- `slug`: corto, en inglés, kebab-case y descriptivo.
- Comprueba las carpetas existentes en `works/` antes de elegir el número.
- Nunca reutilices un número.
- La numeración es independiente de la de `backend/works/`.

### Paso 2 — Archivar el enunciado

Copia `enunciado.md` a `works/NNNN-slug/enunciado.md`. El de la raíz se sobrescribirá en la siguiente sesión; la copia conserva la trazabilidad.

### Paso 3 — Crear `SPEC.md`

Debe incluir, como mínimo:

- Metadatos: ID, título, proyecto, sesión, autor, fecha, estado, rama y documentos relacionados.
- Descripción breve.
- Contexto y estado inicial.
- Objetivo.
- Alcance incluido y fuera de alcance.
- Decisiones de diseño con alternativas descartadas y motivo (rutas, estado, estilos, API, componentes).
- Requisitos funcionales (`RF-xx`) y técnicos (`RT-xx`), incluyendo pantallas, componentes, estados de carga/error/vacío, llamadas a la API, responsive y accesibilidad.
- Flujo de usuario esperado.
- Plan de implementación con checkboxes.
- Tabla evaluativa ponderada según la rúbrica del enunciado: ID, criterio, peso, estado, evidencia y notas.
- Evidencias y entregables.
- Riesgos y casos límite.
- Definition of Done.
- Registro de progreso.
- Trazabilidad con los apartados del enunciado.
- Referencias.

### Paso 4 — Crear `README.md`

Debe explicar la tarea en lenguaje claro:

- Qué es y por qué existe.
- Punto de partida.
- Resultado esperado.
- Archivos que se van a tocar.
- Rutas y pantallas nuevas o modificadas.
- Endpoints o cambios de contrato con la API.
- Variables de entorno.
- Puesta en marcha (`npm install`, `npm run dev`, etc.).
- Flujo de prueba manual en el navegador.
- Checklist de aceptación.
- Entregables.
- Estado actual.

### Paso 5 — Confirmar antes de implementar

Muestra un resumen de `SPEC.md` y `README.md` y **espera confirmación explícita** del usuario antes de tocar código.

Si el usuario ya ha pedido implementar en el mismo mensaje, puedes continuar, pero deja claro qué vas a cambiar.

### Paso 6 — Implementar

- Sigue el orden del `SPEC.md`.
- Actualiza los checkboxes conforme completes fases.
- Mantén los cambios pequeños y coherentes con el código existente.
- Extrae componentes cuando se repitan; no crees abstracciones prematuras.
- Centraliza las llamadas a la API y el manejo de errores.
- Diseña los estados de carga, error y vacío desde el principio.
- Si aparece un problema no previsto, anótalo en el `SPEC.md`.

### Paso 7 — Verificar

- Arranca el frontend con `npm run dev` desde `frontend/`.
- Recorre el flujo afectado en el navegador.
- Revisa la consola: no debe haber errores ni advertencias nuevas.
- Revisa la pestaña Network: peticiones esperadas, códigos correctos, `credentials` cuando toque y ningún token en la URL.
- Comprueba el responsive al menos en 375, 768 y 1440 px de ancho.
- Comprueba la navegación con teclado, el foco visible, las etiquetas de los formularios y los textos alternativos de las imágenes.
- Si hay script de build, ejecuta `npm run build` y corrige los errores.
- Si la tarea toca la API, arranca el backend y verifica la integración real (CORS, cookie, respuestas).
- Revisa `git diff` y `git status`.
- **No afirmes que algo funciona sin evidencia.**

### Paso 8 — Cerrar y documentar

- Crea `works/NNNN-slug/RESUMEN.md` en lenguaje humano.
- Crea el **PDF del entregable** en la misma carpeta, a la vez que el `RESUMEN.md`, siguiendo la sección 6.2. Es el último entregable de la sesión.
- Rellena el `SPEC.md`: marca tareas, actualiza la tabla evaluativa con estado y evidencias, anota desviaciones y cambia el estado.
- Actualiza el `README.md` del proyecto si cambian rutas, scripts, variables o comportamiento.
- Crea o actualiza el ADR si hay una decisión arquitectónica o visual relevante.
- Actualiza `works/README.md` con el estado de la sesión y el enlace al PDF.
- Haz commits descriptivos.

---

## 5. Estructura de `works/`

Cada unidad de trabajo es autocontenida:

```text
works/
├── README.md                     # índice de sesiones
└── NNNN-slug/
    ├── enunciado.md              # copia del enunciado original
    ├── SPEC.md                   # especificación y tabla evaluativa
    ├── README.md                 # guía práctica de la tarea
    ├── RESUMEN.md                # informe final (se crea al terminar)
    └── MedinaPau_MOptSesionN.pdf # entregable con placeholders de capturas
```

Reglas:

- `NNNN` siempre con 4 dígitos.
- `slug` en inglés y kebab-case.
- No se escribe código de implementación dentro de `works/`.
- `works/README.md` se actualiza al crear y al cerrar cada sesión.
- El `RESUMEN.md` y el PDF no se crean al principio: se crean cuando la implementación termina.
- El PDF se crea al final, junto con el `RESUMEN.md`, y sigue el formato del ejemplo `../backend/works/0001-auth-refresh-token-rotation/MedinaPau_MOptSesion8.pdf`.
- Las capturas del PDF no se inventan: se sustituyen por placeholders que indican qué capturar, en qué archivo y en qué líneas, o qué pantalla y en qué estado.

---

## 6. Cierre de la sesión: `RESUMEN.md` y PDF del entregable

### 6.1 Contenido de `RESUMEN.md`

Debe ser entendible por alguien que no sea programador. Como mínimo:

- Qué se ha hecho.
- Qué decisiones se tomaron y por qué.
- Qué problemas aparecieron y cómo se resolvieron.
- Qué se ha verificado y con qué evidencias.
- Qué queda pendiente o fuera de alcance.
- Enlaces a `SPEC.md`, `README.md`, ADR y PDF.

Evita jerga innecesaria. Explica el “qué” y el “por qué”, no solo el “cómo”.

### 6.2 PDF del entregable

Al terminar la sesión, **a la vez que creas `RESUMEN.md`**, crea el PDF del entregable dentro de `works/NNNN-slug/`.

- **Nombre:** `MedinaPau_MOptSesion<N>.pdf`, donde `<N>` es el número de sesión del enunciado. Si el enunciado impone otro nombre, usa el del enunciado y déjalo anotado en el `SPEC.md`.
- **Formato:** replica el aspecto y la estructura del PDF de ejemplo: portada, secciones y pie de página con autor, sesión y número de página.
- **Plantilla:** sigue `../docs/templates/pdf.md`.
- **Contenido mínimo:** máximo 7 capturas en todo el PDF.
  1. Portada: “MOpt Frameworks”, “Sesión N”, título de la sesión, autor, email, fecha y URL del repositorio.
  2. “Qué he hecho”: 2–3 párrafos, unas 250–300 palabras y una página como máximo. Sin subtítulos, listas ni inventario de archivos.
  3. “Código principal”: 3–4 capturas de los componentes, hooks o servicios que sostienen la decisión de la sesión, en el orden en que se explican.
  4. “Pruebas en el navegador”: 2–3 capturas: resultado principal y, como máximo, móvil y un estado límite. Si la tarea toca integración, red, cookies o errores, una puede ser de DevTools.
  5. “Repositorio”: URL, rama y commits de la sesión.
- **Sin sección “Archivos principales”**: esa lista ya está en `README.md` y `RESUMEN.md`.
- **Capturas:** no pegues capturas reales ni imágenes de ejemplo. En cada sitio donde iría una captura, inserta un **placeholder visible** con esta información:
  - Número y título de la captura.
  - Qué hay que capturar y qué debe verse.
  - **Si es código:** archivo(s) y **rango(s) de líneas exactos** del código final. Por ejemplo: `src/components/ProductCard.jsx:12-48`.
  - **Si es una pantalla:** URL o ruta, viewport (por ejemplo, 1440×900 o 375×812), estado de la app (sin sesión, logueado, carrito con artículos, error...) y pasos para llegar.
  - **Si es DevTools/API:** petición, método, endpoint, código de respuesta, body esperado y pestaña (Network, Console, Application).
  - Cómo tomarla: VS Code con números de línea, navegador, DevTools o Postman.
- **Rangos de líneas:** calcúlalos al final, cuando el código ya no vaya a cambiar. Verifícalos con `nl -ba archivo | sed -n 'a,bp'` o `grep -n`. Si el código cambia después, actualiza los placeholders y vuelve a generar el PDF.
- **Generación:** crea primero una fuente editable (HTML o Markdown) y conviértela a PDF con la herramienta disponible. Guarda la fuente junto al PDF solo si el usuario lo pide; el entregable obligatorio es el PDF.
- **Enlace:** añade el PDF a `RESUMEN.md` y a `works/README.md`.
- **Commit:** incluye el PDF en el commit de cierre, salvo que el usuario indique lo contrario.

### 6.3 Plantilla de placeholder de código

Usa un bloque visualmente distinguible, por ejemplo:

```text
┌──────────────────────────────────────────────────────────────┐
│ CAPTURA PENDIENTE · Captura 1 — Tarjeta de producto          │
├──────────────────────────────────────────────────────────────┤
│ Qué capturar: VS Code con el componente abierto y sus        │
│ números de línea visibles.                                   │
│ Archivo: src/components/ProductCard.jsx                      │
│ Líneas: 12-48                                                │
│ Debe verse: props del producto, precio formateado en EUR,    │
│ imagen con alt, botón de añadir al carrito y estado vacío.   │
│ Cómo: abre el archivo, ve a las líneas indicadas y captura   │
│ la ventana completa.                                         │
└──────────────────────────────────────────────────────────────┘
```

### 6.4 Plantilla de placeholder de pantalla o API

```text
┌──────────────────────────────────────────────────────────────┐
│ CAPTURA PENDIENTE · Captura 4 — Listado de productos         │
├──────────────────────────────────────────────────────────────┤
│ Qué capturar: navegador en http://localhost:5173/products    │
│ Viewport: 1440×900                                           │
│ Estado: sin sesión, con 6 productos cargados y filtro activo │
│ Debe verse: grid de tarjetas, filtros, paginación y estado   │
│ de carga ya terminado.                                       │
│ Cómo: arranca frontend y backend, abre la ruta y captura la  │
│ ventana completa.                                            │
└──────────────────────────────────────────────────────────────┘
```

Para DevTools o API, sustituye “Viewport/Estado” por la petición y la respuesta esperada:

```text
┌──────────────────────────────────────────────────────────────┐
│ CAPTURA PENDIENTE · Captura 5 — Login y cookie               │
├──────────────────────────────────────────────────────────────┤
│ Qué capturar: DevTools → Network → POST /api/auth/login.     │
│ Debe verse: 200, accessToken en la respuesta y Set-Cookie    │
│ refreshToken con HttpOnly y SameSite=Strict.                 │
│ Comprueba también que el token no aparece en localStorage.   │
└──────────────────────────────────────────────────────────────┘
```

### 6.5 Reglas de los placeholders

- **Máximo 7 capturas en total**, código y pruebas incluidas. Si sobran, se recortan las de código, nunca la prueba principal.
- Un placeholder por captura, numerados en el mismo orden en que se leen.
- No dejes placeholders genéricos: siempre archivo y líneas, o ruta/viewport/estado, o petición/endpoint.
- No incluyas tokens, contraseñas ni datos personales reales en los textos de ejemplo.
- Si una captura necesita varios archivos, lista cada uno con su rango.
- Si una captura necesita líneas no contiguas, usa varios rangos: `12-18, 42-57`.
- El PDF debe ser legible sin abrir el código: el placeholder explica qué se demuestra y por qué.

---

## 7. Convenciones de código y UI

### 7.1 Estructura y nombres

- Componentes en `src/components/` y páginas en `src/pages/`.
- Componentes y archivos de componentes en `PascalCase`: `ProductCard.jsx`.
- Hooks en `camelCase` y empiezan por `use`: `useAuth`, `useProducts`.
- Funciones, variables y archivos de utilidades en `camelCase`: `formatPrice.js`.
- Constantes globales en `UPPER_SNAKE_CASE`.
- Una responsabilidad por archivo; evita componentes de más de ~150 líneas sin motivo.
- No mezcles lógica de negocio pesada con JSX: extrae hooks, utilidades o servicios.

### 7.2 Componentes y estado

- Componentes funcionales y hooks. No uses clases.
- Props explícitas y con nombres claros; evita `props` genéricos.
- Estado local por defecto. Sube el estado solo cuando lo compartan varios componentes.
- Usa Context para auth y carrito; no lo uses para todo.
- No dupliques estado que se pueda derivar de props o de otro estado.
- Mantén los efectos pequeños y con dependencias correctas. Limpia suscripciones y timers.
- No uses índices de array como `key` si la lista puede cambiar.

### 7.3 API y datos

- Centraliza las llamadas en `src/api/`. Cada recurso tiene su archivo y funciones con nombre: `getProducts`, `getProductById`, `login`, `refreshSession`.
- El cliente base usa `import.meta.env.VITE_API_URL || 'http://localhost:3000'`.
- Envía `credentials: 'include'` en las llamadas de auth que usan cookie.
- Envía `Authorization: Bearer <accessToken>` en las rutas protegidas.
- Convierte los errores de la API en mensajes claros para la UI; no muestres trazas internas.
- Maneja `401`, `403`, `404`, `409`, `422` y `500` con mensajes adecuados.
- No uses `fetch` directamente dentro de un componente si existe una función en `src/api/`.

### 7.4 Formularios y validación

- Formularios controlados.
- Cada campo tiene `label` asociado, `name`, `id` y autocompletado cuando corresponda.
- Valida en cliente para dar feedback rápido, pero no como única defensa: el backend valida de nuevo.
- Deshabilita el botón de envío mientras se envía y evita dobles envíos.
- Muestra errores junto al campo o en un resumen visible, con texto en español.
- No reveles si un email existe en login o registro; usa mensajes genéricos.

### 7.5 UI, estilos y responsive

- Usa **Tailwind CSS** con utilidades en `className`. Centraliza en `@theme` los tokens que deban reutilizarse (fuentes, colores de marca) y evita valores mágicos repetidos.
- Los estilos base (fondo, tipografía, foco, reduced motion) viven en `src/index.css`.
- No uses estilos inline salvo para valores dinámicos calculados.
- Diseño mobile-first. Comprueba 375, 768 y 1440 px como mínimo.
- No dejes pantallas en blanco: diseña estados de carga, error y vacío.
- Usa contenido real o placeholders claramente marcados; no dejes lorem ipsum en la entrega.
- Las imágenes de producto deben tener `alt` descriptivo, `loading="lazy"` cuando no sean críticas y un fallback si fallan.
- No hagas hotlink de imágenes de terceros sin permiso.
- Mantén una jerarquía visual clara: un `h1` por página y encabezados en orden.
- Si un componente necesita clases condicionales, constrúyelas con plantillas o arrays legibles; no generes clases dinámicas que Tailwind no pueda detectar.

### 7.6 Accesibilidad

- HTML semántico: `header`, `nav`, `main`, `section`, `footer`, `button`, `a`.
- Todo control interactivo debe ser accesible por teclado y tener foco visible.
- Usa `button` para acciones y `a` para navegación; no uses `div` con `onClick`.
- Etiquetas en formularios, `alt` en imágenes y `aria-*` solo cuando sea necesario.
- Contraste suficiente (WCAG AA como referencia).
- Respeta `prefers-reduced-motion` si añades animaciones.
- Los mensajes de error deben ser anunciados o visibles, no solo un cambio de color.

### 7.7 Seguridad en el cliente

- Nunca guardes access tokens o refresh tokens en `localStorage`, `sessionStorage` ni cookies accesibles por JavaScript.
- No metas secretos en variables `VITE_*`: todo lo que empieza por `VITE_` acaba en el bundle.
- No uses `dangerouslySetInnerHTML` salvo con HTML propio y saneado; si hay contenido de usuario, sanitízalo.
- No muestres `passwordHash`, tokens, IDs internos innecesarios ni mensajes de error del servidor que revelen detalles.
- Los enlaces externos llevan `rel="noopener noreferrer"` cuando abren en otra pestaña.
- No añadas dependencias sin justificarlas y sin actualizar `package.json` y la documentación.

### 7.8 Formato de datos

- Precios: `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`.
- Fechas: `Intl.DateTimeFormat('es-ES')` o el formato que pida el diseño.
- Textos largos: cuida los saltos de línea y evita desbordes.
- No inventes campos que la API no devuelve; si faltan datos, propón el cambio de contrato en `backend/`.

---

## 8. Documentación

- **README del proyecto:** stack, instalación, scripts, rutas, variables y estructura.
- **ADR:** `docs/adrs/NNN-titulo.md` con Contexto, Decisión, Alternativas, Consecuencias y Referencias, siguiendo `../docs/templates/adr.md`.
- **Plantillas y revisión:** copia las plantillas de `../docs/templates/` y ejecuta `/review-docs` antes de commitear documentación. El revisor corrige estructura y reporta huecos; no inventa contenido.
- **Diseño:** si la tarea define una dirección visual, guárdala en `docs/design.md` o en el `SPEC.md`; no la dejes solo en el código.
- **Diagramas de flujo:** `docs/diagrams/` si aportan claridad.
- **`.env.example`:** añade las claves nuevas sin valores reales. Como mínimo, `VITE_API_URL=http://localhost:3000`.
- **`works/`:** SPEC, README, RESUMEN y PDF por sesión.

Actualiza este `AGENTS.md` si cambia la estructura, el stack o una convención importante.

---

## 9. Seguridad

- No commitees `.env`, secretos, tokens, `node_modules`, `dist` ni capturas con datos sensibles.
- No loguees tokens, contraseñas ni respuestas completas de auth.
- El access token vive en memoria; el refresh token, en una cookie `httpOnly`.
- No intentes leer la cookie de refresh desde JavaScript: no se puede y no se debe.
- Usa `credentials: 'include'` solo contra la API propia y con CORS explícito.
- No confíes en la validación del cliente para permisos o reglas de negocio.
- No uses la UI como control de acceso: la autorización real debe estar en el backend.
- Revisa que el bundle no contenga secretos antes de cerrar la sesión.
- Si detectas una vulnerabilidad o un secreto expuesto, avisa al usuario y no lo publiques.

---

## 10. Verificación y cierre

Antes de decir que una tarea está terminada:

- [ ] `npm run dev` arranca sin errores.
- [ ] El flujo principal funciona en el navegador.
- [ ] La consola no muestra errores ni advertencias nuevas.
- [ ] Network muestra las peticiones esperadas, con los códigos correctos y sin tokens en la URL.
- [ ] La sesión se recupera al recargar (refresh) y el logout limpia el estado.
- [ ] El responsive se ha comprobado en 375, 768 y 1440 px.
- [ ] La navegación por teclado, el foco y las etiquetas funcionan.
- [ ] `npm run build` termina sin errores (si existe el script).
- [ ] No hay secretos ni tokens en el código, el bundle o `localStorage`.
- [ ] `SPEC.md` está actualizado.
- [ ] `RESUMEN.md` existe.
- [ ] El PDF del entregable existe, sigue el formato del ejemplo y sus placeholders indican archivo y líneas o pantalla y estado.
- [ ] El README y los ADR están al día.
- [ ] `works/README.md` está actualizado y enlaza el PDF.
- [ ] `git diff` no contiene cambios accidentales.

Si algo falla, dilo. No ocultes errores ni marques tareas como completadas sin evidencia.

---

## 11. Git

- Ramas: `feature/<slug>`, `fix/<slug>`, `docs/<slug>`.
- Commits: Conventional Commits con descripción en español:
  - `feat(catalog): añade listado de productos`
  - `fix(auth): evita bucle de refresh`
  - `docs: documenta la estrategia de sesión`
  - `chore(ui): configura Vite y ESLint`
- Commits pequeños y lógicos.
- No reescribas el historial ni hagas `push --force` sin permiso.
- No commitees archivos generados ni secretos.

---

## 12. Colaboración y modo Plan

- Si el usuario está en **modo Plan**, no modifiques archivos. Propón y espera.
- Si el usuario pide implementar mientras está en Plan, dile que cambie de agente.
- No borres ni sobrescribas trabajo que no entiendas; investígalo primero.
- Si el enunciado es ambiguo, documenta la suposición en el `SPEC.md` y pregunta antes de implementar.
- Respeta los cambios manuales del usuario.
- Sé claro y conciso; explica las decisiones, no solo el resultado.
- Si un cambio requiere tocar `backend/`, no lo hagas desde esta sesión sin permiso explícito; documenta el contrato y propón una sesión de backend.

---

## 13. Plantilla de referencia

Usa como ejemplo canónico la primera unidad de trabajo del frontend:

```text
works/0001-initial-setup/
├── enunciado.md
├── SPEC.md
├── README.md
├── RESUMEN.md                    # se crea al terminar
└── MedinaPau_MOptSesionN.pdf     # PDF con placeholders de capturas
```

Mientras no exista esa primera unidad, usa como referencia de formato y nivel de detalle:

```text
../backend/works/0001-auth-refresh-token-rotation/
├── enunciado.md
├── SPEC.md
├── README.md
├── RESUMEN.md
└── MedinaPau_MOptSesion8.pdf
```

---

## 14. Checklist rápido de sesión

- [ ] `enunciado.md` leído.
- [ ] Código actual revisado.
- [ ] `git status` y `git log` revisados.
- [ ] `works/NNNN-slug/` creado.
- [ ] `enunciado.md` archivado.
- [ ] `SPEC.md` creado.
- [ ] `README.md` creado.
- [ ] Confirmación del usuario.
- [ ] Implementación terminada.
- [ ] Verificación en navegador, consola y Network.
- [ ] Responsive y accesibilidad comprobados.
- [ ] `npm run build` correcto (si existe).
- [ ] `SPEC.md` rellenado.
- [ ] `RESUMEN.md` creado.
- [ ] PDF creado con placeholders (archivo + líneas o pantalla + estado) y enlazado.
- [ ] PDF con 7 capturas como máximo y sin «Archivos principales».
- [ ] README/ADR/documentación actualizados.
- [ ] `/review-docs` ejecutado y huecos de contenido reportados.
- [ ] `works/README.md` actualizado.
- [ ] Commits realizados.
