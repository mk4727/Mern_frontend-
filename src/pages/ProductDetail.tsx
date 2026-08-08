import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";


function ProductDetail() {
  const { id = "" } = useParams();
  const { products, getProduct } = useStore();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <p className="text-5xl">🌵</p>
        <h1 className="mt-4 font-display text-3xl">Plant not found</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Back to shop</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>
      <div className="mt-6 grid gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-secondary/40 shadow-soft">
          <img src={product.image} alt={product.name} width={800} height={800} className="h-full w-full object-cover animate-fade-in" />
        </div>
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-primary">{formatPrice(product.price)}</p>
          <p className="mt-6 text-muted-foreground">{product.description}</p>
          <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm">
            <span className="font-semibold">Care:</span> <span className="text-muted-foreground">{product.care}</span>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border bg-card">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center hover:text-primary">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid h-10 w-10 place-items-center hover:text-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => { add(product.id, qty); toast.success(`${product.name} × ${qty} added`); }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft transition-smooth hover:bg-accent"
            >
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
          </div>
          <Link
            to="/checkout"
            onClick={() => add(product.id, qty)}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-primary px-6 py-3 font-medium text-primary transition-smooth hover:bg-primary hover:text-primary-foreground"
          >
            Buy now
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">You might also love</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;
