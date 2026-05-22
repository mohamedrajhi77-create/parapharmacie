"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Tag, BarChart3,
  Settings, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STORE_INFO } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", icon: ShoppingBag },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
  { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-pharma-green rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Admin</p>
            <p className="text-xs text-gray-400 truncate">{STORE_INFO.name}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-pharma-green text-white shadow-sm"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
        >
          <Settings className="w-4.5 h-4.5" />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
