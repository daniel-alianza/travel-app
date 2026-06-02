import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { showAppToast } from "@/components/app-toast"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import {
  construirOpcionesFiltroDesdeValores,
  construirOpcionesSelectCatalogo,
  esRolElegibleJefeDirecto,
  nombreCompletoDesdePartes,
  ordenarPermisosSegunDefinicionesIam,
} from "@/features/iam/hooks/iam-page-helpers"
import type { IamUsePageResult } from "@/features/iam/interfaces/iam-use-page-result.interface"
import type { OpcionFiltroIam, UsuarioIam } from "@/features/iam/interfaces/iam-domain.interface"
import {
  fetchIamFilterCatalog,
  fetchIamUsers,
  putIamUserExtraPermissions,
  putIamUserGasolineNotifications,
  putIamUsuarioContrasena,
  type IamFilterCatalogApi,
} from "@/features/iam/services/iam-travel-api"
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
  const [catalogoFiltros, setCatalogoFiltros] =
    useState<IamFilterCatalogApi | null>(null)
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
  const [filtroSucursal, setFiltroSucursal] = useState("")
  const [filtroRol, setFiltroRol] = useState("")
  const [dropdownPillAbierto, setDropdownPillAbierto] = useState<string | null>(
    null,
  )

  const textoBusquedaRef = useRef<string>(textoBusqueda)
  textoBusquedaRef.current = textoBusqueda
  const omitirPrimeraBusquedaDebounced = useRef<boolean>(true)

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
      const [catalogo, lista] = await Promise.all([
        fetchIamFilterCatalog(),
        fetchIamUsers({ search: textoBusquedaRef.current.trim() }),
      ])
      setCatalogoFiltros(catalogo)
      setUsuarios(lista)
    } catch {
      setErrorCarga("No se pudieron cargar los usuarios. Intenta de nuevo.")
      setCatalogoFiltros(null)
      setUsuarios([])
    } finally {
      setCargandoInicial(false)
      setActualizandoLista(false)
    }
  }, [])

  useEffect(() => {
    void cargarUsuarios(false)
  }, [cargarUsuarios])

  useEffect(() => {
    if (omitirPrimeraBusquedaDebounced.current) {
      omitirPrimeraBusquedaDebounced.current = false
      return
    }
    const temporizador = window.setTimeout(() => {
      void (async (): Promise<void> => {
        setActualizandoLista(true)
        try {
          const lista = await fetchIamUsers({
            search: textoBusqueda.trim(),
          })
          setUsuarios(lista)
        } catch {
          showAppToast(
            "No se pudieron actualizar los resultados de búsqueda.",
            "error",
          )
        } finally {
          setActualizandoLista(false)
        }
      })()
    }, 400)
    return () => {
      window.clearTimeout(temporizador)
    }
  }, [textoBusqueda])

  const opcionesArea = useMemo(() => {
    const valores =
      catalogoFiltros !== null && catalogoFiltros.areas.length > 0
        ? catalogoFiltros.areas
        : usuarios.map((u) => u.area)
    return construirOpcionesFiltroDesdeValores(valores, "Todas las áreas")
  }, [catalogoFiltros, usuarios])

  const opcionesSucursal = useMemo(() => {
    const valores =
      catalogoFiltros !== null && catalogoFiltros.sucursales.length > 0
        ? catalogoFiltros.sucursales
        : usuarios.map((u) => u.sucursal)
    return construirOpcionesFiltroDesdeValores(
      valores,
      "Todas las sucursales",
    )
  }, [catalogoFiltros, usuarios])

  const opcionesRol: OpcionFiltroIam[] = useMemo(() => {
    const valores =
      catalogoFiltros !== null && catalogoFiltros.rolesEtiqueta.length > 0
        ? catalogoFiltros.rolesEtiqueta
        : usuarios.map((u) => u.rol)
    return construirOpcionesFiltroDesdeValores(valores, "Todos los roles")
  }, [catalogoFiltros, usuarios])

  const opcionesAreaCatalogo = useMemo(() => {
    const valores =
      catalogoFiltros !== null && catalogoFiltros.areas.length > 0
        ? catalogoFiltros.areas
        : usuarios.map((u) => u.area)
    return construirOpcionesSelectCatalogo(valores)
  }, [catalogoFiltros, usuarios])

  const opcionesSucursalCatalogo = useMemo(() => {
    const valores =
      catalogoFiltros !== null && catalogoFiltros.sucursales.length > 0
        ? catalogoFiltros.sucursales
        : usuarios.map((u) => u.sucursal)
    return construirOpcionesSelectCatalogo(valores)
  }, [catalogoFiltros, usuarios])

  const candidatosJefeDirecto = useMemo(() => {
    return [...usuarios]
      .filter((u) => esRolElegibleJefeDirecto(u.rol))
      .sort((a, b) =>
        nombreCompletoDesdePartes(a).localeCompare(
          nombreCompletoDesdePartes(b),
          "es",
          { sensitivity: "base" },
        ),
      )
  }, [usuarios])

  const usuariosFiltrados = useMemo(() => {
    let lista = usuarios
    if (filtroArea.length > 0) {
      lista = lista.filter((u) => u.area === filtroArea)
    }
    if (filtroSucursal.length > 0) {
      lista = lista.filter((u) => u.sucursal === filtroSucursal)
    }
    if (filtroRol.length > 0) {
      lista = lista.filter((u) => u.rol === filtroRol)
    }
    return lista
  }, [usuarios, filtroArea, filtroSucursal, filtroRol])

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
    filtroSucursal,
    filtroRol,
  ])

  function actualizarUsuario(
    id: string,
    parcial: Partial<
      Omit<
        UsuarioIam,
        | "id"
        | "permisos"
        | "permisosPorDefectoRol"
        | "aceptacionesPoliticas"
        | "gasolinaTesoreriaAprobador"
        | "gasolinaNotificacionDispersion"
      >
    > & {
      permisos?: string[]
      gasolinaTesoreriaAprobador?: boolean
      gasolinaNotificacionDispersion?: boolean
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
        if (u.permisosPorDefectoRol.includes(idPermiso)) {
          return u
        }
        const set = new Set(u.permisos)
        if (marcado) {
          set.add(idPermiso)
        } else {
          set.delete(idPermiso)
        }
        for (const p of u.permisosPorDefectoRol) {
          set.add(p)
        }
        return {
          ...u,
          permisos: ordenarPermisosSegunDefinicionesIam(set),
        }
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
      await putIamUsuarioContrasena(usuario.id, campos.nueva)
      showAppToast(
        `Contraseña actualizada para ${nombreCompletoDesdePartes(usuario)}.`,
        "success",
      )
      establecerCamposContrasena(usuario.id, { nueva: "", confirmar: "" })
    } catch (error) {
      let mensaje = "No se pudo actualizar la contraseña. Intenta de nuevo."
      if (axios.isAxiosError(error)) {
        const cuerpo = error.response?.data as { message?: string } | undefined
        if (
          typeof cuerpo?.message === "string" &&
          cuerpo.message.trim().length > 0
        ) {
          mensaje = cuerpo.message.trim()
        }
      }
      showAppToast(mensaje, "error")
    } finally {
      setActualizandoContrasenaId(null)
    }
  }

  async function guardarUsuario(usuario: UsuarioIam): Promise<void> {
    setGuardandoId(usuario.id)
    try {
      const extras = usuario.permisos.filter(
        (p) => !usuario.permisosPorDefectoRol.includes(p),
      )
      await Promise.all([
        putIamUserExtraPermissions(usuario.id, extras),
        putIamUserGasolineNotifications(usuario.id, {
          treasuryApprover: usuario.gasolinaTesoreriaAprobador,
          dispersalNotify: usuario.gasolinaNotificacionDispersion,
        }),
      ])
      showAppToast(
        `Permisos y notificaciones de gasolina guardados: ${nombreCompletoDesdePartes(usuario)}.`,
        "success",
      )
    } catch (error) {
      let mensaje = "No se pudieron guardar los permisos. Intenta de nuevo."
      if (axios.isAxiosError(error)) {
        const cuerpo = error.response?.data as { message?: string | string[] } | undefined
        const raw = cuerpo?.message
        const texto =
          Array.isArray(raw) ? raw.join(" ") : typeof raw === "string" ? raw : ""
        if (texto.trim().length > 0) {
          mensaje = texto.trim()
        }
      }
      showAppToast(mensaje, "error")
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
    filtroSucursal,
    setFiltroSucursal,
    filtroRol,
    setFiltroRol,
    dropdownPillAbierto,
    setDropdownPillAbierto,
    cargarUsuarios,
    opcionesArea,
    opcionesSucursal,
    opcionesAreaCatalogo,
    opcionesSucursalCatalogo,
    opcionesRol,
    metaLista,
    usuariosPagina,
    candidatosJefeDirecto,
    listaVacia,
    actualizarUsuario,
    alternarPermiso,
    obtenerCamposContrasena,
    establecerCamposContrasena,
    aplicarActualizacionContrasena,
    guardarUsuario,
  }
}
