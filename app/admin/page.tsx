import { prisma } from "@/lib/prisma";
import StatsCards from "@/components/admin/StatsCards";
import ReservationsTable from "@/components/admin/ReservationsTable";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [
    totalReservations,
    pendingReservations,
    totalProducts,
    revenueData,
    recentReservations,
  ] = await Promise.all([
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.reservation.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["COMPLETED", "READY"] } },
    }),
    prisma.reservation.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: { select: { name: true } } } } },
    }),
  ]);

  return {
    stats: {
      totalReservations,
      pendingReservations,
      totalProducts,
      totalRevenue: Number(revenueData._sum.totalAmount ?? 0),
    },
    recentReservations: recentReservations.map((r) => ({
      ...r,
      totalAmount: Number(r.totalAmount),
      items: r.items.map((i) => ({ ...i, price: Number(i.price) })),
    })),
  };
}

export default async function AdminDashboard() {
  const { stats, recentReservations } = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenue dans l'espace d'administration</p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Recent reservations */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Réservations récentes</h2>
          <a href="/admin/reservations" className="text-sm text-pharma-green hover:underline font-medium">
            Voir toutes →
          </a>
        </div>
        <ReservationsTable reservations={recentReservations as any} />
      </div>
    </div>
  );
}
