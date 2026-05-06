import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

export interface ExpenseViajeTarjetaProps {
  viaje: ExpenseViajeResumen
  seleccionado: boolean
  variante: "activo" | "finalizado"
  plazoComprobacion?: string | null
  plazoComprobacionColor?: "neutral" | "warning" | "danger"
  onSeleccionar: (id: string) => void
}
