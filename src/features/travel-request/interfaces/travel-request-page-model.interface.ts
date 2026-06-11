import { type ChangeEvent } from "react"

import type { TravelRequestGastos } from "./travel-request-gastos.interface"
import type { TravelRequestMousePosition } from "./travel-request-mouse-position.interface"
import type { TravelRequestTripData } from "./travel-request-trip-data.interface"
import type { TravelRequestTripSubmitFieldErrorKey } from "./travel-request-trip-submit-field-errors.interface"

export interface TravelRequestPolicyNotice {
  id: string
  text: string
  color: "red"
  buttonLabel: string | null
  actionUrl: string | null
}

export interface TravelRequestViaticCardOption {
  id: number
  cardNumber: string
}

export interface TravelRequestFuelCardOption {
  id: number
  cardNumber: string
}

export interface TravelRequestPageModel {
  mounted: boolean
  mousePosition: TravelRequestMousePosition
  empresas: string[]
  sucursales: Record<string, string[]>
  areas: string[]
  trips: TravelRequestTripData[]
  empresa: string
  setEmpresa: (value: string) => void
  sucursal: string
  setSucursal: (value: string) => void
  area: string
  setArea: (value: string) => void
  nombreEmpleado: string
  setNombreEmpleado: (value: string) => void
  numeroTarjeta: string
  setNumeroTarjeta: (value: string) => void
  viaticCards: TravelRequestViaticCardOption[]
  fuelCards: TravelRequestFuelCardOption[]
  loadFuelCards: () => Promise<void>
  isFormDataLocked: boolean
  esModoCorreccionViaje: boolean
  tripSoloLectura: (tripIndex: number) => boolean
  etiquetaBotonEnviar: string
  updateTrip: (
    tripIndex: number,
    partial: Partial<TravelRequestTripData>
  ) => void
  patchTripGasto: (
    tripIndex: number,
    field: keyof TravelRequestGastos,
    value: string
  ) => void
  getTripGastoError: (
    tripIndex: number,
    field: keyof TravelRequestGastos
  ) => string | null
  getTripSubmitFieldError: (
    tripIndex: number,
    field: TravelRequestTripSubmitFieldErrorKey
  ) => string | null
  addTrip: () => void
  removeTrip: (tripIndex: number) => void
  dropdownOpen: string | null
  setDropdownOpen: (value: string | null) => void
  ocupado: boolean
  policyNotices: TravelRequestPolicyNotice[]
  focusedField: string | null
  setFocusedField: (value: string | null) => void
  calcularTotal: (tripIndex: number) => number
  calcularTotalTodosLosViajes: () => number
  handleAddObjetivo: (tripIndex: number) => void
  handleRemoveObjetivo: (tripIndex: number, objectiveIndex: number) => void
  handleObjetivoChange: (
    tripIndex: number,
    objectiveIndex: number,
    value: string
  ) => void
  handleSubmit: () => Promise<void>
  handleFileUpload: (
    tripIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => Promise<void>
}
