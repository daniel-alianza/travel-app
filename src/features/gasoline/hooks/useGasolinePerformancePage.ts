import { useCallback, useEffect, useMemo, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import { useAuthStore } from "@/features/auth/store/authStore"
import { calcularRendimientoPorPlaca } from "@/features/gasoline/hooks/gasoline-performance-page-helpers"
import type { GasolinePerformancePageModel } from "@/features/gasoline/interfaces/gasoline-performance-page-model.interface"
import {
  fetchGasolineRequestHistory,
  type GasolineRequestListItem,
} from "@/features/gasoline/services/gasoline-api"
import { formatearMonedaMx } from "@/features/gasoline/utils/gasoline-format"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import { logTravelAxiosError, userMessageFromTravelAxiosError } from "@/lib/travel-api-axios-error"

export function useGasolinePerformancePage(): GasolinePerformancePageModel {
  const userIdSesion = useAuthStore((state) => state.userId)
  const userId = userIdSesion ?? 1

  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [solicitudes, setSolicitudes] = useState<GasolineRequestListItem[]>([])
  const [cargaInicial, setCargaInicial] = useState(true)
  const [busqueda, setBusqueda] = useState("")

  const recargar = useCallback(async (): Promise<void> => {
    setCargaInicial(true)
    try {
      const historial = await fetchGasolineRequestHistory(userId)
      setSolicitudes(
        historial.filter(
          (s) => s.status === "dispersed" || s.status === "approved"
        )
      )
    } catch (error) {
      logTravelAxiosError("gasoline-performance-load", error)
      showAppToast(
        userMessageFromTravelAxiosError(error) ||
          "No se pudo cargar el rendimiento de consumo.",
        "error"
      )
      setSolicitudes([])
    } finally {
      setCargaInicial(false)
    }
  }, [userId])

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

  const rendimientoVehiculos = useMemo(
    () => calcularRendimientoPorPlaca(solicitudes),
    [solicitudes]
  )

  const vehiculosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (termino.length === 0) {
      return rendimientoVehiculos
    }
    return rendimientoVehiculos.filter((v) =>
      v.placa.toLowerCase().includes(termino)
    )
  }, [rendimientoVehiculos, busqueda])

  const resumenGlobal = useMemo(() => {
    const monto = vehiculosFiltrados.reduce((acc, v) => acc + v.montoTotal, 0)
    const distancia = vehiculosFiltrados.reduce(
      (acc, v) => acc + v.distanciaTotalKm,
      0
    )
    return {
      vehiculos: vehiculosFiltrados.length,
      monto,
      montoFormateado: formatearMonedaMx(monto),
      distancia,
      costoPromedioKm: distancia > 0 ? monto / distancia : null,
    }
  }, [vehiculosFiltrados])

  return {
    mousePosition,
    vehiculosFiltrados,
    resumenGlobal,
    cargaInicial,
    busqueda,
    setBusqueda,
    recargar,
  }
}
