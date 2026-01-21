const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8082/api';

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
    console.log('[API] ✓ Token available, length:', token.length);
    console.log('[API] ✓ Token preview:', token.substring(0, 50) + '...');
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[API] ✓ Authorization header set');
  } else {
    console.warn('[API] ⚠ NO TOKEN PROVIDED - REQUEST WILL FAIL WITH 401');
  }

  console.log('[API] Fetching:', url, 'Method:', options.method || 'GET');
  console.log('[API] Headers:', Object.keys(headers));
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });
  
  console.log('[API] Response status:', response.status);
  if (response.status === 401) {
    console.error('[API] ⚠ 401 UNAUTHORIZED - Token may be invalid or expired');
  }
  
  return response;
};

// Incident API calls
export const incidentAPI = {
  async getAll(token?: string) {
    const url = `${API_BASE_URL}/incidents`;
    console.log('[incidentAPI.getAll] Calling', url, 'with token:', token ? token.substring(0, 20) + '...' : 'none');
    const response = await fetchWithToken(url, { token });
    console.log('[incidentAPI.getAll] Response status:', response.status);
    if (!response.ok) {
      const text = await response.text();
      console.error('[incidentAPI.getAll] Error response:', text);
      throw new Error('Failed to fetch incidents: ' + response.status);
    }
    const data = await response.json();
    console.log('[incidentAPI.getAll] Success, got', data.length || 0, 'incidents');
    return data;
  },

  async getById(id: number, token?: string) {
    const response = await fetchWithToken(`${API_BASE_URL}/incidents/${id}`, { token });
    if (!response.ok) throw new Error('Failed to fetch incident');
    return response.json();
  },

  async getByStatus(status: string, token?: string) {
    const url = `${API_BASE_URL}/incidents/status/${status}`;
    console.log('[incidentAPI.getByStatus] Calling', url, 'status:', status);
    const response = await fetchWithToken(url, { token });
    console.log('[incidentAPI.getByStatus] Response status:', response.status);
    if (!response.ok) {
      const text = await response.text();
      console.error('[incidentAPI.getByStatus] Error response:', text);
      throw new Error('Failed to fetch incidents by status');
    }
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
    // 204 No Content returns empty body, don't try to parse as JSON
    if (response.status === 204) {
      return null;
    }
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
    // 204 No Content returns empty body, don't try to parse as JSON
    if (response.status === 204) {
      return null;
    }
    return response.json();
  },
};