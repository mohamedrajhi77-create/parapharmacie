import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/catalogue`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...categories.map((cat) => ({
      url: `${baseUrl}/catalogue?categorie=${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${baseUrl}/produit/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
