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
