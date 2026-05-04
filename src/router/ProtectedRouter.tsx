import { Navigate, Outlet } from "react-router-dom"

import { useAuthStore } from "@/features/auth/store/authStore"

export function ProtectedRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
