import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { STORE_INFO } from "@/lib/utils";

const categories = [
  { name: "Soins visage", slug: "soins-visage" },
  { name: "Corps & Bien-être", slug: "corps-bien-etre" },
  { name: "Cheveux", slug: "cheveux" },
  { name: "Bébé & Maman", slug: "bebe-maman" },
  { name: "Compléments", slug: "complements-alimentaires" },
  { name: "Solaire", slug: "solaire" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-pharma py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-pharma-green rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg leading-tight block">
                  {STORE_INFO.name}
                </span>
                <span className="text-gray-400 text-xs">Click & Collect</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Réservez vos produits en ligne et venez les récupérer en magasin. Simple, rapide et gratuit.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-pharma-green rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-pharma-green rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-5">Nos rayons</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalogue?categorie=${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-pharma-green transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 bg-pharma-green rounded-full flex-shrink-0" />
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/catalogue"
                  className="text-sm text-pharma-green hover:text-emerald-400 font-medium transition-colors"
                >
                  Voir tout le catalogue →
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-5">Informations</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/catalogue?isPromotion=true", label: "Promotions" },
                { href: "/catalogue?isNew=true", label: "Nouveautés" },
                { href: "/#comment-ca-marche", label: "Comment ça marche ?" },
                { href: "/#faq", label: "FAQ" },
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/confidentialite", label: "Confidentialité" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-pharma-green transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5">Nous trouver</h3>
            <div className="space-y-4">
              <a
                href={STORE_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <MapPin className="w-4 h-4 text-pharma-green mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {STORE_INFO.address}
                </span>
              </a>
              <a href={`tel:${STORE_INFO.phone}`} className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-pharma-green flex-shrink-0" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {STORE_INFO.phone}
                </span>
              </a>
              <a href={`mailto:${STORE_INFO.email}`} className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-pharma-green flex-shrink-0" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {STORE_INFO.email}
                </span>
              </a>
              <div className="pt-2 border-t border-gray-800">
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pharma-green" />
                  Horaires d'ouverture
                </p>
                {STORE_INFO.hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-xs text-gray-500 py-0.5">
                    <span>{h.day}</span>
                    <span className={h.time === "Fermé" ? "text-red-400" : "text-gray-300"}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-pharma py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {STORE_INFO.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-pharma-green rounded-full animate-pulse" />
            <span>Paiement uniquement en magasin</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
