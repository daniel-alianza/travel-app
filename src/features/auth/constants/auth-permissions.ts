/** Coincide con `IAM_KNOWN_PERMISSION_CODES` en travel-api. */
export const PERMISO_VIAJES_SOLICITAR = "viajes.solicitar" as const
export const PERMISO_VIAJES_APROBAR = "viajes.aprobar" as const
export const PERMISO_VIATICOS_DISPERSAR = "viaticos.dispersar" as const
export const PERMISO_CONTABILIDAD_AUTORIZAR = "contabilidad.autorizar" as const
export const PERMISO_TARJETAS_ASIGNAR = "tarjetas.asignar" as const
export const PERMISO_COMPROBACION_REVISAR = "comprobacion.revisar" as const
export const PERMISO_GASOLINA_SOLICITAR = "gasolina.solicitar" as const
export const PERMISO_GASOLINA_AUTORIZAR = "gasolina.autorizar" as const
export const PERMISO_GASOLINA_DISPERSAR = "gasolina.dispersar" as const
export const PERMISO_GASOLINA_REPORTE = "gasolina.reporte" as const
export const PERMISO_GASOLINA_RENDIMIENTO = "gasolina.rendimiento" as const
export const PERMISO_AUTOS_RESERVAR = "autos.reservar" as const
export const PERMISO_IAM_USUARIOS = "admin.usuarios" as const

/** Siempre incluidos en sesión (todos los roles). */
export const PERMISOS_UNIVERSALES = [
  PERMISO_AUTOS_RESERVAR,
  PERMISO_GASOLINA_SOLICITAR,
] as const

export const PERMISOS_MODULO_GASOLINA = [
  PERMISO_GASOLINA_SOLICITAR,
  PERMISO_GASOLINA_AUTORIZAR,
  PERMISO_GASOLINA_DISPERSAR,
  PERMISO_GASOLINA_REPORTE,
  PERMISO_GASOLINA_RENDIMIENTO,
] as const

export const PERMISOS_IAM_CONOCIDOS = [
  PERMISO_VIAJES_SOLICITAR,
  PERMISO_VIAJES_APROBAR,
  PERMISO_VIATICOS_DISPERSAR,
  PERMISO_CONTABILIDAD_AUTORIZAR,
  PERMISO_TARJETAS_ASIGNAR,
  PERMISO_COMPROBACION_REVISAR,
  ...PERMISOS_MODULO_GASOLINA,
  PERMISO_AUTOS_RESERVAR,
  PERMISO_IAM_USUARIOS,
] as const
