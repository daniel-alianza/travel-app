import { travelApi } from "@/api/travel-api"
import type { CardAssignmentUser } from "@/features/card-assignment/interfaces/card-assignment-user.interface"
import type { ListaPaginada } from "@/lib/list-pagination-types"
import { normalizarDigitosTarjeta } from "./card-assignment-tarjeta-helpers"

interface ApiEnvelope<T> {
  data: T
  message: string
  error: null
}

export type CardAssignmentFilterCatalog = {
  readonly companies: readonly { readonly name: string }[]
  readonly areas: readonly { readonly name: string }[]
}

export async function obtenerCatalogoFiltrosTarjeta(): Promise<CardAssignmentFilterCatalog> {
  const respuesta = await travelApi.get<ApiEnvelope<CardAssignmentFilterCatalog>>(
    "/card-assignment/filters"
  )

  return respuesta.data.data
}

export interface AsignarTarjetaParametros {
  usuario: CardAssignmentUser
  digitosTarjeta: string
  empresaTarjeta: string
  cardType: "VIATIC" | "FUEL"
  fuelName?: string
  fuelCardKind?: "physical" | "virtual"
  fuelAssignmentType?: "NotAcumulative" | "Acumulable"
  fuelGroup?: string
  fuelStatus?: "active" | "inactive" | "blocked" | "cancelled"
}

export interface CardAssignmentUsersListQuery {
  page: number
  pageSize: number
  search: string
  compania: string
  area: string
}

function metaEsValida(meta: unknown): meta is ListaPaginada<CardAssignmentUser>["meta"] {
  if (meta === null || typeof meta !== "object") {
    return false
  }
  const m = meta as Record<string, unknown>
  return (
    typeof m.page === "number" &&
    typeof m.pageSize === "number" &&
    typeof m.total === "number" &&
    typeof m.totalPages === "number"
  )
}

function normalizarRespuestaServidor(
  datos: unknown,
  query: CardAssignmentUsersListQuery
): ListaPaginada<CardAssignmentUser> | null {
  if (datos === null || typeof datos !== "object") {
    return null
  }
  const d = datos as Record<string, unknown>
  if (Array.isArray(d.items) && metaEsValida(d.meta)) {
    return {
      items: d.items as CardAssignmentUser[],
      meta: d.meta,
    }
  }
  if (Array.isArray(d)) {
    return {
      items: d as CardAssignmentUser[],
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total: d.length,
        totalPages: Math.max(1, Math.ceil(d.length / query.pageSize)),
      },
    }
  }
  return null
}

export async function obtenerUsuariosAsignacionTarjeta(
  query: CardAssignmentUsersListQuery
): Promise<ListaPaginada<CardAssignmentUser>> {
  const respuesta = await travelApi.get<
    ApiEnvelope<
      | CardAssignmentUser[]
      | ListaPaginada<CardAssignmentUser>
      | Record<string, unknown>
    >
  >("/card-assignment/users", {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      compania: query.compania,
      area: query.area,
    },
  })
  const normalizado = normalizarRespuestaServidor(
    respuesta.data.data,
    query
  )
  if (normalizado !== null) {
    return normalizado
  }
  throw new Error("La respuesta de card assignment no tiene formato válido")
}

export async function asignarTarjetaUsuario(
  parametros: AsignarTarjetaParametros
): Promise<CardAssignmentUser> {
  const {
    usuario,
    digitosTarjeta,
    empresaTarjeta,
    cardType,
    fuelName,
    fuelCardKind,
    fuelAssignmentType,
    fuelGroup,
    fuelStatus,
  } = parametros
  const digitosNormalizados = normalizarDigitosTarjeta(digitosTarjeta)
  const cuerpo = {
    cardNumber: digitosNormalizados,
    companyName: empresaTarjeta,
    cardType,
    fuelName,
    fuelCardKind,
    fuelAssignmentType,
    fuelGroup,
    fuelStatus,
  }
  const respuesta = await travelApi.post<ApiEnvelope<CardAssignmentUser>>(
    `/card-assignment/users/${usuario.id}/assign`,
    cuerpo
  )
  return respuesta.data.data
}

export async function desactivarTarjetaUsuario(
  userId: number,
  cardType: "VIATIC" | "FUEL"
): Promise<CardAssignmentUser> {
  const respuesta = await travelApi.post<ApiEnvelope<CardAssignmentUser>>(
    `/card-assignment/users/${userId}/deactivate`,
    { cardType }
  )
  return respuesta.data.data
}
