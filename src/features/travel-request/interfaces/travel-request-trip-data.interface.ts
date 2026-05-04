import type { TravelRequestGastos } from "./travel-request-gastos.interface"

export type EstadoViajeFormulario = "pending" | "approved" | "rejected"

export interface TravelRequestTripData {
  tripId?: number
  estadoViaje?: EstadoViajeFormulario
  ordenViajeEnSolicitud?: number
  destinoViaje: string
  motivoViaje: string
  fechaSalida: string
  fechaRegreso: string
  fechaDispersion: string
  gastos: TravelRequestGastos
  objetivos: string[]
  necesitaGasolina: boolean
  tarjetaGasolina: string
  placa: string
  kilometraje: string
  montoGasolina: string
  distancia: string
  comentariosGasolina: string
  fotoOdometro: string | null
  necesitaTag: boolean
  montoTag: string
  comentariosTag: string
}

export function createEmptyTravelRequestTrip(): TravelRequestTripData {
  return {
    destinoViaje: "",
    motivoViaje: "",
    fechaSalida: "",
    fechaRegreso: "",
    fechaDispersion: "",
    gastos: {
      transporte: "",
      peajes: "",
      hospedaje: "",
      alimentos: "",
      fletes: "",
      herramientas: "",
      envios: "",
      miscelaneos: "",
    },
    objetivos: ["", "", ""],
    necesitaGasolina: false,
    tarjetaGasolina: "",
    placa: "",
    kilometraje: "",
    montoGasolina: "",
    distancia: "",
    comentariosGasolina: "",
    fotoOdometro: null,
    necesitaTag: false,
    montoTag: "",
    comentariosTag: "",
  }
}
