// src/lib/whats.ts

type WhatsParams = {
  to: string;       // ex: "+55XXXXXXXXXXX" (com DDI)
  message: string;  // texto
};

function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Variável ${name} não configurada para envio WhatsApp.`);
  return value;
}

export async function sendWhats({ to, message }: WhatsParams) {
  const provider = (process.env.WHATS_PROVIDER || "meta").toLowerCase();

  if (provider === "mock" || provider === "test" || provider === "dev") {
    console.info("[whats:mock]", { to, message });
    return { ok: true, provider: "mock", to, message } as const;
  }

  if (provider === "twilio") {
    const sid = required("TWILIO_ACCOUNT_SID", process.env.TWILIO_ACCOUNT_SID);
    const token = required("TWILIO_AUTH_TOKEN", process.env.TWILIO_AUTH_TOKEN);
    const from = required("TWILIO_WHATS_FROM", process.env.TWILIO_WHATS_FROM);
    // Twilio exige prefixo "whatsapp:"
    const body = new URLSearchParams({
      To: `whatsapp:${to}`,
      From: from,
      Body: message,
    });

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) throw new Error(`Twilio error ${res.status}: ${await res.text()}`);
    return await res.json();
  }

  if (provider === "zapi") {
    // Descontinuado. Mantido apenas para compatibilidade, mas não envia.
    console.warn("[whats:zapi] descontinuado — defina WHATS_PROVIDER=meta");
    console.info("[whats:mock]", { to, message });
    return { ok: true, provider: "mock", to, message } as const;
  }

  if (provider === "meta" || provider === "whatsapp" || provider === "cloud" || provider === "wa") {
    const token = process.env.WA_META_TOKEN;
    const phoneId = process.env.WA_PHONE_NUMBER_ID;
    const base = process.env.WA_GRAPH_BASE || "https://graph.facebook.com/v20.0";
    if (!token || !phoneId) {
      console.warn("[whats:meta] missing env (WA_META_TOKEN/WA_PHONE_NUMBER_ID). Skipping send.");
      console.info("[whats:mock]", { to, message });
      return { ok: false, skipped: true, reason: "missing_env" } as const;
    }

    const url = `${base.replace(/\/$/, "")}/${encodeURIComponent(phoneId)}/messages`;
    const toDigits = to.replace(/\D/g, "");
    const body = {
      messaging_product: "whatsapp",
      to: toDigits,
      type: "text",
      text: { preview_url: false, body: message },
    } as const;
    console.info("[whats:meta:req]", { url, to: toDigits, len: message.length });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("[whats:meta:error]", res.status, txt);
      throw new Error(`Meta error ${res.status}: ${txt}`);
    }
    const json = await res.json();
    console.info("[whats:meta:ok]", json?.messages?.[0]?.id || json);
    return json;
  }

  console.warn(`[whats] Provedor desconhecido: ${provider}. Usando mock.`);
  console.info("[whats:mock]", { to, message });
  return { ok: true, provider: "mock", to, message } as const;
}
