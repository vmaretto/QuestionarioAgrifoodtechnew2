// src/api/questionnaire.ts

// → punta direttamente al tuo Web App di Apps Script
const BASE_URL = "https://script.google.com/macros/s/AKfycbxye_XSN91OnUopeeJEnPmLDHwBezXu0-d2vVOm4e6Nsyo3Ssa9c85mnJG6W3VuNoHpcA/exec";

export const questionnaireAPI = {
  submit: async (data: any) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  exportCSV: async () => {
    // se vuoi continuare a esportare da Vercel, lascia qui i tuoi export
    window.open("/export/aziende.csv", "_blank");
  },

  exportRisposteCSV: async () => {
    window.open("/export/risposte.csv", "_blank");
  },

  getResponses: async () => {
    // questo endpoint se lo stavi usando lato Vercel
    const response = await fetch("/api/responses");
    return response.json();
  },
};
