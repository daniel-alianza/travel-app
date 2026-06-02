import { travelApi } from "@/api/travel-api"

export interface GasolineFormCatalogItem {
  id: number
  name: string
}

export interface GasolineFormCatalogBranch {
  id: number
  name: string
  companyId: number | null
}

export interface GasolineRequestFormCatalog {
  areas: GasolineFormCatalogItem[]
  companies: GasolineFormCatalogItem[]
  branches: GasolineFormCatalogBranch[]
}

interface GasolineRequestFormCatalogApiResponse {
  data: GasolineRequestFormCatalog
  message: string
}

export async function fetchGasolineRequestFormCatalog(): Promise<GasolineRequestFormCatalog> {
  const response = await travelApi.get<GasolineRequestFormCatalogApiResponse>(
    "/travel-request/form-catalog"
  )
  return response.data.data
}

export interface GasolineRequestFormData {
  userId: number
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
  fuelCards: Array<{
    id: number
    cardNumber: string
  }>
}

interface GasolineRequestFormDataApiResponse {
  data: GasolineRequestFormData
  message: string
}

export async function fetchGasolineRequestFormData(
  userId: number
): Promise<GasolineRequestFormData> {
  const response = await travelApi.get<GasolineRequestFormDataApiResponse>(
    `/travel-request/gasoline-form-data/${userId}`
  )
  return response.data.data
}

export interface GasolineCardSearchItem {
  sapCode: string
  name: string
  cardNumberMasked: string
  cardId: number | null
  branchCode: string | null
}

interface SearchGasolineCardsApiResponse {
  data: {
    cards: GasolineCardSearchItem[]
  }
  message: string
}

export type SearchGasolineCardsParams = {
  companyId: number
  branchId?: number
  q?: string
}

export type CreateGasolineRequestPayload = {
  userId: number
  companyId: number
  branchId?: number
  areaId?: number
  cardId?: number
  sapCode?: string
  plate: string
  currentMileageKm: number
  requestedAmount: number
  distanceKm: number
  routeToTake: string
  applicantComments?: string
  odometerPhotoFile: File
}

export type GasolineRequestSummary = {
  id: number
  status: string
  plate: string
  requestedAmount: number
  distanceKm: number
  routeToTake: string
  card: {
    id: number
    cardNumberMasked: string
    fuelName: string | null
  }
}

interface CreateGasolineRequestApiResponse {
  data: GasolineRequestSummary
  message: string
}

export async function createGasolineRequest(
  payload: CreateGasolineRequestPayload
): Promise<GasolineRequestSummary> {
  const formData = new FormData()
  formData.append("userId", String(payload.userId))
  formData.append("companyId", String(payload.companyId))
  if (payload.branchId !== undefined) {
    formData.append("branchId", String(payload.branchId))
  }
  if (payload.areaId !== undefined) {
    formData.append("areaId", String(payload.areaId))
  }
  if (payload.cardId !== undefined) {
    formData.append("cardId", String(payload.cardId))
  }
  if (payload.sapCode !== undefined && payload.sapCode.trim().length > 0) {
    formData.append("sapCode", payload.sapCode.trim())
  }
  formData.append("plate", payload.plate)
  formData.append("currentMileageKm", String(payload.currentMileageKm))
  formData.append("requestedAmount", String(payload.requestedAmount))
  formData.append("distanceKm", String(payload.distanceKm))
  formData.append("routeToTake", payload.routeToTake)
  if (payload.applicantComments !== undefined) {
    formData.append("applicantComments", payload.applicantComments)
  }
  formData.append("odometerPhoto", payload.odometerPhotoFile)

  const response = await travelApi.post<CreateGasolineRequestApiResponse>(
    "/gasoline/requests",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
  return response.data.data
}

export type ListGasolineCardsParams = {
  companyId: number
  q?: string
}

export async function fetchGasolineCards(
  params: ListGasolineCardsParams
): Promise<GasolineCardSearchItem[]> {
  const response = await travelApi.get<SearchGasolineCardsApiResponse>(
    "/gasoline/cards",
    {
      params: {
        companyId: params.companyId,
        ...(params.q !== undefined && params.q.trim().length > 0
          ? { q: params.q.trim() }
          : {}),
      },
    }
  )
  return response.data.data.cards.map((card) => ({
    sapCode: card.sapCode ?? "",
    name: card.name,
    cardNumberMasked: card.cardNumberMasked,
    cardId: card.cardId,
    branchCode: null,
  }))
}

export async function searchGasolineCards(
  params: SearchGasolineCardsParams
): Promise<GasolineCardSearchItem[]> {
  const response = await travelApi.get<SearchGasolineCardsApiResponse>(
    "/gasoline/cards/search",
    {
      params: {
        companyId: params.companyId,
        ...(params.branchId !== undefined
          ? { branchId: params.branchId }
          : {}),
        ...(params.q !== undefined && params.q.trim().length > 0
          ? { q: params.q.trim() }
          : {}),
      },
    }
  )
  return response.data.data.cards
}

export type GasolineRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "dispersed"

export type GasolineRequestListItem = {
  id: number
  userId: number
  companyId: number
  branchId: number | null
  areaId: number | null
  plate: string
  currentMileageKm: number
  requestedAmount: number
  distanceKm: number
  routeToTake: string
  applicantComments: string | null
  status: GasolineRequestStatus
  approverId: number | null
  approverComment: string | null
  approvedAt: string | null
  disbursedById: number | null
  disbursedComment: string | null
  disbursedAt: string | null
  createdAt: string
  updatedAt: string
  user: { id: number; name: string }
  company: { id: number; name: string }
  branch: { id: number; name: string } | null
  area: { id: number; name: string } | null
  card: {
    id: number
    cardNumberMasked: string
    fuelName: string | null
    fuelCardKind: string | null
  }
  approver: { id: number; name: string } | null
  disbursedBy: { id: number; name: string } | null
}

type GasolineRequestListApiResponse = {
  data: {
    requests: GasolineRequestListItem[]
    total: number
  }
  message: string
}

type GasolineRequestSingleApiResponse = {
  data: GasolineRequestListItem & { sapDocNum?: number }
  message: string
}

export type FetchPendingGasolineRequestsParams = {
  companyId?: number
  roleId?: number
  managerUserId?: number
}

export async function fetchPendingGasolineRequests(
  params?: FetchPendingGasolineRequestsParams
): Promise<GasolineRequestListItem[]> {
  const response = await travelApi.get<GasolineRequestListApiResponse>(
    "/gasoline/requests/pending",
    {
      params: {
        ...(params?.companyId !== undefined
          ? { companyId: params.companyId }
          : {}),
        ...(params?.roleId !== undefined ? { roleId: params.roleId } : {}),
        ...(params?.managerUserId !== undefined
          ? { userId: params.managerUserId }
          : {}),
      },
    }
  )
  return response.data.data.requests
}

export async function fetchApprovedGasolineRequests(
  companyId?: number
): Promise<GasolineRequestListItem[]> {
  const response = await travelApi.get<GasolineRequestListApiResponse>(
    "/gasoline/requests/approved",
    {
      params:
        companyId !== undefined ? { companyId } : undefined,
    }
  )
  return response.data.data.requests
}

export async function fetchGasolineRequestHistory(
  userId: number
): Promise<GasolineRequestListItem[]> {
  const response = await travelApi.get<GasolineRequestListApiResponse>(
    `/gasoline/requests/history/${userId}`
  )
  return response.data.data.requests
}

export async function approveGasolineRequest(
  requestId: number,
  payload: { approverId: number; comment?: string }
): Promise<GasolineRequestListItem> {
  const response = await travelApi.post<GasolineRequestSingleApiResponse>(
    `/gasoline/requests/${requestId}/approve`,
    payload
  )
  return response.data.data
}

export async function rejectGasolineRequest(
  requestId: number,
  payload: { approverId: number; comment?: string }
): Promise<GasolineRequestListItem> {
  const response = await travelApi.post<GasolineRequestSingleApiResponse>(
    `/gasoline/requests/${requestId}/reject`,
    payload
  )
  return response.data.data
}

export async function cancelApprovedGasolineRequest(
  requestId: number,
  payload: { cancelledBy: number; comment: string }
): Promise<GasolineRequestListItem> {
  const response = await travelApi.post<GasolineRequestSingleApiResponse>(
    `/gasoline/requests/${requestId}/cancel`,
    payload
  )
  return response.data.data
}

export async function disburseGasolineRequest(
  requestId: number,
  payload: {
    disbursedBy: number
    downPaymentDocEntry: number
    comment?: string
  }
): Promise<GasolineRequestListItem & { sapDocNum?: number }> {
  const response = await travelApi.post<GasolineRequestSingleApiResponse>(
    `/gasoline/requests/${requestId}/disburse`,
    payload
  )
  return response.data.data
}

export type GasolineAnticipo = {
  docEntry: number
  facturaDisponible: number
  total: number
  saldo: number
}

type GasolineAnticiposApiResponse = {
  data: {
    supplier: { code: string; name: string }
    company: { id: number; name: string }
    anticipos: GasolineAnticipo[]
  }
  message: string
}

export async function fetchGasolineAnticipos(
  companyId: number
): Promise<GasolineAnticiposApiResponse["data"]> {
  const response = await travelApi.get<GasolineAnticiposApiResponse>(
    "/gasoline/anticipos",
    { params: { companyId } }
  )
  return response.data.data
}

export type GasolineRequestDetail = GasolineRequestListItem & {
  odometerPhotos: Array<{ id: number; photoBase64: string }>
}

type GasolineRequestDetailApiResponse = {
  data: GasolineRequestDetail
  message: string
}

export async function fetchGasolineRequestById(
  requestId: number
): Promise<GasolineRequestDetail> {
  const response = await travelApi.get<GasolineRequestDetailApiResponse>(
    `/gasoline/requests/${requestId}`
  )
  return response.data.data
}

export type GasolineReportRow = {
  id: number
  usuario: string
  email: string
  razonSocial: string
  fechaSolicitud: string
  tarjeta: string
  placa: string
  kmInicial: number
  tieneImagenKm: boolean
  kmRecorre: number
  rendimientoEsperado: number | null
  kmAnterior: number | null
  monto: number
  montoRecorrido: number | null
  kmRecorridoReal: number | null
  rendimientoRealKmPeso: number | null
  variacionRendimiento: number | null
  estado: GasolineRequestStatus
  reviso: string | null
  emailReviso: string | null
  fechaHoraRevision: string | null
  dispersado: boolean
  autorizador: string | null
  emailAutorizador: string | null
  fechaHoraDispersion: string | null
}

export type FetchGasolineReportParams = {
  companyId?: number
  startDate?: string
  endDate?: string
  status?: GasolineRequestStatus
  plate?: string
}

type GasolineReportApiResponse = {
  data: { rows: GasolineReportRow[]; total: number }
  message: string
}

export type GasolineApprovalContext = {
  userId: number
  isTreasuryApprover: boolean
  isManagerRole: boolean
}

type GasolineApprovalContextApiResponse = {
  data: GasolineApprovalContext
  message: string
}

export async function fetchGasolineApprovalContext(): Promise<GasolineApprovalContext> {
  const response = await travelApi.get<GasolineApprovalContextApiResponse>(
    "/gasoline/approval-context/me"
  )
  return response.data.data
}

export async function fetchGasolineReport(
  params?: FetchGasolineReportParams
): Promise<GasolineReportRow[]> {
  const response = await travelApi.get<GasolineReportApiResponse>(
    "/gasoline/reports",
    {
      params: {
        ...(params?.companyId !== undefined
          ? { companyId: params.companyId }
          : {}),
        ...(params?.startDate !== undefined && params.startDate.length > 0
          ? { startDate: params.startDate }
          : {}),
        ...(params?.endDate !== undefined && params.endDate.length > 0
          ? { endDate: params.endDate }
          : {}),
        ...(params?.status !== undefined ? { status: params.status } : {}),
        ...(params?.plate !== undefined && params.plate.trim().length > 0
          ? { plate: params.plate.trim() }
          : {}),
      },
    }
  )
  return response.data.data.rows
}
