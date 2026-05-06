import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

export interface ExpenseViajesActivosSectionProps {
  viajesActivos: ExpenseViajeResumen[]
  viajesReferencia: ExpenseViajeResumen[]
  idViajeSeleccionado: string
  viajesIdsConComprobacionPendiente: ReadonlySet<string>
  onSeleccionarViaje: (id: string) => void
}
