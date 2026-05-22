"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, GripVertical, Eye, EyeOff } from "lucide-react";

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  deco: string;
  tags: string[];
  order: number;
  isActive: boolean;
}

const BG_OPTIONS = [
  { label: "Bleu", value: "from-blue-600 to-sky-500" },
  { label: "Vert", value: "from-emerald-600 to-teal-500" },
  { label: "Violet", value: "from-violet-600 to-purple-500" },
  { label: "Rose", value: "from-pink-600 to-rose-500" },
  { label: "Orange", value: "from-orange-600 to-amber-500" },
  { label: "Indigo", value: "from-indigo-600 to-blue-500" },
];

const empty: Omit<HeroSlide, "id" | "order" | "isActive"> = {
  badge: "", title: "", subtitle: "", cta: "Découvrir", href: "/catalogue",
  bg: "from-emerald-600 to-teal-500", deco: "🧴", tags: [],
};

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/admin/hero").then(r => r.json()).then(setSlides); }, []);

  const openCreate = () => { setForm(empty); setTagsInput(""); setCreating(true); setEditing(null); };
  const openEdit = (s: HeroSlide) => { setEditing(s); setForm({ badge: s.badge, title: s.title, subtitle: s.subtitle, cta: s.cta, href: s.href, bg: s.bg, deco: s.deco, tags: s.tags }); setTagsInput(s.tags.join(", ")); setCreating(false); };
  const close = () => { setCreating(false); setEditing(null); };

  const save = async () => {
    setSaving(true);
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const payload = { ...form, tags };
    if (creating) {
      const r = await fetch("/api/admin/hero", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, order: slides.length + 1 }) });
      const newSlide = await r.json();
      setSlides(p => [...p, newSlide]);
    } else if (editing) {
      const r = await fetch(`/api/admin/hero/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const updated = await r.json();
      setSlides(p => p.map(s => s.id === editing.id ? updated : s));
    }
    setSaving(false);
    close();
  };

  const toggle = async (slide: HeroSlide) => {
    const r = await fetch(`/api/admin/hero/${slide.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !slide.isActive }) });
    const updated = await r.json();
    setSlides(p => p.map(s => s.id === slide.id ? updated : s));
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce slide ?")) return;
    await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
    setSlides(p => p.filter(s => s.id !== id));
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slides Hero</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez le carousel de la page d'accueil</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-pharma-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Ajouter un slide
        </button>
      </div>

      {/* Slide list */}
      <div className="space-y-3">
        {slides.map((slide) => (
          <div key={slide.id} className={`flex items-center gap-4 bg-white border rounded-2xl p-4 shadow-sm ${!slide.isActive ? "opacity-50" : ""}`}>
            <GripVertical className="w-5 h-5 text-gray-300 flex-shrink-0" />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${slide.bg} flex items-center justify-center text-2xl flex-shrink-0`}>{slide.deco}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{slide.badge} — {slide.title.replace("\n", " ")}</p>
              <p className="text-xs text-gray-400 truncate">{slide.subtitle}</p>
              <div className="flex gap-1 mt-1">{slide.tags.map(t => <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>)}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggle(slide)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title={slide.isActive ? "Désactiver" : "Activer"}>
                {slide.isActive ? <Eye className="w-4 h-4 text-pharma-green" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              </button>
              <button onClick={() => openEdit(slide)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Edit2 className="w-4 h-4 text-blue-500" />
              </button>
              <button onClick={() => remove(slide.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && <p className="text-gray-400 text-sm text-center py-10">Aucun slide. Créez-en un !</p>}
      </div>

      {/* Modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-lg">{creating ? "Nouveau slide" : "Modifier le slide"}</h2>
              <button onClick={close}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Badge (ex: ☀️ Spécial Été)", key: "badge" },
                { label: "Titre (↵ pour saut de ligne)", key: "title" },
                { label: "Sous-titre", key: "subtitle" },
                { label: "Texte du bouton", key: "cta" },
                { label: "Lien du bouton (ex: /catalogue?categorie=solaires)", key: "href" },
                { label: "Emoji décoratif", key: "deco" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  {key === "title" || key === "subtitle" ? (
                    <textarea rows={2} value={(form as Record<string, string>)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green resize-none" />
                  ) : (
                    <input type="text" value={(form as Record<string, string>)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green" />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tags (séparés par des virgules)</label>
                <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="La Roche-Posay, Avène, Vichy" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Couleur de fond</label>
                <div className="grid grid-cols-3 gap-2">
                  {BG_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setForm(p => ({ ...p, bg: opt.value }))} className={`h-10 rounded-xl bg-gradient-to-r ${opt.value} text-white text-xs font-bold border-2 transition-all ${form.bg === opt.value ? "border-gray-900 scale-105" : "border-transparent"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={close} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-pharma-green text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />{saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
