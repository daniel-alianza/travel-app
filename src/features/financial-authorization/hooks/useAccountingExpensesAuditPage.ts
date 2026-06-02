import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"

import type {
  AccountingExpensesAuditCompanyOption,
  AccountingExpensesAuditFiltros,
  AccountingExpensesAuditResumenFiltrado,
  AccountingExpensesAuditSerieDia,
  AccountingExpensesAuditSolicitudRow,
  AccountingExpensesAuditUserOption,
} from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"
import {
  ACCOUNTING_EXPENSES_RECONCILIATION_QUERY_KEY,
  fetchAccountingExpensesReconciliation,
} from "@/features/financial-authorization/services/accounting-expenses-reconciliation-api"
import {
  calcularResumenAuditoria,
  filtrarSolicitudesAuditoria,
  obtenerRangoMesActualDefecto,
  validarRangoFechas,
} from "@/features/financial-authorization/utils/accounting-expenses-audit-filters"
import { construirSerieDiariaDesdeSolicitudes } from "@/features/financial-authorization/utils/accounting-expenses-audit-serie"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

interface UseAccountingExpensesAuditPageReturn {
  mousePosition: TravelRequestMousePosition
  datosListos: boolean
  datosError: string | null
  empresas: readonly AccountingExpensesAuditCompanyOption[]
  usuariosFiltradosPorEmpresa: readonly AccountingExpensesAuditUserOption[]
  filtros: AccountingExpensesAuditFiltros
  setFechaDesde: (value: string) => void
  setFechaHasta: (value: string) => void
  setCompanyId: (value: string) => void
  setUserId: (value: string) => void
  setEstadoSolicitud: (value: string) => void
  restablecerFiltros: () => void
  rangoFechasInvalido: boolean
  resumen: AccountingExpensesAuditResumenFiltrado
  serieDiaria: readonly AccountingExpensesAuditSerieDia[]
  solicitudes: readonly AccountingExpensesAuditSolicitudRow[]
  resumenPorEmpresa: ReadonlyArray<{
    companyId: number
    companyName: string
    resumen: AccountingExpensesAuditResumenFiltrado
  }>
  periodLabel: string | null
}

function filtrosIniciales(): AccountingExpensesAuditFiltros {
  const rango = obtenerRangoMesActualDefecto()
  return {
    ...rango,
    companyId: "all",
    userId: "all",
    estadoSolicitud: "all",
  }
}

function mensajeErrorConsulta(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }
  return "No se pudo cargar la conciliación. Intenta de nuevo."
}

export function useAccountingExpensesAuditPage(): UseAccountingExpensesAuditPageReturn {
  const [mousePosition, setMousePosition] = useState<TravelRequestMousePosition>({
    x: 0,
    y: 0,
  })
  const [filtros, setFiltros] = useState<AccountingExpensesAuditFiltros>(filtrosIniciales)

  const rangoFechasInvalido = !validarRangoFechas(
    filtros.fechaDesde,
    filtros.fechaHasta,
  )

  const reconciliationQuery = useQuery({
    queryKey: [
      ...ACCOUNTING_EXPENSES_RECONCILIATION_QUERY_KEY,
      filtros.fechaDesde,
      filtros.fechaHasta,
    ],
    queryFn: () =>
      fetchAccountingExpensesReconciliation({
        from: filtros.fechaDesde,
        to: filtros.fechaHasta,
      }),
    enabled: !rangoFechasInvalido,
    staleTime: 30_000,
  })

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const solicitudesBase = reconciliationQuery.data?.solicitudes ?? []
  const empresas = reconciliationQuery.data?.companies ?? []
  const usuariosCatalogo = reconciliationQuery.data?.users ?? []

  const usuariosFiltradosPorEmpresa = useMemo(() => {
    if (filtros.companyId === "all") {
      return usuariosCatalogo
    }
    const companyId = Number.parseInt(filtros.companyId, 10)
    return usuariosCatalogo.filter((u) => u.companyId === companyId)
  }, [filtros.companyId, usuariosCatalogo])

  const solicitudes = useMemo(() => {
    if (rangoFechasInvalido) {
      return []
    }
    return filtrarSolicitudesAuditoria(solicitudesBase, filtros)
  }, [filtros, rangoFechasInvalido, solicitudesBase])

  const serieDiaria = useMemo(() => {
    if (rangoFechasInvalido) {
      return []
    }
    return construirSerieDiariaDesdeSolicitudes(
      solicitudes,
      filtros.fechaDesde,
      filtros.fechaHasta,
    )
  }, [filtros.fechaDesde, filtros.fechaHasta, rangoFechasInvalido, solicitudes])

  const resumen = useMemo(() => calcularResumenAuditoria(solicitudes), [solicitudes])

  const resumenPorEmpresa = useMemo(() => {
    const mapa = new Map<
      number,
      { companyId: number; companyName: string; filas: AccountingExpensesAuditSolicitudRow[] }
    >()
    for (const fila of solicitudes) {
      const actual = mapa.get(fila.companyId)
      if (actual === undefined) {
        mapa.set(fila.companyId, {
          companyId: fila.companyId,
          companyName: fila.companyName,
          filas: [fila],
        })
      } else {
        actual.filas.push(fila)
      }
    }
    return [...mapa.values()].map((bloque) => ({
      companyId: bloque.companyId,
      companyName: bloque.companyName,
      resumen: calcularResumenAuditoria(bloque.filas),
    }))
  }, [solicitudes])

  function setFechaDesde(value: string): void {
    setFiltros((prev) => ({ ...prev, fechaDesde: value }))
  }

  function setFechaHasta(value: string): void {
    setFiltros((prev) => ({ ...prev, fechaHasta: value }))
  }

  function setCompanyId(value: string): void {
    setFiltros((prev) => ({
      ...prev,
      companyId: value,
      userId: "all",
    }))
  }

  function setUserId(value: string): void {
    setFiltros((prev) => ({ ...prev, userId: value }))
  }

  function setEstadoSolicitud(value: string): void {
    setFiltros((prev) => ({ ...prev, estadoSolicitud: value }))
  }

  function restablecerFiltros(): void {
    setFiltros(filtrosIniciales())
  }

  const datosListos =
    !rangoFechasInvalido &&
    reconciliationQuery.isSuccess &&
    !reconciliationQuery.isFetching

  return {
    mousePosition,
    datosListos,
    datosError:
      reconciliationQuery.isError && !rangoFechasInvalido
        ? mensajeErrorConsulta(reconciliationQuery.error)
        : null,
    empresas,
    usuariosFiltradosPorEmpresa,
    filtros,
    setFechaDesde,
    setFechaHasta,
    setCompanyId,
    setUserId,
    setEstadoSolicitud,
    restablecerFiltros,
    rangoFechasInvalido,
    resumen,
    serieDiaria,
    solicitudes,
    resumenPorEmpresa,
    periodLabel: reconciliationQuery.data?.periodLabel ?? null,
  }
}
