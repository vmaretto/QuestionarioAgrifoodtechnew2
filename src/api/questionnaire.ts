// src/api/questionnaire.ts

// → punta direttamente al tuo Web App di Apps Script
const BASE_URL = "https://script.google.com/macros/s/AKfycbxJToeBBlAd5K-UE0u4_eRiGxuJhl0W8lcEUUmTbPST7rkIzLmf4HECidZtTBllIRBizg/exec";

// da qui in poi non ti serve più /api
const API_URL = BASE_URL;

export const questionnaireAPI = {
  submit: async (data: any) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
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
