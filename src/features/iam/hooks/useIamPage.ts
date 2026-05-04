import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { showAppToast } from "@/components/app-toast"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import { USUARIOS_SEMILLA } from "@/features/iam/hooks/iam-usuarios-semilla"
import {
  construirOpcionesFiltroDesdeValores,
  esperar,
  nombreCompletoDesdePartes,
  textoNormalizadoParaBusqueda,
} from "@/features/iam/hooks/iam-page-helpers"
import type { IamUsePageResult } from "@/features/iam/interfaces/iam-use-page-result.interface"
import { ROLES_IAM, VALOR_FILTRO_TODOS } from "@/features/iam/interfaces/iam-constants"
import type { OpcionFiltroIam, UsuarioIam } from "@/features/iam/interfaces/iam-domain.interface"
import {
  construirMetaDesdeTotal,
  limitarPagina,
  rebanarPagina,
} from "@/lib/list-pagination-helpers"

export function useIamPage(): IamUsePageResult {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [usuarios, setUsuarios] = useState<UsuarioIam[]>([])
  const [cargandoInicial, setCargandoInicial] = useState(true)
  const [actualizandoLista, setActualizandoLista] = useState(false)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [textoBusqueda, setTextoBusqueda] = useState("")
  const [pagina, setPagina] = useState(1)
  const [tamanoPagina, setTamanoPagina] = useState<number>(6)
  const [guardandoId, setGuardandoId] = useState<string | null>(null)
  const [contrasenaPorUsuario, setContrasenaPorUsuario] = useState<
    Record<string, { nueva: string; confirmar: string }>
  >({})
  const [actualizandoContrasenaId, setActualizandoContrasenaId] = useState<
    string | null
  >(null)
  const [filtroArea, setFiltroArea] = useState("")
  const [filtroDepartamento, setFiltroDepartamento] = useState("")
  const [filtroRol, setFiltroRol] = useState("")
  const [dropdownPillAbierto, setDropdownPillAbierto] = useState<string | null>(
    null,
  )

  useEffect(() => {
    setMounted(true)
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const cargarUsuarios = useCallback(async (esRefresco: boolean): Promise<void> => {
    if (esRefresco) {
      setActualizandoLista(true)
    } else {
      setCargandoInicial(true)
    }
    setErrorCarga(null)
    try {
      await esperar(esRefresco ? 650 : 950)
      setUsuarios(
        USUARIOS_SEMILLA.map((u) => ({
          ...u,
          permisos: [...u.permisos],
          aceptacionesPoliticas: Object.fromEntries(
            Object.entries(u.aceptacionesPoliticas).map(([k, v]) => [
              k,
              { ...v },
            ]),
          ),
        })),
      )
    } catch {
      setErrorCarga("No se pudieron cargar los usuarios. Intenta de nuevo.")
      setUsuarios([])
    } finally {
      setCargandoInicial(false)
      setActualizandoLista(false)
    }
  }, [])

  useEffect(() => {
    void cargarUsuarios(false)
  }, [cargarUsuarios])

  const opcionesArea = useMemo(() => {
    return construirOpcionesFiltroDesdeValores(
      usuarios.map((u) => u.area),
      "Todas las áreas",
    )
  }, [usuarios])

  const opcionesDepartamento = useMemo(() => {
    return construirOpcionesFiltroDesdeValores(
      usuarios.map((u) => u.departamento),
      "Todos los departamentos",
    )
  }, [usuarios])

  const opcionesRol: OpcionFiltroIam[] = useMemo(() => {
    return [
      { value: VALOR_FILTRO_TODOS, label: "Todos los roles" },
      ...ROLES_IAM.map((r) => ({ value: r, label: r })),
    ]
  }, [])

  const usuariosFiltrados = useMemo(() => {
    const q = textoNormalizadoParaBusqueda(textoBusqueda.trim())
    let lista = usuarios
    if (q.length > 0) {
      lista = lista.filter((u) => {
        const blob = textoNormalizadoParaBusqueda(
          `${nombreCompletoDesdePartes(u)} ${u.jefeDirecto} ${u.correoElectronico} ${u.area} ${u.departamento} ${u.rol} ${u.telefono}`,
        )
        return blob.includes(q)
      })
    }
    if (filtroArea.length > 0) {
      lista = lista.filter((u) => u.area === filtroArea)
    }
    if (filtroDepartamento.length > 0) {
      lista = lista.filter((u) => u.departamento === filtroDepartamento)
    }
    if (filtroRol.length > 0) {
      lista = lista.filter((u) => u.rol === filtroRol)
    }
    return lista
  }, [
    usuarios,
    textoBusqueda,
    filtroArea,
    filtroDepartamento,
    filtroRol,
  ])

  const metaLista = useMemo(() => {
    return construirMetaDesdeTotal(
      pagina,
      tamanoPagina,
      usuariosFiltrados.length,
    )
  }, [pagina, tamanoPagina, usuariosFiltrados.length])

  const paginaSegura = limitarPagina(pagina, metaLista.totalPages)

  const usuariosPagina = useMemo(() => {
    return rebanarPagina(usuariosFiltrados, paginaSegura, tamanoPagina)
  }, [usuariosFiltrados, paginaSegura, tamanoPagina])

  useEffect(() => {
    if (pagina !== paginaSegura) {
      setPagina(paginaSegura)
    }
  }, [pagina, paginaSegura])

  useEffect(() => {
    setPagina(1)
  }, [
    textoBusqueda,
    tamanoPagina,
    filtroArea,
    filtroDepartamento,
    filtroRol,
  ])

  function actualizarUsuario(
    id: string,
    parcial: Partial<Omit<UsuarioIam, "id" | "permisos" | "aceptacionesPoliticas">> & {
      permisos?: string[]
    },
  ): void {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id !== id) {
          return u
        }
        const { permisos, ...campos } = parcial
        return {
          ...u,
          ...campos,
          permisos: permisos !== undefined ? [...permisos] : u.permisos,
        }
      }),
    )
  }

  function alternarPermiso(idUsuario: string, idPermiso: string, marcado: boolean): void {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id !== idUsuario) {
          return u
        }
        const set = new Set(u.permisos)
        if (marcado) {
          set.add(idPermiso)
        } else {
          set.delete(idPermiso)
        }
        return { ...u, permisos: [...set] }
      }),
    )
  }

  function obtenerCamposContrasena(
    idUsuario: string,
  ): { nueva: string; confirmar: string } {
    return contrasenaPorUsuario[idUsuario] ?? { nueva: "", confirmar: "" }
  }

  function establecerCamposContrasena(
    idUsuario: string,
    parcial: Partial<{ nueva: string; confirmar: string }>,
  ): void {
    setContrasenaPorUsuario((prev) => {
      const actual = prev[idUsuario] ?? { nueva: "", confirmar: "" }
      return {
        ...prev,
        [idUsuario]: { ...actual, ...parcial },
      }
    })
  }

  async function aplicarActualizacionContrasena(usuario: UsuarioIam): Promise<void> {
    const campos = obtenerCamposContrasena(usuario.id)
    if (campos.nueva.length < 8) {
      showAppToast(
        "La nueva contraseña debe tener al menos 8 caracteres.",
        "error",
      )
      return
    }
    if (campos.nueva !== campos.confirmar) {
      showAppToast("La confirmación no coincide con la nueva contraseña.", "error")
      return
    }
    setActualizandoContrasenaId(usuario.id)
    try {
      await esperar(520)
      showAppToast(
        `Contraseña actualizada para ${nombreCompletoDesdePartes(usuario)}.`,
        "success",
      )
      establecerCamposContrasena(usuario.id, { nueva: "", confirmar: "" })
    } finally {
      setActualizandoContrasenaId(null)
    }
  }

  async function guardarUsuario(usuario: UsuarioIam): Promise<void> {
    setGuardandoId(usuario.id)
    try {
      await esperar(480)
      showAppToast(
        `Cambios guardados: ${nombreCompletoDesdePartes(usuario)}.`,
        "success",
      )
    } finally {
      setGuardandoId(null)
    }
  }

  const listaVacia = !cargandoInicial && !errorCarga && usuariosFiltrados.length === 0

  const onBackToHome = useCallback(() => {
    navigate("/home")
  }, [navigate])

  return {
    mounted,
    mousePosition,
    onBackToHome,
    cargandoInicial,
    actualizandoLista,
    errorCarga,
    textoBusqueda,
    setTextoBusqueda,
    pagina,
    setPagina,
    tamanoPagina,
    setTamanoPagina,
    guardandoId,
    actualizandoContrasenaId,
    filtroArea,
    setFiltroArea,
    filtroDepartamento,
    setFiltroDepartamento,
    filtroRol,
    setFiltroRol,
    dropdownPillAbierto,
    setDropdownPillAbierto,
    cargarUsuarios,
    opcionesArea,
    opcionesDepartamento,
    opcionesRol,
    metaLista,
    usuariosPagina,
    listaVacia,
    actualizarUsuario,
    alternarPermiso,
    obtenerCamposContrasena,
    establecerCamposContrasena,
    aplicarActualizacionContrasena,
    guardarUsuario,
  }
}
