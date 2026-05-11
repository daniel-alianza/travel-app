import axios from "axios"

import { registerTravelApiUnauthorizedInterceptor } from "@/infrastructure/http/register-travel-api-unauthorized-interceptor"

export const travelApi = axios.create({
  baseURL: `${import.meta.env.VITE_TRAVEL_API_URL}/api`,
  withCredentials: true,
})

registerTravelApiUnauthorizedInterceptor(travelApi)
