import type { FinancialAuthorizationViajeEnSolicitud } from "@/features/financial-authorization/interfaces/financial-authorization-viaje.interface"

export interface FinancialAuthorizationSolicitudPendienteRevision {
  id: string
  folioSolicitud: string
  resumen: string
  solicitante: string
  correoElectronico: string
  empresa: string
  area: string
  fechaCierreComprobacion: string
  viajes: FinancialAuthorizationViajeEnSolicitud[]
}
