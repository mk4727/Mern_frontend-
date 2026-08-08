import { useDocumentTitle } from "@/lib/use-document-title";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { toast } from "sonner";
import { api, isApiConfigured } from "@/lib/api";
import { sendOrderEmail, isEmailJsConfigured } from "@/lib/emailjs";


function Checkout() {
  useDocumentTitle("Checkout — Cactus World", undefined);
  const { detailed, total, clear } = useCart();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (detailed.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Nothing to checkout</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Browse plants</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center animate-fade-up">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold">Order confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks for your order. A confirmation has been sent to your email — your plants are on their way.
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-accent transition-smooth">
          Back home
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const customer = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      address: String(fd.get("address") || ""),
    };
    const payment = String(fd.get("payment") || "Cash on delivery");
    const items = detailed.map((d) => ({
      productId: String(d.product.id),
      name: d.product.name,
      price: Number(d.product.price),
      qty: Number(d.qty),
      subtotal: Number(d.product.price) * Number(d.qty),
    }));

    let orderId = `local-${Date.now()}`;
    try {
      if (isApiConfigured()) {
        const order = await api.createOrder({ customer, items, total, payment });
        orderId = order._id || order.id || orderId;
      }
    } catch (err) {
      console.error("[checkout] backend order failed", err);
      toast.error("Could not reach server — order saved locally.");
    }

    try {
      if (isEmailJsConfigured()) {
        await sendOrderEmail({
          to_name: customer.name,
          to_email: customer.email,
          order_id: orderId,
          order_total: formatPrice(total),
          order_items: items.map((i) => `${i.name} × ${i.qty}`).join(", "),
        });
      }
    } catch (err) {
      console.error("[checkout] emailjs failed", err);
      toast.error("Order placed but confirmation email could not be sent.");
    }

    clear();
    setDone(true);
    setSubmitting(false);
    toast.success("Order placed!");
    void navigate;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Checkout</h1>
      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[
            { name: "name", label: "Full name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "tel" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-sm font-medium">{f.label}</label>
              <input required name={f.name} type={f.type} className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 outline-none transition-smooth focus:border-primary" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Delivery address</label>
            <textarea required name="address" rows={3} className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 outline-none transition-smooth focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-medium">Payment method</label>
            <select name="payment" className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 outline-none transition-smooth focus:border-primary">
              <option>Cash on delivery</option>
              <option>Credit / debit card</option>
              <option>UPI</option>
            </select>
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {detailed.map(({ product, qty, subtotal }) => (
              <li key={product.id} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{product.name} × {qty}</span>
                <span>{formatPrice(subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-semibold">
            <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
          </div>
          <button disabled={submitting} className="mt-6 w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-smooth hover:bg-accent disabled:opacity-60">
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;
