import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { AccountingExpensesAuditDashboard } from "@/features/financial-authorization/components/AccountingExpensesAuditDashboard"
import { useAccountingExpensesAuditPage } from "@/features/financial-authorization/hooks/useAccountingExpensesAuditPage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function AccountingExpensesSummaryPage() {
  const navigate = useNavigate()
  const page = useAccountingExpensesAuditPage()

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader
        mounted
        onBackToHome={() => navigate("/menu-accounting")}
        etiquetaBotonVolver="Volver al menú"
      />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <header
            className="mb-8 space-y-2 animate-travel-panel-in"
            style={{ animationDelay: "40ms" }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Comprobado vs solicitado
            </h1>
            <p className="max-w-3xl text-muted-foreground">
              Compara viáticos dispersados con gastos comprobados, filtra por
              periodo, empresa y solicitante, y revisa el detalle por solicitud.
            </p>
          </header>

          {page.datosListos ? (
            <div className="animate-travel-panel-in">
              <AccountingExpensesAuditDashboard page={page} />
            </div>
          ) : page.datosError !== null ? (
            <div
              className="rounded-3xl border border-destructive/40 bg-destructive/10 px-6 py-8 text-center text-sm text-destructive"
              role="alert"
            >
              {page.datosError}
            </div>
          ) : (
            <div
              className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Cargando conciliación del periodo…
              </p>
            </div>
          )}
        </div>
      </main>

      <AppFooter mounted transitionDelayClass="delay-700" />
    </div>
  )
}
