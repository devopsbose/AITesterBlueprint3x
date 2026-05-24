/**
 * MCP Client utilities for making requests to the MCP server
 */
export class MCPClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  private async makeRequest(method: string, params?: unknown): Promise<unknown> {
    const request = {
      jsonrpc: '2.0',
      method,
      params,
      id: Math.random().toString(36),
    };

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return await response.json();
  }

  async runUITests(): Promise<unknown> {
    return this.makeRequest('runUITests');
  }

  async runAPITests(): Promise<unknown> {
    return this.makeRequest('runAPITests');
  }

  async runMobileTests(): Promise<unknown> {
    return this.makeRequest('runMobileTests');
  }

  async runAllTests(): Promise<unknown> {
    return this.makeRequest('runAllTests');
  }

  async getTestResults(): Promise<unknown> {
    return this.makeRequest('getTestResults');
  }

  async executeAPICall(method: string, endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<unknown> {
    return this.makeRequest('apiCall', {
      method,
      endpoint,
      data,
      headers,
    });
  }
}
