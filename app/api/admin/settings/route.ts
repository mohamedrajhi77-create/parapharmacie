import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin-session")?.value;
}

export async function GET() {
  const settings = await prisma.siteSettings.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => { map[s.key] = s.value; });
  return NextResponse.json(map);
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data: Record<string, string> = await req.json();
  const updates = await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
  return NextResponse.json({ ok: true, count: updates.length });
}
