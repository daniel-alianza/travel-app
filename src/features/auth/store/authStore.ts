import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { nombreMostradoDesdeCorreo } from "@/features/auth/utils/auth-nombre-desde-correo"

type AuthStore = {
  isAuthenticated: boolean
  nombreResponsable: string
  login: (correo: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      nombreResponsable: "",
      login: (correo: string) => {
        set({
          isAuthenticated: true,
          nombreResponsable: nombreMostradoDesdeCorreo(correo),
        })
      },
      logout: () => {
        set({ isAuthenticated: false, nombreResponsable: "" })
      },
    }),
    {
      name: "travel-auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        nombreResponsable: state.nombreResponsable,
      }),
    }
  )
)
