import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Polices intégrées au projet (plus de téléchargement Google Fonts pendant le build)
const logo = localFont({
  src: [{ path: "./fonts/anton-latin-400-normal.woff2", weight: "400", style: "normal" }],
  variable: "--font-logo",
  display: "swap",
});
const display = localFont({
  src: [
    { path: "./fonts/bricolage-grotesque-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/bricolage-grotesque-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/bricolage-grotesque-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: [
    { path: "./fonts/figtree-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/figtree-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/figtree-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/figtree-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Cocomix · Chips de noix de coco naturelles", template: "%s · Cocomix" },
  description:
    "Chips de coco croustillantes, 100 % naturelles et sans conservateurs, en 4 saveurs : lait, menthe, gingembre et ananas. Livraison partout au Sénégal.",
  openGraph: {
    title: "Cocomix · Croquez autrement",
    description: "Chips de coco naturelles en 4 saveurs. Livraison partout au Sénégal.",
    locale: "fr_SN",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#2E6A2A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${logo.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
