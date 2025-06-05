import React from "react";
import { questionnaireAPI } from "./api/questionnaire";

const AdminPanel = () => {
  const handleExportCSV = () => {
    questionnaireAPI.exportCSV();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pannello Amministratore</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Export Dati</h2>

          <button
            onClick={handleExportCSV}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            📥 Scarica CSV
          </button>

          <p className="mt-4 text-gray-600">
            Clicca per scaricare tutte le risposte in formato CSV
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
