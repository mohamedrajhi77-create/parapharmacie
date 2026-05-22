"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from "lucide-react";

interface BonPlan {
  id: string;
  name: string;
  discount: string;
  href: string;
  bg: string;
  border: string;
  badge: string;
  order: number;
  isActive: boolean;
}

const STYLE_OPTIONS = [
  { label: "Bleu",   bg: "bg-blue-50",   border: "border-blue-100",   badge: "text-blue-700 bg-blue-100" },
  { label: "Vert",   bg: "bg-emerald-50", border: "border-emerald-100", badge: "text-emerald-700 bg-emerald-100" },
  { label: "Rouge",  bg: "bg-red-50",    border: "border-red-100",    badge: "text-red-700 bg-red-100" },
  { label: "Ambre",  bg: "bg-amber-50",  border: "border-amber-100",  badge: "text-amber-700 bg-amber-100" },
  { label: "Violet", bg: "bg-violet-50", border: "border-violet-100", badge: "text-violet-700 bg-violet-100" },
  { label: "Teal",   bg: "bg-teal-50",   border: "border-teal-100",   badge: "text-teal-700 bg-teal-100" },
];

const empty = { name: "", discount: "Jusqu'à -20%", href: "/catalogue?isPromotion=true", bg: "bg-blue-50", border: "border-blue-100", badge: "text-blue-700 bg-blue-100" };

export default function BonsPlansAdminPage() {
  const [bonsPlans, setBonsPlans] = useState<BonPlan[]>([]);
  const [editing, setEditing] = useState<BonPlan | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/admin/bons-plans").then(r => r.json()).then(setBonsPlans); }, []);

  const openCreate = () => { setForm(empty); setCreating(true); setEditing(null); };
  const openEdit = (b: BonPlan) => { setEditing(b); setForm({ name: b.name, discount: b.discount, href: b.href, bg: b.bg, border: b.border, badge: b.badge }); setCreating(false); };
  const close = () => { setCreating(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    if (creating) {
      const r = await fetch("/api/admin/bons-plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: bonsPlans.length + 1 }) });
      setBonsPlans(p => [...p, await r.json()]);
    } else if (editing) {
      await fetch(`/api/admin/bons-plans/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      fetch("/api/admin/bons-plans").then(r => r.json()).then(setBonsPlans);
    }
    setSaving(false); close();
  };

  const toggle = async (b: BonPlan) => {
    await fetch(`/api/admin/bons-plans/${b.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !b.isActive }) });
    fetch("/api/admin/bons-plans").then(r => r.json()).then(setBonsPlans);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`/api/admin/bons-plans/${id}`, { method: "DELETE" });
    setBonsPlans(p => p.filter(b => b.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nos Bons Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les offres marques de la page d'accueil</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-pharma-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {bonsPlans.map((b) => (
          <div key={b.id} className={`${b.bg} border ${b.border} rounded-2xl p-4 ${!b.isActive ? "opacity-40" : ""}`}>
            <div className="flex items-start justify-between mb-2">
              <p className="font-bold text-sm text-gray-800">{b.name}</p>
              <div className="flex gap-1">
                <button onClick={() => toggle(b)} className="p-1 rounded hover:bg-white/50">{b.isActive ? <Eye className="w-3.5 h-3.5 text-pharma-green" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}</button>
                <button onClick={() => openEdit(b)} className="p-1 rounded hover:bg-white/50"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
                <button onClick={() => remove(b.id)} className="p-1 rounded hover:bg-white/50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.badge}`}>{b.discount}</span>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-lg">{creating ? "Nouveau bon plan" : "Modifier"}</h2>
              <button onClick={close}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nom de la marque", key: "name" },
                { label: "Remise (ex: Jusqu'à -25%)", key: "discount" },
                { label: "Lien", key: "href" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input type="text" value={(form as Record<string, string>)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Style de couleur</label>
                <div className="grid grid-cols-3 gap-2">
                  {STYLE_OPTIONS.map(opt => (
                    <button key={opt.label} onClick={() => setForm(p => ({ ...p, bg: opt.bg, border: opt.border, badge: opt.badge }))} className={`${opt.bg} border-2 ${form.bg === opt.bg ? "border-gray-900" : opt.border} rounded-xl py-2 text-xs font-bold ${opt.badge.split(" ")[0]} transition-all`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={close} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Annuler</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-pharma-green text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-emerald-700 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />{saving ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
