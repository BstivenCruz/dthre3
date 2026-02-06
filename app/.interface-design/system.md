# D-thre3 — Sistema de diseño

Producto: **D-thre3** — Sistema de gestión para academia de baile urbano.

## Dirección y sensación

- **Dominio:** Academia de baile urbano — energía, ritmo, marca roja. La interfaz debe sentirse clara y profesional para gestión (admin, recepción, alumnos), sin que lo "urbano" comprometa la legibilidad.
- **Feel:** Profesional, enfocado, con identidad de marca (rojo) usada con intención. No decorativo; cada color y superficie tiene función.

## Estrategia de profundidad

**Bordes suaves + sombra muy sutil en cards.**

- **Regla única:** Bordes para separar regiones (border con token `--border`). Cards pueden llevar una sombra mínima (`shadow-sm` o equivalente por token) para ligera elevación. No mezclar glows fuertes ni sombras grandes en la app.
- **Auth (login/register):** Se permite un glow muy sutil en el contenedor principal, controlado por token `--auth-glow` (opcional), para dar identidad sin distraer.
- **Evitar:** `shadow-lg`, `shadow-xl`, `shadow-2xl` en componentes de app; `animate-pulse-glow` en dashboard/cards; bordes gruesos o muy contrastados.

## Espaciado

- **Unidad base:** 4px.
- **Escala:** Usar múltiplos: 4, 8, 12, 16, 20, 24, 32 (Tailwind: 1, 2, 3, 4, 5, 6, 8).
- **En código:** Preferir `p-4`, `p-6`, `gap-2`, `gap-4`, `gap-6`, `space-y-2`, `space-y-4`. Evitar `p-5`, `gap-5` y valores arbitrarios salvo excepción justificada.
- **Padding simétrico:** Mismo valor en los cuatro lados; excepción solo cuando el contenido lo requiera (ej. horizontal distinto al vertical).

## Border radius

- **Escala:** `sm` = 4px, `md` = 6–8px (calc(var(--radius) - 2px)), `lg` = 12px (var(--radius)).
- **Uso:** Inputs/botones pequeños `rounded-md`; cards/paneles `rounded-lg`; modales/containers grandes `rounded-lg` o `rounded-xl` si se define `--radius-xl`.
- **No usar:** Valores arbitrarios como `rounded-[35px]`; sustituir por token o clase de la escala (ej. `rounded-xl`).

## Tokens de color (primitivos)

Todo color debe trazar a estos primitivos:

- **Foreground:** `--foreground` (texto principal), `--muted-foreground` (secundario/metadata). Jerarquía vía opacidad si hace falta.
- **Background:** `--background` (canvas), `--card` (superficie elevada), `--muted` (zonas suaves). Misma base, elevaciones sutiles.
- **Border:** `--border`, `--input` (controles). Bordes ligeros, no lo primero que se vea.
- **Brand:** `--primary` (rojo marca D-thre3). Acciones principales, identidad.
- **Semantic:** `--destructive` (error/eliminar, rojo distinto del primary), `--success`, `--warning`, `--info` (opcional). Para estados y badges.

**Chart (gráficos):** `--chart-1` a `--chart-5` derivados de primary + semantic + neutros. Usar solo estos en gráficos; no hex sueltos.

**Clase por defecto:** Color por defecto para clases de baile = `--primary` (o alias `--class-default-color` si se añade). No usar `#D10000` en código; usar token.

## Patrones de componentes clave

- **Card:** `rounded-lg border bg-card shadow-sm` (o solo border si se decide profundidad solo-bordes). Padding interno `p-6`, `space-y-1.5` en header.
- **Button:** Variantes default (primary), destructive, outline, secondary, ghost, link. Transición ~150ms.
- **Input/controls:** `rounded-md border border-input`, focus ring con `--ring`. Altura consistente (ej. h-10).
- **Badge:** Variantes con tokens (primary, secondary, destructive, success, warning, outline). Success/warning usan `--success` y `--warning`.
- **Dashboard cards:** Colores solo desde tokens (primary, success, warning, info). Sin `hover:shadow-lg` fuerte; hover sutil (borde o sombra mínima). Sin `animate-pulse-glow` por defecto.

## Animaciones

- **Microinteracciones (hover, focus):** ~150ms, easing suave (ease-out).
- **Transiciones de panel/modal:** 200–250ms.
- **Evitar:** Spring/bounce; glows pulsantes en áreas de trabajo; animaciones decorativas que distraigan. En login se permiten animaciones flotantes suaves y de bajo contraste.

## Referencia rápida

| Elemento        | Token / clase                          |
|----------------|----------------------------------------|
| Fondo app      | `--background` / `bg-background`       |
| Card           | `--card`, `border`, `shadow-sm`         |
| Primario       | `--primary`                            |
| Error/destructivo | `--destructive` (≠ primary)         |
| Éxito          | `--success`                            |
| Advertencia    | `--warning`                            |
| Gráficos       | `--chart-1` … `--chart-5`              |
| Radius card    | `rounded-lg` (--radius)                |
| Espaciado base | 4px (Tailwind 1 = 4px)                 |
