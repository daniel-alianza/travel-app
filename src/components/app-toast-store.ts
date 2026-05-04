import { create } from "zustand"

export type AppToastTipo = "success" | "info" | "error"

export interface AppToastActual {
  mensaje: string
  tipo: AppToastTipo
  visible: boolean
}

interface AppToastStore {
  toast: AppToastActual | null
  showToast: (mensaje: string, tipo: AppToastTipo) => void
  setToastVisible: (visible: boolean) => void
  clearToast: () => void
}

export const useAppToastStore = create<AppToastStore>((set) => ({
  toast: null,
  showToast(mensaje, tipo) {
    set({
      toast: { mensaje, tipo, visible: true },
    })
  },
  setToastVisible(visible) {
    set((state) =>
      state.toast ? { toast: { ...state.toast, visible } } : state
    )
  },
  clearToast() {
    set({ toast: null })
  },
}))

export function showAppToast(mensaje: string, tipo: AppToastTipo): void {
  useAppToastStore.getState().showToast(mensaje, tipo)
}
