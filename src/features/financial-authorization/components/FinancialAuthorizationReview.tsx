import {
  ArrowLeft,
  CheckCircle2,
  FileDown,
  FileText,
  Loader2,
  MessageSquareQuote,
  XCircle,
} from "lucide-react"

import { showAppToast } from "@/components/app-toast"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FinancialAuthorizationPillSelect } from "@/features/financial-authorization/components/FinancialAuthorizationPillSelect"
import {
  camposXmlExtrasRespectoAlaVista,
  construirVistaCfdiTabla,
  descargarTextoComoArchivo,
  encontrarMovimientoEnSolicitud,
  extraerCamposCfdiDesdeXml,
  formatearFechaCorta,
  formatearMonto,
  generarXmlComprobanteCfdiMock,
  idViaticoParaViaje,
  particionarExtrasXmlParaVista,
  pillCfdiBaseClassName,
  pillCfdiClasePorCampo,
  primerNombreCompleto,
  rangoFechasSolicitud,
  tarjetaMock,
  textoComentarioUsuarioAlComprobar,
  totalComprobadoSolicitud,
  valorGeneralCfdi,
} from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import type { FinancialAuthorizationPageController } from "@/features/financial-authorization/interfaces/financial-authorization-page-controller.interface"
import { VIATIC_CATEGORY_OPTIONS } from "@/features/travel-expenses/data/viatic-category-options"
import { cn } from "@/lib/utils"

export function FinancialAuthorizationReview(props: {
  page: FinancialAuthorizationPageController
}) {
  const normaRepartoOptions = [
    { value: "", label: "Seleccione norma de reparto" },
    { value: "n1", label: "Norma corporativa — gastos generales" },
    { value: "n2", label: "Norma por centro de costo" },
    { value: "n3", label: "Norma proyecto / obra" },
  ] as const
  const indicadorImpuestoOptions = [
    { value: "", label: "Seleccione" },
    { value: "si", label: "Sí aplica" },
    { value: "no", label: "No aplica" },
  ] as const
  const categoriaOptions = [
    { value: "", label: "Seleccione categoría" },
    ...VIATIC_CATEGORY_OPTIONS.map((option) => ({
      value: option,
      label: option,
    })),
  ]

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
    setNormaReparto,
    categoriaCfdiConcepto,
    setCategoriaCfdiConcepto,
    indicadorImpCfdiConcepto,
    setIndicadorImpCfdiConcepto,
    indiceSolicitudRevision,
    resumenSeleccionEnvio,
    alternarMovimientoParaEnvio,
    seleccionarTodosMovimientosDelViaje,
    seleccionarTodosMovimientosDeSolicitud,
    limpiarSeleccionEnvio,
    enviarAprobacionMovimientosConjunta,
  } = props.page

  if (solicitudEnRevision === null) {
    return null
  }

  return (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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

                <div className="mb-6 rounded-2xl border border-border/60 bg-card/50 p-5 shadow-2xl shadow-violet-950/10 ring-1 ring-violet-500/15 transition-shadow duration-500 hover:shadow-violet-900/15 dark:shadow-black/40 sm:p-6">
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {solicitudEnRevision.folioSolicitud}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    Solicitud de{" "}
                    {primerNombreCompleto(solicitudEnRevision.solicitante)}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {solicitudEnRevision.viajes.length} viaje
                    {solicitudEnRevision.viajes.length === 1 ? "" : "s"} en un
                    solo envío · {solicitudEnRevision.correoElectronico}
                  </p>
                  <div className="mt-5 grid gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Solicitante
                      </p>
                      <p className="mt-0.5 font-medium text-foreground">
                        {solicitudEnRevision.solicitante}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Motivo / descripción
                      </p>
                      <p className="mt-0.5 text-foreground">
                        {solicitudEnRevision.resumen}
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
                        {formatearMonto(
                          totalComprobadoSolicitud(solicitudEnRevision)
                        )}
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
                          Elige un viaje, marca los gastos para un envío
                          conjunto y abre uno para revisar CFDI.
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
                                  Viaje {idx + 1} de {cantViajes}
                                </span>
                                <span className="mt-1 block leading-snug font-medium text-foreground">
                                  {v.titulo}
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                  {v.destino} ·{" "}
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
                                seleccionarTodosMovimientosDelViaje(
                                  viajeVisible
                                )
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
                        <div className="space-y-3">
                          {viajeVisible.movimientosComprobados.map(
                            (mov, indiceMov) => {
                              const tarjeta = tarjetaMock(
                                indiceSolicitudRevision,
                                indiceViajeSeguro,
                                indiceMov
                              )
                              const seleccionadoVista =
                                movimientoSeleccionadoId === mov.id
                              const marcadoLote =
                                idsMovimientosParaEnvio.includes(mov.id)
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
                                      : "hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-muted/35 hover:shadow-md"
                                  )}
                                >
                                  <div className="flex shrink-0 flex-col items-center pt-1">
                                    <Checkbox
                                      checked={marcadoLote}
                                      onChange={() =>
                                        alternarMovimientoParaEnvio(mov.id)
                                      }
                                      aria-label={`Incluir en envío conjunto: ${mov.descripcion}`}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    className="min-w-0 flex-1 cursor-pointer rounded-xl text-left outline-none transition-transform duration-200 active:scale-[0.995]"
                                    onClick={() =>
                                      setMovimientoSeleccionadoId(mov.id)
                                    }
                                  >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                      <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="inline-flex rounded-lg bg-muted/80 px-2.5 py-1 text-xs font-medium text-foreground tabular-nums">
                                            {formatearFechaCorta(mov.fecha)}
                                          </span>
                                          <span className="inline-flex rounded-lg border border-border/60 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            {mov.categoria}
                                          </span>
                                        </div>
                                        <p className="text-base leading-snug font-medium text-foreground">
                                          {mov.descripcion}
                                        </p>
                                        <p className="font-mono text-xs text-muted-foreground">
                                          Tarjeta {tarjeta}
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
                            }
                          )}
                        </div>
                      </section>
                    </>
                  )
                })()}

                {resumenSeleccionEnvio !== null && (
                  <div className="mb-8 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 shadow-sm sm:p-5 dark:bg-emerald-500/15">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          Envío conjunto
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {resumenSeleccionEnvio.cantidad} movimiento
                          {resumenSeleccionEnvio.cantidad === 1 ? "" : "s"}{" "}
                          seleccionado
                          {resumenSeleccionEnvio.cantidad === 1 ? "" : "s"} ·
                          importe acumulado{" "}
                          <span className="font-semibold text-emerald-800 tabular-nums dark:text-emerald-200">
                            {formatearMonto(resumenSeleccionEnvio.total)}
                          </span>
                        </p>
                        <div className="mt-4 max-w-md space-y-2">
                          <Label
                            htmlFor="norma-reparto-lote"
                            className="text-xs text-muted-foreground"
                          >
                            Norma de reparto (aplica a todo el lote)
                          </Label>
                          <FinancialAuthorizationPillSelect
                            id="norma-reparto-lote"
                            value={normaReparto}
                            placeholder="Seleccione norma de reparto"
                            onChange={setNormaReparto}
                            options={[...normaRepartoOptions]}
                          />
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col lg:items-stretch">
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
                          Enviar aprobación conjunta
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {(() => {
                  const hallado = movimientoSeleccionadoId
                    ? encontrarMovimientoEnSolicitud(
                        solicitudEnRevision,
                        movimientoSeleccionadoId
                      )
                    : undefined
                  if (!hallado) {
                    return null
                  }
                  const { viaje, movimiento, indiceViaje, indiceMovimiento } =
                    hallado
                  const idViat = idViaticoParaViaje(
                    indiceSolicitudRevision,
                    indiceViaje
                  )
                  const tarjeta = tarjetaMock(
                    indiceSolicitudRevision,
                    indiceViaje,
                    indiceMovimiento
                  )
                  const xmlTexto = generarXmlComprobanteCfdiMock(
                    solicitudEnRevision,
                    viaje,
                    movimiento,
                    idViat,
                    tarjeta
                  )
                  const camposDesdeXml = extraerCamposCfdiDesdeXml(xmlTexto)
                  const vistaCfdi = construirVistaCfdiTabla(
                    solicitudEnRevision,
                    movimiento
                  )
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
                            "pointer-events-none scale-[0.99] opacity-45",
                        )}
                      >
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        Detalles del movimiento
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {viaje.titulo} · {formatearFechaCorta(movimiento.fecha)}{" "}
                        · {movimiento.descripcion}
                      </p>

                      <div className="mt-4 space-y-2">
                        <Label
                          htmlFor="norma-reparto-fin"
                          className="text-xs text-muted-foreground"
                        >
                          Norma de reparto
                        </Label>
                        <FinancialAuthorizationPillSelect
                          id="norma-reparto-fin"
                          value={normaReparto}
                          placeholder="Seleccione norma de reparto"
                          onChange={setNormaReparto}
                          options={[...normaRepartoOptions]}
                          className="max-w-md"
                        />
                      </div>

                      <div className="mt-6 space-y-5">
                        {(() => {
                          const c = vistaCfdi.conceptos[0]
                          const g = vistaCfdi.generales
                          const extrasXml =
                            camposXmlExtrasRespectoAlaVista(camposDesdeXml)
                          const partidosXml =
                            particionarExtrasXmlParaVista(extrasXml)
                          if (!c) {
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
                                    {valorGeneralCfdi(g, "RFC emisor")}
                                  </p>
                                  <p className="text-[15px] leading-snug font-medium text-foreground">
                                    {valorGeneralCfdi(g, "Razón social emisor")}
                                  </p>
                                  <p className="text-xs leading-relaxed text-muted-foreground">
                                    {valorGeneralCfdi(
                                      g,
                                      "Régimen fiscal emisor"
                                    )}
                                  </p>
                                </div>
                                <div className="space-y-2 rounded-xl border border-cyan-500/25 bg-linear-to-br from-cyan-500/[0.06] to-card/80 p-4 shadow-sm ring-1 ring-cyan-500/10">
                                  <p className="text-xs font-semibold tracking-wide text-cyan-800 uppercase dark:text-cyan-200">
                                    Receptor
                                  </p>
                                  <p className="font-mono text-sm font-medium text-foreground">
                                    {valorGeneralCfdi(g, "RFC receptor")}
                                  </p>
                                  <p className="text-[15px] leading-snug font-medium text-foreground">
                                    {valorGeneralCfdi(
                                      g,
                                      "Razón social receptor"
                                    )}
                                  </p>
                                  <p className="text-xs leading-relaxed text-muted-foreground">
                                    {valorGeneralCfdi(
                                      g,
                                      "Régimen fiscal receptor"
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
                                        {valorGeneralCfdi(g, "Uso CFDI")}
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
                                        {valorGeneralCfdi(g, "Forma de pago")}
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
                                        {valorGeneralCfdi(g, "Método de pago")}
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
                                        {vistaCfdi.uuidFiscal}
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
                                              pillCfdiClasePorCampo(
                                                "comprobante"
                                              ),
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
                                          fila.campo ===
                                            "No. Certificado SAT" ||
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
                                  Concepto facturado
                                </p>
                                <p className="mt-2 text-base leading-snug font-medium text-foreground">
                                  {c.descripcion}
                                </p>
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                  Emisión {valorGeneralCfdi(g, "emisión")}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-foreground tabular-nums shadow-sm ring-1 ring-violet-500/15 dark:bg-violet-500/15">
                                    Total {valorGeneralCfdi(g, "total")}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-foreground tabular-nums">
                                    Cant. {c.cantidad}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-foreground tabular-nums">
                                    Base {formatearMonto(c.base)}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-foreground tabular-nums">
                                    Importe {formatearMonto(c.importe)}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-800 tabular-nums dark:text-emerald-200">
                                    IVA {formatearMonto(c.iva)}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs text-foreground tabular-nums">
                                    Impuesto {c.impuesto}
                                  </span>
                                  <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground">
                                    {c.impuestoLetra}
                                  </span>
                                </div>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                  <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">
                                      Categoría
                                    </Label>
                                    <FinancialAuthorizationPillSelect
                                      value={categoriaCfdiConcepto}
                                      onChange={setCategoriaCfdiConcepto}
                                      placeholder="Seleccione categoría"
                                      options={categoriaOptions}
                                      className="max-w-full"
                                      ariaLabel="Categoría del concepto"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">
                                      Indicador de impuesto
                                    </Label>
                                    <FinancialAuthorizationPillSelect
                                      value={indicadorImpCfdiConcepto}
                                      onChange={setIndicadorImpCfdiConcepto}
                                      placeholder="Seleccione"
                                      options={[...indicadorImpuestoOptions]}
                                      className="max-w-full"
                                      ariaLabel="Indicador de impuesto"
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          )
                        })()}
                      </div>

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
                            onChange={(e) =>
                              setComentarioRevision(e.target.value)
                            }
                            placeholder="Observaciones internas para la revisión contable."
                            rows={3}
                            className="resize-y transition-shadow duration-200 focus-visible:border-violet-400/50 focus-visible:ring-2 focus-visible:ring-violet-500/25"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border/40 pt-5">
                        <Button
                          type="button"
                          disabled={descargaEnCurso !== null}
                          className={cn(
                            "group cursor-pointer gap-2 border-0 bg-linear-to-br from-violet-600 via-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-500/35 transition-all duration-300",
                            "hover:scale-[1.03] hover:shadow-xl hover:shadow-violet-500/45 active:scale-[0.98]",
                            "disabled:pointer-events-none disabled:opacity-55",
                          )}
                          onClick={() => {
                            setDescargaEnCurso("xml")
                            descargarTextoComoArchivo(
                              xmlTexto,
                              `cfdi-mov-${movimiento.numeroMovimiento}.xml`,
                              "application/xml;charset=utf-8",
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
                            "disabled:pointer-events-none disabled:opacity-55",
                          )}
                          onClick={() => {
                            setDescargaEnCurso("pdf")
                            const cuerpoPdf = `Resumen movimiento ${movimiento.numeroMovimiento}
Solicitud: ${solicitudEnRevision.folioSolicitud}
Monto: ${formatearMonto(movimiento.monto)}
Descripción: ${movimiento.descripcion}
(Contenido simulado; en producción se generará el PDF oficial.)`
                            descargarTextoComoArchivo(
                              cuerpoPdf,
                              `comprobante-mov-${movimiento.numeroMovimiento}.pdf`,
                              "application/pdf",
                            )
                            showAppToast(
                              "Archivo PDF de respaldo generado (simulación).",
                              "info",
                            )
                            window.setTimeout(() => setDescargaEnCurso(null), 500)
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
                            showAppToast(
                              "Movimiento declinado (simulación).",
                              "info",
                            )
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
                          className="group cursor-pointer gap-2 bg-emerald-600 shadow-md shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/35 active:scale-[0.98]"
                          onClick={() => {
                            showAppToast(
                              "Movimiento aprobado (simulación).",
                              "success",
                            )
                          }}
                        >
                          <CheckCircle2
                            className="size-4 transition-transform duration-300 group-hover:rotate-12"
                            aria-hidden
                          />
                          Aprobar
                        </Button>
                      </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
  )
}
