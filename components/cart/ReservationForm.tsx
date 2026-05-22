"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Calendar, Clock, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCartStore } from "@/store/useCartStore";
import { PICKUP_SLOTS, formatPrice } from "@/lib/utils";

const schema = z.object({
  customerName: z.string().min(2, "Nom requis (min 2 caractères)"),
  customerEmail: z.string().email("Email invalide"),
  customerPhone: z.string().min(8, "Numéro de téléphone invalide"),
  pickupDate: z.string().min(1, "Choisissez une date"),
  pickupTime: z.string().min(1, "Choisissez un créneau"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function getMinDate(): string {
  const d = new Date();
  d.setHours(d.getHours() + 2);
  return d.toISOString().split("T")[0];
}

function getMaxDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

export default function ReservationForm() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!items.length) return;
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
          totalAmount: getTotalPrice(),
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la réservation");

      const { confirmationId } = await res.json();
      clearCart();
      router.push(`/confirmation/${confirmationId}`);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation. Réessayez.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const total = getTotalPrice();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-pharma-green" />
          Vos coordonnées
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="customerName">Nom complet *</Label>
            <Input
              id="customerName"
              placeholder="Jean Dupont"
              {...register("customerName")}
              className={errors.customerName ? "border-red-400" : ""}
            />
            {errors.customerName && (
              <p className="text-xs text-red-500">{errors.customerName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customerPhone">Téléphone *</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              {...register("customerPhone")}
              className={errors.customerPhone ? "border-red-400" : ""}
            />
            {errors.customerPhone && (
              <p className="text-xs text-red-500">{errors.customerPhone.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="customerEmail">Email *</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="jean@exemple.com"
              {...register("customerEmail")}
              className={errors.customerEmail ? "border-red-400" : ""}
            />
            {errors.customerEmail && (
              <p className="text-xs text-red-500">{errors.customerEmail.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pickup */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-pharma-green" />
          Retrait en magasin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="pickupDate">Date *</Label>
            <Input
              id="pickupDate"
              type="date"
              min={getMinDate()}
              max={getMaxDate()}
              {...register("pickupDate")}
              className={errors.pickupDate ? "border-red-400" : ""}
            />
            {errors.pickupDate && (
              <p className="text-xs text-red-500">{errors.pickupDate.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pickupTime">Créneau horaire *</Label>
            <select
              id="pickupTime"
              {...register("pickupTime")}
              className={`flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.pickupTime ? "border-red-400" : ""}`}
            >
              <option value="">Choisir un créneau</option>
              {PICKUP_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.pickupTime && (
              <p className="text-xs text-red-500">{errors.pickupTime.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-pharma-green" />
          Notes (optionnel)
        </h2>
        <Textarea
          placeholder="Instructions spéciales, demandes particulières..."
          rows={3}
          {...register("notes")}
        />
      </div>

      {/* Summary */}
      <div className="bg-pharma-green-light rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-900">Total à payer en magasin</span>
          <span className="text-2xl font-bold text-pharma-green">{formatPrice(total)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          💳 Espèces ou carte bancaire · Paiement uniquement au retrait
        </p>

        <Button type="submit" size="xl" loading={loading} className="w-full text-base">
          {loading ? "Réservation en cours..." : "Confirmer ma réservation →"}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Confirmation par email immédiate · Annulation gratuite
        </p>
      </div>
    </form>
  );
}
