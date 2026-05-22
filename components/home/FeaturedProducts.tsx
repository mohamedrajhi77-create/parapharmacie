"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import ProductCard from "@/components/catalogue/ProductCard";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}

export default function FeaturedProducts({
  products,
  title = "Produits populaires",
  subtitle = "Nos meilleures ventes du moment",
  viewAllHref = "/catalogue",
}: FeaturedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-pharma">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title mb-2">{title}</h2>
            <p className="text-gray-500 text-lg">{subtitle}</p>
          </div>
          <Link
            href={viewAllHref}
            className="hidden md:flex items-center gap-1.5 text-pharma-green font-semibold hover:gap-3 transition-all text-sm"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Button asChild variant="outline" size="lg">
            <Link href={viewAllHref}>
              Voir tous les produits
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
