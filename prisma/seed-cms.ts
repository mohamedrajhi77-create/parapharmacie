import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL } },
});

async function main() {
  console.log("🌱 Seeding CMS data...");

  // Hero Slides
  const heroSlides = [
    { badge: "☀️ Spécial Été", title: "Protection Solaire\nHaute Efficacité", subtitle: "SPF50+ pour toute la famille — visage, corps, bébé", cta: "Découvrir les solaires", href: "/catalogue?categorie=solaires", bg: "from-blue-600 to-sky-500", deco: "☀️", tags: ["La Roche-Posay", "Avène", "Vichy"], order: 1, isActive: true },
    { badge: "✨ Nouveautés", title: "Skincare Experts\nLes Incontournables", subtitle: "Sérums, crèmes et soins recommandés par les dermatologues", cta: "Voir les nouveautés", href: "/catalogue?categorie=visage&isNew=true", bg: "from-emerald-600 to-teal-500", deco: "🧴", tags: ["Bioderma", "CeraVe", "SVR"], order: 2, isActive: true },
    { badge: "💊 Santé au quotidien", title: "Compléments\nAlimentaires", subtitle: "Vitamines, probiotiques, oméga-3 pour renforcer votre bien-être", cta: "Découvrir les compléments", href: "/catalogue?categorie=complements-alimentaires", bg: "from-violet-600 to-purple-500", deco: "💊", tags: ["Pileje", "Arkopharma", "Solgar"], order: 3, isActive: true },
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: slide.order.toString() },
      update: slide,
      create: { id: slide.order.toString(), ...slide },
    });
  }
  console.log(`✅ ${heroSlides.length} slides hero`);

  // Astuces
  const astuces = [
    { id: "a1", category: "Soins visage", title: "Comment choisir son SPF selon son type de peau ?", excerpt: "La protection solaire n'est pas universelle. Peaux grasses, sèches ou mixtes : découvrez quelle texture convient le mieux à votre routine quotidienne.", href: "/catalogue?categorie=visage", emoji: "☀️", color: "bg-blue-50 text-blue-600", order: 1, isActive: true },
    { id: "a2", category: "Cheveux", title: "Routine capillaire : les 5 erreurs à éviter absolument", excerpt: "Shampoings trop fréquents, chaleur excessive, mauvais démêlage... Ces gestes du quotidien abîment vos cheveux sans que vous le sachiez.", href: "/catalogue?categorie=cheveux", emoji: "💇", color: "bg-amber-50 text-amber-600", order: 2, isActive: true },
    { id: "a3", category: "Compléments", title: "Magnésium, vitamine D ou oméga-3 : lequel vous manque ?", excerpt: "Fatigue, stress, crampes... Certains signaux indiquent des carences. Tour d'horizon des compléments alimentaires les plus utiles selon votre profil.", href: "/catalogue?categorie=complements-alimentaires", emoji: "💊", color: "bg-green-50 text-green-600", order: 3, isActive: true },
    { id: "a4", category: "Bébé & Maman", title: "Soins bébé : les produits essentiels pour les 6 premiers mois", excerpt: "Crème change, lait corps, gel de bain... Quels produits sont vraiment indispensables pour prendre soin de la peau délicate de votre nouveau-né ?", href: "/catalogue?categorie=bebe", emoji: "🍼", color: "bg-pink-50 text-pink-600", order: 4, isActive: true },
  ];

  for (const a of astuces) {
    await prisma.astuce.upsert({ where: { id: a.id }, update: a, create: a });
  }
  console.log(`✅ ${astuces.length} astuces`);

  // Bons Plans
  const bonsPlans = [
    { id: "b1", name: "La Roche-Posay", discount: "Jusqu'à -25%", href: "/catalogue?search=La+Roche-Posay&isPromotion=true", bg: "bg-blue-50", border: "border-blue-100", badge: "text-blue-700 bg-blue-100", order: 1, isActive: true },
    { id: "b2", name: "Avène", discount: "Jusqu'à -20%", href: "/catalogue?search=Avène&isPromotion=true", bg: "bg-sky-50", border: "border-sky-100", badge: "text-sky-700 bg-sky-100", order: 2, isActive: true },
    { id: "b3", name: "Bioderma", discount: "Jusqu'à -15%", href: "/catalogue?search=Bioderma&isPromotion=true", bg: "bg-red-50", border: "border-red-100", badge: "text-red-700 bg-red-100", order: 3, isActive: true },
    { id: "b4", name: "Vichy", discount: "Jusqu'à -30%", href: "/catalogue?search=Vichy&isPromotion=true", bg: "bg-emerald-50", border: "border-emerald-100", badge: "text-emerald-700 bg-emerald-100", order: 4, isActive: true },
    { id: "b5", name: "Nuxe", discount: "Jusqu'à -20%", href: "/catalogue?search=Nuxe&isPromotion=true", bg: "bg-amber-50", border: "border-amber-100", badge: "text-amber-700 bg-amber-100", order: 5, isActive: true },
    { id: "b6", name: "Pileje", discount: "Jusqu'à -25%", href: "/catalogue?search=Pileje&isPromotion=true", bg: "bg-teal-50", border: "border-teal-100", badge: "text-teal-700 bg-teal-100", order: 6, isActive: true },
  ];

  for (const b of bonsPlans) {
    await prisma.bonPlan.upsert({ where: { id: b.id }, update: b, create: b });
  }
  console.log(`✅ ${bonsPlans.length} bons plans`);

  // Site settings
  const settings = [
    { key: "site_name", value: "Parapharmacie Centrale", description: "Nom du site" },
    { key: "site_address", value: "Résidence El Menzah 5, Ariana, Tunis", description: "Adresse du magasin" },
    { key: "site_phone", value: "+216 71 234 567", description: "Téléphone" },
    { key: "site_email", value: "contact@parapharmacie-centrale.tn", description: "Email de contact" },
    { key: "site_hours", value: "Lun–Ven 8h30–19h | Sam 9h–17h", description: "Horaires d'ouverture" },
    { key: "newsletter_title", value: "Restez informé(e)", description: "Titre de la newsletter" },
    { key: "newsletter_subtitle", value: "Recevez nos offres exclusives, nouveautés et conseils santé & beauté.", description: "Sous-titre newsletter" },
    { key: "show_newsletter", value: "true", description: "Afficher la section newsletter" },
    { key: "show_astuces", value: "true", description: "Afficher la section astuces" },
    { key: "show_bons_plans", value: "true", description: "Afficher la section bons plans" },
    { key: "show_brands", value: "true", description: "Afficher la section marques" },
    { key: "show_how_it_works", value: "true", description: "Afficher Comment ça marche" },
  ];

  for (const s of settings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: s, create: s });
  }
  console.log(`✅ ${settings.length} paramètres`);

  console.log("\n🎉 CMS seeding terminé !");
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
