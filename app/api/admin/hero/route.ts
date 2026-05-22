import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin-session")?.value;
}

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const slide = await prisma.heroSlide.create({ data });
  return NextResponse.json(slide);
}
