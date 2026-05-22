import { ShoppingBag, Clock, Package, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    totalReservations: number;
    pendingReservations: number;
    totalProducts: number;
    totalRevenue: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total réservations",
      value: stats.totalReservations,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      change: "+12%",
    },
    {
      label: "En attente",
      value: stats.pendingReservations,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
      urgent: stats.pendingReservations > 0,
    },
    {
      label: "Produits actifs",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-pharma-green-light text-pharma-green",
    },
    {
      label: "Revenu total estimé",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-2xl p-5 border shadow-sm ${card.urgent ? "border-yellow-300 ring-2 ring-yellow-100" : "border-gray-100"}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
              <card.icon className="w-5 h-5" />
            </div>
            {card.urgent && (
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          {card.change && (
            <p className="text-xs text-green-600 font-medium mt-1">{card.change} ce mois</p>
          )}
        </div>
      ))}
    </div>
  );
}
