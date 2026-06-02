import { useCallback, useEffect, useMemo, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import { useAuthStore } from "@/features/auth/store/authStore"
import {
  approveGasolineRequest,
  fetchGasolineApprovalContext,
  fetchPendingGasolineRequests,
  rejectGasolineRequest,
  type GasolineRequestListItem,
} from "@/features/gasoline/services/gasoline-api"
import { esRolJefeGasolina } from "@/features/gasoline/utils/gasoline-approval-policy"
import type {
  GasolineAuthorizationsModalResolucion,
  GasolineAuthorizationsPageModel,
} from "@/features/gasoline/interfaces/gasoline-authorizations-page-model.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import {
  calcularTotalPaginas,
  limitarPagina,
  rebanarPagina,
} from "@/lib/list-pagination-helpers"
import { logTravelAxiosError, userMessageFromTravelAxiosError } from "@/lib/travel-api-axios-error"

const TAMANOS_PAGINA = [4, 8, 12] as const

export function useGasolineAuthorizationsPage(): GasolineAuthorizationsPageModel {
  const userIdSesion = useAuthStore((state) => state.userId)
  const roleIdSesion = useAuthStore((state) => state.roleId)
  const approverId = userIdSesion ?? 1
  const [esTesoreria, setEsTesoreria] = useState(false)
  const rechazoRequiereComentario = esTesoreria

  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [solicitudes, setSolicitudes] = useState<GasolineRequestListItem[]>([])
  const [cargaInicial, setCargaInicial] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [empresaFiltro, setEmpresaFiltro] = useState("")
  const [pagina, setPagina] = useState(1)
  const [tamanoPagina, setTamanoPagina] = useState<number>(8)
  const [accionCargando, setAccionCargando] = useState<number | null>(null)
  const [modalResolucion, setModalResolucion] =
    useState<GasolineAuthorizationsModalResolucion>(null)
  const [solicitudActiva, setSolicitudActiva] =
    useState<GasolineRequestListItem | null>(null)
  const [comentarioResolucion, setComentarioResolucion] = useState("")

  const recargar = useCallback(async (): Promise<void> => {
    setCargaInicial(true)
    try {
      const lista = await fetchPendingGasolineRequests(
        esTesoreria
          ? undefined
          : esRolJefeGasolina(roleIdSesion)
            ? { roleId: roleIdSesion ?? undefined, managerUserId: approverId }
            : undefined
      )
      setSolicitudes(lista)
    } catch (error) {
      logTravelAxiosError("gasoline-authorizations-load", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudieron cargar las solicitudes pendientes.",
        "error"
      )
      setSolicitudes([])
    } finally {
      setCargaInicial(false)
    }
  }, [approverId, esTesoreria, roleIdSesion])

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

  useEffect(() => {
    let activo = true
    void (async (): Promise<void> => {
      try {
        const contexto = await fetchGasolineApprovalContext()
        if (activo) {
          setEsTesoreria(contexto.isTreasuryApprover)
        }
      } catch {
        if (activo) {
          setEsTesoreria(false)
        }
      }
    })()
    return () => {
      activo = false
    }
  }, [])

  const opcionesEmpresa = useMemo(() => {
    const empresas = new Set<string>()
    solicitudes.forEach((solicitud) => {
      empresas.add(solicitud.company.name)
    })
    return Array.from(empresas).sort((a, b) => a.localeCompare(b, "es-MX"))
  }, [solicitudes])

  const solicitudesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return solicitudes.filter((solicitud) => {
      if (
        empresaFiltro.length > 0 &&
        solicitud.company.name !== empresaFiltro
      ) {
        return false
      }
      if (termino.length === 0) {
        return true
      }
      const texto = [
        solicitud.user.name,
        solicitud.plate,
        solicitud.company.name,
        solicitud.area?.name ?? "",
        solicitud.routeToTake,
        String(solicitud.id),
      ]
        .join(" ")
        .toLowerCase()
      return texto.includes(termino)
    })
  }, [solicitudes, busqueda, empresaFiltro])

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
  }, [busqueda, empresaFiltro, tamanoPagina])

  function abrirRechazo(solicitud: GasolineRequestListItem): void {
    setSolicitudActiva(solicitud)
    setComentarioResolucion("")
    setModalResolucion("rechazar")
  }

  function cerrarModal(): void {
    if (accionCargando !== null) {
      return
    }
    setModalResolucion(null)
    setSolicitudActiva(null)
    setComentarioResolucion("")
  }

  async function aprobarSolicitud(solicitud: GasolineRequestListItem): Promise<void> {
    setAccionCargando(solicitud.id)
    try {
      await approveGasolineRequest(solicitud.id, { approverId })
      showAppToast("Solicitud aprobada correctamente.", "success")
      await recargar()
    } catch (error) {
      logTravelAxiosError("gasoline-approve", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudo aprobar la solicitud.",
        "error"
      )
    } finally {
      setAccionCargando(null)
    }
  }

  async function confirmarRechazo(): Promise<void> {
    if (solicitudActiva === null) {
      return
    }
    if (
      rechazoRequiereComentario &&
      comentarioResolucion.trim().length === 0
    ) {
      showAppToast("Indica el motivo del rechazo (obligatorio en tesorería).", "error")
      return
    }
    setAccionCargando(solicitudActiva.id)
    try {
      await rejectGasolineRequest(solicitudActiva.id, {
        approverId,
        ...(comentarioResolucion.trim().length > 0
          ? { comment: comentarioResolucion.trim() }
          : {}),
      })
      showAppToast("Solicitud rechazada.", "success")
      cerrarModal()
      await recargar()
    } catch (error) {
      logTravelAxiosError("gasoline-reject", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudo rechazar la solicitud.",
        "error"
      )
    } finally {
      setAccionCargando(null)
    }
  }

  return {
    mousePosition,
    solicitudes,
    solicitudesFiltradas,
    solicitudesPagina,
    cargaInicial,
    busqueda,
    setBusqueda,
    empresaFiltro,
    setEmpresaFiltro,
    opcionesEmpresa,
    pagina: paginaEfectiva,
    totalPaginas,
    tamanoPagina,
    setTamanoPagina,
    opcionesTamanoPagina: TAMANOS_PAGINA,
    setPagina,
    accionCargando,
    modalResolucion,
    solicitudActiva,
    comentarioResolucion,
    setComentarioResolucion,
    abrirRechazo,
    cerrarModal,
    aprobarSolicitud,
    confirmarRechazo,
    recargar,
    rechazoRequiereComentario,
  }
}
