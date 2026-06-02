import { Fuel } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { GasolinePageHeader } from "@/features/gasoline/components/GasolinePageHeader"
import { GasolineRequestCompanySection } from "@/features/gasoline/components/GasolineRequestCompanySection"
import { GasolineRequestDetailsSection } from "@/features/gasoline/components/GasolineRequestDetailsSection"
import { GasolineRequestSubmitBar } from "@/features/gasoline/components/GasolineRequestSubmitBar"
import { useGasolineRequestPage } from "@/features/gasoline/hooks/useGasolineRequestPage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function GasolineRequestPage() {
  const navigate = useNavigate()
  const page = useGasolineRequestPage()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader
        mounted={page.mounted}
        onBackToHome={() => navigate("/home")}
      />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <GasolinePageHeader
            icon={Fuel}
            titulo="Solicitud de gasolina"
            descripcion="Completa el formulario para solicitar combustible"
            mounted={page.mounted}
          />

          <form
            className="space-y-6"
            onSubmit={page.handleSubmit(page.onSubmit)}
            noValidate
          >
            <GasolineRequestCompanySection page={page} />
            <GasolineRequestDetailsSection page={page} />
            <GasolineRequestSubmitBar
              mounted={page.mounted}
              enviando={page.enviando}
              deshabilitado={page.envioDeshabilitado}
            />
          </form>
        </div>
      </main>

      <AppFooter
        mounted={page.mounted}
        transitionDelayClass="delay-700"
      />
    </div>
  )
}
