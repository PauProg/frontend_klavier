# Works — Índice de sesiones (frontend)

Esta carpeta contiene una unidad de trabajo por sesión del frontend. Cada unidad es autocontenida y sigue el flujo definido en [`AGENTS.md`](../AGENTS.md).

## Contenido de cada unidad

```text
works/NNNN-slug/
├── enunciado.md              # copia del enunciado original de la sesión
├── SPEC.md                   # especificación, requisitos y tabla evaluativa
├── README.md                 # guía práctica de la tarea
├── RESUMEN.md                # informe final (se crea al terminar)
└── MedinaPau_MOptSesionN.pdf # PDF con placeholders de capturas (se crea al terminar)
```

El PDF se crea al final, junto con el `RESUMEN.md`. Donde irían las capturas, incluye placeholders que indican qué capturar, en qué archivo y en qué líneas, o qué pantalla y en qué estado.

## Sesiones

| ID | Sesión | Título | Fecha | Estado | Carpeta |
|---|---|---|---|---|---|
| `0001` | Sesión 9 (14) | Base del frontend con React, Vite, React Router y Home | 2026-11-16 | `Completado` | [`0001-react-vite-router-setup`](./0001-react-vite-router-setup/) |

## Entregables

| Sesión | PDF |
|---|---|
| Sesión 9 (14) | [`MedinaPau_MOptSesion9.pdf`](./0001-react-vite-router-setup/MedinaPau_MOptSesion9.pdf) |

## Estados posibles

- `Especificado` — existen `SPEC.md` y `README.md`, pero no se ha implementado.
- `En curso` — implementación empezada.
- `Completado` — implementado, verificado y documentado; `RESUMEN.md` y PDF creados.
- `Parcial` — parte del alcance completada; queda trabajo pendiente documentado.
- `Bloqueado` — no se puede continuar sin una decisión o dependencia externa.

## Cómo añadir una nueva sesión

1. Crear `works/NNNN-slug/` con el siguiente número secuencial.
2. Copiar `enunciado.md` de la raíz a la nueva carpeta.
3. Crear `SPEC.md` y `README.md`.
4. Añadir una fila a la tabla de sesiones.
5. Al terminar, crear `RESUMEN.md`, el PDF con placeholders de capturas, rellenar el `SPEC.md` y actualizar el estado.
