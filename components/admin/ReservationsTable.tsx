"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle, Package, XCircle, Phone, Mail } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Reservation } from "@/types";

interface ReservationsTableProps {
  reservations: Reservation[];
}

const STATUS_TRANSITIONS: Record<string, { next: string; label: string; icon: typeof CheckCircle }[]> = {
  PENDING: [{ next: "CONFIRMED", label: "Valider → préparation", icon: CheckCircle }],
  CONFIRMED: [{ next: "READY", label: "Marquer prête", icon: Package }],
  READY: [{ next: "COMPLETED", label: "Récupérée", icon: CheckCircle }],
};

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Statut mis à jour", variant: "success" });
      router.refresh();
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour", variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const cancelReservation = async (id: string) => {
    if (!confirm("Annuler cette réservation ?")) return;
    await updateStatus(id, "CANCELLED");
  };

  if (!reservations.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Aucune réservation pour le moment</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead>Retrait</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((r) => {
            const transitions = STATUS_TRANSITIONS[r.status] ?? [];
            return (
              <TableRow key={r.id} className={r.status === "PENDING" ? "bg-yellow-50" : ""}>
                <TableCell>
                  <span className="font-mono text-xs font-semibold text-gray-600">
                    #{r.confirmationId.slice(0, 8).toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                </TableCell>

                <TableCell>
                  <p className="font-semibold text-sm">{r.customerName}</p>
                  <a href={`mailto:${r.customerEmail}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {r.customerEmail}
                  </a>
                  <a href={`tel:${r.customerPhone}`} className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {r.customerPhone}
                  </a>
                </TableCell>

                <TableCell>
                  <div className="space-y-0.5">
                    {r.items?.slice(0, 2).map((item) => (
                      <p key={item.id} className="text-xs text-gray-600">
                        {item.quantity}× {item.productName}
                      </p>
                    ))}
                    {r.items?.length > 2 && (
                      <p className="text-xs text-gray-400">+{r.items.length - 2} autre(s)</p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <p className="text-sm font-medium">{formatDate(r.pickupDate)}</p>
                  <p className="text-xs text-gray-500">{r.pickupTime}</p>
                </TableCell>

                <TableCell>
                  <span className="font-bold text-pharma-green">{formatPrice(r.totalAmount)}</span>
                </TableCell>

                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(r.status)}`}>
                    {getStatusLabel(r.status)}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {transitions.map((t) => (
                      <Button
                        key={t.next}
                        size="sm"
                        variant="outline"
                        loading={updating === r.id}
                        onClick={() => updateStatus(r.id, t.next)}
                        className="text-xs h-8"
                      >
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                      </Button>
                    ))}
                    {["PENDING", "CONFIRMED"].includes(r.status) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => cancelReservation(r.id)}
                        className="text-xs h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
