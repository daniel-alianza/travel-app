import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/store/authStore"
import { ExpenseComprobacionModal } from "@/features/travel-expenses/components/ExpenseComprobacionModal"
import { ExpenseConciliacionOverlay } from "@/features/travel-expenses/components/ExpenseConciliacionOverlay"
import { ExpenseHistorialViajesSection } from "@/features/travel-expenses/components/ExpenseHistorialViajesSection"
import { ExpenseMovimientosPeriodoSection } from "@/features/travel-expenses/components/ExpenseMovimientosPeriodoSection"
import { ExpensePageHero } from "@/features/travel-expenses/components/ExpensePageHero"
import { ExpenseResumenMesSection } from "@/features/travel-expenses/components/ExpenseResumenMesSection"
import { ExpenseViajesActivosSection } from "@/features/travel-expenses/components/ExpenseViajesActivosSection"
import {
  totalGastosMovimientos,
  viajeEsActivo,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import { useExpenseComprobacionMovimiento } from "@/features/travel-expenses/hooks/useExpenseComprobacionMovimiento"
import { useExpensePage } from "@/features/travel-expenses/hooks/useExpensePage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import { cn } from "@/lib/utils"

export function ExpensePage() {
  const navigate = useNavigate()
  const page = useExpensePage()
  const nombreResponsable = useAuthStore((state) => state.nombreResponsable)
  const comprobacion = useExpenseComprobacionMovimiento()

  if (page.viajesInicialPendiente) {
    return (
      <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
        <TravelRequestBackground mousePosition={page.mousePosition} />
        <AppHeader
          mounted={page.mounted}
          onBackToHome={() => navigate("/home")}
        />
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent" aria-hidden />
          <p className="text-sm text-muted-foreground">
            Cargando viajes dispersados…
          </p>
        </main>
        <AppFooter mounted transitionDelayClass="delay-700" />
      </div>
    )
  }

  if (page.viajesError) {
    return (
      <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
        <TravelRequestBackground mousePosition={page.mousePosition} />
        <AppHeader
          mounted={page.mounted}
          onBackToHome={() => navigate("/home")}
        />
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <p className="text-center text-sm font-medium text-foreground">
            No se pudieron cargar los viajes
          </p>
          {page.viajesErrorMensaje ? (
            <p className="text-center text-xs text-muted-foreground">
              {page.viajesErrorMensaje}
            </p>
          ) : null}
          <Button
            type="button"
            className="cursor-pointer rounded-2xl"
            onClick={() => page.reintentarViajes()}
          >
            Reintentar
          </Button>
        </main>
        <AppFooter mounted transitionDelayClass="delay-700" />
      </div>
    )
  }

  if (!page.viajeSeleccionado) {
    return (
      <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
        <TravelRequestBackground mousePosition={page.mousePosition} />
        <AppHeader
          mounted={page.mounted}
          onBackToHome={() => navigate("/home")}
        />
        <main className="relative z-10 mx-auto w-full max-w-384 flex-1 px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <ExpensePageHero />
          <div className="mt-10 rounded-3xl border border-dashed border-border/70 bg-card/40 px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              No hay viajes dispersados para comprobar
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Cuando existan solicitudes dispersadas en tu usuario, aparecerán
              aquí.
            </p>
          </div>
        </main>
        <AppFooter mounted transitionDelayClass="delay-700" />
      </div>
    )
  }

  const viaje = page.viajeSeleccionado
  const totalMovimientos = totalGastosMovimientos(page.movimientosDelViaje)
  const pendientes = page.movimientosDelViaje.filter(
    (m) => m.estado === "pendiente"
  )
  const viajeActivo = viajeEsActivo(viaje)
  const mostrarResumenMovimientos =
    !page.movimientosCargando && !page.movimientosError

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader
        mounted={page.mounted}
        onBackToHome={() => navigate("/home")}
      />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-384 px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <ExpensePageHero />

          {page.avisoVigenciaSolicitud ? (
            <section
              className={cn(
                "mb-6 rounded-2xl border px-4 py-3 text-sm font-medium",
                page.avisoVigenciaSolicitud.color === "warning"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                  : "border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-200"
              )}
              aria-live="polite"
            >
              {page.avisoVigenciaSolicitud.mensaje}
            </section>
          ) : null}

          {page.mostrarBotonConciliacion ? (
            <section className="mb-6 rounded-2xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Si el plazo de comprobación desde esta pantalla ya no aplica,
                  puedes solicitar apoyo a contabilidad para continuar.
                </p>
                <Button
                  type="button"
                  className="shrink-0 cursor-pointer rounded-2xl"
                  disabled={page.conciliacionCargando}
                  onClick={() => {
                    void page.iniciarConciliacionContabilidad()
                  }}
                >
                  {page.conciliacionCargando ? (
                    <>
                      <Loader2
                        className="mr-2 size-4 animate-spin"
                        aria-hidden
                      />
                      Enviando solicitud…
                    </>
                  ) : (
                    "Conciliar con contabilidad"
                  )}
                </Button>
              </div>
            </section>
          ) : null}

          <ExpenseResumenMesSection resumenMes={page.resumenMes} />

          <ExpenseViajesActivosSection
            viajesActivos={page.viajesActivos}
            viajesReferencia={page.viajesTodos}
            idViajeSeleccionado={page.idViajeSeleccionado}
            viajesIdsConComprobacionPendiente={
              page.viajesIdsConComprobacionPendiente
            }
            onSeleccionarViaje={page.setIdViajeSeleccionado}
          />

          <ExpenseHistorialViajesSection
            viajesFinalizados={page.viajesFinalizados}
            viajesReferencia={page.viajesTodos}
            historialViajesVisible={page.historialViajesVisible}
            onToggleHistorial={() =>
              page.setHistorialViajesVisible(!page.historialViajesVisible)
            }
            idViajeSeleccionado={page.idViajeSeleccionado}
            viajesIdsConComprobacionPendiente={
              page.viajesIdsConComprobacionPendiente
            }
            onSeleccionarViaje={page.setIdViajeSeleccionado}
          />

          <ExpenseMovimientosPeriodoSection
            viaje={viaje}
            viajeActivo={viajeActivo}
            movimientosCargando={page.movimientosCargando}
            movimientosError={page.movimientosError}
            movimientosErrorMensaje={page.movimientosErrorMensaje}
            movimientosDelViaje={page.movimientosDelViaje}
            totalMovimientos={totalMovimientos}
            pendientes={pendientes}
            mostrarResumenMovimientos={mostrarResumenMovimientos}
            panelMovimientosAbierto={page.panelMovimientosAbierto}
            comprobacionHabilitada={page.comprobacionHabilitada}
            mensajeVentanaPlazoComprobacion={
              page.mensajeVentanaPlazoComprobacion
            }
            etiquetaComprobacionBloqueada={page.etiquetaComprobacionBloqueada}
            onTogglePanelMovimientos={() =>
              page.setPanelMovimientosAbierto(!page.panelMovimientosAbierto)
            }
            onReintentarMovimientos={page.reintentarMovimientos}
            onSolicitarComprobacion={(movimiento) => {
              if (page.comprobacionHabilitada) {
                comprobacion.setMovimientoComprobacion(movimiento)
              }
            }}
          />
        </div>
      </main>

      <AppFooter mounted transitionDelayClass="delay-700" />

      <ExpenseComprobacionModal
        key={comprobacion.movimientoComprobacion?.id ?? "cerrado"}
        movimiento={comprobacion.movimientoComprobacion}
        viaje={viaje}
        nombreResponsable={nombreResponsable}
        onCerrar={comprobacion.cerrarModalComprobacion}
      />
      <ExpenseConciliacionOverlay
        visible={page.overlayConciliacionVisible}
        cargando={page.conciliacionCargando}
        mensaje={page.mensajeConciliacion}
        codigo={page.codigoConciliacionIngresado}
        error={page.errorCodigoConciliacion}
        codigoDemo={page.codigoConciliacionDemo}
        onChangeCodigo={page.setCodigoConciliacionIngresado}
        onConfirmar={page.confirmarCodigoConciliacion}
        onCerrar={page.cerrarOverlayConciliacion}
      />
    </div>
  )
}
