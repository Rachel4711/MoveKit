"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  // Persistence lives at the cart boundary so product components stay presentation-focused.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
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
