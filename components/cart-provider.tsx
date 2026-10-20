"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { seedProducts } from "@/lib/products";

export type CartItem = Pick<Product, "slug" | "name" | "price" | "image"> & {
  id: string;
  variant: string;
  quantity: number;
};
type CartContextValue = {
  items: CartItem[]; itemCount: number; total: number; isOpen: boolean;
  addItem: (product: Product, variant: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "movekit-cart";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Browser storage can contain an older cart shape, so validate and migrate it
// before the UI receives it. TypeScript types alone cannot protect runtime data.
function parseStoredCart(saved: string): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((value): CartItem[] => {
      if (!isRecord(value)) return [];

      const catalogProduct = seedProducts.find((product) =>
        product.slug === value.slug || product.name === value.name
      );
      const slug = typeof value.slug === "string" ? value.slug : catalogProduct?.slug;
      const name = typeof value.name === "string" ? value.name : catalogProduct?.name;
      const image = typeof value.image === "string" && value.image
        ? value.image
        : catalogProduct?.image;
      const price = typeof value.price === "number" && Number.isFinite(value.price)
        ? value.price
        : catalogProduct?.price;
      const variant = typeof value.variant === "string" && value.variant
        ? value.variant
        : catalogProduct?.variants[0] ?? "Standard";
      const quantity = typeof value.quantity === "number" && Number.isFinite(value.quantity)
        ? Math.max(1, Math.floor(value.quantity))
        : 1;

      if (!slug || !name || !image || price === undefined) return [];

      return [{
        id: `${slug}:${variant}`,
        slug,
        name,
        price,
        image,
        variant,
        quantity,
      }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  // Persistence lives at the cart boundary so product components stay presentation-focused.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(parseStoredCart(saved));
      setStorageReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (storageReady) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, storageReady]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    isOpen,
    addItem: (product, variant) => {
      const id = `${product.slug}:${variant}`;
      setItems((current) => {
        const exists = current.some((item) => item.id === id);
        return exists
          ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...current, { id, slug: product.slug, name: product.name, price: product.price, image: product.image, variant, quantity: 1 }];
      });
      setOpen(true);
    },
    updateQuantity: (id, quantity) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
    setOpen,
  }), [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
