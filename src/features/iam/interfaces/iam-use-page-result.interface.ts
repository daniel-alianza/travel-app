import type { Dispatch, SetStateAction } from "react"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import type { ListaPaginadaMeta } from "@/lib/list-pagination-types"
import type {
  FiltroAvisosDispersionViaticosIam,
  OpcionFiltroIam,
  UsuarioIam,
} from "@/features/iam/interfaces/iam-domain.interface"
import type { IamFilterCatalogApi } from "@/features/iam/services/iam-travel-api"
import type { IamRegistroUsuarioFormValues } from "@/features/iam/schemas/iam-registro-usuario.schema"

export type IamUsePageResult = {
  mounted: boolean
  mousePosition: TravelRequestMousePosition
  onBackToHome: () => void
  cargandoInicial: boolean
  actualizandoLista: boolean
  errorCarga: string | null
  textoBusqueda: string
  setTextoBusqueda: Dispatch<SetStateAction<string>>
  pagina: number
  setPagina: Dispatch<SetStateAction<number>>
  tamanoPagina: number
  setTamanoPagina: Dispatch<SetStateAction<number>>
  guardandoId: string | null
  actualizandoContrasenaId: string | null
  filtroArea: string
  setFiltroArea: Dispatch<SetStateAction<string>>
  filtroSucursal: string
  setFiltroSucursal: Dispatch<SetStateAction<string>>
  filtroRol: string
  setFiltroRol: Dispatch<SetStateAction<string>>
  filtroAvisosDispersionViaticos: FiltroAvisosDispersionViaticosIam
  setFiltroAvisosDispersionViaticos: Dispatch<
    SetStateAction<FiltroAvisosDispersionViaticosIam>
  >
  dropdownPillAbierto: string | null
  setDropdownPillAbierto: Dispatch<SetStateAction<string | null>>
  cargarUsuarios: (esRefresco: boolean) => Promise<void>
  opcionesArea: OpcionFiltroIam[]
  opcionesSucursal: OpcionFiltroIam[]
  opcionesAreaCatalogo: OpcionFiltroIam[]
  opcionesSucursalCatalogo: OpcionFiltroIam[]
  opcionesRolCatalogo: OpcionFiltroIam[]
  rolesEtiqueta: readonly string[]
  opcionesRol: OpcionFiltroIam[]
  metaLista: ListaPaginadaMeta
  usuariosPagina: UsuarioIam[]
  candidatosJefeDirecto: UsuarioIam[]
  listaVacia: boolean
  limpiarFiltros: () => void
  actualizarUsuario: (
    id: string,
    parcial: Partial<
      Omit<UsuarioIam, "id" | "permisos" | "permisosPorDefectoRol" | "aceptacionesPoliticas">
    > & {
      permisos?: string[]
    },
  ) => void
  alternarPermiso: (
    idUsuario: string,
    idPermiso: string,
    marcado: boolean,
  ) => void
  obtenerCamposContrasena: (
    idUsuario: string,
  ) => { nueva: string; confirmar: string }
  establecerCamposContrasena: (
    idUsuario: string,
    parcial: Partial<{ nueva: string; confirmar: string }>,
  ) => void
  aplicarActualizacionContrasena: (usuario: UsuarioIam) => Promise<void>
  guardarUsuario: (usuario: UsuarioIam) => Promise<void>
  modalRegistroAbierto: boolean
  setModalRegistroAbierto: Dispatch<SetStateAction<boolean>>
  registrandoUsuario: boolean
  catalogoRegistro: IamFilterCatalogApi["registro"]
  registrarUsuario: (valores: IamRegistroUsuarioFormValues) => Promise<void>
}
