"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Star, Package, ChevronRight, Heart,
  Truck, Shield, RotateCcw, Check, Tag, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/catalogue/ProductCard";
import type { Product } from "@/types";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.product) return;
        setProduct(data.product);
        setRelated(data.related ?? []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-pharma py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-pharma py-20 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h1>
        <Link href="/catalogue" className="text-pharma-green hover:underline">Retour au catalogue</Link>
      </div>
    );
  }

  const discountPct = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const handleAdd = () => {
    addItem(product);
    toast({ title: "Ajouté au panier ✓", description: product.name, variant: "success" });
  };

  return (
    <div className="container-pharma py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-pharma-green transition-colors">Accueil</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/catalogue" className="hover:text-pharma-green transition-colors">Catalogue</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/catalogue?categorie=${product.category?.slug}`} className="hover:text-pharma-green transition-colors">
          {product.category?.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
            <Image
              src={product.images[selectedImage] ?? "/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.isPromotion && discountPct && (
              <div className="absolute top-4 left-4">
                <Badge variant="promo">-{discountPct}%</Badge>
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 right-4">
                <Badge variant="new">Nouveau</Badge>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 transition-all ${
                    selectedImage === i ? "border-pharma-green" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="text-sm font-semibold text-pharma-green uppercase tracking-wide mb-1">
              {product.brand}
            </p>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          {product._count && product._count.reviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product._count.reviews} avis</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
            )}
            {discountPct && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Short desc */}
          {product.shortDescription && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <Check className="w-4 h-4" />
                En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                <Package className="w-4 h-4" />
                Épuisé
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex gap-3 mb-8">
            <Button
              size="xl"
              className="flex-1"
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? "Produit épuisé" : "Réserver en magasin"}
            </Button>
            <button className="w-12 h-12 rounded-2xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all" aria-label="Favoris">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Garanties */}
          <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-gray-100 mb-6">
            {[
              { icon: Truck, text: "Retrait en magasin" },
              { icon: Shield, text: "Produit authentique" },
              { icon: RotateCcw, text: "Annulation gratuite" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="text-center">
                <Icon className="w-5 h-5 text-pharma-green mx-auto mb-1" />
                <p className="text-xs text-gray-500">{text}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/catalogue?search=${tag}`}
                  className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-pharma-green-light text-gray-600 hover:text-pharma-green px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="mb-6">
            <TabsTrigger value="description">Description</TabsTrigger>
            {product.usageAdvice && <TabsTrigger value="usage">Conseils d'utilisation</TabsTrigger>}
            {product.reviews && <TabsTrigger value="reviews">Avis ({product._count?.reviews ?? 0})</TabsTrigger>}
          </TabsList>

          <TabsContent value="description">
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-gray-400">Aucune description disponible.</p>
              )}
            </div>
          </TabsContent>

          {product.usageAdvice && (
            <TabsContent value="usage">
              <div className="bg-pharma-green-light rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-pharma-green flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 leading-relaxed">{product.usageAdvice}</p>
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="reviews">
            <p className="text-gray-500 text-sm">
              {product._count?.reviews === 0
                ? "Aucun avis pour ce produit."
                : `${product._count?.reviews} avis clients`}
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
