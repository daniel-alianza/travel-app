import {
  ClipboardCheck,
  CreditCard,
  Filter,
  Hash,
  Layers,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  X,
} from "lucide-react"

import { ListPaginationBar } from "@/components/list-pagination-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FinancialAuthorizationPillSelect } from "@/features/financial-authorization/components/FinancialAuthorizationPillSelect"
import { filtrosInputClassName } from "@/features/financial-authorization/hooks/financial-authorization-ui-constants"
import {
  formatearFechaCorta,
  formatearMonto,
  movimientosConComprobacionUsuarioColaborador,
  rangoFechasSolicitud,
  totalComprobadoSolicitud,
} from "@/features/financial-authorization/hooks/financial-authorization-page-helpers"
import type { FinancialAuthorizationPageController } from "@/features/financial-authorization/interfaces/financial-authorization-page-controller.interface"
import { cn } from "@/lib/utils"

export function FinancialAuthorizationDashboard(props: {
  page: FinancialAuthorizationPageController
}) {
  const {
    mounted,
    cargando,
    errorCarga,
    solicitudEnRevision,
    haySolicitudes,
    resumen,
    filtrosActivos,
    cargarSolicitudes,
    filtros,
    companiasFiltro,
    areasFiltro,
    setFiltros,
    limpiarFiltros,
    solicitudesFiltradas,
    solicitudesListadoPagina,
    paginaListado,
    totalPaginasListado,
    tamanoPaginaListado,
    opcionesTamanoPaginaListado,
    onPaginaListadoAnterior,
    onPaginaListadoSiguiente,
    onCambiarTamanoPaginaListado,
    solicitudIdAbriendoRevision,
    abrirRevisionConFeedback,
  } = props.page

  return (
    <>
      <header
        className={`mb-8 transition-all duration-700 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="group flex h-14 w-14 shrink-0 cursor-default items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:shadow-violet-500/35">
            <ClipboardCheck className="h-7 w-7 text-white transition-transform duration-500 group-hover:-rotate-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Autorización contable
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-pretty text-muted-foreground sm:text-base">
              Viáticos con comprobaciones listas para revisión financiera. Cada
              tarjeta es una solicitud (puede agrupar varios viajes); usa{" "}
              <span className="font-medium text-foreground">
                Abrir revisión
              </span>{" "}
              para ver movimientos, norma de reparto y CFDI.
            </p>
          </div>
        </div>
      </header>

      <section
        className={`group/cola mb-8 rounded-3xl border border-border/60 bg-card/40 p-5 shadow-lg ring-1 shadow-black/5 ring-violet-500/10 backdrop-blur-sm transition-all duration-700 ease-out hover:shadow-xl hover:shadow-violet-500/10 hover:ring-violet-500/20 sm:p-6 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{ transitionDelay: mounted ? "80ms" : "0ms" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Cola de revisión
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {cargando && (
                <Loader2
                  className="size-4 shrink-0 animate-spin text-violet-600"
                  aria-hidden
                />
              )}
              <p className="text-sm text-muted-foreground">
                {cargando
                  ? "Sincronizando solicitudes con comprobación cerrada…"
                  : errorCarga !== null
                    ? errorCarga
                    : "Vista en tarjetas; filtra y abre una solicitud para revisar el detalle."}
              </p>
            </div>
            {!cargando &&
              errorCarga === null &&
              solicitudEnRevision === null &&
              haySolicitudes && (
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {resumen.solicitudes} solicitud
                  {resumen.solicitudes === 1 ? "" : "es"} encontrada
                  {resumen.solicitudes === 1 ? "" : "s"}
                </p>
              )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!cargando && errorCarga === null && haySolicitudes && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex flex-wrap justify-end gap-2">
                  <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-500/45 hover:shadow-md dark:text-violet-200">
                    <Hash
                      className="size-3.5 transition-transform duration-300 group-hover/cola:rotate-12"
                      aria-hidden
                    />
                    {resumen.solicitudes} solicitud
                    {resumen.solicitudes === 1 ? "" : "es"}
                  </span>
                  <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-md">
                    <Layers
                      className="size-3.5 transition-transform duration-300 group-hover/cola:rotate-6"
                      aria-hidden
                    />
                    {resumen.viajesEnCola} viaje
                    {resumen.viajesEnCola === 1 ? "" : "s"} en cola
                  </span>
                  <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-md">
                    {resumen.movs} movimiento
                    {resumen.movs === 1 ? "" : "s"} comprobado
                    {resumen.movs === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex cursor-default items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md dark:text-emerald-200">
                    Total acumulado {formatearMonto(resumen.total)}
                  </span>
                </div>
                {filtrosActivos && resumen.totalEnSistema > 0 && (
                  <p className="text-right text-[11px] text-muted-foreground">
                    Vista filtrada · {resumen.solicitudes} de{" "}
                    {resumen.totalEnSistema} solicitudes
                  </p>
                )}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="group/refresh cursor-pointer gap-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/45 hover:shadow-md active:translate-y-0"
              disabled={cargando}
              onClick={() => void cargarSolicitudes()}
            >
              <RefreshCw
                className={`size-3.5 transition-transform duration-500 ease-out ${cargando ? "animate-spin" : "group-hover/refresh:rotate-180"}`}
                aria-hidden
              />
              Actualizar
            </Button>
          </div>
        </div>
      </section>

      {!cargando && errorCarga === null && haySolicitudes && (
        <section
          className={`relative z-30 mb-8 rounded-3xl border border-violet-500/25 bg-linear-to-br from-card/80 via-card/60 to-violet-500/5 p-5 shadow-lg ring-1 shadow-violet-500/10 ring-violet-500/15 backdrop-blur-sm transition-all duration-700 hover:shadow-xl hover:shadow-violet-500/15 hover:ring-violet-500/25 sm:p-6 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
          style={{ transitionDelay: mounted ? "100ms" : "0ms" }}
          aria-label="Filtros de búsqueda"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="group/filt flex h-11 w-11 shrink-0 cursor-default items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/25 to-cyan-500/10 text-violet-700 shadow-inner ring-1 ring-violet-500/20 transition-all duration-300 hover:scale-105 hover:shadow-md hover:ring-violet-400/40 dark:text-violet-200">
                <Filter
                  className="size-5 transition-transform duration-500 group-hover/filt:-rotate-12"
                  aria-hidden
                />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Filtros
                </h2>
                <p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
                  Ajusta nombre, correo, últimos 4 de tarjeta, rango de monto
                  total comprobado, compañía y área para ver solo lo que
                  necesitas.
                </p>
              </div>
            </div>
            {filtrosActivos && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 cursor-pointer gap-2 transition-all hover:border-violet-500/40"
                onClick={limpiarFiltros}
              >
                <X className="size-3.5" aria-hidden />
                Limpiar filtros
              </Button>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label
                htmlFor="filtro-nombre-fin"
                className="text-xs text-muted-foreground"
              >
                Nombre o folio
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="filtro-nombre-fin"
                  type="search"
                  autoComplete="off"
                  placeholder="Ej. María, SV-2026…"
                  value={filtros.textoNombre}
                  onChange={(e) =>
                    setFiltros((f) => ({
                      ...f,
                      textoNombre: e.target.value,
                    }))
                  }
                  className={cn(filtrosInputClassName, "cursor-text pl-9")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="filtro-correo-fin"
                className="text-xs text-muted-foreground"
              >
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="filtro-correo-fin"
                  type="search"
                  autoComplete="off"
                  inputMode="email"
                  placeholder="dominio o correo"
                  value={filtros.textoCorreo}
                  onChange={(e) =>
                    setFiltros((f) => ({
                      ...f,
                      textoCorreo: e.target.value,
                    }))
                  }
                  className={cn(filtrosInputClassName, "cursor-text pl-9")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="filtro-monto-min"
                className="text-xs text-muted-foreground"
              >
                Monto total mín. (MXN)
              </Label>
              <Input
                id="filtro-monto-min"
                inputMode="decimal"
                placeholder="0"
                value={filtros.montoMin}
                onChange={(e) =>
                  setFiltros((f) => ({
                    ...f,
                    montoMin: e.target.value,
                  }))
                }
                className={cn(
                  filtrosInputClassName,
                  "cursor-text font-mono text-sm tabular-nums"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="filtro-monto-max"
                className="text-xs text-muted-foreground"
              >
                Monto total máx. (MXN)
              </Label>
              <Input
                id="filtro-monto-max"
                inputMode="decimal"
                placeholder="Sin tope"
                value={filtros.montoMax}
                onChange={(e) =>
                  setFiltros((f) => ({
                    ...f,
                    montoMax: e.target.value,
                  }))
                }
                className={cn(
                  filtrosInputClassName,
                  "cursor-text font-mono text-sm tabular-nums"
                )}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label
                htmlFor="filtro-compania"
                className="text-xs text-muted-foreground"
              >
                Compañía
              </Label>
              <FinancialAuthorizationPillSelect
                id="filtro-compania"
                value={filtros.compania}
                placeholder="Todas las compañías"
                onChange={(value) =>
                  setFiltros((f) => ({ ...f, compania: value }))
                }
                options={[
                  {
                    value: "",
                    label: "Todas las compañías",
                  },
                  ...companiasFiltro.map((c) => ({
                    value: c,
                    label: c,
                  })),
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="filtro-area"
                className="text-xs text-muted-foreground"
              >
                Área
              </Label>
              <FinancialAuthorizationPillSelect
                id="filtro-area"
                value={filtros.area}
                placeholder="Todas las áreas"
                onChange={(value) => setFiltros((f) => ({ ...f, area: value }))}
                options={[
                  {
                    value: "",
                    label: "Todas las áreas",
                  },
                  ...areasFiltro.map((a) => ({
                    value: a,
                    label: a,
                  })),
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="filtro-tarjeta-fin"
                className="text-xs text-muted-foreground"
              >
                Tarjeta (últimos 4)
              </Label>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="filtro-tarjeta-fin"
                  type="search"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Ej. 9300"
                  value={filtros.ultimos4Tarjeta}
                  onChange={(e) => {
                    const solo = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setFiltros((f) => ({
                      ...f,
                      ultimos4Tarjeta: solo,
                    }))
                  }}
                  className={cn(
                    filtrosInputClassName,
                    "cursor-text pl-9 font-mono text-sm tracking-wider tabular-nums"
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {cargando && (
        <div className="space-y-4" aria-busy="true" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`sk-card-${i}`}
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 shadow-md ring-1 ring-border/30"
                style={{
                  animationDelay: `${i * 90}ms`,
                  animation: "travel-panel-fade-in 0.55s ease-out both",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
                  aria-hidden
                >
                  <div className="animate-fin-auth-skeleton-shimmer absolute inset-y-0 left-0 w-[70%] min-w-40 bg-linear-to-r from-transparent via-foreground/10 to-transparent opacity-70 dark:via-foreground/15" />
                </div>
                <div className="relative animate-pulse space-y-0">
                  <div className="h-3 w-28 rounded-md bg-muted shadow-inner" />
                  <div className="mt-4 h-6 w-3/4 max-w-xs rounded-md bg-muted shadow-inner" />
                  <div className="mt-3 h-3 w-full rounded-md bg-muted/80" />
                  <div className="mt-2 h-3 w-5/6 rounded-md bg-muted/70" />
                  <div className="mt-6 flex gap-2">
                    <div className="h-8 flex-1 rounded-lg bg-muted/90 shadow-sm" />
                    <div className="h-8 w-24 rounded-lg bg-muted/90 shadow-sm" />
                  </div>
                  <div className="mt-4 h-11 w-full rounded-xl bg-muted shadow-inner" />
                </div>
              </div>
            ))}
          </div>
          <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Loader2
              className="size-3.5 shrink-0 animate-spin text-violet-600"
              aria-hidden
            />
            Cargando solicitudes y movimientos comprobados…
          </p>
        </div>
      )}

      {!cargando && errorCarga !== null && (
        <div
          className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center transition-all duration-500"
          role="alert"
        >
          <p className="text-sm font-medium text-destructive">{errorCarga}</p>
          <Button
            type="button"
            className="mt-4 cursor-pointer"
            onClick={() => void cargarSolicitudes()}
          >
            Reintentar
          </Button>
        </div>
      )}

      {!cargando &&
        errorCarga === null &&
        haySolicitudes &&
        solicitudesFiltradas.length === 0 && (
          <div
            className="mb-8 rounded-3xl border border-amber-500/25 bg-amber-500/5 p-8 text-center transition-all duration-500"
            role="status"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-800 dark:text-amber-200">
              <Search className="size-7" aria-hidden />
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              No hay solicitudes que coincidan con los filtros
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba ampliar el rango de montos, quitar compañía o área, o
              limpiar los filtros para ver de nuevo toda la cola.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 cursor-pointer gap-2"
              onClick={limpiarFiltros}
            >
              <X className="size-4" aria-hidden />
              Limpiar filtros
            </Button>
          </div>
        )}

      {!cargando && errorCarga === null && !haySolicitudes && (
        <div className="rounded-3xl border border-dashed border-border/80 bg-muted/20 p-12 text-center transition-all duration-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/15 to-violet-600/10 shadow-inner">
            <ClipboardCheck className="h-8 w-8 text-violet-600/80 dark:text-violet-300/90" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">
            No hay solicitudes en cola
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cuando existan solicitudes (una sola por envío, con los viajes que
            correspondan) ya aprobadas y con todos los movimientos comprobados,
            aparecerán aquí para revisión financiera.
          </p>
        </div>
      )}

      {!cargando &&
        errorCarga === null &&
        haySolicitudes &&
        solicitudesFiltradas.length > 0 && (
          <section
            className="relative z-10 space-y-4"
            aria-label="Solicitudes pendientes de revisión contable"
          >
            <p className="text-xs text-muted-foreground sm:text-sm">
              Solo solicitudes con al menos un movimiento ya comprobado por el
              colaborador. Sigue visible hasta{" "}
              <span className="font-medium text-foreground">
                Cerrar contabilidad
              </span>
              , aunque todo esté facturado en SAP.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {solicitudesListadoPagina.map((solicitud) => {
                const total = totalComprobadoSolicitud(solicitud)
                const movsColaborador =
                  movimientosConComprobacionUsuarioColaborador(solicitud)
                const nMovs = movsColaborador.length
                const nFacturadosSap = movsColaborador.filter(
                  (m) => m.facturadoSapMock === true
                ).length
                const nViajes = solicitud.viajes.length
                const { salida, regreso } = rangoFechasSolicitud(solicitud)
                return (
                  <article
                    key={solicitud.id}
                    className="group/card relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-md ring-1 shadow-black/4 ring-border/40 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-violet-400/45 hover:shadow-2xl hover:shadow-violet-500/15 hover:ring-violet-500/25"
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-95 bg-linear-to-r from-violet-500 via-violet-400 to-cyan-500/80 opacity-90 transition-transform duration-500 ease-out group-hover/card:scale-x-100"
                      aria-hidden
                    />
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-mono text-xs font-semibold tracking-tight text-violet-700 dark:text-violet-300">
                            {solicitud.folioSolicitud}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Comprobación cerrada ·{" "}
                            {formatearFechaCorta(
                              solicitud.fechaCierreComprobacion
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                            Total comprobado
                          </p>
                          <p className="text-2xl font-semibold text-emerald-700 tabular-nums dark:text-emerald-300">
                            {formatearMonto(total)}
                          </p>
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg leading-snug font-semibold text-foreground">
                        {solicitud.solicitante}
                      </h3>
                      <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Mail
                          className="mt-0.5 size-3.5 shrink-0 opacity-70"
                          aria-hidden
                        />
                        <span className="min-w-0 break-all">
                          {solicitud.correoElectronico}
                        </span>
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <CreditCard
                          className="size-3.5 shrink-0 opacity-70"
                          aria-hidden
                        />
                        <span className="tracking-wide tabular-nums">
                          Tarjeta · **** {solicitud.tarjetaUltimos4}
                        </span>
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex max-w-full items-center rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground">
                          {solicitud.empresa}
                        </span>
                        <span className="inline-flex items-center rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-900 dark:text-violet-100">
                          {solicitud.area}
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {solicitud.resumen}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border/50 bg-muted/25 px-3 py-3 text-xs shadow-inner transition-shadow duration-300 group-hover/card:shadow-sm sm:grid-cols-3">
                        <div>
                          <p className="font-medium text-muted-foreground">
                            Viajes
                          </p>
                          <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                            {nViajes}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">
                            Movimientos
                          </p>
                          <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                            {nMovs}
                          </p>
                          {nFacturadosSap > 0 && (
                            <p className="mt-1 text-[10px] text-emerald-700 dark:text-emerald-300">
                              SAP: {nFacturadosSap}/{nMovs} facturados
                            </p>
                          )}
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="font-medium text-muted-foreground">
                            Periodo
                          </p>
                          <p className="mt-0.5 leading-tight font-medium text-foreground">
                            {salida} → {regreso}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        disabled={solicitudIdAbriendoRevision !== null}
                        className="group/abrir mt-5 h-11 w-full cursor-pointer gap-2 bg-emerald-600 text-base font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-[1.01] hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-80"
                        onClick={() =>
                          void abrirRevisionConFeedback(solicitud.id)
                        }
                      >
                        {solicitudIdAbriendoRevision === solicitud.id ? (
                          <Loader2
                            className="size-4 shrink-0 animate-spin"
                            aria-hidden
                          />
                        ) : (
                          <ClipboardCheck
                            className="size-4 shrink-0 transition-transform duration-300 group-hover/abrir:rotate-[-8deg]"
                            aria-hidden
                          />
                        )}
                        Abrir revisión
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>

            <ListPaginationBar
              className="mt-2"
              pagina={paginaListado}
              totalPaginas={totalPaginasListado}
              totalElementos={solicitudesFiltradas.length}
              tamanoPagina={tamanoPaginaListado}
              deshabilitado={cargando}
              etiquetaElemento="solicitudes"
              onPaginaAnterior={onPaginaListadoAnterior}
              onPaginaSiguiente={onPaginaListadoSiguiente}
              onCambiarTamanoPagina={onCambiarTamanoPaginaListado}
              opcionesTamanoPagina={opcionesTamanoPaginaListado}
            />
          </section>
        )}
    </>
  )
}
