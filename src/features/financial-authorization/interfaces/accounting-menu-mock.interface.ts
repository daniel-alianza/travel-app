export interface AccountingCompanyMock {
  id: number
  nombre: string
}

export interface AccountingMonthKpisMock {
  companyId: number
  etiquetaMes: string
  totalDispersadoMes: number
  totalComprobadoMes: number
  pendienteAutorizarContable: number
  solicitudesAbiertas: number
}

export type AccountingScopeMock =
  | { tipo: "consolidado" }
  | { tipo: "empresa"; companyId: number }
