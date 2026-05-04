import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

export interface ExpenseMovimientosPeriodoSectionProps {
  viaje: ExpenseViajeResumen
  viajeActivo: boolean
  movimientosCargando: boolean
  movimientosError: boolean
  movimientosErrorMensaje: string | null
  movimientosDelViaje: ExpenseMovimiento[]
  totalMovimientos: number
  pendientes: ExpenseMovimiento[]
  mostrarResumenMovimientos: boolean
  panelMovimientosAbierto: boolean
  onTogglePanelMovimientos: () => void
  onReintentarMovimientos: () => void
  onSolicitarComprobacion: (movimiento: ExpenseMovimiento) => void
}
