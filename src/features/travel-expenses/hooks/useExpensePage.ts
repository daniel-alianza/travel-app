import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"

import { EXPENSE_SEED_VIAJES } from "@/features/travel-expenses/data/expense-page-seed"
import {
  construirResumenMesVista,
  obtenerIdViajeInicial,
  particionarViajesActivosYFinalizados,
  type ExpenseResumenMesVista,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import { fetchMovimientosPorViajeId } from "@/features/travel-expenses/services/expense-movimientos-service"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

interface UseExpensePageReturn {
  mounted: boolean
  mousePosition: TravelRequestMousePosition
  resumenMes: ExpenseResumenMesVista
  viajesActivos: ExpenseViajeResumen[]
  viajesFinalizados: ExpenseViajeResumen[]
  historialViajesVisible: boolean
  setHistorialViajesVisible: (visible: boolean) => void
  viajeSeleccionado: ExpenseViajeResumen | null
  idViajeSeleccionado: string
  setIdViajeSeleccionado: (id: string) => void
  movimientosDelViaje: ExpenseMovimiento[]
  movimientosCargando: boolean
  movimientosError: boolean
  movimientosErrorMensaje: string | null
  reintentarMovimientos: () => void
  panelMovimientosAbierto: boolean
  setPanelMovimientosAbierto: (abierto: boolean) => void
}

export function useExpensePage(): UseExpensePageReturn {
  const mounted = true
  const [mousePosition, setMousePosition] = useState<TravelRequestMousePosition>(
    { x: 0, y: 0 }
  )
  const [idViajeSeleccionado, setIdViajeSeleccionado] = useState<string>(() =>
    obtenerIdViajeInicial(EXPENSE_SEED_VIAJES)
  )
  const [panelMovimientosAbierto, setPanelMovimientosAbierto] =
    useState<boolean>(true)
  const [historialViajesVisible, setHistorialViajesVisible] =
    useState<boolean>(false)

  const { activos: viajesActivos, finalizados: viajesFinalizados } = useMemo(
    () => particionarViajesActivosYFinalizados(EXPENSE_SEED_VIAJES),
    []
  )

  const resumenMes = useMemo(
    () => construirResumenMesVista(viajesActivos),
    [viajesActivos]
  )

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const viajeSeleccionado = useMemo((): ExpenseViajeResumen | null => {
    const encontrado = EXPENSE_SEED_VIAJES.find((v) => v.id === idViajeSeleccionado)
    return encontrado ?? null
  }, [idViajeSeleccionado])

  const movimientosQuery = useQuery({
    queryKey: ["travel-expenses", "movimientos", idViajeSeleccionado],
    queryFn: () => fetchMovimientosPorViajeId(idViajeSeleccionado),
    enabled: idViajeSeleccionado.length > 0,
    staleTime: 30_000,
  })

  const movimientosDelViaje = movimientosQuery.data ?? []
  const movimientosCargando = movimientosQuery.isFetching
  const movimientosError = movimientosQuery.isError
  const movimientosErrorMensaje =
    movimientosQuery.error instanceof Error
      ? movimientosQuery.error.message
      : movimientosQuery.error !== null
        ? "No se pudieron cargar los movimientos."
        : null

  function reintentarMovimientos(): void {
    void movimientosQuery.refetch()
  }

  return {
    mounted,
    mousePosition,
    resumenMes,
    viajesActivos,
    viajesFinalizados,
    historialViajesVisible,
    setHistorialViajesVisible,
    viajeSeleccionado,
    idViajeSeleccionado,
    setIdViajeSeleccionado,
    movimientosDelViaje,
    movimientosCargando,
    movimientosError,
    movimientosErrorMensaje,
    reintentarMovimientos,
    panelMovimientosAbierto,
    setPanelMovimientosAbierto,
  }
}
