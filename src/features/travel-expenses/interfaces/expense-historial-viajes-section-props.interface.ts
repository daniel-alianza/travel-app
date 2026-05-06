import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

export interface ExpenseHistorialViajesSectionProps {
  viajesFinalizados: ExpenseViajeResumen[]
  viajesReferencia: ExpenseViajeResumen[]
  historialViajesVisible: boolean
  onToggleHistorial: () => void
  idViajeSeleccionado: string
  viajesIdsConComprobacionPendiente: ReadonlySet<string>
  onSeleccionarViaje: (id: string) => void
}
