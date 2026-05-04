import { travelApi } from "@/api/travel-api"

export interface ApprovalTripConceptApi {
  concepto: string
  monto: number
}

export interface ApprovalTripApi {
  tripId: number
  estadoViaje: "Pendiente" | "Aprobado" | "Rechazado" | "Dispersado"
  comentarioViaje: string | null
  destinoViaje: string
  motivoViaje: string
  fechaSalida: string
  fechaRegreso: string
  fechaDispersion: string
  montoEstimado: number
  requiereTag: boolean
  montoTag: number
  requiereGasolina: boolean
  montoGasolina: number
  conceptosSolicitados: ApprovalTripConceptApi[]
}

export type EstadoSolicitudAprobacion =
  | "Pendiente"
  | "En corrección"
  | "Aprobada"
  | "Rechazada"
  | "Dispersada"

export interface ApprovalRequestApi {
  id: number
  nombreEmpleado: string
  correo: string
  area: string
  empresa: string
  fechaSolicitud: string
  estado: EstadoSolicitudAprobacion
  fechaAutorizacion: string | null
  autorizadoPor: string | null
  dispersadoPor: string | null
  comentarioResolucion: string | null
  viajes: ApprovalTripApi[]
}

interface ApprovalListApiResponse {
  data: ApprovalRequestApi[]
  message: string
}

interface ApprovalFilterCatalogApiResponse {
  data: {
    areas: string[]
    companies: string[]
  }
  message: string
}

interface TripResolutionApiResponse {
  data: { ok: true }
  message: string
}

export async function fetchApprovalRequests(): Promise<ApprovalRequestApi[]> {
  const response = await travelApi.get<ApprovalListApiResponse>(
    "/travel-request/approval-list"
  )
  return response.data.data
}

export async function fetchApprovalFilterCatalog(): Promise<{
  areas: string[]
  companies: string[]
}> {
  const response = await travelApi.get<ApprovalFilterCatalogApiResponse>(
    "/travel-request/approval-filter-catalog"
  )
  return response.data.data
}

export async function approveTravelRequestTrip(
  tripId: number,
  comment?: string
): Promise<void> {
  const texto = comment?.trim() ?? ""
  const payload = texto.length > 0 ? { comment: texto } : {}
  await travelApi.patch<TripResolutionApiResponse>(
    `/travel-request/trips/${tripId}/approve`,
    payload
  )
}

export async function rejectTravelRequestTrip(
  tripId: number,
  comment: string
): Promise<void> {
  await travelApi.patch<TripResolutionApiResponse>(
    `/travel-request/trips/${tripId}/reject`,
    { comment }
  )
}
