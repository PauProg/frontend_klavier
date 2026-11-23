# ADR-002: Dirección visual «Lacquer» y GSAP como familia de animación

| Campo | Valor |
|---|---|
| **ID** | `ADR-002` |
| **Fecha** | 2026-11-17 |
| **Estado** | Aceptada |
| **Ámbito** | `frontend` |
| **Sesión** | — (práctica para la sesión 10, continuación del work `0001`) |

## Contexto

La primera versión del frontend usaba una estética provisional: `stone` + `amber`, tarjetas con
`rounded-2xl`, sombras difusas y una serif de sistema. El usuario pidió rehacer la parte estética de
Home, Login y Register con un acabado editorial y animaciones de scroll «tipo Apple».

Había tres decisiones abiertas:

1. **Paleta y tipografía.** La anterior (crema cálida + latón + marrón espresso) es el patrón por
   defecto de cualquier tienda «artesanal premium»; Klavier quedaba indistinguible.
2. **Familia de animación.** El proyecto no tenía ninguna, y el usuario quería scroll de
   protagonista. Las opciones eran CSS nativo (`animation-timeline`), GSAP o una librería de
   motion con React.
3. **Soporte de navegador.** La política del `AGENTS.md` exige Baseline *widely available*;
   cualquier cosa fuera de eso necesita un *fallback* propio de 20 líneas o menos.

## Decisión

### 1. Dirección «Lacquer»

- Papel marfil (`#f2f0ec`), negro laca (`#0e0f10`) y **un único acento**, rojo fieltro (`#c8102e`),
  que es el color real de la cinta que va detrás de las teclas de un piano. El acento ocupa menos
  del 1 % de la página: CTA, foco y stock bajo.
- Radios a `0` en toda la interfaz. La forma viene del instrumento: líneas rectas, filetes de 1 px,
  sin sombras difusas. Las tarjetas dejan de ser cajas y pasan a ser fichas con filete superior.
- Tipografía del sistema (`system-ui` + `ui-monospace`), sin fuentes externas. Cero peticiones,
  cero `FOUT`, cero desplazamiento de layout. El mono se reserva para datos: marca, modelo, año,
  referencia de stock y precio.
- El teclado, dibujado con CSS, es el motivo gráfico de la marca. Sustituye a la fotografía, que
  no existe en el catálogo.

### 2. GSAP + ScrollTrigger

`gsap@3.15` y `@gsap/react@2.1`, registrados una sola vez en `src/motion/gsap.js`. Seis escenas:
entrada del hero, teclado que se hunde, manifiesto pinneado por palabras, pilares, grid de
productos y cierre. Todo el movimiento vive bajo `prefers-reduced-motion: no-preference` mediante
`gsap.matchMedia()`.

## Alternativas descartadas

| Alternativa | Motivo del descarte |
|---|---|
| CSS `animation-timeline` nativo | Es Baseline *newly available* (2026-10-27). Reproducir el pin y el `scrub` con `IntersectionObserver` supera el límite de 20 líneas de *fallback* del proyecto. |
| Motion (antes Framer Motion) | Excelente para microinteracciones y `whileInView`, pero no resuelve el pin con `scrub` ni el control fino del manifiesto. Habría supuesto dos familias de animación a la vez. |
| Mantener la paleta cálida | Es el cliché que la dirección visual debía romper; además competía con el acento ámbar en cualquier CTA. |
| Serif de display autoalojada | Coste en peso y `FOUT` sin mejora proporcional: la grotesca del sistema ya da el tono editorial. |
| `Lenis` u otro smooth-scroll | Secuestra el scroll y añade dependencia; `scroll-behavior: smooth` cubre el caso. |

## Consecuencias

- El bundle sube de ~100 KB a **135 KB gzip**. Es el precio de tener scroll coreografiado; se
  acepta porque el usuario lo pidió explícitamente y no hay imágenes que cargar.
- Cualquier elemento animado por GSAP **no puede** llevar además transiciones CSS sobre el mismo
  elemento: las escenas atacan contenedores y el hover ataca hijos.
- `ScrollTrigger.refresh()` pasa a ser obligatorio cuando cambia el alto del documento después de
  un `fetch`, como ocurre al cargar el catálogo.
- La cabecera mantiene `position: sticky` y añade `scroll-padding-top` en `html` para que el foco
  del teclado no quede oculto bajo la barra (WCAG 2.4.11).
- Cambiar de dirección visual en el futuro implica rehacer los tokens de `@theme` y revisar las
  seis escenas, no solo retocar colores.

## Referencias

- [`../../AGENTS.md`](../../AGENTS.md) §7.5, §7.6 y §7.9.
- [`../../src/index.css`](../../src/index.css) — tokens y estilos base.
- [`../../src/motion/gsap.js`](../../src/motion/gsap.js) — registro de plugins.
- [`../../../docs/projects/klavier/frontend/works/0001-react-vite-router-setup/SPEC.md`](../../../docs/projects/klavier/frontend/works/0001-react-vite-router-setup/SPEC.md) — apartado 17.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
