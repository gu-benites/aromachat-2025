// API client configuration and utilities

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Base API URL from environment variables or fallback to localhost
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Type for API response
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

/**
 * Type for paginated API response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Type for API error response
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, string[]>;
}

/**
 * Creates a configured axios instance
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
  });

  // Add request interceptor for auth tokens, etc.
  instance.interceptors.request.use(
    (config) => {
      // You can add auth tokens here
      // const token = localStorage.getItem('token');
      // if (token) {
      //   config.headers = config.headers || {};
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      // Handle errors here
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the configured axios instance
export const apiClient = createApiClient();

/**
 * Helper function to handle API errors
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred'
    );
  }
  return error instanceof Error ? error.message : 'An unknown error occurred';
}

/**
 * Helper function to make type-safe API requests
 */
export async function apiRequest<T = any>(
  config: AxiosRequestConfig
): Promise<{ data: T; response: AxiosResponse<T> }> {
  try {
    const response = await apiClient.request<T>(config);
    return { data: response.data, response };
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Helper function for GET requests
 */
export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<{ data: T; response: AxiosResponse<T> }> {
  return apiRequest<T>({ ...config, method: 'GET', url });
}

/**
 * Helper function for POST requests
 */
export async function post<T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<{ data: T; response: AxiosResponse<T> }> {
  return apiRequest<T>({ ...config, method: 'POST', url, data });
}

/**
 * Helper function for PUT requests
 */
export async function put<T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<{ data: T; response: AxiosResponse<T> }> {
  return apiRequest<T>({ ...config, method: 'PUT', url, data });
}

/**
 * Helper function for DELETE requests
 */
export async function del<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<{ data: T; response: AxiosResponse<T> }> {
  return apiRequest<T>({ ...config, method: 'DELETE', url });
}
