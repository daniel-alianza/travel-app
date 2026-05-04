import type { CardAssignmentUser } from "@/features/card-assignment/interfaces/card-assignment-user.interface"

export const FILTRO_TODAS_CARD_ASSIGNMENT = "__all__"

export function coincideBusquedaUsuarioCardAssignment(
  usuario: CardAssignmentUser,
  texto: string
): boolean {
  const normalizado = texto.trim().toLowerCase()
  if (normalizado.length === 0) {
    return true
  }
  return (
    usuario.nombreCompleto.toLowerCase().includes(normalizado) ||
    usuario.correo.toLowerCase().includes(normalizado)
  )
}

export function pasaFiltroCompaniaCardAssignment(
  usuario: CardAssignmentUser,
  filtro: string
): boolean {
  if (filtro === FILTRO_TODAS_CARD_ASSIGNMENT || filtro === "") {
    return true
  }
  return usuario.compania === filtro
}

export function pasaFiltroAreaCardAssignment(
  usuario: CardAssignmentUser,
  filtro: string
): boolean {
  if (filtro === FILTRO_TODAS_CARD_ASSIGNMENT || filtro === "") {
    return true
  }
  return usuario.area === filtro
}

export function filtrarUsuariosCardAssignment(
  usuarios: readonly CardAssignmentUser[],
  parametros: { search: string; compania: string; area: string }
): CardAssignmentUser[] {
  return usuarios.filter(
    (u) =>
      coincideBusquedaUsuarioCardAssignment(u, parametros.search) &&
      pasaFiltroCompaniaCardAssignment(u, parametros.compania) &&
      pasaFiltroAreaCardAssignment(u, parametros.area)
  )
}
