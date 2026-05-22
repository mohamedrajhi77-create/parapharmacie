"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, Phone, Clock, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartSheet from "@/components/cart/CartSheet";
import { STORE_INFO } from "@/lib/utils";
import { cn } from "@/lib/utils";

const categories = [
  {
    label: "Visage",
    href: "/catalogue?categorie=visage",
    sub: ["Nettoyants & Démaquillants", "Hydratants & Crèmes", "Sérums & Ampoules", "Anti-âge", "Contour des yeux", "Peaux grasses & Acné", "Peaux sensibles"],
  },
  {
    label: "Corps",
    href: "/catalogue?categorie=corps",
    sub: ["Laits & Crèmes corps", "Huiles corps", "Gommages", "Mains & Pieds", "Vergetures & Cicatrices", "Jambes légères"],
  },
  {
    label: "Cheveux",
    href: "/catalogue?categorie=cheveux",
    sub: ["Shampoings", "Après-shampoings", "Masques capillaires", "Huiles capillaires", "Chute de cheveux", "Colorations"],
  },
  {
    label: "Hygiène",
    href: "/catalogue?categorie=hygiene",
    sub: ["Soins dentaires", "Déodorants", "Gels douche", "Hygiène intime", "Soins pieds", "Épilation"],
  },
  {
    label: "Santé",
    href: "/catalogue?categorie=sante",
    sub: ["Premiers secours", "Matériel médical", "Minceur", "Douleurs & Muscles", "Santé féminine", "Sport"],
  },
  {
    label: "Compléments",
    href: "/catalogue?categorie=complements-alimentaires",
    sub: ["Vitamines & Minéraux", "Probiotiques", "Stress & Sommeil", "Immunité", "Beauté", "Minceur"],
  },
  {
    label: "Bébé",
    href: "/catalogue?categorie=bebe",
    sub: ["Soins bébé", "Hygiène bébé", "Solaires enfant", "Maternité", "Alimentation bébé"],
  },
  {
    label: "Bio",
    href: "/catalogue?categorie=bio",
    sub: ["Huiles essentielles", "Cosmétiques bio", "Aromathérapie", "Soins bio visage", "Soins bio corps"],
  },
  {
    label: "Solaires",
    href: "/catalogue?categorie=solaires",
    sub: ["Visage SPF", "Corps SPF", "Après-soleil", "Enfant & Bébé", "Autobronzants"],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/catalogue?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <>
      {/* Top strip */}
      <div className="bg-pharma-green text-white py-1.5 text-xs text-center hidden md:block">
        <span className="font-medium">🚛 Retrait gratuit en magasin</span>
        <span className="mx-4 opacity-40">|</span>
        <a href={`tel:${STORE_INFO.phone}`} className="hover:underline">
          <Phone className="inline w-3 h-3 mr-1" />{STORE_INFO.phone}
        </a>
        <span className="mx-4 opacity-40">|</span>
        <span><Clock className="inline w-3 h-3 mr-1" />Lun–Ven 8h30–19h • Sam 9h–17h</span>
      </div>

      {/* Main nav */}
      <nav className={cn("sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-300", scrolled && "shadow-md")}>
        {/* Row 1: logo + search + cart */}
        <div className="container-pharma">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-4">
              <div className="w-9 h-9 bg-pharma-green rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-base">P</span>
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="text-pharma-green font-bold text-base block">{STORE_INFO.name}</span>
                <span className="text-gray-400 text-[10px] block -mt-0.5">Click &amp; Collect</span>
              </div>
            </Link>

            {/* Search bar (desktop) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Rechercher un produit, une marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pharma-green focus:border-transparent bg-gray-50"
              />
            </form>

            <div className="flex items-center gap-2 ml-auto">
              {/* Search icon (mobile) */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 text-gray-500 hover:text-pharma-green hover:bg-pharma-green-light rounded-xl transition-all" aria-label="Rechercher">
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Cart */}
              <button onClick={openCart} className="relative flex items-center gap-2 bg-pharma-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all" aria-label="Panier">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Panier</span>
                {totalItems > 0 && (
                  <span className="bg-white text-pharma-green text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500 hover:text-pharma-green hover:bg-pharma-green-light rounded-xl transition-all" aria-label="Menu">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden pb-3 animate-in slide-in-from-top-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input autoFocus type="search" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pharma-green bg-gray-50" />
              </form>
            </div>
          )}
        </div>

        {/* Row 2: category links (desktop) */}
        <div className="hidden md:block border-t border-gray-100" ref={dropdownRef}>
          <div className="container-pharma">
            <div className="flex items-center gap-1 py-1">
              {/* Promotions link */}
              <Link
                href="/catalogue?isPromotion=true"
                className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all whitespace-nowrap"
              >
                🏷️ PROMOTIONS
              </Link>
              <Link
                href="/catalogue?isNew=true"
                className="px-3 py-2 text-xs font-bold text-pharma-blue hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
              >
                ✨ NOUVEAUTÉS
              </Link>

              <div className="w-px h-4 bg-gray-200 mx-1" />

              {categories.map((cat) => (
                <div key={cat.label} className="relative">
                  <button
                    onMouseEnter={() => setActiveDropdown(cat.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                      activeDropdown === cat.label ? "text-pharma-green bg-pharma-green-light" : "text-gray-600 hover:text-pharma-green hover:bg-pharma-green-light"
                    )}
                  >
                    <Link href={cat.href}>{cat.label}</Link>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Dropdown */}
                  {activeDropdown === cat.label && (
                    <div
                      className="absolute top-full left-0 mt-0 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[200px] z-50 animate-in slide-in-from-top-1"
                      onMouseEnter={() => setActiveDropdown(cat.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {cat.sub.map((sub) => (
                        <Link
                          key={sub}
                          href={`${cat.href}&search=${encodeURIComponent(sub)}`}
                          className="block px-4 py-2 text-xs text-gray-600 hover:text-pharma-green hover:bg-pharma-green-light transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-pharma-green">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="py-2">
              <Link href="/catalogue?isPromotion=true" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50">🏷️ Promotions</Link>
              <Link href="/catalogue?isNew=true" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 text-sm font-bold text-pharma-blue hover:bg-blue-50">✨ Nouveautés</Link>
              <div className="border-t my-2" />
              {categories.map((cat) => (
                <div key={cat.label}>
                  <Link href={cat.href} onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-pharma-green hover:bg-pharma-green-light">
                    {cat.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CartSheet />
    </>
  );
}
