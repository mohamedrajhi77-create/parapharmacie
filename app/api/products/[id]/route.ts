import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...product, price: Number(product.price), comparePrice: product.comparePrice ? Number(product.comparePrice) : null });
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        brand: body.brand ?? null,
        reference: body.reference ?? null,
        price: body.price,
        comparePrice: body.comparePrice ?? null,
        stock: body.stock,
        categoryId: body.categoryId,
        shortDescription: body.shortDescription ?? null,
        description: body.description ?? null,
        usageAdvice: body.usageAdvice ?? null,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        isNew: body.isNew,
        isPromotion: body.isPromotion,
        images: body.images,
        tags: body.tags,
        weight: body.weight ?? null,
      },
    });
    return NextResponse.json({ ...product, price: Number(product.price) });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: body,
  });
  return NextResponse.json({ ...product, price: Number(product.price) });
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
