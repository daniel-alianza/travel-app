import { travelApi } from "@/api/travel-api"

import type {
  AccountingExpensesAuditCompanyOption,
  AccountingExpensesAuditSolicitudRow,
  AccountingExpensesAuditUserOption,
} from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"

interface ApiEnvelope<T> {
  data: T
  message: string
  error: null
}

interface AccountingExpensesReconciliationApiPayload {
  readonly scope: "consolidated" | "company"
  readonly periodLabel: string
  readonly fromIso: string
  readonly toIso: string
  readonly companies: readonly { readonly id: number; readonly nombre: string }[]
  readonly users: readonly {
    readonly id: number
    readonly nombre: string
    readonly correo: string
    readonly companyId: number
  }[]
  readonly solicitudes: readonly AccountingExpensesAuditSolicitudRow[]
}

type AccountingExpensesReconciliationApiResponse =
  ApiEnvelope<AccountingExpensesReconciliationApiPayload>

export const ACCOUNTING_EXPENSES_RECONCILIATION_QUERY_KEY = [
  "accounting",
  "expenses-reconciliation",
] as const

export async function fetchAccountingExpensesReconciliation(input: {
  readonly from: string
  readonly to: string
}): Promise<{
  readonly companies: readonly AccountingExpensesAuditCompanyOption[]
  readonly users: readonly AccountingExpensesAuditUserOption[]
  readonly solicitudes: readonly AccountingExpensesAuditSolicitudRow[]
  readonly periodLabel: string
}> {
  const response = await travelApi.get<AccountingExpensesReconciliationApiResponse>(
    "/travel-checks/accounting/expenses-reconciliation",
    { params: { from: input.from, to: input.to } },
  )
  const payload = response.data.data
  return {
    periodLabel: payload.periodLabel,
    companies: payload.companies.map((company) => ({
      id: company.id,
      nombre: company.nombre,
    })),
    users: payload.users.map((user) => ({
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      companyId: user.companyId,
    })),
    solicitudes: payload.solicitudes.map((solicitud) => ({
      ...solicitud,
      comprobacionesPorDia: solicitud.comprobacionesPorDia ?? [],
    })),
  }
}
