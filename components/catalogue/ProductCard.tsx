"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product);
    toast({
      title: "Ajouté au panier ✓",
      description: product.name,
      variant: "success",
    });
  };

  const mainImage = product.images[0] ?? "/placeholder-product.svg";
  const discountPct = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <Link href={`/produit/${product.slug}`} className="card-product group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discountPct && discountPct > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.isNew && !discountPct && (
            <span className="bg-pharma-blue text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
              Nouveau
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
              Épuisé
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm"
          aria-label="Favoris"
        >
          <Heart className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-pharma-green text-white py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? "Épuisé" : "Réserver"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-pharma-green transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product._count && product._count.reviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500">({product._count.reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-500 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            Plus que {product.stock} en stock
          </p>
        )}
        {product.stock > 5 && (
          <p className="text-xs text-pharma-green font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-pharma-green rounded-full" />
            En stock
          </p>
        )}
      </div>
    </Link>
  );
}
