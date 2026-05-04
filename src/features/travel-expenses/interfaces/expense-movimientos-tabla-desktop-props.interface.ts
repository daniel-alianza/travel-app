import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"

export interface ExpenseMovimientosTablaDesktopProps {
  movimientos: ExpenseMovimiento[]
  onSolicitarComprobacion: (movimiento: ExpenseMovimiento) => void
}
