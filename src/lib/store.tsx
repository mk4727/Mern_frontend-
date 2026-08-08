import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultProducts, defaultFaqs, defaultCareTips, type Product, type Faq, type CareTip } from "./products";
import { api, isApiConfigured } from "./api";
import { toast } from "sonner";

interface StoreCtx {
  products: Product[];
  faqs: Faq[];
  careTips: CareTip[];
  loading: boolean;
  usingBackend: boolean;
  getProduct: (id: string) => Product | undefined;
  saveProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveFaq: (f: Faq) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  saveCareTip: (t: CareTip) => Promise<void>;
  deleteCareTip: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  resetAll: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);
const PKEY = "cw_products_v1";
const FKEY = "cw_faqs_v1";
const CKEY = "cw_caretips_v1";

// Map a Mongo document (_id) into our local shape (id).
const mapDoc = <T extends { id?: string }>(d: any): T => ({ ...d, id: d._id || d.id }) as T;
// Mongo ObjectId is 24 hex chars. Local/default ids (e.g. "f1", "ct1") are not.
const isMongoId = (id: string) => /^[a-f0-9]{24}$/i.test(id || "");

export function StoreProvider({ children }: { children: ReactNode }) {
  const usingBackend = isApiConfigured();
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [faqs, setFaqs] = useState<Faq[]>(defaultFaqs);
  const [careTips, setCareTips] = useState<CareTip[]>(defaultCareTips);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const refresh = async () => {
    if (!usingBackend) return;
    setLoading(true);
    try {
      const [p, f, c] = await Promise.all([
        api.listProducts(),
        api.listFaqs(),
        api.listCareTips(),
      ]);
      if (p.length) setProducts(p.map(mapDoc<Product>));
      if (f.length) setFaqs(f.map(mapDoc<Faq>));
      if (c.length) setCareTips(c.map(mapDoc<CareTip>));
    } catch (err: any) {
      console.warn("[store] backend fetch failed — using local data", err?.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: localStorage first (for instant render), then backend if configured.
  useEffect(() => {
    try {
      const p = localStorage.getItem(PKEY);
      const f = localStorage.getItem(FKEY);
      const c = localStorage.getItem(CKEY);
      if (p) setProducts(JSON.parse(p));
      if (f) setFaqs(JSON.parse(f));
      if (c) setCareTips(JSON.parse(c));
    } catch {}
    setHydrated(true);
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist locally as a cache (also acts as fallback when backend is offline).
  useEffect(() => { if (hydrated) try { localStorage.setItem(PKEY, JSON.stringify(products)); } catch {} }, [products, hydrated]);
  useEffect(() => { if (hydrated) try { localStorage.setItem(FKEY, JSON.stringify(faqs)); } catch {} }, [faqs, hydrated]);
  useEffect(() => { if (hydrated) try { localStorage.setItem(CKEY, JSON.stringify(careTips)); } catch {} }, [careTips, hydrated]);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  // ---------- Products ----------
  const saveProduct = async (p: Product) => {
    if (usingBackend) {
      try {
        // Only PUT when the id is a real Mongo ObjectId; local/default ids must POST as new.
        const exists = isMongoId(p.id) && products.some((x) => x.id === p.id);
        const payload: any = { name: p.name, category: p.category, price: p.price, image: p.image, description: p.description, care: p.care };
        const saved = exists ? await api.updateProduct(p.id, payload) : await api.createProduct(payload);
        const mapped = mapDoc<Product>(saved);
        setProducts((prev) => {
          const replacing = prev.some((x) => x.id === p.id);
          return replacing ? prev.map((x) => x.id === p.id ? mapped : x) : [mapped, ...prev];
        });
        return;
      } catch (err: any) {
        toast.error(`Backend save failed: ${err?.message || err}`);
        throw err;
      }
    }
    setProducts((prev) => prev.some((x) => x.id === p.id) ? prev.map((x) => x.id === p.id ? p : x) : [p, ...prev]);
  };

  const deleteProduct = async (id: string) => {
    if (usingBackend && isMongoId(id)) {
      try { await api.deleteProduct(id); } catch (err: any) { toast.error(`Delete failed: ${err?.message || err}`); throw err; }
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------- FAQs ----------
  const saveFaq = async (f: Faq) => {
    if (usingBackend) {
      try {
        const exists = isMongoId(f.id) && faqs.some((x) => x.id === f.id);
        const payload: any = { q: f.q, a: f.a };
        const saved = exists ? await api.updateFaq(f.id, payload) : await api.createFaq(payload);
        const mapped = mapDoc<Faq>(saved);
        setFaqs((prev) => {
          const replacing = prev.some((x) => x.id === f.id);
          return replacing ? prev.map((x) => x.id === f.id ? mapped : x) : [...prev, mapped];
        });
        return;
      } catch (err: any) { toast.error(`Backend save failed: ${err?.message || err}`); throw err; }
    }
    setFaqs((prev) => prev.some((x) => x.id === f.id) ? prev.map((x) => x.id === f.id ? f : x) : [...prev, f]);
  };

  const deleteFaq = async (id: string) => {
    if (usingBackend && isMongoId(id)) {
      try { await api.deleteFaq(id); } catch (err: any) { toast.error(`Delete failed: ${err?.message || err}`); throw err; }
    }
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // ---------- Care tips ----------
  const saveCareTip = async (t: CareTip) => {
    if (usingBackend) {
      try {
        const exists = isMongoId(t.id) && careTips.some((x) => x.id === t.id);
        const payload: any = { icon: t.icon, title: t.title, desc: t.desc };
        const saved = exists ? await api.updateCareTip(t.id, payload) : await api.createCareTip(payload);
        const mapped = mapDoc<CareTip>(saved);
        setCareTips((prev) => {
          const replacing = prev.some((x) => x.id === t.id);
          return replacing ? prev.map((x) => x.id === t.id ? mapped : x) : [...prev, mapped];
        });
        return;
      } catch (err: any) { toast.error(`Backend save failed: ${err?.message || err}`); throw err; }
    }
    setCareTips((prev) => prev.some((x) => x.id === t.id) ? prev.map((x) => x.id === t.id ? t : x) : [...prev, t]);
  };

  const deleteCareTip = async (id: string) => {
    if (usingBackend && isMongoId(id)) {
      try { await api.deleteCareTip(id); } catch (err: any) { toast.error(`Delete failed: ${err?.message || err}`); throw err; }
    }
    setCareTips((prev) => prev.filter((t) => t.id !== id));
  };

  const resetAll = () => {
    setProducts(defaultProducts);
    setFaqs(defaultFaqs);
    setCareTips(defaultCareTips);
  };

  return (
    <Ctx.Provider value={{ products, faqs, careTips, loading, usingBackend, getProduct, saveProduct, deleteProduct, saveFaq, deleteFaq, saveCareTip, deleteCareTip, refresh, resetAll }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
