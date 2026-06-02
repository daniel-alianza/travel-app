import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"

import { useAuthStore } from "@/features/auth/store/authStore"
import { puedeAccederRuta } from "@/features/auth/utils/auth-route-access"
import type {
  AccountingMonthKpis,
  AccountingScope,
} from "@/features/financial-authorization/interfaces/accounting-menu-mock.interface"
import {
  ACCOUNTING_MONTH_INDICATORS_QUERY_KEY,
  fetchAccountingMonthIndicators,
} from "@/features/financial-authorization/services/accounting-menu-api"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

interface UseMenuAccountingPageReturn {
  mousePosition: TravelRequestMousePosition
  alcance: AccountingScope
  etiquetaAlcance: string
  kpisTotales: AccountingMonthKpis | null
  kpisPorEmpresa: AccountingMonthKpis[]
  descripcionAlcance: string
  indicadoresListos: boolean
  indicadoresError: string | null
  modulosListos: boolean
  puedeVerConciliacion: boolean
  puedeVerAutorizacionFinanciera: boolean
  puedeVerResumenGastosComprobados: boolean
}

function mapAlcance(
  scope: "consolidated" | "company",
  companies: readonly { companyId: number }[],
): AccountingScope {
  if (scope === "consolidated") {
    return { tipo: "consolidado" }
  }
  const primera = companies[0]
  return {
    tipo: "empresa",
    companyId: primera?.companyId ?? 0,
  }
}

export function useMenuAccountingPage(): UseMenuAccountingPageReturn {
  const permisosSesion = useAuthStore((state) => state.permisosSesion ?? [])
  const rolSesion = useAuthStore((state) => state.rolSesion ?? "")
  const [mousePosition, setMousePosition] = useState<TravelRequestMousePosition>(
    { x: 0, y: 0 },
  )
  const [modulosListos, setModulosListos] = useState<boolean>(false)

  const indicadoresQuery = useQuery({
    queryKey: ACCOUNTING_MONTH_INDICATORS_QUERY_KEY,
    queryFn: fetchAccountingMonthIndicators,
    staleTime: 30_000,
  })

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const temporizadorModulos = window.setTimeout(() => {
      setModulosListos(true)
    }, 900)
    return () => window.clearTimeout(temporizadorModulos)
  }, [])

  const payload = indicadoresQuery.data

  const alcance = useMemo(
    () =>
      payload !== undefined
        ? mapAlcance(payload.scope, payload.companies)
        : { tipo: "empresa" as const, companyId: 0 },
    [payload],
  )

  const kpisPorEmpresa = useMemo((): AccountingMonthKpis[] => {
    if (payload === undefined) {
      return []
    }
    return payload.companies.map((company) => ({
      companyId: company.companyId,
      companyName: company.companyName,
      etiquetaMes: payload.monthLabel,
      totalDispersadoMes: company.totalDispersadoMes,
      totalComprobadoMes: company.totalComprobadoMes,
      pendienteAutorizarContable: company.pendienteAutorizarContable,
      solicitudesAbiertas: company.solicitudesAbiertas,
    }))
  }, [payload])

  const kpisTotales = useMemo((): AccountingMonthKpis | null => {
    if (payload?.totals === null || payload?.totals === undefined) {
      return null
    }
    const totals = payload.totals
    return {
      companyId: totals.companyId,
      companyName: totals.companyName,
      etiquetaMes: payload.monthLabel,
      totalDispersadoMes: totals.totalDispersadoMes,
      totalComprobadoMes: totals.totalComprobadoMes,
      pendienteAutorizarContable: totals.pendienteAutorizarContable,
      solicitudesAbiertas: totals.solicitudesAbiertas,
    }
  }, [payload])

  const etiquetaAlcance =
    alcance.tipo === "consolidado" ? "Vista consolidada" : "Vista por empresa"

  const descripcionAlcance =
    alcance.tipo === "consolidado"
      ? "Resumen grupal del mes (todas las empresas del grupo)."
      : "Los indicadores corresponden únicamente a la empresa asignada a tu usuario en el sistema."

  const indicadoresError =
    indicadoresQuery.isError
      ? "No se pudieron cargar los indicadores del mes."
      : null

  const puedeVerConciliacion = puedeAccederRuta(
    "/menu-accounting/reconciliation-checks",
    permisosSesion,
    rolSesion,
  )
  const puedeVerAutorizacionFinanciera = puedeAccederRuta(
    "/financial-authorization",
    permisosSesion,
    rolSesion,
  )
  const puedeVerResumenGastosComprobados = puedeAccederRuta(
    "/menu-accounting/expenses-summary",
    permisosSesion,
    rolSesion,
  )

  return {
    mousePosition,
    alcance,
    etiquetaAlcance,
    kpisTotales,
    kpisPorEmpresa,
    descripcionAlcance,
    indicadoresListos: indicadoresQuery.isSuccess || indicadoresQuery.isError,
    indicadoresError,
    modulosListos,
    puedeVerConciliacion,
    puedeVerAutorizacionFinanciera,
    puedeVerResumenGastosComprobados,
  }
}
