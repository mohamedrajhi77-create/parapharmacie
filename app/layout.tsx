import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { STORE_INFO } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${STORE_INFO.name} | Réservation en ligne`,
    template: `%s | ${STORE_INFO.name}`,
  },
  description:
    "Parapharmacie en ligne avec retrait en magasin. Réservez vos produits de santé, beauté et bien-être. Paiement en magasin uniquement.",
  keywords: [
    "parapharmacie", "réservation en ligne", "click and collect",
    "produits de santé", "beauté", "bien-être", "pharmacie",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: STORE_INFO.name,
    title: `${STORE_INFO.name} | Réservation en ligne`,
    description: "Réservez vos produits de parapharmacie en ligne, payez en magasin.",
  },
  twitter: {
    card: "summary_large_image",
    title: STORE_INFO.name,
    description: "Réservez vos produits de parapharmacie en ligne.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Pharmacy",
              name: STORE_INFO.name,
              address: {
                "@type": "PostalAddress",
                streetAddress: STORE_INFO.address,
              },
              telephone: STORE_INFO.phone,
              email: STORE_INFO.email,
              url: process.env.NEXT_PUBLIC_SITE_URL,
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:30",
                  closes: "19:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday"],
                  opens: "09:00",
                  closes: "17:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
