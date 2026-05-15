import { travelApi } from "@/api/travel-api"
import type { FinancialAuthorizationSolicitudPendienteRevision } from "@/features/financial-authorization/interfaces/financial-authorization-solicitud.interface"

interface ApiEnvelope<T> {
  data: T
  message: string
  error: null
}

export interface FinancialAuthorizationFilterCatalog {
  readonly companies: readonly { readonly name: string }[]
  readonly areas: readonly { readonly name: string }[]
}

export interface ViaticDistributionRuleOption {
  readonly value: string
  readonly label: string
  readonly companyName: string
}

export interface CompanyExpenseCatalogOption {
  readonly value: string
  readonly label: string
}

export interface CompanyExpenseCatalogPayload {
  readonly companyId: number
  readonly vatIndicators: CompanyExpenseCatalogOption[]
  readonly viaticCategories: CompanyExpenseCatalogOption[]
}

export interface MovementCfdiPayload {
  readonly movementSequence: number
  readonly xmlFileName: string | null
  readonly xmlRaw: string
  readonly xmlJson: unknown
  readonly conceptos: readonly {
    descripcion: string
    cantidad: string
    claveUnidad: string
    valorUnitario: string
    importe: string
    objetoImp: string
    traslados: readonly {
      base: string
      impuesto: string
      tipoFactor: string
      tasaOCuota: string
      importe: string
    }[]
  }[]
  readonly camposXml: readonly {
    campo: string
    valor: string
  }[]
}

export async function fetchFinancialAuthorizationFilterCatalog(): Promise<FinancialAuthorizationFilterCatalog> {
  const response = await travelApi.get<
    ApiEnvelope<FinancialAuthorizationFilterCatalog>
  >("/card-assignment/filters")

  return response.data.data
}

type ViaticDistributionRulesApiResponse = ApiEnvelope<{
  distributionRules: Array<{
    id: number
    code: string
    name: string
    companyName: string
  }>
}>

export async function fetchViaticDistributionRules(): Promise<
  ViaticDistributionRuleOption[]
> {
  const response = await travelApi.get<ViaticDistributionRulesApiResponse>(
    "/travel-checks/distribution-rules/viatic"
  )

  return response.data.data.distributionRules.map((rule) => ({
    value: String(rule.id),
    label: `${rule.code} - ${rule.name}`,
    companyName: rule.companyName,
  }))
}

type MovementCfdiApiResponse = ApiEnvelope<MovementCfdiPayload>

export async function fetchMovementCfdi(input: {
  tripId: number
  movementSequence: number
}): Promise<MovementCfdiPayload> {
  const response = await travelApi.get<MovementCfdiApiResponse>(
    `/travel-checks/trips/${String(input.tripId)}/movements/${String(input.movementSequence)}/cfdi`
  )
  return response.data.data
}

type DispersedTravelChecksApiResponse = ApiEnvelope<{
  solicitudes: Array<{
    id: number
    status: string
    nombreEmpleado: string
    tarjetaCorporativaEnmascarada: string
    dispersadoEn: string | null
    montoDispersado: number | null
    expenseCatalogCompanyId: number
    usuario: {
      id: number
      nombre: string
      correo: string
    }
    compania: {
      id: number
      nombre: string
    }
    sucursal: {
      id: number
      nombre: string
    }
    area: {
      id: number
      nombre: string
    }
    viajes: Array<{
      tripId: number
      tripOrder: number
      motivoViaje: string
      destino: string
      estadoViaje: string
      fechaSalida: string
      fechaRegreso: string
      fechaDispersion: string
      totalEstimado: number
      movimientosComprobados: number
      totalComprobadoMovimientos: number
      movimientosComprobadosDetalle: Array<{
        tripMovementProofId: number
        movementSequence: number
        movementDate: string
        movementAmount: number
        movementMemo: string | null
        movementComment: string | null
        proofStatus: "submitted" | "approved" | "rejected"
        proofType: "ticket" | "invoice"
      }>
    }>
  }>
}>

function obtenerUltimos4Tarjeta(mascaraTarjeta: string): string {
  const digits = mascaraTarjeta.replace(/\D/g, "")
  return digits.slice(-4)
}

function fechaIsoSoloDia(value: string | null): string {
  if (typeof value === "string" && value.length >= 10) {
    return value.slice(0, 10)
  }
  return new Date().toISOString().slice(0, 10)
}

function construirResumenViajes(
  viajes: readonly { destino: string }[],
  fallbackStatus: string
): string {
  const destinos = viajes
    .map((viaje) => viaje.destino.trim())
    .filter((destino) => destino.length > 0)
  if (destinos.length === 0) {
    return `Solicitud en estado ${fallbackStatus.toLowerCase()}`
  }
  if (destinos.length === 1) {
    return destinos[0] ?? ""
  }
  return `${destinos[0] ?? ""} y ${String(destinos.length - 1)} destino(s) más`
}

function normalizarMotivoViaje(motivoViaje: string): string {
  const motivo = motivoViaje.trim()
  return motivo.length > 0 ? motivo : "Sin motivo"
}

function extraerEtiquetaComercio(memo: string | null): string {
  if (memo === null) {
    return "Movimiento"
  }
  const texto = memo.replace(/\s+/g, " ").trim()
  if (texto.length === 0) {
    return "Movimiento"
  }
  const patronConTarjeta = /\ben\s+\d{12,19}\s+(.+?)(?:\s+Tarjeta\b|\s+\||$)/i
  const coincidenciaConTarjeta = texto.match(patronConTarjeta)
  const candidatoConTarjeta = coincidenciaConTarjeta?.[1]?.trim()
  if (candidatoConTarjeta !== undefined && candidatoConTarjeta.length > 0) {
    return candidatoConTarjeta
  }
  const patronConEn = /\ben\s+(.+?)(?:\s+\||$)/i
  const coincidenciaConEn = texto.match(patronConEn)
  const candidatoConEn = coincidenciaConEn?.[1]?.trim()
  if (candidatoConEn !== undefined && candidatoConEn.length > 0) {
    return candidatoConEn
  }
  return texto
}

export async function fetchFinancialAuthorizationRequests(): Promise<
  FinancialAuthorizationSolicitudPendienteRevision[]
> {
  const response = await travelApi.get<DispersedTravelChecksApiResponse>(
    "/travel-checks/dispersed"
  )

  return response.data.data.solicitudes.map((solicitud) => ({
    id: String(solicitud.id),
    folioSolicitud: String(solicitud.id),
    resumen: construirResumenViajes(solicitud.viajes, solicitud.status),
    solicitante: solicitud.nombreEmpleado,
    correoElectronico: solicitud.usuario.correo,
    companyId: solicitud.compania.id,
    expenseCatalogCompanyId: solicitud.expenseCatalogCompanyId,
    empresa: solicitud.compania.nombre,
    area: solicitud.area.nombre,
    fechaCierreComprobacion: fechaIsoSoloDia(solicitud.dispersadoEn),
    tarjetaUltimos4: obtenerUltimos4Tarjeta(
      solicitud.tarjetaCorporativaEnmascarada
    ),
    viajes: solicitud.viajes.map((viaje) => ({
      id: `viaje-${String(viaje.tripId)}`,
      idViaje: String(viaje.tripId),
      titulo: normalizarMotivoViaje(viaje.motivoViaje),
      destino: viaje.destino,
      periodoInicio: fechaIsoSoloDia(viaje.fechaSalida),
      periodoFin: fechaIsoSoloDia(viaje.fechaRegreso),
      movimientosComprobados: viaje.movimientosComprobadosDetalle.map(
        (movimiento) => ({
          id: `mov-${String(viaje.tripId)}-${String(movimiento.movementSequence)}`,
          numeroMovimiento: movimiento.movementSequence,
          fecha: fechaIsoSoloDia(movimiento.movementDate),
          descripcion: extraerEtiquetaComercio(movimiento.movementMemo),
          categoria: "",
          monto: movimiento.movementAmount,
          comentarioAlComprobar: movimiento.movementComment ?? undefined,
          comprobacionUsuarioHecha: true,
          tripMovementProofId: movimiento.tripMovementProofId,
          proofStatus: movimiento.proofStatus,
          proofType: movimiento.proofType,
          facturadoSapMock: movimiento.proofStatus === "approved",
        })
      ),
    })),
  }))
}

type CompanyExpenseCatalogApiResponse = ApiEnvelope<{
  companyId: number
  vatIndicators: Array<{
    id: number
    code: string
    name: string
  }>
  viaticCategories: Array<{
    id: number
    code: string
    name: string
  }>
}>

export async function fetchCompanyExpenseCatalogs(
  companyId: number
): Promise<CompanyExpenseCatalogPayload> {
  const response = await travelApi.get<CompanyExpenseCatalogApiResponse>(
    `/travel-checks/companies/${String(companyId)}/expense-catalogs`
  )
  const data = response.data.data
  return {
    companyId: data.companyId,
    vatIndicators: data.vatIndicators.map((item) => ({
      value: item.code,
      label: `${item.code} - ${item.name}`,
    })),
    viaticCategories: data.viaticCategories.map((item) => ({
      value: item.code,
      label: `${item.code} - ${item.name}`,
    })),
  }
}

export interface ApproveTripMovementProofSapPayload {
  readonly docEntry: number
  readonly docNum?: number
  readonly potentialDiscountRisk: boolean
  readonly docTotalDiff: number
  readonly sapSessionCompanyId: number
}

type ApproveTripMovementProofApiEnvelope = ApiEnvelope<{
  tripMovementProofId: number
  status: "approved"
  sap: ApproveTripMovementProofSapPayload
}>

export async function postTripMovementProofAccountingApprove(input: {
  readonly tripMovementProofId: number
  readonly accountCode: string
  readonly taxCode: string
  readonly costingCode?: string
  readonly reviewerNotes?: string
  readonly sapCardCode?: string
}): Promise<{
  tripMovementProofId: number
  status: "approved"
  sap: ApproveTripMovementProofSapPayload
}> {
  const response = await travelApi.post<ApproveTripMovementProofApiEnvelope>(
    `/accounting-invoice/trip-movement-proofs/${String(input.tripMovementProofId)}/approve`,
    {
      accountCode: input.accountCode,
      taxCode: input.taxCode,
      ...(input.costingCode !== undefined && input.costingCode.length > 0
        ? { costingCode: input.costingCode }
        : {}),
      ...(input.reviewerNotes !== undefined && input.reviewerNotes.length > 0
        ? { reviewerNotes: input.reviewerNotes }
        : {}),
      ...(input.sapCardCode !== undefined && input.sapCardCode.length > 0
        ? { sapCardCode: input.sapCardCode }
        : {}),
    }
  )
  return response.data.data
}
