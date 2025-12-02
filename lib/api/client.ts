const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

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

  async switchWorkspace(workspaceId: string) {
    return this.post('/auth/switch-workspace', { workspaceId });
  }

  // Metrics endpoints
  async getMetrics(workspaceId: string, params?: { from?: string; to?: string; period?: string }) {
    const queryString = new URLSearchParams({
      workspaceId,
      ...params,
    } as any).toString();
    return this.get(`/metrics?${queryString}`);
  }

  async getMetricsTrend(workspaceId: string, params?: { from?: string; to?: string; period?: string }) {
    const queryString = new URLSearchParams({
      workspaceId,
      ...params,
    } as any).toString();
    return this.get(`/metrics/trend?${queryString}`);
  }

  async refreshMetrics(workspaceId: string, params?: { from?: string; to?: string }) {
    const queryString = new URLSearchParams({
      workspaceId,
      ...params,
    } as any).toString();
    return this.post(`/metrics/refresh?${queryString}`, {});
  }

  async getChannelPerformance(workspaceId: string, params?: { from?: string; to?: string }) {
    const queryString = new URLSearchParams({
      workspaceId,
      ...params,
    } as any).toString();
    return this.get(`/metrics/channel-performance?${queryString}`);
  }

  // Costs endpoints
  async getCosts(workspaceId: string) {
    return this.get(`/costs?workspaceId=${workspaceId}`);
  }

  async createCost(workspaceId: string, data: any) {
    return this.post(`/costs?workspaceId=${workspaceId}`, data);
  }

  async updateCost(workspaceId: string, costId: string, data: any) {
    return this.put(`/costs/${costId}?workspaceId=${workspaceId}`, data);
  }

  async deleteCost(workspaceId: string, costId: string) {
    return this.delete(`/costs/${costId}?workspaceId=${workspaceId}`);
  }

  async getCostBreakdown(workspaceId: string) {
    return this.get(`/costs/breakdown?workspaceId=${workspaceId}`);
  }

  // Integrations endpoints
  async getIntegrationStatus(workspaceId: string) {
    return this.get(`/integrations/status?workspaceId=${workspaceId}`);
  }

  async connectShopify(workspaceId: string, data: { shopUrl: string; accessToken: string }) {
    return this.post(`/integrations/shopify/connect?workspaceId=${workspaceId}`, data);
  }

  async syncShopify(workspaceId: string, params?: { from?: string; to?: string }) {
    const queryString = new URLSearchParams({
      workspaceId,
      ...params,
    } as any).toString();
    return this.post(`/integrations/shopify/sync?${queryString}`, {});
  }

  async disconnectShopify(workspaceId: string) {
    return this.post(`/integrations/shopify/disconnect?workspaceId=${workspaceId}`, {});
  }

  async connectFacebook(workspaceId: string, data: { adAccountId: string; accessToken: string }) {
    return this.post(`/integrations/facebook/connect?workspaceId=${workspaceId}`, data);
  }

  async syncFacebook(workspaceId: string, params?: { from?: string; to?: string }) {
    const queryString = new URLSearchParams({
      workspaceId,
      ...params,
    } as any).toString();
    return this.post(`/integrations/facebook/sync?${queryString}`, {});
  }

  async disconnectFacebook(workspaceId: string) {
    return this.post(`/integrations/facebook/disconnect?workspaceId=${workspaceId}`, {});
  }
}

export const apiClient = new ApiClient();
