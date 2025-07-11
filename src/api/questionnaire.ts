// src/api/questionnaire.ts

// → punta direttamente al tuo Web App di Apps Script
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx6ZEJDup22CS5JTwtHkyFFYTv3Ckris0HsmZk7h7pAI0xySFguUdH5b-Fe7gH_FXfT/exec";

export const questionnaireAPI = {
  submit: async (data: Record<string, any>) => {
  console.log("🧾 Dati da inviare a Google Apps Script:", data); // 👈 AGGIUNGI QUESTA RIGA

  const form = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) || typeof value === "object") {
      form.append(key, JSON.stringify(value));
    } else {
      form.append(key, String(value ?? ""));
    }
  });

  const res = await fetch(WEBAPP_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
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
