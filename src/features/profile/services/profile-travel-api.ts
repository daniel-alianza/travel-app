import { travelApi } from "@/api/travel-api"
import type { PerfilLaboralVista } from "@/features/profile/interfaces/perfil-laboral-vista.interface"
import type { UsuarioCandidatoJefe } from "@/features/profile/interfaces/usuario-candidato-jefe.interface"

type ApiEnvelope<T> = {
  data: T
  message: string
}

export async function fetchCurrentUserProfile(): Promise<PerfilLaboralVista> {
  const respuesta = await travelApi.get<ApiEnvelope<PerfilLaboralVista>>(
    "/auth/me"
  )
  return respuesta.data.data
}

type ManagerCandidateApiRow = {
  id: number
  nombreCompleto: string
  correo: string
  area: string
}

export async function fetchManagerCandidates(): Promise<
  ReadonlyArray<UsuarioCandidatoJefe>
> {
  const respuesta = await travelApi.get<
    ApiEnvelope<ReadonlyArray<ManagerCandidateApiRow>>
  >("/auth/manager-candidates")
  return respuesta.data.data.map((fila) => ({
    id: String(fila.id),
    nombreCompleto: fila.nombreCompleto,
    correo: fila.correo,
    area: fila.area,
  }))
}

export async function postCambioContrasenaPerfil(entrada: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  await travelApi.post<ApiEnvelope<null>>("/auth/change-password", entrada)
}
