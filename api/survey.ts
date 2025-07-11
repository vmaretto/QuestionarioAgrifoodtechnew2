// api/survey.ts
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const SHEET_ID = "1QhX6a7G1EU4a_mQG1cqdKgxIqGQUGljgadWRPfE1S8"; // ← sostituisci con il tuo Sheet ID

export default async function handler(req: any, res: any) {
  // 1) Verifica metodo
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Metodo non consentito");
  }

  try {
    // 2) Leggi body
    const body = req.body;
    console.log("Ricevuto body:", body);

    // 3) Carica credenziali da file
    const filePath = path.join(process.cwd(), "config", "service-account.json");
    let credentials: any;
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      credentials = JSON.parse(raw);
      console.log("[DEBUG] ✅ Credenziali parse OK:", {
        project_id: credentials.project_id,
        client_email: credentials.client_email,
      });
    } catch (err: any) {
      console.error("❌ Errore parsing service-account.json:", err.message);
      return res.status(500).json({
        error: "Errore parsing service-account.json",
        detail: err.message,
      });
    }

    // 4) Inizializza autenticazione Google
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    // ottieni il client concreto
    const authClient = await auth.getClient();
    // imposta il client come default per tutte le chiamate Google API
    google.options({ auth: authClient });

    // 5) Inizializza il client Sheets (senza passare auth qui)
    const sheets = google.sheets({ version: "v4" });

    // 6) Prepara righe da inviare
    const aziendaRow = [
      body.azienda || "",
      body.ruolo || "",
      body.settore || "",
      body.email || "",
      body.telefono || "",
      body.altro || "",
      new Date().toISOString(),
    ];
    const pref = body.preferenze || {};
    const risposteRow = [
      body.azienda || "",
      pref.blockchain || 0,
      pref.intelligenza_artificiale || 0,
      pref.iot || 0,
      pref.realtà_aumentata_virtuale || 0,
      pref.digital_twin || 0,
      pref.robotica || 0,
      new Date().toISOString(),
    ];

    // 7) Scrivi su foglio "aziende"
    console.log("Scrivo su foglio aziende…");
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "aziende!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [aziendaRow] },
    });

    // 8) Scrivi su foglio "risposte"
    console.log("Scrivo su foglio risposte…");
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "risposte!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [risposteRow] },
    });

    console.log("✅ Scrittura completata.");
    return res.status(200).json({ message: "Dati salvati correttamente su Google Sheet" });

  } catch (error: any) {
    console.error("Errore salvataggio Google Sheet:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
