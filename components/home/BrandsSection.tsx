"use client";

import Link from "next/link";

const brands = [
  { name: "La Roche-Posay", slug: "la-roche-posay", color: "#004B8D" },
  { name: "Avène", slug: "avene", color: "#005EB8" },
  { name: "Bioderma", slug: "bioderma", color: "#E30613" },
  { name: "Vichy", slug: "vichy", color: "#00833E" },
  { name: "Nuxe", slug: "nuxe", color: "#C9A96E" },
  { name: "Klorane", slug: "klorane", color: "#6B8E23" },
  { name: "Uriage", slug: "uriage", color: "#003087" },
  { name: "CeraVe", slug: "cerave", color: "#004B87" },
  { name: "Eucerin", slug: "eucerin", color: "#003DA5" },
  { name: "Ducray", slug: "ducray", color: "#E4007C" },
  { name: "Pileje", slug: "pileje", color: "#009B77" },
  { name: "Arkopharma", slug: "arkopharma", color: "#007B5E" },
  { name: "Mustela", slug: "mustela", color: "#F7A800" },
  { name: "Boiron", slug: "boiron", color: "#003087" },
  { name: "Puressentiel", slug: "puressentiel", color: "#009639" },
  { name: "Caudalie", slug: "caudalie", color: "#8B2252" },
];

export default function BrandsSection() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="container-pharma">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Vos marques préférées</h2>
          <p className="text-gray-500 text-sm mt-1">Les meilleures marques de parapharmacie disponibles en magasin</p>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/catalogue?search=${encodeURIComponent(brand.name)}`}
              className="group flex items-center justify-center bg-white rounded-xl border border-gray-100 p-3 h-16 hover:border-pharma-green hover:shadow-sm transition-all duration-200"
              title={brand.name}
            >
              <span
                className="text-xs font-bold text-center leading-tight group-hover:opacity-80 transition-opacity"
                style={{ color: brand.color }}
              >
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/catalogue"
            className="text-sm text-pharma-green font-semibold hover:underline"
          >
            Voir tout le catalogue →
          </Link>
        </div>
      </div>
    </section>
  );
}
