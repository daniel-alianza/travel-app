import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuthStore } from "@/features/auth/store/authStore"
import { puedeAccederRuta } from "@/features/auth/utils/auth-route-access"

const RUTAS_SIN_GUARDIA_PERMISO = new Set<string>(["/home", "/profile"])

export function PermissionOutlet() {
  const { pathname } = useLocation()
  const permisosSesion = useAuthStore((state) => state.permisosSesion ?? [])
  const rolSesion = useAuthStore((state) => state.rolSesion ?? "")

  if (RUTAS_SIN_GUARDIA_PERMISO.has(pathname)) {
    return <Outlet />
  }

  if (!puedeAccederRuta(pathname, permisosSesion, rolSesion)) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
