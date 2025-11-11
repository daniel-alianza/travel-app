import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // TODO: Implementar lógica de autenticación real
  // Por ahora, verificar si hay un token en localStorage o cookies
  const isAuthenticated = localStorage.getItem("token") !== null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export { ProtectedRoute }

