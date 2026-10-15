import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700", "800"] });
const body = Figtree({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });

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
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
