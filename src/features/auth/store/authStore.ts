import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { nombreMostradoDesdeCorreo } from "@/features/auth/utils/auth-nombre-desde-correo"

type AuthStore = {
  isAuthenticated: boolean
  nombreResponsable: string
  correoSesion: string
  userId: number | null
  rolSesion: string
  login: (entrada: { correo: string; userId: number; rol: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      nombreResponsable: "",
      correoSesion: "",
      userId: null,
      rolSesion: "",
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
        set({
          isAuthenticated: true,
          nombreResponsable: nombreMostradoDesdeCorreo(normalizado),
          correoSesion: normalizado.toLowerCase(),
          userId: entrada.userId,
          rolSesion: entrada.rol.trim(),
        })
      },
      logout: () => {
        set({
          isAuthenticated: false,
          nombreResponsable: "",
          correoSesion: "",
          userId: null,
          rolSesion: "",
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
        rolSesion: state.rolSesion,
      }),
    }
  )
)
