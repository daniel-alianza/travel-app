import type { FinancialAuthorizationMovimientoComprobado } from "@/features/financial-authorization/interfaces/financial-authorization-movimiento.interface"

export interface FinancialAuthorizationViajeEnSolicitud {
  id: string
  idViaje: string
  titulo: string
  destino: string
  periodoInicio: string
  periodoFin: string
  movimientosComprobados: FinancialAuthorizationMovimientoComprobado[]
}
