import type {
  AccountingExpensesAuditFiltros,
  AccountingExpensesAuditResumenFiltrado,
  AccountingExpensesAuditSolicitudRow,
} from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"

function parseIsoDay(value: string): Date | null {
  const trimmed = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null
  }
  const date = new Date(`${trimmed}T12:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

function inRangeInclusive(instantIso: string, desde: string, hasta: string): boolean {
  const day = instantIso.slice(0, 10)
  return day >= desde && day <= hasta
}

export function filtrarSolicitudesAuditoria(
  filas: readonly AccountingExpensesAuditSolicitudRow[],
  filtros: AccountingExpensesAuditFiltros,
): AccountingExpensesAuditSolicitudRow[] {
  return filas.filter((fila) => {
    if (!inRangeInclusive(fila.dispersedAt, filtros.fechaDesde, filtros.fechaHasta)) {
      return false
    }
    if (filtros.companyId !== "all" && String(fila.companyId) !== filtros.companyId) {
      return false
    }
    if (filtros.userId !== "all" && String(fila.userId) !== filtros.userId) {
      return false
    }
    if (filtros.estadoSolicitud !== "all" && fila.estado !== filtros.estadoSolicitud) {
      return false
    }
    return true
  })
}

export function calcularResumenAuditoria(
  filas: readonly AccountingExpensesAuditSolicitudRow[],
): AccountingExpensesAuditResumenFiltrado {
  const totalSolicitado = filas.reduce((acc, f) => acc + f.totalSolicitado, 0)
  const totalComprobado = filas.reduce((acc, f) => acc + f.totalComprobado, 0)
  const pendientePorComprobar = filas.reduce((acc, f) => acc + f.pendientePorComprobar, 0)
  const pendienteAutorizarContable = filas.reduce(
    (acc, f) => acc + f.pendienteAutorizarContable,
    0,
  )
  const porcentajeComprobado =
    totalSolicitado > 0
      ? Math.min(100, (totalComprobado / totalSolicitado) * 100)
      : totalComprobado > 0
        ? 100
        : 0
  const usuariosUnicos = new Set(filas.map((f) => f.userId)).size

  return {
    totalSolicitado,
    totalComprobado,
    pendientePorComprobar,
    pendienteAutorizarContable,
    porcentajeComprobado,
    totalSolicitudes: filas.length,
    usuariosUnicos,
  }
}

export function obtenerRangoMesActualDefecto(): {
  fechaDesde: string
  fechaHasta: string
} {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const monthIndex = hoy.getMonth()
  const month = String(monthIndex + 1).padStart(2, "0")
  const ultimoDiaMes = new Date(year, monthIndex + 1, 0).getDate()
  return {
    fechaDesde: `${year}-${month}-01`,
    fechaHasta: `${year}-${month}-${String(ultimoDiaMes).padStart(2, "0")}`,
  }
}

export function validarRangoFechas(desde: string, hasta: string): boolean {
  const d = parseIsoDay(desde)
  const h = parseIsoDay(hasta)
  if (d === null || h === null) {
    return false
  }
  return desde <= hasta
}
