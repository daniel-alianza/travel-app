import { travelApi } from "@/api/travel-api"

export interface DispersionQueueItemApi {
  id: number
  nombreSolicitante: string
  numeroTarjeta: string
  descripcion: string
  montoSolicitado: number
  fechaInicioViaje: string
  fechaFinViaje: string
}

interface DispersionQueueApiResponse {
  data: DispersionQueueItemApi[]
  message: string
}

export async function fetchDispersionQueue(): Promise<DispersionQueueItemApi[]> {
  const response = await travelApi.get<DispersionQueueApiResponse>(
    "/travel-request/dispersion-queue"
  )
  return response.data.data
}

interface ConfirmDispersionApiResponse {
  data: { ok: true }
  message: string
}

export async function confirmTravelRequestDispersion(
  travelRequestId: number,
  dispersedTotal: number,
  comment?: string | null
): Promise<void> {
  const payload: { dispersedTotal: number; comment?: string } = {
    dispersedTotal,
  }
  const texto = comment?.trim() ?? ""
  if (texto.length > 0) {
    payload.comment = texto
  }
  await travelApi.patch<ConfirmDispersionApiResponse>(
    `/travel-request/${travelRequestId}/disperse`,
    payload
  )
}
