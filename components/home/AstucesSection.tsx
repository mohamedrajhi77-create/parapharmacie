import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const astuces = [
  {
    category: "Soins visage",
    title: "Comment choisir son SPF selon son type de peau ?",
    excerpt: "La protection solaire n'est pas universelle. Peaux grasses, sèches ou mixtes : découvrez quelle texture convient le mieux à votre routine quotidienne.",
    href: "/catalogue?categorie=visage",
    color: "bg-blue-50 text-blue-600",
    emoji: "☀️",
  },
  {
    category: "Cheveux",
    title: "Routine capillaire : les 5 erreurs à éviter absolument",
    excerpt: "Shampoings trop fréquents, chaleur excessive, mauvais démêlage... Ces gestes du quotidien abîment vos cheveux sans que vous le sachiez.",
    href: "/catalogue?categorie=cheveux",
    color: "bg-amber-50 text-amber-600",
    emoji: "💇",
  },
  {
    category: "Compléments",
    title: "Magnésium, vitamine D ou oméga-3 : lequel vous manque ?",
    excerpt: "Fatigue, stress, crampes... Certains signaux indiquent des carences. Tour d'horizon des compléments alimentaires les plus utiles selon votre profil.",
    href: "/catalogue?categorie=complements-alimentaires",
    color: "bg-green-50 text-green-600",
    emoji: "💊",
  },
  {
    category: "Bébé & Maman",
    title: "Soins bébé : les produits essentiels pour les 6 premiers mois",
    excerpt: "Crème change, lait corps, gel de bain... Quels produits sont vraiment indispensables pour prendre soin de la peau délicate de votre nouveau-né ?",
    href: "/catalogue?categorie=bebe",
    color: "bg-pink-50 text-pink-600",
    emoji: "🍼",
  },
];

export default function AstucesSection() {
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
            <Link
              key={a.title}
              href={a.href}
              className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-pharma-green hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 self-start ${a.color} bg-opacity-50`}>
                <span>{a.emoji}</span>
                <span>{a.category}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug group-hover:text-pharma-green transition-colors line-clamp-2">
                {a.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-3">
                {a.excerpt}
              </p>
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
