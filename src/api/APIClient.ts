import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from '@utils/logger';

/**
 * API Client for making HTTP requests
 */
export class APIClient {
  private axiosInstance: AxiosInstance;
  private logger: Logger;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://api.example.com';
    this.logger = new Logger('APIClient');

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: parseInt(process.env.API_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.info(`[${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
      },
      (error) => {
        this.logger.error(`API Error: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logger.info(`GET ${path}`);
    return await this.axiosInstance.get<T>(path, config);
  }

  /**
   * POST request
   */
  async post<T = unknown>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logger.info(`POST ${path}`);
    return await this.axiosInstance.post<T>(path, data, config);
  }

  /**
   * PUT request
   */
  async put<T = unknown>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logger.info(`PUT ${path}`);
    return await this.axiosInstance.put<T>(path, data, config);
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logger.info(`PATCH ${path}`);
    return await this.axiosInstance.patch<T>(path, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    this.logger.info(`DELETE ${path}`);
    return await this.axiosInstance.delete<T>(path, config);
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.logger.info('Authorization token set');
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
    this.logger.info(`Header set: ${key}`);
  }

  /**
   * Clear authorization header
   */
  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
    this.logger.info('Authorization token cleared');
  }

  /**
   * Get axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
