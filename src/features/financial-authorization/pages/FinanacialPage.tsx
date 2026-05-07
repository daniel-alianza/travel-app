import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { FinancialAuthorizationDashboard } from "@/features/financial-authorization/components/FinancialAuthorizationDashboard"
import { FinancialAuthorizationReview } from "@/features/financial-authorization/components/FinancialAuthorizationReview"
import { useFinancialAuthorizationPage } from "@/features/financial-authorization/hooks/useFinancialAuthorizationPage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function FinanacialPage() {
  const navigate = useNavigate()
  const page = useFinancialAuthorizationPage()

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader
        mounted={page.mounted}
        onBackToHome={() => navigate("/menu-accounting")}
        etiquetaBotonVolver="Volver al menú"
      />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          {page.solicitudEnRevision === null ? (
            <FinancialAuthorizationDashboard page={page} />
          ) : (
            <FinancialAuthorizationReview page={page} />
          )}
        </div>
      </main>

      <AppFooter mounted={page.mounted} transitionDelayClass="delay-700" />
    </div>
  )
}
