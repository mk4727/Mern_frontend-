import { Link } from "react-router-dom";
import { ShoppingBag, Leaf } from "lucide-react";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-smooth group-hover:scale-105">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Cactus World</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/" className="hover:text-primary transition-smooth">Home</Link>
          <Link to="/shop" className="hover:text-primary transition-smooth">Shop</Link>
          <Link to="/care" className="hover:text-primary transition-smooth">Plant Care</Link>
          <Link to="/admin" className="hover:text-primary transition-smooth">Admin</Link>
        </nav>
        <Link to="/cart" className="relative flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft transition-smooth hover:border-primary hover:text-primary">
          <ShoppingBag className="h-4 w-4" />
          <span>Cart</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
