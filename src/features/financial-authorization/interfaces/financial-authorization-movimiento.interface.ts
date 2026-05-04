export interface FinancialAuthorizationMovimientoComprobado {
  id: string
  numeroMovimiento: number
  fecha: string
  descripcion: string
  categoria: string
  monto: number
  comentarioAlComprobar?: string
}
