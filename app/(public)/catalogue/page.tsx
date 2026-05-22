export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";
import ProductCard from "@/components/catalogue/ProductCard";
import Filters from "@/components/catalogue/Filters";
import MobileFiltersDrawer from "@/components/catalogue/MobileFiltersDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import type { Metadata } from "next";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Parcourez notre catalogue complet de produits de parapharmacie. Soins, beauté, bien-être.",
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    categorie?: string;
    isPromotion?: string;
    isNew?: string;
    tri?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 24;

async function CatalogueContent({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const sortBy = params.tri ?? "popular";
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(params.categorie && {
      category: { slug: params.categorie },
    }),
    ...(params.isPromotion === "true" && { isPromotion: true }),
    ...(params.isNew === "true" && { isNew: true }),
    ...(params.search && {
      OR: [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { brand: { contains: params.search, mode: "insensitive" } },
        { tags: { has: params.search } },
      ],
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === "price_asc" ? { price: "asc" }
    : sortBy === "price_desc" ? { price: "desc" }
    : sortBy === "newest" ? { createdAt: "desc" }
    : sortBy === "name" ? { name: "asc" }
    : { viewCount: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
      include: { category: true, _count: { select: { reviews: true } } },
    }).catch(() => []),
    prisma.product.count({ where }).catch(() => 0),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    }).catch(() => []),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const serialized = products.map((p) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
  }));

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <Filters categories={categories} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">
              {total} produit{total !== 1 ? "s" : ""}
              {params.search && <span className="font-medium"> pour &ldquo;{params.search}&rdquo;</span>}
            </p>
          </div>

          <MobileFiltersDrawer categories={categories} />
        </div>

        {serialized.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500">Essayez d&apos;autres critères de recherche</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {serialized.map((product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                    className={`w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition-all ${
                      p === page
                        ? "bg-pharma-green text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default async function CataloguePage({ searchParams }: PageProps) {
  return (
    <div className="container-pharma py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue</h1>
        <p className="text-gray-500">Tous nos produits de parapharmacie</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      }>
        <CatalogueContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
