import { PERMISO_VIATICOS_DISPERSAR } from "@/features/auth/constants/auth-permissions"
import {
  AREA_TESORERIA_NOMBRE,
  DEFINICIONES_PERMISOS,
  POLITICAS_CORPORATIVAS,
  REQUISITOS_NOTIFICACION_VIATICOS_DISPERSION,
  VALOR_FILTRO_TODOS,
} from "@/features/iam/interfaces/iam-constants"
import type {
  AceptacionPoliticaRegistro,
  EvaluacionRequisitoNotificacionViaticosDispersion,
  OpcionFiltroIam,
  RolIam,
  UsuarioIam,
} from "@/features/iam/interfaces/iam-domain.interface"

export function esRolIam(valor: string): valor is RolIam {
  return valor.trim().length > 0
}

export function ordenarPermisosSegunDefinicionesIam(
  codes: ReadonlySet<string>,
): string[] {
  return DEFINICIONES_PERMISOS.map((def) => def.id).filter((id) => codes.has(id))
}

export function esRolElegibleJefeDirecto(
  rol: RolIam,
  rolesElegiblesJefeDirecto: readonly string[],
): boolean {
  return rolesElegiblesJefeDirecto.includes(rol)
}

export function resolverRolInicialDesdeCatalogo(
  rolesEtiqueta: readonly string[],
): string {
  const colaborador = rolesEtiqueta.find((rol) => rol === "Colaborador")
  if (colaborador !== undefined) {
    return colaborador
  }
  return rolesEtiqueta[0] ?? ""
}

export type EstadoLineaCoincidenciaContrasenaIam =
  | "neutro"
  | "amarillo"
  | "rojo"
  | "verde"

export function estadoLineaCoincidenciaContrasena(
  nueva: string,
  confirmar: string,
): EstadoLineaCoincidenciaContrasenaIam {
  if (nueva.length === 0 && confirmar.length === 0) {
    return "neutro"
  }
  if (nueva.length > 0 && confirmar.length === 0) {
    return "amarillo"
  }
  if (nueva !== confirmar) {
    return "rojo"
  }
  if (nueva.length < 8) {
    return "amarillo"
  }
  return "verde"
}

export function resolverManagerUserIdParaApi(
  usuario: UsuarioIam,
  candidatosJefeDirecto: readonly UsuarioIam[],
): number | null {
  const candidatos = candidatosJefeDirecto.filter((c) => c.id !== usuario.id)
  const valorSelect = resolverValorSelectJefeDirecto(
    usuario.jefeDirecto,
    candidatos,
  )
  if (valorSelect.length === 0) {
    return null
  }
  const id = Number(valorSelect)
  if (!Number.isFinite(id) || id <= 0) {
    return null
  }
  return id
}

export function resolverValorSelectJefeDirecto(
  jefeDirecto: string,
  candidatos: readonly UsuarioIam[],
): string {
  const texto = jefeDirecto.trim()
  if (texto.length === 0) {
    return ""
  }
  if (candidatos.some((c) => c.id === texto)) {
    return texto
  }
  const porNombre = candidatos.find(
    (c) => nombreCompletoDesdePartes(c) === texto,
  )
  if (porNombre !== undefined) {
    return porNombre.id
  }
  const porCorreo = candidatos.find((c) => c.correoElectronico === texto)
  if (porCorreo !== undefined) {
    return porCorreo.id
  }
  return ""
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

export function construirOpcionesSelectCatalogo(
  valores: readonly string[],
): OpcionFiltroIam[] {
  const unicos = [
    ...new Set(
      valores.map((v) => v.trim()).filter((v) => v.length > 0),
    ),
  ].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
  return unicos.map((v) => ({ value: v, label: v }))
}

export function opcionesSelectConValorActual(
  opcionesBase: readonly OpcionFiltroIam[],
  valorActual: string,
): OpcionFiltroIam[] {
  const valor = valorActual.trim()
  if (valor.length === 0) {
    return [...opcionesBase]
  }
  if (opcionesBase.some((opcion) => opcion.value === valor)) {
    return [...opcionesBase]
  }
  return [...opcionesBase, { value: valor, label: valor }].sort((a, b) =>
    a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
  )
}

export function evaluarRequisitosNotificacionDispersionViaticos(
  usuario: UsuarioIam,
): readonly EvaluacionRequisitoNotificacionViaticosDispersion[] {
  const cumpleArea =
    usuario.area.trim().localeCompare(AREA_TESORERIA_NOMBRE, "es", {
      sensitivity: "base",
    }) === 0

  return REQUISITOS_NOTIFICACION_VIATICOS_DISPERSION.map((requisito) => {
    let cumplido = false

    switch (requisito.id) {
      case "activo":
        cumplido = usuario.activo
        break
      case "areaTesoreria":
        cumplido = cumpleArea
        break
      case "permisoDispersar":
        cumplido = usuario.permisos.includes(PERMISO_VIATICOS_DISPERSAR)
        break
      case "correoElectronico":
        cumplido = usuario.correoElectronico.trim().length > 0
        break
      default:
        cumplido = false
    }

    return { id: requisito.id, cumplido }
  })
}

export function usuarioRecibeAvisosDispersionViaticos(
  usuario: UsuarioIam,
): boolean {
  return evaluarRequisitosNotificacionDispersionViaticos(usuario).every(
    (requisito) => requisito.cumplido,
  )
}

export function usuarioTienePermisoDispersarViaticosPorRol(
  usuario: UsuarioIam,
): boolean {
  return usuario.permisosPorDefectoRol.includes(PERMISO_VIATICOS_DISPERSAR)
}
