import type { PerfilLaboralVista } from "@/features/profile/interfaces/perfil-laboral-vista.interface"

export function textoNormalizadoParaBusqueda(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
}

export function correoSinteticoDesdeNombre(nombreCompleto: string): string {
  const partes = nombreCompleto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/\s+/)
    .filter((p) => p.length > 0)
  if (partes.length === 0) {
    return "usuario@grupofg.com"
  }
  const local =
    partes.length >= 2
      ? `${partes[0]}.${partes[partes.length - 1]}`
      : partes[0] ?? "usuario"
  const saneado = local.replace(/[^a-z0-9.]/g, "")
  return `${saneado || "usuario"}@grupofg.com`
}

export function inicialesDesdeNombre(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(/\s+/).filter((p) => p.length > 0)
  if (partes.length === 0) {
    return "?"
  }
  if (partes.length === 1) {
    return partes[0]!.slice(0, 2).toUpperCase()
  }
  const a = partes[0]!.charAt(0)
  const b = partes[partes.length - 1]!.charAt(0)
  return `${a}${b}`.toUpperCase()
}

export function construirPerfilVista(nombreDesdeSesion: string): PerfilLaboralVista {
  const nombreBase =
    nombreDesdeSesion.trim().length > 0 ? nombreDesdeSesion.trim() : "Usuario"
  const partesNombre = nombreBase.split(/\s+/).filter((p) => p.length > 0)
  const nombreCompleto =
    partesNombre.length >= 3
      ? nombreBase
      : partesNombre.length === 2
        ? nombreBase
        : `${nombreBase} Pérez García`

  return {
    nombreCompleto,
    correoElectronico: correoSinteticoDesdeNombre(nombreCompleto),
    area: "Operaciones corporativas",
    sucursal: "Monterrey Centro",
    departamento: "Tesorería y viajes corporativos",
    jefeDirecto: "Lic. Patricia Méndez Ruiz",
  }
}
