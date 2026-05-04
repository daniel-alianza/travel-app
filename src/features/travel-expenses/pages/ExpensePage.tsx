import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { useAuthStore } from "@/features/auth/store/authStore"
import { ExpenseComprobacionModal } from "@/features/travel-expenses/components/ExpenseComprobacionModal"
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

export function ExpensePage() {
  const navigate = useNavigate()
  const page = useExpensePage()
  const nombreResponsable = useAuthStore((state) => state.nombreResponsable)
  const comprobacion = useExpenseComprobacionMovimiento()

  if (!page.viajeSeleccionado) {
    return null
  }

  const viaje = page.viajeSeleccionado
  const totalMovimientos = totalGastosMovimientos(page.movimientosDelViaje)
  const pendientes = page.movimientosDelViaje.filter((m) => m.estado === "pendiente")
  const viajeActivo = viajeEsActivo(viaje)
  const mostrarResumenMovimientos =
    !page.movimientosCargando && !page.movimientosError

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted={page.mounted} onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-384 px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <ExpensePageHero />

          <ExpenseResumenMesSection resumenMes={page.resumenMes} />

          <ExpenseViajesActivosSection
            viajesActivos={page.viajesActivos}
            idViajeSeleccionado={page.idViajeSeleccionado}
            onSeleccionarViaje={page.setIdViajeSeleccionado}
          />

          <ExpenseHistorialViajesSection
            viajesFinalizados={page.viajesFinalizados}
            historialViajesVisible={page.historialViajesVisible}
            onToggleHistorial={() =>
              page.setHistorialViajesVisible(!page.historialViajesVisible)
            }
            idViajeSeleccionado={page.idViajeSeleccionado}
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
            onTogglePanelMovimientos={() =>
              page.setPanelMovimientosAbierto(!page.panelMovimientosAbierto)
            }
            onReintentarMovimientos={page.reintentarMovimientos}
            onSolicitarComprobacion={comprobacion.setMovimientoComprobacion}
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
    </div>
  )
}
