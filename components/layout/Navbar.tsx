"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Menu, Phone, MapPin, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import CartSheet from "@/components/cart/CartSheet";
import { STORE_INFO } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?isNew=true", label: "Nouveautés" },
  { href: "/catalogue?isPromotion=true", label: "Promotions" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems, openCart } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-pharma-green text-white py-2">
        <div className="container-pharma flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a href={`tel:${STORE_INFO.phone}`} className="flex items-center gap-1.5 hover:text-pharma-green-light transition-colors">
              <Phone className="w-3 h-3" />
              {STORE_INFO.phone}
            </a>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Lun-Ven 08h30–19h00 | Sam 09h00–17h00
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <a href={STORE_INFO.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pharma-green-light transition-colors">
              {STORE_INFO.address}
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 bg-white transition-shadow duration-300",
          scrolled && "shadow-md"
        )}
      >
        <div className="container-pharma">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-pharma-green rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">P</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-pharma-green font-bold text-base md:text-lg leading-tight block">
                  {STORE_INFO.name}
                </span>
                <span className="text-gray-400 text-xs">Click & Collect</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-pharma-green hover:bg-pharma-green-light rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-500 hover:text-pharma-green hover:bg-pharma-green-light rounded-xl transition-all"
                aria-label="Rechercher"
              >
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Cart button */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-500 hover:text-pharma-green hover:bg-pharma-green-light rounded-xl transition-all"
                aria-label="Panier"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pharma-green text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in-50">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-pharma-green hover:bg-pharma-green-light rounded-xl transition-all"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 animate-in slide-in-from-top-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  autoFocus
                  type="search"
                  placeholder="Rechercher un produit, une marque..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-search"
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white animate-in slide-in-from-top-2">
            <div className="container-pharma py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-pharma-green hover:bg-pharma-green-light rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-3 mt-3 space-y-2">
                <a href={`tel:${STORE_INFO.phone}`} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:text-pharma-green hover:bg-pharma-green-light rounded-xl transition-all">
                  <Phone className="w-4 h-4" />
                  {STORE_INFO.phone}
                </a>
                <p className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500">
                  <Clock className="w-4 h-4" />
                  Lun-Ven 08h30–19h00 | Sam 09h00–17h00
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartSheet />
    </>
  );
}
