import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"

export interface ExpenseMovimientoTarjetaMovilProps {
  movimiento: ExpenseMovimiento
  comprobacionHabilitada: boolean
  etiquetaComprobacionBloqueada?: string
  onSolicitarComprobacion: (movimiento: ExpenseMovimiento) => void
}
