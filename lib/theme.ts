/** Teintes dérivées de la couleur d'un produit (champ `color` en base). */
export function tint(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const mix = (c: number) => Math.round(c * (1 - amount));
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export const flavorTheme = (color: string) => ({
  base: color,
  soft: tint(color, 0.72),
  softer: tint(color, 0.86),
  deep: shade(color, 0.62),
});
