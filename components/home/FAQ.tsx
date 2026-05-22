"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Comment fonctionne la réservation ?",
    a: "Ajoutez vos produits au panier, renseignez vos coordonnées et choisissez votre créneau de retrait. Vous recevez une confirmation par email. Notre équipe prépare votre commande et vous venez la récupérer en magasin.",
  },
  {
    q: "Peut-on payer en ligne ?",
    a: "Non. Le paiement s'effectue uniquement en magasin au moment du retrait. Vous pouvez payer en espèces ou par carte bancaire. Cette approche garantit la sécurité de vos données bancaires.",
  },
  {
    q: "Combien de temps pour préparer ma commande ?",
    a: "En général, votre commande est prête en moins de 2 heures après confirmation. Vous recevez un email lorsqu'elle est disponible. Si vous choisissez un créneau le lendemain, elle sera prête dès l'ouverture.",
  },
  {
    q: "Puis-je annuler une réservation ?",
    a: "Oui, vous pouvez annuler votre réservation en nous contactant par téléphone ou email avant de venir. Il n'y a aucun engagement et aucun frais d'annulation.",
  },
  {
    q: "Les produits sont-ils authentiques et certifiés ?",
    a: "Absolument. Tous nos produits sont authentiques, approvisionnés auprès de distributeurs officiels. Nous ne vendons aucun produit contrefait ou non certifié.",
  },
  {
    q: "Les prix en ligne sont-ils les mêmes qu'en magasin ?",
    a: "Oui, les prix affichés sur notre site sont les mêmes que ceux pratiqués en magasin. Pas de mauvaises surprises.",
  },
  {
    q: "Puis-je réserver sans créer de compte ?",
    a: "Oui, la création de compte n'est pas obligatoire. Vous pouvez réserver en tant qu'invité avec simplement votre nom, email et numéro de téléphone.",
  },
  {
    q: "Combien de jours à l'avance puis-je réserver ?",
    a: "Vous pouvez réserver jusqu'à 7 jours à l'avance. Les créneaux disponibles sont affichés lors de la réservation en fonction de nos horaires d'ouverture.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container-pharma">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-pharma-green font-semibold text-sm uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="section-title mb-4">Questions fréquentes</h2>
            <p className="text-gray-500 text-lg">Tout ce que vous devez savoir sur notre service</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-gray-50 rounded-2xl border-0 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 text-center bg-pharma-green-light rounded-2xl p-8">
            <p className="font-semibold text-gray-900 mb-2">Vous avez une autre question ?</p>
            <p className="text-gray-600 text-sm mb-4">Notre équipe est là pour vous aider</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+21671234567"
                className="btn-primary text-center justify-center"
              >
                📞 Nous appeler
              </a>
              <a
                href="mailto:contact@parapharmacie-centrale.tn"
                className="btn-outline text-center justify-center"
              >
                ✉️ Envoyer un email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
