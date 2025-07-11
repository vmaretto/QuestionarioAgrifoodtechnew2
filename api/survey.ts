// /api/survey.ts
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      console.log("Risposte ricevute:", data);
      // TODO: puoi salvare in un database, file su S3, ecc.
      return res.status(200).json({ message: "Dati ricevuti correttamente" });
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      return res.status(500).json({ error: "Errore interno del server" });
    }
  } else {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Metodo non consentito");
  }
}
