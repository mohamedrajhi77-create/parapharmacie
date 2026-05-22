import Link from "next/link";
import { Tag } from "lucide-react";

const bonsPlansBrands = [
  { name: "La Roche-Posay", discount: "Jusqu'à -25%", href: "/catalogue?search=La+Roche-Posay&isPromotion=true", bg: "bg-blue-50", border: "border-blue-100", badge: "text-blue-700 bg-blue-100" },
  { name: "Avène", discount: "Jusqu'à -20%", href: "/catalogue?search=Avène&isPromotion=true", bg: "bg-sky-50", border: "border-sky-100", badge: "text-sky-700 bg-sky-100" },
  { name: "Bioderma", discount: "Jusqu'à -15%", href: "/catalogue?search=Bioderma&isPromotion=true", bg: "bg-red-50", border: "border-red-100", badge: "text-red-700 bg-red-100" },
  { name: "Vichy", discount: "Jusqu'à -30%", href: "/catalogue?search=Vichy&isPromotion=true", bg: "bg-emerald-50", border: "border-emerald-100", badge: "text-emerald-700 bg-emerald-100" },
  { name: "Nuxe", discount: "Jusqu'à -20%", href: "/catalogue?search=Nuxe&isPromotion=true", bg: "bg-amber-50", border: "border-amber-100", badge: "text-amber-700 bg-amber-100" },
  { name: "Pileje", discount: "Jusqu'à -25%", href: "/catalogue?search=Pileje&isPromotion=true", bg: "bg-teal-50", border: "border-teal-100", badge: "text-teal-700 bg-teal-100" },
];

export default function BonsPlansSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container-pharma">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold text-red-500 uppercase tracking-wide">Offres spéciales</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Nos bons plans</h2>
          </div>
          <Link
            href="/catalogue?isPromotion=true"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-pharma-green hover:underline"
          >
            Voir toutes les promos →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {bonsPlansBrands.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className={`group ${b.bg} border ${b.border} rounded-2xl p-4 flex flex-col items-center gap-3 text-center hover:shadow-md hover:scale-105 transition-all duration-200`}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-gray-700 text-xs leading-tight">{b.name.split(" ")[0]}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">{b.name}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${b.badge}`}>
                  {b.discount}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden text-center mt-5">
          <Link href="/catalogue?isPromotion=true" className="text-sm font-semibold text-pharma-green hover:underline">
            Voir toutes les promos →
          </Link>
        </div>
      </div>
    </section>
  );
}
