import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"

import {
  crearCodigoConciliacion,
  construirResumenMesVista,
  filtrarViajesPorMesesAnteriores,
  filtrarViajesMesActualYAnterior,
  obtenerEstadoVigenciaSolicitud,
  obtenerIdViajeInicial,
  obtenerMensajeVentanaComprobacionMesAnterior,
  puedeComprobarMesAnterior,
  sumarHorasHabiles,
  type ExpenseResumenMesVista,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import { fetchMovimientosPorViajeId } from "@/features/travel-expenses/services/expense-movimientos-service"
import { fetchExpenseDispersedTrips } from "@/features/travel-expenses/services/travel-expenses-api"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

const MAX_INTENTOS_SOLICITUD_CODIGO_CONCILIACION = 2
const AUTHENTICATED_USER_ID = 1

interface UseExpensePageReturn {
  mounted: boolean
  mousePosition: TravelRequestMousePosition
  viajesCargando: boolean
  viajesInicialPendiente: boolean
  viajesError: boolean
  viajesErrorMensaje: string | null
  reintentarViajes: () => void
  resumenMes: ExpenseResumenMesVista
  viajesActivos: ExpenseViajeResumen[]
  viajesFinalizados: ExpenseViajeResumen[]
  viajesTodos: ExpenseViajeResumen[]
  avisoVigenciaSolicitud: {
    solicitudId: string
    mensaje: string
    color: "warning" | "danger"
  } | null
  viajesIdsConComprobacionPendiente: ReadonlySet<string>
  historialViajesVisible: boolean
  setHistorialViajesVisible: (visible: boolean) => void
  viajeSeleccionado: ExpenseViajeResumen | null
  idViajeSeleccionado: string
  setIdViajeSeleccionado: (id: string) => void
  movimientosDelViaje: ExpenseMovimiento[]
  movimientosCargando: boolean
  movimientosError: boolean
  movimientosErrorMensaje: string | null
  reintentarMovimientos: () => void
  panelMovimientosAbierto: boolean
  setPanelMovimientosAbierto: (abierto: boolean) => void
  comprobacionHabilitada: boolean
  mensajeVentanaPlazoComprobacion: string | null
  etiquetaComprobacionBloqueada: string | null
  mostrarBotonConciliacion: boolean
  conciliacionCargando: boolean
  overlayConciliacionVisible: boolean
  mensajeConciliacion: string
  codigoConciliacionIngresado: string
  setCodigoConciliacionIngresado: (codigo: string) => void
  errorCodigoConciliacion: string | null
  codigoConciliacionDemo: string | null
  confirmarCodigoConciliacion: () => void
  cerrarOverlayConciliacion: () => void
  iniciarConciliacionContabilidad: () => Promise<void>
}

type EstadoCodigoConciliacion = {
  readonly codigo: string
  readonly expiracion: Date
  readonly desbloqueado: boolean
}

export function useExpensePage(): UseExpensePageReturn {
  const mounted = true
  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })
  const [idViajeSeleccionado, setIdViajeSeleccionado] = useState<string>("")
  const [panelMovimientosAbierto, setPanelMovimientosAbierto] =
    useState<boolean>(false)
  const [historialViajesVisible, setHistorialViajesVisible] =
    useState<boolean>(false)
  const [estadoCodigosConciliacion, setEstadoCodigosConciliacion] = useState<
    Record<string, EstadoCodigoConciliacion>
  >({})
  const [overlayConciliacionVisible, setOverlayConciliacionVisible] =
    useState<boolean>(false)
  const [conciliacionCargando, setConciliacionCargando] =
    useState<boolean>(false)
  const [codigoConciliacionIngresado, setCodigoConciliacionIngresado] =
    useState<string>("")
  const [errorCodigoConciliacion, setErrorCodigoConciliacion] = useState<
    string | null
  >(null)
  const [mensajeConciliacion, setMensajeConciliacion] = useState<string>("")
  const [
    intentosSolicitudCodigoConciliacion,
    setIntentosSolicitudCodigoConciliacion,
  ] = useState<Record<string, number>>({})

  const viajesQuery = useQuery({
    queryKey: ["travel-expenses", "viajes", AUTHENTICATED_USER_ID],
    queryFn: () => fetchExpenseDispersedTrips(AUTHENTICATED_USER_ID),
    staleTime: 30_000,
  })

  const viajesDesdeApi = viajesQuery.data
  const viajesCargando = viajesQuery.isFetching
  const viajesInicialPendiente = viajesQuery.isPending
  const viajesError = viajesQuery.isError
  const viajesErrorMensaje =
    viajesQuery.error instanceof Error
      ? viajesQuery.error.message
      : viajesQuery.error !== null
        ? "No se pudieron cargar los viajes dispersados."
        : null

  function reintentarViajes(): void {
    void viajesQuery.refetch()
  }

  const viajesVisibles = useMemo(() => {
    if (viajesDesdeApi === undefined) {
      return []
    }
    return filtrarViajesMesActualYAnterior(viajesDesdeApi)
  }, [viajesDesdeApi])
  const viajesVisiblesConHistorial = useMemo(() => {
    if (viajesDesdeApi === undefined) {
      return []
    }
    return filtrarViajesPorMesesAnteriores(viajesDesdeApi, 2)
  }, [viajesDesdeApi])

  useEffect(() => {
    if (viajesInicialPendiente || viajesError) {
      return
    }
    if (viajesVisiblesConHistorial.length === 0) {
      return
    }
    const existeSeleccion = viajesVisiblesConHistorial.some(
      (viaje) => viaje.id === idViajeSeleccionado
    )
    if (!existeSeleccion) {
      setIdViajeSeleccionado(obtenerIdViajeInicial(viajesVisiblesConHistorial))
    }
  }, [
    idViajeSeleccionado,
    viajesVisiblesConHistorial,
    viajesInicialPendiente,
    viajesError,
  ])

  const viajesConPendientes = useMemo(() => {
    const ids = new Set<string>()
    for (const viaje of viajesVisiblesConHistorial) {
      if (viaje.pendientesComprobacion > 0) {
        ids.add(viaje.id)
      }
    }
    return ids
  }, [viajesVisiblesConHistorial])

  const viajesActivosFiltrados = useMemo(() => {
    const ahora = new Date()
    return viajesVisibles.filter((viaje) => {
      const [anio, mes] = viaje.fechaSalida.split("-").map(Number)
      if (!anio || !mes) {
        return false
      }
      const esMesActual =
        anio === ahora.getFullYear() && mes - 1 === ahora.getMonth()
      if (esMesActual) {
        return true
      }
      const esMesAnterior =
        (ahora.getMonth() > 0 &&
          anio === ahora.getFullYear() &&
          mes - 1 === ahora.getMonth() - 1) ||
        (ahora.getMonth() === 0 &&
          anio === ahora.getFullYear() - 1 &&
          mes - 1 === 11)
      if (!esMesAnterior) {
        return false
      }
      if (!viajesConPendientes.has(viaje.id)) {
        return true
      }
      return puedeComprobarMesAnterior(ahora)
    })
  }, [viajesConPendientes, viajesVisibles])

  const viajesActivos = useMemo(
    () =>
      [...viajesActivosFiltrados].sort((a, b) =>
        b.fechaSalida.localeCompare(a.fechaSalida)
      ),
    [viajesActivosFiltrados]
  )

  const resumenMes = useMemo(
    () => construirResumenMesVista(viajesActivos),
    [viajesActivos]
  )

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const viajeSeleccionado = useMemo((): ExpenseViajeResumen | null => {
    const encontrado = viajesVisiblesConHistorial.find(
      (v) => v.id === idViajeSeleccionado
    )
    return encontrado ?? null
  }, [idViajeSeleccionado, viajesVisiblesConHistorial])

  const viajesFinalizadosCerrados = useMemo(() => {
    const activosIds = new Set(viajesActivosFiltrados.map((viaje) => viaje.id))
    return viajesVisiblesConHistorial.filter(
      (viaje) => !activosIds.has(viaje.id)
    )
  }, [viajesActivosFiltrados, viajesVisiblesConHistorial])

  const viajesFinalizadosUnificados = useMemo(
    () =>
      [...viajesFinalizadosCerrados].sort((a, b) =>
        b.fechaSalida.localeCompare(a.fechaSalida)
      ),
    [viajesFinalizadosCerrados]
  )

  const viajesTodos = useMemo(
    () => [...viajesActivos, ...viajesFinalizadosUnificados],
    [viajesActivos, viajesFinalizadosUnificados]
  )

  const movimientosQuery = useQuery({
    queryKey: [
      "travel-expenses",
      "movimientos",
      AUTHENTICATED_USER_ID,
      idViajeSeleccionado,
    ],
    queryFn: () =>
      fetchMovimientosPorViajeId(AUTHENTICATED_USER_ID, idViajeSeleccionado),
    enabled:
      idViajeSeleccionado.length > 0 &&
      viajesDesdeApi !== undefined &&
      !viajesError,
    staleTime: 30_000,
  })

  const movimientosDelViaje = movimientosQuery.data ?? []
  const movimientosCargando = movimientosQuery.isFetching
  const movimientosError = movimientosQuery.isError
  const movimientosErrorMensaje =
    movimientosQuery.error instanceof Error
      ? movimientosQuery.error.message
      : movimientosQuery.error !== null
        ? "No se pudieron cargar los movimientos."
        : null

  function reintentarMovimientos(): void {
    void movimientosQuery.refetch()
  }

  const viajeSeleccionadoTienePendientes = useMemo(
    () =>
      viajeSeleccionado ? viajesConPendientes.has(viajeSeleccionado.id) : false,
    [viajeSeleccionado, viajesConPendientes]
  )

  const codigoSeleccionado = viajeSeleccionado
    ? estadoCodigosConciliacion[viajeSeleccionado.solicitudId]
    : undefined
  const codigoValido =
    codigoSeleccionado !== undefined &&
    codigoSeleccionado.desbloqueado &&
    new Date().getTime() <= codigoSeleccionado.expiracion.getTime()
  const estadoVigenciaSolicitudSeleccionada = useMemo(() => {
    if (viajeSeleccionado === null) {
      return "normal" as const
    }
    return obtenerEstadoVigenciaSolicitud(viajeSeleccionado, viajesTodos)
  }, [viajeSeleccionado, viajesTodos])

  const avisoVigenciaSolicitud = useMemo(() => {
    if (viajeSeleccionado === null || !viajeSeleccionadoTienePendientes) {
      return null
    }
    if (estadoVigenciaSolicitudSeleccionada === "warning") {
      return {
        solicitudId: viajeSeleccionado.solicitudId,
        color: "warning" as const,
        mensaje: `Solicitud #${viajeSeleccionado.solicitudId}: queda menos de 1 día para completar comprobaciones.`,
      }
    }
    if (
      estadoVigenciaSolicitudSeleccionada === "danger" ||
      estadoVigenciaSolicitudSeleccionada === "expired"
    ) {
      return {
        solicitudId: viajeSeleccionado.solicitudId,
        color: "danger" as const,
        mensaje: `Solicitud #${viajeSeleccionado.solicitudId}: el plazo de comprobación está por vencer o ya venció. Si vence, deberás conciliar con contabilidad.`,
      }
    }
    return null
  }, [
    estadoVigenciaSolicitudSeleccionada,
    viajeSeleccionado,
    viajeSeleccionadoTienePendientes,
  ])

  const comprobacionHabilitada =
    viajeSeleccionado === null
      ? false
      : estadoVigenciaSolicitudSeleccionada !== "expired" || codigoValido

  const mensajeVentanaPlazoComprobacion = useMemo(() => {
    if (viajeSeleccionado === null) {
      return null
    }
    return obtenerMensajeVentanaComprobacionMesAnterior(
      viajeSeleccionado,
      viajeSeleccionadoTienePendientes
    )
  }, [viajeSeleccionado, viajeSeleccionadoTienePendientes])

  const solicitudesCodigoConciliacionUsadas = viajeSeleccionado
    ? (intentosSolicitudCodigoConciliacion[viajeSeleccionado.solicitudId] ?? 0)
    : 0
  const solicitudConciliacionAgotada =
    solicitudesCodigoConciliacionUsadas >=
    MAX_INTENTOS_SOLICITUD_CODIGO_CONCILIACION

  const etiquetaComprobacionBloqueada = useMemo((): string | null => {
    if (comprobacionHabilitada || !viajeSeleccionadoTienePendientes) {
      return null
    }
    if (solicitudConciliacionAgotada) {
      return "Ya utilizaste los 2 intentos permitidos para solicitar conciliación con contabilidad desde esta pantalla. No se enviarán más códigos a contabilidad ni podrás volver a usar esta opción aquí. Ponte en contacto de forma directa con contabilidad para continuar."
    }
    return "El plazo para cargar comprobaciones de este viaje desde esta pantalla ya terminó según las reglas del periodo. Para seguir con los movimientos pendientes usa el botón «Conciliar con contabilidad» al final de este aviso: contabilidad valida la información y te habilita de nuevo el flujo. El código de verificación tendrá vigencia de 24 horas hábiles contadas solo conforme a tu horario laboral (no son 24 horas corridas). Solo se permiten dos solicitudes de código; al agotarlas, no se notificará de nuevo a contabilidad ni podrás usar de nuevo esta opción de conciliación en esta pantalla."
  }, [
    comprobacionHabilitada,
    solicitudConciliacionAgotada,
    viajeSeleccionadoTienePendientes,
  ])

  async function iniciarConciliacionContabilidad(): Promise<void> {
    if (viajeSeleccionado === null) {
      return
    }
    const usados =
      intentosSolicitudCodigoConciliacion[viajeSeleccionado.solicitudId] ?? 0
    if (usados >= MAX_INTENTOS_SOLICITUD_CODIGO_CONCILIACION) {
      return
    }
    setOverlayConciliacionVisible(true)
    setConciliacionCargando(true)
    setErrorCodigoConciliacion(null)
    setCodigoConciliacionIngresado("")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const codigo = crearCodigoConciliacion()
    const expiracion = sumarHorasHabiles(new Date(), 24)
    setEstadoCodigosConciliacion((anterior) => ({
      ...anterior,
      [viajeSeleccionado.solicitudId]: {
        codigo,
        expiracion,
        desbloqueado: false,
      },
    }))
    setIntentosSolicitudCodigoConciliacion((anterior) => ({
      ...anterior,
      [viajeSeleccionado.solicitudId]:
        (anterior[viajeSeleccionado.solicitudId] ?? 0) + 1,
    }))
    const siguienteNumeroIntento =
      (intentosSolicitudCodigoConciliacion[viajeSeleccionado.solicitudId] ??
        0) + 1
    const intentosRestantes =
      MAX_INTENTOS_SOLICITUD_CODIGO_CONCILIACION - siguienteNumeroIntento
    const sufijoIntentos =
      intentosRestantes > 0
        ? ` Te queda ${intentosRestantes === 1 ? "1 intento" : `${String(intentosRestantes)} intentos`} para solicitar un código nuevo.`
        : " Este era tu último intento de solicitud."
    setMensajeConciliacion(
      `A tu agente de contabilidad de ${viajeSeleccionado.compania} se le envió un código. Acércate con él para que pueda proporcionártelo y continuar con la verificación.${sufijoIntentos}`
    )
    setConciliacionCargando(false)
  }

  function confirmarCodigoConciliacion(): void {
    if (viajeSeleccionado === null) {
      return
    }
    const estado = estadoCodigosConciliacion[viajeSeleccionado.solicitudId]
    if (!estado) {
      setErrorCodigoConciliacion("Primero genera un código de conciliación.")
      return
    }
    if (new Date().getTime() > estado.expiracion.getTime()) {
      const usados =
        intentosSolicitudCodigoConciliacion[viajeSeleccionado.solicitudId] ?? 0
      if (usados >= MAX_INTENTOS_SOLICITUD_CODIGO_CONCILIACION) {
        setErrorCodigoConciliacion(
          "El código expiró y ya no hay solicitudes disponibles desde esta pantalla. Contacta directamente a contabilidad."
        )
      } else {
        setErrorCodigoConciliacion(
          "El código ya expiró. Si aún tienes intentos, solicita uno nuevo con «Conciliar con contabilidad»."
        )
      }
      return
    }
    if (codigoConciliacionIngresado.trim() !== estado.codigo) {
      setErrorCodigoConciliacion("Código inválido. Verifica con contabilidad.")
      return
    }
    setEstadoCodigosConciliacion((anterior) => ({
      ...anterior,
      [viajeSeleccionado.solicitudId]: {
        ...estado,
        desbloqueado: true,
      },
    }))
    setOverlayConciliacionVisible(false)
    setErrorCodigoConciliacion(null)
    setCodigoConciliacionIngresado("")
  }

  function cerrarOverlayConciliacion(): void {
    if (conciliacionCargando) {
      return
    }
    setOverlayConciliacionVisible(false)
    setErrorCodigoConciliacion(null)
    setCodigoConciliacionIngresado("")
  }

  return {
    mounted,
    mousePosition,
    viajesCargando,
    viajesInicialPendiente,
    viajesError,
    viajesErrorMensaje,
    reintentarViajes,
    resumenMes,
    viajesActivos,
    viajesFinalizados: viajesFinalizadosUnificados,
    viajesTodos,
    avisoVigenciaSolicitud,
    viajesIdsConComprobacionPendiente: viajesConPendientes,
    historialViajesVisible,
    setHistorialViajesVisible,
    viajeSeleccionado,
    idViajeSeleccionado,
    setIdViajeSeleccionado,
    movimientosDelViaje,
    movimientosCargando,
    movimientosError,
    movimientosErrorMensaje,
    reintentarMovimientos,
    panelMovimientosAbierto,
    setPanelMovimientosAbierto,
    comprobacionHabilitada,
    mensajeVentanaPlazoComprobacion,
    etiquetaComprobacionBloqueada,
    mostrarBotonConciliacion:
      !comprobacionHabilitada &&
      viajeSeleccionadoTienePendientes &&
      !solicitudConciliacionAgotada,
    conciliacionCargando,
    overlayConciliacionVisible,
    mensajeConciliacion,
    codigoConciliacionIngresado,
    setCodigoConciliacionIngresado,
    errorCodigoConciliacion,
    codigoConciliacionDemo: codigoSeleccionado?.codigo ?? null,
    confirmarCodigoConciliacion,
    cerrarOverlayConciliacion,
    iniciarConciliacionContabilidad,
  }
}
