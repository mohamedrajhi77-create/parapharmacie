"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
      setEmail("");
    }
  };

  return (
    <section className="py-12 bg-pharma-green">
      <div className="container-pharma">
        <div className="max-w-2xl mx-auto text-center text-white">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-2xl font-bold mb-2">Restez informé(e)</h2>
          <p className="text-emerald-100 text-sm mb-6">
            Recevez nos offres exclusives, nouveautés et conseils santé &amp; beauté directement dans votre boîte mail.
          </p>

          {sent ? (
            <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">Merci ! Vous êtes bien inscrit(e).</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Votre adresse email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-white text-pharma-green font-bold px-5 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-sm flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                S&apos;inscrire
              </button>
            </form>
          )}

          <p className="text-emerald-200 text-xs mt-4">
            Aucun spam. Désabonnement en un clic.
          </p>
        </div>
      </div>
    </section>
  );
}
