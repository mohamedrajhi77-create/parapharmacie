export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, MapPin, Phone, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, STORE_INFO } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réservation confirmée",
  robots: { index: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { confirmationId: id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
  });

  if (!reservation) notFound();

  const total = Number(reservation.totalAmount);

  return (
    <div className="container-pharma py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-pharma-green-light rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-pharma-green" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Réservation confirmée !</h1>
          <p className="text-gray-500 text-lg">
            Un email de confirmation a été envoyé à{" "}
            <strong className="text-gray-800">{reservation.customerEmail}</strong>
          </p>
        </div>

        {/* Ref card */}
        <div className="bg-pharma-green-light border border-pharma-green/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Numéro de réservation</span>
            <span className="font-mono font-bold text-lg text-pharma-green">
              #{reservation.confirmationId.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-pharma-green flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Date de retrait</p>
                <p className="font-semibold text-gray-900">{formatDate(reservation.pickupDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-pharma-green flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Heure</p>
                <p className="font-semibold text-gray-900">{reservation.pickupTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-pharma-green flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Lieu de retrait</p>
                <p className="font-semibold text-gray-900">{STORE_INFO.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pharma-green" />
            Articles réservés ({reservation.items.length})
          </h2>
          <div className="space-y-3 mb-4">
            {reservation.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-sm text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-400">Quantité : {item.quantity}</p>
                </div>
                <span className="font-semibold text-sm">{formatPrice(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="font-bold text-gray-900">Total à payer en magasin</span>
            <span className="text-2xl font-bold text-pharma-green">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <h3 className="font-semibold text-amber-800 mb-2">💳 Paiement en magasin</h3>
          <p className="text-sm text-amber-700">
            Votre commande sera préparée et vous devrez régler au moment du retrait.
            Espèces et carte bancaire acceptées.
          </p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-200">
            <Phone className="w-4 h-4 text-amber-600" />
            <a href={`tel:${STORE_INFO.phone}`} className="text-sm font-medium text-amber-700 hover:underline">
              {STORE_INFO.phone}
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="flex-1">
            <Link href="/catalogue">
              Continuer mes achats
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <a href={STORE_INFO.mapUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="w-4 h-4" />
              Voir l'itinéraire
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
