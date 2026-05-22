export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import ReservationsTable from "@/components/admin/ReservationsTable";
import { getStatusLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Réservations" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ReservationsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const reservations = await prisma.reservation.findMany({
    where: params.status ? { status: params.status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
    },
  });

  const serialized = reservations.map((r) => ({
    ...r,
    totalAmount: Number(r.totalAmount),
    items: r.items.map((i) => ({ ...i, price: Number(i.price) })),
  }));

  const counts = await prisma.reservation.groupBy({
    by: ["status"],
    _count: true,
  });

  const statusCounts = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  const statuses = ["PENDING", "CONFIRMED", "READY", "COMPLETED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Réservations</h1>
        <p className="text-gray-500 text-sm mt-1">{serialized.length} réservation{serialized.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <a
          href="/admin/reservations"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !params.status ? "bg-pharma-green text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Toutes ({Object.values(statusCounts).reduce((a, b) => a + b, 0)})
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={`/admin/reservations?status=${s}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              params.status === s ? "bg-pharma-green text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {getStatusLabel(s)} ({statusCounts[s] ?? 0})
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ReservationsTable reservations={serialized as any} />
      </div>
    </div>
  );
}
