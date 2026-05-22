import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "./prisma"; // Ensure this matches your project import path

export interface SessionData {
  adminId?: string;
  isLoggedIn: boolean;
  tokenVersion?: number; // ADD THIS: Keeps track of the password version at login
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "ssga-secure-session-secret-string-at-least-32-chars-long",
  cookieName: "ssga_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

/**
 * Basic session retrieval. Use this for logging in, logging out, 
 * or creating a fresh session.
 */
export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}

/**
 * Secure session retrieval. Use this in your protected API routes and layout files.
 * It checks if the session is active AND verifies that the password hasn't changed.
 */
export async function getValidSession() {
  const session = await getSession();

  // If the user isn't logged in, or there is no adminId, fail early
  if (!session.isLoggedIn || !session.adminId) {
    session.destroy();
    return null;
  }

  try {
    // Look up the admin in the database, fetching ONLY the tokenVersion field for speed
    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
      select: { tokenVersion: true },
    });

    // If the admin doesn't exist, or their DB version doesn't match the cookie version
    if (!admin || admin.tokenVersion !== session.tokenVersion) {
      session.destroy(); // Destroys the cookie on the client side
      return null;       // Invalidation fallback
    }

    return session; // Session is perfectly secure and valid
  } catch (error) {
    // If the database is completely unreachable, fail-safe by denying the session
    return null;
  }
}