/* Sachet Cocomix illustré en SVG, à la couleur de la saveur.
   Remplacé automatiquement par la photo produit dès qu'elle est ajoutée dans l'admin. */
import { shade, tint } from "@/lib/theme";

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const r1 = (v: number) => Math.round(v * 10) / 10;

export function Flakes({ seed, cx, cy, rx, ry, count, light = "#FFF6E4", dark = "#E2C79B" }: { seed: number; cx: number; cy: number; rx: number; ry: number; count: number; light?: string; dark?: string }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r());
        const x = r1(cx + Math.cos(a) * rx * d);
        const y = r1(cy + Math.sin(a) * ry * d);
        const w = r1(6 + r() * 8);
        const h = r1(2.6 + r() * 3.4);
        const rot = Math.round(r() * 180);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <ellipse rx={w} ry={h} fill={light} />
            <path d={`M${r1(-w * 0.8)} ${r1(h * 0.3)} Q 0 ${r1(h * 1.5)} ${r1(w * 0.8)} ${r1(h * 0.3)}`} stroke={dark} strokeWidth={1.1} fill="none" />
          </g>
        );
      })}
    </g>
  );
}

export function Pouch({
  color,
  label,
  seed = 7,
  kraft = false,
  className = "",
}: {
  color: string;
  label?: string;
  seed?: number;
  kraft?: boolean;
  className?: string;
}) {
  const id = `pc${seed}${kraft ? "k" : ""}${color.slice(1)}`;
  const base = kraft ? "#C98B4E" : color;
  const light = tint(base, 0.25);
  const dark = shade(base, 0.18);
  const outline = shade(base, 0.55);
  return (
    <svg viewBox="0 0 200 270" className={className} role="img" aria-label={label ? `Sachet Cocomix ${label}` : "Sachet Cocomix"}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0" stopColor={dark} />
          <stop offset=".35" stopColor={light} />
          <stop offset=".7" stopColor={base} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <clipPath id={`${id}-w`}>
          <ellipse cx="100" cy="186" rx="46" ry="34" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="262" rx="74" ry="6" fill="#15110D" opacity=".14" />
      {/* corps */}
      <path d="M30 30 H170 Q174 30 175 36 L184 238 Q185 254 168 256 H32 Q15 254 16 238 L25 36 Q26 30 30 30Z" fill={`url(#${id}-g)`} />
      <path d="M30 30 H170 Q174 30 175 36 L184 238 Q185 254 168 256 H32 Q15 254 16 238 L25 36 Q26 30 30 30Z" fill="none" stroke={outline} strokeOpacity=".25" strokeWidth="1.5" />
      {/* soudure du haut + encoches */}
      <rect x="25" y="30" width="150" height="16" fill={dark} opacity=".55" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={30 + i * 10.5} y="33" width="5" height="10" rx="1" fill={light} opacity=".5" />
      ))}
      {/* étiquette */}
      <rect x="40" y="62" width="120" height="70" rx="14" fill="#FFFFFF" />
      <text x="100" y="94" textAnchor="middle" fontFamily="var(--font-display), system-ui, sans-serif" fontWeight="800" fontSize="23" fill="#15110D" letterSpacing="-0.6">
        COCO<tspan fill={kraft ? "#8A4E12" : shade(color, 0.35)}>MIX</tspan>
      </text>
      {label && (
        <text x="100" y="116" textAnchor="middle" fontFamily="var(--font-body), system-ui, sans-serif" fontWeight="700" fontSize="10" fill="#6E665E" letterSpacing="1.6">
          {label.toUpperCase()}
        </text>
      )}
      {/* fenêtre */}
      <ellipse cx="100" cy="186" rx="49" ry="37" fill="#FFFFFF" opacity=".9" />
      <g clipPath={`url(#${id}-w)`}>
        <rect x="50" y="148" width="100" height="80" fill="#FBEFD9" />
        <Flakes seed={seed} cx={100} cy={186} rx={52} ry={40} count={30} light={kraft ? "#FFF6E4" : tint(color, 0.8)} dark={kraft ? "#E2C79B" : shade(color, 0.1)} />
      </g>
      {/* reflet */}
      <path d="M156 54 Q166 140 162 236" stroke="#fff" strokeOpacity=".45" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function FlakeShape({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 30" className={className} style={style} aria-hidden>
      <path d="M4 18 Q8 4 30 4 Q52 4 56 16 Q50 26 30 26 Q10 26 4 18Z" fill="#FFF8EA" />
      <path d="M8 18 Q30 30 52 16" stroke="#D9BC8C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
