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

export async function downloadDispersionReportExcel(input?: {
  from?: string
  to?: string
}): Promise<{ blob: Blob; fileName: string }> {
  const desde = input?.from?.trim() ?? ""
  const hasta = input?.to?.trim() ?? ""
  const params: Record<string, string> = {}
  if (desde.length > 0) {
    params.from = desde
  }
  if (hasta.length > 0) {
    params.to = hasta
  }
  const response = await travelApi.get<Blob>(
    "/travel-request/dispersion-report/excel",
    {
      params: Object.keys(params).length > 0 ? params : undefined,
      responseType: "blob",
    }
  )
  const disposition = response.headers["content-disposition"]
  const fileName =
    extraerNombreArchivoDesdeContentDisposition(disposition) ??
    "reporte-dispersion-viaticos.xlsx"
  return { blob: response.data, fileName }
}

function extraerNombreArchivoDesdeContentDisposition(
  header: string | undefined,
): string | null {
  if (header === undefined || header.trim().length === 0) {
    return null
  }
  const match = /filename="([^"]+)"/i.exec(header)
  if (match !== null && match[1] !== undefined) {
    return match[1]
  }
  const matchSinComillas = /filename=([^;\s]+)/i.exec(header)
  if (matchSinComillas !== null && matchSinComillas[1] !== undefined) {
    return matchSinComillas[1]
  }
  return null
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
