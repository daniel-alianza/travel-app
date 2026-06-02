import type { GasolineRendimientoVehiculo } from "@/features/gasoline/interfaces/gasoline-rendimiento-vehiculo.interface"
import type { GasolineRequestListItem } from "@/features/gasoline/services/gasoline-api"

export function calcularRendimientoPorPlaca(
  solicitudes: readonly GasolineRequestListItem[]
): GasolineRendimientoVehiculo[] {
  const porPlaca = new Map<string, GasolineRequestListItem[]>()

  solicitudes.forEach((solicitud) => {
    const placa = solicitud.plate.trim().toUpperCase()
    const lista = porPlaca.get(placa) ?? []
    lista.push(solicitud)
    porPlaca.set(placa, lista)
  })

  const resultados: GasolineRendimientoVehiculo[] = []

  porPlaca.forEach((lista, placa) => {
    const ordenadas = [...lista].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    const montoTotal = ordenadas.reduce(
      (acc, s) => acc + s.requestedAmount,
      0
    )
    const distanciaTotalKm = ordenadas.reduce(
      (acc, s) => acc + s.distanceKm,
      0
    )
    const costoPorKm =
      distanciaTotalKm > 0 ? montoTotal / distanciaTotalKm : null

    const primera = ordenadas[0]
    const ultima = ordenadas[ordenadas.length - 1]
    let kilometrajeRecorrido: number | null = null
    if (primera !== undefined && ultima !== undefined && ordenadas.length > 1) {
      const delta = ultima.currentMileageKm - primera.currentMileageKm
      kilometrajeRecorrido = delta > 0 ? delta : null
    }

    resultados.push({
      placa,
      solicitudes: ordenadas.length,
      montoTotal,
      distanciaTotalKm,
      costoPorKm,
      kilometrajeRecorrido,
      ultimoKilometraje: ultima?.currentMileageKm ?? null,
      ultimaSolicitud: ultima?.createdAt ?? "",
    })
  })

  return resultados.sort((a, b) => b.montoTotal - a.montoTotal)
}
