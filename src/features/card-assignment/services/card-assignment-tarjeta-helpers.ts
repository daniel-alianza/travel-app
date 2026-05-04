export function normalizarDigitosTarjeta(valor: string): string {
  return valor.replace(/\D/g, "")
}

export function enmascararTarjetaParaVista(digitosNormalizados: string): string {
  const ultimos = digitosNormalizados.slice(-4).padStart(4, "0").slice(-4)
  return `•••• ${ultimos}`
}
