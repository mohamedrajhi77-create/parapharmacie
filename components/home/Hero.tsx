"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  deco: string;
  tags: string[];
  isActive: boolean;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  { id: "f1", badge: "☀️ Spécial Été", title: "Protection Solaire\nHaute Efficacité", subtitle: "SPF50+ pour toute la famille — visage, corps, bébé", cta: "Découvrir les solaires", href: "/catalogue?categorie=solaires", bg: "from-blue-600 to-sky-500", deco: "☀️", tags: ["La Roche-Posay", "Avène", "Vichy"], isActive: true },
  { id: "f2", badge: "✨ Nouveautés", title: "Skincare Experts\nLes Incontournables", subtitle: "Sérums, crèmes et soins recommandés par les dermatologues", cta: "Voir les nouveautés", href: "/catalogue?categorie=visage", bg: "from-emerald-600 to-teal-500", deco: "🧴", tags: ["Bioderma", "CeraVe", "SVR"], isActive: true },
];

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then(r => r.json())
      .then((data: HeroSlide[]) => {
        const active = data.filter(s => s.isActive);
        if (active.length > 0) setSlides(active);
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next, slides.length]);

  const slide = slides[current] ?? FALLBACK_SLIDES[0];

  return (
    <section
      className={`relative bg-gradient-to-r ${slide.bg} transition-all duration-700 overflow-hidden`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="container-pharma py-12 md:py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-white text-center md:text-left">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 bg-white/20 text-white">
              {slide.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-6 max-w-md mx-auto md:mx-0">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {slide.tags.map((tag) => (
                <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
            <Link href={slide.href} className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base">
              {slide.cta}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-shrink-0 hidden sm:flex w-48 h-48 md:w-64 md:h-64 bg-white/20 backdrop-blur-sm rounded-3xl items-center justify-center shadow-2xl">
            <span className="text-8xl md:text-9xl">{slide.deco}</span>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all" aria-label="Précédent">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all" aria-label="Suivant">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`transition-all duration-300 rounded-full ${i === current ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2"}`} />
            ))}
          </div>
        </>
      )}

      <div className="bg-black/20 backdrop-blur-sm text-white/90 text-xs py-2">
        <div className="container-pharma flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
          <span>🏪 Retrait gratuit en magasin</span>
          <span>✅ Produits 100% authentiques</span>
          <span>💳 Paiement uniquement en magasin</span>
          <span>📦 Commande prête en 2h</span>
        </div>
      </div>
    </section>
  );
}
