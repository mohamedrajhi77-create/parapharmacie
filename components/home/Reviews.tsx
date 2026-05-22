import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sonia M.",
    avatar: "S",
    rating: 5,
    text: "Super service ! J'ai réservé mes produits la veille, tout était prêt en 2 heures. Le personnel est très professionnel et les prix sont imbattables.",
    date: "Il y a 3 jours",
    product: "Crème Hydratante SPF50",
  },
  {
    id: 2,
    name: "Mohamed K.",
    avatar: "M",
    rating: 5,
    text: "Enfin un système pratique ! Je commande depuis mon téléphone et je récupère le lendemain. Gain de temps énorme. Vraiment recommandé.",
    date: "Il y a 1 semaine",
    product: "Compléments Vitamine D",
  },
  {
    id: 3,
    name: "Fatima H.",
    avatar: "F",
    rating: 5,
    text: "Excellent ! Les produits sont authentiques et la sélection est très large. Le système de réservation fonctionne parfaitement.",
    date: "Il y a 2 semaines",
    product: "Crème Anti-âge",
  },
  {
    id: 4,
    name: "Rania B.",
    avatar: "R",
    rating: 4,
    text: "Très satisfaite de mon expérience. La confirmation par email arrive immédiatement. Je recommande vivement cette parapharmacie.",
    date: "Il y a 3 semaines",
    product: "Soins Cheveux",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-20 bg-white">
      <div className="container-pharma">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-pharma-green font-semibold text-sm uppercase tracking-wider mb-3">
            Avis clients
          </span>
          <h2 className="section-title mb-4">Ce que disent nos clients</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
            <span className="text-gray-500">sur 5 · {reviews.length * 12}+ avis</span>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 rounded-2xl p-6 relative hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-pharma-green-light" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pharma-green text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>

              <StarRating rating={review.rating} />

              <p className="mt-3 text-sm text-gray-600 leading-relaxed">&ldquo;{review.text}&rdquo;</p>

              {review.product && (
                <p className="mt-3 text-xs text-pharma-green bg-pharma-green-light px-2 py-1 rounded-lg inline-block">
                  {review.product}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
