"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff } from "lucide-react";

interface Astuce {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  href: string;
  emoji: string;
  color: string;
  order: number;
  isActive: boolean;
}

const COLOR_OPTIONS = [
  { label: "Bleu", value: "bg-blue-50 text-blue-600" },
  { label: "Ambre", value: "bg-amber-50 text-amber-600" },
  { label: "Vert", value: "bg-green-50 text-green-600" },
  { label: "Rose", value: "bg-pink-50 text-pink-600" },
  { label: "Violet", value: "bg-violet-50 text-violet-600" },
  { label: "Orange", value: "bg-orange-50 text-orange-600" },
];

const empty = { category: "", title: "", excerpt: "", href: "/catalogue", emoji: "💡", color: "bg-blue-50 text-blue-600" };

export default function AstucesAdminPage() {
  const [astuces, setAstuces] = useState<Astuce[]>([]);
  const [editing, setEditing] = useState<Astuce | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/admin/astuces").then(r => r.json()).then(setAstuces); }, []);

  const openCreate = () => { setForm(empty); setCreating(true); setEditing(null); };
  const openEdit = (a: Astuce) => { setEditing(a); setForm({ category: a.category, title: a.title, excerpt: a.excerpt, href: a.href, emoji: a.emoji, color: a.color }); setCreating(false); };
  const close = () => { setCreating(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    if (creating) {
      const r = await fetch("/api/admin/astuces", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: astuces.length + 1 }) });
      setAstuces(p => [...p, await r.json()]);
    } else if (editing) {
      const r = await fetch(`/api/admin/astuces/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setAstuces(p => p.map(a => a.id === editing.id ? { ...a, ...await r.clone().json() } : a));
    }
    setSaving(false);
    close();
  };

  const toggle = async (a: Astuce) => {
    const r = await fetch(`/api/admin/astuces/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !a.isActive }) });
    setAstuces(p => p.map(x => x.id === a.id ? { ...x, ...(r.ok ? { isActive: !a.isActive } : {}) } : x));
    fetch("/api/admin/astuces").then(r => r.json()).then(setAstuces);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette astuce ?")) return;
    await fetch(`/api/admin/astuces/${id}`, { method: "DELETE" });
    setAstuces(p => p.filter(a => a.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nos Astuces</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les articles conseils de la page d'accueil</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-pharma-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Ajouter une astuce
        </button>
      </div>

      <div className="space-y-3">
        {astuces.map((a) => (
          <div key={a.id} className={`flex items-start gap-4 bg-white border rounded-2xl p-4 shadow-sm ${!a.isActive ? "opacity-50" : ""}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${a.color.split(" ")[0]}`}>{a.emoji}</div>
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.color}`}>{a.category}</span>
              <p className="font-semibold text-gray-900 text-sm mt-1 line-clamp-1">{a.title}</p>
              <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{a.excerpt}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggle(a)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                {a.isActive ? <Eye className="w-4 h-4 text-pharma-green" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              </button>
              <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-blue-500" /></button>
              <button onClick={() => remove(a.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {astuces.length === 0 && <p className="text-gray-400 text-sm text-center py-10">Aucune astuce.</p>}
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-lg">{creating ? "Nouvelle astuce" : "Modifier"}</h2>
              <button onClick={close}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Catégorie (ex: Soins visage)", key: "category" },
                { label: "Emoji", key: "emoji" },
                { label: "Titre", key: "title" },
                { label: "Lien (ex: /catalogue?categorie=visage)", key: "href" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input type="text" value={(form as Record<string, string>)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Extrait / description</label>
                <textarea rows={3} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Couleur</label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setForm(p => ({ ...p, color: opt.value }))} className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${opt.color} ${form.color === opt.value ? "border-gray-900" : "border-transparent"}`}>
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
