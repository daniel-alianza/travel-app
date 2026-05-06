import {
  CalendarRange,
  ChevronDown,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ExpenseMovimientoTarjetaMovil } from "@/features/travel-expenses/components/ExpenseMovimientoTarjetaMovil"
import {
  ExpenseMovimientosCardsSkeleton,
  ExpenseMovimientosTablaSkeleton,
} from "@/features/travel-expenses/components/ExpenseMovimientosSkeletons"
import { ExpenseMovimientosTablaDesktop } from "@/features/travel-expenses/components/ExpenseMovimientosTablaDesktop"
import {
  formatearMonedaViatico,
  formatearRangoFechasViaje,
  textoDiasRestantes,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimientosPeriodoSectionProps } from "@/features/travel-expenses/interfaces/expense-movimientos-periodo-section-props.interface"
import { cn } from "@/lib/utils"

export function ExpenseMovimientosPeriodoSection({
  viaje,
  viajeActivo,
  movimientosCargando,
  movimientosError,
  movimientosErrorMensaje,
  movimientosDelViaje,
  totalMovimientos,
  pendientes,
  mostrarResumenMovimientos,
  panelMovimientosAbierto,
  comprobacionHabilitada,
  mensajeVentanaPlazoComprobacion,
  etiquetaComprobacionBloqueada,
  onTogglePanelMovimientos,
  onReintentarMovimientos,
  onSolicitarComprobacion,
}: ExpenseMovimientosPeriodoSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-xl shadow-primary/10 backdrop-blur-md transition-all duration-500">
      <button
        type="button"
        aria-expanded={panelMovimientosAbierto}
        onClick={onTogglePanelMovimientos}
        className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-border/50 bg-linear-to-r from-muted/40 via-muted/25 to-transparent px-5 py-4 text-left transition-colors duration-300 hover:bg-muted/50 sm:px-6 sm:py-5"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              Viajes
            </h2>
            {movimientosCargando ? (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin text-accent"
                aria-hidden
              />
            ) : null}
          </div>
          <div className="mt-2 flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="truncate font-medium text-foreground">{viaje.titulo}</span>
            <span
              className={cn(
                "w-fit shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase",
                viajeActivo
                  ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {viajeActivo ? "Activo" : "Historial"}
            </span>
          </div>
          <p className="mt-1 text-[0.7rem] text-muted-foreground sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <CalendarRange className="h-3 w-3 shrink-0" aria-hidden />
              {formatearRangoFechasViaje(viaje.fechaSalida, viaje.fechaRegreso)}
            </span>
            <span className="mx-1.5 text-border">·</span>
            <span>{textoDiasRestantes(viaje)}</span>
          </p>
          {mensajeVentanaPlazoComprobacion ? (
            <p className="mt-2 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs leading-relaxed text-sky-950 dark:text-sky-100 sm:text-sm">
              {mensajeVentanaPlazoComprobacion}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {movimientosCargando ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-40 animate-pulse rounded bg-muted" />
                <span className="text-muted-foreground/80">Sincronizando…</span>
              </span>
            ) : movimientosError ? (
              <span className="text-destructive">Error al cargar. Reintenta abajo.</span>
            ) : (
              <>
                Movimientos del viaje seleccionado ·{" "}
                {movimientosDelViaje.length} movimiento
                {movimientosDelViaje.length === 1 ? "" : "s"}
                {mostrarResumenMovimientos ? (
                  <>
                    {" "}
                    · Total registrado{" "}
                    <span className="font-semibold text-accent">
                      {formatearMonedaViatico(totalMovimientos)}
                    </span>
                    {pendientes.length > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400">
                        {" "}
                        · {pendientes.length} pendiente
                        {pendientes.length === 1 ? "" : "s"} de comprobación
                      </span>
                    ) : null}
                  </>
                ) : null}
              </>
            )}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
            panelMovimientosAbierto ? "rotate-180" : "rotate-0"
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-500 ease-out",
          panelMovimientosAbierto
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="p-4 sm:p-6">
            {movimientosError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-10 text-center">
                <p className="text-sm font-medium text-foreground">
                  No se pudieron obtener los movimientos
                </p>
                {movimientosErrorMensaje ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {movimientosErrorMensaje}
                  </p>
                ) : null}
                <Button
                  type="button"
                  className="mt-6 cursor-pointer rounded-2xl"
                  onClick={onReintentarMovimientos}
                >
                  Reintentar
                </Button>
              </div>
            ) : movimientosCargando ? (
              <>
                <ExpenseMovimientosCardsSkeleton />
                <ExpenseMovimientosTablaSkeleton />
              </>
            ) : movimientosDelViaje.length === 0 ? (
              <>
                <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-12 text-center">
                  <p className="text-sm font-medium text-foreground">
                    Aún no han subido sus extractos bancarios a SAP
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Aún no han subido sus extractos (movimientos) bancarios a SAP en
                    los rangos de fechas de este viaje.
                  </p>
                </div>

              </>
            ) : (
              <>
                <ul className="grid gap-4 lg:hidden" role="list">
                  {movimientosDelViaje.map((mov) => (
                    <li key={mov.id}>
                      <ExpenseMovimientoTarjetaMovil
                        movimiento={mov}
                        comprobacionHabilitada={comprobacionHabilitada}
                        etiquetaComprobacionBloqueada={
                          etiquetaComprobacionBloqueada ?? undefined
                        }
                        onSolicitarComprobacion={onSolicitarComprobacion}
                      />
                    </li>
                  ))}
                </ul>

                <ExpenseMovimientosTablaDesktop
                  movimientos={movimientosDelViaje}
                  comprobacionHabilitada={comprobacionHabilitada}
                  etiquetaComprobacionBloqueada={
                    etiquetaComprobacionBloqueada ?? undefined
                  }
                  onSolicitarComprobacion={onSolicitarComprobacion}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
