export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Metodo non consentito");
  }

  try {
    const body = req.body;
    console.log("Ricevuto body:", body);

    const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT;

console.log("Snippet originale da Vercel (primi 200 caratteri):");
console.log(rawCredentials.slice(0, 200));

const normalized = rawCredentials.replace(/\\n/g, "\n");

console.log("Snippet normalizzato per JSON.parse (primi 200 caratteri):");
console.log(normalized.slice(0, 200));
    
    if (!rawCredentials) {
      console.error("GOOGLE_SERVICE_ACCOUNT mancante.");
      return res.status(500).json({ error: "Credenziali Google mancanti" });
    }

    console.log("Credenziali grezze:", rawCredentials.slice(0, 100) + "...");

    let credentials;
try {
  const normalized = rawCredentials.replace(/\\n/g, "\n");
  credentials = JSON.parse(normalized);
  console.log("[DEBUG] ✅ Credenziali parse OK: ", {
    project_id: credentials.project_id,
    client_email: credentials.client_email
  });
} catch (jsonError: any) {
  console.error("❌ Errore nel parsing delle credenziali:", jsonError.message);

  const match = jsonError.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1], 10);
    const start = Math.max(0, pos - 20);
    const end = Math.min(rawCredentials.length, pos + 20);
    const snippet = rawCredentials.slice(start, end);

    console.error(`Contesto errore vicino alla posizione ${pos}:`);
    console.error("..." + snippet + "...");
  }

  return res.status(500).json({
    error: "Errore parsing GOOGLE_SERVICE_ACCOUNT",
    message: jsonError.message
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

    console.log("Scrittura completata.");
    return res.status(200).json({ message: "Dati salvati correttamente su Google Sheet" });

  } catch (error) {
    console.error("Errore durante il salvataggio su Google Sheet:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
