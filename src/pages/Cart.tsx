import { useDocumentTitle } from "@/lib/use-document-title";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";


function CartPage() {
  useDocumentTitle("Your cart — Cactus World", undefined);
  const { detailed, setQty, remove, total } = useCart();

  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-6xl">🪴</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Find a green friend to bring home.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-accent transition-smooth">
          Browse plants
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Your cart</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {detailed.map(({ product, qty, subtotal }) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
              <img src={product.image} alt={product.name} width={120} height={120} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/product/${product.id}`} className="font-display text-lg font-semibold hover:text-primary">
                    {product.name}
                  </Link>
                  <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{formatPrice(product.price)} each</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="grid h-8 w-8 place-items-center hover:text-primary"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm font-medium">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="grid h-8 w-8 place-items-center hover:text-primary"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="font-semibold text-primary">{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>Free</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-semibold">
            <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
          </div>
          <Link to="/checkout" className="mt-6 block rounded-full bg-primary px-6 py-3 text-center font-medium text-primary-foreground transition-smooth hover:bg-accent">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
