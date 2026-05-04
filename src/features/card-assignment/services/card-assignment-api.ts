import { travelApi } from "@/api/travel-api"
import { CARD_ASSIGNMENT_USERS_SEED } from "@/features/card-assignment/data/card-assignment-seed"
import type { CardAssignmentUser } from "@/features/card-assignment/interfaces/card-assignment-user.interface"
import { filtrarUsuariosCardAssignment } from "@/features/card-assignment/utils/card-assignment-usuarios-filtro"
import {
  calcularTotalPaginas,
  limitarPagina,
} from "@/lib/list-pagination-helpers"
import type { ListaPaginada, ListaPaginadaMeta } from "@/lib/list-pagination-types"
import {
  enmascararTarjetaParaVista,
  normalizarDigitosTarjeta,
} from "./card-assignment-tarjeta-helpers"

interface ApiEnvelope<T> {
  data: T
  message: string
  error: null
}

export interface AsignarTarjetaParametros {
  usuario: CardAssignmentUser
  digitosTarjeta: string
  empresaTarjeta: string
}

export interface CardAssignmentUsersListQuery {
  page: number
  pageSize: number
  search: string
  compania: string
  area: string
}

function demoraAleatoria(msMin: number, msMax: number): Promise<void> {
  const ms = Math.floor(Math.random() * (msMax - msMin + 1)) + msMin
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function resultadoPaginadoLocal(
  lista: CardAssignmentUser[],
  query: CardAssignmentUsersListQuery
): ListaPaginada<CardAssignmentUser> {
  const filtrados = filtrarUsuariosCardAssignment(lista, {
    search: query.search,
    compania: query.compania,
    area: query.area,
  })
  const totalPages = calcularTotalPaginas(filtrados.length, query.pageSize)
  const page = limitarPagina(query.page, totalPages)
  const inicio = (page - 1) * query.pageSize
  const items = filtrados.slice(inicio, inicio + query.pageSize)
  return {
    items,
    meta: {
      page,
      pageSize: query.pageSize,
      total: filtrados.length,
      totalPages,
    },
  }
}

function metaEsValida(meta: unknown): meta is ListaPaginadaMeta {
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
  if (Array.isArray(datos)) {
    return resultadoPaginadoLocal(datos as CardAssignmentUser[], query)
  }
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
  return null
}

export async function obtenerUsuariosAsignacionTarjeta(
  query: CardAssignmentUsersListQuery
): Promise<ListaPaginada<CardAssignmentUser>> {
  try {
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
    return resultadoPaginadoLocal([], query)
  } catch {
    await demoraAleatoria(280, 520)
    const lista = structuredClone(CARD_ASSIGNMENT_USERS_SEED)
    return resultadoPaginadoLocal(lista, query)
  }
}

export async function asignarTarjetaUsuario(
  parametros: AsignarTarjetaParametros
): Promise<CardAssignmentUser> {
  const { usuario, digitosTarjeta, empresaTarjeta } = parametros
  const digitosNormalizados = normalizarDigitosTarjeta(digitosTarjeta)
  const ultimosCuatro = digitosNormalizados.slice(-4)
  const cuerpo = {
    ultimosDigitos: ultimosCuatro,
    empresa: empresaTarjeta,
  }
  try {
    const respuesta = await travelApi.post<ApiEnvelope<CardAssignmentUser>>(
      `/card-assignment/users/${usuario.id}/assign`,
      cuerpo
    )
    return respuesta.data.data
  } catch {
    await demoraAleatoria(450, 900)
    return {
      ...usuario,
      compania: empresaTarjeta,
      tarjetaEnmascarada: enmascararTarjetaParaVista(digitosNormalizados),
    }
  }
}

export async function desactivarTarjetaUsuario(
  userId: string,
  usuarioActual: CardAssignmentUser
): Promise<CardAssignmentUser> {
  try {
    const respuesta = await travelApi.post<ApiEnvelope<CardAssignmentUser>>(
      `/card-assignment/users/${userId}/deactivate`
    )
    return respuesta.data.data
  } catch {
    await demoraAleatoria(450, 900)
    if (usuarioActual.id !== userId) {
      throw new Error("Identificador inconsistente")
    }
    return {
      ...usuarioActual,
      tarjetaEnmascarada: null,
    }
  }
}
