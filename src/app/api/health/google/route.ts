// Caminho do arquivo: /home/ubuntu/datempo/datempo/src/app/api/health/google/route.ts

import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getAuthenticatedUser } from "@/lib/session";
import { getAuthenticatedClient } from "@/lib/google";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({
        ok: false,
        error: "Não autenticado",
        action: "Faça login em /login"
      }, { status: 401 });
    }

    console.info("[health:google:checking]", { uid: user.uid });

    const auth = await getAuthenticatedClient(user.uid);
    
    if (!auth) {
      return NextResponse.json({
        ok: false,
        connected: false,
        error: "Google Calendar não conectado",
        action: "Conecte sua conta Google em /dashboard?tab=agenda"
      });
    }

    // Testar se o token é válido fazendo uma chamada simples
    const calendar = google.calendar({ version: "v3", auth });
    
    try {
      const list = await calendar.calendarList.list({ maxResults: 5 });
      
      const calendarsCount = list.data.items?.length || 0;
      const calendarNames = list.data.items?.map(cal => cal.summary).filter(Boolean) || [];

      console.info("[health:google:success]", { 
        uid: user.uid, 
        calendarsCount 
      });

      return NextResponse.json({
        ok: true,
        connected: true,
        calendarsCount,
        calendars: calendarNames,
        message: `✅ Google Calendar conectado com sucesso! Encontrados ${calendarsCount} calendário(s).`
      });

    } catch (apiError: unknown) {
      console.error("[health:google:api-error]", {
        uid: user.uid,
        error: apiError instanceof Error ? apiError.message : String(apiError),
      });

      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      
      if (errorMessage.includes("invalid_grant") || errorMessage.includes("Token has been expired")) {
        return NextResponse.json({
          ok: false,
          connected: false,
          error: "Token do Google expirado ou revogado",
          action: "Reconecte sua conta Google em /dashboard?tab=agenda"
        });
      }

      return NextResponse.json({
        ok: false,
        connected: true,
        error: `Erro na API do Google: ${errorMessage}`,
        action: "Tente novamente ou reconecte em /dashboard?tab=agenda"
      });
    }

  } catch (error: unknown) {
    console.error("[health:google:unexpected]", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({
      ok: false,
      error: "Erro inesperado ao verificar conexão",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
