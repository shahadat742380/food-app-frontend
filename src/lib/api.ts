import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Base API URL
const API_BASE_URL = "http://localhost:8787";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  message?: string;
}

// Type for login response data
export interface LoginResponseData {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

// API client for making requests
export const apiClient = {
  // Generic request method with error handling
  async request<T>(
    method: string,
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
        ...config,
      });

      return response.data as ApiResponse<T>;
    } catch (error) {
      console.error("API request failed:", error);
      const axiosError = error as AxiosError<ApiResponse<T>>;

      // Return error response from the API if available
      if (axiosError.response?.data) {
        return axiosError.response.data as ApiResponse<T>;
      }

      // Otherwise, return a generic error
      return {
        success: false,
        error: axiosError.message || "Unknown error",
      };
    }
  },

  // Auth related API methods
  auth: {
    // Login method
    async login(
      email: string,
      password: string
    ): Promise<ApiResponse<LoginResponseData>> {
      return apiClient.request<LoginResponseData>("POST", "/api/auth/login", {
        email,
        password,
      });
    },
  },
};
