import { ClipboardList } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import { TravelRequestForm } from "@/features/travel-request/components/TravelRequestForm"
import { TravelRequestHeroSection } from "@/features/travel-request/components/TravelRequestHeroSection"
import { TravelRequestTripsTotalBadge } from "@/features/travel-request/components/TravelRequestTripsTotalBadge"
import { useTravelRequestPage } from "@/features/travel-request/hooks/useTravelRequestPage"

export function RequestPage() {
  const navigate = useNavigate()
  const model = useTravelRequestPage()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={model.mousePosition} />

      <AppHeader
        mounted={model.mounted}
        onBackToHome={() => navigate("/home")}
        accionExtraDerecha={
          <Button
            type="button"
            variant="outline"
            title="Ver solicitudes enviadas y resolución por viaje"
            onClick={() => navigate("/travel-request/requests")}
            className="h-9 max-w-[10rem] shrink cursor-pointer rounded-2xl px-2.5 text-xs transition-all duration-500 hover:bg-primary/10 sm:h-10 sm:max-w-none sm:px-4 sm:text-sm"
          >
            <ClipboardList className="mr-1.5 h-4 w-4 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="truncate">Mis solicitudes</span>
          </Button>
        }
      />

      <main className="relative z-10 flex-1">
        <TravelRequestTripsTotalBadge model={model} />

        <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 md:pr-52 md:pb-12 lg:px-8 lg:pr-56">
          <TravelRequestHeroSection mounted={model.mounted} />

          <TravelRequestForm model={model} />
        </div>
      </main>

      <AppFooter mounted={model.mounted} transitionDelayClass="delay-700" />
    </div>
  )
}
