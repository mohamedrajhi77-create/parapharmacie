import Link from "next/link";
import { Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getBonsPlans() {
  try {
    return await prisma.bonPlan.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  } catch { return []; }
}

export default async function BonsPlansSection() {
  const bonsPlans = await getBonsPlans();
  if (bonsPlans.length === 0) return null;

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
          <Link href="/catalogue?isPromotion=true" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-pharma-green hover:underline">
            Voir toutes les promos →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {bonsPlans.map((b) => (
            <Link key={b.id} href={b.href} className={`group ${b.bg} border ${b.border} rounded-2xl p-4 flex flex-col items-center gap-3 text-center hover:shadow-md hover:scale-105 transition-all duration-200`}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-gray-700 leading-tight">{b.name.split(" ")[0]}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">{b.name}</p>
                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${b.badge}`}>{b.discount}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
