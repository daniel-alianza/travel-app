import type { GasolineRequestStatus } from "@/features/gasoline/services/gasoline-api"

export function formatearMonedaMx(monto: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(monto)
}

export function formatearFechaGasolina(valor: string | null): string {
  if (valor === null || valor.trim().length === 0) {
    return "—"
  }
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) {
    return valor.slice(0, 10)
  }
  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function etiquetaEstadoGasolina(estado: GasolineRequestStatus): string {
  switch (estado) {
    case "pending":
      return "Pendiente"
    case "approved":
      return "Aprobada"
    case "rejected":
      return "Rechazada"
    case "dispersed":
      return "Dispersada"
    default:
      return estado
  }
}

export function claseBadgeEstadoGasolina(
  estado: GasolineRequestStatus
): string {
  switch (estado) {
    case "pending":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300"
    case "approved":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
    case "rejected":
      return "bg-rose-500/15 text-rose-700 dark:text-rose-300"
    case "dispersed":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function fechaIsoSoloDia(valor: string): string {
  return valor.slice(0, 10)
}

export function solicitudCumpleRangoFechas(
  fechaIso: string,
  desde: string,
  hasta: string
): boolean {
  const dia = fechaIsoSoloDia(fechaIso)
  if (desde.trim().length > 0 && dia < desde) {
    return false
  }
  if (hasta.trim().length > 0 && dia > hasta) {
    return false
  }
  return true
}
