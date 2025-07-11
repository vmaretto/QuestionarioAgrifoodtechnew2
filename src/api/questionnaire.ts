// src/api/questionnaire.ts

// → punta direttamente al tuo Web App di Apps Script
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzbyZZUsQoUAhroIR2p-qVl0Gs7Ia5VEdC47wmpBYhOCq9vQXc6aeBw66eHhZ7JNSZT/exec";

export const questionnaireAPI = {
  submit: async (data: Record<string, any>) => {
    // Costruisco un body form-urlencoded (evito il preflight JSON)
    const form = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      // se è un array (es. trends), serializzo in JSON
      if (Array.isArray(value) || typeof value === "object") {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value ?? ""));
      }
    });

    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      // NON metto headers, di default è application/x-www-form-urlencoded
      body: form.toString(),
    });
    return res.json();
  },

  exportCSV: async () => {
    window.open("/export/aziende.csv", "_blank");
  },

  exportRisposteCSV: async () => {
    window.open("/export/risposte.csv", "_blank");
  },

  getResponses: async () => {
    const response = await fetch("/api/responses");
    return response.json();
  },
};
