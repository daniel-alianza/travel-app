import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

export interface ExpenseHistorialViajesSectionProps {
  viajesFinalizados: ExpenseViajeResumen[]
  historialViajesVisible: boolean
  onToggleHistorial: () => void
  idViajeSeleccionado: string
  onSeleccionarViaje: (id: string) => void
}
