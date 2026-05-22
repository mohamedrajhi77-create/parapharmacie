export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import ProductsTable from "@/components/admin/ProductsTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Produits" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; categorie?: string }>;
}

export default async function ProduitsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { brand: { contains: params.search, mode: "insensitive" } },
        ],
      }),
      ...(params.categorie && { category: { slug: params.categorie } }),
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const serialized = products.map((p) => ({
    ...p,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-500 text-sm mt-1">{serialized.length} produit{serialized.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <form className="flex gap-3">
          <input
            name="search"
            defaultValue={params.search}
            placeholder="Rechercher un produit ou une marque..."
            className="flex-1 h-10 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green"
          />
          <button type="submit" className="bg-pharma-green text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
            Rechercher
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ProductsTable products={serialized as any} />
      </div>
    </div>
  );
}
