"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();

  const total = getTotalPrice();
  const count = getTotalItems();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0">
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-pharma-green" />
            Mon panier
            {count > 0 && (
              <span className="bg-pharma-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingCart className="w-9 h-9 text-gray-300" />
            </div>
            <p className="font-semibold text-gray-900 mb-2">Votre panier est vide</p>
            <p className="text-sm text-gray-500 mb-6">
              Parcourez notre catalogue et ajoutez des produits
            </p>
            <Button asChild onClick={closeCart}>
              <Link href="/catalogue">
                Voir le catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.product.images[0] ?? "/placeholder-product.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-medium">{item.product.brand}</p>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-sm font-bold text-pharma-green mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-40"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total ({count} article{count > 1 ? "s" : ""})</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total à payer</span>
                <span className="font-bold text-xl text-pharma-green">{formatPrice(total)}</span>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-amber-700 text-center">
                  💳 Paiement en espèces ou carte <strong>en magasin uniquement</strong>
                </p>
              </div>

              <Button asChild size="lg" className="w-full" onClick={closeCart}>
                <Link href="/panier">
                  Confirmer la réservation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <button
                onClick={closeCart}
                className="w-full text-sm text-gray-500 hover:text-gray-700 text-center transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
