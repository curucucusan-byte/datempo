#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import { getDb } from "../src/lib/firebaseAdmin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

if (!process.env.DOTENV_CONFIG_SILENT) {
  process.env.DOTENV_CONFIG_SILENT = "true";
}

dotenv.config({ path: path.join(root, ".env"), override: false });
dotenv.config({ path: path.join(root, ".env.local"), override: true });

async function readProfessionals() {
  const file = path.join(root, "src", "data", "professionals.json");
  const raw = await fs.readFile(file, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error("professionals.json deve conter um array");
  }
  return data;
}

async function main() {
  const professionals = await readProfessionals();
  if (professionals.length === 0) {
    console.warn("Nenhum profissional encontrado em professionals.json");
    return;
  }

  const db = getDb();
  const batch = db.batch();
  const col = db.collection("professionals");

  professionals.forEach((prof) => {
    if (!prof?.slug) {
      throw new Error("Cada profissional precisa de um campo slug");
    }
    const ref = col.doc(prof.slug);
    batch.set(ref, prof, { merge: true });
  });

  await batch.commit();
  console.log(`Seed concluído: ${professionals.length} profissionais salvos.`);
}

main().catch((err) => {
  console.error("Erro ao popular profissionais:", err);
  process.exitCode = 1;
});
