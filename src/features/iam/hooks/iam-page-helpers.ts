import {
  POLITICAS_CORPORATIVAS,
  ROLES_IAM,
  VALOR_FILTRO_TODOS,
} from "@/features/iam/interfaces/iam-constants"
import type {
  AceptacionPoliticaRegistro,
  OpcionFiltroIam,
  RolIam,
  UsuarioIam,
} from "@/features/iam/interfaces/iam-domain.interface"

export function esRolIam(valor: string): valor is RolIam {
  return (ROLES_IAM as readonly string[]).includes(valor)
}

export function nombreCompletoDesdePartes(usuario: UsuarioIam): string {
  return [usuario.nombres, usuario.apellidoPaterno, usuario.apellidoMaterno]
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .join(" ")
}

export function semillaAceptacionesPoliticas(
  todasAceptadas: boolean,
  fechaIso: string | null,
): Record<string, AceptacionPoliticaRegistro> {
  const registro: Record<string, AceptacionPoliticaRegistro> = {}
  for (const p of POLITICAS_CORPORATIVAS) {
    registro[p.id] = {
      declaroLecturaYAceptacion: todasAceptadas,
      fechaAceptacion: todasAceptadas ? fechaIso : null,
    }
  }
  return registro
}

export function textoNormalizadoParaBusqueda(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
}

export function inicialesDesdeUsuario(usuario: UsuarioIam): string {
  const n = usuario.nombres.trim()
  const ap = usuario.apellidoPaterno.trim()
  const a = n.length > 0 ? n.charAt(0) : ""
  const b = ap.length > 0 ? ap.charAt(0) : usuario.apellidoMaterno.trim().charAt(0)
  if (a.length === 0 && b.length === 0) {
    return "?"
  }
  if (b.length === 0) {
    return n.slice(0, 2).toUpperCase()
  }
  return `${a}${b}`.toUpperCase()
}

export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function formatearFechaPoliticas(iso: string | null): string {
  if (iso === null) {
    return "—"
  }
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function construirOpcionesFiltroDesdeValores(
  valores: readonly string[],
  etiquetaTodas: string,
): OpcionFiltroIam[] {
  const unicos = [
    ...new Set(
      valores.map((v) => v.trim()).filter((v) => v.length > 0),
    ),
  ].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
  return [
    { value: VALOR_FILTRO_TODOS, label: etiquetaTodas },
    ...unicos.map((v) => ({ value: v, label: v })),
  ]
}
