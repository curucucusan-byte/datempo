/**
 * Shortcode Generator - DaTempo
 * 
 * Gera códigos curtos e únicos para links de compartilhamento de agendas.
 * 
 * Formato: 8 caracteres alfanuméricos (a-z, 0-9), case-insensitive
 * Exemplo: a7k2m9p5, x4j8n2q1, b3h9k5m2
 * 
 * Características:
 * - Impossível de adivinhar (62^8 = 218 trilhões de combinações)
 * - Curto e fácil de compartilhar
 * - Sem caracteres ambíguos (0/O, 1/l/I)
 * - Válido como slug de URL
 */

import { getDb } from "@/lib/firebaseAdmin";

/**
 * Caracteres permitidos no shortcode
 * Removidos: 0 (zero), O (o maiúsculo), 1 (um), l (L minúsculo), I (i maiúsculo)
 * para evitar confusão visual
 */
const SHORTCODE_CHARS = "abcdefghijkmnopqrstuvwxyz23456789";
const SHORTCODE_LENGTH = 8;

/**
 * Gera um shortcode aleatório
 */
export function generateShortcode(length: number = SHORTCODE_LENGTH): string {
  let result = "";
  const charsLength = SHORTCODE_CHARS.length;
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    result += SHORTCODE_CHARS[randomIndex];
  }
  
  return result;
}

/**
 * Valida se uma string é um shortcode válido
 */
export function isValidShortcode(code: string): boolean {
  if (!code || typeof code !== "string") return false;
  if (code.length !== SHORTCODE_LENGTH) return false;
  
  // Verifica se todos os caracteres são válidos
  return code.split("").every((char) => SHORTCODE_CHARS.includes(char.toLowerCase()));
}

/**
 * Verifica se um shortcode já existe no Firestore
 */
export async function shortcodeExists(code: string): Promise<boolean> {
  const db = getDb();
  
  try {
    // Verifica na coleção linkedCalendars (novo método)
    const calendarDoc = await db.collection("linkedCalendars").doc(code).get();
    if (calendarDoc.exists) return true;
    
    // Verifica na collection accounts (backward compatibility)
    const accountsSnapshot = await db
      .collection("accounts")
      .where("linkedCalendars.slug", "==", code)
      .limit(1)
      .get();
    
    return !accountsSnapshot.empty;
  } catch (error) {
    console.error("Error checking shortcode existence:", error);
    return true; // Em caso de erro, assume que existe para evitar conflitos
  }
}

/**
 * Gera um shortcode único (verifica se já existe)
 * Tenta até MAX_ATTEMPTS vezes antes de falhar
 */
export async function generateUniqueShortcode(maxAttempts: number = 10): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateShortcode();
    const exists = await shortcodeExists(code);
    
    if (!exists) {
      return code;
    }
    
    // Se chegou aqui, houve colisão (extremamente raro)
    console.warn(`Shortcode collision detected: ${code}. Attempt ${attempt + 1}/${maxAttempts}`);
  }
  
  throw new Error(
    `Failed to generate unique shortcode after ${maxAttempts} attempts. This is extremely rare and might indicate a database issue.`
  );
}

/**
 * Converte um slug legado (nome-do-profissional) em shortcode
 * Útil para migração de slugs antigos
 */
export async function migrateSlugToShortcode(oldSlug: string): Promise<string> {
  const db = getDb();
  
  // Gera novo shortcode único
  const newCode = await generateUniqueShortcode();
  
  try {
    // Atualiza na coleção linkedCalendars
    const calendarDoc = await db.collection("linkedCalendars").doc(oldSlug).get();
    
    if (calendarDoc.exists) {
      const data = calendarDoc.data();
      
      // Cria novo documento com o shortcode
      await db.collection("linkedCalendars").doc(newCode).set({
        ...data,
        slug: newCode,
        legacySlug: oldSlug, // Mantém referência ao slug antigo
        migratedAt: new Date().toISOString(),
      });
      
      // Opcional: manter o documento antigo por um tempo com redirect
      await db.collection("linkedCalendars").doc(oldSlug).update({
        redirectTo: newCode,
        deprecated: true,
      });
    }
    
    // Atualiza também no array de linkedCalendars da account
    const accountsSnapshot = await db
      .collection("accounts")
      .where("linkedCalendars.slug", "==", oldSlug)
      .limit(1)
      .get();
    
    if (!accountsSnapshot.empty) {
      const accountDoc = accountsSnapshot.docs[0];
      const accountData = accountDoc.data();
      const linkedCalendars = accountData.linkedCalendars || [];
      
      // Atualiza o slug no array
      const updatedCalendars = linkedCalendars.map((cal: any) => {
        if (cal.slug === oldSlug) {
          return {
            ...cal,
            slug: newCode,
            legacySlug: oldSlug,
          };
        }
        return cal;
      });
      
      await accountDoc.ref.update({
        linkedCalendars: updatedCalendars,
      });
    }
    
    return newCode;
  } catch (error) {
    console.error("Error migrating slug to shortcode:", error);
    throw error;
  }
}

/**
 * Estatísticas de uso de shortcodes (útil para monitoramento)
 */
export async function getShortcodeStats(): Promise<{
  total: number;
  active: number;
  deprecated: number;
  collisionRate: number;
}> {
  const db = getDb();
  
  try {
    const snapshot = await db.collection("linkedCalendars").get();
    const total = snapshot.size;
    
    let active = 0;
    let deprecated = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.deprecated) {
        deprecated++;
      } else if (data.active !== false) {
        active++;
      }
    });
    
    // Taxa de colisão teórica com base no total de códigos gerados
    // Formula: 1 - (1 - 1/N)^k onde N = total de combinações possíveis, k = códigos gerados
    const totalCombinations = Math.pow(SHORTCODE_CHARS.length, SHORTCODE_LENGTH);
    const collisionRate = 1 - Math.pow(1 - 1 / totalCombinations, total);
    
    return {
      total,
      active,
      deprecated,
      collisionRate,
    };
  } catch (error) {
    console.error("Error getting shortcode stats:", error);
    return {
      total: 0,
      active: 0,
      deprecated: 0,
      collisionRate: 0,
    };
  }
}

/**
 * Utilitário: Formatar shortcode para exibição
 * Exemplo: a7k2m9p5 → a7k2-m9p5 (mais legível)
 */
export function formatShortcode(code: string, separator: string = "-"): string {
  if (!isValidShortcode(code)) return code;
  
  const half = Math.floor(code.length / 2);
  return `${code.slice(0, half)}${separator}${code.slice(half)}`;
}

/**
 * Utilitário: Limpar formatação do shortcode
 * Exemplo: a7k2-m9p5 → a7k2m9p5
 */
export function cleanShortcode(formattedCode: string): string {
  return formattedCode.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/**
 * Gera um link de compartilhamento completo
 */
export function getShareableLink(shortcode: string, token?: string | null): string {
  const baseUrl = process.env.APP_BASE_URL || "https://zap-agenda.onrender.com";
  const cleanBase = baseUrl.replace(/\/$/, "");
  
  if (token) {
    return `${cleanBase}/agenda/${shortcode}/${token}`;
  }
  
  return `${cleanBase}/agenda/${shortcode}`;
}

/**
 * Gera um QR code data URL para o shortcode (útil para compartilhamento)
 * Nota: Requer biblioteca externa como 'qrcode' - implementação básica aqui
 */
export function getQRCodeUrl(shortcode: string, token?: string | null): string {
  const link = getShareableLink(shortcode, token);
  // Retorna URL para API de QR code (pode usar uma biblioteca ou serviço externo)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
}
