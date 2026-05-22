import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin-session")?.value;
}

export async function GET() {
  const bonsPlans = await prisma.bonPlan.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(bonsPlans);
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const bonPlan = await prisma.bonPlan.create({ data });
  return NextResponse.json(bonPlan);
}
