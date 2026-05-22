"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import ReservationForm from "@/components/cart/ReservationForm";

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const total = getTotalPrice();
  const count = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="container-pharma py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-200" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Votre panier est vide</h1>
          <p className="text-gray-500 mb-8">Parcourez notre catalogue et ajoutez des produits pour les réserver.</p>
          <Button asChild size="lg">
            <Link href="/catalogue">Voir le catalogue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pharma py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/catalogue"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-pharma-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuer les achats
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-2xl font-bold text-gray-900">
          Mon panier ({count} article{count > 1 ? "s" : ""})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
              {/* Image */}
              <Link href={`/produit/${item.product.slug}`}>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={item.product.images[0] ?? "/placeholder-product.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {item.product.brand && (
                      <p className="text-xs text-gray-400 font-medium uppercase">{item.product.brand}</p>
                    )}
                    <Link href={`/produit/${item.product.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-pharma-green transition-colors text-sm sm:text-base line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400">{formatPrice(item.product.price)} /unité</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Summary (mobile) */}
          <div className="lg:hidden bg-gray-50 rounded-2xl p-5">
            <div className="flex justify-between font-semibold text-lg mb-1">
              <span>Total</span>
              <span className="text-pharma-green">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-gray-500">Paiement en magasin uniquement</p>
          </div>
        </div>

        {/* Reservation form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Finaliser la réservation</h2>
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
