export type ExpenseMovimientoEstado = "comprobado" | "pendiente"

export interface ExpenseMovimiento {
  id: string
  numeroMovimiento: number
  fecha: string
  descripcion: string
  numeroTarjeta: string
  gasto: number
  estado: ExpenseMovimientoEstado
}
