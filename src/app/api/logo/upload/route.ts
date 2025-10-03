import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/session";
import { getDb } from "@/lib/firebaseAdmin";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const slug = String(form.get("slug") || "").trim();
    const file = form.get("file") as File | null;
    if (!slug || !file) return NextResponse.json({ error: "slug e file são obrigatórios" }, { status: 400 });

    // Caminho em public/agenda-logos/{slug}/logo.webp
    const dir = path.join(process.cwd(), "public", "agenda-logos", slug);
    await mkdir(dir, { recursive: true });
    const outPath = path.join(dir, "logo.webp");
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(outPath, buf);

    const relative = `/agenda-logos/${slug}/logo.webp`;

    // Atualizar Firestore: linkedCalendars/{slug} e accounts/{uid}
    try {
      const db = getDb();
      const doc = await db.collection("linkedCalendars").doc(slug).get();
      if (doc.exists) {
        const data = doc.data() as any;
        const ownerUid = data?.ownerUid as string | undefined;
        const updated = { ...data, logoPath: relative };
        await db.collection("linkedCalendars").doc(slug).set(updated, { merge: true });
        if (ownerUid) {
          const accRef = db.collection("accounts").doc(ownerUid);
          const accSnap = await accRef.get();
          if (accSnap.exists) {
            const acc = accSnap.data() as any;
            const list = Array.isArray(acc.linkedCalendars) ? acc.linkedCalendars : [];
            const next = list.map((c: any) => (c?.slug === slug ? { ...c, logoPath: relative } : c));
            await accRef.set({ linkedCalendars: next, updatedAt: new Date().toISOString() }, { merge: true });
          }
        }
      }
    } catch {}

    return NextResponse.json({ ok: true, path: relative });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

