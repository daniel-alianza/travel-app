import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { nombreMostradoDesdeCorreo } from "@/features/auth/utils/auth-nombre-desde-correo"

type AuthStore = {
  isAuthenticated: boolean
  nombreResponsable: string
  correoSesion: string
  userId: number | null
  login: (entrada: { correo: string; userId: number }) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      nombreResponsable: "",
      correoSesion: "",
      userId: null,
      login: (entrada) => {
        if (
          entrada === undefined ||
          entrada === null ||
          typeof entrada.correo !== "string" ||
          typeof entrada.userId !== "number" ||
          !Number.isFinite(entrada.userId)
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
        })
      },
      logout: () => {
        set({
          isAuthenticated: false,
          nombreResponsable: "",
          correoSesion: "",
          userId: null,
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
      }),
    }
  )
)
