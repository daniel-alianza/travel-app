import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { useAuthStore } from "@/features/auth/store/authStore"
import { ProfilePerfilContenido } from "@/features/profile/components/ProfilePerfilContenido"
import { useProfilePage } from "@/features/profile/hooks/useProfilePage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import { cn } from "@/lib/utils"

export function ProfilePage() {
  const navigate = useNavigate()
  const nombreResponsable = useAuthStore((state) => state.nombreResponsable)
  const page = useProfilePage()

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted={page.mounted} onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div
          className={cn(
            "mx-auto w-full max-w-3xl px-4 pt-8 pb-24 sm:px-6 sm:py-12 lg:px-8",
            "transition-all duration-700 ease-out",
            page.mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <header className="mb-8 sm:mb-10">
            <p className="text-sm font-medium tracking-wide text-primary/90">
              Cuenta
            </p>
            <h1 className="mt-1 font-(family-name:--font-heading) text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Mi perfil
            </h1>
            <p className="mt-2 max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
              Consulta tus datos laborales y opciones de seguridad. La
              información se sincroniza al iniciar sesión.
            </p>
          </header>

          <ProfilePerfilContenido
            key={nombreResponsable}
            nombreSesion={nombreResponsable}
          />
        </div>
      </main>

      <AppFooter mounted={page.mounted} transitionDelayClass="delay-700" />
    </div>
  )
}
