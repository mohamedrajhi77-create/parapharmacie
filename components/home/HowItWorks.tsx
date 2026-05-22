import { Search, ShoppingBag, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Je browse & réserve",
    description: "Parcourez le catalogue, ajoutez vos produits au panier et validez votre réservation en ligne.",
    color: "bg-blue-100 text-blue-600",
    num: "1",
  },
  {
    icon: ShoppingBag,
    title: "On prépare votre commande",
    description: "Votre commande est préparée en magasin. Vous recevez un email dès qu'elle est prête à être retirée.",
    color: "bg-emerald-100 text-pharma-green",
    num: "2",
  },
  {
    icon: CreditCard,
    title: "Retrait & paiement en magasin",
    description: "Venez récupérer votre commande et payez sur place : espèces ou carte. Aucun paiement en ligne.",
    color: "bg-orange-100 text-orange-600",
    num: "3",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="container-pharma">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Comment fonctionne le Click &amp; Collect ?</h2>
          <p className="text-sm text-gray-500 mt-1">Simple, rapide, sans compte ni paiement en ligne</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-4 relative`}>
                <step.icon className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.num}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{step.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-pharma-green text-white rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left max-w-2xl mx-auto">
          <span className="text-3xl">💳</span>
          <div>
            <p className="font-bold text-base">Paiement uniquement en magasin</p>
            <p className="text-emerald-100 text-sm">Aucune donnée bancaire requise · Espèces ou carte acceptées</p>
          </div>
        </div>
      </div>
    </section>
  );
}
