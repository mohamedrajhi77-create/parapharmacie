import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin-session")?.value;
}

export async function GET() {
  const astuces = await prisma.astuce.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(astuces);
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const astuce = await prisma.astuce.create({ data });
  return NextResponse.json(astuce);
}
