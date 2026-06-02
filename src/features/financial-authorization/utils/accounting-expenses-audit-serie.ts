import type { AccountingExpensesAuditSerieDia } from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"
import type { AccountingExpensesAuditSolicitudRow } from "@/features/financial-authorization/interfaces/accounting-expenses-audit.interface"

function enumerarDiasIso(fechaDesde: string, fechaHasta: string): string[] {
  const dias: string[] = []
  let actual = fechaDesde
  while (actual <= fechaHasta) {
    dias.push(actual)
    const [yearText, monthText, dayText] = actual.split("-")
    const siguiente = new Date(
      Date.UTC(
        Number(yearText),
        Number(monthText) - 1,
        Number(dayText) + 1,
        12,
        0,
        0,
      ),
    )
    const year = siguiente.getUTCFullYear()
    const month = String(siguiente.getUTCMonth() + 1).padStart(2, "0")
    const day = String(siguiente.getUTCDate()).padStart(2, "0")
    actual = `${year}-${month}-${day}`
  }
  return dias
}

function etiquetaDiaCorta(fechaIso: string): string {
  const day = Number.parseInt(fechaIso.slice(8, 10), 10)
  const monthIndex = Number.parseInt(fechaIso.slice(5, 7), 10) - 1
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ]
  return `${day} ${meses[monthIndex] ?? ""}`
}

export function construirSerieDiariaDesdeSolicitudes(
  filas: readonly AccountingExpensesAuditSolicitudRow[],
  fechaDesde: string,
  fechaHasta: string,
): AccountingExpensesAuditSerieDia[] {
  const mapaSolicitado = new Map<string, number>()
  const mapaComprobado = new Map<string, number>()

  for (const fila of filas) {
    const diaDispersion = fila.dispersedAt.slice(0, 10)
    mapaSolicitado.set(
      diaDispersion,
      (mapaSolicitado.get(diaDispersion) ?? 0) + fila.totalSolicitado,
    )
    for (const punto of fila.comprobacionesPorDia) {
      mapaComprobado.set(
        punto.fechaIso,
        (mapaComprobado.get(punto.fechaIso) ?? 0) + punto.monto,
      )
    }
  }

  return enumerarDiasIso(fechaDesde, fechaHasta).map((fechaIso) => ({
    fechaIso,
    etiqueta: etiquetaDiaCorta(fechaIso),
    solicitado: mapaSolicitado.get(fechaIso) ?? 0,
    comprobado: mapaComprobado.get(fechaIso) ?? 0,
  }))
}
