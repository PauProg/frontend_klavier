# Sesión 9 (14)

**Desarrollo Web Full Stack (React, Node, Mongo)**  
**Curso 2025-2026**  
**Práctica: E-commerce. Sesión 9 (14)**

---

## Índice

1. Fechas
2. Objetivos
4. Trabajo durante la sesión y antes de la siguiente sesión
   - 4.1 Crear un proyecto React con Vite
   - 4.2 Instalar React Router para gestionar rutas
   - 4.3 Crear estructura básica de rutas y páginas
   - 4.4 Configurar React Router
   - 4.5 Modifica las páginas...
- Referencias
- Apéndices
  - A. Comandos útiles de Node/Nodemon
  - B. Archivo .gitignore recomendado
  - C. Validaciones habituales en Mongoose
  - D. Errores comunes y depuración
- Entregable de la Sesión 9 (14)

---

## 1. Fechas

- 10/11 – 17/12

---

## 2. Objetivos

| Peso | ¿Preferente? | Funcionalidad |
| :--- | :---: | :--- |
| 0,33 | ✓ | Instalar React con Vite |
| 0,33 | | Routing |
| 0,33 | | UI Básica |

---

## 4. Trabajo durante la sesión y antes de la siguiente sesión

**Objetivos:**

- Crear un proyecto React con Vite.
- Configurar rutas para login, registro y páginas protegidas.
- Añadir UI sencilla y funcional para la página de inicio.

### 4.1 Crear un proyecto React con Vite

¿Para qué Vite? Es una herramienta moderna, rápida y fácil de usar para crear proyectos React.

#### 4.1.1. Instala react + vite

```bash
npm create vite@latest frontend-react -- --template react
```

> **¡IMPORTANTE!**  
> Donde `"frontend"` debéis poner el nombre de la carpeta donde queréis poner el vuestro frontend (la parte visual de vuestra tienda). Se recomienda separar el backend del frontend, por ello debéis hacerlo fuera de la carpeta de donde tenéis el backend de vuestro proyecto.

La estructura de carpetas debe quedar similar a esta:

```text
/proyecto
  /backend
    /models
    /routes
    /controllers
    /services
    app.js
    package.json          # Cartera per al backend (Node.js)
  /frontend               # Cartera per al frontend (React)
    /src
    index.html
    package.json
```

Ejemplo de ejecución en terminal:

```text
MOD_OPTATIVO - esbuild npm create vite@latest homemade_frontend --template react TER...
alejandra@MacBook-Pro-de-Alejandra MOD_OPTATIVO % npm create vite@latest homemade_frontend
plate react
Need to install the following packages:
create-vite@8.2.0
Ok to proceed? (y) y
--tem
> npx
create-vite homemade_frontend --template react
Use rolldown-vite (Experimental)?:
No
Install with npm and start now?
Yes
Scaffolding project in /Users/alejandra/Documents/jaume_viladoms/2025_2026/DAW2/MOD_OPTATIVO/hom
emade_frontend...
Installing dependencies with npm...
added 156 packages, and audited 157 packages in 25s
33 packages are looking for funding
run `npm fund for details
found
vulnerabilities
Starting dev server...
> homemade_frontend@0.0.0 dev
> vite
VITE v7.2.4 ready in 1531 ms
Local: http://localhost: 5173/
Network: use --host to expose
press henter to show help
```

#### 4.1.2 Entra al directorio, instala dependencias y ejecuta react:

```bash
cd "frontend"
npm install
npm run dev
```

#### 4.1.3 Verifica en el navegador:

Accedeix a `http://localhost:5173/` y deberías de ver la interfaz React base.

```text
localhost:5173
Vite + React
count is 0
Edit src/App.jsx and save to test HMR
Click on the Vite and React logos to learn more
```

---

### 4.2 Instalar React Router para gestionar rutas

Desde la carpeta del proyecto del frontend que has creado, instala React Router:

```bash
npm install react-router-dom
```

Ahora podrás crear diferentes páginas y navegar entre ellas.

---

### 4.3 Crear estructura básica de rutas y páginas

En la carpeta `"src"`, crea archivos para las páginas:

- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/Home.jsx`

---

### 4.4 Configurar React Router

Configurar React Router en `src/main.jsx` (crear el archivo). Modifica este archivo para gestionar las rutas:

Ejemplo:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/cliente'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
```

---

### 4.5 Modifica las páginas

Crea la página principal `"home"` de vuestra aplicación donde se muestren los productos principales más importantes de vuestra tienda en línea.

Puedes utilizar los frameworks CSS (bootstrap o tailwind).

**Bootstrap:**

```bash
npm install bootstrap
```

**Tailwind:**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

---

## Referencias

- React
- Bootstrap
- Tailwind

---

## Apéndices

### A. Comandos útiles de Node/Nodemon

- `npm run dev` → Iniciar en modo desarrollo.
- `CTRL+C` → detener servidor.
- Escribir de forma clara y breve, no más de una página.

### B. Archivo .gitignore recomendado

```text
node_modules/
dist/
.env
```

### C. Validaciones habituales en Mongoose

- `required`
- `minlength`
- `maxlength`
- `enum`
- `unique`
- `match`

### D. Errores comunes y depuración

- No cargar `.env` → `MONGO_URI` indefinido.
- Puerto 3000 ocupado hay que cambiar `PUERTO` al `.env`.
- Índices duplicados si se hacen cambios frecuentes en el modelo.

---

## Entregable de la Sesión 9 (14)

PDF con todas las explicaciones y enlace a GitHub.