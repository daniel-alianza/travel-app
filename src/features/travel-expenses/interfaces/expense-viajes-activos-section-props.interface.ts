import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

export interface ExpenseViajesActivosSectionProps {
  viajesActivos: ExpenseViajeResumen[]
  idViajeSeleccionado: string
  onSeleccionarViaje: (id: string) => void
}
