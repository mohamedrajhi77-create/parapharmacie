import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getAstuces() {
  try {
    return await prisma.astuce.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  } catch { return []; }
}

export default async function AstucesSection() {
  const astuces = await getAstuces();
  if (astuces.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="container-pharma">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-pharma-green" />
              <span className="text-sm font-semibold text-pharma-green uppercase tracking-wide">Conseils santé & beauté</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Nos astuces</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {astuces.map((a) => (
            <Link key={a.id} href={a.href} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-pharma-green hover:shadow-md transition-all duration-200 flex flex-col">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 self-start ${a.color}`}>
                <span>{a.emoji}</span>
                <span>{a.category}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug group-hover:text-pharma-green transition-colors line-clamp-2">{a.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">{a.excerpt}</p>
              <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-pharma-green">
                Lire l&apos;astuce <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
