import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: { id: true, name: true, email: true, logoUrl: true, darkMode: true },
    });
    return NextResponse.json(admin);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, newPassword, logoUrl, darkMode } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (darkMode !== undefined) updateData.darkMode = darkMode;
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const admin = await prisma.admin.update({
      where: { id: session.adminId },
      data: updateData,
      select: { id: true, name: true, email: true, logoUrl: true, darkMode: true },
    });

    return NextResponse.json(admin);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}