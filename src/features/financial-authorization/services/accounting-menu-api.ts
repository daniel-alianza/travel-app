import { travelApi } from "@/api/travel-api"

interface ApiEnvelope<T> {
  data: T
  message: string
  error: null
}

export interface AccountingMonthIndicatorsCompanyApi {
  readonly companyId: number
  readonly companyName: string
  readonly totalDispersadoMes: number
  readonly totalComprobadoMes: number
  readonly pendienteAutorizarContable: number
  readonly solicitudesAbiertas: number
}

export interface AccountingMonthIndicatorsApiPayload {
  readonly scope: "consolidated" | "company"
  readonly monthLabel: string
  readonly companies: readonly AccountingMonthIndicatorsCompanyApi[]
  readonly totals: AccountingMonthIndicatorsCompanyApi | null
}

type AccountingMonthIndicatorsApiResponse =
  ApiEnvelope<AccountingMonthIndicatorsApiPayload>

export const ACCOUNTING_MONTH_INDICATORS_QUERY_KEY = [
  "accounting",
  "month-indicators",
] as const

export async function fetchAccountingMonthIndicators(): Promise<AccountingMonthIndicatorsApiPayload> {
  const response = await travelApi.get<AccountingMonthIndicatorsApiResponse>(
    "/travel-checks/accounting/month-indicators",
  )
  return response.data.data
}
