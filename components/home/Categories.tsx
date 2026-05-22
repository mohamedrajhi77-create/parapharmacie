import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";

const DEFAULT_ICONS: Record<string, string> = {
  "soins-visage": "🧴",
  "corps-bien-etre": "💆",
  "cheveux": "💇",
  "bebe-maman": "🍼",
  "complements-alimentaires": "💊",
  "solaire": "☀️",
  "maquillage": "💄",
  "hygiene": "🪥",
  "homme": "🧔",
  "dietetique": "🥗",
};

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container-pharma">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Nos rayons</h2>
          <p className="text-gray-500 text-lg">Trouvez exactement ce dont vous avez besoin</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogue?categorie=${cat.slug}`}
              className="group flex flex-col items-center p-5 rounded-2xl bg-gray-50 hover:bg-pharma-green-light border border-transparent hover:border-pharma-green transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {cat.image ? (
                <div className="relative w-16 h-16 mb-3 rounded-xl overflow-hidden">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 mb-3 rounded-xl bg-white shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {DEFAULT_ICONS[cat.slug] ?? "📦"}
                </div>
              )}
              <span className="text-sm font-semibold text-gray-700 group-hover:text-pharma-green text-center transition-colors leading-tight">
                {cat.name}
              </span>
              {cat._count && (
                <span className="text-xs text-gray-400 mt-0.5">
                  {cat._count.products} produits
                </span>
              )}
            </Link>
          ))}

          {/* All categories link */}
          <Link
            href="/catalogue"
            className="group flex flex-col items-center p-5 rounded-2xl bg-pharma-green text-white hover:bg-emerald-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="w-16 h-16 mb-3 rounded-xl bg-white/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              🛍️
            </div>
            <span className="text-sm font-semibold text-center">Tout le catalogue</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
