import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Linkedin, Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-semibold">Cactus World</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Bringing a piece of the desert into homes — one cactus at a time.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-primary">All Plants</Link></li>
              <li><Link to="/shop?category=cactus" className="hover:text-primary">Cactus</Link></li>
              <li><Link to="/shop?category=succulents" className="hover:text-primary">Succulents</Link></li>
              <li><Link to="/shop?category=pots" className="hover:text-primary">Pots</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/care" className="hover:text-primary">Plant Care</Link></li>
              <li><Link to="/#faq" className="hover:text-primary">FAQ</Link></li>
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Follow</h4>
            <div className="mt-3 flex gap-3">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background transition-smooth hover:border-primary hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} Cactus World. All rights reserved.</p>
      </div>
    </footer>
  );
}
