import { useState } from "react";
import * as Icons from "lucide-react";
import { questionnaireAPI } from "./api/questionnaire";
import Header from "./components/Header";

const AdminPanel = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportAziende = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      // Scarica il CSV delle aziende
      await questionnaireAPI.exportCSV();
    } catch (error: any) {
      console.error("Export aziende error:", error);
      setExportError(error.message || "Errore durante l'esportazione aziende.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportRisposte = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      // Scarica il CSV delle risposte dettagliate
      await questionnaireAPI.exportRisposteCSV();
    } catch (error: any) {
      console.error("Export risposte error:", error);
      setExportError(
        error.message || "Errore durante l'esportazione risposte."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Intestazione comune a tutte le pagine */}
      <Header />

      {/* Contenuto del Pannello Amministratore */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-xl w-full text-center">
          {/* Titolo */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <Icons.Settings className="w-8 h-8 text-blue-600 animate-spin" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Pannello Amministratore
            </h1>
          </div>

          {/* Sottotitolo */}
          <h2 className="text-xl font-semibold mb-4">Export Dati</h2>

          {/* Pulsante per scaricare il CSV delle aziende */}
          <button
            onClick={handleExportAziende}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-6 py-3 mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            <Icons.Download className="w-5 h-5" />
            {isExporting
              ? "Esportazione aziende in corso..."
              : "Scarica aziende.csv"}
          </button>

          {/* Pulsante per scaricare il CSV delle risposte */}
          <button
            onClick={handleExportRisposte}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-6 py-3 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            <Icons.Download className="w-5 h-5" />
            {isExporting
              ? "Esportazione risposte in corso..."
              : "Scarica risposte.csv"}
          </button>

          {/* Messaggio di errore */}
          {exportError && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              Errore: {exportError}
            </div>
          )}

          {/* Istruzioni */}
          <p className="text-sm text-gray-600 mt-4">
            Clicca uno dei due pulsanti per scaricare i dati in formato CSV:
            <br />– <strong>aziende.csv</strong> → anagrafica delle aziende
            partecipanti
            <br />– <strong>risposte.csv</strong> → dettagli di ogni tecnologia
            selezionata
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
