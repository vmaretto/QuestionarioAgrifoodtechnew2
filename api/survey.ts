// api/survey.ts
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const SHEET_ID = "1QhX6a7G1EU4a_mQG1cqdKgxIqGQUGljgadWRPfE1S8"; // ← sostituisci col tuo ID

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Metodo non consentito");
  }

  try {
    const body = req.body;
    console.log("Ricevuto body:", body);

    // 1) Carica credenziali dal file
    const credPath = path.join(process.cwd(), "config", "service-account.json");
    if (!fs.existsSync(credPath)) {
      console.error("❌ service-account.json non trovato in:", credPath);
      return res.status(500).json({ error: "Credenziali mancanti" });
    }
    const raw = fs.readFileSync(credPath, "utf8");
    const creds = JSON.parse(raw);
    console.log("[DEBUG] ✅ JSON credenziali OK:", {
      project_id: creds.project_id,
      client_email: creds.client_email,
    });

    // 2) Costruisci e autoriza il client JWT
    const jwtClient = new google.auth.JWT(
      creds.client_email,
      undefined,
      creds.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    await jwtClient.authorize();
    console.log("[DEBUG] ✅ JWT autorizzato");

    // 3) Imposta il client globalmente e chiama sheets col primo overload
    google.options({ auth: jwtClient });
    const sheets = google.sheets("v4");

    // 4) Prepara le righe da inviare
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

    // 5) Scrivi sul foglio “aziende”
    console.log("Scrivo su foglio aziende…");
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "aziende!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [aziendaRow] },
    });

    // 6) Scrivi sul foglio “risposte”
    console.log("Scrivo su foglio risposte…");
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "risposte!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [risposteRow] },
    });

    console.log("✅ Scrittura completata.");
    return res.status(200).json({ message: "Dati salvati correttamente su Google Sheet" });
  } catch (err: any) {
    console.error("Errore salvataggio Google Sheet:", err);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
