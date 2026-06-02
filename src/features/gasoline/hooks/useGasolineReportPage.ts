import { useCallback, useEffect, useMemo, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import { useAuthStore } from "@/features/auth/store/authStore"
import {
  fetchGasolineReport,
  fetchGasolineRequestHistory,
  type GasolineReportRow,
  type GasolineRequestListItem,
  type GasolineRequestStatus,
} from "@/features/gasoline/services/gasoline-api"
import {
  fechaIsoSoloDia,
  solicitudCumpleRangoFechas,
} from "@/features/gasoline/utils/gasoline-format"
import type {
  GasolineReportPageModel,
  GasolineReportVista,
} from "@/features/gasoline/interfaces/gasoline-report-page-model.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import {
  calcularTotalPaginas,
  limitarPagina,
  rebanarPagina,
} from "@/lib/list-pagination-helpers"
import { logTravelAxiosError, userMessageFromTravelAxiosError } from "@/lib/travel-api-axios-error"

const TAMANOS_PAGINA = [8, 12, 20] as const

function filaReporteAListItem(fila: GasolineReportRow): GasolineRequestListItem {
  return {
    id: fila.id,
    userId: 0,
    companyId: 0,
    branchId: null,
    areaId: null,
    plate: fila.placa,
    currentMileageKm: fila.kmInicial,
    requestedAmount: fila.monto,
    distanceKm: fila.kmRecorre,
    routeToTake: "",
    applicantComments: null,
    status: fila.estado,
    approverId: null,
    approverComment: null,
    approvedAt: fila.fechaHoraRevision,
    disbursedById: null,
    disbursedComment: null,
    disbursedAt: fila.fechaHoraDispersion,
    createdAt: fila.fechaSolicitud,
    updatedAt: fila.fechaSolicitud,
    user: { id: 0, name: fila.usuario },
    company: { id: 0, name: fila.razonSocial },
    branch: null,
    area: null,
    card: {
      id: 0,
      cardNumberMasked: fila.tarjeta,
      fuelName: null,
      fuelCardKind: null,
    },
    approver:
      fila.reviso !== null
        ? { id: 0, name: fila.reviso }
        : null,
    disbursedBy:
      fila.autorizador !== null
        ? { id: 0, name: fila.autorizador }
        : null,
  }
}

export function useGasolineReportPage(): GasolineReportPageModel {
  const userIdSesion = useAuthStore((state) => state.userId)
  const userId = userIdSesion ?? 1

  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [vista, setVista] = useState<GasolineReportVista>("operativa")
  const [solicitudes, setSolicitudes] = useState<GasolineRequestListItem[]>([])
  const [cargaInicial, setCargaInicial] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState<GasolineRequestStatus | "">(
    ""
  )
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [pagina, setPagina] = useState(1)
  const [tamanoPagina, setTamanoPagina] = useState<number>(12)
  const [exportando, setExportando] = useState(false)

  const recargar = useCallback(async (): Promise<void> => {
    setCargaInicial(true)
    try {
      if (vista === "historial") {
        const historial = await fetchGasolineRequestHistory(userId)
        setSolicitudes(historial)
      } else {
        const filas = await fetchGasolineReport({
          ...(estadoFiltro.length > 0 ? { status: estadoFiltro } : {}),
          ...(fechaDesde.length > 0 ? { startDate: fechaDesde } : {}),
          ...(fechaHasta.length > 0 ? { endDate: fechaHasta } : {}),
        })
        setSolicitudes(filas.map(filaReporteAListItem))
      }
    } catch (error) {
      logTravelAxiosError("gasoline-report-load", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudo cargar el reporte de gasolina.",
        "error"
      )
      setSolicitudes([])
    } finally {
      setCargaInicial(false)
    }
  }, [vista, userId, estadoFiltro, fechaDesde, fechaHasta])

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
    return solicitudes.filter((solicitud) => {
      if (estadoFiltro.length > 0 && solicitud.status !== estadoFiltro) {
        return false
      }
      if (
        !solicitudCumpleRangoFechas(solicitud.createdAt, fechaDesde, fechaHasta)
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
        solicitud.status,
        String(solicitud.id),
      ]
        .join(" ")
        .toLowerCase()
      return texto.includes(termino)
    })
  }, [solicitudes, busqueda, estadoFiltro, fechaDesde, fechaHasta])

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

  const totales = useMemo(() => {
    return solicitudesFiltradas.reduce(
      (acc, solicitud) => {
        acc.monto += solicitud.requestedAmount
        acc.distancia += solicitud.distanceKm
        return acc
      },
      { monto: 0, distancia: 0, cantidad: solicitudesFiltradas.length }
    )
  }, [solicitudesFiltradas])

  useEffect(() => {
    setPagina(1)
  }, [busqueda, estadoFiltro, fechaDesde, fechaHasta, tamanoPagina, vista])

  function limpiarFiltros(): void {
    setBusqueda("")
    setEstadoFiltro("")
    setFechaDesde("")
    setFechaHasta("")
  }

  function exportarCsv(): void {
    if (solicitudesFiltradas.length === 0) {
      showAppToast("No hay registros para exportar.", "info")
      return
    }
    setExportando(true)
    try {
      const encabezados = [
        "ID",
        "Fecha",
        "Estado",
        "Solicitante",
        "Empresa",
        "Placa",
        "Monto",
        "Distancia km",
        "Ruta",
      ]
      const filas = solicitudesFiltradas.map((s) => [
        String(s.id),
        fechaIsoSoloDia(s.createdAt),
        s.status,
        s.user.name,
        s.company.name,
        s.plate,
        String(s.requestedAmount),
        String(s.distanceKm),
        s.routeToTake.replaceAll('"', '""'),
      ])
      const csv = [encabezados, ...filas]
        .map((fila) => fila.map((celda) => `"${celda}"`).join(","))
        .join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const enlace = document.createElement("a")
      enlace.href = url
      enlace.download = `reporte-gasolina-${fechaIsoSoloDia(new Date().toISOString())}.csv`
      enlace.click()
      URL.revokeObjectURL(url)
      showAppToast("Reporte CSV descargado.", "success")
    } finally {
      setExportando(false)
    }
  }

  return {
    mousePosition,
    vista,
    setVista,
    solicitudesFiltradas,
    solicitudesPagina,
    cargaInicial,
    busqueda,
    setBusqueda,
    estadoFiltro,
    setEstadoFiltro,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    pagina: paginaEfectiva,
    totalPaginas,
    tamanoPagina,
    setTamanoPagina,
    opcionesTamanoPagina: TAMANOS_PAGINA,
    setPagina,
    totales,
    limpiarFiltros,
    exportarCsv,
    exportando,
    recargar,
  }
}
