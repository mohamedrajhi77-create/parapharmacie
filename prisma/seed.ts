import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Seed must use direct connection (not pooler)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    },
  },
});

const categories = [
  { name: "Soins visage", slug: "soins-visage", icon: "🧴", description: "Crèmes, sérums, nettoyants visage", order: 1 },
  { name: "Corps & Bien-être", slug: "corps-bien-etre", icon: "💆", description: "Soins corporels, hydratants, relaxation", order: 2 },
  { name: "Cheveux", slug: "cheveux", icon: "💇", description: "Shampooings, après-shampooings, masques", order: 3 },
  { name: "Bébé & Maman", slug: "bebe-maman", icon: "🍼", description: "Soins pour bébé et futures mamans", order: 4 },
  { name: "Compléments alimentaires", slug: "complements-alimentaires", icon: "💊", description: "Vitamines, minéraux, probiotiques", order: 5 },
  { name: "Solaire", slug: "solaire", icon: "☀️", description: "Protection solaire, après-soleil", order: 6 },
  { name: "Maquillage", slug: "maquillage", icon: "💄", description: "Fond de teint, rouges à lèvres, mascaras", order: 7 },
  { name: "Hygiène", slug: "hygiene", icon: "🪥", description: "Déodorants, soins dentaires, hygiène intime", order: 8 },
  { name: "Homme", slug: "homme", icon: "🧔", description: "Soins spécifiques pour hommes", order: 9 },
  { name: "Diététique", slug: "dietetique", icon: "🥗", description: "Produits minceur, nutrition sportive", order: 10 },
];

const products = [
  {
    name: "Crème Hydratante Légère SPF50",
    slug: "creme-hydratante-legere-spf50",
    brand: "La Roche-Posay",
    price: 18.90,
    comparePrice: 22.50,
    stock: 45,
    isActive: true,
    isFeatured: true,
    isNew: false,
    isPromotion: true,
    shortDescription: "Protection solaire quotidienne visage, texture légère, peaux normales à mixtes",
    description: "La Crème Hydratante Légère SPF50 de La Roche-Posay offre une protection solaire haute avec un filtre UVA/UVB. Sa texture ultra-légère convient parfaitement aux peaux normales à mixtes. Enrichie en eau thermale de La Roche-Posay, elle hydrate la peau toute la journée.",
    usageAdvice: "Appliquer le matin sur le visage et le cou après les soins habituels. Renouveler l'application toutes les 2 heures lors d'exposition prolongée au soleil.",
    images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"],
    tags: ["SPF", "hydratant", "solaire", "visage"],
    categorySlug: "soins-visage",
  },
  {
    name: "Sérum Vitamine C 20%",
    slug: "serum-vitamine-c-20",
    brand: "Typology",
    price: 24.50,
    stock: 30,
    isActive: true,
    isFeatured: true,
    isNew: true,
    isPromotion: false,
    shortDescription: "Sérum anti-taches et éclat, concentré en vitamine C pure à 20%",
    description: "Ce sérum à la vitamine C pure à 20% illumine le teint et réduit l'apparence des taches brunes. Formule clean, sans parfum, vegan et cruelty-free.",
    usageAdvice: "Appliquer 2 à 3 gouttes le matin sur visage propre avant la crème solaire.",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"],
    tags: ["vitamine C", "éclat", "anti-taches", "sérum"],
    categorySlug: "soins-visage",
  },
  {
    name: "Shampoing Réparateur Kératine",
    slug: "shampoing-reparateur-keratine",
    brand: "Kérastase",
    price: 28.00,
    stock: 25,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isPromotion: false,
    shortDescription: "Shampoing professionnel pour cheveux abîmés et colorés",
    description: "Enrichi en kératine et en protéines de soie, ce shampoing reconstruit les fibres capillaires fragilisées. Résultat : cheveux plus forts, brillants et résistants dès le premier lavage.",
    usageAdvice: "Appliquer sur cheveux mouillés, masser et rincer. Renouveler l'application si nécessaire. Utiliser avec le soin assortis pour un résultat optimal.",
    images: ["https://images.unsplash.com/photo-1626170620573-6c2a8e0fb879?w=400&h=400&fit=crop"],
    tags: ["shampoing", "kératine", "cheveux abimés", "réparation"],
    categorySlug: "cheveux",
  },
  {
    name: "Lait Corps Hydratant 24H",
    slug: "lait-corps-hydratant-24h",
    brand: "Aroma-Zone",
    price: 12.90,
    comparePrice: 15.00,
    stock: 60,
    isActive: true,
    isFeatured: true,
    isNew: false,
    isPromotion: true,
    shortDescription: "Lait corps doux, formule légère pour une hydratation 24h",
    description: "Ce lait corps à texture légère pénètre rapidement sans laisser de film gras. Enrichi en beurre de karité et en aloe vera, il hydrate et nourrit intensément. Parfum délicat de fleur de coton.",
    usageAdvice: "Appliquer après la douche sur peau propre et légèrement humide. Masser doucement jusqu'à absorption complète.",
    images: ["https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop"],
    tags: ["corps", "hydratant", "lait", "karité"],
    categorySlug: "corps-bien-etre",
  },
  {
    name: "Vitamine D3 + K2 - 60 gélules",
    slug: "vitamine-d3-k2-60-gelules",
    brand: "Solgar",
    price: 22.00,
    stock: 40,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isPromotion: false,
    shortDescription: "Complément alimentaire, vitamine D3 et K2 pour os et immunité",
    description: "Association synergique de vitamines D3 et K2 pour optimiser la fixation du calcium dans les os. Idéal pour maintenir des os solides et renforcer le système immunitaire, particulièrement recommandé en automne et hiver.",
    usageAdvice: "Prendre 1 gélule par jour avec un repas. Ne pas dépasser la dose journalière recommandée.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"],
    tags: ["vitamine D", "immunité", "os", "compléments"],
    categorySlug: "complements-alimentaires",
  },
  {
    name: "Gel Douche Surgras à l'Argan",
    slug: "gel-douche-surgras-argan",
    brand: "Nuxe",
    price: 9.90,
    stock: 80,
    isActive: true,
    isFeatured: false,
    isNew: true,
    isPromotion: false,
    shortDescription: "Gel douche doux et nourrissant, enrichi en huile d'argan du Maroc",
    description: "Ce gel douche surgras au généreux parfum floral est enrichi en huile d'argan précieuse. Sa texture onctueuse nettoie en douceur tout en nourrissant la peau. Formule adaptée aux peaux sensibles et sèches.",
    usageAdvice: "Appliquer sur corps mouillé en massant délicatement, rincer abondamment. Éviter le contact avec les yeux.",
    images: ["https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=400&fit=crop"],
    tags: ["douche", "argan", "nourrissant", "corps"],
    categorySlug: "corps-bien-etre",
  },
  {
    name: "Crème Anti-âge Rétinol Nuit",
    slug: "creme-anti-age-retinol-nuit",
    brand: "Olay",
    price: 32.00,
    comparePrice: 38.00,
    stock: 20,
    isActive: true,
    isFeatured: true,
    isNew: false,
    isPromotion: true,
    shortDescription: "Crème de nuit au rétinol pour réduire les rides et raffermir la peau",
    description: "Enrichie en rétinol microsphères à libération lente, cette crème de nuit stimule le renouvellement cellulaire pendant le sommeil. Réduit visiblement les rides et ridules en 4 semaines d'utilisation.",
    usageAdvice: "Appliquer le soir sur visage et cou propres. Utiliser une protection solaire le lendemain matin. Commencer par 2-3 applications par semaine.",
    images: ["https://images.unsplash.com/photo-1601049541271-f2e9bf7d9c2d?w=400&h=400&fit=crop"],
    tags: ["anti-âge", "rétinol", "nuit", "rides"],
    categorySlug: "soins-visage",
  },
  {
    name: "Crème Solaire Enfant SPF50+",
    slug: "creme-solaire-enfant-spf50",
    brand: "Mustela",
    price: 15.90,
    stock: 35,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isPromotion: false,
    shortDescription: "Protection solaire très haute pour enfants dès 6 mois, résistante à l'eau",
    description: "Spécialement formulée pour la peau fragile des enfants, cette crème offre une protection très haute SPF50+ contre les UVA et UVB. Résistante à l'eau, texture légère et non grasse.",
    usageAdvice: "Appliquer 30 minutes avant l'exposition solaire et renouveler toutes les 2 heures. Éviter l'exposition directe au soleil aux heures les plus chaudes.",
    images: ["https://images.unsplash.com/photo-1591969568428-c2a84e37de3a?w=400&h=400&fit=crop"],
    tags: ["solaire", "enfant", "SPF50", "bébé"],
    categorySlug: "solaire",
  },
  {
    name: "Masque Capillaire Argan Intense",
    slug: "masque-capillaire-argan-intense",
    brand: "Moroccanoil",
    price: 19.50,
    stock: 28,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isPromotion: false,
    shortDescription: "Masque intensif à l'huile d'argan pour cheveux secs et abîmés",
    description: "Ce masque intensif à l'huile d'argan pénètre en profondeur pour nourrir et réparer les cheveux secs, abîmés et colorés. Laisse les cheveux brillants, doux et gérables. Parfum signature caractéristique.",
    usageAdvice: "Appliquer sur cheveux propres et essorés. Laisser poser 5 à 7 minutes. Rincer abondamment.",
    images: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop"],
    tags: ["masque", "argan", "cheveux", "nourrissant"],
    categorySlug: "cheveux",
  },
  {
    name: "Probiotiques Daily Balance",
    slug: "probiotiques-daily-balance",
    brand: "Pileje",
    price: 26.00,
    stock: 22,
    isActive: true,
    isFeatured: false,
    isNew: true,
    isPromotion: false,
    shortDescription: "Complexe probiotique pour équilibre intestinal et immunité, 30 gélules",
    description: "Formule unique combinant 10 souches probiotiques sélectionnées pour leur efficacité. Contribue à maintenir un microbiome intestinal sain, renforce l'immunité et favorise le bien-être digestif.",
    usageAdvice: "Prendre 1 gélule par jour le matin à jeun. Conserver au réfrigérateur après ouverture.",
    images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"],
    tags: ["probiotiques", "intestin", "immunité", "digestif"],
    categorySlug: "complements-alimentaires",
  },
  {
    name: "Déodorant 48H Sensitive",
    slug: "deodorant-48h-sensitive",
    brand: "Dove",
    price: 6.50,
    stock: 100,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isPromotion: false,
    shortDescription: "Déodorant bille pour peaux sensibles, efficacité 48h sans alcool",
    description: "Ce déodorant à bille à 0% alcool est spécialement formulé pour les peaux sensibles et fraîchement épilées. Sa formule enrichie en agents hydratants protège la peau tout en offrant une protection efficace 48h.",
    usageAdvice: "Appliquer sur les aisselles propres et sèches. Peut être utilisé immédiatement après l'épilation.",
    images: ["https://images.unsplash.com/photo-1556909045-2b2a1a462789?w=400&h=400&fit=crop"],
    tags: ["déodorant", "peaux sensibles", "sans alcool", "hygiène"],
    categorySlug: "hygiene",
  },
  {
    name: "Huile de Soin Corps & Visage",
    slug: "huile-soin-corps-visage",
    brand: "Bio Oil",
    price: 16.90,
    comparePrice: 20.00,
    stock: 42,
    isActive: true,
    isFeatured: true,
    isNew: false,
    isPromotion: true,
    shortDescription: "Huile multi-usages pour cicatrices, vergetures et hydratation profonde",
    description: "Bio-Oil est une huile de soin spécialisée qui aide à améliorer l'apparence des cicatrices, vergetures et des inégalités de teint. Enrichie en vitamines A et E, PurCellin Oil® pour une texture légère non-grasse.",
    usageAdvice: "Masser délicatement sur les zones concernées deux fois par jour pendant minimum 3 mois.",
    images: ["https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop"],
    tags: ["huile", "cicatrices", "vergetures", "corps"],
    categorySlug: "corps-bien-etre",
  },
];

async function main() {
  console.log("🌱 Début du seeding...");

  // Create admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "Admin@2024!", 12);
  const admin = await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@parapharmacie.fr" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@parapharmacie.fr",
      password: hashedPassword,
      name: "Administrateur",
    },
  });
  console.log("✅ Admin créé:", admin.email);

  // Create categories
  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log(`✅ ${categories.length} catégories créées`);

  // Create products
  let productCount = 0;
  for (const product of products) {
    const { categorySlug, ...productData } = product;
    const categoryId = createdCategories[categorySlug];
    if (!categoryId) {
      console.warn(`⚠️ Catégorie introuvable: ${categorySlug}`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        categoryId,
        weight: null,
        reference: null,
      },
    });
    productCount++;
  }
  console.log(`✅ ${productCount} produits créés`);

  console.log("\n🎉 Seeding terminé avec succès !");
  console.log("─────────────────────────────");
  console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL ?? "admin@parapharmacie.fr"}`);
  console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD ?? "Admin@2024!"}`);
  console.log(`🌐 Dashboard: http://localhost:3000/admin`);
}

main()
  .catch((e) => { console.error("❌ Erreur:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
