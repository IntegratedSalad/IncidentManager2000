const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bskprojekt.kacperklimas.com/api';

// Incident API calls
export const incidentAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  },

  async getById(id: number) {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`);
    if (!response.ok) throw new Error('Failed to fetch incident');
    return response.json();
  },

  async getByStatus(status: string) {
    const response = await fetch(`${API_BASE_URL}/incidents/status/${status}`);
    if (!response.ok) throw new Error('Failed to fetch incidents by status');
    return response.json();
  },

  async getByPriority(priority: string) {
    const response = await fetch(`${API_BASE_URL}/incidents/priority/${priority}`);
    if (!response.ok) throw new Error('Failed to fetch incidents by priority');
    return response.json();
  },

  async getByReporter(email: string) {
    const response = await fetch(`${API_BASE_URL}/incidents/reporter/${email}`);
    if (!response.ok) throw new Error('Failed to fetch incidents by reporter');
    return response.json();
  },

  async getByAssignee(email: string) {
    const response = await fetch(`${API_BASE_URL}/incidents/assigned/${email}`);
    if (!response.ok) throw new Error('Failed to fetch incidents by assignee');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create incident');
    return response.json();
  },

  async update(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update incident');
    return response.json();
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete incident');
    return response.json();
  },
};

// User API calls
export const userAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getById(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getByEmail(email: string) {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getByRole(role: string) {
    const response = await fetch(`${API_BASE_URL}/users/role/${role}`);
    if (!response.ok) throw new Error('Failed to fetch users by role');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async update(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};
