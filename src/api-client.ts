import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIResponse, ServerLogConfig, ServerLogError } from './types';

export class APIClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: ServerLogConfig) {
    const { apiKey, baseUrl = 'https://api.serverlog.io' } = config;

    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          const message = error.response.data?.message || 'An error occurred with the request';
          const statusCode = error.response.status;
          const errorCode = error.response.data?.code;
          
          throw new ServerLogError(message, statusCode, errorCode);
        } else if (error.request) {
          // Request was made but no response was received
          throw new ServerLogError('No response received from server. Please check your network connection.');
        } else {
          // Error setting up the request
          throw new ServerLogError(`Request setup error: ${error.message}`);
        }
      }
    );
  }

  async post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return {
      data: response.data,
      status: response.status
    };
  }

  async put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return {
      data: response.data,
      status: response.status
    };
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return {
      data: response.data,
      status: response.status
    };
  }
} 