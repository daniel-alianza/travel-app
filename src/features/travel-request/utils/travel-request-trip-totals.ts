import type { TravelRequestGastos } from "@/features/travel-request/interfaces/travel-request-gastos.interface"
import type { TravelRequestTripData } from "@/features/travel-request/interfaces/travel-request-trip-data.interface"

function parseAmount(value: string): number {
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) {
    return 0
  }
  return parsed
}

export function sumTravelRequestGastos(gastos: TravelRequestGastos): number {
  return Object.values(gastos).reduce(
    (total, value) => total + parseAmount(value),
    0
  )
}

export function sumTravelRequestTripGasolineAmount(
  trip: TravelRequestTripData
): number {
  if (!trip.necesitaGasolina) {
    return 0
  }
  return parseAmount(trip.montoGasolina)
}

export function sumTravelRequestTripTagAmount(
  trip: TravelRequestTripData
): number {
  if (!trip.necesitaTag) {
    return 0
  }
  return parseAmount(trip.montoTag)
}

export function computeTravelRequestTripTotal(
  trip: TravelRequestTripData
): number {
  return (
    sumTravelRequestGastos(trip.gastos) +
    sumTravelRequestTripGasolineAmount(trip) +
    sumTravelRequestTripTagAmount(trip)
  )
}
