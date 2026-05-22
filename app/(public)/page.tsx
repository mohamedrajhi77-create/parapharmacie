export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BonsPlansSection from "@/components/home/BonsPlansSection";
import BrandsSection from "@/components/home/BrandsSection";
import HowItWorks from "@/components/home/HowItWorks";
import AstucesSection from "@/components/home/AstucesSection";
import Reviews from "@/components/home/Reviews";
import MapSection from "@/components/home/MapSection";
import FAQ from "@/components/home/FAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parapharmacie Centrale | Réservation Click & Collect",
  description:
    "Réservez vos produits de parapharmacie en ligne et venez les récupérer en magasin. Soins, beauté, bien-être. Paiement en magasin uniquement.",
};

async function getHomeData() {
  try {
    const [categories, featuredProducts, newProducts, promoProducts] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: { _count: { select: { products: { where: { isActive: true } } } } },
        take: 9,
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: { category: true, _count: { select: { reviews: true } } },
        orderBy: { viewCount: "desc" },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isActive: true, isNew: true },
        include: { category: true, _count: { select: { reviews: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.product.findMany({
        where: { isActive: true, isPromotion: true },
        include: { category: true, _count: { select: { reviews: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);
    return { categories, featuredProducts, newProducts, promoProducts };
  } catch (err) {
    console.error("getHomeData error:", err);
    return { categories: [], featuredProducts: [], newProducts: [], promoProducts: [] };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, newProducts, promoProducts } = await getHomeData();

  // Serialize Decimal fields
  const serializeProducts = (products: typeof featuredProducts) =>
    products.map((p) => ({
      ...p,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    }));

  return (
    <>
      <Hero />
      <Categories categories={categories} />
      <BonsPlansSection />
      {featuredProducts.length > 0 && (
        <FeaturedProducts
          products={serializeProducts(featuredProducts)}
          title="Produits populaires"
          subtitle="Nos meilleures ventes du moment"
        />
      )}
      {promoProducts.length > 0 && (
        <FeaturedProducts
          products={serializeProducts(promoProducts)}
          title="Promotions en cours"
          subtitle="Profitez de nos offres spéciales"
          viewAllHref="/catalogue?isPromotion=true"
        />
      )}
      <BrandsSection />
      <HowItWorks />
      {newProducts.length > 0 && (
        <FeaturedProducts
          products={serializeProducts(newProducts)}
          title="Nouveautés"
          subtitle="Les dernières arrivées en magasin"
          viewAllHref="/catalogue?isNew=true"
        />
      )}
      <AstucesSection />
      <Reviews />
      <MapSection />
      <FAQ />
    </>
  );
}
