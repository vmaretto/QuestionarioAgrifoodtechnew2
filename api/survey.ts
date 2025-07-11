// /api/survey.ts
import { google } from "googleapis";
import { VercelRequest, VercelResponse } from "@vercel/node";

const SHEET_ID = "1QhX6a7Jg7EU4a_mQG1cqdKgxIqGQUGljgadWRPfE1S8";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Metodo non consentito");
  }

  try {
    const body = req.body;

    // Parse la chiave JSON dalle env vars
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Prepara righe da scrivere
    const aziendaRow = [
      body.azienda || "",
      body.ruolo || "",
      body.settore || "",
      body.email || "",
      body.telefono || "",
      body.altro || "",
      new Date().toISOString(),
    ];

    const preferenze = body.preferenze || {};
    const risposteRow = [
      body.azienda || "",
      preferenze.blockchain || 0,
      preferenze.intelligenza_artificiale || 0,
      preferenze.iot || 0,
      preferenze.realtà_aumentata_virtuale || 0,
      preferenze.digital_twin || 0,
      preferenze.robotica || 0,
      new Date().toISOString(),
    ];

    // Scrive nei fogli
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "aziende!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [aziendaRow],
      },
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "risposte!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [risposteRow],
      },
    });

    return res
      .status(200)
      .json({ message: "Dati salvati correttamente su Google Sheet" });
  } catch (error) {
    console.error("Errore durante il salvataggio su Google Sheet:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
