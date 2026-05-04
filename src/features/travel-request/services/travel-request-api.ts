import { travelApi } from "@/api/travel-api"

export interface TravelRequestPolicyNoticeApi {
  id: string
  text: string
  color: "red"
  buttonLabel: string | null
  actionUrl: string | null
}

interface TravelRequestPoliciesApiResponse {
  data: {
    notices: TravelRequestPolicyNoticeApi[]
  }
}

export interface TravelRequestFormDataApiResponse {
  data: {
    userId: number
    employeeName: string
    company: {
      id: number
      name: string
    }
    branch: {
      id: number
      name: string
    }
    area: {
      id: number
      name: string
    }
    viaticCards: Array<{
      id: number
      cardNumber: string
    }>
  }
}

export interface TravelRequestFuelCardsApiResponse {
  data: {
    userId: number
    fuelCards: Array<{
      id: number
      cardNumber: string
    }>
  }
}

interface TravelRequestCreateApiResponse {
  data: {
    id: number
    status: string
    createdAt: string
  }
}

export async function fetchTravelRequestPolicies(): Promise<
  TravelRequestPolicyNoticeApi[]
> {
  const response = await travelApi.get<TravelRequestPoliciesApiResponse>(
    "/travel-request/policies"
  )
  return response.data.data.notices
}

export async function fetchTravelRequestFormData(
  userId: number
): Promise<TravelRequestFormDataApiResponse["data"]> {
  const response = await travelApi.get<TravelRequestFormDataApiResponse>(
    `/travel-request/form-data/${userId}`
  )
  return response.data.data
}

export async function fetchUserFuelCards(
  userId: number
): Promise<TravelRequestFuelCardsApiResponse["data"]> {
  const response = await travelApi.get<TravelRequestFuelCardsApiResponse>(
    `/travel-request/fuel-cards/${userId}`
  )
  return response.data.data
}

export async function createTravelRequest(
  payload: Record<string, unknown>
): Promise<TravelRequestCreateApiResponse["data"]> {
  const response = await travelApi.post<TravelRequestCreateApiResponse>(
    "/travel-request",
    payload
  )
  return response.data.data
}

export interface MyTravelRequestTripApi {
  tripId: number
  tripOrder: number
  destino: string
  estadoViaje: string
  comentarioAprobador: string | null
  aprobadoEn: string | null
  rechazadoEn: string | null
}

export interface MyTravelRequestApi {
  id: number
  status: string
  createdAt: string
  viajes: MyTravelRequestTripApi[]
}

interface MyTravelRequestsApiResponse {
  data: {
    solicitudes: MyTravelRequestApi[]
  }
}

export async function fetchMyTravelRequests(
  userId: number
): Promise<MyTravelRequestApi[]> {
  const response = await travelApi.get<MyTravelRequestsApiResponse>(
    `/travel-request/solicitudes-propias/${userId}`
  )
  return response.data.data.solicitudes
}

export interface TravelRequestDetalleViajeApi {
  tripId: number
  tripOrder: number
  estadoViaje: string
  destinoViaje: string
  motivoViaje: string
  fechaSalida: string
  fechaRegreso: string
  fechaDispersion: string
  gastos: {
    transporte: number
    peajes: number
    hospedaje: number
    alimentos: number
    fletes: number
    herramientas: number
    envios: number
    miscelaneos: number
  }
  objetivos: string[]
  gasolina: {
    necesitaGasolina: boolean
    cardId: number | null
    cardNumber: string | null
    placa: string | null
    kilometrajeActualKm: number | null
    montoSolicitado: number | null
    distanciaKm: number | null
    comentarios: string | null
  }
  tag: {
    necesitaTag: boolean
    montoSolicitado: number | null
    comentarios: string | null
  }
}

export interface TravelRequestDetalleParaUsuarioApi {
  solicitudId: number
  status: string
  employeeName: string
  corporateCardNumber: string | null
  company: { id: number; name: string }
  branch: { id: number; name: string }
  area: { id: number; name: string }
  viajes: TravelRequestDetalleViajeApi[]
}

interface TravelRequestDetalleApiResponse {
  data: TravelRequestDetalleParaUsuarioApi
}

export async function fetchTravelRequestDetalleParaUsuario(
  solicitudId: number,
  userId: number
): Promise<TravelRequestDetalleParaUsuarioApi> {
  const response = await travelApi.get<TravelRequestDetalleApiResponse>(
    `/travel-request/solicitud/${solicitudId}/usuario/${userId}/detalle`
  )
  return response.data.data
}

interface CorrectTripApiResponse {
  data: {
    solicitudId: number
    tripId: number
    statusViaje: string
    statusSolicitud: string
  }
}

export async function correctRejectedTravelTrip(
  tripId: number,
  payload: { userId: number; trip: Record<string, unknown> }
): Promise<CorrectTripApiResponse["data"]> {
  const response = await travelApi.patch<CorrectTripApiResponse>(
    `/travel-request/viajes/${tripId}/corregir`,
    payload
  )
  return response.data.data
}
