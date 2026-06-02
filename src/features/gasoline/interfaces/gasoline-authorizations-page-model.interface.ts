import type { GasolineRequestListItem } from "@/features/gasoline/services/gasoline-api"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

export type GasolineAuthorizationsModalResolucion = "rechazar" | null

export interface GasolineAuthorizationsPageModel {
  mousePosition: TravelRequestMousePosition
  solicitudes: GasolineRequestListItem[]
  solicitudesFiltradas: GasolineRequestListItem[]
  solicitudesPagina: GasolineRequestListItem[]
  cargaInicial: boolean
  busqueda: string
  setBusqueda: (valor: string) => void
  empresaFiltro: string
  setEmpresaFiltro: (valor: string) => void
  opcionesEmpresa: string[]
  pagina: number
  totalPaginas: number
  tamanoPagina: number
  setTamanoPagina: (valor: number) => void
  opcionesTamanoPagina: readonly number[]
  setPagina: (valor: number) => void
  accionCargando: number | null
  modalResolucion: GasolineAuthorizationsModalResolucion
  solicitudActiva: GasolineRequestListItem | null
  comentarioResolucion: string
  setComentarioResolucion: (valor: string) => void
  abrirRechazo: (solicitud: GasolineRequestListItem) => void
  cerrarModal: () => void
  aprobarSolicitud: (solicitud: GasolineRequestListItem) => Promise<void>
  confirmarRechazo: () => Promise<void>
  recargar: () => Promise<void>
  rechazoRequiereComentario: boolean
}
