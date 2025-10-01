#!/usr/bin/env node
/*
 * Dispara manualmente a rota /api/cron/reminder.
 * Usa APP_BASE_URL (ou http://localhost:3000) como base e envia Authorization Bearer com DASHBOARD_TOKEN se disponível.
 */

const baseUrl = process.env.REMINDER_BASE_URL || process.env.APP_BASE_URL || "http://localhost:3000";
const method = (process.env.REMINDER_HTTP_METHOD || "POST").toUpperCase();
const token = process.env.DASHBOARD_TOKEN || process.env.REMINDER_TOKEN;
const query = process.env.REMINDER_QUERY || "";

const url = new URL("/api/cron/reminder" + query, baseUrl);

async function main() {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { method, headers });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!res.ok) {
    console.error(`[reminder] ${res.status} ${res.statusText}`);
    console.error(body);
    process.exitCode = 1;
    return;
  }

  console.log(`[reminder] ${res.status} ${res.statusText}`);
  console.log(body);
}

main().catch((err) => {
  console.error("[reminder] erro ao chamar cron:", err);
  process.exitCode = 1;
});
