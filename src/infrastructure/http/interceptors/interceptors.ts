import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { travelApi } from '@/api/travel-api';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

let accessToken: string | null = null;

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    travelApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete travelApi.defaults.headers.common['Authorization'];
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

travelApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

travelApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return travelApi(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_TRAVEL_API}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const accessToken = response.data?.data?.accessToken;
        if (!accessToken) {
          throw new Error('No se recibió accessToken en la respuesta');
        }

        setAccessToken(accessToken);
        processQueue(null, accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return travelApi(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        processQueue(refreshError, null);
        isRefreshing = false;
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

