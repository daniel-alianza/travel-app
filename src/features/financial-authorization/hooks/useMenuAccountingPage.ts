import { useEffect, useMemo, useState } from "react"

import { useAuthStore } from "@/features/auth/store/authStore"
import type {
  AccountingMonthKpisMock,
  AccountingScopeMock,
} from "@/features/financial-authorization/interfaces/accounting-menu-mock.interface"
import {
  EMPRESAS_MOCK_CONTABILIDAD,
  obtenerKpisMesMock,
  obtenerTotalesConsolidadoMock,
} from "@/features/financial-authorization/mocks/accounting-menu-mock"
import { inferirAlcanceContabilidadMock } from "@/features/financial-authorization/utils/infer-accounting-scope-mock"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

interface UseMenuAccountingPageReturn {
  mousePosition: TravelRequestMousePosition
  alcance: AccountingScopeMock
  etiquetaAlcance: string
  kpisTotales: AccountingMonthKpisMock | null
  kpisPorEmpresa: AccountingMonthKpisMock[]
  descripcionAlcance: string
  indicadoresListos: boolean
  modulosListos: boolean
}

export function useMenuAccountingPage(): UseMenuAccountingPageReturn {
  const correoSesion = useAuthStore((state) => state.correoSesion ?? "")
  const [mousePosition, setMousePosition] = useState<TravelRequestMousePosition>(
    { x: 0, y: 0 },
  )
  const [indicadoresListos, setIndicadoresListos] = useState<boolean>(false)
  const [modulosListos, setModulosListos] = useState<boolean>(false)

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const temporizadorIndicadores = window.setTimeout(() => {
      setIndicadoresListos(true)
    }, 560)
    const temporizadorModulos = window.setTimeout(() => {
      setModulosListos(true)
    }, 900)
    return () => {
      window.clearTimeout(temporizadorIndicadores)
      window.clearTimeout(temporizadorModulos)
    }
  }, [])

  const alcance = useMemo(
    () => inferirAlcanceContabilidadMock(correoSesion),
    [correoSesion],
  )

  const kpisPorEmpresa = useMemo(() => {
    if (alcance.tipo === "consolidado") {
      return EMPRESAS_MOCK_CONTABILIDAD.map((e) => obtenerKpisMesMock(e.id))
    }
    return [obtenerKpisMesMock(alcance.companyId)]
  }, [alcance])

  const kpisTotales =
    alcance.tipo === "consolidado" ? obtenerTotalesConsolidadoMock() : null

  const etiquetaAlcance =
    alcance.tipo === "consolidado"
      ? "Vista consolidada"
      : "Vista por empresa"

  const descripcionAlcance =
    alcance.tipo === "consolidado"
      ? "Resumen grupal del mes (todas las empresas). Datos de demostración."
      : "Solo ves la empresa asignada a tu usuario. Datos de demostración."

  return {
    mousePosition,
    alcance,
    etiquetaAlcance,
    kpisTotales,
    kpisPorEmpresa,
    descripcionAlcance,
    indicadoresListos,
    modulosListos,
  }
}
