import { useEffect } from "react"

import {
  useAppToastStore,
  type AppToastTipo,
} from "@/components/app-toast-store"
import { cn } from "@/lib/utils"

export {
  showAppToast,
  type AppToastTipo,
} from "@/components/app-toast-store"

const DURACION_VISIBLE_MS = 2300
const DURACION_SALIDA_MS = 250

export function useAppToast(): {
  showToast: (mensaje: string, tipo: AppToastTipo) => void
} {
  const showToast = useAppToastStore((state) => state.showToast)
  return { showToast }
}

export function AppToastViewport() {
  const toast = useAppToastStore((state) => state.toast)
  const setToastVisible = useAppToastStore((state) => state.setToastVisible)
  const clearToast = useAppToastStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast?.visible) {
      return
    }
    const ocultar = window.setTimeout(() => {
      setToastVisible(false)
    }, DURACION_VISIBLE_MS)
    return () => window.clearTimeout(ocultar)
  }, [toast?.visible, toast?.mensaje, toast?.tipo, setToastVisible])

  useEffect(() => {
    if (!toast || toast.visible) {
      return
    }
    const quitar = window.setTimeout(() => {
      clearToast()
    }, DURACION_SALIDA_MS)
    return () => window.clearTimeout(quitar)
  }, [toast, clearToast])

  if (!toast) {
    return null
  }

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-none fixed top-24 right-4 z-115 w-[min(100%-2rem,26rem)] rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-sm transition-all duration-250 sm:right-6 lg:right-10 xl:right-12 2xl:right-16",
        toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        toast.tipo === "success" &&
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
        toast.tipo === "error" &&
          "border-destructive/40 bg-destructive/10 text-destructive",
        toast.tipo === "info" && "border-border bg-card/95 text-foreground"
      )}
    >
      <p className="text-sm font-medium">{toast.mensaje}</p>
    </div>
  )
}
