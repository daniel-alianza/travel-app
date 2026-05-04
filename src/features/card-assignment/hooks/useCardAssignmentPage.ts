import { useEffect, useMemo, useState } from "react"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { showAppToast } from "@/components/app-toast"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { CARD_ASSIGNMENT_USERS_SEED } from "@/features/card-assignment/data/card-assignment-seed"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import { limitarPagina } from "@/lib/list-pagination-helpers"
import type { ListaPaginada } from "@/lib/list-pagination-types"
import type { CardAssignmentUser } from "../interfaces/card-assignment-user.interface"
import type { AsignacionTarjetaFormValues } from "../schemas/card-assignment-assign.schema"
import {
  asignarTarjetaUsuario,
  desactivarTarjetaUsuario,
  obtenerUsuariosAsignacionTarjeta,
  type CardAssignmentUsersListQuery,
} from "../services/card-assignment-api"
import { FILTRO_TODAS_CARD_ASSIGNMENT } from "../utils/card-assignment-usuarios-filtro"

const QUERY_KEY_RAIZ = ["card-assignment", "users"] as const

const TAMANOS_PAGINA_OPCIONES = [6, 9, 12] as const
const TAMANO_PAGINA_DEFECTO = 9

interface OpcionFiltro {
  value: string
  label: string
}

function construirOpcionesCompania(
  usuarios: CardAssignmentUser[]
): OpcionFiltro[] {
  const valores = [...new Set(usuarios.map((u) => u.compania))].sort(
    (a, b) => a.localeCompare(b, "es")
  )
  return [
    { value: FILTRO_TODAS_CARD_ASSIGNMENT, label: "Todas las compañías" },
    ...valores.map((c) => ({ value: c, label: c })),
  ]
}

function construirOpcionesArea(usuarios: CardAssignmentUser[]): OpcionFiltro[] {
  const valores = [...new Set(usuarios.map((u) => u.area))].sort((a, b) =>
    a.localeCompare(b, "es")
  )
  return [
    { value: FILTRO_TODAS_CARD_ASSIGNMENT, label: "Todas las áreas" },
    ...valores.map((a) => ({ value: a, label: a })),
  ]
}

function actualizarUsuarioEnCachesPaginados(
  queryClient: ReturnType<typeof useQueryClient>,
  usuarioId: string,
  actualizado: CardAssignmentUser
): void {
  queryClient.setQueriesData<ListaPaginada<CardAssignmentUser>>(
    { queryKey: [...QUERY_KEY_RAIZ] },
    (anterior) => {
      if (!anterior) {
        return anterior
      }
      return {
        ...anterior,
        items: anterior.items.map((u) =>
          u.id === usuarioId ? actualizado : u
        ),
      }
    }
  )
}

interface UseCardAssignmentPageReturn {
  mousePosition: TravelRequestMousePosition
  textoBusqueda: string
  setTextoBusqueda: (valor: string) => void
  filtroCompania: string
  setFiltroCompania: (valor: string) => void
  filtroArea: string
  setFiltroArea: (valor: string) => void
  opcionesCompania: ReadonlyArray<OpcionFiltro>
  opcionesArea: ReadonlyArray<OpcionFiltro>
  dropdownPillAbierto: string | null
  setDropdownPillAbierto: (id: string | null) => void
  usuariosFiltrados: CardAssignmentUser[]
  usuariosCarga: boolean
  listaVaciaPorFiltros: boolean
  usuariosError: boolean
  actualizandoLista: boolean
  onRefrescar: () => void
  usuarioEnAccion: (userId: string) => boolean
  usuarioModalAsignacion: CardAssignmentUser | null
  abrirModalAsignacion: (usuario: CardAssignmentUser) => void
  cerrarModalAsignacion: () => void
  confirmarAsignacionDesdeModal: (valores: AsignacionTarjetaFormValues) => void
  asignacionModalCargando: boolean
  desactivacionEnCurso: boolean
  onDesactivarTarjeta: (usuario: CardAssignmentUser) => void
  pagina: number
  totalPaginas: number
  tamanoPagina: number
  totalResultados: number
  onPaginaAnterior: () => void
  onPaginaSiguiente: () => void
  onCambiarTamanoPagina: (tamano: number) => void
  opcionesTamanoPagina: readonly number[]
}

export function useCardAssignmentPage(): UseCardAssignmentPageReturn {
  const queryClient = useQueryClient()
  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [textoBusqueda, setTextoBusqueda] = useState("")
  const textoBusquedaDebounced = useDebouncedValue(textoBusqueda, 380)
  const [filtroCompania, setFiltroCompaniaState] = useState(
    FILTRO_TODAS_CARD_ASSIGNMENT
  )
  const [filtroArea, setFiltroAreaState] = useState(FILTRO_TODAS_CARD_ASSIGNMENT)
  const [pagina, setPagina] = useState(1)
  const [tamanoPagina, setTamanoPagina] = useState(TAMANO_PAGINA_DEFECTO)
  const [dropdownPillAbierto, setDropdownPillAbierto] = useState<string | null>(
    null
  )
  const [usuarioModalAsignacion, setUsuarioModalAsignacion] =
    useState<CardAssignmentUser | null>(null)

  const opcionesCompania = useMemo(
    () => construirOpcionesCompania(CARD_ASSIGNMENT_USERS_SEED),
    []
  )

  const opcionesArea = useMemo(
    () => construirOpcionesArea(CARD_ASSIGNMENT_USERS_SEED),
    []
  )

  const valoresCompaniaValidos = useMemo(
    () =>
      new Set(
        opcionesCompania
          .map((o) => o.value)
          .filter((v) => v !== FILTRO_TODAS_CARD_ASSIGNMENT)
      ),
    [opcionesCompania]
  )

  const valoresAreaValidos = useMemo(
    () =>
      new Set(
        opcionesArea
          .map((o) => o.value)
          .filter((v) => v !== FILTRO_TODAS_CARD_ASSIGNMENT)
      ),
    [opcionesArea]
  )

  const filtroCompaniaEfectivo = valoresCompaniaValidos.has(filtroCompania)
    ? filtroCompania
    : FILTRO_TODAS_CARD_ASSIGNMENT

  const filtroAreaEfectivo = valoresAreaValidos.has(filtroArea)
    ? filtroArea
    : FILTRO_TODAS_CARD_ASSIGNMENT

  function setFiltroCompania(valor: string): void {
    setPagina(1)
    setFiltroCompaniaState(valor)
  }

  function setFiltroArea(valor: string): void {
    setPagina(1)
    setFiltroAreaState(valor)
  }

  const parametrosConsulta: CardAssignmentUsersListQuery = useMemo(
    () => ({
      page: pagina,
      pageSize: tamanoPagina,
      search: textoBusquedaDebounced.trim(),
      compania:
        filtroCompaniaEfectivo === FILTRO_TODAS_CARD_ASSIGNMENT
          ? ""
          : filtroCompaniaEfectivo,
      area:
        filtroAreaEfectivo === FILTRO_TODAS_CARD_ASSIGNMENT
          ? ""
          : filtroAreaEfectivo,
    }),
    [
      pagina,
      tamanoPagina,
      textoBusquedaDebounced,
      filtroCompaniaEfectivo,
      filtroAreaEfectivo,
    ]
  )

  const consultaUsuarios = useQuery({
    queryKey: [...QUERY_KEY_RAIZ, parametrosConsulta],
    queryFn: () => obtenerUsuariosAsignacionTarjeta(parametrosConsulta),
    placeholderData: keepPreviousData,
    staleTime: 45_000,
  })

  const meta = consultaUsuarios.data?.meta

  const paginaMostrada = useMemo(() => {
    if (meta === undefined) {
      return pagina
    }
    return limitarPagina(pagina, meta.totalPages)
  }, [pagina, meta])
  const usuariosFiltrados = useMemo(
    () => consultaUsuarios.data?.items ?? [],
    [consultaUsuarios.data]
  )

  const totalResultados = meta?.total ?? 0
  const totalPaginas = meta?.totalPages ?? 1

  const hayCriteriosListado =
    textoBusquedaDebounced.trim().length > 0 ||
    filtroCompaniaEfectivo !== FILTRO_TODAS_CARD_ASSIGNMENT ||
    filtroAreaEfectivo !== FILTRO_TODAS_CARD_ASSIGNMENT

  const listaVaciaPorFiltros =
    !consultaUsuarios.isLoading &&
    !consultaUsuarios.isError &&
    totalResultados === 0 &&
    hayCriteriosListado

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- nueva búsqueda debounced: volver a la página 1
    setPagina(1)
  }, [textoBusquedaDebounced])

  useEffect(() => {
    if (meta !== undefined && pagina > meta.totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- alinear con totalPages del listado cargado
      setPagina(meta.totalPages)
    }
  }, [meta, pagina])

  const [idsUsuarioEnAccion, setIdsUsuarioEnAccion] = useState<Set<string>>(
    () => new Set()
  )

  function agregarUsuarioEnAccion(userId: string): void {
    setIdsUsuarioEnAccion((anterior) => new Set(anterior).add(userId))
  }

  function quitarUsuarioEnAccion(userId: string): void {
    setIdsUsuarioEnAccion((anterior) => {
      const siguiente = new Set(anterior)
      siguiente.delete(userId)
      return siguiente
    })
  }

  const mutacionAsignar = useMutation({
    mutationFn: asignarTarjetaUsuario,
    onMutate: (parametros) => {
      agregarUsuarioEnAccion(parametros.usuario.id)
    },
    onSuccess: (actualizado) => {
      actualizarUsuarioEnCachesPaginados(
        queryClient,
        actualizado.id,
        actualizado
      )
      setUsuarioModalAsignacion(null)
      showAppToast("Tarjeta asignada correctamente.", "success")
    },
    onError: () => {
      showAppToast("No se pudo asignar la tarjeta.", "error")
    },
    onSettled: (_datos, _error, parametros) => {
      quitarUsuarioEnAccion(parametros.usuario.id)
    },
  })

  const mutacionDesactivar = useMutation({
    mutationFn: (usuario: CardAssignmentUser) =>
      desactivarTarjetaUsuario(usuario.id, usuario),
    onMutate: (usuario) => {
      agregarUsuarioEnAccion(usuario.id)
    },
    onSuccess: (actualizado) => {
      actualizarUsuarioEnCachesPaginados(
        queryClient,
        actualizado.id,
        actualizado
      )
      showAppToast("Tarjeta desactivada correctamente.", "success")
    },
    onError: () => {
      showAppToast("No se pudo desactivar la tarjeta.", "error")
    },
    onSettled: (_datos, _error, usuario) => {
      quitarUsuarioEnAccion(usuario.id)
    },
  })

  function usuarioEnAccion(userId: string): boolean {
    return idsUsuarioEnAccion.has(userId)
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  function onRefrescar(): void {
    void queryClient.invalidateQueries({ queryKey: [...QUERY_KEY_RAIZ] })
  }

  function abrirModalAsignacion(usuario: CardAssignmentUser): void {
    setUsuarioModalAsignacion(usuario)
  }

  function cerrarModalAsignacion(): void {
    setUsuarioModalAsignacion(null)
  }

  function confirmarAsignacionDesdeModal(
    valores: AsignacionTarjetaFormValues
  ): void {
    if (usuarioModalAsignacion === null) {
      return
    }
    mutacionAsignar.mutate({
      usuario: usuarioModalAsignacion,
      digitosTarjeta: valores.digitosTarjeta,
      empresaTarjeta: valores.empresaTarjeta,
    })
  }

  function onDesactivarTarjeta(usuario: CardAssignmentUser): void {
    if (mutacionDesactivar.isPending) {
      return
    }
    mutacionDesactivar.mutate(usuario)
  }

  function onPaginaAnterior(): void {
    setPagina((p) => Math.max(1, p - 1))
  }

  function onPaginaSiguiente(): void {
    setPagina((p) => Math.min(totalPaginas, p + 1))
  }

  function onCambiarTamanoPagina(tamano: number): void {
    if (!TAMANOS_PAGINA_OPCIONES.some((n) => n === tamano)) {
      return
    }
    setPagina(1)
    setTamanoPagina(tamano)
  }

  return {
    mousePosition,
    textoBusqueda,
    setTextoBusqueda,
    filtroCompania: filtroCompaniaEfectivo,
    setFiltroCompania,
    filtroArea: filtroAreaEfectivo,
    setFiltroArea,
    opcionesCompania,
    opcionesArea,
    dropdownPillAbierto,
    setDropdownPillAbierto,
    usuariosFiltrados,
    usuariosCarga: consultaUsuarios.isLoading,
    listaVaciaPorFiltros,
    usuariosError: consultaUsuarios.isError,
    actualizandoLista:
      consultaUsuarios.isFetching && !consultaUsuarios.isLoading,
    onRefrescar,
    usuarioEnAccion,
    usuarioModalAsignacion,
    abrirModalAsignacion,
    cerrarModalAsignacion,
    confirmarAsignacionDesdeModal,
    asignacionModalCargando: mutacionAsignar.isPending,
    desactivacionEnCurso: mutacionDesactivar.isPending,
    onDesactivarTarjeta,
    pagina: paginaMostrada,
    totalPaginas,
    tamanoPagina,
    totalResultados,
    onPaginaAnterior,
    onPaginaSiguiente,
    onCambiarTamanoPagina,
    opcionesTamanoPagina: TAMANOS_PAGINA_OPCIONES,
  }
}
