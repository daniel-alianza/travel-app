export type AccountingExpensesAuditEstadoSolicitud =
  | "sin_comprobacion"
  | "parcial"
  | "completa"
  | "excedente"

export interface AccountingExpensesAuditCompanyOption {
  readonly id: number
  readonly nombre: string
}

export interface AccountingExpensesAuditUserOption {
  readonly id: number
  readonly nombre: string
  readonly correo: string
  readonly companyId: number
}

export interface AccountingExpensesAuditComprobacionDia {
  readonly fechaIso: string
  readonly monto: number
}

export interface AccountingExpensesAuditSolicitudRow {
  readonly solicitudId: number
  readonly folio: string
  readonly companyId: number
  readonly companyName: string
  readonly userId: number
  readonly employeeName: string
  readonly employeeEmail: string
  readonly dispersedAt: string
  readonly ultimaComprobacionAt: string | null
  readonly totalSolicitado: number
  readonly totalComprobado: number
  readonly pendientePorComprobar: number
  readonly pendienteAutorizarContable: number
  readonly porcentajeComprobado: number
  readonly movimientosComprobados: number
  readonly movimientosPendientes: number
  readonly estado: AccountingExpensesAuditEstadoSolicitud
  readonly comprobacionesPorDia: readonly AccountingExpensesAuditComprobacionDia[]
}

export interface AccountingExpensesAuditSerieDia {
  readonly fechaIso: string
  readonly etiqueta: string
  readonly solicitado: number
  readonly comprobado: number
}

export interface AccountingExpensesAuditResumenFiltrado {
  readonly totalSolicitado: number
  readonly totalComprobado: number
  readonly pendientePorComprobar: number
  readonly pendienteAutorizarContable: number
  readonly porcentajeComprobado: number
  readonly totalSolicitudes: number
  readonly usuariosUnicos: number
}

export interface AccountingExpensesAuditFiltros {
  readonly fechaDesde: string
  readonly fechaHasta: string
  readonly companyId: string
  readonly userId: string
  readonly estadoSolicitud: string
}
