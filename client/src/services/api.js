const BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Factories
  async getFactories() {
    const response = await fetch(`${BASE_URL}/factories`);
    return handleResponse(response);
  },

  async getFactory(id) {
    const response = await fetch(`${BASE_URL}/factories/${id}`);
    return handleResponse(response);
  },

  async createFactory(data) {
    const response = await fetch(`${BASE_URL}/factories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteFactory(id) {
    const response = await fetch(`${BASE_URL}/factories/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Machines
  async addMachine(factoryId, machineData) {
    const response = await fetch(`${BASE_URL}/factories/${factoryId}/machines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machineData),
    });
    return handleResponse(response);
  },

  async updateMachine(factoryId, machineId, machineData) {
    const response = await fetch(`${BASE_URL}/factories/${factoryId}/machines/${machineId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machineData),
    });
    return handleResponse(response);
  },

  async deleteMachine(factoryId, machineId) {
    const response = await fetch(`${BASE_URL}/factories/${factoryId}/machines/${machineId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Production Flow
  async saveProductionFlow(factoryId, steps) {
    const response = await fetch(`${BASE_URL}/factories/${factoryId}/flow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps }),
    });
    return handleResponse(response);
  },

  // Reports
  async saveReport(factoryId, reportData) {
    const response = await fetch(`${BASE_URL}/factories/${factoryId}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    return handleResponse(response);
  },

  async getReports(factoryId) {
    const response = await fetch(`${BASE_URL}/factories/${factoryId}/reports`);
    return handleResponse(response);
  }
};
export default api;
