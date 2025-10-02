import { cookies } from "next/headers";

import { getFirebaseAuth } from "@/lib/firebaseAdmin";

export const SESSION_COOKIE = "zapagenda_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5; // 5 dias

export async function getAuthenticatedUser() {
  const store = cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const auth = getFirebaseAuth();
    return await auth.verifySessionCookie(token, true);
  } catch {
    return null;
  }
}

export type AuthContext = {
  uid: string;
  email?: string;
  fromServiceToken?: boolean;
};

export async function authenticateRequest(req: Request): Promise<AuthContext | null> {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const provided = authHeader.slice(7).trim();
    const token = process.env.DASHBOARD_TOKEN;
    if (token && provided === token) {
      return { uid: "service-token", fromServiceToken: true };
    }
    try {
      const auth = getFirebaseAuth();
      const decoded = await auth.verifyIdToken(provided, true);
      return { uid: decoded.uid, email: decoded.email ?? undefined };
    } catch {
      // segue para checar cookie
    }
  }

  const sessionToken = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionToken) return null;
  try {
    const auth = getFirebaseAuth();
    const decoded = await auth.verifySessionCookie(sessionToken, true);
    return { uid: decoded.uid, email: decoded.email ?? undefined };
  } catch {
    return null;
  }
}
