export type ProductKind = "saveur" | "pack";

export type Product = {
  id: string;
  slug: string;
  kind: ProductKind;
  name: string;
  short_name: string | null;
  description: string | null;
  color: string;
  image_url: string | null;
  price: number | null;
  is_available: boolean;
  position: number;
};

export type Size = {
  id: string;
  label: string;
  grams: number;
  price: number;
  is_active: boolean;
  position: number;
};

export type Settings = {
  whatsapp: string;
  whatsapp_2?: string | null;
  announcement: string;
  delivery_note: string;
};

export type OrderStatus = "nouvelle" | "confirmee" | "en_livraison" | "livree" | "annulee";

export type OrderItem = {
  product_id: string;
  name: string;
  variant: string;
  unit_price: number;
  qty: number;
  line_total: number;
};

export type Order = {
  id: string;
  number: number;
  customer_name: string;
  phone: string;
  address: string;
  note: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
};

export type CartLine = {
  key: string; // productId:sizeId | productId
  productId: string;
  sizeId: string | null;
  qty: number;
};
