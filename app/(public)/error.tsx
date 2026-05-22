"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="container-pharma py-20 text-center">
      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
      <p className="text-gray-500 mb-8">Le service est temporairement indisponible. Veuillez réessayer.</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={reset}>Réessayer</Button>
        <Button variant="outline" asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
