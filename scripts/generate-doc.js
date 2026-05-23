const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(__dirname, "..", "..", "Documentation_Admin_Parapharmacie.pdf");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  info: {
    Title: "Guide Administrateur — Parapharmacie Centrale",
    Author: "Parapharmacie Centrale",
    Subject: "Documentation interface admin",
  },
});

doc.pipe(fs.createWriteStream(OUTPUT));

// ─── Couleurs ───────────────────────────────────────────────────────────────
const GREEN  = "#059669";
const DARK   = "#111827";
const GRAY   = "#6B7280";
const LGRAY  = "#F9FAFB";
const RED    = "#EF4444";
const BLUE   = "#2563EB";
const WHITE  = "#FFFFFF";

// ─── Helpers ────────────────────────────────────────────────────────────────
function pageW() { return doc.page.width - doc.page.margins.left - doc.page.margins.right; }

function coverPage() {
  // Fond vert
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(GREEN);

  // Logo cercle blanc
  const cx = doc.page.width / 2;
  doc.circle(cx, 180, 55).fill(WHITE);
  doc.font("Helvetica-Bold").fontSize(42).fillColor(GREEN).text("P", cx - 14, 157);

  // Titre
  doc.font("Helvetica-Bold").fontSize(28).fillColor(WHITE)
     .text("Guide Administrateur", 0, 270, { align: "center" });
  doc.font("Helvetica-Bold").fontSize(20).fillColor("rgba(255,255,255,0.85)")
     .text("Parapharmacie Centrale", 0, 308, { align: "center" });

  // Ligne déco
  doc.rect(cx - 40, 345, 80, 2).fill("rgba(255,255,255,0.4)");

  // Sous-titre
  doc.font("Helvetica").fontSize(13).fillColor("rgba(255,255,255,0.9)")
     .text("Manuel complet d'utilisation de l'interface d'administration", 0, 360, { align: "center" });

  // Accès rapide
  doc.rect(cx - 155, 430, 310, 100).fillAndStroke("rgba(0,0,0,0.2)", "rgba(255,255,255,0.1)");
  doc.font("Helvetica-Bold").fontSize(10).fillColor(WHITE)
     .text("ACCÈS RAPIDE", cx - 135, 448);
  doc.font("Helvetica").fontSize(11).fillColor("rgba(255,255,255,0.9)")
     .text("URL :  /admin/login", cx - 135, 465)
     .text("Email :  admin@parapharmacie.fr", cx - 135, 482)
     .text("Mot de passe :  Admin@2024!", cx - 135, 499);

  // Footer
  doc.font("Helvetica").fontSize(9).fillColor("rgba(255,255,255,0.6)")
     .text("Version 1.0 — " + new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" }), 0, doc.page.height - 60, { align: "center" });
}

function newPage() {
  doc.addPage();
  // Header bande verte
  doc.rect(0, 0, doc.page.width, 6).fill(GREEN);
  doc.moveDown(0.4);
}

function sectionTitle(text, y) {
  if (y !== undefined) doc.y = y;
  // Fond coloré derrière le titre
  const h = 32;
  doc.rect(doc.page.margins.left - 10, doc.y - 5, pageW() + 20, h).fill("#ECFDF5");
  doc.rect(doc.page.margins.left - 10, doc.y - 5, 4, h).fill(GREEN);
  doc.font("Helvetica-Bold").fontSize(15).fillColor(GREEN)
     .text(text, doc.page.margins.left + 6, doc.y, { width: pageW() });
  doc.moveDown(0.6);
}

function subTitle(text) {
  doc.moveDown(0.4);
  doc.font("Helvetica-Bold").fontSize(12).fillColor(DARK).text(text);
  doc.moveDown(0.3);
}

function body(text, opts = {}) {
  doc.font("Helvetica").fontSize(10).fillColor(GRAY).text(text, { lineGap: 3, ...opts });
  doc.moveDown(0.3);
}

function bullet(items) {
  items.forEach(item => {
    const x = doc.page.margins.left + 14;
    doc.circle(doc.page.margins.left + 5, doc.y + 4.5, 2.5).fill(GREEN);
    doc.font("Helvetica").fontSize(10).fillColor(DARK)
       .text(item, x, doc.y, { width: pageW() - 14, lineGap: 2 });
    doc.moveDown(0.25);
  });
}

function numberedList(items) {
  items.forEach((item, i) => {
    const x = doc.page.margins.left + 18;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(GREEN)
       .text(`${i + 1}.`, doc.page.margins.left, doc.y, { width: 16, continued: false });
    doc.font("Helvetica").fontSize(10).fillColor(DARK)
       .text(item, x, doc.y - 12, { width: pageW() - 18, lineGap: 2 });
    doc.moveDown(0.3);
  });
}

function infoBox(title, content, color = GREEN) {
  const boxY = doc.y;
  const lines = content.split("\n").filter(Boolean);
  const boxH = 22 + lines.length * 14 + 10;
  doc.rect(doc.page.margins.left, boxY, pageW(), boxH)
     .fillAndStroke("#F0FDF4", color === RED ? "#FEF2F2" : "#D1FAE5");
  if (color === RED) doc.rect(doc.page.margins.left, boxY, pageW(), boxH).fillAndStroke("#FEF2F2", "#FCA5A5");
  doc.rect(doc.page.margins.left, boxY, 3, boxH).fill(color);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(color)
     .text(title, doc.page.margins.left + 10, boxY + 8);
  doc.font("Helvetica").fontSize(9.5).fillColor(DARK);
  lines.forEach((line, i) => {
    doc.text(line, doc.page.margins.left + 10, boxY + 22 + i * 14, { width: pageW() - 20 });
  });
  doc.y = boxY + boxH + 10;
  doc.moveDown(0.3);
}

function tableRow(cols, isHeader = false) {
  const colW = pageW() / cols.length;
  const rowH = 22;
  const rowY = doc.y;

  if (isHeader) {
    doc.rect(doc.page.margins.left, rowY, pageW(), rowH).fill(GREEN);
  } else {
    doc.rect(doc.page.margins.left, rowY, pageW(), rowH).fillAndStroke(LGRAY, "#E5E7EB");
  }

  cols.forEach((col, i) => {
    doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
       .fontSize(9)
       .fillColor(isHeader ? WHITE : DARK)
       .text(col, doc.page.margins.left + i * colW + 6, rowY + 6, { width: colW - 12, lineBreak: false });
  });
  doc.y = rowY + rowH;
}

function badge(text, color = GREEN, x = null, y = null) {
  const bx = x ?? doc.page.margins.left;
  const by = y ?? doc.y;
  const pad = 8;
  doc.font("Helvetica-Bold").fontSize(8);
  const tw = doc.widthOfString(text);
  doc.rect(bx, by, tw + pad * 2, 14).fill(color + "22");
  doc.fillColor(color).text(text, bx + pad, by + 2, { lineBreak: false });
  return tw + pad * 2 + 6;
}

function hr() {
  doc.moveDown(0.4);
  doc.rect(doc.page.margins.left, doc.y, pageW(), 0.5).fill("#E5E7EB");
  doc.moveDown(0.6);
}

function footer() {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(pages.start + i);
    if (i === 0) continue; // pas de footer sur la cover
    doc.rect(0, doc.page.height - 35, doc.page.width, 35).fill("#F9FAFB");
    doc.rect(0, doc.page.height - 35, doc.page.width, 1).fill("#E5E7EB");
    doc.font("Helvetica").fontSize(8).fillColor(GRAY)
       .text("Guide Administrateur — Parapharmacie Centrale", doc.page.margins.left, doc.page.height - 22);
    doc.text(`Page ${i + 1}`, 0, doc.page.height - 22, { align: "right", width: doc.page.width - doc.page.margins.right });
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  CONTENU
// ════════════════════════════════════════════════════════════════════════════

// ── PAGE 1 : Couverture ───────────────────────────────────────────────────
coverPage();

// ── PAGE 2 : Sommaire ─────────────────────────────────────────────────────
newPage();
sectionTitle("📋  Table des matières");
doc.moveDown(0.5);

const toc = [
  ["1", "Connexion à l'interface admin", "3"],
  ["2", "Tableau de bord", "3"],
  ["3", "Gestion des produits", "4"],
  ["4", "Gestion des catégories", "5"],
  ["5", "Gestion des réservations", "6"],
  ["6", "Page d'accueil — Slides Hero", "7"],
  ["7", "Page d'accueil — Bons Plans", "8"],
  ["8", "Page d'accueil — Astuces", "9"],
  ["9", "Page d'accueil — Sections visibles", "10"],
  ["10", "Paramètres généraux du site", "10"],
  ["11", "Sécurité & bonnes pratiques", "11"],
];

toc.forEach(([num, title, page]) => {
  const y = doc.y;
  doc.font("Helvetica-Bold").fontSize(10).fillColor(GREEN).text(num + ".", doc.page.margins.left, y, { width: 20, lineBreak: false });
  doc.font("Helvetica").fontSize(10).fillColor(DARK).text(title, doc.page.margins.left + 22, y, { width: pageW() - 60, lineBreak: false });
  doc.font("Helvetica").fontSize(10).fillColor(GRAY).text(page, 0, y, { align: "right", lineBreak: false });
  doc.moveDown(0.55);
});

// ── PAGE 3 : Connexion + Dashboard ────────────────────────────────────────
newPage();

sectionTitle("1.  Connexion à l'interface admin");
body("L'interface administrateur est accessible uniquement avec les identifiants fournis. Elle est protégée et invisible du public.");

subTitle("Étapes de connexion");
numberedList([
  "Ouvrez votre navigateur et allez sur : https://parapharmacie-lake.vercel.app/admin/login",
  "Saisissez l'adresse email : admin@parapharmacie.fr",
  "Saisissez le mot de passe : Admin@2024!",
  "Cliquez sur « Se connecter ».",
  "Vous êtes redirigé automatiquement vers le tableau de bord.",
]);

infoBox("⚠️  Sécurité", "Ne partagez jamais vos identifiants.\nChangez le mot de passe dès la première connexion depuis Paramètres.", RED);

hr();

sectionTitle("2.  Tableau de bord");
body("Le tableau de bord est la première page après connexion. Il affiche un résumé complet de l'activité du site.");

subTitle("Cartes statistiques (haut de page)");
bullet([
  "Total des réservations — nombre de réservations reçues depuis le lancement",
  "En attente — réservations reçues mais pas encore confirmées",
  "Prêtes à retirer — réservations confirmées et préparées en magasin",
  "Total produits — nombre de produits actifs dans le catalogue",
]);

subTitle("Liste des dernières réservations");
bullet([
  "Affiche les 10 dernières réservations avec nom, email, date de retrait et statut",
  "Cliquez sur « Voir toutes les réservations » pour accéder à la liste complète",
]);

infoBox("💡  Astuce", "Consultez le tableau de bord chaque matin pour vérifier les nouvelles réservations reçues la nuit.");

// ── PAGE 4 : Produits ─────────────────────────────────────────────────────
newPage();

sectionTitle("3.  Gestion des produits");
body("La section Produits permet d'ajouter, modifier, activer/désactiver et supprimer les produits du catalogue visible sur le site.");

subTitle("3.1  Accéder aux produits");
bullet(["Cliquez sur « Produits » dans la barre de navigation gauche."]);

subTitle("3.2  Ajouter un nouveau produit");
numberedList([
  "Cliquez sur le bouton « + Nouveau produit » en haut à droite.",
  "Remplissez les informations obligatoires : nom, slug, prix, catégorie, stock.",
  "Ajoutez une description courte (affichée dans les cartes) et une description complète (page produit).",
  "Renseignez la marque, le code de référence (optionnel) et les conseils d'utilisation.",
  "Ajoutez des tags séparés par des virgules pour faciliter la recherche.",
  "Cochez les cases : Mis en avant, Nouveau, En promotion selon la nature du produit.",
  "Cliquez sur « Enregistrer ».",
]);

subTitle("3.3  Champs du formulaire produit");
doc.moveDown(0.2);
tableRow(["Champ", "Description", "Obligatoire"], true);
const prodFields = [
  ["Nom", "Nom complet du produit (affiché sur le site)", "✅ Oui"],
  ["Slug", "URL du produit (ex: creme-solaire-spf50)", "✅ Oui"],
  ["Prix (DT)", "Prix de vente en dinars tunisiens", "✅ Oui"],
  ["Prix barré", "Ancien prix pour afficher la remise", "Non"],
  ["Stock", "Quantité disponible en magasin", "✅ Oui"],
  ["Catégorie", "Rayon auquel appartient le produit", "✅ Oui"],
  ["Marque", "Nom de la marque (ex: La Roche-Posay)", "Non"],
  ["Images", "URLs des photos du produit", "Non"],
  ["Tags", "Mots-clés pour la recherche interne", "Non"],
  ["Mis en avant", "Afficher dans la section populaires", "Non"],
  ["Nouveau", "Badge « Nouveau » sur la fiche produit", "Non"],
  ["Promotion", "Badge de réduction sur la fiche produit", "Non"],
];
prodFields.forEach(row => tableRow(row));

doc.moveDown(0.5);
subTitle("3.4  Modifier un produit existant");
numberedList([
  "Dans la liste des produits, cliquez sur l'icône ✏️ en face du produit à modifier.",
  "Effectuez vos modifications dans le formulaire.",
  "Cliquez sur « Enregistrer les modifications ».",
]);

subTitle("3.5  Activer / Désactiver un produit");
body("Un produit désactivé n'apparaît plus sur le site mais reste dans la base de données. Cliquez sur le bouton Actif/Inactif dans la liste pour basculer l'état.");

subTitle("3.6  Supprimer un produit");
body("Cliquez sur l'icône 🗑️ dans la liste. Une confirmation vous sera demandée avant suppression définitive.");
infoBox("⚠️  Attention", "La suppression d'un produit est irréversible.\nPréférez le désactiver si vous pensez le réutiliser plus tard.", RED);

// ── PAGE 5 : Catégories ───────────────────────────────────────────────────
newPage();

sectionTitle("4.  Gestion des catégories");
body("Les catégories organisent le catalogue et apparaissent dans la navigation principale du site (navbar dropdown).");

subTitle("Catégories actuelles");
doc.moveDown(0.2);
tableRow(["Emoji", "Nom", "Slug (URL)"], true);
const cats = [
  ["✨", "Visage", "/catalogue?categorie=visage"],
  ["🧴", "Corps", "/catalogue?categorie=corps"],
  ["💇", "Cheveux", "/catalogue?categorie=cheveux"],
  ["🪥", "Hygiène", "/catalogue?categorie=hygiene"],
  ["❤️", "Santé", "/catalogue?categorie=sante"],
  ["💊", "Compléments alimentaires", "/catalogue?categorie=complements-alimentaires"],
  ["🍼", "Bébé", "/catalogue?categorie=bebe"],
  ["🌿", "Bio & Naturel", "/catalogue?categorie=bio"],
  ["☀️", "Solaires", "/catalogue?categorie=solaires"],
];
cats.forEach(row => tableRow(row));

doc.moveDown(0.5);
subTitle("Ajouter une catégorie");
numberedList([
  "Cliquez sur « Catégories » dans la sidebar.",
  "Cliquez sur « + Nouvelle catégorie ».",
  "Renseignez le nom, l'emoji/icône, et le slug (utilisé dans l'URL).",
  "Cochez « Active » pour qu'elle apparaisse sur le site.",
  "Cliquez sur « Enregistrer ».",
]);

subTitle("Modifier l'ordre des catégories");
body("Le champ « Ordre » détermine la position de la catégorie dans la barre de navigation. La catégorie avec l'ordre le plus bas (ex: 1) apparaît en premier.");

// ── PAGE 6 : Réservations ─────────────────────────────────────────────────
newPage();

sectionTitle("5.  Gestion des réservations");
body("Les réservations sont les commandes Click & Collect passées par les clients. Elles sont créées en ligne et réglées en magasin lors du retrait.");

subTitle("5.1  Cycle de vie d'une réservation");
doc.moveDown(0.3);

const statuses = [
  ["EN ATTENTE", GREEN, "La réservation vient d'être créée. Client notifié par email."],
  ["CONFIRMÉE", BLUE, "Vous avez confirmé et commencez à préparer la commande."],
  ["PRÊTE", "#D97706", "La commande est préparée. Client averti qu'il peut venir."],
  ["TERMINÉE", "#6B7280", "Le client est venu, a payé et a récupéré sa commande."],
  ["ANNULÉE", RED, "La réservation a été annulée (par le client ou l'admin)."],
];

statuses.forEach(([status, color, desc]) => {
  const y = doc.y;
  doc.rect(doc.page.margins.left, y, 90, 18).fill(color + "22");
  doc.font("Helvetica-Bold").fontSize(8).fillColor(color)
     .text(status, doc.page.margins.left + 5, y + 4, { width: 80, lineBreak: false });
  doc.font("Helvetica").fontSize(10).fillColor(DARK)
     .text(desc, doc.page.margins.left + 100, y + 2, { width: pageW() - 100 });
  doc.moveDown(0.5);
});

subTitle("5.2  Traiter une réservation");
numberedList([
  "Cliquez sur « Réservations » dans la sidebar.",
  "Repérez les réservations avec le statut « En attente » (badge vert).",
  "Cliquez sur la réservation pour voir les détails : articles, quantités, coordonnées client.",
  "Changez le statut en « Confirmée » — un email automatique est envoyé au client.",
  "Préparez la commande en magasin.",
  "Changez le statut en « Prête » — le client reçoit un email l'invitant à venir récupérer.",
  "Lors du retrait, encaissez le paiement et passez en « Terminée ».",
]);

subTitle("5.3  Filtres disponibles");
bullet([
  "Filtrer par statut : En attente / Confirmée / Prête / Terminée / Annulée",
  "Rechercher par nom ou email du client",
  "Trier par date de création ou date de retrait",
]);

subTitle("5.4  Informations dans chaque réservation");
bullet([
  "Identifiant unique de la réservation",
  "Nom complet, email et téléphone du client",
  "Date et créneau horaire choisi pour le retrait",
  "Liste des articles réservés avec quantités et prix unitaires",
  "Montant total estimé (paiement en magasin)",
  "Notes laissées par le client (allergies, demandes spéciales...)",
]);

infoBox("📧  Emails automatiques", "Confirmation de réservation → envoyé au client dès la création\nCommande prête → envoyé quand vous passez au statut « Prête »\nAnnulation → envoyé si vous annulez la réservation");

// ── PAGE 7 : Hero Slides ──────────────────────────────────────────────────
newPage();

sectionTitle("6.  Page d'accueil — Slides Hero");
body("Le carousel de la page d'accueil est entièrement configurable. Vous pouvez avoir jusqu'à 5 slides actifs qui défilent automatiquement toutes les 5 secondes.");

subTitle("Accès");
body("Admin → Page d'accueil → Slides Hero");

subTitle("6.1  Ajouter un nouveau slide");
numberedList([
  "Cliquez sur « + Ajouter un slide ».",
  "Remplissez les champs dans la fenêtre qui s'ouvre :",
]);

doc.moveDown(0.2);
tableRow(["Champ", "Exemple", "Description"], true);
const heroFields = [
  ["Badge", "☀️ Spécial Été", "Petit label coloré en haut du slide"],
  ["Titre", "Protection Solaire\\nHaute Efficacité", "Titre principal (\\n = retour à la ligne)"],
  ["Sous-titre", "SPF50+ pour toute la famille", "Texte descriptif sous le titre"],
  ["Texte bouton", "Découvrir les solaires", "Libellé du bouton d'action"],
  ["Lien", "/catalogue?categorie=solaires", "Page vers laquelle pointe le bouton"],
  ["Emoji", "☀️", "Grande icône affichée à droite du slide"],
  ["Tags", "La Roche-Posay, Avène", "Petites étiquettes affichées sous le sous-titre"],
  ["Couleur de fond", "Bleu / Vert / Violet...", "Dégradé de couleur du fond du slide"],
];
heroFields.forEach(row => tableRow(row));

doc.moveDown(0.5);
subTitle("6.2  Modifier un slide");
numberedList([
  "Dans la liste, cliquez sur l'icône ✏️ à droite du slide.",
  "Modifiez les champs souhaités.",
  "Cliquez sur « Enregistrer ».",
]);

subTitle("6.3  Activer / Désactiver un slide");
body("Cliquez sur l'icône 👁️ à droite du slide. Un slide désactivé (icône barrée) ne s'affiche pas sur le site mais reste sauvegardé. Pratique pour masquer temporairement une promotion.");

subTitle("6.4  Supprimer un slide");
body("Cliquez sur l'icône 🗑️ et confirmez. La suppression est définitive.");

infoBox("💡  Conseil", "Créez un slide par grande saison (été, hiver, fêtes...) et activez/désactivez-les selon la période sans avoir à les recréer.", GREEN);

// ── PAGE 8 : Bons Plans ───────────────────────────────────────────────────
newPage();

sectionTitle("7.  Page d'accueil — Bons Plans");
body("La section « Nos Bons Plans » affiche une grille de marques avec leurs remises en cours. Elle apparaît juste après les catégories sur la page d'accueil.");

subTitle("Accès");
body("Admin → Page d'accueil → Bons Plans");

subTitle("7.1  Ajouter un bon plan");
numberedList([
  "Cliquez sur « + Ajouter ».",
  "Renseignez le nom de la marque (ex: La Roche-Posay).",
  "Renseignez la remise (ex: Jusqu'à -25%).",
  "Renseignez le lien vers la page de la marque en promotion.",
  "Choisissez un style de couleur parmi les 6 disponibles.",
  "Cliquez sur « Enregistrer ».",
]);

subTitle("7.2  Champs disponibles");
doc.moveDown(0.2);
tableRow(["Champ", "Exemple", "Description"], true);
tableRow(["Nom de la marque", "Vichy", "Affiché sur la vignette"]);
tableRow(["Remise", "Jusqu'à -30%", "Badge affiché sous le nom"]);
tableRow(["Lien", "/catalogue?search=Vichy&isPromotion=true", "Lien vers les produits en promo"]);
tableRow(["Style couleur", "Vert, Bleu, Rouge...", "Couleur de fond de la vignette"]);

doc.moveDown(0.5);
subTitle("7.3  Activer / désactiver un bon plan");
body("Cliquez sur l'icône 👁️ sur la vignette. Un bon plan désactivé disparaît du site sans être supprimé.");

infoBox("💡  Bonne pratique", "Créez un bon plan pour chaque marque en promotion ce mois-ci.\nMettez à jour les remises régulièrement pour refléter la réalité des prix en magasin.");

// ── PAGE 9 : Astuces ──────────────────────────────────────────────────────
newPage();

sectionTitle("8.  Page d'accueil — Astuces");
body("La section « Nos Astuces » présente 4 articles de conseils santé & beauté. Ces articles redirigent vers le catalogue filtré pour convertir les lecteurs en acheteurs.");

subTitle("Accès");
body("Admin → Page d'accueil → Astuces");

subTitle("8.1  Ajouter une astuce");
numberedList([
  "Cliquez sur « + Ajouter une astuce ».",
  "Renseignez la catégorie (ex: Soins visage, Cheveux...).",
  "Choisissez un emoji représentatif.",
  "Rédigez un titre accrocheur (2 lignes max recommandé).",
  "Rédigez l'extrait : 2 à 3 phrases qui donnent envie de lire et d'acheter.",
  "Renseignez le lien — idéalement vers le catalogue de la catégorie concernée.",
  "Choisissez une couleur harmonieuse avec le sujet.",
  "Cliquez sur « Enregistrer ».",
]);

subTitle("8.2  Conseils de rédaction");
bullet([
  "Titre : posez une question ou annoncez un bénéfice concret. Ex: « Comment choisir son SPF ? »",
  "Extrait : parlez d'un problème que votre client ressent, puis proposez une solution.",
  "Lien : dirigez vers une catégorie ou une recherche pertinente. Évitez les liens cassés.",
  "Emoji : choisissez quelque chose de visuel et reconnaissable.",
]);

infoBox("📅  Rotation des astuces", "Changez les astuces chaque mois pour garder la page d'accueil fraîche.\nDésactivez les astuces saisonnières (ex: solaire en hiver) sans les supprimer.");

// ── PAGE 10 : Sections + Paramètres ──────────────────────────────────────
newPage();

sectionTitle("9.  Page d'accueil — Sections visibles");
body("Vous pouvez afficher ou masquer chaque grande section de la page d'accueil en un clic, sans toucher au code.");

subTitle("Accès");
body("Admin → Page d'accueil → Sections visibles");

subTitle("Sections configurables");
doc.moveDown(0.2);
tableRow(["Section", "Description"], true);
tableRow(["Bons Plans", "Grille des offres par marque"]);
tableRow(["Marques Préférées", "Carousel des logos de marques partenaires"]);
tableRow(["Nos Astuces", "4 articles conseils santé & beauté"]);
tableRow(["Newsletter", "Formulaire d'inscription à la newsletter"]);
tableRow(["Comment ça marche", "Explication des 3 étapes Click & Collect"]);

doc.moveDown(0.5);
body("Cliquez sur le bouton « Visible » / « Masqué » à côté de chaque section puis cliquez sur « Enregistrer ». Les modifications sont appliquées lors du prochain rechargement de page.");

hr();

sectionTitle("10.  Paramètres généraux du site");
body("Cette section permet de modifier les informations de base du site sans intervention technique.");

subTitle("Accès");
body("Admin → Paramètres site");

subTitle("Informations modifiables");
doc.moveDown(0.2);
tableRow(["Paramètre", "Exemple"], true);
tableRow(["Nom du site", "Parapharmacie Centrale"]);
tableRow(["Adresse du magasin", "Résidence El Menzah 5, Ariana, Tunis"]);
tableRow(["Téléphone", "+216 71 234 567"]);
tableRow(["Email de contact", "contact@parapharmacie-centrale.tn"]);
tableRow(["Horaires d'ouverture", "Lun–Ven 8h30–19h | Sam 9h–17h"]);
tableRow(["Titre newsletter", "Restez informé(e)"]);
tableRow(["Sous-titre newsletter", "Recevez nos offres exclusives..."]);

doc.moveDown(0.5);
numberedList([
  "Modifiez les champs souhaités.",
  "Cliquez sur « Enregistrer » en haut à droite.",
  "Vérifiez les changements sur le site en cliquant sur « Voir le site ».",
]);

// ── PAGE 11 : Sécurité ────────────────────────────────────────────────────
newPage();

sectionTitle("11.  Sécurité & bonnes pratiques");

subTitle("11.1  Changer le mot de passe admin");
numberedList([
  "Contactez votre développeur pour changer le mot de passe dans la base de données.",
  "Le mot de passe est stocké de manière chiffrée (bcrypt) — il est impossible de le récupérer en clair.",
  "Choisissez un mot de passe d'au moins 12 caractères avec majuscules, chiffres et symboles.",
]);

subTitle("11.2  Bonnes pratiques quotidiennes");
bullet([
  "Déconnectez-vous toujours après utilisation (bouton « Déconnexion » en bas de la sidebar).",
  "Ne restez pas connecté sur un ordinateur partagé.",
  "Vérifiez les réservations au moins une fois par jour (matin et soir).",
  "Mettez à jour les stocks produits régulièrement pour éviter les sur-réservations.",
  "Désactivez les produits épuisés plutôt que de les supprimer.",
]);

subTitle("11.3  En cas de problème");
bullet([
  "Le site ne charge pas → vérifiez la connexion internet et réessayez dans quelques minutes.",
  "Impossible de se connecter → vérifiez que le Caps Lock n'est pas activé.",
  "Une réservation n'apparaît pas → rafraîchissez la page (F5 ou Ctrl+R).",
  "Un produit n'apparaît pas sur le site → vérifiez qu'il est bien marqué « Actif ».",
]);

infoBox("📞  Support technique", "Email : mohamedossiam77@gmail.com\nPour toute modification technique (nouveau champ, nouvelle fonctionnalité, bug critique).", BLUE);

hr();

subTitle("11.4  Récapitulatif des URL admin");
doc.moveDown(0.2);
tableRow(["Section", "URL"], true);
const urls = [
  ["Connexion", "/admin/login"],
  ["Tableau de bord", "/admin"],
  ["Réservations", "/admin/reservations"],
  ["Produits", "/admin/produits"],
  ["Catégories", "/admin/categories"],
  ["Slides Hero", "/admin/accueil/hero"],
  ["Bons Plans", "/admin/accueil/bons-plans"],
  ["Astuces", "/admin/accueil/astuces"],
  ["Sections visibles", "/admin/accueil/sections"],
  ["Paramètres site", "/admin/parametres"],
];
urls.forEach(row => tableRow(row));

// ─── Footers ────────────────────────────────────────────────────────────────
doc.flushPages();
footer();
doc.end();

doc.on("end", () => {
  console.log("✅ PDF généré : " + OUTPUT);
});
