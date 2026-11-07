import { getCatalog } from "@/lib/catalog";
import { whatsappNumbers } from "@/lib/format";
import { CartProvider } from "@/lib/cart";
import { Benefits } from "@/components/shop/Benefits";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { Flavors } from "@/components/shop/Flavors";
import { Footer } from "@/components/shop/Footer";
import { FlyLayer } from "@/components/shop/fx";
import { Header } from "@/components/shop/Header";
import { HeroSimple } from "@/components/shop/HeroSimple";
import { NewFlavors } from "@/components/shop/NewFlavors";
import { Pricing } from "@/components/shop/Pricing";

export const revalidate = 60;

export default async function HomePage() {
  const { products, sizes, settings } = await getCatalog();
  const flavors = products.filter((p) => p.kind === "saveur");
  const packs = products.filter((p) => p.kind === "pack");
  const fresh = flavors.filter((p) => p.is_new);
  const regular = flavors.filter((p) => !p.is_new);
  const fromPrice = Math.min(...sizes.map((s) => s.price), ...packs.map((p) => p.price ?? Infinity));

  return (
    <CartProvider products={products} sizes={sizes}>
      <Header announcement={settings.announcement} hasNew={fresh.length > 0} />
      <main>
        <HeroSimple flavors={flavors} fromPrice={Number.isFinite(fromPrice) ? fromPrice : 0} />
        {fresh.length > 0 && <NewFlavors flavors={fresh} sizes={sizes} />}
        <Flavors flavors={regular.length > 0 ? regular : flavors} sizes={sizes} />
        <Pricing sizes={sizes} packs={packs} />
        <Benefits />
      </main>
      <Footer numbers={whatsappNumbers(settings)} flavors={flavors} />
      <CartDrawer deliveryNote={settings.delivery_note} />
      <FlyLayer />
    </CartProvider>
  );
}
