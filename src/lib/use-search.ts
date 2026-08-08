import { useSearchParams } from "react-router-dom";
import type { Category } from "@/lib/products";

/** Reads the shop query string as a typed object (react-router equivalent of TanStack search). */
export function useSearchParamsObj(): { category?: Category } {
  const [params] = useSearchParams();
  const category = params.get("category") ?? undefined;
  return { category: category as Category | undefined };
}
