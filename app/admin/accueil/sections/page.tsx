"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff } from "lucide-react";

const SECTION_KEYS = [
  { key: "show_bons_plans",   label: "Section Bons Plans",          desc: "Offres marques sur la page d'accueil" },
  { key: "show_brands",       label: "Section Marques Préférées",   desc: "Carousel des logos de marques" },
  { key: "show_astuces",      label: "Section Nos Astuces",         desc: "Articles conseils santé & beauté" },
  { key: "show_newsletter",   label: "Section Newsletter",          desc: "Formulaire d'inscription email" },
  { key: "show_how_it_works", label: "Comment ça marche",          desc: "Explication du Click & Collect" },
];

export default function SectionsAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(setSettings); }, []);

  const toggle = (key: string) => {
    setSettings(p => ({ ...p, [key]: p[key] === "true" ? "false" : "true" }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    const payload: Record<string, string> = {};
    SECTION_KEYS.forEach(({ key }) => { payload[key] = settings[key] ?? "true"; });
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sections visibles</h1>
          <p className="text-sm text-gray-500 mt-1">Activez ou désactivez les sections de la page d'accueil</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-pharma-green text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" />{saved ? "Enregistré ✓" : saving ? "..." : "Enregistrer"}
        </button>
      </div>

      <div className="space-y-3">
        {SECTION_KEYS.map(({ key, label, desc }) => {
          const active = settings[key] !== "false";
          return (
            <div key={key} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${active ? "bg-pharma-green-light text-pharma-green hover:bg-emerald-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
              >
                {active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {active ? "Visible" : "Masqué"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        ⚠️ Les modifications s'appliquent après redéploiement ou rechargement de la page
      </p>
    </div>
  );
}
