import { getCatalog } from "@/lib/catalog";
import { whatsappNumbers } from "@/lib/format";
import { CartProvider } from "@/lib/cart";
import { Benefits } from "@/components/shop/Benefits";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Flavors } from "@/components/shop/Flavors";
import { Footer } from "@/components/shop/Footer";
import { FlyLayer } from "@/components/shop/fx";
import { Header } from "@/components/shop/Header";
import { Hero } from "@/components/shop/Hero";
import { Pricing } from "@/components/shop/Pricing";

export const revalidate = 60;

export default async function HomePage() {
  const { products, sizes, settings } = await getCatalog();
  const flavors = products.filter((p) => p.kind === "saveur");
  const packs = products.filter((p) => p.kind === "pack");
  const fromPrice = Math.min(...sizes.map((s) => s.price), ...packs.map((p) => p.price ?? Infinity));

  return (
    <CartProvider products={products} sizes={sizes}>
      <Header announcement={settings.announcement} />
      <main>
        <Hero flavors={flavors} fromPrice={Number.isFinite(fromPrice) ? fromPrice : 0} />
        <Flavors flavors={flavors} sizes={sizes} />
        <Pricing sizes={sizes} packs={packs} />
        <Benefits />
      </main>
      <Footer numbers={whatsappNumbers(settings)} flavors={flavors} />
      <CartDrawer deliveryNote={settings.delivery_note} />
      <FlyLayer />
    </CartProvider>
  );
}
