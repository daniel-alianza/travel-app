import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"

export interface ExpenseMovimientoTarjetaMovilProps {
  movimiento: ExpenseMovimiento
  onSolicitarComprobacion: (movimiento: ExpenseMovimiento) => void
}
