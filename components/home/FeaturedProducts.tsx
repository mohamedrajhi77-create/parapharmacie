"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import ProductCard from "@/components/catalogue/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  bg?: "white" | "gray";
}

export default function FeaturedProducts({
  products,
  title = "Produits populaires",
  subtitle,
  viewAllHref = "/catalogue",
  bg = "white",
}: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className={`py-10 ${bg === "gray" ? "bg-gray-50" : "bg-white"}`}>
      <div className="container-pharma">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-semibold text-pharma-green hover:underline whitespace-nowrap"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products — horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:overflow-visible sm:pb-0">
          {products.slice(0, 10).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-44 sm:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
