import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { nombreMostradoDesdeCorreo } from "@/features/auth/utils/auth-nombre-desde-correo"

type AuthStore = {
  isAuthenticated: boolean
  nombreResponsable: string
  correoSesion: string
  userId: number | null
  roleId: number | null
  rolSesion: string
  permisosSesion: string[]
  /** Solo en memoria (no persistido): respaldo si la cookie cross-site no viaja */
  accessTokenSesion: string | null
  login: (entrada: {
    correo: string
    userId: number
    roleId?: number
    rol: string
    permisos?: readonly string[]
    accessToken?: string
  }) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      nombreResponsable: "",
      correoSesion: "",
      userId: null,
      roleId: null,
      rolSesion: "",
      permisosSesion: [],
      accessTokenSesion: null,
      login: (entrada) => {
        if (
          entrada === undefined ||
          entrada === null ||
          typeof entrada.correo !== "string" ||
          typeof entrada.userId !== "number" ||
          !Number.isFinite(entrada.userId) ||
          typeof entrada.rol !== "string"
        ) {
          return
        }
        const normalizado = entrada.correo.trim()
        if (normalizado.length === 0) {
          return
        }
        const permisos =
          Array.isArray(entrada.permisos) && entrada.permisos.length > 0
            ? entrada.permisos.map((p) => String(p).trim()).filter((p) => p.length > 0)
            : []
        const accessToken =
          typeof entrada.accessToken === "string" &&
          entrada.accessToken.trim().length > 0
            ? entrada.accessToken.trim()
            : null
        set({
          isAuthenticated: true,
          nombreResponsable: nombreMostradoDesdeCorreo(normalizado),
          correoSesion: normalizado.toLowerCase(),
          userId: entrada.userId,
          roleId:
            typeof entrada.roleId === "number" && Number.isFinite(entrada.roleId)
              ? entrada.roleId
              : null,
          rolSesion: entrada.rol.trim(),
          permisosSesion: permisos,
          accessTokenSesion: accessToken,
        })
      },
      logout: () => {
        set({
          isAuthenticated: false,
          nombreResponsable: "",
          correoSesion: "",
          userId: null,
          roleId: null,
          rolSesion: "",
          permisosSesion: [],
          accessTokenSesion: null,
        })
      },
    }),
    {
      name: "travel-auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        nombreResponsable: state.nombreResponsable,
        correoSesion: state.correoSesion,
        userId: state.userId,
        roleId: state.roleId,
        rolSesion: state.rolSesion,
        permisosSesion: state.permisosSesion,
      }),
    }
  )
)
