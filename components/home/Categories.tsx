import Link from "next/link";
import type { Category } from "@/types";

const CATEGORY_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  "visage":                   { bg: "bg-pink-50",   text: "text-pink-700",   emoji: "✨" },
  "corps":                    { bg: "bg-blue-50",   text: "text-blue-700",   emoji: "🧴" },
  "cheveux":                  { bg: "bg-amber-50",  text: "text-amber-700",  emoji: "💇" },
  "hygiene":                  { bg: "bg-cyan-50",   text: "text-cyan-700",   emoji: "🪥" },
  "sante":                    { bg: "bg-red-50",    text: "text-red-700",    emoji: "❤️" },
  "complements-alimentaires": { bg: "bg-violet-50", text: "text-violet-700", emoji: "💊" },
  "bebe":                     { bg: "bg-yellow-50", text: "text-yellow-700", emoji: "🍼" },
  "bio":                      { bg: "bg-green-50",  text: "text-green-700",  emoji: "🌿" },
  "solaires":                 { bg: "bg-orange-50", text: "text-orange-700", emoji: "☀️" },
};

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container-pharma">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Nos rayons</h2>
          <Link href="/catalogue" className="text-sm text-pharma-green font-semibold hover:underline">
            Tout voir →
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-5 lg:grid-cols-9 sm:overflow-visible sm:pb-0">
          {categories.map((cat) => {
            const style = CATEGORY_STYLES[cat.slug] ?? { bg: "bg-gray-50", text: "text-gray-700", emoji: cat.icon ?? "📦" };
            return (
              <Link
                key={cat.id}
                href={`/catalogue?categorie=${cat.slug}`}
                className="group flex-shrink-0 flex flex-col items-center gap-2 min-w-[72px] sm:min-w-0"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${style.bg} flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}>
                  {cat.icon ?? style.emoji}
                </div>
                <span className={`text-xs font-semibold text-center leading-tight ${style.text} line-clamp-2 max-w-[72px] sm:max-w-full`}>
                  {cat.name}
                </span>
              </Link>
            );
          })}

          {/* All categories */}
          <Link
            href="/catalogue"
            className="group flex-shrink-0 flex flex-col items-center gap-2 min-w-[72px] sm:min-w-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pharma-green flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
              🛍️
            </div>
            <span className="text-xs font-semibold text-center text-pharma-green leading-tight">
              Tout le catalogue
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
