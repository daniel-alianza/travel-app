import type {
  DefinicionNotificacionGasolinaIam,
  DefinicionPermisoIam,
  PoliticaCorporativaDef,
  RequisitoNotificacionViaticosDispersion,
} from "@/features/iam/interfaces/iam-domain.interface"

export const AREA_TESORERIA_NOMBRE = "Tesoreria" as const

export const DEFINICIONES_PERMISOS: readonly DefinicionPermisoIam[] = [
  {
    id: "viajes.solicitar",
    etiqueta: "Solicitar viáticos",
    descripcion: "Crear y enviar solicitudes de viaje",
  },
  {
    id: "viajes.aprobar",
    etiqueta: "Aprobar solicitudes",
    descripcion: "Autorizar solicitudes de otros usuarios",
  },
  {
    id: "viaticos.dispersar",
    etiqueta: "Dispersión",
    descripcion:
      "Operar cola de dispersión de viáticos. En Tesorería, también habilita avisos por correo y Teams.",
  },
  {
    id: "contabilidad.autorizar",
    etiqueta: "Autorización contable",
    descripcion: "Revisar y autorizar movimientos",
  },
  {
    id: "tarjetas.asignar",
    etiqueta: "Tarjetas corporativas",
    descripcion: "Asignar o desactivar tarjetas",
  },
  {
    id: "comprobacion.revisar",
    etiqueta: "Comprobación",
    descripcion: "Revisar comprobación de gastos",
  },
  {
    id: "gasolina.solicitar",
    etiqueta: "Gasolina · Solicitud",
    descripcion:
      "Crear y consultar solicitudes de combustible (asignado a todos los roles por defecto)",
  },
  {
    id: "gasolina.autorizar",
    etiqueta: "Gasolina · Autorización",
    descripcion: "Aprobar o rechazar solicitudes de gasolina",
  },
  {
    id: "gasolina.dispersar",
    etiqueta: "Gasolina · Dispersión",
    descripcion: "Dispersar fondos de solicitudes de gasolina",
  },
  {
    id: "gasolina.reporte",
    etiqueta: "Gasolina · Reporte",
    descripcion: "Consultar reportes y movimientos de gasolina",
  },
  {
    id: "gasolina.rendimiento",
    etiqueta: "Gasolina · Rendimiento",
    descripcion: "Analizar rendimiento de consumo por vehículo",
  },
  {
    id: "autos.reservar",
    etiqueta: "Reserva de autos",
    descripcion:
      "Acceso al módulo de reserva de vehículos corporativos (asignado a todos los roles por defecto)",
  },
  {
    id: "admin.usuarios",
    etiqueta: "Administración IAM",
    descripcion: "Gestionar usuarios y permisos",
  },
] as const

export const DEFINICIONES_NOTIFICACIONES_GASOLINA: readonly DefinicionNotificacionGasolinaIam[] =
  [
    {
      id: "treasuryApprover",
      etiqueta: "Tesorería gasolina (aprobar/rechazar)",
      descripcion:
        "Puede autorizar o rechazar cualquier solicitud pendiente de combustible.",
    },
    {
      id: "dispersalNotify",
      etiqueta: "Avisos de dispersión gasolina",
      descripcion:
        "Recibe notificaciones cuando hay solicitudes listas para dispersar (cola tesorería).",
    },
  ] as const

export const REQUISITOS_NOTIFICACION_VIATICOS_DISPERSION: readonly RequisitoNotificacionViaticosDispersion[] =
  [
    {
      id: "activo",
      etiqueta: "Usuario activo",
      descripcion: "La cuenta debe estar activa en el sistema.",
    },
    {
      id: "areaTesoreria",
      etiqueta: `Área ${AREA_TESORERIA_NOMBRE}`,
      descripcion:
        "Debe pertenecer al área de Tesorería (misma empresa que la solicitud).",
    },
    {
      id: "permisoDispersar",
      etiqueta: "Permiso de dispersión",
      descripcion: "Debe tener el permiso viaticos.dispersar.",
    },
    {
      id: "correoElectronico",
      etiqueta: "Correo registrado",
      descripcion: "Debe tener un correo válido para recibir la notificación.",
    },
  ] as const

export const OPCIONES_FILTRO_AVISOS_DISPERSION_VIATICOS = [
  { value: "", label: "Todos los avisos" },
  { value: "recibe", label: "Recibe avisos de dispersión" },
  { value: "no_recibe", label: "No recibe avisos de dispersión" },
] as const

export const POLITICAS_CORPORATIVAS: readonly PoliticaCorporativaDef[] = [
  {
    id: "aviso-privacidad",
    titulo: "Aviso de privacidad integral",
    descripcion: "Tratamiento de datos personales conforme a la LFPDPPP.",
  },
  {
    id: "terminos-sistema",
    titulo: "Términos y condiciones de uso del sistema",
    descripcion: "Uso autorizado de la plataforma de viáticos y viajes.",
  },
  {
    id: "codigo-etica",
    titulo: "Código de ética y conducta",
    descripcion: "Principios y reglas de comportamiento organizacional.",
  },
  {
    id: "politica-ciberseguridad",
    titulo: "Política de seguridad de la información",
    descripcion: "Buenas prácticas y responsabilidades en activos digitales.",
  },
  {
    id: "politicas-viaticos",
    titulo: "Políticas de viáticos y comprobación",
    descripcion: "Lineamientos para solicitud, dispersión y comprobación de gastos.",
  },
] as const

export const VALOR_FILTRO_TODOS = ""

export const OPCIONES_TAMANO_PAGINA = [6, 12, 18] as const
