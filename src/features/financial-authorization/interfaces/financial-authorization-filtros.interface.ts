export interface FiltrosAutorizacionFinanciera {
  textoNombre: string
  textoCorreo: string
  /** Últimos 4 (o subcadena) del número de tarjeta corporativa */
  ultimos4Tarjeta: string
  montoMin: string
  montoMax: string
  compania: string
  area: string
}
