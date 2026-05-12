import type {
  DefinicionPermisoIam,
  PoliticaCorporativaDef,
  RolIam,
} from "@/features/iam/interfaces/iam-domain.interface"

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
    descripcion: "Operar dispersión de fondos",
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
    id: "admin.usuarios",
    etiqueta: "Administración IAM",
    descripcion: "Gestionar usuarios y permisos",
  },
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

export const ROLES_IAM: readonly RolIam[] = [
  "Super Admin",
  "Administrador",
  "Supervisor",
  "Colaborador",
]

export const ROLES_ELEGIBLES_JEFE_DIRECTO: readonly RolIam[] = [
  "Administrador",
  "Supervisor",
]

export const VALOR_FILTRO_TODOS = ""

export const OPCIONES_TAMANO_PAGINA = [6, 12, 18] as const
