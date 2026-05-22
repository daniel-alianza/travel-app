import axios from "axios"

import { useAuthStore } from "@/features/auth/store/authStore"
import { registerTravelApiUnauthorizedInterceptor } from "@/infrastructure/http/register-travel-api-unauthorized-interceptor"

export const travelApi = axios.create({
  baseURL: `${import.meta.env.VITE_TRAVEL_API_URL}/api`,
  withCredentials: true,
})

travelApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessTokenSesion
  if (
    typeof token === "string" &&
    token.length > 0 &&
    config.headers.Authorization === undefined
  ) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

registerTravelApiUnauthorizedInterceptor(travelApi)
