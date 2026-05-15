import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SetStateAction,
} from "react"

import { showAppToast } from "@/components/app-toast"
import {
  esperar,
  filtrosTienenValor,
  indiceSolicitudEnLista,
  montoTotalPorIdsMovimientos,
  movimientoElegibleEnvioSapMock,
  movimientosComprobadosDeSolicitud,
  movimientosConComprobacionUsuarioColaborador,
  solicitudCoincideFiltros,
  solicitudVisibleEnColaContabilidadMock,
  totalComprobadoSolicitud,
} from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import {
  fetchFinancialAuthorizationFilterCatalog,
  fetchFinancialAuthorizationRequests,
  fetchViaticDistributionRules,
  postTripMovementProofAccountingApprove,
  type ViaticDistributionRuleOption,
} from "@/features/financial-authorization/services/financial-authorization-api"
import type { FiltrosAutorizacionFinanciera } from "@/features/financial-authorization/interfaces/financial-authorization-filtros.interface"
import type { FinancialAuthorizationPageController } from "@/features/financial-authorization/interfaces/financial-authorization-page-controller.interface"
import type { FinancialAuthorizationSolicitudPendienteRevision } from "@/features/financial-authorization/interfaces/financial-authorization-solicitud.interface"
import type { FinancialAuthorizationViajeEnSolicitud } from "@/features/financial-authorization/interfaces/financial-authorization-viaje.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import {
  calcularTotalPaginas,
  limitarPagina,
  rebanarPagina,
} from "@/lib/list-pagination-helpers"

const TAMANOS_PAGINA_LISTADO_FIN = [4, 8, 12] as const

const USUARIO_CIERRE_CONTABILIDAD_MOCK = "Laura Méndez — Contabilidad"

export function useFinancialAuthorizationPage(): FinancialAuthorizationPageController {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [solicitudes, setSolicitudes] = useState<
    FinancialAuthorizationSolicitudPendienteRevision[]
  >([])
  const [idSolicitudEnRevision, setIdSolicitudEnRevision] = useState<
    string | null
  >(null)
  const [movimientoSeleccionadoId, setMovimientoSeleccionadoId] = useState<
    string | null
  >(null)
  const [indiceViajeActivo, setIndiceViajeActivo] = useState(0)
  const [idsMovimientosParaEnvio, setIdsMovimientosParaEnvio] = useState<
    string[]
  >([])
  const [comentarioRevision, setComentarioRevision] = useState("")
  const [detalleMovimientoTransicion, setDetalleMovimientoTransicion] =
    useState(false)
  const [descargaEnCurso, setDescargaEnCurso] = useState<"xml" | "pdf" | null>(
    null
  )
  const [solicitudIdAbriendoRevision, setSolicitudIdAbriendoRevision] =
    useState<string | null>(null)
  const [normaReparto, setNormaReparto] = useState("")
  const [categoriaCfdiConcepto, setCategoriaCfdiConcepto] = useState("")
  const [indicadorImpCfdiConcepto, setIndicadorImpCfdiConcepto] = useState("")
  const [filtros, setFiltros] = useState<FiltrosAutorizacionFinanciera>({
    textoNombre: "",
    textoCorreo: "",
    ultimos4Tarjeta: "",
    montoMin: "",
    montoMax: "",
    compania: "",
    area: "",
  })
  const [paginaListado, setPaginaListado] = useState(1)
  const [tamanoPaginaListado, setTamanoPaginaListado] = useState(8)
  const [companiasFiltro, setCompaniasFiltro] = useState<string[]>([])
  const [areasFiltro, setAreasFiltro] = useState<string[]>([])
  const [normasRepartoViaticos, setNormasRepartoViaticos] = useState<
    ViaticDistributionRuleOption[]
  >([])
  const [scrollListadoPrevioRevision, setScrollListadoPrevioRevision] =
    useState<number | null>(null)

  const cargarSolicitudes = useCallback(async (): Promise<void> => {
    setCargando(true)
    setErrorCarga(null)
    try {
      const [catalogo, solicitudesBackend, normasViaticos] = await Promise.all([
        fetchFinancialAuthorizationFilterCatalog(),
        fetchFinancialAuthorizationRequests(),
        fetchViaticDistributionRules(),
        esperar(500),
      ])
      setCompaniasFiltro(catalogo.companies.map((company) => company.name))
      setAreasFiltro(catalogo.areas.map((area) => area.name))
      setNormasRepartoViaticos(normasViaticos)
      setSolicitudes(solicitudesBackend)
    } catch {
      setErrorCarga("No se pudieron cargar las solicitudes. Intenta de nuevo.")
      setCompaniasFiltro([])
      setAreasFiltro([])
      setNormasRepartoViaticos([])
      setSolicitudes([])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    void cargarSolicitudes()
  }, [cargarSolicitudes])

  useEffect(() => {
    setCategoriaCfdiConcepto("")
    setIndicadorImpCfdiConcepto("")
  }, [movimientoSeleccionadoId])

  useEffect(() => {
    if (movimientoSeleccionadoId === null || idSolicitudEnRevision === null) {
      return
    }
    setDetalleMovimientoTransicion(true)
    const idTimer = window.setTimeout(() => {
      setDetalleMovimientoTransicion(false)
    }, 360)
    return () => window.clearTimeout(idTimer)
  }, [movimientoSeleccionadoId, idSolicitudEnRevision])

  const solicitudesEnColaContabilidad = useMemo(
    () => solicitudes.filter(solicitudVisibleEnColaContabilidadMock),
    [solicitudes]
  )

  const haySolicitudes = solicitudesEnColaContabilidad.length > 0

  const solicitudesFiltradas = useMemo(() => {
    return solicitudesEnColaContabilidad.filter((s) =>
      solicitudCoincideFiltros(s, filtros)
    )
  }, [solicitudesEnColaContabilidad, filtros])

  const totalPaginasListado = useMemo(
    () =>
      calcularTotalPaginas(solicitudesFiltradas.length, tamanoPaginaListado),
    [solicitudesFiltradas.length, tamanoPaginaListado]
  )

  const paginaListadoEfectiva = useMemo(
    () => limitarPagina(paginaListado, totalPaginasListado),
    [paginaListado, totalPaginasListado]
  )

  const solicitudesListadoPagina = useMemo(
    () =>
      rebanarPagina(
        solicitudesFiltradas,
        paginaListadoEfectiva,
        tamanoPaginaListado
      ),
    [solicitudesFiltradas, paginaListadoEfectiva, tamanoPaginaListado]
  )

  const resumen = useMemo(() => {
    const lista = solicitudesFiltradas
    const total = lista.reduce((acc, s) => acc + totalComprobadoSolicitud(s), 0)
    const movs = lista.reduce(
      (n, s) => n + movimientosConComprobacionUsuarioColaborador(s).length,
      0
    )
    const viajesEnCola = lista.reduce((n, s) => n + s.viajes.length, 0)
    return {
      total,
      movs,
      solicitudes: lista.length,
      viajesEnCola,
      totalEnSistema: solicitudesEnColaContabilidad.length,
    }
  }, [solicitudesFiltradas, solicitudesEnColaContabilidad.length])

  const filtrosActivos = filtrosTienenValor(filtros)

  const setFiltrosConReinicioPagina = useCallback(
    (accion: SetStateAction<FiltrosAutorizacionFinanciera>) => {
      setPaginaListado(1)
      setFiltros(accion)
    },
    []
  )

  function limpiarFiltros(): void {
    setFiltrosConReinicioPagina({
      textoNombre: "",
      textoCorreo: "",
      ultimos4Tarjeta: "",
      montoMin: "",
      montoMax: "",
      compania: "",
      area: "",
    })
  }

  function onPaginaListadoAnterior(): void {
    setPaginaListado((p) => Math.max(1, p - 1))
  }

  function onPaginaListadoSiguiente(): void {
    setPaginaListado((p) => Math.min(totalPaginasListado, p + 1))
  }

  function onCambiarTamanoPaginaListado(tamano: number): void {
    if (!TAMANOS_PAGINA_LISTADO_FIN.some((n) => n === tamano)) {
      return
    }
    setPaginaListado(1)
    setTamanoPaginaListado(tamano)
  }

  const solicitudEnRevision = useMemo(() => {
    if (idSolicitudEnRevision === null) {
      return null
    }
    return solicitudes.find((s) => s.id === idSolicitudEnRevision) ?? null
  }, [solicitudes, idSolicitudEnRevision])

  const indiceSolicitudRevision = useMemo(() => {
    if (solicitudEnRevision === null) {
      return 0
    }
    return indiceSolicitudEnLista(
      solicitudEnRevision,
      solicitudesEnColaContabilidad
    )
  }, [solicitudEnRevision, solicitudesEnColaContabilidad])

  const resumenSeleccionEnvio = useMemo(() => {
    if (solicitudEnRevision === null || idsMovimientosParaEnvio.length === 0) {
      return null
    }
    return {
      cantidad: idsMovimientosParaEnvio.length,
      total: montoTotalPorIdsMovimientos(
        solicitudEnRevision,
        idsMovimientosParaEnvio
      ),
    }
  }, [solicitudEnRevision, idsMovimientosParaEnvio])

  useEffect(() => {
    if (solicitudEnRevision === null || movimientoSeleccionadoId === null) {
      return
    }
    const indiceViajeDelMov = solicitudEnRevision.viajes.findIndex((v) =>
      v.movimientosComprobados.some((m) => m.id === movimientoSeleccionadoId)
    )
    if (indiceViajeDelMov < 0) {
      return
    }
    setIndiceViajeActivo((prev) =>
      prev === indiceViajeDelMov ? prev : indiceViajeDelMov
    )
  }, [solicitudEnRevision, movimientoSeleccionadoId])

  function abrirRevision(solicitudId: string): void {
    const solicitud = solicitudes.find((s) => s.id === solicitudId)
    if (!solicitud || !solicitudVisibleEnColaContabilidadMock(solicitud)) {
      return
    }
    setScrollListadoPrevioRevision(window.scrollY)
    const primerMov =
      movimientosConComprobacionUsuarioColaborador(solicitud)[0] ??
      movimientosComprobadosDeSolicitud(solicitud)[0]
    setIdSolicitudEnRevision(solicitudId)
    setIndiceViajeActivo(0)
    setComentarioRevision("")
    setNormaReparto("")
    setIdsMovimientosParaEnvio([])
    setMovimientoSeleccionadoId(primerMov?.id ?? null)
  }

  async function abrirRevisionConFeedback(solicitudId: string): Promise<void> {
    setSolicitudIdAbriendoRevision(solicitudId)
    try {
      await esperar(420)
      abrirRevision(solicitudId)
    } finally {
      setSolicitudIdAbriendoRevision(null)
    }
  }

  function cerrarRevision(): void {
    setIdSolicitudEnRevision(null)
    setIndiceViajeActivo(0)
    setIdsMovimientosParaEnvio([])
    setMovimientoSeleccionadoId(null)
    setComentarioRevision("")
    setNormaReparto("")
    setCategoriaCfdiConcepto("")
    setIndicadorImpCfdiConcepto("")
    const scrollDestino = scrollListadoPrevioRevision
    if (scrollDestino !== null) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollDestino,
          behavior: "smooth",
        })
      })
    }
    setScrollListadoPrevioRevision(null)
  }

  function alternarMovimientoParaEnvio(movId: string): void {
    if (solicitudEnRevision !== null) {
      const mov = movimientosComprobadosDeSolicitud(solicitudEnRevision).find(
        (m) => m.id === movId
      )
      if (mov !== undefined && !movimientoElegibleEnvioSapMock(mov)) {
        return
      }
    }
    setIdsMovimientosParaEnvio((prev) =>
      prev.includes(movId)
        ? prev.filter((id) => id !== movId)
        : [...prev, movId]
    )
  }

  function seleccionarTodosMovimientosDelViaje(
    viaje: FinancialAuthorizationViajeEnSolicitud
  ): void {
    const ids = viaje.movimientosComprobados
      .filter((m) => movimientoElegibleEnvioSapMock(m))
      .map((m) => m.id)
    setIdsMovimientosParaEnvio((prev) => Array.from(new Set([...prev, ...ids])))
  }

  function seleccionarTodosMovimientosDeSolicitud(): void {
    if (solicitudEnRevision === null) {
      return
    }
    setIdsMovimientosParaEnvio(
      movimientosComprobadosDeSolicitud(solicitudEnRevision)
        .filter((m) => movimientoElegibleEnvioSapMock(m))
        .map((m) => m.id)
    )
  }

  function limpiarSeleccionEnvio(): void {
    setIdsMovimientosParaEnvio([])
  }

  function enviarAprobacionMovimientosConjunta(): void {
    if (solicitudEnRevision === null || idsMovimientosParaEnvio.length === 0) {
      showAppToast("Selecciona al menos un movimiento para enviar.", "info")
      return
    }
    showAppToast(
      "Para registrar en SAP abre cada factura en el detalle, elige categoría e indicador de impuesto y pulsa Aprobar.",
      "info"
    )
  }

  const aprobarMovimientoFacturaSap = useCallback(
    async (input: {
      movimientoId: string
      tripMovementProofId: number
      accountCode: string
      taxCode: string
      reviewerNotes?: string
    }): Promise<{ docEntry: number }> => {
      const resultado = await postTripMovementProofAccountingApprove({
        tripMovementProofId: input.tripMovementProofId,
        accountCode: input.accountCode,
        taxCode: input.taxCode,
        reviewerNotes: input.reviewerNotes,
      })
      setSolicitudes((prev) =>
        prev.map((s) => ({
          ...s,
          viajes: s.viajes.map((v) => ({
            ...v,
            movimientosComprobados: v.movimientosComprobados.map((m) =>
              m.id === input.movimientoId
                ? {
                    ...m,
                    facturadoSapMock: true,
                    sapDocEntryMock: String(resultado.sap.docEntry),
                    proofStatus: "approved" as const,
                  }
                : m
            ),
          })),
        }))
      )
      return { docEntry: resultado.sap.docEntry }
    },
    []
  )

  function cerrarContabilidadMock(): void {
    if (solicitudEnRevision === null) {
      return
    }
    const idSolicitud = solicitudEnRevision.id
    const cierreEn = new Date().toISOString()
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === idSolicitud
          ? {
              ...s,
              contabilidadCerrada: true,
              contabilidadCerradaPor: USUARIO_CIERRE_CONTABILIDAD_MOCK,
              contabilidadCerradaEn: cierreEn,
            }
          : s
      )
    )
    showAppToast(
      "Contabilidad cerrada. La solicitud sale de la cola; con una nueva comprobación volvería a entrar al recargar datos.",
      "success"
    )
    cerrarRevision()
  }

  return {
    mounted,
    mousePosition,
    cargando,
    errorCarga,
    solicitudes,
    idSolicitudEnRevision,
    movimientoSeleccionadoId,
    setMovimientoSeleccionadoId,
    indiceViajeActivo,
    setIndiceViajeActivo,
    idsMovimientosParaEnvio,
    comentarioRevision,
    setComentarioRevision,
    detalleMovimientoTransicion,
    descargaEnCurso,
    setDescargaEnCurso,
    solicitudIdAbriendoRevision,
    normaReparto,
    normasRepartoViaticos,
    setNormaReparto,
    categoriaCfdiConcepto,
    setCategoriaCfdiConcepto,
    indicadorImpCfdiConcepto,
    setIndicadorImpCfdiConcepto,
    filtros,
    companiasFiltro,
    areasFiltro,
    setFiltros: setFiltrosConReinicioPagina,
    cargarSolicitudes,
    haySolicitudes,
    solicitudesFiltradas,
    solicitudesListadoPagina,
    paginaListado: paginaListadoEfectiva,
    totalPaginasListado,
    tamanoPaginaListado,
    opcionesTamanoPaginaListado: TAMANOS_PAGINA_LISTADO_FIN,
    onPaginaListadoAnterior,
    onPaginaListadoSiguiente,
    onCambiarTamanoPaginaListado,
    resumen,
    filtrosActivos,
    limpiarFiltros,
    solicitudEnRevision,
    indiceSolicitudRevision,
    resumenSeleccionEnvio,
    abrirRevisionConFeedback,
    cerrarRevision,
    alternarMovimientoParaEnvio,
    seleccionarTodosMovimientosDelViaje,
    seleccionarTodosMovimientosDeSolicitud,
    limpiarSeleccionEnvio,
    enviarAprobacionMovimientosConjunta,
    cerrarContabilidadMock,
    aprobarMovimientoFacturaSap,
  }
}
