import { travelApi } from "@/api/travel-api"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

interface ListExpenseDispersedTripsApiResponse {
  data: {
    viajes: ExpenseViajeResumen[]
  }
  message: string
}

interface ListExpenseTripMovementsApiResponse {
  data: {
    movimientos: ExpenseMovimiento[]
  }
  message: string
}

interface RequestReconciliationCodeApiResponse {
  data: {
    reconciliationId: number
    companyName: string
    codeExpiresAt: string
    remainingAttempts: number
  }
  message: string
}

interface VerifyReconciliationCodeApiResponse {
  data: {
    verified: boolean
  }
  message: string
}

export async function fetchExpenseDispersedTrips(
  userId: number
): Promise<ExpenseViajeResumen[]> {
  const response = await travelApi.get<ListExpenseDispersedTripsApiResponse>(
    `/travel-checks/expense-trips/${String(userId)}`
  )
  return response.data.data.viajes
}

export async function fetchExpenseTripMovements(
  userId: number,
  tripId: string
): Promise<ExpenseMovimiento[]> {
  const response = await travelApi.get<ListExpenseTripMovementsApiResponse>(
    `/travel-checks/expense-trips/${String(userId)}/trips/${tripId}/movements`
  )
  return response.data.data.movimientos
}

export async function requestExpenseReconciliationCode(input: {
  tripId: number
}): Promise<{
  reconciliationId: number
  companyName: string
  codeExpiresAt: string
  remainingAttempts: number
}> {
  const response = await travelApi.post<RequestReconciliationCodeApiResponse>(
    "/travel-checks/reconciliations/request-code",
    input
  )
  return response.data.data
}

export async function verifyExpenseReconciliationCode(input: {
  travelRequestId: number
  verificationCode: string
}): Promise<boolean> {
  const response = await travelApi.post<VerifyReconciliationCodeApiResponse>(
    "/travel-checks/reconciliations/verify-code",
    input
  )
  return response.data.data.verified
}
