/**
 * Design tokens for inline styles (when CSS variables are not available).
 * Must match globals.css primitives.
 */

/** Default class/dance style color (matches --primary). */
export const DEFAULT_CLASS_COLOR = "hsl(0, 100%, 41%)";

/** Default class color as hex for color inputs / API (same as primary). */
export const DEFAULT_CLASS_COLOR_HEX = "#D10000";

/** Chart palette (matches --chart-1 to --chart-5). */
export const CHART_COLORS = [
  "hsl(0, 100%, 41%)",   // chart-1 primary
  "hsl(142, 76%, 36%)",  // chart-2 success
  "hsl(38, 92%, 50%)",   // chart-3 warning
  "hsl(217, 91%, 60%)",  // chart-4 info
  "hsl(0, 0%, 45%)",     // chart-5 neutral
] as const;
