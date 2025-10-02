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
  const provider = (process.env.WHATS_PROVIDER || "zapi").toLowerCase();

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
    const instance = required("ZAPI_INSTANCE_ID", process.env.ZAPI_INSTANCE_ID);
    const token = required("ZAPI_TOKEN", process.env.ZAPI_TOKEN);
    // Doc comum: POST https://api.z-api.io/instances/{instance}/token/{token}/send-text
    const url = `https://api.z-api.io/instances/${instance}/token/${token}/send-text`;
    const payload = {
      phone: to.replace(/\D/g, ""), // Z-API costuma aceitar só dígitos (com DDI)
      message,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Z-API error ${res.status}: ${await res.text()}`);
    return await res.json();
  }

  throw new Error(`WHATS_PROVIDER desconhecido: ${provider}`);
}
