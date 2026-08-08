import { useDocumentTitle } from "@/lib/use-document-title";

import { useEffect, useState, type FormEvent } from "react";
import { Lock, LogOut, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { careIcons, categories, formatPrice, type CareIcon, type CareTip, type Category, type Faq, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { api, clearAdminToken, isApiConfigured, setAdminToken } from "@/lib/api";
import { toast } from "sonner";

const ADMIN_PASSWORD = "it@149";
const AUTH_KEY = "cw_admin_auth";


function Admin() {
  useDocumentTitle("Admin — Cactus World", undefined);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { clearAdminToken(); sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      if (isApiConfigured()) {
        try {
          const { token } = await api.adminLogin(pw);
          setAdminToken(token);
        } catch (apiErr: any) {
          setErr(apiErr?.message || "Login failed");
          setBusy(false);
          return;
        }
      } else if (pw !== ADMIN_PASSWORD) {
        setErr("Incorrect password");
        setBusy(false);
        return;
      }
      sessionStorage.setItem(AUTH_KEY, "1");
      onSuccess();
      toast.success("Welcome back, admin");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft animate-fade-up">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-center font-display text-3xl font-semibold">Admin access</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Enter the admin password to manage the store.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(""); }}
            placeholder="Password"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 outline-none transition-smooth focus:border-primary"
          />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={busy} className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-smooth hover:bg-accent disabled:opacity-60">
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

type Tab = "products" | "care" | "faqs";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("products");
  const { resetAll } = useStore();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Admin panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your plants, care tips and FAQs.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { if (confirm("Reset all data to defaults?")) { resetAll(); toast.success("Reset to defaults"); } }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="mt-8 inline-flex flex-wrap rounded-full border border-border bg-card p-1">
        {(["products", "care", "faqs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-smooth ${
              tab === t ? "bg-primary text-primary-foreground" : "hover:text-primary"
            }`}
          >
            {t === "products" ? "Plants & Products" : t === "care" ? "Care Tips" : "FAQs"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "products" ? <ProductsTab /> : tab === "care" ? <CareTipsTab /> : <FaqsTab />}
      </div>
    </div>
  );
}

const emptyProduct: Product = {
  id: "",
  name: "",
  category: "cactus",
  price: 0,
  image: "",
  description: "",
  care: "",
};

function ProductsTab() {
  const { products, saveProduct, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">{products.length} products</h2>
        <button
          onClick={() => setEditing({ ...emptyProduct, id: `p-${Date.now()}` })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent"
        >
          <Plus className="h-4 w-4" /> Add plant
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
            <img src={p.image || "https://placehold.co/120x120?text=🌵"} alt="" className="h-16 w-16 rounded-xl object-cover bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{p.category} · {formatPrice(p.price)}</p>
              <p className="text-xs text-muted-foreground truncate">Care: {p.care}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setEditing(p)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => { if (confirm(`Delete ${p.name}?`)) { deleteProduct(p.id); toast.success("Deleted"); } }}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={async (p) => { try { await saveProduct(p); setEditing(null); toast.success("Saved"); } catch {} }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (p: Product) => void }) {
  const [form, setForm] = useState<Product>(product);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.price <= 0 || !form.image) {
      toast.error("Name, price and image are required");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-soft animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between sticky top-0 -mt-2 -mx-2 px-2 pt-2 pb-2 bg-card z-10">
          <h3 className="font-display text-2xl font-semibold">{product.name ? "Edit plant" : "Add plant"}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="mt-3 space-y-4">
          <Field label="Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className={inputCls}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
            </Field>
          </div>
          <Field label="Description">
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Plant care notes">
            <textarea required rows={2} value={form.care} onChange={(e) => setForm({ ...form, care: e.target.value })} className={inputCls} placeholder="e.g. Bright indirect light, water every 10 days." />
          </Field>
          <Field label="Image — paste a Google / web link or upload from your device">
            <div className="space-y-2">
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://... (paste image URL from Google)"
                className={inputCls}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-accent"
              />
              {form.image && <img src={form.image} alt="preview" className="h-24 w-24 rounded-xl object-cover border border-border" />}
            </div>
          </Field>
          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-card -mx-2 px-2 pb-1">
            <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:border-primary">Cancel</button>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-accent">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CareTipsTab() {
  const { careTips, saveCareTip, deleteCareTip } = useStore();
  const [editing, setEditing] = useState<CareTip | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">{careTips.length} care tips</h2>
        <button
          onClick={() => setEditing({ id: `ct-${Date.now()}`, icon: "droplets", title: "", desc: "" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent"
        >
          <Plus className="h-4 w-4" /> Add care tip
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {careTips.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium">{careIcons.find((i) => i.id === t.icon)?.label.split(" ")[0] ?? "🌱"} {t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(t)} className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { if (confirm("Delete this care tip?")) { deleteCareTip(t.id); toast.success("Deleted"); } }} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CareTipModal
          tip={editing}
          onClose={() => setEditing(null)}
          onSave={async (t) => { try { await saveCareTip(t); setEditing(null); toast.success("Saved"); } catch {} }}
        />
      )}
    </div>
  );
}

function CareTipModal({ tip, onClose, onSave }: { tip: CareTip; onClose: () => void; onSave: (t: CareTip) => void }) {
  const [form, setForm] = useState<CareTip>(tip);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) { toast.error("Title and description are required"); return; }
    onSave(form);
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-soft animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold">{tip.title ? "Edit care tip" : "Add care tip"}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Icon">
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value as CareIcon })} className={inputCls}>
              {careIcons.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
          </Field>
          <Field label="Title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea required rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className={inputCls} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:border-primary">Cancel</button>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-accent">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FaqsTab() {
  const { faqs, saveFaq, deleteFaq } = useStore();
  const [editing, setEditing] = useState<Faq | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">{faqs.length} FAQs</h2>
        <button
          onClick={() => setEditing({ id: `f-${Date.now()}`, q: "", a: "" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent"
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {faqs.map((f) => (
          <div key={f.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium">{f.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(f)} className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-primary hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { if (confirm("Delete this FAQ?")) { deleteFaq(f.id); toast.success("Deleted"); } }} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <FaqModal
          faq={editing}
          onClose={() => setEditing(null)}
          onSave={async (f) => { try { await saveFaq(f); setEditing(null); toast.success("Saved"); } catch {} }}
        />
      )}
    </div>
  );
}

function FaqModal({ faq, onClose, onSave }: { faq: Faq; onClose: () => void; onSave: (f: Faq) => void }) {
  const [form, setForm] = useState<Faq>(faq);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.q.trim() || !form.a.trim()) { toast.error("Question and answer are required"); return; }
    onSave(form);
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-soft animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold">{faq.q ? "Edit FAQ" : "Add FAQ"}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <Field label="Question">
            <input required value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Answer">
            <textarea required rows={4} value={form.a} onChange={(e) => setForm({ ...form, a: e.target.value })} className={inputCls} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm font-medium hover:border-primary">Cancel</button>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-accent">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 outline-none transition-smooth focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export default Admin;
