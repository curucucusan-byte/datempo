// src/lib/phone.ts
export function normalizeE164BR(input: string) {
  // Mantém + e dígitos, força +55 se vier 55... sem +
  let v = input.trim();
  if (!v) return null;

  // troca 00 55 por +55, remove espaços e símbolos
  v = v.replace(/^\s*00\s*55/, "+55").replace(/[^\d+]/g, "");

  if (v.startsWith("55")) v = "+" + v;         // 55XXXXXXXXXXX -> +55XXXXXXXXXXX
  if (!v.startsWith("+")) v = "+55" + v;       // 53... -> +55 53...

  // agora deve ser +55 DDD + número (10 ou 11 dígitos após DDI)
  const digits = v.replace(/\D/g, "");
  // + 55 + DDD(2) + 8-9 dígitos -> total 13 ou 14 chars numéricos
  if (!/^55\d{10,11}$/.test(digits.slice(1))) return null;

  return "+" + digits;
}

export function maskBR(input: string) {
  // apenas estética pro front
  const d = input.replace(/\D/g, "");
  // tenta formatar +55 (00) 00000-0000
  if (d.length < 2) return d;
  if (d.startsWith("55")) {
    const rest = d.slice(2);
    if (rest.length <= 2) return `+55 (${rest}`;
    const ddd = rest.slice(0, 2);
    const num = rest.slice(2);
    if (num.length <= 4) return `+55 (${ddd}) ${num}`;
    if (num.length <= 9) return `+55 (${ddd}) ${num.slice(0,5)}-${num.slice(5)}`;
    return `+55 (${ddd}) ${num.slice(0,5)}-${num.slice(5,9)}`;
  }
  return "+" + d;
}
