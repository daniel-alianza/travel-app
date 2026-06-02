export type DefinicionPermisoIam = {
  id: string
  etiqueta: string
  descripcion: string
}

export type DefinicionNotificacionGasolinaIam = {
  id: "treasuryApprover" | "dispersalNotify"
  etiqueta: string
  descripcion: string
}

export type PoliticaCorporativaDef = {
  id: string
  titulo: string
  descripcion: string
}

export type AceptacionPoliticaRegistro = {
  declaroLecturaYAceptacion: boolean
  fechaAceptacion: string | null
}

export type RolIam =
  | "Super Admin"
  | "Administrador"
  | "Supervisor"
  | "Colaborador"

export type UsuarioIam = {
  id: string
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  jefeDirecto: string
  correoElectronico: string
  area: string
  sucursal: string
  rol: RolIam
  activo: boolean
  permisos: string[]
  /** Códigos que vienen del rol en BD; los checkboxes quedan marcados y bloqueados. */
  permisosPorDefectoRol: string[]
  aceptacionesPoliticas: Record<string, AceptacionPoliticaRegistro>
  gasolinaTesoreriaAprobador: boolean
  gasolinaNotificacionDispersion: boolean
}

export type OpcionFiltroIam = {
  value: string
  label: string
}
