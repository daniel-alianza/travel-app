import type { GasolineAnticipo } from "@/features/gasoline/services/gasoline-api"
import type { GasolineRequestListItem } from "@/features/gasoline/services/gasoline-api"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

export type GasolineDispersionModalTipo = "dispersar" | "cancelar" | null

export interface GasolineDispersionPageModel {
  mousePosition: TravelRequestMousePosition
  solicitudesFiltradas: GasolineRequestListItem[]
  solicitudesPagina: GasolineRequestListItem[]
  cargaInicial: boolean
  busqueda: string
  setBusqueda: (valor: string) => void
  pagina: number
  totalPaginas: number
  tamanoPagina: number
  setTamanoPagina: (valor: number) => void
  opcionesTamanoPagina: readonly number[]
  setPagina: (valor: number) => void
  accionCargando: number | null
  modalAbierto: GasolineDispersionModalTipo
  solicitudActiva: GasolineRequestListItem | null
  comentario: string
  setComentario: (valor: string) => void
  anticipos: GasolineAnticipo[]
  anticiposCargando: boolean
  anticipoSeleccionado: string
  setAnticipoSeleccionado: (valor: string) => void
  abrirDispersion: (solicitud: GasolineRequestListItem) => Promise<void>
  abrirCancelacion: (solicitud: GasolineRequestListItem) => void
  cerrarModal: () => void
  confirmarDispersion: () => Promise<void>
  confirmarCancelacion: () => Promise<void>
  recargar: () => Promise<void>
}
