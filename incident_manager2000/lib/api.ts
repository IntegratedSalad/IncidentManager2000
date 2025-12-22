const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bskprojekt.kacperklimas.com/api';

// Helper funkcja do wysyłania żądań z Bearer tokenem
export const fetchWithToken = async (
  url: string,
  options: RequestInit & { token?: string } = {}
) => {
  const { token, ...fetchOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  } as Record<string, string>;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
};

// Incident API calls
export const incidentAPI = {
  async getAll(token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents`, { token });
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  },

  async getById(id: number, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/${id}`, { token });
    if (!response.ok) throw new Error('Failed to fetch incident');
    return response.json();
  },

  async getByStatus(status: string, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/status/${status}`, { token });
    if (!response.ok) throw new Error('Failed to fetch incidents by status');
    return response.json();
  },

  async getByPriority(priority: string, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/priority/${priority}`, { token });
    if (!response.ok) throw new Error('Failed to fetch incidents by priority');
    return response.json();
  },

  async getByReporter(email: string, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/reporter/${email}`, { token });
    if (!response.ok) throw new Error('Failed to fetch incidents by reporter');
    return response.json();
  },

  async getByAssignee(email: string, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/assigned/${email}`, { token });
    if (!response.ok) throw new Error('Failed to fetch incidents by assignee');
    return response.json();
  },

  async create(data: any, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
    if (!response.ok) throw new Error('Failed to create incident');
    return response.json();
  },

  async update(id: number, data: any, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
    if (!response.ok) throw new Error('Failed to update incident');
    return response.json();
  },

  async delete(id: number, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/${id}`, {
      method: 'DELETE',
      token,
    });
    if (!response.ok) throw new Error('Failed to delete incident');
    return response.json();
  },
};

// User API calls
export const userAPI = {
  async getAll(token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/users`, { token });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getById(id: number, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/users/${id}`, { token });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getByEmail(email: string, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/users/email/${email}`, { token });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async getByRole(role: string, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/users/role/${role}`, { token });
    if (!response.ok) throw new Error('Failed to fetch users by role');
    return response.json();
  },

  async create(data: any, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async update(id: number, data: any, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async delete(id: number, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      token,
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },
};
