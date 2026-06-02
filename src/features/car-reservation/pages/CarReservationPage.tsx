import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { CarReservationFrame } from "@/features/car-reservation/components/CarReservationFrame"
import { resolveCarReservationUrl } from "@/features/car-reservation/constants/car-reservation-env"
import { useCarReservationPage } from "@/features/car-reservation/hooks/useCarReservationPage"

export function CarReservationPage() {
  const navigate = useNavigate()
  const carReservationUrl = resolveCarReservationUrl()
  const mounted = true

  useCarReservationPage()

  return (
    <div className="car-reservation-page fixed inset-0 grid h-dvh w-screen max-w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-background">
      <header className="shrink-0">
        <AppHeader mounted={mounted} onBackToHome={() => navigate("/home")} />
      </header>

      <main className="relative z-10 h-full min-h-0 w-full overflow-hidden">
        <CarReservationFrame src={carReservationUrl} title="Reserva de autos" />
      </main>

      <footer className="shrink-0">
        <AppFooter mounted={mounted} transitionDelayClass="delay-700" />
      </footer>
    </div>
  )
}
