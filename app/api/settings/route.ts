import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getValidSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getValidSession();
    
    // Check if the user passed the PIN lock
    if (!session || !session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Fetch the single config row (no need for specific adminId anymore)
    const admin = await prisma.admin.findFirst({
      select: { id: true, logoUrl: true, darkMode: true },
    });
    
    return NextResponse.json(admin);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getValidSession();
    
    if (!session || !session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { logoUrl, darkMode } = body;

    const updateData: Record<string, unknown> = {};
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (darkMode !== undefined) updateData.darkMode = darkMode;

    // Find the single app config row
    const adminRow = await prisma.admin.findFirst();
    if (!adminRow) {
      return NextResponse.json({ error: "App configuration not found" }, { status: 404 });
    }

    // Update the config
    const admin = await prisma.admin.update({
      where: { id: adminRow.id },
      data: updateData,
      select: { id: true, logoUrl: true, darkMode: true },
    });

    return NextResponse.json(admin);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}