"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

const FIELDS = [
  { key: "site_name",            label: "Nom du site",               type: "text" },
  { key: "site_address",         label: "Adresse du magasin",        type: "text" },
  { key: "site_phone",           label: "Téléphone",                 type: "text" },
  { key: "site_email",           label: "Email de contact",          type: "email" },
  { key: "site_hours",           label: "Horaires d'ouverture",      type: "text" },
  { key: "newsletter_title",     label: "Titre newsletter",          type: "text" },
  { key: "newsletter_subtitle",  label: "Sous-titre newsletter",     type: "textarea" },
];

export default function ParametresPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(setValues); }, []);

  const save = async () => {
    setSaving(true);
    const payload: Record<string, string> = {};
    FIELDS.forEach(({ key }) => { if (values[key] !== undefined) payload[key] = values[key]; });
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres du site</h1>
          <p className="text-sm text-gray-500 mt-1">Informations générales affichées sur le site</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-pharma-green text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" />{saved ? "Enregistré ✓" : saving ? "..." : "Enregistrer"}
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
        {FIELDS.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
            {type === "textarea" ? (
              <textarea
                rows={3}
                value={values[key] ?? ""}
                onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green resize-none"
              />
            ) : (
              <input
                type={type}
                value={values[key] ?? ""}
                onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pharma-green"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
