const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

class ApiClient {
  baseURL: string;
  constructor() {
    this.baseURL = API_URL;
  }

  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getAuthToken();
    
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async register(data: { name: string; email: string; password: string; workspaceName?: string }) {
    return this.post('/auth/register', data);
  }

  async login(data: { email: string; password: string }) {
    return this.post('/auth/login', data);
  }

  async getMe() {
    return this.get('/auth/me');
  }

  // Dashboard & Metrics Endpoints (Updated to match Backend)
  async getMainMetrics(workspaceId?: string) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.get(`/metrics${query}`);
  }

  async getAdsMetrics(workspaceId?: string) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.get(`/metrics/ads${query}`);
  }

  async getWebsiteMetrics(workspaceId?: string) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.get(`/metrics/website${query}`);
  }

  // Costs endpoints
  async getCosts(workspaceId?: string) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.get(`/costs${query}`);
  }

  async createCost(workspaceId: string | undefined, data: any) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.post(`/costs${query}`, data);
  }

  async deleteCost(id: string) {
    return this.delete(`/costs/${id}`);
  }

  // Integrations endpoints
 async getIntegrationStatus(workspaceId?: string) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.get(`/integrations/status${query}`);
  }

  async connectShopify(workspaceId: string | undefined, data: { shopUrl: string; accessToken: string }) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.post(`/integrations/shopify/connect${query}`, data);
  }

  async connectMeta(workspaceId: string | undefined, data: { accessToken: string; adAccountId: string }) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.post(`/integrations/meta/connect${query}`, data);
  }

  async disconnectIntegration(workspaceId: string | undefined, platform: string) {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return this.post(`/integrations/${platform}/disconnect${query}`, {});
  }
}

export const apiClient = new ApiClient();