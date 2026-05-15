import type { FiltrosAutorizacionFinanciera } from "@/features/financial-authorization/interfaces/financial-authorization-filtros.interface"
import type { FinancialAuthorizationSolicitudPendienteRevision } from "@/features/financial-authorization/interfaces/financial-authorization-solicitud.interface"
import type { FinancialAuthorizationViajeEnSolicitud } from "@/features/financial-authorization/interfaces/financial-authorization-viaje.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import type { Dispatch, SetStateAction } from "react"

export interface FinancialAuthorizationPageController {
  mounted: boolean
  mousePosition: TravelRequestMousePosition
  cargando: boolean
  errorCarga: string | null
  solicitudes: FinancialAuthorizationSolicitudPendienteRevision[]
  idSolicitudEnRevision: string | null
  movimientoSeleccionadoId: string | null
  setMovimientoSeleccionadoId: Dispatch<SetStateAction<string | null>>
  indiceViajeActivo: number
  setIndiceViajeActivo: Dispatch<SetStateAction<number>>
  idsMovimientosParaEnvio: string[]
  comentarioRevision: string
  setComentarioRevision: Dispatch<SetStateAction<string>>
  detalleMovimientoTransicion: boolean
  descargaEnCurso: "xml" | "pdf" | null
  setDescargaEnCurso: Dispatch<SetStateAction<"xml" | "pdf" | null>>
  solicitudIdAbriendoRevision: string | null
  normaReparto: string
  normasRepartoViaticos: Array<{
    value: string
    label: string
    companyName: string
  }>
  setNormaReparto: Dispatch<SetStateAction<string>>
  categoriaCfdiConcepto: string
  setCategoriaCfdiConcepto: Dispatch<SetStateAction<string>>
  indicadorImpCfdiConcepto: string
  setIndicadorImpCfdiConcepto: Dispatch<SetStateAction<string>>
  filtros: FiltrosAutorizacionFinanciera
  companiasFiltro: string[]
  areasFiltro: string[]
  setFiltros: Dispatch<SetStateAction<FiltrosAutorizacionFinanciera>>
  cargarSolicitudes: () => Promise<void>
  haySolicitudes: boolean
  solicitudesFiltradas: FinancialAuthorizationSolicitudPendienteRevision[]
  solicitudesListadoPagina: FinancialAuthorizationSolicitudPendienteRevision[]
  paginaListado: number
  totalPaginasListado: number
  tamanoPaginaListado: number
  opcionesTamanoPaginaListado: readonly number[]
  onPaginaListadoAnterior: () => void
  onPaginaListadoSiguiente: () => void
  onCambiarTamanoPaginaListado: (tamano: number) => void
  resumen: {
    total: number
    movs: number
    solicitudes: number
    viajesEnCola: number
    totalEnSistema: number
  }
  filtrosActivos: boolean
  limpiarFiltros: () => void
  solicitudEnRevision: FinancialAuthorizationSolicitudPendienteRevision | null
  indiceSolicitudRevision: number
  resumenSeleccionEnvio: { cantidad: number; total: number } | null
  abrirRevisionConFeedback: (solicitudId: string) => Promise<void>
  cerrarRevision: () => void
  alternarMovimientoParaEnvio: (movId: string) => void
  seleccionarTodosMovimientosDelViaje: (
    viaje: FinancialAuthorizationViajeEnSolicitud
  ) => void
  seleccionarTodosMovimientosDeSolicitud: () => void
  limpiarSeleccionEnvio: () => void
  enviarAprobacionMovimientosConjunta: () => void
  cerrarContabilidadMock: () => void
  aprobarMovimientoFacturaSap: (input: {
    movimientoId: string
    tripMovementProofId: number
    accountCode: string
    taxCode: string
    reviewerNotes?: string
  }) => Promise<{ docEntry: number }>
}
