const API_URL = 'https://risposte-questionario.glitch.me/api';

export const questionnaireAPI = {
  submit: async (data: any) => {
    const response = await fetch(`${API_URL}/survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  exportCSV: async () => {
    window.open(`${API_URL}/export/aziende.csv`, '_blank');
  },

  exportRisposteCSV: async () => {
    window.open(`${API_URL}/export/risposte.csv`, '_blank');
  },

  getResponses: async () => {
    const response = await fetch(`${API_URL}/responses`);
    return response.json();
  },
};
