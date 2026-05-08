import type { FinancialAuthorizationViajeEnSolicitud } from "@/features/financial-authorization/interfaces/financial-authorization-viaje.interface"

export interface FinancialAuthorizationSolicitudPendienteRevision {
  id: string
  folioSolicitud: string
  resumen: string
  solicitante: string
  correoElectronico: string
  companyId: number
  empresa: string
  area: string
  fechaCierreComprobacion: string
  /** Mock: últimos 4 dígitos de la tarjeta corporativa del viaje (filtros / listado). */
  tarjetaUltimos4: string
  viajes: FinancialAuthorizationViajeEnSolicitud[]
  /** Mock: el contador cerró la solicitud; desaparece de la cola aunque sigan movimientos. */
  contabilidadCerrada?: boolean
  contabilidadCerradaPor?: string | null
  contabilidadCerradaEn?: string | null
}
