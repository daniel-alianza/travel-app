import type { Dispatch, SetStateAction } from "react"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import type { ListaPaginadaMeta } from "@/lib/list-pagination-types"
import type { OpcionFiltroIam, UsuarioIam } from "@/features/iam/interfaces/iam-domain.interface"

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
  filtroDepartamento: string
  setFiltroDepartamento: Dispatch<SetStateAction<string>>
  filtroRol: string
  setFiltroRol: Dispatch<SetStateAction<string>>
  dropdownPillAbierto: string | null
  setDropdownPillAbierto: Dispatch<SetStateAction<string | null>>
  cargarUsuarios: (esRefresco: boolean) => Promise<void>
  opcionesArea: OpcionFiltroIam[]
  opcionesDepartamento: OpcionFiltroIam[]
  opcionesRol: OpcionFiltroIam[]
  metaLista: ListaPaginadaMeta
  usuariosPagina: UsuarioIam[]
  listaVacia: boolean
  actualizarUsuario: (
    id: string,
    parcial: Partial<
      Omit<UsuarioIam, "id" | "permisos" | "aceptacionesPoliticas">
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
}
