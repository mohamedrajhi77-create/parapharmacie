export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, MapPin, Phone, ShoppingBag, ArrowRight, Hourglass, Package, PackageCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice, STORE_INFO, RESERVATION_STEPS, getStatusStep } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suivi de réservation",
  robots: { index: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const STEP_ICONS = [Hourglass, Package, PackageCheck];

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
  const currentStep = getStatusStep(reservation.status);
  const isCancelled = reservation.status === "CANCELLED";
  const isCompleted = reservation.status === "COMPLETED";

  const headerConfig = isCancelled
    ? { icon: XCircle, color: "text-red-600", bg: "bg-red-50", title: "Réservation annulée", subtitle: "Cette commande a été annulée." }
    : isCompleted
      ? { icon: CheckCircle, color: "text-pharma-green", bg: "bg-pharma-green-light", title: "Commande récupérée", subtitle: "Merci pour votre confiance !" }
      : currentStep === 0
        ? { icon: Hourglass, color: "text-amber-600", bg: "bg-amber-50", title: "Réservation reçue", subtitle: "Votre commande est en cours de validation par la parapharmacie." }
        : currentStep === 1
          ? { icon: Package, color: "text-blue-600", bg: "bg-blue-50", title: "Commande validée", subtitle: "Votre commande est en cours de préparation." }
          : { icon: PackageCheck, color: "text-pharma-green", bg: "bg-pharma-green-light", title: "Commande prête !", subtitle: "Vous pouvez venir la récupérer en magasin." };

  const HeaderIcon = headerConfig.icon;

  return (
    <div className="container-pharma py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        {/* Status header */}
        <div className="text-center mb-10">
          <div className={`w-20 h-20 ${headerConfig.bg} rounded-full flex items-center justify-center mx-auto mb-5`}>
            <HeaderIcon className={`w-10 h-10 ${headerConfig.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{headerConfig.title}</h1>
          <p className="text-gray-500 text-lg">{headerConfig.subtitle}</p>
          <p className="text-gray-400 text-sm mt-2">
            Confirmation envoyée à <strong className="text-gray-700">{reservation.customerEmail}</strong>
          </p>
        </div>

        {/* Status timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-6">Suivi de votre commande</h2>
            <div className="relative">
              {RESERVATION_STEPS.map((step, idx) => {
                const Icon = STEP_ICONS[idx];
                const isActive = idx === currentStep;
                const isDone = idx < currentStep || isCompleted;
                const isUpcoming = idx > currentStep && !isCompleted;
                return (
                  <div key={step.status} className="flex gap-4 pb-6 last:pb-0 relative">
                    {idx < RESERVATION_STEPS.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 bottom-0 w-0.5 ${isDone ? "bg-pharma-green" : "bg-gray-200"}`}
                      />
                    )}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDone
                          ? "bg-pharma-green text-white"
                          : isActive
                            ? "bg-pharma-green text-white ring-4 ring-pharma-green/20 animate-pulse"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p
                        className={`font-semibold text-sm ${
                          isDone || isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isUpcoming ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                      {isActive && (
                        <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-pharma-green bg-pharma-green-light px-2 py-0.5 rounded-full">
                          Étape en cours
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
              Voir l&apos;itinéraire
            </a>
          </Button>
        </div>

        {/* Auto-refresh hint */}
        {!isCancelled && !isCompleted && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Cette page se met à jour automatiquement. Vous recevrez un email à chaque changement de statut.
          </p>
        )}
      </div>
    </div>
  );
}
