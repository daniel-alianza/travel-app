import type { GasolineRequestListItem } from "@/features/gasoline/services/gasoline-api"
import type { GasolineRequestStatus } from "@/features/gasoline/services/gasoline-api"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

export type GasolineReportVista = "operativa" | "historial"

export interface GasolineReportTotales {
  monto: number
  distancia: number
  cantidad: number
}

export interface GasolineReportPageModel {
  mousePosition: TravelRequestMousePosition
  vista: GasolineReportVista
  setVista: (vista: GasolineReportVista) => void
  solicitudesFiltradas: GasolineRequestListItem[]
  solicitudesPagina: GasolineRequestListItem[]
  cargaInicial: boolean
  busqueda: string
  setBusqueda: (valor: string) => void
  estadoFiltro: GasolineRequestStatus | ""
  setEstadoFiltro: (estado: GasolineRequestStatus | "") => void
  fechaDesde: string
  setFechaDesde: (valor: string) => void
  fechaHasta: string
  setFechaHasta: (valor: string) => void
  pagina: number
  totalPaginas: number
  tamanoPagina: number
  setTamanoPagina: (valor: number) => void
  opcionesTamanoPagina: readonly number[]
  setPagina: (valor: number) => void
  totales: GasolineReportTotales
  limpiarFiltros: () => void
  exportarCsv: () => void
  exportando: boolean
  recargar: () => Promise<void>
}
