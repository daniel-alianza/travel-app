import { useCallback, useEffect, useMemo, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import { useAuthStore } from "@/features/auth/store/authStore"
import {
  cancelApprovedGasolineRequest,
  disburseGasolineRequest,
  fetchApprovedGasolineRequests,
  fetchGasolineAnticipos,
  type GasolineAnticipo,
  type GasolineRequestListItem,
} from "@/features/gasoline/services/gasoline-api"
import type {
  GasolineDispersionModalTipo,
  GasolineDispersionPageModel,
} from "@/features/gasoline/interfaces/gasoline-dispersion-page-model.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import {
  calcularTotalPaginas,
  limitarPagina,
  rebanarPagina,
} from "@/lib/list-pagination-helpers"
import { logTravelAxiosError, userMessageFromTravelAxiosError } from "@/lib/travel-api-axios-error"

const TAMANOS_PAGINA = [5, 8, 12] as const

export function useGasolineDispersionPage(): GasolineDispersionPageModel {
  const userIdSesion = useAuthStore((state) => state.userId)
  const operadorId = userIdSesion ?? 1

  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [solicitudes, setSolicitudes] = useState<GasolineRequestListItem[]>([])
  const [cargaInicial, setCargaInicial] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [pagina, setPagina] = useState(1)
  const [tamanoPagina, setTamanoPagina] = useState<number>(8)
  const [accionCargando, setAccionCargando] = useState<number | null>(null)
  const [modalAbierto, setModalAbierto] =
    useState<GasolineDispersionModalTipo>(null)
  const [solicitudActiva, setSolicitudActiva] =
    useState<GasolineRequestListItem | null>(null)
  const [comentario, setComentario] = useState("")
  const [anticipos, setAnticipos] = useState<GasolineAnticipo[]>([])
  const [anticiposCargando, setAnticiposCargando] = useState(false)
  const [anticipoSeleccionado, setAnticipoSeleccionado] = useState("")

  const recargar = useCallback(async (): Promise<void> => {
    setCargaInicial(true)
    try {
      const lista = await fetchApprovedGasolineRequests()
      setSolicitudes(lista)
    } catch (error) {
      logTravelAxiosError("gasoline-dispersion-load", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudieron cargar las solicitudes aprobadas.",
        "error"
      )
      setSolicitudes([])
    } finally {
      setCargaInicial(false)
    }
  }, [])

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    void recargar()
  }, [recargar])

  const solicitudesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (termino.length === 0) {
      return solicitudes
    }
    return solicitudes.filter((solicitud) => {
      const texto = [
        solicitud.user.name,
        solicitud.plate,
        solicitud.company.name,
        solicitud.area?.name ?? "",
        String(solicitud.id),
      ]
        .join(" ")
        .toLowerCase()
      return texto.includes(termino)
    })
  }, [solicitudes, busqueda])

  const totalPaginas = useMemo(
    () => calcularTotalPaginas(solicitudesFiltradas.length, tamanoPagina),
    [solicitudesFiltradas.length, tamanoPagina]
  )

  const paginaEfectiva = useMemo(
    () => limitarPagina(pagina, totalPaginas),
    [pagina, totalPaginas]
  )

  const solicitudesPagina = useMemo(
    () => rebanarPagina(solicitudesFiltradas, paginaEfectiva, tamanoPagina),
    [solicitudesFiltradas, paginaEfectiva, tamanoPagina]
  )

  useEffect(() => {
    setPagina(1)
  }, [busqueda, tamanoPagina])

  function cerrarModal(): void {
    if (accionCargando !== null) {
      return
    }
    setModalAbierto(null)
    setSolicitudActiva(null)
    setComentario("")
    setAnticipos([])
    setAnticipoSeleccionado("")
  }

  async function abrirDispersion(
    solicitud: GasolineRequestListItem
  ): Promise<void> {
    setSolicitudActiva(solicitud)
    setComentario("")
    setAnticipoSeleccionado("")
    setModalAbierto("dispersar")
    setAnticiposCargando(true)
    try {
      const datos = await fetchGasolineAnticipos(solicitud.companyId)
      setAnticipos(datos.anticipos)
      if (datos.anticipos.length === 1) {
        setAnticipoSeleccionado(String(datos.anticipos[0].docEntry))
      }
    } catch (error) {
      logTravelAxiosError("gasoline-anticipos", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudieron cargar los anticipos SAP.",
        "error"
      )
      setAnticipos([])
    } finally {
      setAnticiposCargando(false)
    }
  }

  function abrirCancelacion(solicitud: GasolineRequestListItem): void {
    setSolicitudActiva(solicitud)
    setComentario("")
    setModalAbierto("cancelar")
  }

  async function confirmarDispersion(): Promise<void> {
    if (solicitudActiva === null) {
      return
    }
    const docEntry = Number(anticipoSeleccionado)
    if (!Number.isFinite(docEntry) || docEntry <= 0) {
      showAppToast("Selecciona un anticipo SAP.", "error")
      return
    }
    setAccionCargando(solicitudActiva.id)
    try {
      const resultado = await disburseGasolineRequest(solicitudActiva.id, {
        disbursedBy: operadorId,
        downPaymentDocEntry: docEntry,
        ...(comentario.trim().length > 0
          ? { comment: comentario.trim() }
          : {}),
      })
      const folioSap =
        resultado.sapDocNum !== undefined
          ? ` (SAP ${String(resultado.sapDocNum)})`
          : ""
      showAppToast(`Dispersión registrada${folioSap}.`, "success")
      cerrarModal()
      await recargar()
    } catch (error) {
      logTravelAxiosError("gasoline-disburse", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudo dispersar la solicitud.",
        "error"
      )
    } finally {
      setAccionCargando(null)
    }
  }

  async function confirmarCancelacion(): Promise<void> {
    if (solicitudActiva === null) {
      return
    }
    if (comentario.trim().length === 0) {
      showAppToast("Indica el motivo de la cancelación.", "error")
      return
    }
    setAccionCargando(solicitudActiva.id)
    try {
      await cancelApprovedGasolineRequest(solicitudActiva.id, {
        cancelledBy: operadorId,
        comment: comentario.trim(),
      })
      showAppToast("Solicitud cancelada.", "success")
      cerrarModal()
      await recargar()
    } catch (error) {
      logTravelAxiosError("gasoline-cancel", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudo cancelar la solicitud.",
        "error"
      )
    } finally {
      setAccionCargando(null)
    }
  }

  return {
    mousePosition,
    solicitudesFiltradas,
    solicitudesPagina,
    cargaInicial,
    busqueda,
    setBusqueda,
    pagina: paginaEfectiva,
    totalPaginas,
    tamanoPagina,
    setTamanoPagina,
    opcionesTamanoPagina: TAMANOS_PAGINA,
    setPagina,
    accionCargando,
    modalAbierto,
    solicitudActiva,
    comentario,
    setComentario,
    anticipos,
    anticiposCargando,
    anticipoSeleccionado,
    setAnticipoSeleccionado,
    abrirDispersion,
    abrirCancelacion,
    cerrarModal,
    confirmarDispersion,
    confirmarCancelacion,
    recargar,
  }
}
