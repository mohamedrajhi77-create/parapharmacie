"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalogue?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-pharma-green-light rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="container-pharma relative py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-pharma-green-light text-pharma-green-dark text-sm font-semibold px-4 py-2 rounded-full mb-6 animate-in fade-in-0 slide-in-from-bottom-4">
            <span className="w-2 h-2 bg-pharma-green rounded-full animate-pulse" />
            Click & Collect · Paiement en magasin
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-in fade-in-0 slide-in-from-bottom-4 delay-100">
            Votre parapharmacie,{" "}
            <span className="text-pharma-green relative">
              à portée de main
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M0 6 Q75 0 150 4 Q225 8 300 2" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 delay-200">
            Réservez vos produits en ligne, venez les récupérer et payer en magasin.
            Simple, rapide, sans frais.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-6 animate-in fade-in-0 slide-in-from-bottom-4 delay-300">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 p-1.5 focus-within:ring-2 focus-within:ring-pharma-green focus-within:border-transparent transition-all">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Rechercher un produit, une marque..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 pl-10 pr-4 py-2.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
              />
              <button
                type="submit"
                className="bg-pharma-green text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                Rechercher
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-in fade-in-0 slide-in-from-bottom-4 delay-300">
            <span className="text-sm text-gray-400">Populaire :</span>
            {["Crème solaire", "Vitamine C", "Hyaluronic", "Bébé", "Anti-âge"].map((term) => (
              <Link
                key={term}
                href={`/catalogue?search=${encodeURIComponent(term)}`}
                className="text-sm text-pharma-green bg-pharma-green-light hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto animate-in fade-in-0 slide-in-from-bottom-4 delay-500">
            {[
              { icon: ShieldCheck, value: "100%", label: "Produits authentiques" },
              { icon: Clock, value: "2h", label: "Délai de préparation" },
              { icon: Star, value: "4.9★", label: "Satisfaction client" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 bg-pharma-green-light rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-pharma-green" />
                </div>
                <div className="font-bold text-gray-900 text-lg leading-tight">{value}</div>
                <div className="text-xs text-gray-500 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
