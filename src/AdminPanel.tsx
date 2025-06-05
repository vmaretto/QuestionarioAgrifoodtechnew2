import React, { useState } from "react";
import * as Icons from "lucide-react";
import { questionnaireAPI } from "./api/questionnaire";

const AdminPanel = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      setExportError(null);

      // Se usi API REST:
      await questionnaireAPI.exportCSV();

      console.log("CSV export triggered.");
    } catch (error: any) {
      console.error("Export error:", error);
      setExportError(error.message || "Errore durante l'esportazione.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-xl w-full text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <Icons.Settings className="w-8 h-8 text-blue-600 animate-spin" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Pannello Amministratore
          </h1>
        </div>

        <h2 className="text-xl font-semibold mb-4">Export Dati</h2>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
        >
          <Icons.Download className="w-5 h-5" />
          {isExporting ? "Esportazione in corso..." : "Scarica CSV"}
        </button>

        {exportError && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Errore: {exportError}
          </div>
        )}

        <p className="text-sm text-gray-600 mt-4">
          Clicca per scaricare tutte le risposte in formato CSV.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
