import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./products";
import { useStore } from "./store";

export interface CartItem {
  productId: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  detailed: { product: Product; qty: number; subtotal: number }[];
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useStore();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cw_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("cw_cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (id: string, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((p) => p.productId === id);
      if (found) return prev.map((p) => p.productId === id ? { ...p, qty: p.qty + qty } : p);
      return [...prev, { productId: id, qty }];
    });
  const remove = (id: string) => setItems((p) => p.filter((i) => i.productId !== id));
  const setQty = (id: string, qty: number) =>
    setItems((p) => p.map((i) => i.productId === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);

  const detailed = items
    .map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) return null;
      return { product, qty: i.qty, subtotal: product.price * i.qty };
    })
    .filter(Boolean) as CartCtx["detailed"];

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = detailed.reduce((s, d) => s + d.subtotal, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, total, detailed }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
