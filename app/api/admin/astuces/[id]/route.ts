import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin-session")?.value;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const astuce = await prisma.astuce.update({ where: { id }, data });
  return NextResponse.json(astuce);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.astuce.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
