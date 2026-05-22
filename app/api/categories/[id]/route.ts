import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const category = await prisma.category.update({ where: { id }, data: body });
  return NextResponse.json(category);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
