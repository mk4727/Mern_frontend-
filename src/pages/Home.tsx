import { useDocumentTitle } from "@/lib/use-document-title";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Sparkles, Truck, Heart, ShieldCheck, ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero-cactus.jpg";
import { categories } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";


function Home() {
  useDocumentTitle("Cactus World — Bring Nature Home", "Premium cactus collection, succulents and indoor plants delivered to your door.");
  const { products, faqs } = useStore();
  const featured = products.slice(0, 4);
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 md:py-36">
          <div className="max-w-xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Premium cactus collection
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl">
              Bring <em className="not-italic text-primary">nature</em> home.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Hand-picked cacti, succulents and indoor plants — sustainably grown and delivered straight to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft transition-smooth hover:bg-accent hover:shadow-glow">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/care" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 font-medium transition-smooth hover:border-primary hover:text-primary">
                Care guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Shop by category</h2>
            <p className="mt-2 text-muted-foreground">Find the perfect green companion.</p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-6 transition-smooth hover:-translate-y-1 hover:border-primary hover:shadow-soft"
              style={{ animation: `fade-up 0.6s ${i * 60}ms both` }}
            >
              <span className="text-3xl transition-smooth group-hover:scale-125">{c.emoji}</span>
              <span className="text-center text-sm font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Bestsellers</h2>
            <p className="mt-2 text-muted-foreground">Loved by plant parents everywhere.</p>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY US */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">Why Cactus World</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Sparkles, title: "Premium quality", desc: "Hand-picked plants from trusted growers." },
            { icon: Truck, title: "Fast delivery", desc: "Carefully packed, on your doorstep in days." },
            { icon: Heart, title: "Affordable", desc: "Honest pricing on every plant." },
            { icon: ShieldCheck, title: "Expert support", desc: "Care advice whenever you need it." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-6 transition-smooth hover:-translate-y-1 hover:shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 scroll-mt-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Frequently asked questions</h2>
          <p className="mt-2 text-muted-foreground">Everything you need to know before bringing home a plant.</p>
        </div>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((f) => {
            const isOpen = open === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="block w-full p-5 text-left"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className={`grid overflow-hidden transition-all duration-300 ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <p className="overflow-hidden text-sm text-muted-foreground">{f.a}</p>
                </div>
              </button>
            );
          })}
          {faqs.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No FAQs yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
