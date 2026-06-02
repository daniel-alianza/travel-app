import type { GasolinePerformanceResumenGlobal } from "@/features/gasoline/interfaces/gasoline-rendimiento-vehiculo.interface"
import type { GasolineRendimientoVehiculo } from "@/features/gasoline/interfaces/gasoline-rendimiento-vehiculo.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

export interface GasolinePerformancePageModel {
  mousePosition: TravelRequestMousePosition
  vehiculosFiltrados: GasolineRendimientoVehiculo[]
  resumenGlobal: GasolinePerformanceResumenGlobal
  cargaInicial: boolean
  busqueda: string
  setBusqueda: (valor: string) => void
  recargar: () => Promise<void>
}
