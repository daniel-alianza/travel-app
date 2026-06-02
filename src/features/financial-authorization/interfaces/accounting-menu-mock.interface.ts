export interface AccountingCompanyMock {
  id: number
  nombre: string
}

export interface AccountingMonthKpis {
  companyId: number
  companyName: string
  etiquetaMes: string
  totalDispersadoMes: number
  totalComprobadoMes: number
  pendienteAutorizarContable: number
  solicitudesAbiertas: number
}

export type AccountingScope =
  | { tipo: "consolidado" }
  | { tipo: "empresa"; companyId: number }

/** @deprecated Usar AccountingMonthKpis */
export type AccountingMonthKpisMock = AccountingMonthKpis

/** @deprecated Usar AccountingScope */
export type AccountingScopeMock = AccountingScope
