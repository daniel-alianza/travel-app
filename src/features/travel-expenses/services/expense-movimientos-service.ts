import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import { fetchExpenseTripMovements } from "@/features/travel-expenses/services/travel-expenses-api"

export async function fetchMovimientosPorViajeId(
  userId: number,
  viajeId: string
): Promise<ExpenseMovimiento[]> {
  return fetchExpenseTripMovements(userId, viajeId)
}
