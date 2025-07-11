// src/api/questionnaire.ts

const BASE_URL = "";
const API_URL = `${BASE_URL}/api`;

export const questionnaireAPI = {
  submit: async (data: any) => {
    const response = await fetch(`${API_URL}/survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  exportCSV: async () => {
    window.open(`${BASE_URL}/export/aziende.csv`, "_blank");
  },

  exportRisposteCSV: async () => {
    window.open(`${BASE_URL}/export/risposte.csv`, "_blank");
  },

  getResponses: async () => {
    const response = await fetch(`${API_URL}/responses`);
    return response.json();
  },
};
