import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getValidSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Ensure your Admin model in schema.prisma has: tokenVersion Int @default(0)
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const session = await getValidSession();
    if (!session) {
      return NextResponse.json({ error: "Session unavailable" }, { status: 500 });
    }

    session.adminId = admin.id;
    session.isLoggedIn = true;

    // Inject the tokenVersion into the session payload
    session.tokenVersion = admin.tokenVersion;

    await session.save();

    return NextResponse.json({ success: true, name: admin.name });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}