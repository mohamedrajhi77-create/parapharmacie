"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "" });
  const { toast } = useToast();
  const router = useRouter();

  const load = () =>
    fetch("/api/categories").then((r) => r.json()).then(setCategories);

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", slug: "", description: "", icon: "" }); setOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", icon: cat.icon ?? "" }); setOpen(true); };

  const handleSave = async () => {
    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      toast({ title: editing ? "Catégorie mise à jour" : "Catégorie créée", variant: "success" });
      setOpen(false);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) { toast({ title: "Catégorie supprimée", variant: "success" }); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Ajouter</Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-pharma-green-light rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {cat.icon ?? "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400 font-mono">{cat.slug} · {cat._count?.products ?? 0} produits</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(cat)} className="h-8 w-8 p-0">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(cat.id)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nom *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Icône (emoji)</Label>
              <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🧴" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1">Enregistrer</Button>
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">Annuler</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
