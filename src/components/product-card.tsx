import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-smooth hover:-translate-y-1 hover:shadow-soft">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-secondary/50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg font-semibold leading-tight">{product.name}</h3>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">{formatPrice(product.price)}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              add(product.id);
              toast.success(`${product.name} added to cart`);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-accent hover:scale-110"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
