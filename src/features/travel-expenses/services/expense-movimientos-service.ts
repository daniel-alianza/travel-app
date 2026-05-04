import {
  EXPENSE_SEED_MOVIMIENTOS,
  EXPENSE_SEED_VIAJES,
} from "@/features/travel-expenses/data/expense-page-seed"
import { filtrarMovimientosPorRangoViaje } from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"

const DEMORA_SIMULADA_MS = 700

function demora(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function fetchMovimientosPorViajeId(
  viajeId: string
): Promise<ExpenseMovimiento[]> {
  await demora(DEMORA_SIMULADA_MS)
  const viaje = EXPENSE_SEED_VIAJES.find((v) => v.id === viajeId)
  if (!viaje) {
    return []
  }
  const filtrados = filtrarMovimientosPorRangoViaje(
    EXPENSE_SEED_MOVIMIENTOS,
    viaje
  )
  return [...filtrados].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )
}
