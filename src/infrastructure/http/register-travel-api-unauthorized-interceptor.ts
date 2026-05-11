import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios"

import { useAuthStore } from "@/features/auth/store/authStore"

let isSessionExpiredRedirectScheduled = false

function isAuthLoginRequest(
  config: InternalAxiosRequestConfig | undefined
): boolean {
  if (config === undefined) {
    return false
  }
  const combined = `${config.baseURL ?? ""}${config.url ?? ""}`
  return combined.includes("auth/login")
}

export function registerTravelApiUnauthorizedInterceptor(
  client: AxiosInstance
): void {
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error)
      }
      const axiosError = error as AxiosError
      if (axiosError.response?.status !== 401) {
        return Promise.reject(error)
      }
      if (isAuthLoginRequest(axiosError.config)) {
        return Promise.reject(error)
      }
      if (!useAuthStore.getState().isAuthenticated) {
        return Promise.reject(error)
      }
      if (isSessionExpiredRedirectScheduled) {
        return Promise.reject(error)
      }
      isSessionExpiredRedirectScheduled = true
      useAuthStore.getState().logout()
      window.location.assign("/")
      return Promise.reject(error)
    }
  )
}
