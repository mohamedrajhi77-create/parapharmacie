"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff, Plus, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      toast({ title: !isActive ? "Produit activé" : "Produit désactivé", variant: "success" });
      router.refresh();
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    setDeleting(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Produit supprimé", variant: "success" });
      router.refresh();
    } else {
      toast({ title: "Erreur", variant: "destructive" });
    }
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/produits/nouveau">
            <Plus className="w-4 h-4" />
            Ajouter un produit
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={p.images[0] ?? "/placeholder-product.svg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">{p.name}</p>
                      {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                      {p.reference && <p className="text-xs text-gray-400 font-mono">#{p.reference}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{p.category?.name}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{formatPrice(p.price)}</span>
                  {p.comparePrice && (
                    <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(p.comparePrice)}</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-semibold flex items-center gap-1 ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-orange-500" : "text-green-600"}`}>
                    {p.stock === 0 && <AlertCircle className="w-3.5 h-3.5" />}
                    {p.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={p.isActive ? "green" : "secondary"}>
                      {p.isActive ? "Actif" : "Inactif"}
                    </Badge>
                    {p.isPromotion && <Badge variant="promo">Promo</Badge>}
                    {p.isNew && <Badge variant="new">Nouveau</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(p.id, p.isActive)}
                      className="h-8 w-8 p-0"
                    >
                      {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" asChild className="h-8 w-8 p-0">
                      <Link href={`/admin/produits/${p.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={deleting === p.id}
                      onClick={() => deleteProduct(p.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
