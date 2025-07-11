import { google } from "googleapis";
import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

const SHEET_ID = "1qqbVYv7mcLltMprO-xxxxx-xxxxxxxxxxxxxx"; // <-- Inserisci il tuo Sheet ID se non l'hai già fatto

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Metodo non consentito");
  }

  try {
    const body = req.body;
    console.log("Ricevuto body:", body);

    const filePath = path.resolve(process.cwd(), "config/service-account.json");

    let credentials;
    try {
      const rawCredentials = fs.readFileSync(filePath, "utf8");
      credentials = JSON.parse(rawCredentials);
      console.log("[DEBUG] ✅ Credenziali parse OK:", {
        project_id: credentials.project_id,
        client_email: credentials.client_email,
      });
    } catch (jsonError: any) {
      console.error("❌ Errore nel parsing del file di credenziali:", jsonError.message);
      return res.status(500).json({
        error: "Errore parsing GOOGLE_SERVICE_ACCOUNT",
        message: jsonError.message,
      });
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

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

    console.log("Scrivo su foglio aziende...");
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "aziende!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [aziendaRow],
      },
    });

    console.log("Scrivo su foglio risposte...");
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "risposte!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [risposteRow],
      },
    });

    console.log("✅ Scrittura completata.");
    return res.status(200).json({ message: "Dati salvati correttamente su Google Sheet" });

  } catch (error) {
    console.error("Errore durante il salvataggio su Google Sheet:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
