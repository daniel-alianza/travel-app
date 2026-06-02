export interface GasolineRendimientoVehiculo {
  placa: string
  solicitudes: number
  montoTotal: number
  distanciaTotalKm: number
  costoPorKm: number | null
  kilometrajeRecorrido: number | null
  ultimoKilometraje: number | null
  ultimaSolicitud: string
}

export interface GasolinePerformanceResumenGlobal {
  vehiculos: number
  monto: number
  montoFormateado: string
  distancia: number
  costoPromedioKm: number | null
}
