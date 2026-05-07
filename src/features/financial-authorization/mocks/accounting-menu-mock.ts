import type {
  AccountingCompanyMock,
  AccountingMonthKpisMock,
} from "@/features/financial-authorization/interfaces/accounting-menu-mock.interface"

export const EMPRESAS_MOCK_CONTABILIDAD: AccountingCompanyMock[] = [
  { id: 1, nombre: "Alianza Eléctrica" },
  { id: 2, nombre: "FG Electrical" },
  { id: 3, nombre: "Tableros y Arrancadores" },
  { id: 4, nombre: "Valmact" },
]

const KPI_SEMILLA_POR_EMPRESA: Record<
  number,
  Pick<
    AccountingMonthKpisMock,
    | "totalDispersadoMes"
    | "totalComprobadoMes"
    | "pendienteAutorizarContable"
    | "solicitudesAbiertas"
  >
> = {
  1: {
    totalDispersadoMes: 428_917.35,
    totalComprobadoMes: 312_450.0,
    pendienteAutorizarContable: 48_230.5,
    solicitudesAbiertas: 12,
  },
  2: {
    totalDispersadoMes: 612_080.2,
    totalComprobadoMes: 589_100.0,
    pendienteAutorizarContable: 22_980.2,
    solicitudesAbiertas: 8,
  },
  3: {
    totalDispersadoMes: 284_350.0,
    totalComprobadoMes: 198_775.45,
    pendienteAutorizarContable: 85_574.55,
    solicitudesAbiertas: 19,
  },
  4: {
    totalDispersadoMes: 501_200.0,
    totalComprobadoMes: 476_320.8,
    pendienteAutorizarContable: 24_879.2,
    solicitudesAbiertas: 6,
  },
}

function etiquetaMesActual(): string {
  return new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(new Date())
}

export function obtenerKpisMesMock(companyId: number): AccountingMonthKpisMock {
  const semilla = KPI_SEMILLA_POR_EMPRESA[companyId] ?? KPI_SEMILLA_POR_EMPRESA[1]
  return {
    companyId,
    etiquetaMes: etiquetaMesActual(),
    ...semilla,
  }
}

export function obtenerNombreEmpresaMock(companyId: number): string {
  const encontrada = EMPRESAS_MOCK_CONTABILIDAD.find((e) => e.id === companyId)
  return encontrada?.nombre ?? "Empresa"
}

export function obtenerTotalesConsolidadoMock(): AccountingMonthKpisMock {
  const filas = EMPRESAS_MOCK_CONTABILIDAD.map((e) => obtenerKpisMesMock(e.id))
  return {
    companyId: 0,
    etiquetaMes: etiquetaMesActual(),
    totalDispersadoMes: filas.reduce((a, f) => a + f.totalDispersadoMes, 0),
    totalComprobadoMes: filas.reduce((a, f) => a + f.totalComprobadoMes, 0),
    pendienteAutorizarContable: filas.reduce(
      (a, f) => a + f.pendienteAutorizarContable,
      0,
    ),
    solicitudesAbiertas: filas.reduce((a, f) => a + f.solicitudesAbiertas, 0),
  }
}
