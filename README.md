# Parapharmacie Centrale — Click & Collect

Site web complet de parapharmacie avec système de réservation Click & Collect.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styles** : Tailwind CSS + shadcn/ui
- **ORM** : Prisma
- **Base de données** : PostgreSQL (Supabase)
- **Auth** : NextAuth v5
- **State** : Zustand
- **Formulaires** : React Hook Form + Zod
- **Images** : Cloudinary
- **Emails** : Resend
- **Déploiement** : Vercel

---

## Installation locale

### 1. Cloner et installer

```bash
cd parapharmacie
npm install
```

### 2. Variables d'environnement

Le fichier `.env.local` est déjà configuré avec vos credentials Supabase et Resend.

**À compléter manuellement :**
- Aller sur [cloudinary.com/console](https://cloudinary.com/console)
- Copier le Cloud Name, API Key, API Secret
- Remplir les 3 variables Cloudinary dans `.env.local`

### 3. Base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables dans Supabase
npx prisma db push

# Remplir avec les données de démonstration
npm run prisma:seed
```

### 4. Lancer le serveur

```bash
npm run dev
```

Accéder à [http://localhost:3000](http://localhost:3000)

---

## Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@parapharmacie.fr | Admin@2024! |

Dashboard admin : [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Structure du projet

```
parapharmacie/
├── app/
│   ├── (public)/           # Pages publiques
│   │   ├── page.tsx         # Accueil
│   │   ├── catalogue/       # Catalogue produits
│   │   ├── produit/[slug]/  # Fiche produit
│   │   ├── panier/          # Panier & réservation
│   │   └── confirmation/    # Page de confirmation
│   ├── admin/               # Backoffice
│   │   ├── login/           # Connexion admin
│   │   ├── page.tsx         # Dashboard
│   │   ├── reservations/    # Gestion réservations
│   │   ├── produits/        # Gestion produits
│   │   └── categories/      # Gestion catégories
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth
│   │   ├── admin/           # Auth admin
│   │   ├── products/        # CRUD produits
│   │   ├── categories/      # CRUD catégories
│   │   ├── reservations/    # CRUD réservations
│   │   └── upload/          # Upload Cloudinary
│   ├── sitemap.ts           # Sitemap dynamique
│   └── robots.ts            # Robots.txt
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Navbar, Footer
│   ├── home/                # Sections page accueil
│   ├── catalogue/           # ProductCard, Filters
│   ├── cart/                # CartSheet, ReservationForm
│   └── admin/               # Composants admin
├── lib/
│   ├── prisma.ts            # Client Prisma
│   ├── auth.ts              # NextAuth config
│   ├── cloudinary.ts        # Upload images
│   ├── resend.ts            # Envoi emails
│   └── utils.ts             # Utilitaires
├── prisma/
│   ├── schema.prisma        # Schéma DB
│   └── seed.ts              # Données demo
├── store/
│   └── useCartStore.ts      # Zustand cart
└── types/
    └── index.ts             # TypeScript types
```

---

## Déploiement sur Vercel

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/parapharmacie.git
git push -u origin main
```

### 2. Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. "New Project" → Importer le repo GitHub
3. Framework preset : **Next.js** (auto-détecté)

### 3. Variables d'environnement sur Vercel

Dans Vercel Dashboard → Settings → Environment Variables, ajouter :

```
DATABASE_URL = (votre URL Supabase avec pgbouncer)
DIRECT_URL = (votre URL directe Supabase)
AUTH_SECRET = (générer avec: openssl rand -base64 32)
NEXTAUTH_URL = https://votre-domaine.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = votre-cloud-name
CLOUDINARY_API_KEY = votre-api-key
CLOUDINARY_API_SECRET = votre-api-secret
RESEND_API_KEY = re_B9HPGS9Y_xxxxx
RESEND_FROM_EMAIL = Parapharmacie <noreply@votredomaine.com>
RESEND_TO_ADMIN = votre-email@gmail.com
ADMIN_EMAIL = admin@parapharmacie.fr
ADMIN_PASSWORD = VotreMotDePasse!
NEXT_PUBLIC_SITE_URL = https://votre-domaine.vercel.app
NEXT_PUBLIC_SITE_NAME = Parapharmacie Centrale
```

### 4. Après déploiement

Exécuter le seed en production via Vercel CLI :
```bash
npx vercel env pull .env.production
DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d= -f2) npm run prisma:seed
```

Ou via l'interface Prisma Studio en pointant sur la DB de production.

---

## Configuration Resend (emails)

1. Créer un compte sur [resend.com](https://resend.com)
2. Vérifier votre domaine (DNS)
3. Mettre à jour `RESEND_FROM_EMAIL` avec votre domaine vérifié
4. Pour les tests, utiliser `onboarding@resend.dev` (limité à votre email)

---

## Configuration Cloudinary (images)

1. Créer un compte sur [cloudinary.com](https://cloudinary.com)
2. Dans Dashboard → Settings → Upload :
   - Créer un upload preset "parapharmacie" en mode "Unsigned"
3. Remplir les 3 variables dans `.env.local` :
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## Commandes utiles

```bash
npm run dev              # Serveur de développement
npm run build            # Build production
npm run prisma:studio    # Interface visuelle DB
npm run prisma:seed      # Remplir la base de données
npm run prisma:push      # Synchroniser le schéma
```

---

## Fonctionnalités

### Public
- ✅ Page d'accueil avec Hero, catégories, produits vedettes
- ✅ Catalogue avec filtres, recherche, tri, pagination
- ✅ Fiche produit avec galerie, avis, produits similaires
- ✅ Panier persistant (localStorage via Zustand)
- ✅ Formulaire de réservation (date + heure + coordonnées)
- ✅ Page de confirmation
- ✅ Emails automatiques (confirmation, prête, annulée)
- ✅ SEO : sitemap, robots, JSON-LD, meta dynamiques
- ✅ 100% responsive mobile-first

### Admin
- ✅ Authentification sécurisée (cookie httpOnly)
- ✅ Dashboard avec statistiques
- ✅ CRUD produits avec upload d'images Cloudinary
- ✅ Gestion des réservations (changement de statut)
- ✅ Gestion des catégories
- ✅ Notifications email automatiques

---

## Personnalisation

### Informations du magasin
Modifier `lib/utils.ts` → `STORE_INFO` :
```typescript
export const STORE_INFO = {
  name: "Votre Parapharmacie",
  address: "Votre adresse complète",
  phone: "+33 X XX XX XX XX",
  email: "contact@votredomaine.com",
  mapUrl: "https://maps.google.com/?q=votre+adresse",
  // ...
};
```

### Couleurs
Modifier `tailwind.config.ts` → section `pharma` :
```typescript
pharma: {
  green: "#059669",  // Couleur principale
  "green-light": "#d1fae5",
  blue: "#2563eb",
}
```

### Créneaux de retrait
Modifier `lib/utils.ts` → `PICKUP_SLOTS`

---

## Coût d'hébergement

| Service | Plan | Coût |
|---------|------|------|
| Vercel | Hobby | 0€ |
| Supabase | Free (500MB) | 0€ |
| Cloudinary | Free (25GB) | 0€ |
| Resend | Free (3000/mois) | 0€ |
| **Total** | | **0€/mois** |

---

## Support

Questions ou problèmes ? Vérifier :
1. Les variables d'environnement sont correctement configurées
2. La base de données Supabase est accessible
3. Les migrations Prisma ont été appliquées

---

*Projet généré avec Next.js 15 + Prisma + Supabase + Vercel*
