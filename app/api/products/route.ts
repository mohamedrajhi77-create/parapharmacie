import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  brand: z.string().optional(),
  reference: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  usageAdvice: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isPromotion: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  weight: z.number().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: { category: true, reviews: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" }, take: 10 }, _count: { select: { reviews: true } } },
    });

    if (!product) return NextResponse.json({ product: null });

    // Increment view count
    await prisma.product.update({ where: { id: product.id }, data: { viewCount: { increment: 1 } } });

    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
      include: { category: true, _count: { select: { reviews: true } } },
      take: 6,
      orderBy: { viewCount: "desc" },
    });

    return NextResponse.json({
      product: { ...product, price: Number(product.price), comparePrice: product.comparePrice ? Number(product.comparePrice) : null },
      related: related.map((p) => ({ ...p, price: Number(p.price), comparePrice: p.comparePrice ? Number(p.comparePrice) : null })),
    });
  }

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, _count: { select: { reviews: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(products.map((p) => ({ ...p, price: Number(p.price), comparePrice: p.comparePrice ? Number(p.comparePrice) : null })));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...data,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        weight: data.weight ?? null,
      },
    });

    return NextResponse.json({ ...product, price: Number(product.price) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
