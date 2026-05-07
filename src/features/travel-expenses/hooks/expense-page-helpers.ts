import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

const HORA_ENTRADA = 8
const MINUTO_ENTRADA = 30
const HORA_SALIDA_LUNES_VIERNES = 18
const MINUTO_SALIDA_LUNES_VIERNES = 30
const HORA_SALIDA_SABADO = 12
const MINUTO_SALIDA_SABADO = 30
const MILISEGUNDOS_POR_HORA = 3_600_000

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

export function totalGastosMovimientos(
  movimientos: ExpenseMovimiento[]
): number {
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

export function filtrarViajesMesActualYAnterior(
  viajes: ExpenseViajeResumen[],
  referencia: Date = new Date()
): ExpenseViajeResumen[] {
  return filtrarViajesPorMesesAnteriores(viajes, 1, referencia)
}

export function filtrarViajesPorMesesAnteriores(
  viajes: ExpenseViajeResumen[],
  mesesAtras: number,
  referencia: Date = new Date()
): ExpenseViajeResumen[] {
  const llavesPermitidas = new Set<string>()
  for (let i = 0; i <= mesesAtras; i += 1) {
    const fecha = new Date(
      referencia.getFullYear(),
      referencia.getMonth() - i,
      1
    )
    llavesPermitidas.add(`${fecha.getFullYear()}-${fecha.getMonth()}`)
  }

  return viajes.filter((viaje) => {
    const fechaSalida = parseFechaIso(viaje.fechaSalida)
    if (fechaSalida === null) {
      return false
    }
    const llave = `${fechaSalida.getFullYear()}-${fechaSalida.getMonth()}`
    return llavesPermitidas.has(llave)
  })
}

export function esDiaHabil(fecha: Date): boolean {
  const dia = fecha.getDay()
  return dia >= 1 && dia <= 6
}

export function esHorarioLaboral(fecha: Date): boolean {
  const inicio = new Date(fecha)
  inicio.setHours(HORA_ENTRADA, MINUTO_ENTRADA, 0, 0)
  const fin = finJornada(fecha)
  return fecha.getTime() >= inicio.getTime() && fecha.getTime() < fin.getTime()
}

export function estaEnHorarioHabil(fecha: Date): boolean {
  return esDiaHabil(fecha) && esHorarioLaboral(fecha)
}

export function calcularLimiteComprobacionMesAnterior(
  referencia: Date = new Date()
): Date {
  const inicioMesActual = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    1,
    HORA_ENTRADA,
    MINUTO_ENTRADA,
    0,
    0
  )
  return sumarDiasHabiles(inicioMesActual, 7)
}

export function puedeComprobarMesAnterior(
  referencia: Date = new Date()
): boolean {
  const limite = calcularLimiteComprobacionMesAnterior(referencia)
  return (
    referencia.getTime() <= limite.getTime() && estaEnHorarioHabil(referencia)
  )
}

export function viajeEsDelMesAnteriorAlActual(
  viaje: ExpenseViajeResumen,
  referencia: Date = new Date()
): boolean {
  const salida = parseFechaIso(viaje.fechaSalida)
  if (salida === null) {
    return false
  }
  const mesRef = referencia.getMonth()
  const anioRef = referencia.getFullYear()
  const mesAnterior = mesRef === 0 ? 11 : mesRef - 1
  const anioMesAnterior = mesRef === 0 ? anioRef - 1 : anioRef
  return (
    salida.getMonth() === mesAnterior &&
    salida.getFullYear() === anioMesAnterior
  )
}

export function ventanaComprobacionMesAnteriorSigueAbierta(
  referencia: Date = new Date()
): boolean {
  const limite = calcularLimiteComprobacionMesAnterior(referencia)
  return referencia.getTime() <= limite.getTime()
}

export function contarDiasHabilesInclusive(inicio: Date, fin: Date): number {
  const cursor = new Date(
    inicio.getFullYear(),
    inicio.getMonth(),
    inicio.getDate()
  )
  const finNorm = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate())
  let total = 0
  while (cursor.getTime() <= finNorm.getTime()) {
    if (esDiaHabil(cursor)) {
      total += 1
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return total
}

export function obtenerMensajeVentanaComprobacionMesAnterior(
  viaje: ExpenseViajeResumen,
  tienePendientes: boolean,
  referencia: Date = new Date()
): string | null {
  if (!tienePendientes || !viajeEsDelMesAnteriorAlActual(viaje, referencia)) {
    return null
  }
  if (!ventanaComprobacionMesAnteriorSigueAbierta(referencia)) {
    return null
  }
  const limite = calcularLimiteComprobacionMesAnterior(referencia)
  const hoy = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate()
  )
  const diaLimite = new Date(
    limite.getFullYear(),
    limite.getMonth(),
    limite.getDate()
  )
  const diasHabilesRestantes = contarDiasHabilesInclusive(hoy, diaLimite)
  const etiquetaLimite = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(limite)
  const mesViajeEtiqueta = new Intl.DateTimeFormat("es-MX", {
    month: "long",
  }).format(parseFechaIso(viaje.fechaSalida) ?? referencia)
  const mesCapitalizado =
    mesViajeEtiqueta.charAt(0).toUpperCase() + mesViajeEtiqueta.slice(1)
  const diasTexto =
    diasHabilesRestantes === 1
      ? "Queda 1 día hábil"
      : `Quedan ${String(diasHabilesRestantes)} días hábiles`
  return `${diasTexto} para enviar comprobaciones pendientes de ${mesCapitalizado}, siempre conforme a tu horario laboral. El plazo termina el ${etiquetaLimite}. Cuando cierre, podrás continuar el proceso con contabilidad.`
}

export function obtenerTextoPlazoComprobacionTarjeta(
  viaje: ExpenseViajeResumen,
  viajesReferencia: ExpenseViajeResumen[],
  tienePendientes: boolean,
  referencia: Date = new Date()
): string | null {
  if (!tienePendientes) {
    return null
  }
  const estadoVigencia = obtenerEstadoVigenciaSolicitud(
    viaje,
    viajesReferencia,
    referencia
  )
  if (estadoVigencia === "normal") {
    return null
  }
  if (estadoVigencia === "warning") {
    return "Solicitud por vencer: queda 1 día para comprobar"
  }
  if (estadoVigencia === "danger") {
    return "Último día para comprobar antes de requerir conciliación"
  }
  return "Solicitud vencida: requiere conciliación con contabilidad"
}

export function obtenerColorPlazoComprobacionTarjeta(
  viaje: ExpenseViajeResumen,
  viajesReferencia: ExpenseViajeResumen[],
  tienePendientes: boolean,
  referencia: Date = new Date()
): "neutral" | "warning" | "danger" {
  if (!tienePendientes) {
    return "neutral"
  }
  const estado = obtenerEstadoVigenciaSolicitud(
    viaje,
    viajesReferencia,
    referencia
  )
  if (estado === "warning") {
    return "warning"
  }
  if (estado === "danger" || estado === "expired") {
    return "danger"
  }
  return "neutral"
}

export function obtenerEstadoVigenciaSolicitud(
  viaje: ExpenseViajeResumen,
  viajesReferencia: ExpenseViajeResumen[],
  referencia: Date = new Date()
): "normal" | "warning" | "danger" | "expired" {
  const limite = calcularLimiteSolicitud(viaje, viajesReferencia)
  const hoy = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate(),
    0,
    0,
    0,
    0
  )
  const finDiaLimite = new Date(
    limite.getFullYear(),
    limite.getMonth(),
    limite.getDate(),
    23,
    59,
    59,
    999
  )
  if (hoy.getTime() > finDiaLimite.getTime()) {
    return "expired"
  }
  const diffDias = Math.ceil(
    (finDiaLimite.getTime() - hoy.getTime()) / 86_400_000
  )
  if (diffDias <= 0) {
    return "danger"
  }
  if (diffDias <= 1) {
    return "warning"
  }
  return "normal"
}

export function sumarHorasHabiles(fechaBase: Date, horas: number): Date {
  let restante = horas
  let cursor = ajustarAHorarioHabil(fechaBase)
  while (restante > 0) {
    const finJornadaActual = finJornada(cursor)
    const horasDisponibles =
      (finJornadaActual.getTime() - cursor.getTime()) / MILISEGUNDOS_POR_HORA
    if (horasDisponibles >= restante) {
      return new Date(cursor.getTime() + restante * MILISEGUNDOS_POR_HORA)
    }
    restante -= horasDisponibles
    cursor = siguienteInicioJornadaHabil(cursor)
  }
  return cursor
}

export function crearCodigoConciliacion(): string {
  const numero = Math.floor(100_000 + Math.random() * 900_000)
  return String(numero)
}

function parseFechaIso(iso: string): Date | null {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return null
  }
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

function sumarDiasHabiles(
  fechaInicio: Date,
  cantidadDiasHabiles: number
): Date {
  let fecha = new Date(fechaInicio)
  let agregados = 0
  while (agregados < cantidadDiasHabiles) {
    if (esDiaHabil(fecha)) {
      agregados += 1
    }
    if (agregados >= cantidadDiasHabiles) {
      break
    }
    fecha.setDate(fecha.getDate() + 1)
    fecha.setHours(HORA_ENTRADA, MINUTO_ENTRADA, 0, 0)
  }
  const fin = finJornada(fecha)
  fecha.setHours(fin.getHours(), fin.getMinutes(), 0, 0)
  return fecha
}

function ajustarAHorarioHabil(fecha: Date): Date {
  const ajustada = new Date(fecha)
  while (!esDiaHabil(ajustada)) {
    ajustada.setDate(ajustada.getDate() + 1)
    ajustada.setHours(HORA_ENTRADA, MINUTO_ENTRADA, 0, 0)
  }
  const inicio = new Date(ajustada)
  inicio.setHours(HORA_ENTRADA, MINUTO_ENTRADA, 0, 0)
  const fin = finJornada(ajustada)
  if (ajustada.getTime() < inicio.getTime()) {
    ajustada.setHours(HORA_ENTRADA, MINUTO_ENTRADA, 0, 0)
    return ajustada
  }
  if (ajustada.getTime() >= fin.getTime()) {
    return siguienteInicioJornadaHabil(ajustada)
  }
  return ajustada
}

function siguienteInicioJornadaHabil(desde: Date): Date {
  const siguiente = new Date(desde)
  siguiente.setDate(siguiente.getDate() + 1)
  siguiente.setHours(HORA_ENTRADA, MINUTO_ENTRADA, 0, 0)
  while (!esDiaHabil(siguiente)) {
    siguiente.setDate(siguiente.getDate() + 1)
  }
  return siguiente
}

function finJornada(fecha: Date): Date {
  const fin = new Date(fecha)
  if (fecha.getDay() === 6) {
    fin.setHours(HORA_SALIDA_SABADO, MINUTO_SALIDA_SABADO, 0, 0)
    return fin
  }
  fin.setHours(HORA_SALIDA_LUNES_VIERNES, MINUTO_SALIDA_LUNES_VIERNES, 0, 0)
  return fin
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

function calcularLimiteSolicitud(
  viaje: ExpenseViajeResumen,
  viajesReferencia: ExpenseViajeResumen[]
): Date {
  const viajesSolicitud = viajesReferencia.filter(
    (item) => item.solicitudId === viaje.solicitudId
  )
  let mayorFechaRegreso = parseFechaIso(viaje.fechaRegreso) ?? new Date()
  for (const viajeSolicitud of viajesSolicitud) {
    const fecha = parseFechaIso(viajeSolicitud.fechaRegreso)
    if (fecha !== null && fecha.getTime() > mayorFechaRegreso.getTime()) {
      mayorFechaRegreso = fecha
    }
  }
  const limite = new Date(mayorFechaRegreso)
  limite.setDate(limite.getDate() + 7)
  return limite
}
