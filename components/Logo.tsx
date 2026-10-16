/* Logo Cocomix : « COCO » brun, « MIX » vert, deux feuilles au-dessus du X.
   Vectoriel (net à toutes les tailles). variant="light" pour les fonds sombres. */
export function Logo({ className = "", variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  const coco = variant === "light" ? "#FBF3E6" : "#4B2A14";
  const mix = variant === "light" ? "#5FC35A" : "#2E7A2C";
  const leaf = variant === "light" ? "#7AD472" : "#3F9A3A";
  return (
    <svg viewBox="0 0 380 112" className={className} role="img" aria-label="Cocomix">
      <g fontFamily="var(--font-logo), 'Anton', Impact, 'Arial Narrow Bold', sans-serif" fontSize="104" letterSpacing="0">
        <text x="2" y="106" fill={coco} textLength="194" lengthAdjust="spacingAndGlyphs">COCO</text>
        <text x="200" y="106" fill={mix} textLength="172" lengthAdjust="spacingAndGlyphs">MIX</text>
      </g>
      {/* feuilles */}
      <g transform="translate(332 2)">
        <path d="M18 26 C 4 24, -2 12, 2 2 C 14 2, 22 12, 18 26 Z" fill={leaf} />
        <path d="M17 24 C 12 16, 8 10, 3 4" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M22 26 C 22 12, 32 2, 46 4 C 46 18, 36 26, 22 26 Z" fill={mix} />
        <path d="M24 24 C 30 16, 36 10, 44 6" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
