import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileDown,
  FileText,
  Loader2,
  Lock,
  MessageSquareQuote,
  XCircle,
} from "lucide-react"
import {
  logTravelAxiosError,
  userMessageFromTravelAxiosError,
} from "@/lib/travel-api-axios-error"
import { useEffect, useMemo, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FinancialAuthorizationPillSelect } from "@/features/financial-authorization/components/FinancialAuthorizationPillSelect"
import {
  camposXmlExtrasRespectoAlaVista,
  descargarTextoComoArchivo,
  encontrarMovimientoEnSolicitud,
  formatearFechaCorta,
  formatearMonto,
  movimientoElegibleEnvioSapMock,
  movimientoTieneComprobacionUsuario,
  movimientosConComprobacionUsuarioColaborador,
  particionarExtrasXmlParaVista,
  pillCfdiBaseClassName,
  pillCfdiClasePorCampo,
  rangoFechasSolicitud,
  textoComentarioUsuarioAlComprobar,
  totalComprobadoSolicitud,
} from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import type { FinancialAuthorizationPageController } from "@/features/financial-authorization/interfaces/financial-authorization-page-controller.interface"
import {
  fetchCompanyExpenseCatalogs,
  downloadMovementPdfFromSupabase,
  fetchMovementCfdi,
  type CompanyExpenseCatalogOption,
  type MovementCfdiPayload,
} from "@/features/financial-authorization/services/financial-authorization-api"
import { cn } from "@/lib/utils"

export function FinancialAuthorizationReview(props: {
  page: FinancialAuthorizationPageController
}) {
  function normalizarNombreCampo(valor: string): string {
    return valor
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
  }
  function valorCampoXml(
    campos: readonly { campo: string; valor: string }[],
    campo: string
  ): string {
    const objetivo = normalizarNombreCampo(campo)
    const encontrado = campos.find(
      (item) => normalizarNombreCampo(item.campo) === objetivo
    )
    return encontrado?.valor ?? "—"
  }
  function normalizarCompania(valor: string): string {
    return valor
      .toUpperCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }
  function claveOrdenAlfabetico(label: string): string {
    const partes = label.split(" - ")
    const nombre = partes.length > 1 ? partes.slice(1).join(" - ") : label
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  }
  const {
    solicitudEnRevision,
    cerrarRevision,
    indiceViajeActivo,
    setIndiceViajeActivo,
    movimientoSeleccionadoId,
    setMovimientoSeleccionadoId,
    idsMovimientosParaEnvio,
    comentarioRevision,
    setComentarioRevision,
    detalleMovimientoTransicion,
    descargaEnCurso,
    setDescargaEnCurso,
    normaReparto,
    normasRepartoViaticos,
    setNormaReparto,
    resumenSeleccionEnvio,
    alternarMovimientoParaEnvio,
    seleccionarTodosMovimientosDelViaje,
    seleccionarTodosMovimientosDeSolicitud,
    limpiarSeleccionEnvio,
    enviarAprobacionMovimientosConjunta,
    cerrarContabilidadMock,
    aprobarMovimientoFacturaSap,
  } = props.page

  if (solicitudEnRevision === null) {
    return null
  }

  const movsColaboradorRevision =
    movimientosConComprobacionUsuarioColaborador(solicitudEnRevision)
  const todosFacturadosSapMock =
    movsColaboradorRevision.length > 0 &&
    movsColaboradorRevision.every(
      (m) =>
        m.facturadoSapMock === true || m.proofStatus === "approved"
    )
  const movimientoSeleccionadoHallado = useMemo(() => {
    if (movimientoSeleccionadoId === null || solicitudEnRevision === null) {
      return null
    }
    return (
      encontrarMovimientoEnSolicitud(
        solicitudEnRevision,
        movimientoSeleccionadoId
      ) ?? null
    )
  }, [solicitudEnRevision, movimientoSeleccionadoId])
  const [cfdiMovimiento, setCfdiMovimiento] =
    useState<MovementCfdiPayload | null>(null)
  const [categoriaOptions, setCategoriaOptions] = useState<
    CompanyExpenseCatalogOption[]
  >([])
  const [indicadorImpuestoOptions, setIndicadorImpuestoOptions] = useState<
    CompanyExpenseCatalogOption[]
  >([])
  const [categoriaPorConcepto, setCategoriaPorConcepto] = useState<
    Record<number, string>
  >({})
  const [indicadorPorConcepto, setIndicadorPorConcepto] = useState<
    Record<number, string>
  >({})
  const [cfdiMovimientoError, setCfdiMovimientoError] = useState<string | null>(
    null
  )
  const [catalogsError, setCatalogsError] = useState<string | null>(null)
  const [detallesMovimientoColapsados, setDetallesMovimientoColapsados] =
    useState(false)
  const [forzarVerDetalleConjuntoMock, setForzarVerDetalleConjuntoMock] =
    useState(false)
  const [aprobacionSapEnCurso, setAprobacionSapEnCurso] = useState(false)
  const modoEnvioConjunto = idsMovimientosParaEnvio.length > 1
  const ocultarDetallesMovimiento =
    detallesMovimientoColapsados ||
    (modoEnvioConjunto && !forzarVerDetalleConjuntoMock)
  useEffect(() => {
    let activo = true
    setCatalogsError(null)
    setCategoriaOptions([])
    setIndicadorImpuestoOptions([])
    void fetchCompanyExpenseCatalogs(
      solicitudEnRevision.expenseCatalogCompanyId
    )
      .then((catalogs) => {
        if (!activo) {
          return
        }
        setCategoriaOptions(catalogs.viaticCategories)
        setIndicadorImpuestoOptions(catalogs.vatIndicators)
      })
      .catch(() => {
        if (!activo) {
          return
        }
        setCatalogsError(
          "No se pudo cargar categoría e indicador de impuesto desde base de datos."
        )
      })
    return () => {
      activo = false
    }
  }, [solicitudEnRevision.expenseCatalogCompanyId])
  useEffect(() => {
    if (movimientoSeleccionadoHallado === null) {
      setCfdiMovimiento(null)
      setCfdiMovimientoError(null)
      setCategoriaPorConcepto({})
      setIndicadorPorConcepto({})
      setDetallesMovimientoColapsados(false)
      return
    }
    const tripId = Number.parseInt(
      movimientoSeleccionadoHallado.viaje.idViaje,
      10
    )
    if (Number.isNaN(tripId)) {
      setCfdiMovimiento(null)
      setCfdiMovimientoError(
        "No se pudo identificar el viaje para obtener XML."
      )
      return
    }
    let activo = true
    setCfdiMovimientoError(null)
    void fetchMovementCfdi({
      tripId,
      movementSequence:
        movimientoSeleccionadoHallado.movimiento.numeroMovimiento,
    })
      .then((resultado) => {
        if (!activo) {
          return
        }
        setCfdiMovimiento(resultado)
      })
      .catch(() => {
        if (!activo) {
          return
        }
        setCfdiMovimiento(null)
        setCfdiMovimientoError("No se pudo cargar XML desde backend.")
      })
    return () => {
      activo = false
    }
  }, [movimientoSeleccionadoHallado])
  useEffect(() => {
    if (modoEnvioConjunto) {
      setDetallesMovimientoColapsados(true)
    }
  }, [modoEnvioConjunto])
  useEffect(() => {
    if (!modoEnvioConjunto) {
      setForzarVerDetalleConjuntoMock(false)
      return
    }
    setForzarVerDetalleConjuntoMock(false)
  }, [modoEnvioConjunto])
  const companiaSolicitudNormalizada = normalizarCompania(
    solicitudEnRevision.empresa
  )
  const normaRepartoOptions = [
    { value: "", label: "Seleccione norma de reparto" },
    ...normasRepartoViaticos
      .filter(
        (norma) =>
          normalizarCompania(norma.companyName) === companiaSolicitudNormalizada
      )
      .sort((a, b) =>
        claveOrdenAlfabetico(a.label).localeCompare(
          claveOrdenAlfabetico(b.label),
          "es",
          { sensitivity: "base" }
        )
      )
      .map((norma) => ({
        value: norma.value,
        label: norma.label,
      })),
  ]
  return (
    <div className="animate-in duration-500 fade-in slide-in-from-bottom-2">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="w-fit cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
          onClick={cerrarRevision}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver al listado
        </Button>
      </div>

      <div className="mb-6 rounded-2xl border border-border/60 bg-card/50 p-5 shadow-2xl ring-1 shadow-violet-950/10 ring-violet-500/15 transition-shadow duration-500 hover:shadow-violet-900/15 sm:p-6 dark:shadow-black/40">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Solicitud de {solicitudEnRevision.solicitante}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {solicitudEnRevision.empresa} · {solicitudEnRevision.area}
        </p>
        <div className="mt-5 grid gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Solicitante
            </p>
            <p className="mt-0.5 font-medium text-foreground">
              {solicitudEnRevision.solicitante}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {solicitudEnRevision.correoElectronico}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Fecha salida · regreso
            </p>
            <p className="mt-0.5 text-foreground">
              {rangoFechasSolicitud(solicitudEnRevision).salida} →{" "}
              {rangoFechasSolicitud(solicitudEnRevision).regreso}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Monto total comprobado
            </p>
            <p className="mt-0.5 text-lg font-semibold text-emerald-700 tabular-nums dark:text-emerald-300">
              {formatearMonto(totalComprobadoSolicitud(solicitudEnRevision))}
            </p>
          </div>
        </div>
      </div>

      {(() => {
        const listaViajes = solicitudEnRevision.viajes
        const cantViajes = listaViajes.length
        const indiceViajeSeguro =
          cantViajes === 0
            ? 0
            : Math.min(Math.max(0, indiceViajeActivo), cantViajes - 1)
        const viajeVisible = listaViajes[indiceViajeSeguro]

        function onSeleccionarViaje(indice: number): void {
          const v = listaViajes[indice]
          if (!v) {
            return
          }
          setIndiceViajeActivo(indice)
          const primero = v.movimientosComprobados[0]
          setMovimientoSeleccionadoId(primero?.id ?? null)
        }

        if (!viajeVisible) {
          return null
        }

        return (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground">
                Viajes en esta solicitud
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Elige un viaje, marca los gastos para un envío conjunto y abre
                uno para revisar CFDI.
              </p>
              <div
                className="mt-4 flex flex-wrap gap-3"
                role="tablist"
                aria-label="Viajes de la solicitud"
              >
                {listaViajes.map((v, idx) => {
                  const activo = indiceViajeSeguro === idx
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="tab"
                      aria-selected={activo}
                      onClick={() => onSeleccionarViaje(idx)}
                      className={cn(
                        "max-w-full min-w-[200px] flex-1 rounded-2xl border px-4 py-3 text-left transition-all sm:max-w-md sm:min-w-[240px]",
                        activo
                          ? "border-violet-500/50 bg-violet-500/10 shadow-sm ring-2 ring-violet-500/20"
                          : "border-border/60 bg-card/40 hover:border-violet-300/40 hover:bg-muted/25"
                      )}
                    >
                      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        Viaje {idx + 1}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Motivo
                      </span>
                      <span className="block leading-snug font-medium text-foreground">
                        {v.titulo}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Destino
                      </span>
                      <span className="block text-sm text-foreground">
                        {v.destino}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Fecha salida · regreso
                      </span>
                      <span className="block text-sm text-foreground">
                        {formatearFechaCorta(v.periodoInicio)} –{" "}
                        {formatearFechaCorta(v.periodoFin)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <section
              className="mb-8 rounded-2xl border border-border/60 bg-card/40 p-4 shadow-sm sm:p-6"
              aria-labelledby="titulo-movs-viaje"
            >
              <div className="mb-5 border-b border-border/40 pb-4">
                <h4
                  id="titulo-movs-viaje"
                  className="text-lg font-semibold text-foreground"
                >
                  {viajeVisible.titulo}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {viajeVisible.destino}
                </p>
              </div>

              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Comprobaciones del viaje
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-xs"
                    onClick={() =>
                      seleccionarTodosMovimientosDelViaje(viajeVisible)
                    }
                  >
                    Marcar todos (este viaje)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-xs"
                    onClick={seleccionarTodosMovimientosDeSolicitud}
                  >
                    Marcar todos (solicitud)
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-xs text-muted-foreground"
                    onClick={limpiarSeleccionEnvio}
                  >
                    Limpiar marcas
                  </Button>
                </div>
              </div>
              <div className="mb-4 max-w-md space-y-1.5">
                <Label
                  htmlFor="norma-reparto-viaje"
                  className="text-xs text-muted-foreground"
                >
                  Norma de reparto
                </Label>
                <FinancialAuthorizationPillSelect
                  id="norma-reparto-viaje"
                  value={normaReparto}
                  placeholder="Seleccione norma de reparto"
                  onChange={setNormaReparto}
                  options={[...normaRepartoOptions]}
                />
              </div>
              {!modoEnvioConjunto && (
                <div className="mb-4 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer gap-2"
                    onClick={() =>
                      setDetallesMovimientoColapsados((prev) => !prev)
                    }
                  >
                    {detallesMovimientoColapsados ? (
                      <ChevronDown className="size-4" aria-hidden />
                    ) : (
                      <ChevronUp className="size-4" aria-hidden />
                    )}
                    {detallesMovimientoColapsados
                      ? "Mostrar detalles"
                      : "Ocultar detalles"}
                  </Button>
                </div>
              )}
              {modoEnvioConjunto && (
                <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-xs font-semibold tracking-wide text-amber-900 uppercase dark:text-amber-100">
                    Vista de detalle en lote
                  </p>
                  <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-200/90">
                    Durante envío conjunto puedes abrir el detalle de un
                    movimiento sin perder la selección masiva.
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() =>
                        setForzarVerDetalleConjuntoMock((prev) => !prev)
                      }
                    >
                      {forzarVerDetalleConjuntoMock
                        ? "Ocultar detalle"
                        : "Ver detalle de un movimiento"}
                    </Button>
                    {forzarVerDetalleConjuntoMock && (
                      <FinancialAuthorizationPillSelect
                        value={movimientoSeleccionadoId ?? ""}
                        onChange={(value) => setMovimientoSeleccionadoId(value)}
                        placeholder="Selecciona movimiento"
                        options={solicitudEnRevision.viajes
                          .flatMap((v) => v.movimientosComprobados)
                          .filter((mov) => idsMovimientosParaEnvio.includes(mov.id))
                          .map((mov) => ({
                            value: mov.id,
                            label: `${formatearFechaCorta(mov.fecha)} · ${mov.descripcion}`,
                          }))}
                        className="min-w-[260px]"
                        ariaLabel="Seleccionar movimiento para detalle en lote"
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {viajeVisible.movimientosComprobados.map((mov) => {
                  const tarjetaEnmascarada = `**** ${solicitudEnRevision.tarjetaUltimos4}`
                  const seleccionadoVista = movimientoSeleccionadoId === mov.id
                  const marcadoLote = idsMovimientosParaEnvio.includes(mov.id)
                  const puedeMarcarEnvio = movimientoElegibleEnvioSapMock(mov)
                  const tieneComprobacionColaborador =
                    movimientoTieneComprobacionUsuario(mov)
                  return (
                    <div
                      key={mov.id}
                      className={cn(
                        "flex gap-3 rounded-2xl border p-4 transition-all duration-300 ease-out",
                        seleccionadoVista
                          ? "border-violet-500/50 bg-violet-500/10 shadow-md ring-2 ring-violet-500/15"
                          : "border-border/60 bg-background/50 shadow-sm",
                        marcadoLote
                          ? "ring-1 ring-emerald-500/35"
                          : "hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-muted/35 hover:shadow-md",
                        !tieneComprobacionColaborador && "opacity-75"
                      )}
                    >
                      <div className="flex shrink-0 flex-col items-center pt-1">
                        <Checkbox
                          checked={marcadoLote}
                          disabled={!puedeMarcarEnvio}
                          onChange={() => alternarMovimientoParaEnvio(mov.id)}
                          aria-label={`Incluir en envío conjunto: ${mov.descripcion}`}
                        />
                      </div>
                      <button
                        type="button"
                        className="min-w-0 flex-1 cursor-pointer rounded-xl text-left transition-transform duration-200 outline-none active:scale-[0.995]"
                        onClick={() => setMovimientoSeleccionadoId(mov.id)}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex rounded-lg bg-muted/80 px-2.5 py-1 text-xs font-medium text-foreground tabular-nums">
                                {formatearFechaCorta(mov.fecha)}
                              </span>
                              {!tieneComprobacionColaborador ? (
                                <span className="inline-flex rounded-lg border border-amber-500/35 bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-950 dark:text-amber-100">
                                  Sin comprobación colaborador
                                </span>
                              ) : null}
                              {mov.facturadoSapMock === true ||
                              mov.proofStatus === "approved" ? (
                                <span className="inline-flex rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-900 dark:text-emerald-100">
                                  Facturado SAP
                                  {mov.sapDocEntryMock
                                    ? ` · ${mov.sapDocEntryMock}`
                                    : ""}
                                </span>
                              ) : null}
                            </div>
                            <p className="text-base leading-snug font-medium text-foreground">
                              {mov.descripcion}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              Tarjeta {tarjetaEnmascarada}
                            </p>
                          </div>
                          <div className="shrink-0 sm:text-right">
                            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                              Importe
                            </p>
                            <p className="text-xl font-semibold text-emerald-700 tabular-nums dark:text-emerald-300">
                              {formatearMonto(mov.monto)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )
      })()}

      {!ocultarDetallesMovimiento &&
        (() => {
        if (movimientoSeleccionadoHallado === null) {
          return null
        }
        const { viaje, movimiento } = movimientoSeleccionadoHallado
        const camposDesdeXml = cfdiMovimiento?.camposXml ?? []
        const conceptosDesdeXml = cfdiMovimiento?.conceptos ?? []
        return (
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-linear-to-br from-card/95 via-card/85 to-violet-500/[0.06] p-5 shadow-lg ring-1 ring-violet-500/10 transition-all duration-500 ease-out hover:border-violet-400/45 hover:shadow-2xl hover:shadow-violet-500/15 sm:p-6">
            {detalleMovimientoTransicion && (
              <div
                className="absolute inset-0 z-30 flex items-center justify-center bg-background/55 backdrop-blur-[2px] transition-opacity duration-300"
                aria-busy="true"
                aria-live="polite"
              >
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-violet-500/25 bg-card/95 px-8 py-6 shadow-xl">
                  <Loader2 className="size-10 animate-spin text-violet-600 drop-shadow-md" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Cargando CFDI…
                  </p>
                </div>
              </div>
            )}
            <div
              className={cn(
                "transition-all duration-400 ease-out",
                detalleMovimientoTransicion &&
                  "pointer-events-none scale-[0.99] opacity-45"
              )}
            >
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Detalles del movimiento
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {viaje.titulo} · {formatearFechaCorta(movimiento.fecha)} ·{" "}
                {movimiento.descripcion}
              </p>
              {cfdiMovimientoError !== null && (
                <p className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-200">
                  {cfdiMovimientoError}
                </p>
              )}

              {catalogsError !== null && (
                <p className="mt-3 text-xs font-medium text-amber-800 dark:text-amber-200">
                  {catalogsError}
                </p>
              )}

              {!ocultarDetallesMovimiento && (
                <div className="mt-6 space-y-5">
                {(() => {
                  const extrasXml = camposXmlExtrasRespectoAlaVista([
                    ...camposDesdeXml,
                  ])
                  const partidosXml = particionarExtrasXmlParaVista(extrasXml)
                  if (camposDesdeXml.length === 0) {
                    return null
                  }
                  return (
                    <>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2 rounded-xl border border-violet-500/20 bg-linear-to-br from-violet-500/[0.07] to-card/80 p-4 shadow-sm ring-1 ring-violet-500/10">
                          <p className="text-xs font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
                            Emisor
                          </p>
                          <p className="font-mono text-sm font-medium text-foreground">
                            {valorCampoXml(camposDesdeXml, "RFC Emisor")}
                          </p>
                          <p className="text-[15px] leading-snug font-medium text-foreground">
                            {valorCampoXml(camposDesdeXml, "Nombre Emisor")}
                          </p>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {valorCampoXml(
                              camposDesdeXml,
                              "Régimen Fiscal Emisor"
                            )}
                          </p>
                        </div>
                        <div className="space-y-2 rounded-xl border border-cyan-500/25 bg-linear-to-br from-cyan-500/[0.06] to-card/80 p-4 shadow-sm ring-1 ring-cyan-500/10">
                          <p className="text-xs font-semibold tracking-wide text-cyan-800 uppercase dark:text-cyan-200">
                            Receptor
                          </p>
                          <p className="font-mono text-sm font-medium text-foreground">
                            {valorCampoXml(camposDesdeXml, "RFC Receptor")}
                          </p>
                          <p className="text-[15px] leading-snug font-medium text-foreground">
                            {valorCampoXml(camposDesdeXml, "Nombre Receptor")}
                          </p>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {valorCampoXml(
                              camposDesdeXml,
                              "Régimen Fiscal Receptor"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                            Uso y forma de pago
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={cn(
                                pillCfdiBaseClassName,
                                pillCfdiClasePorCampo("pago"),
                                "text-muted-foreground"
                              )}
                            >
                              Uso CFDI:{" "}
                              <span className="font-semibold text-foreground">
                                {valorCampoXml(camposDesdeXml, "Uso CFDI")}
                              </span>
                            </span>
                            <span
                              className={cn(
                                pillCfdiBaseClassName,
                                pillCfdiClasePorCampo("pago"),
                                "text-muted-foreground"
                              )}
                            >
                              Forma:{" "}
                              <span className="font-semibold text-foreground">
                                {valorCampoXml(camposDesdeXml, "Forma de pago")}
                              </span>
                            </span>
                            <span
                              className={cn(
                                pillCfdiBaseClassName,
                                pillCfdiClasePorCampo("pago"),
                                "text-muted-foreground"
                              )}
                            >
                              Método:{" "}
                              <span className="font-semibold text-foreground">
                                {valorCampoXml(
                                  camposDesdeXml,
                                  "Método de pago"
                                )}
                              </span>
                            </span>
                            <span
                              className={cn(
                                pillCfdiBaseClassName,
                                pillCfdiClasePorCampo("uuid"),
                                "text-muted-foreground"
                              )}
                            >
                              UUID:{" "}
                              <span className="font-semibold text-foreground">
                                {valorCampoXml(camposDesdeXml, "UUID")}
                              </span>
                            </span>
                          </div>
                        </div>

                        {partidosXml.comprobante.length > 0 && (
                          <div>
                            <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                              Comprobante (XML)
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {partidosXml.comprobante.map((fila) => {
                                const valorLargo =
                                  fila.campo === "No. Certificado" ||
                                  fila.valor.length > 24
                                return (
                                  <span
                                    key={fila.campo}
                                    className={cn(
                                      pillCfdiBaseClassName,
                                      pillCfdiClasePorCampo("comprobante"),
                                      "text-muted-foreground"
                                    )}
                                  >
                                    {fila.campo}:{" "}
                                    <span
                                      className={cn(
                                        "font-semibold text-foreground",
                                        valorLargo &&
                                          "font-mono text-[10px] leading-snug break-all"
                                      )}
                                    >
                                      {fila.valor}
                                    </span>
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {partidosXml.conceptoXml.length > 0 && (
                          <div>
                            <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                              Concepto y domicilio (XML)
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {partidosXml.conceptoXml.map((fila) => {
                                const monoValor =
                                  fila.campo === "Valor Unitario" ||
                                  fila.valor.length > 22
                                return (
                                  <span
                                    key={fila.campo}
                                    className={cn(
                                      pillCfdiBaseClassName,
                                      pillCfdiClasePorCampo("concepto"),
                                      "text-muted-foreground"
                                    )}
                                  >
                                    {fila.campo}:{" "}
                                    <span
                                      className={cn(
                                        "font-semibold text-foreground",
                                        monoValor &&
                                          "font-mono text-[10px] leading-snug break-all"
                                      )}
                                    >
                                      {fila.valor}
                                    </span>
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {partidosXml.timbre.length > 0 && (
                          <div>
                            <p className="mb-2 text-[11px] font-semibold tracking-wider text-sky-800/90 uppercase dark:text-sky-200/90">
                              Timbre fiscal (SAT)
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {partidosXml.timbre.map((fila) => {
                                const monoTimbre =
                                  fila.campo === "No. Certificado SAT" ||
                                  fila.valor.length > 22
                                return (
                                  <span
                                    key={fila.campo}
                                    className={cn(
                                      pillCfdiBaseClassName,
                                      pillCfdiClasePorCampo("timbre"),
                                      "text-muted-foreground"
                                    )}
                                  >
                                    {fila.campo}:{" "}
                                    <span
                                      className={cn(
                                        "font-semibold text-foreground",
                                        monoTimbre &&
                                          "font-mono text-[10px] leading-snug break-all"
                                      )}
                                    >
                                      {fila.valor}
                                    </span>
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-card/60 p-4 shadow-sm ring-1 ring-border/30 sm:p-5">
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Conceptos facturados
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Emisión {valorCampoXml(camposDesdeXml, "Fecha")}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-foreground tabular-nums shadow-sm ring-1 ring-violet-500/15 dark:bg-violet-500/15">
                            Total {valorCampoXml(camposDesdeXml, "Total")}
                          </span>
                        </div>
                        <div className="mt-4 space-y-3">
                          {(conceptosDesdeXml.length > 0
                            ? conceptosDesdeXml
                            : [
                                {
                                  descripcion: movimiento.descripcion,
                                  cantidad: valorCampoXml(
                                    camposDesdeXml,
                                    "Cantidad"
                                  ),
                                  claveUnidad: "—",
                                  valorUnitario: valorCampoXml(
                                    camposDesdeXml,
                                    "Valor Unitario"
                                  ),
                                  importe: valorCampoXml(
                                    camposDesdeXml,
                                    "Importe"
                                  ),
                                  objetoImp: valorCampoXml(
                                    camposDesdeXml,
                                    "Objeto Imp"
                                  ),
                                  traslados: [],
                                },
                              ]
                          ).map((concepto, indiceConcepto) => (
                            <div
                              key={`${concepto.descripcion}-${String(indiceConcepto)}`}
                              className="rounded-xl border border-border/50 bg-background/40 p-3"
                            >
                              <p className="text-sm font-medium text-foreground">
                                {concepto.descripcion}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-foreground tabular-nums">
                                  Cant. {concepto.cantidad || "—"}
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-foreground tabular-nums">
                                  Valor unitario {concepto.valorUnitario || "—"}
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-foreground tabular-nums">
                                  Importe {concepto.importe || "—"}
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground">
                                  Objeto imp {concepto.objetoImp || "—"}
                                </span>
                              </div>
                              {concepto.traslados.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {concepto.traslados.map(
                                    (traslado, indiceTraslado) => (
                                      <span
                                        key={`${traslado.impuesto}-${String(indiceTraslado)}`}
                                        className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-800 tabular-nums dark:text-emerald-200"
                                      >
                                        Imp {traslado.impuesto} · Base{" "}
                                        {traslado.base} · Tasa{" "}
                                        {traslado.tasaOCuota} · Importe{" "}
                                        {traslado.importe}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">
                                    Categoría
                                  </Label>
                                  <FinancialAuthorizationPillSelect
                                    value={
                                      categoriaPorConcepto[indiceConcepto] ?? ""
                                    }
                                    onChange={(value) =>
                                      setCategoriaPorConcepto((prev) => ({
                                        ...prev,
                                        [indiceConcepto]: value,
                                      }))
                                    }
                                    placeholder="Seleccione categoría"
                                    options={[
                                      {
                                        value: "",
                                        label: "Seleccione categoría",
                                      },
                                      ...[...categoriaOptions].sort((a, b) =>
                                        claveOrdenAlfabetico(a.label).localeCompare(
                                          claveOrdenAlfabetico(b.label),
                                          "es",
                                          {
                                            sensitivity: "base",
                                          }
                                        )
                                      ),
                                    ]}
                                    className="max-w-full"
                                    ariaLabel={`Categoría del concepto ${String(indiceConcepto + 1)}`}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">
                                    Indicador de impuesto
                                  </Label>
                                  <FinancialAuthorizationPillSelect
                                    value={
                                      indicadorPorConcepto[indiceConcepto] ?? ""
                                    }
                                    onChange={(value) =>
                                      setIndicadorPorConcepto((prev) => ({
                                        ...prev,
                                        [indiceConcepto]: value,
                                      }))
                                    }
                                    placeholder="Seleccione"
                                    options={[
                                      { value: "", label: "Seleccione" },
                                      ...indicadorImpuestoOptions,
                                    ]}
                                    className="max-w-full"
                                    ariaLabel={`Indicador de impuesto del concepto ${String(indiceConcepto + 1)}`}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
              )}

              {!ocultarDetallesMovimiento && (
                <div className="mt-5 space-y-4">
                <div className="group rounded-xl border border-slate-200/90 bg-linear-to-br from-slate-500/[0.07] to-card/95 p-4 shadow-sm ring-1 ring-slate-300/20 transition-all duration-300 hover:shadow-md dark:border-slate-600/40 dark:from-slate-500/12 dark:ring-slate-500/25">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700 shadow-inner transition-transform duration-300 group-hover:rotate-6 dark:text-violet-300">
                      <MessageSquareQuote
                        className="size-[18px] transition-transform duration-300 group-hover:-rotate-3"
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Comentario al comprobar
                      </p>
                      <p className="text-sm leading-relaxed text-foreground">
                        {textoComentarioUsuarioAlComprobar(movimiento)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="comentario-revision-fin"
                    className="text-xs text-muted-foreground"
                  >
                    Notas del revisor (opcional)
                  </Label>
                  <Textarea
                    id="comentario-revision-fin"
                    value={comentarioRevision}
                    onChange={(e) => setComentarioRevision(e.target.value)}
                    placeholder="Observaciones internas para la revisión contable."
                    rows={3}
                    className="resize-y transition-shadow duration-200 focus-visible:border-violet-400/50 focus-visible:ring-2 focus-visible:ring-violet-500/25"
                  />
                </div>
              </div>
              )}

              {!ocultarDetallesMovimiento && (
                <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border/40 pt-5">
                <Button
                  type="button"
                  disabled={descargaEnCurso !== null}
                  className={cn(
                    "group cursor-pointer gap-2 border-0 bg-linear-to-br from-violet-600 via-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-500/35 transition-all duration-300",
                    "hover:scale-[1.03] hover:shadow-xl hover:shadow-violet-500/45 active:scale-[0.98]",
                    "disabled:pointer-events-none disabled:opacity-55"
                  )}
                  onClick={() => {
                    if (cfdiMovimiento === null) {
                      showAppToast(
                        "Aun no se ha cargado el XML del backend.",
                        "info"
                      )
                      return
                    }
                    setDescargaEnCurso("xml")
                    descargarTextoComoArchivo(
                      cfdiMovimiento.xmlRaw,
                      `cfdi-mov-${movimiento.numeroMovimiento}.xml`,
                      "application/xml;charset=utf-8"
                    )
                    showAppToast("XML descargado.", "success")
                    window.setTimeout(() => setDescargaEnCurso(null), 500)
                  }}
                >
                  {descargaEnCurso === "xml" ? (
                    <Loader2
                      className="size-4 shrink-0 animate-spin"
                      aria-hidden
                    />
                  ) : (
                    <FileDown
                      className="size-4 shrink-0 transition-transform duration-300 group-hover:-rotate-12"
                      aria-hidden
                    />
                  )}
                  Descargar XML
                </Button>
                <Button
                  type="button"
                  disabled={descargaEnCurso !== null}
                  className={cn(
                    "group cursor-pointer gap-2 border-0 bg-linear-to-br from-rose-600 via-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30 transition-all duration-300",
                    "hover:scale-[1.03] hover:shadow-xl hover:shadow-orange-500/35 active:scale-[0.98]",
                    "disabled:pointer-events-none disabled:opacity-55"
                  )}
                  onClick={() => {
                    const tripId = Number.parseInt(viaje.idViaje, 10)
                    if (Number.isNaN(tripId)) {
                      showAppToast(
                        "No se pudo identificar el viaje para descargar el PDF.",
                        "info"
                      )
                      return
                    }
                    setDescargaEnCurso("pdf")
                    void downloadMovementPdfFromSupabase({
                      tripId,
                      movementSequence: movimiento.numeroMovimiento,
                    })
                      .then((nombreArchivo) => {
                        showAppToast(
                          `PDF descargado (${nombreArchivo}).`,
                          "success"
                        )
                      })
                      .catch((error: unknown) => {
                        logTravelAxiosError(
                          `financial-authorization:Review:DescargarPdf movimientoId=${movimiento.id}`,
                          error
                        )
                        const mensaje = userMessageFromTravelAxiosError(error)
                        showAppToast(
                          mensaje.length > 0
                            ? mensaje
                            : "No se pudo descargar el PDF de la comprobación.",
                          "error"
                        )
                      })
                      .finally(() => {
                        window.setTimeout(() => setDescargaEnCurso(null), 500)
                      })
                  }}
                >
                  {descargaEnCurso === "pdf" ? (
                    <Loader2
                      className="size-4 shrink-0 animate-spin"
                      aria-hidden
                    />
                  ) : (
                    <FileText
                      className="size-4 shrink-0 transition-transform duration-300 group-hover:rotate-6"
                      aria-hidden
                    />
                  )}
                  Descargar PDF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="group cursor-pointer gap-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-destructive/40 hover:bg-destructive/5 hover:shadow-md active:scale-[0.98]"
                  onClick={() => {
                    showAppToast("Movimiento declinado.", "info")
                  }}
                >
                  <XCircle
                    className="size-4 transition-transform duration-300 group-hover:rotate-90"
                    aria-hidden
                  />
                  Declinar
                </Button>
                <Button
                  type="button"
                  disabled={
                    aprobacionSapEnCurso ||
                    movimiento.facturadoSapMock === true ||
                    movimiento.proofStatus === "approved" ||
                    descargaEnCurso !== null
                  }
                  className="group cursor-pointer gap-2 bg-emerald-600 shadow-md shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/35 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
                  onClick={() => {
                    void (async () => {
                      if (movimiento.tripMovementProofId === undefined) {
                        showAppToast(
                          "Este movimiento no tiene comprobación vinculada para enviar a SAP.",
                          "info"
                        )
                        return
                      }
                      if (
                        movimiento.proofType !== undefined &&
                        movimiento.proofType !== "invoice"
                      ) {
                        showAppToast(
                          "Solo las comprobaciones tipo factura (CFDI) pueden registrarse en SAP.",
                          "info"
                        )
                        return
                      }
                      if (
                        movimiento.proofStatus !== undefined &&
                        movimiento.proofStatus !== "submitted"
                      ) {
                        showAppToast(
                          "Esta comprobación ya no está pendiente de aprobación.",
                          "info"
                        )
                        return
                      }
                      const accountCode = categoriaPorConcepto[0]?.trim() ?? ""
                      const taxCode = indicadorPorConcepto[0]?.trim() ?? ""
                      if (accountCode.length === 0 || taxCode.length === 0) {
                        showAppToast(
                          "Selecciona categoría e indicador de impuesto en el primer concepto del CFDI.",
                          "info"
                        )
                        return
                      }
                      setAprobacionSapEnCurso(true)
                      try {
                        const { docEntry } = await aprobarMovimientoFacturaSap({
                          movimientoId: movimiento.id,
                          tripMovementProofId: movimiento.tripMovementProofId,
                          accountCode,
                          taxCode,
                          reviewerNotes:
                            comentarioRevision.trim().length > 0
                              ? comentarioRevision.trim()
                              : undefined,
                        })
                        showAppToast(
                          `Movimiento aprobado. SAP DocEntry ${String(docEntry)}.`,
                          "success"
                        )
                      } catch (error: unknown) {
                        logTravelAxiosError(
                          `financial-authorization:Review:Aprobar movimientoId=${movimiento.id} tripMovementProofId=${String(movimiento.tripMovementProofId)}`,
                          error
                        )
                        showAppToast(
                          userMessageFromTravelAxiosError(error),
                          "info"
                        )
                      } finally {
                        setAprobacionSapEnCurso(false)
                      }
                    })()
                  }}
                >
                  {aprobacionSapEnCurso ? (
                    <Loader2
                      className="size-4 shrink-0 animate-spin transition-transform duration-300"
                      aria-hidden
                    />
                  ) : (
                    <CheckCircle2
                      className="size-4 transition-transform duration-300 group-hover:rotate-12"
                      aria-hidden
                    />
                  )}
                  Aprobar
                </Button>
              </div>
              )}
            </div>
          </div>
        )
      })()}

      {resumenSeleccionEnvio !== null && (
        <div className="mt-8 mb-8 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 shadow-sm sm:p-5 dark:bg-emerald-500/15">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Envío conjunto de facturas a SAP
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {resumenSeleccionEnvio.cantidad} factura
                {resumenSeleccionEnvio.cantidad === 1 ? "" : "s"} seleccionada
                {resumenSeleccionEnvio.cantidad === 1 ? "" : "s"} · importe
                acumulado{" "}
                <span className="font-semibold text-emerald-800 tabular-nums dark:text-emerald-200">
                  {formatearMonto(resumenSeleccionEnvio.total)}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={limpiarSeleccionEnvio}
              >
                Quitar selección
              </Button>
              <Button
                type="button"
                className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={enviarAprobacionMovimientosConjunta}
              >
                <CheckCircle2 className="size-4" aria-hidden />
                Enviar facturas a SAP
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-slate-300/60 bg-muted/20 p-4 shadow-sm sm:p-5 dark:border-slate-600/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Cerrar contabilidad
            </p>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              La solicitud permanece en la cola aunque todos los movimientos
              estén facturados en SAP, hasta que confirmes el cierre. Se guarda
              quién cierra.
            </p>
            {todosFacturadosSapMock ? (
              <p className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-200">
                Todos los movimientos comprobados ya tienen registro SAP;
                solo falta este cierre para quitar la tarjeta del listado.
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="h-11 shrink-0 cursor-pointer gap-2 border-violet-500/40 bg-violet-500/15 px-4 text-violet-950 hover:bg-violet-500/25 dark:text-violet-100"
            onClick={() => {
              cerrarContabilidadMock()
            }}
          >
            <Lock className="size-4" aria-hidden />
            Cerrar contabilidad
          </Button>
        </div>
      </div>
    </div>
  )
}
