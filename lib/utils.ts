import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | { toNumber(): number }): string {
  const num = typeof price === "object" ? price.toNumber() : Number(price);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "En cours de validation",
    CONFIRMED: "En cours de préparation",
    READY: "Prête à récupérer",
    COMPLETED: "Récupérée",
    CANCELLED: "Annulée",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    READY: "bg-emerald-100 text-emerald-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

export const RESERVATION_STEPS = [
  { status: "PENDING", label: "En cours de validation", description: "Votre commande a été reçue, en attente de validation par la parapharmacie." },
  { status: "CONFIRMED", label: "En cours de préparation", description: "Votre commande a été validée et est en cours de préparation." },
  { status: "READY", label: "Prête à récupérer", description: "Votre commande est prête, vous pouvez venir la retirer en magasin." },
] as const;

export function getStatusStep(status: string): number {
  const map: Record<string, number> = { PENDING: 0, CONFIRMED: 1, READY: 2, COMPLETED: 3, CANCELLED: -1 };
  return map[status] ?? 0;
}

export const PICKUP_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
];

export const STORE_INFO = {
  name: "Parapharmacie Centrale",
  address: "Résidence El Menzah 5, Ariana, Tunis",
  phone: "+216 71 234 567",
  email: "contact@parapharmacie-centrale.tn",
  mapUrl: "https://maps.app.goo.gl/TRVZAce5vG4PtrHg8",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192!2d10.2!3d36.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd4!2sParapharmacie!5e0!3m2!1sfr!2stn!4v1",
  hours: [
    { day: "Lundi – Vendredi", time: "08h30 – 19h00" },
    { day: "Samedi", time: "09h00 – 17h00" },
    { day: "Dimanche", time: "Fermé" },
  ],
};
