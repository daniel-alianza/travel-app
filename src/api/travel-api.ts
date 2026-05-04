import axios from "axios"

export const travelApi = axios.create({
  baseURL: `${import.meta.env.VITE_TRAVEL_API_URL}/api`,
  withCredentials: true,
})
