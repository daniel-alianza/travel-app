import { useState } from "react"

import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"

interface UseExpenseComprobacionMovimientoReturn {
  movimientoComprobacion: ExpenseMovimiento | null
  setMovimientoComprobacion: (movimiento: ExpenseMovimiento | null) => void
  cerrarModalComprobacion: () => void
}

export function useExpenseComprobacionMovimiento(): UseExpenseComprobacionMovimientoReturn {
  const [movimientoComprobacion, setMovimientoComprobacion] =
    useState<ExpenseMovimiento | null>(null)

  function cerrarModalComprobacion(): void {
    setMovimientoComprobacion(null)
  }

  return {
    movimientoComprobacion,
    setMovimientoComprobacion,
    cerrarModalComprobacion,
  }
}
