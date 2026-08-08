import { useDocumentTitle } from "@/lib/use-document-title";
import { useSearchParamsObj } from "@/lib/use-search";
import { useNavigate } from "react-router-dom";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories, type Category } from "@/lib/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";

type Sort = "default" | "low" | "high";

interface ShopSearch {
  category?: Category;
}


function Shop() {
  useDocumentTitle("Shop — Cactus World", "Browse our full collection of cactus, succulents, indoor plants and pots.");
  const { category } = useSearchParamsObj();
  const navigate = useNavigate();
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, query, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Shop our plants</h1>
          <p className="mt-2 text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> products
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search plants..."
              className="rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none transition-smooth focus:border-primary"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none transition-smooth focus:border-primary"
          >
            <option value="default">Sort: Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => navigate("/shop")}
          className={`rounded-full border px-4 py-1.5 text-sm transition-smooth ${
            !category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/shop?category=${c.id}`)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-smooth ${
              category === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {filtered.length === 0 && (
        <div className="mt-20 text-center text-muted-foreground">
          <p className="text-5xl">🌵</p>
          <p className="mt-4">No plants match your search.</p>
        </div>
      )}
    </div>
  );
}

export default Shop;
