import { Search, Calendar, ShoppingBag } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Choisissez vos produits",
    description:
      "Parcourez notre catalogue en ligne, recherchez vos produits préférés et ajoutez-les à votre panier.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Réservez et choisissez votre heure",
    description:
      "Indiquez vos coordonnées et choisissez votre créneau de retrait. Confirmation immédiate par email.",
    color: "bg-pharma-green-light text-pharma-green",
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "Retirez et payez en magasin",
    description:
      "Venez récupérer votre commande déjà préparée et réglez en magasin. Simple et sans surprise.",
    color: "bg-orange-50 text-orange-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-20 bg-white">
      <div className="container-pharma">
        <div className="text-center mb-14">
          <span className="inline-block text-pharma-green font-semibold text-sm uppercase tracking-wider mb-3">
            Comment ça marche ?
          </span>
          <h2 className="section-title mb-4">Réservez en 3 étapes simples</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Notre système Click & Collect est conçu pour être le plus simple possible.
            Pas de compte requis, pas de paiement en ligne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-0.5 bg-gradient-to-r from-blue-100 via-pharma-green-light to-orange-100" />

          {steps.map((step, idx) => (
            <div key={step.number} className="relative text-center group">
              {/* Step number */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <step.icon className="w-9 h-9" />
                </div>
                <span className="absolute -top-3 -right-3 w-7 h-7 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            💳 Paiement uniquement en magasin
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            Nous ne collectons aucun paiement en ligne. Vous payez directement lors
            du retrait : en espèces ou par carte. Vos données bancaires restent privées.
          </p>
        </div>
      </div>
    </section>
  );
}
