"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import Filters from "./Filters";
import type { Category } from "@/types";

interface MobileFiltersDrawerProps {
  categories: Category[];
}

export default function MobileFiltersDrawer({ categories }: MobileFiltersDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtres
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transition-transform duration-300 lg:hidden overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-900">Filtres</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <Filters categories={categories} />
        </div>
        <div className="p-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-pharma-green text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Voir les résultats
          </button>
        </div>
      </div>
    </>
  );
}
