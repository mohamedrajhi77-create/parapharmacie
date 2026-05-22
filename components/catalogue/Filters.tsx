"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";

interface FiltersProps {
  categories: Category[];
}

export default function Filters({ categories }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
          if (key !== "page") params.delete("page");
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (key: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString({ [key]: value })}`, { scroll: false });
  };

  const currentCategory = searchParams.get("categorie");
  const isPromotion = searchParams.get("isPromotion") === "true";
  const isNew = searchParams.get("isNew") === "true";
  const currentSort = searchParams.get("tri") ?? "popular";

  const hasActiveFilters = currentCategory || isPromotion || isNew;

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Filtres</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
          >
            <X className="w-3 h-3" />
            Effacer
          </button>
        )}
      </div>

      {/* Quick filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Offres spéciales</h3>
        <div className="space-y-2">
          <button
            onClick={() => setFilter("isPromotion", isPromotion ? null : "true")}
            className={`w-full text-left text-sm px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              isPromotion
                ? "bg-red-50 text-red-700 font-semibold"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              🏷️ Promotions
            </span>
            {isPromotion && <X className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setFilter("isNew", isNew ? null : "true")}
            className={`w-full text-left text-sm px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              isNew
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              ✨ Nouveautés
            </span>
            {isNew && <X className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Catégories</h3>
        <div className="space-y-1">
          <button
            onClick={() => setFilter("categorie", null)}
            className={`w-full text-left text-sm px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              !currentCategory
                ? "bg-pharma-green-light text-pharma-green font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter("categorie", currentCategory === cat.slug ? null : cat.slug)}
              className={`w-full text-left text-sm px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                currentCategory === cat.slug
                  ? "bg-pharma-green-light text-pharma-green font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{cat.name}</span>
              {cat._count && (
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                  {cat._count.products}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Trier par</h3>
        <div className="space-y-1">
          {[
            { value: "popular", label: "Popularité" },
            { value: "newest", label: "Nouveautés" },
            { value: "price_asc", label: "Prix croissant" },
            { value: "price_desc", label: "Prix décroissant" },
            { value: "name", label: "A → Z" },
          ].map((sort) => (
            <button
              key={sort.value}
              onClick={() => setFilter("tri", sort.value)}
              className={`w-full text-left text-sm px-3 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                currentSort === sort.value
                  ? "bg-pharma-green-light text-pharma-green font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {currentSort === sort.value && <span className="w-1.5 h-1.5 bg-pharma-green rounded-full" />}
              {sort.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
