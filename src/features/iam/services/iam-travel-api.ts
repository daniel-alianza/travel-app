import { travelApi } from "@/api/travel-api"
import {
  esRolIam,
  semillaAceptacionesPoliticas,
} from "@/features/iam/hooks/iam-page-helpers"
import type { RolIam, UsuarioIam } from "@/features/iam/interfaces/iam-domain.interface"

export type IamUserApiRow = {
  id: number
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  jefeDirecto: string
  correoElectronico: string
  telefono?: string
  area: string
  sucursal: string
  rol: string
  activo: boolean
  permisos: readonly string[]
  permisosPorDefectoRol: readonly string[]
  gasolinaTesoreriaAprobador: boolean
  gasolinaNotificacionDispersion: boolean
}

type ApiEnvelope<T> = {
  data: T
  message: string
}

function mapearRolSeguro(rol: string): RolIam {
  return esRolIam(rol) ? rol : "Colaborador"
}

export function mapearFilaApiAUsuarioIam(fila: IamUserApiRow): UsuarioIam {
  return {
    id: String(fila.id),
    nombres: fila.nombres,
    apellidoPaterno: fila.apellidoPaterno,
    apellidoMaterno: fila.apellidoMaterno,
    jefeDirecto: fila.jefeDirecto,
    correoElectronico: fila.correoElectronico,
    area: fila.area,
    sucursal: fila.sucursal,
    rol: mapearRolSeguro(fila.rol),
    activo: fila.activo,
    permisos: [...fila.permisos],
    permisosPorDefectoRol: [...fila.permisosPorDefectoRol],
    aceptacionesPoliticas: semillaAceptacionesPoliticas(false, null),
    gasolinaTesoreriaAprobador: fila.gasolinaTesoreriaAprobador,
    gasolinaNotificacionDispersion: fila.gasolinaNotificacionDispersion,
  }
}

export async function fetchIamUsers(entrada?: {
  search?: string
}): Promise<UsuarioIam[]> {
  const busqueda = entrada?.search?.trim() ?? ""
  const respuesta = await travelApi.get<ApiEnvelope<IamUserApiRow[]>>(
    "/iam/users",
    {
      params:
        busqueda.length > 0
          ? { search: busqueda }
          : undefined,
    }
  )
  return respuesta.data.data.map(mapearFilaApiAUsuarioIam)
}

export type IamFilterCatalogApi = {
  areas: readonly string[]
  sucursales: readonly string[]
  rolesEtiqueta: readonly string[]
}

export async function fetchIamFilterCatalog(): Promise<IamFilterCatalogApi> {
  const respuesta = await travelApi.get<ApiEnvelope<IamFilterCatalogApi>>(
    "/iam/filter-catalog"
  )
  return respuesta.data.data
}

export async function putIamUsuarioContrasena(
  idUsuario: string,
  nuevaContrasena: string,
): Promise<void> {
  await travelApi.put<ApiEnvelope<null>>(
    `/iam/users/${idUsuario}/password`,
    { newPassword: nuevaContrasena },
  )
}

export async function putIamUserGasolineNotifications(
  idUsuario: string,
  payload: {
    treasuryApprover: boolean
    dispersalNotify: boolean
  },
): Promise<void> {
  await travelApi.put<ApiEnvelope<null>>(
    `/iam/users/${idUsuario}/gasoline-notifications`,
    payload,
  )
}

export async function putIamUserExtraPermissions(
  idUsuario: string,
  extraPermissionCodes: readonly string[],
): Promise<void> {
  await travelApi.put<ApiEnvelope<null>>(
    `/iam/users/${idUsuario}/extra-permissions`,
    { extraPermissionCodes: [...extraPermissionCodes] },
  )
}

export type PutIamUserProfilePayload = {
  readonly name: string
  readonly email: string
  readonly isActive: boolean
  readonly roleLabel: string
  readonly areaName: string
  readonly branchName: string
  readonly managerUserId: number | null
}

export async function putIamUserProfile(
  idUsuario: string,
  payload: PutIamUserProfilePayload,
): Promise<void> {
  await travelApi.put<ApiEnvelope<null>>(`/iam/users/${idUsuario}`, payload)
}
