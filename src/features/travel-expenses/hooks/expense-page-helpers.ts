import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

export function formatearRangoFechasViaje(
  fechaSalida: string,
  fechaRegreso: string
): string {
  const inicio = formatearFechaLarga(fechaSalida)
  const fin = formatearFechaLarga(fechaRegreso)
  return `${inicio} — ${fin}`
}

export function formatearFechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return iso
  }
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d))
}

export function formatearFechaCorta(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return iso
  }
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d))
}

export function formatearMonedaViatico(valor: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

export function viajeEsActivo(
  viaje: ExpenseViajeResumen,
  referencia: Date = new Date()
): boolean {
  const [y, m, d] = viaje.fechaRegreso.split("-").map(Number)
  if (!y || !m || !d) {
    return false
  }
  const finViaje = new Date(y, m - 1, d)
  finViaje.setHours(0, 0, 0, 0)
  const hoy = new Date(referencia)
  hoy.setHours(0, 0, 0, 0)
  return finViaje.getTime() >= hoy.getTime()
}

export function particionarViajesActivosYFinalizados(
  viajes: ExpenseViajeResumen[],
  referencia: Date = new Date()
): { activos: ExpenseViajeResumen[]; finalizados: ExpenseViajeResumen[] } {
  const activos: ExpenseViajeResumen[] = []
  const finalizados: ExpenseViajeResumen[] = []
  for (const viaje of viajes) {
    if (viajeEsActivo(viaje, referencia)) {
      activos.push(viaje)
    } else {
      finalizados.push(viaje)
    }
  }
  function compararPorSalida(
    a: ExpenseViajeResumen,
    b: ExpenseViajeResumen
  ): number {
    return a.fechaSalida.localeCompare(b.fechaSalida)
  }
  activos.sort(compararPorSalida)
  finalizados.sort(compararPorSalida)
  return { activos, finalizados }
}

export function obtenerIdViajeInicial(
  viajes: ExpenseViajeResumen[],
  referencia: Date = new Date()
): string {
  const { activos, finalizados } = particionarViajesActivosYFinalizados(
    viajes,
    referencia
  )
  return activos[0]?.id ?? finalizados[0]?.id ?? ""
}

export interface ExpenseResumenMesVista {
  etiquetaMesTitulo: string
  cantidadViajesActivos: number
  totalAutorizadoActivos: number
  diasRestantesDelMes: number
}

export function construirResumenMesVista(
  viajesActivos: ExpenseViajeResumen[],
  referencia: Date = new Date()
): ExpenseResumenMesVista {
  const etiqueta = new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(referencia)
  const etiquetaMesTitulo = etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1)

  const y = referencia.getFullYear()
  const m = referencia.getMonth()
  const ultimoDiaMes = new Date(y, m + 1, 0)
  ultimoDiaMes.setHours(0, 0, 0, 0)
  const inicioHoy = new Date(referencia)
  inicioHoy.setHours(0, 0, 0, 0)
  const diffDias = Math.round(
    (ultimoDiaMes.getTime() - inicioHoy.getTime()) / 86_400_000
  )
  const diasRestantesDelMes = diffDias + 1

  const cantidadViajesActivos = viajesActivos.length
  const totalAutorizadoActivos = viajesActivos.reduce(
    (acc, viaje) => acc + viaje.montoSolicitado,
    0
  )

  return {
    etiquetaMesTitulo,
    cantidadViajesActivos,
    totalAutorizadoActivos,
    diasRestantesDelMes,
  }
}

export function textoDiasRestantes(viaje: ExpenseViajeResumen): string {
  const restantes = calcularDiasRestantesHasta(viaje.fechaRegreso)
  if (restantes < 0) {
    return "Viaje finalizado"
  }
  if (restantes === 0) {
    return "Último día"
  }
  return `${restantes} día${restantes === 1 ? "" : "s"} restantes`
}

export function totalGastosMovimientos(movimientos: ExpenseMovimiento[]): number {
  return movimientos.reduce((acc, mov) => acc + mov.gasto, 0)
}

export function calcularDiasRestantesHasta(fechaRegresoIso: string): number {
  const [y, m, d] = fechaRegresoIso.split("-").map(Number)
  if (!y || !m || !d) {
    return 0
  }
  const fin = new Date(y, m - 1, d)
  fin.setHours(0, 0, 0, 0)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.ceil((fin.getTime() - hoy.getTime()) / 86_400_000)
}

export function filtrarMovimientosPorRangoViaje(
  movimientos: ExpenseMovimiento[],
  viaje: ExpenseViajeResumen
): ExpenseMovimiento[] {
  const inicio = inicioDiaTimestamp(viaje.fechaSalida)
  const fin = finDiaTimestamp(viaje.fechaRegreso)
  return movimientos.filter((mov) => {
    const t = medioDiaTimestamp(mov.fecha)
    return t >= inicio && t <= fin
  })
}

function medioDiaTimestamp(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return 0
  }
  return new Date(y, m - 1, d, 12, 0, 0, 0).getTime()
}

function inicioDiaTimestamp(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return 0
  }
  return new Date(y, m - 1, d, 0, 0, 0, 0).getTime()
}

function finDiaTimestamp(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return 0
  }
  return new Date(y, m - 1, d, 23, 59, 59, 999).getTime()
}
