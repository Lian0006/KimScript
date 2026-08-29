import { supabase } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.kimscript.com';

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  async get(url: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post(url: string, data?: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async patch(url: string, data?: any) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete(url: string) {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
