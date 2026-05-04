import { useEffect, useMemo, useState, type ComponentType } from "react"
import { useNavigate } from "react-router-dom"
import {
  Building2,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronDown,
  ClipboardCheck,
  Filter,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Search,
  User,
  Wallet,
  X,
} from "lucide-react"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { showAppToast } from "@/components/app-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import { ListPaginationBar } from "@/components/list-pagination-bar"
import {
  calcularTotalPaginas,
  limitarPagina,
  rebanarPagina,
} from "@/lib/list-pagination-helpers"
import { cn } from "@/lib/utils"
import {
  approveTravelRequestTrip,
  fetchApprovalFilterCatalog,
  fetchApprovalRequests,
  rejectTravelRequestTrip,
} from "@/features/travel-approval/services/travel-approval-api"

interface ViajeEnRevision {
  tripId: number
  estadoViaje: "Pendiente" | "Aprobado" | "Rechazado" | "Dispersado"
  comentarioViaje: string | null
  destinoViaje: string
  motivoViaje: string
  fechaSalida: string
  fechaRegreso: string
  fechaDispersion: string
  montoEstimado: number
  requiereTag: boolean
  montoTag: number
  requiereGasolina: boolean
  montoGasolina: number
  conceptosSolicitados: Array<{
    concepto: string
    monto: number
  }>
}

interface SolicitudPendiente {
  id: number
  nombreEmpleado: string
  correo: string
  area: string
  empresa: string
  fechaSolicitud: string
  estado: "Pendiente" | "En corrección" | "Aprobada" | "Rechazada" | "Dispersada"
  fechaAutorizacion: string | null
  autorizadoPor: string | null
  dispersadoPor: string | null
  comentarioResolucion: string | null
  viajes: ViajeEnRevision[]
}

type EstadoRevisionViaje =
  | "Pendiente"
  | "Aprobado"
  | "Rechazado"
  | "Dispersado"

const TAMANOS_PAGINA_APROBACION = [4, 8, 12] as const
type FiltroEstadoSolicitud =
  | "Pendiente"
  | "En corrección"
  | "Aprobada"
  | "Rechazada"
  | "Dispersada"
const ESTADOS_SOLICITUD: FiltroEstadoSolicitud[] = [
  "Pendiente",
  "En corrección",
  "Aprobada",
  "Rechazada",
  "Dispersada",
]

function obtenerOpcionesFiltro(
  solicitudes: SolicitudPendiente[],
  selector: (solicitud: SolicitudPendiente) => string
): string[] {
  const opcionesUnicas = new Set<string>()
  solicitudes.forEach((solicitud) => {
    const valor = selector(solicitud).trim()
    if (valor.length > 0) {
      opcionesUnicas.add(valor)
    }
  })
  return Array.from(opcionesUnicas).sort((a, b) => a.localeCompare(b, "es-MX"))
}

function montoTotalSolicitud(s: SolicitudPendiente): number {
  return s.viajes.reduce((acc, v) => acc + v.montoEstimado, 0)
}

function rangoFechasViajes(viajes: ViajeEnRevision[]): string {
  if (viajes.length === 0) {
    return "—"
  }
  const salidas = viajes.map((v) => v.fechaSalida).sort()
  const regresos = viajes.map((v) => v.fechaRegreso).sort()
  const primeraSalida = salidas[0]
  const ultimoRegreso = regresos[regresos.length - 1]
  if (!primeraSalida || !ultimoRegreso) {
    return "—"
  }
  return `${formatearFecha(primeraSalida)} → ${formatearFecha(ultimoRegreso)}`
}

function diasDesdeSolicitud(fechaSolicitudIso: string): number {
  const [y, m, d] = fechaSolicitudIso.split("-").map(Number)
  if (!y || !m || !d) {
    return 0
  }
  const solicitud = new Date(y, m - 1, d)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  solicitud.setHours(0, 0, 0, 0)
  return Math.max(
    0,
    Math.round((hoy.getTime() - solicitud.getTime()) / 86_400_000)
  )
}

function fechaDispersionMasTemprana(viajes: ViajeEnRevision[]): string {
  if (viajes.length === 0) {
    return ""
  }
  const fechas = viajes
    .map((v) => v.fechaDispersion)
    .filter((f) => f.length > 0)
    .sort()
  return fechas[0] ?? ""
}

function filtrarSolicitudes(
  solicitudes: SolicitudPendiente[],
  textoBusqueda: string,
  area: string,
  empresa: string,
  estado: FiltroEstadoSolicitud,
  fechaDesde: string,
  fechaHasta: string
): SolicitudPendiente[] {
  const q = textoBusqueda.trim().toLowerCase()
  return solicitudes.filter((s) => {
    if (q.length > 0) {
      const nombreOk = s.nombreEmpleado.toLowerCase().includes(q)
      const correoOk = s.correo.toLowerCase().includes(q)
      if (!nombreOk && !correoOk) {
        return false
      }
    }
    if (area !== "" && s.area !== area) {
      return false
    }
    if (empresa !== "" && s.empresa !== empresa) {
      return false
    }
    if (s.estado !== estado) {
      return false
    }
    if (fechaDesde !== "" && s.fechaSolicitud < fechaDesde) {
      return false
    }
    if (fechaHasta !== "" && s.fechaSolicitud > fechaHasta) {
      return false
    }
    return true
  })
}

export function ApprovalPage() {
  const navigate = useNavigate()
  const mounted = true
  const [mousePosition, setMousePosition] =
    useState<TravelRequestMousePosition>({ x: 0, y: 0 })

  const [textoBusqueda, setTextoBusqueda] = useState("")
  const [area, setArea] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [estadoFiltro, setEstadoFiltro] =
    useState<FiltroEstadoSolicitud>("Pendiente")
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [detalleSolicitud, setDetalleSolicitud] =
    useState<SolicitudPendiente | null>(null)
  const [estadosViaje, setEstadosViaje] = useState<EstadoRevisionViaje[]>([])
  const [comentariosViaje, setComentariosViaje] = useState<string[]>([])
  const [comentarioMasivo, setComentarioMasivo] = useState("")
  const [modalAbierto, setModalAbierto] = useState(false)
  const [accionCargando, setAccionCargando] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)
  const [tamanoPagina, setTamanoPagina] = useState(8)
  const [solicitudes, setSolicitudes] = useState<SolicitudPendiente[]>([])
  const [areasFiltro, setAreasFiltro] = useState<string[]>([])
  const [empresasFiltro, setEmpresasFiltro] = useState<string[]>([])
  const [cargaInicialAprobacion, setCargaInicialAprobacion] = useState(true)

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadApprovalRequests(): Promise<void> {
      try {
        const [approvalRequests, catalog] = await Promise.all([
          fetchApprovalRequests(),
          fetchApprovalFilterCatalog(),
        ])
        if (isMounted) {
          setSolicitudes(approvalRequests)
          setAreasFiltro(catalog.areas)
          setEmpresasFiltro(catalog.companies)
        }
      } catch {
        showAppToast(
          "No se pudieron cargar las solicitudes desde el servidor.",
          "error"
        )
        if (isMounted) {
          setSolicitudes([])
          setAreasFiltro([])
          setEmpresasFiltro([])
        }
      } finally {
        if (isMounted) {
          setCargaInicialAprobacion(false)
        }
      }
    }

    void loadApprovalRequests()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!detalleSolicitud || !modalAbierto) {
      return
    }
    function onKey(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setModalAbierto(false)
        window.setTimeout(() => {
          setDetalleSolicitud(null)
          setEstadosViaje([])
          setComentariosViaje([])
          setComentarioMasivo("")
        }, 220)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [detalleSolicitud, modalAbierto])

  const solicitudesFiltradas = useMemo(
    () =>
      filtrarSolicitudes(
        solicitudes,
        textoBusqueda,
        area,
        empresa,
        estadoFiltro,
        fechaDesde,
        fechaHasta
      ),
    [solicitudes, textoBusqueda, area, empresa, estadoFiltro, fechaDesde, fechaHasta]
  )

  const areasFiltroDesdeSolicitudes = useMemo(
    () => obtenerOpcionesFiltro(solicitudes, (solicitud) => solicitud.area),
    [solicitudes]
  )

  const empresasFiltroDesdeSolicitudes = useMemo(
    () => obtenerOpcionesFiltro(solicitudes, (solicitud) => solicitud.empresa),
    [solicitudes]
  )

  const totalPaginasAprobacion = useMemo(
    () =>
      calcularTotalPaginas(solicitudesFiltradas.length, tamanoPagina),
    [solicitudesFiltradas.length, tamanoPagina]
  )

  const paginaAprobacionEfectiva = useMemo(
    () => limitarPagina(pagina, totalPaginasAprobacion),
    [pagina, totalPaginasAprobacion]
  )

  const solicitudesPagina = useMemo(
    () =>
      rebanarPagina(
        solicitudesFiltradas,
        paginaAprobacionEfectiva,
        tamanoPagina
      ),
    [solicitudesFiltradas, paginaAprobacionEfectiva, tamanoPagina]
  )

  useEffect(() => {
    setPagina(1)
  }, [textoBusqueda, area, empresa, estadoFiltro, fechaDesde, fechaHasta])

  function limpiarFiltros(): void {
    setTextoBusqueda("")
    setArea("")
    setEmpresa("")
    setEstadoFiltro("Pendiente")
    setFechaDesde("")
    setFechaHasta("")
    setPagina(1)
  }

  function onPaginaAprobacionAnterior(): void {
    setPagina((p) => Math.max(1, p - 1))
  }

  function onPaginaAprobacionSiguiente(): void {
    setPagina((p) => Math.min(totalPaginasAprobacion, p + 1))
  }

  function onCambiarTamanoPaginaAprobacion(nuevo: number): void {
    if (!TAMANOS_PAGINA_APROBACION.some((n) => n === nuevo)) {
      return
    }
    setPagina(1)
    setTamanoPagina(nuevo)
  }

  function abrirDetalleSolicitud(solicitud: SolicitudPendiente): void {
    setDetalleSolicitud(solicitud)
    setEstadosViaje(solicitud.viajes.map((v) => v.estadoViaje))
    setComentariosViaje(solicitud.viajes.map((v) => v.comentarioViaje ?? ""))
    setComentarioMasivo("")
    window.setTimeout(() => setModalAbierto(true), 0)
  }

  function cerrarDetalleSolicitud(): void {
    setModalAbierto(false)
    window.setTimeout(() => {
      setDetalleSolicitud(null)
      setEstadosViaje([])
      setComentariosViaje([])
      setComentarioMasivo("")
    }, 220)
  }

  async function recargarListaYSincronizarDetalle(
    solicitudIdAbierta: number | null
  ): Promise<void> {
    const lista = await fetchApprovalRequests()
    setSolicitudes(lista)
    if (solicitudIdAbierta !== null) {
      const actualizada = lista.find((s) => s.id === solicitudIdAbierta)
      if (actualizada) {
        setDetalleSolicitud(actualizada)
        setEstadosViaje(actualizada.viajes.map((v) => v.estadoViaje))
        setComentariosViaje(
          actualizada.viajes.map((v) => v.comentarioViaje ?? "")
        )
      } else {
        cerrarDetalleSolicitud()
      }
    }
  }

  function actualizarComentarioViaje(
    tripIndex: number,
    comentario: string
  ): void {
    setComentariosViaje((prev) =>
      prev.map((actual, idx) => (idx === tripIndex ? comentario : actual))
    )
  }

  async function ejecutarCambioEstadoViaje(
    tripIndex: number,
    estado: EstadoRevisionViaje
  ): Promise<void> {
    if (!detalleSolicitud) {
      return
    }
    const viaje = detalleSolicitud.viajes[tripIndex]
    if (!viaje) {
      return
    }
    if (viaje.estadoViaje !== "Pendiente") {
      showAppToast("Este viaje ya fue resuelto.", "error")
      return
    }
    const comentario = (comentariosViaje[tripIndex] ?? "").trim()
    if (estado === "Rechazado" && comentario.length === 0) {
      showAppToast(
        `Escribe un comentario antes de rechazar el viaje ${tripIndex + 1}.`,
        "error"
      )
      return
    }
    const solicitudId = detalleSolicitud.id
    setAccionCargando(`viaje-${tripIndex}-${estado}`)
    try {
      if (estado === "Aprobado") {
        await approveTravelRequestTrip(
          viaje.tripId,
          comentario.length > 0 ? comentario : undefined
        )
      } else {
        await rejectTravelRequestTrip(viaje.tripId, comentario)
      }
      showAppToast(`Viaje ${tripIndex + 1}: ${estado}.`, "success")
      await recargarListaYSincronizarDetalle(solicitudId)
    } catch {
      showAppToast(
        "No se pudo registrar la decisión. Revisa el servidor o el estado del viaje.",
        "error"
      )
    } finally {
      setAccionCargando(null)
    }
  }

  async function ejecutarEstadoTodos(
    estado: EstadoRevisionViaje
  ): Promise<void> {
    if (!detalleSolicitud) {
      return
    }
    const pendientes = detalleSolicitud.viajes.filter(
      (v) => v.estadoViaje === "Pendiente"
    )
    if (pendientes.length === 0) {
      showAppToast("No hay viajes pendientes en esta solicitud.", "info")
      return
    }
    if (estado === "Rechazado" && comentarioMasivo.trim().length === 0) {
      showAppToast(
        "Escribe un comentario para rechazar todos los viajes pendientes.",
        "error"
      )
      return
    }
    const solicitudId = detalleSolicitud.id
    setAccionCargando(`todos-${estado}`)
    try {
      if (estado === "Aprobado") {
        const notaMasiva = comentarioMasivo.trim()
        for (const viaje of pendientes) {
          await approveTravelRequestTrip(
            viaje.tripId,
            notaMasiva.length > 0 ? notaMasiva : undefined
          )
        }
      } else {
        const comentario = comentarioMasivo.trim()
        for (const viaje of pendientes) {
          await rejectTravelRequestTrip(viaje.tripId, comentario)
        }
      }
      showAppToast(
        estado === "Aprobado"
          ? "Todos los viajes pendientes fueron aprobados."
          : "Todos los viajes pendientes fueron rechazados.",
        "success"
      )
      await recargarListaYSincronizarDetalle(solicitudId)
    } catch {
      showAppToast(
        "No se pudo completar la acción masiva. Revisa el servidor.",
        "error"
      )
    } finally {
      setAccionCargando(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={mousePosition} />

      <AppHeader mounted={mounted} onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-440 px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-10">
          <div
            className={`mb-8 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                <ClipboardCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  Aprobación de solicitudes
                </h1>
                <p className="text-muted-foreground">
                  Revisa monto total, viajes y fechas de dispersión antes de
                  autorizar
                </p>
              </div>
            </div>
          </div>

          <section
            className={`mb-8 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-primary/5 to-accent/10 p-4 shadow-md shadow-primary/10 transition-all delay-75 duration-700 sm:p-5 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <p className="text-sm leading-relaxed text-foreground/90">
              <span className="font-semibold text-foreground">
                Para decidir con rapidez:
              </span>{" "}
              revisa monto total, cantidad de viajes, rango de fechas y
              antigüedad de la solicitud. En{" "}
              <span className="font-medium">Ver detalle</span> aprueba o rechaza
              cada viaje: el rechazo exige comentario y se guarda en el
              servidor al instante.
            </p>
          </section>

          <section
            className={`mb-8 rounded-3xl border-2 border-border/70 bg-linear-to-br from-card/95 via-card/80 to-card/70 p-6 shadow-xl shadow-primary/10 backdrop-blur-md transition-all delay-100 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Filtros
                </h2>
                <p className="text-sm text-muted-foreground">
                  Nombre, correo, área, empresa y rango de fechas
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {ESTADOS_SOLICITUD.map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => setEstadoFiltro(estado)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                    estadoFiltro === estado
                      ? "border-primary bg-primary/15 text-primary shadow-md shadow-primary/20"
                      : "border-border/70 bg-background/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {estado}
                </button>
              ))}
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="approval-search"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Search className="h-4 w-4 text-primary" />
                  Buscar por nombre o correo
                </Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="approval-search"
                    type="search"
                    autoComplete="off"
                    placeholder="Ej. María o maria@..."
                    value={textoBusqueda}
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                    className="h-12 rounded-2xl border-2 bg-background/80 pl-11 transition-all duration-500 focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <CustomFilterSelect
                  id="approval-area"
                  label="Área"
                  value={area}
                  placeholder="Todas las áreas"
                  options={
                    areasFiltro.length > 0 ? areasFiltro : areasFiltroDesdeSolicitudes
                  }
                  icon={Layers}
                  dropdownOpen={dropdownOpen}
                  onDropdownOpenChange={setDropdownOpen}
                  onChange={setArea}
                />

                <CustomFilterSelect
                  id="approval-empresa"
                  label="Empresa"
                  value={empresa}
                  placeholder="Todas las empresas"
                  options={
                    empresasFiltro.length > 0
                      ? empresasFiltro
                      : empresasFiltroDesdeSolicitudes
                  }
                  icon={Building2}
                  dropdownOpen={dropdownOpen}
                  onDropdownOpenChange={setDropdownOpen}
                  onChange={setEmpresa}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="approval-desde"
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <CalendarRange className="h-4 w-4 text-primary" />
                    Fecha desde
                  </Label>
                  <Input
                    id="approval-desde"
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="h-12 rounded-2xl border-2 bg-background/80 transition-all duration-500 focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="approval-hasta"
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <CalendarRange className="h-4 w-4 text-primary" />
                    Fecha hasta
                  </Label>
                  <Input
                    id="approval-hasta"
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="h-12 rounded-2xl border-2 bg-background/80 transition-all duration-500 focus-visible:border-primary focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-border/50 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={limpiarFiltros}
                  className="rounded-2xl"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </section>

          <div
            className={`space-y-4 transition-all delay-200 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            {cargaInicialAprobacion ? (
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-border/70 bg-card/50 py-16 text-muted-foreground backdrop-blur-sm"
                role="status"
              >
                <Loader2
                  className="h-9 w-9 shrink-0 animate-spin text-primary"
                  aria-hidden
                />
                <p className="text-sm font-medium">Cargando solicitudes…</p>
              </div>
            ) : solicitudesFiltradas.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-border/80 bg-card/40 p-12 text-center backdrop-blur-sm">
                <p className="font-medium text-foreground">
                  No hay solicitudes con estos criterios
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajusta la búsqueda, el área, la empresa o el rango de fechas.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-6 rounded-2xl"
                  onClick={limpiarFiltros}
                >
                  Restablecer filtros
                </Button>
              </div>
            ) : (
              <>
                <ul className="grid gap-4 xl:grid-cols-2">
                  {solicitudesPagina.map((s) => {
                  const total = montoTotalSolicitud(s)
                  const dias = diasDesdeSolicitud(s.fechaSolicitud)
                  return (
                    <li key={s.id}>
                      <article className="group h-full cursor-default rounded-3xl border-2 border-border/70 bg-linear-to-br from-card/95 via-card/80 to-card/65 p-5 shadow-lg shadow-primary/10 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-xl hover:shadow-primary/15 sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-medium text-muted-foreground">
                                {s.id}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  s.estado === "Pendiente" &&
                                    "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                                  s.estado === "En corrección" &&
                                    "bg-orange-500/15 text-orange-800 dark:text-orange-200",
                                  s.estado === "Aprobada" &&
                                    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                                  s.estado === "Rechazada" &&
                                    "bg-destructive/15 text-destructive",
                                  s.estado === "Dispersada" &&
                                    "bg-sky-500/15 text-sky-700 dark:text-sky-400"
                                )}
                              >
                                {s.estado}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Solicitado hace {dias}{" "}
                                {dias === 1 ? "día" : "días"}
                              </span>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="truncate text-lg font-semibold text-foreground">
                                  {s.nombreEmpleado}
                                </h3>
                                <p className="mt-0.5 flex items-center gap-2 truncate text-sm text-muted-foreground">
                                  <Mail className="h-3.5 w-3.5 shrink-0" />
                                  {s.correo}
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                  <Wallet className="h-3.5 w-3.5 text-primary" />
                                  Monto total estimado
                                </div>
                                <p className="mt-1 text-lg font-semibold text-foreground tabular-nums">
                                  {formatearMoneda(total)}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                  Viajes en la solicitud
                                </div>
                                <p className="mt-1 text-lg font-semibold text-foreground">
                                  {s.viajes.length}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-border/60 bg-background/50 p-3 sm:col-span-2 xl:col-span-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                  <CalendarRange className="h-3.5 w-3.5 text-primary" />
                                  Rango de viajes (salida → regreso)
                                </div>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                  {rangoFechasViajes(s.viajes)}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 text-sm sm:gap-3">
                              <div className="flex flex-wrap gap-x-6 gap-y-2">
                                <span className="text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Área:
                                  </span>{" "}
                                  {s.area}
                                </span>
                                <span className="text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Empresa:
                                  </span>{" "}
                                  {s.empresa}
                                </span>
                              </div>
                              <div className="flex flex-col gap-2 border-t border-border/40 pt-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                                <span className="text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Solicitud registrada el:
                                  </span>{" "}
                                  {formatearFecha(s.fechaSolicitud)}
                                </span>
                                <span className="text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    Fecha de dispersión más temprana
                                    {s.viajes.length > 1 ? " (varios viajes)" : ""}:
                                  </span>{" "}
                                  {(() => {
                                    const f = fechaDispersionMasTemprana(
                                      s.viajes
                                    )
                                    return f ? formatearFecha(f) : "—"
                                  })()}
                                </span>
                              </div>
                              {s.estado !== "Pendiente" ? (
                                <div className="grid gap-2 rounded-2xl border border-border/60 bg-background/55 p-3 text-xs sm:grid-cols-2">
                                  <span className="text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      Fecha de autorización:
                                    </span>{" "}
                                    {s.fechaAutorizacion
                                      ? formatearFecha(s.fechaAutorizacion)
                                      : "—"}
                                  </span>
                                  <span className="text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      Quién autorizó:
                                    </span>{" "}
                                    {s.autorizadoPor ?? "—"}
                                  </span>
                                  {s.estado !== "Rechazada" ? (
                                    <span className="text-muted-foreground">
                                      <span className="font-medium text-foreground">
                                        Quién dispersó:
                                      </span>{" "}
                                      {s.estado === "Dispersada"
                                        ? (s.dispersadoPor ?? "—")
                                        : "Falta dispersar"}
                                    </span>
                                  ) : null}
                                  <span className="text-muted-foreground sm:col-span-2">
                                    <span className="font-medium text-foreground">
                                      Comentario de{" "}
                                      {s.estado === "Rechazada"
                                        ? "rechazo"
                                        : "aprobación"}
                                      :
                                    </span>{" "}
                                    {s.comentarioResolucion ?? "—"}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch">
                            <Button
                              type="button"
                              className="cursor-pointer rounded-2xl shadow-md shadow-primary/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30"
                              size="sm"
                              onClick={() => abrirDetalleSolicitud(s)}
                            >
                              Ver detalle
                            </Button>
                          </div>
                        </div>
                      </article>
                    </li>
                  )
                })}
                </ul>

                <ListPaginationBar
                  className="mt-6"
                  pagina={paginaAprobacionEfectiva}
                  totalPaginas={totalPaginasAprobacion}
                  totalElementos={solicitudesFiltradas.length}
                  tamanoPagina={tamanoPagina}
                  etiquetaElemento="solicitudes"
                  onPaginaAnterior={onPaginaAprobacionAnterior}
                  onPaginaSiguiente={onPaginaAprobacionSiguiente}
                  onCambiarTamanoPagina={onCambiarTamanoPaginaAprobacion}
                  opcionesTamanoPagina={TAMANOS_PAGINA_APROBACION}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <AppFooter mounted={mounted} transitionDelayClass="delay-700" />

      {detalleSolicitud ? (
        <div
          className={cn(
            "fixed inset-0 z-100 flex items-end justify-center p-0 transition-all duration-250 sm:items-center sm:p-4",
            modalAbierto ? "opacity-100" : "opacity-0"
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-solicitud-titulo"
        >
          <button
            type="button"
            className={cn(
              "absolute inset-0 cursor-pointer bg-background/80 backdrop-blur-sm transition-all duration-250",
              modalAbierto ? "opacity-100" : "opacity-0"
            )}
            aria-label="Cerrar detalle"
            onClick={cerrarDetalleSolicitud}
          />
          <div
            className={cn(
              "relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border-2 border-border/80 bg-linear-to-br from-card to-card/90 shadow-2xl shadow-primary/20 transition-all duration-300 sm:rounded-3xl",
              modalAbierto
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-6 scale-[0.985] opacity-0"
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/80 p-5 sm:p-6">
              <div className="min-w-0">
                <p
                  id="detalle-solicitud-titulo"
                  className="font-mono text-xs text-muted-foreground"
                >
                  {detalleSolicitud.id}
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Detalle de solicitud y viajes
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {detalleSolicitud.nombreEmpleado} · {detalleSolicitud.correo}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 cursor-pointer rounded-2xl transition-all duration-300 hover:scale-105"
                onClick={cerrarDetalleSolicitud}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="mb-6 grid gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Monto total estimado
                  </p>
                  <p className="mt-0.5 text-lg font-semibold tabular-nums">
                    {formatearMoneda(montoTotalSolicitud(detalleSolicitud))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Viajes solicitados
                  </p>
                  <p className="mt-0.5 text-lg font-semibold">
                    {detalleSolicitud.viajes.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Solicitud registrada el
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    {formatearFecha(detalleSolicitud.fechaSolicitud)}
                  </p>
                </div>
                <div>
                  <p className="text-xs leading-snug font-medium text-muted-foreground">
                    Fecha de dispersión más temprana
                    {detalleSolicitud.viajes.length > 1
                      ? " (varios viajes)"
                      : ""}
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    {(() => {
                      const f = fechaDispersionMasTemprana(
                        detalleSolicitud.viajes
                      )
                      return f ? formatearFecha(f) : "—"
                    })()}
                  </p>
                </div>
              </div>

              <p className="mb-3 text-sm font-semibold text-foreground">
                Viajes de la solicitud
              </p>
              <ul className="space-y-4">
                {detalleSolicitud.viajes.map((v, idx) => {
                  const viajeResuelto = v.estadoViaje !== "Pendiente"
                  return (
                  <li
                    key={v.tripId}
                    className="rounded-2xl border-2 border-border/80 bg-background/40 p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          Viaje {idx + 1}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            estadosViaje[idx] === "Aprobado"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : estadosViaje[idx] === "Rechazado"
                                ? "bg-destructive/15 text-destructive"
                                : estadosViaje[idx] === "Dispersado"
                                  ? "bg-sky-500/15 text-sky-700 dark:text-sky-400"
                                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          )}
                        >
                          {estadosViaje[idx] ?? "Pendiente"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary tabular-nums">
                        {formatearMoneda(v.montoEstimado)}
                      </span>
                    </div>
                    <div className="mb-3 flex items-start gap-2 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          {v.destinoViaje}
                        </p>
                        <p className="text-muted-foreground">{v.motivoViaje}</p>
                      </div>
                    </div>
                    <dl className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          Fecha de salida
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium">
                          {formatearFecha(v.fechaSalida)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          Fecha de regreso
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium">
                          {formatearFecha(v.fechaRegreso)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs leading-snug font-medium text-muted-foreground">
                          Fecha en la que se requiere dispersión
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium">
                          {formatearFecha(v.fechaDispersion)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2">
                        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                          Solicita TAG
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {v.requiereTag
                            ? `Si - ${formatearMoneda(v.montoTag)}`
                            : "No"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2">
                        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                          Solicita gasolina
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {v.requiereGasolina
                            ? `Si - ${formatearMoneda(v.montoGasolina)}`
                            : "No"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-border/50 pt-3">
                      <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Conceptos solicitados
                      </p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {v.conceptosSolicitados.map((conceptoSolicitado) => (
                          <div
                            key={`${detalleSolicitud.id}-${idx}-${conceptoSolicitado.concepto}`}
                            className="inline-flex w-auto max-w-full items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-primary/10"
                          >
                            <span className="truncate text-xs font-medium text-foreground">
                              {conceptoSolicitado.concepto}
                            </span>
                            <span className="text-xs font-semibold text-primary tabular-nums">
                              {formatearMoneda(conceptoSolicitado.monto)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mb-3 space-y-1.5">
                        <Label
                          htmlFor={`comentario-viaje-${idx}`}
                          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                        >
                          {viajeResuelto
                            ? "Nota del aprobador (solo lectura)"
                            : "Nota del aprobador (opcional al aprobar, obligatoria al rechazar)"}
                        </Label>
                        <Textarea
                          id={`comentario-viaje-${idx}`}
                          value={
                            viajeResuelto
                              ? (v.comentarioViaje ??
                                  comentariosViaje[idx] ??
                                  "")
                              : (comentariosViaje[idx] ?? "")
                          }
                          onChange={(event) =>
                            actualizarComentarioViaje(idx, event.target.value)
                          }
                          placeholder={
                            viajeResuelto
                              ? v.comentarioViaje
                                ? ""
                                : "Sin comentario registrado para este viaje."
                              : "Opcional si apruebas. Obligatorio si rechazas."
                          }
                          readOnly={viajeResuelto}
                          className={cn(
                            "min-h-20 resize-y rounded-xl border-border/70 bg-background/80 text-sm",
                            viajeResuelto &&
                              "cursor-default bg-muted/25 text-foreground"
                          )}
                        />
                      </div>
                      {!viajeResuelto ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="cursor-pointer rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/10"
                            disabled={
                              accionCargando !== null ||
                              (comentariosViaje[idx] ?? "").trim().length === 0
                            }
                            onClick={() =>
                              void ejecutarCambioEstadoViaje(idx, "Rechazado")
                            }
                          >
                            {accionCargando === `viaje-${idx}-Rechazado`
                              ? "Rechazando..."
                              : "Rechazar viaje"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="cursor-pointer rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/25"
                            disabled={accionCargando !== null}
                            onClick={() =>
                              void ejecutarCambioEstadoViaje(idx, "Aprobado")
                            }
                          >
                            {accionCargando === `viaje-${idx}-Aprobado`
                              ? "Aprobando..."
                              : "Aprobar viaje"}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </li>
                  )
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-3 border-t border-border/80 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Pendientes:{" "}
                  <strong className="text-foreground">
                    {
                      estadosViaje.filter((estado) => estado === "Pendiente")
                        .length
                    }
                  </strong>
                </span>
                <span>
                  Aprobados:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {
                      estadosViaje.filter((estado) => estado === "Aprobado")
                        .length
                    }
                  </strong>
                </span>
                <span>
                  Rechazados:{" "}
                  <strong className="text-destructive">
                    {
                      estadosViaje.filter((estado) => estado === "Rechazado")
                        .length
                    }
                  </strong>
                </span>
              </div>
              {(() => {
                const pendientesRestantes = estadosViaje.filter(
                  (estado) => estado === "Pendiente"
                ).length
                const modificacionesBloqueadas = pendientesRestantes === 0
                const todosAprobados =
                  estadosViaje.length > 0 &&
                  estadosViaje.every((estado) => estado === "Aprobado")
                const todosRechazados =
                  estadosViaje.length > 0 &&
                  estadosViaje.every((estado) => estado === "Rechazado")
                const mensajeBloqueo = todosAprobados
                  ? "Ya no se pueden hacer modificaciones; todos los viajes ya fueron aprobados."
                  : todosRechazados
                    ? "Ya no se pueden hacer modificaciones; todos los viajes ya fueron rechazados."
                    : ""

                return (
                  <>
              <div className="space-y-1.5">
                <Label
                  htmlFor="comentario-masivo"
                  className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  Comentario obligatorio solo para rechazar todos (aprobar todos
                  no lo requiere)
                </Label>
                <Textarea
                  id="comentario-masivo"
                  value={
                    modificacionesBloqueadas
                      ? mensajeBloqueo
                      : comentarioMasivo
                  }
                  onChange={(event) => setComentarioMasivo(event.target.value)}
                  placeholder={
                    modificacionesBloqueadas
                      ? mensajeBloqueo
                      : "Escribe el motivo para aplicar la accion masiva..."
                  }
                  disabled={modificacionesBloqueadas}
                  className="min-h-20 resize-y rounded-xl border-border/70 bg-background/80 text-sm"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/10"
                    disabled={
                      accionCargando !== null ||
                      modificacionesBloqueadas ||
                      comentarioMasivo.trim().length === 0
                    }
                    onClick={() => void ejecutarEstadoTodos("Rechazado")}
                  >
                    {accionCargando === "todos-Rechazado"
                      ? "Rechazando todos..."
                      : "Rechazar todos los viajes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer rounded-2xl border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                    disabled={accionCargando !== null || modificacionesBloqueadas}
                    onClick={() => void ejecutarEstadoTodos("Aprobado")}
                  >
                    {accionCargando === "todos-Aprobado"
                      ? "Aprobando todos..."
                      : "Aprobar todos los viajes"}
                  </Button>
                </div>
              </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface CustomFilterSelectProps {
  id: string
  label: string
  value: string
  placeholder: string
  options: readonly string[]
  icon: ComponentType<{ className?: string }>
  dropdownOpen: string | null
  onDropdownOpenChange: (value: string | null) => void
  onChange: (value: string) => void
}

function CustomFilterSelect({
  id,
  label,
  value,
  placeholder,
  options,
  icon: Icon,
  dropdownOpen,
  onDropdownOpenChange,
  onChange,
}: CustomFilterSelectProps) {
  const isOpen = dropdownOpen === id

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-medium text-foreground"
      >
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => onDropdownOpenChange(isOpen ? null : id)}
          onBlur={() => {
            window.setTimeout(() => onDropdownOpenChange(null), 150)
          }}
          className={cn(
            "group flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border-2 bg-card px-4 text-left text-sm transition-all duration-300",
            isOpen
              ? "border-primary shadow-lg shadow-primary/20"
              : "border-border hover:border-primary/50 hover:shadow-md"
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(value ? "text-foreground" : "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary",
              isOpen ? "rotate-180 text-primary" : ""
            )}
          />
        </button>

        <div
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl transition-all duration-300",
            isOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          )}
        >
          <div className="max-h-56 overflow-y-auto py-2">
            <button
              type="button"
              onClick={() => {
                onChange("")
                onDropdownOpenChange(null)
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-200 hover:bg-primary/10",
                value === "" ? "bg-primary/5 text-primary" : "text-foreground"
              )}
              role="option"
              aria-selected={value === ""}
            >
              {value === "" ? <Check className="h-4 w-4 text-primary" /> : null}
              <span className={cn(value === "" ? "" : "ml-7")}>{placeholder}</span>
            </button>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option)
                  onDropdownOpenChange(null)
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-200 hover:bg-primary/10",
                  value === option ? "bg-primary/5 text-primary" : "text-foreground"
                )}
                role="option"
                aria-selected={value === option}
              >
                {value === option ? <Check className="h-4 w-4 text-primary" /> : null}
                <span className={cn(value === option ? "" : "ml-7")}>{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatearFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return iso
  }
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d))
}

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(valor)
}
