"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { ArrowLeft, Upload, Plus, X, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Category } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  brand: z.string().optional(),
  reference: z.string().optional(),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1, "Catégorie requise"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  usageAdvice: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isPromotion: z.boolean().default(false),
  weight: z.coerce.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductFormPage({ params }: PageProps) {
  const { id } = use(params);
  const isNew = id === "nouveau";
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, stock: 0 },
  });

  const name = watch("name");

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);

    if (!isNew) {
      fetch(`/api/products/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            reset({
              name: data.name,
              slug: data.slug,
              brand: data.brand ?? "",
              reference: data.reference ?? "",
              price: data.price,
              comparePrice: data.comparePrice ?? undefined,
              stock: data.stock,
              categoryId: data.categoryId,
              shortDescription: data.shortDescription ?? "",
              description: data.description ?? "",
              usageAdvice: data.usageAdvice ?? "",
              isActive: data.isActive,
              isFeatured: data.isFeatured,
              isNew: data.isNew,
              isPromotion: data.isPromotion,
              weight: data.weight ?? undefined,
            });
            setImages(data.images ?? []);
            setTags(data.tags ?? []);
          }
        });
    }
  }, [id, isNew, reset]);

  // Auto-slug from name
  useEffect(() => {
    if (isNew && name) {
      setValue("slug", name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim());
    }
  }, [name, isNew, setValue]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const { url } = await res.json();
      setImages((prev) => [...prev, url]);
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = { ...data, images, tags };
      const url = isNew ? "/api/products" : `/api/products/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast({ title: isNew ? "Produit créé !" : "Produit mis à jour !", variant: "success" });
      router.push("/admin/produits");
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/produits"><ArrowLeft className="w-4 h-4" /> Retour</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "Nouveau produit" : "Modifier le produit"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 mb-4">Informations de base</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Nom du produit *</Label>
              <Input {...register("name")} placeholder="ex: Crème hydratante SPF50" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Slug URL *</Label>
              <Input {...register("slug")} placeholder="creme-hydratante-spf50" />
            </div>

            <div className="space-y-1.5">
              <Label>Marque</Label>
              <Input {...register("brand")} placeholder="ex: La Roche-Posay" />
            </div>

            <div className="space-y-1.5">
              <Label>Référence</Label>
              <Input {...register("reference")} placeholder="REF-001" />
            </div>

            <div className="space-y-1.5">
              <Label>Catégorie *</Label>
              <select {...register("categoryId")} className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Choisir une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Prix & Stock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Prix de vente (€) *</Label>
              <Input type="number" step="0.01" {...register("price")} placeholder="12.90" />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Prix barré (€)</Label>
              <Input type="number" step="0.01" {...register("comparePrice")} placeholder="15.90" />
            </div>
            <div className="space-y-1.5">
              <Label>Stock *</Label>
              <Input type="number" {...register("stock")} placeholder="50" />
            </div>
            <div className="space-y-1.5">
              <Label>Poids (g)</Label>
              <Input type="number" step="0.1" {...register("weight")} placeholder="150" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 mb-4">Description</h2>
          <div className="space-y-1.5">
            <Label>Description courte</Label>
            <Input {...register("shortDescription")} placeholder="Résumé en une ligne" />
          </div>
          <div className="space-y-1.5">
            <Label>Description complète</Label>
            <Textarea {...register("description")} rows={4} placeholder="Description détaillée..." />
          </div>
          <div className="space-y-1.5">
            <Label>Conseils d'utilisation</Label>
            <Textarea {...register("usageAdvice")} rows={3} placeholder="Comment utiliser ce produit..." />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Images</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" sizes="120px" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-pharma-green flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Upload className={`w-6 h-6 ${uploading ? "text-pharma-green animate-bounce" : "text-gray-400"}`} />
              <span className="text-xs text-gray-500 mt-1">{uploading ? "..." : "Ajouter"}</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Tags</h2>
          <div className="flex gap-2 mb-3">
            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="ex: anti-âge" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
            <Button type="button" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 bg-pharma-green-light text-pharma-green text-sm px-3 py-1 rounded-full">
                {tag}
                <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Options</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              { name: "isActive", label: "Actif" },
              { name: "isFeatured", label: "En vedette" },
              { name: "isNew", label: "Nouveau" },
              { name: "isPromotion", label: "En promotion" },
            ] as const).map((opt) => (
              <label key={opt.name} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
                <input type="checkbox" {...register(opt.name)} className="w-4 h-4 accent-pharma-green" />
                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" size="lg" loading={loading}>
            <Save className="w-4 h-4" />
            {isNew ? "Créer le produit" : "Enregistrer les modifications"}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/produits">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
