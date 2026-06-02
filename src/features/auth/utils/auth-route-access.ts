import {
  PERMISO_AUTOS_RESERVAR,
  PERMISOS_MODULO_GASOLINA,
} from "@/features/auth/constants/auth-permissions"
import { ROL_SUPER_ADMINISTRADOR } from "@/features/auth/constants/auth-roles"

export type RouteAccessRule = {
  /** Al menos uno de estos permisos IAM (si se define). */
  readonly permissionsAny?: readonly string[]
  /** El rol de sesión debe contener alguna de estas cadenas (normalizado). */
  readonly roleIncludesAny?: readonly string[]
  /** Si true, basta cumplir permisos o rol (cuando ambos están definidos). */
  readonly matchAnyCondition?: boolean
}

type RouteAccessEntry = {
  readonly pathPrefix: string
  readonly rule: RouteAccessRule
}

const RUTAS_SIN_RESTRICCION = new Set<string>(["/home", "/profile"])

const REGLAS_POR_RUTA: readonly RouteAccessEntry[] = [
  {
    pathPrefix: "/settings/users-permissions",
    rule: {
      matchAnyCondition: true,
      permissionsAny: ["admin.usuarios"],
      roleIncludesAny: [ROL_SUPER_ADMINISTRADOR],
    },
  },
  {
    pathPrefix: "/travel-request",
    rule: { permissionsAny: ["viajes.solicitar"] },
  },
  {
    pathPrefix: "/travel-approval",
    rule: { permissionsAny: ["viajes.aprobar"] },
  },
  {
    pathPrefix: "/dispersion-travel",
    rule: { permissionsAny: ["viaticos.dispersar"] },
  },
  {
    pathPrefix: "/menu-accounting/reconciliation-checks",
    rule: { roleIncludesAny: ["administrador", ROL_SUPER_ADMINISTRADOR] },
  },
  {
    pathPrefix: "/financial-authorization",
    rule: {
      permissionsAny: ["contabilidad.autorizar", "comprobacion.revisar"],
    },
  },
  {
    pathPrefix: "/menu-accounting",
    rule: { permissionsAny: ["contabilidad.autorizar"] },
  },
  {
    pathPrefix: "/card-assignment",
    rule: { permissionsAny: ["tarjetas.asignar"] },
  },
  {
    pathPrefix: "/travel-expenses",
    rule: { permissionsAny: ["comprobacion.revisar"] },
  },
  {
    pathPrefix: "/gasoline/authorizations",
    rule: { permissionsAny: ["gasolina.autorizar"] },
  },
  {
    pathPrefix: "/gasoline/dispersion",
    rule: { permissionsAny: ["gasolina.dispersar"] },
  },
  {
    pathPrefix: "/gasoline/report",
    rule: { permissionsAny: ["gasolina.reporte"] },
  },
  {
    pathPrefix: "/gasoline/performance",
    rule: { permissionsAny: ["gasolina.rendimiento"] },
  },
  {
    pathPrefix: "/gasoline/request",
    rule: { permissionsAny: ["gasolina.solicitar"] },
  },
  {
    pathPrefix: "/car-reservation",
    rule: { permissionsAny: [PERMISO_AUTOS_RESERVAR] },
  },
].sort((a, b) => b.pathPrefix.length - a.pathPrefix.length)

function normalizarRol(rol: string): string {
  return rol.trim().toLowerCase()
}

function cumplePermisos(
  permisosSesion: readonly string[],
  requeridos: readonly string[],
): boolean {
  return requeridos.some((codigo) => permisosSesion.includes(codigo))
}

function cumpleRol(rolSesion: string, fragmentos: readonly string[]): boolean {
  const rol = normalizarRol(rolSesion)
  return fragmentos.some((fragmento) => rol.includes(fragmento.toLowerCase()))
}

export function resolverReglaAccesoRuta(pathname: string): RouteAccessRule | null {
  if (RUTAS_SIN_RESTRICCION.has(pathname)) {
    return null
  }
  const entrada = REGLAS_POR_RUTA.find((item) => pathname.startsWith(item.pathPrefix))
  return entrada?.rule ?? null
}

export function puedeAccederRuta(
  pathname: string,
  permisosSesion: readonly string[],
  rolSesion: string,
): boolean {
  const regla = resolverReglaAccesoRuta(pathname)
  if (regla === null) {
    return true
  }

  const requierePermisos =
    regla.permissionsAny !== undefined && regla.permissionsAny.length > 0
  const requiereRol =
    regla.roleIncludesAny !== undefined && regla.roleIncludesAny.length > 0

  const cumpleP = requierePermisos
    ? cumplePermisos(permisosSesion, regla.permissionsAny ?? [])
    : true
  const cumpleR = requiereRol
    ? cumpleRol(rolSesion, regla.roleIncludesAny ?? [])
    : true

  if (requierePermisos && requiereRol && regla.matchAnyCondition === true) {
    return cumpleP || cumpleR
  }

  return cumpleP && cumpleR
}

export function puedeVerModuloGasolina(
  permisosSesion: readonly string[],
): boolean {
  return PERMISOS_MODULO_GASOLINA.some((codigo) =>
    permisosSesion.includes(codigo),
  )
}

export function filtrarRutasPorPermiso<T extends { href: string }>(
  items: readonly T[],
  permisosSesion: readonly string[],
  rolSesion: string,
): T[] {
  return items.filter((item) => {
    if (item.href === "#" || item.href.length === 0) {
      return false
    }
    return puedeAccederRuta(item.href, permisosSesion, rolSesion)
  })
}
