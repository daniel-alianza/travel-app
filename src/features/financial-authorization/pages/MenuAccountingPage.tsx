import { useNavigate } from "react-router-dom"
import { ClipboardCheck, ChevronRight, Handshake } from "lucide-react"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { useAuthStore } from "@/features/auth/store/authStore"
import { MenuAccountingModuleSkeleton } from "@/features/financial-authorization/components/MenuAccountingModuleSkeleton"
import { MenuAccountingSummaryPanel } from "@/features/financial-authorization/components/MenuAccountingSummaryPanel"
import { MenuAccountingSummarySkeleton } from "@/features/financial-authorization/components/MenuAccountingSummarySkeleton"
import { useMenuAccountingPage } from "@/features/financial-authorization/hooks/useMenuAccountingPage"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"

export function MenuAccountingPage() {
  const correoSesion = useAuthStore((state) => state.correoSesion ?? "")
  const claveSesion = correoSesion.length > 0 ? correoSesion : "sin-correo"

  return <MenuAccountingPageInner key={claveSesion} />
}

function MenuAccountingPageInner() {
  const navigate = useNavigate()
  const page = useMenuAccountingPage()

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <header
            className="mb-10 space-y-2 animate-travel-panel-in"
            style={{ animationDelay: "40ms" }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Autorización contable
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Elige el módulo que deseas abrir.
            </p>
          </header>

          {page.indicadoresListos ? (
            <div className="animate-travel-panel-in">
              <MenuAccountingSummaryPanel
                alcance={page.alcance}
                etiquetaAlcance={page.etiquetaAlcance}
                descripcionAlcance={page.descripcionAlcance}
                kpisTotales={page.kpisTotales}
                kpisPorEmpresa={page.kpisPorEmpresa}
              />
            </div>
          ) : (
            <MenuAccountingSummarySkeleton alcance={page.alcance} />
          )}

          <h2
            className={`mb-4 text-base font-semibold text-foreground sm:text-lg ${page.modulosListos ? "animate-travel-panel-in" : "opacity-60"}`}
            style={page.modulosListos ? { animationDelay: "60ms" } : undefined}
          >
            Módulos
          </h2>

          {page.modulosListos ? (
            <div className="animate-travel-panel-in" style={{ animationDelay: "40ms" }}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/menu-accounting/conciliaciones-comprobaciones")
                  }
                  className="group relative cursor-pointer rounded-3xl border-2 border-transparent bg-card p-6 text-left shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.05)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/30 hover:bg-card hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(34,197,94,0.12),0_12px_40px_-8px_rgba(34,197,94,0.18)] active:scale-[0.99] active:duration-200 sm:p-7 dark:hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(74,222,128,0.15)]"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-[0.12]" />

                  <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-emerald-500/40 sm:h-16 sm:w-16">
                    <Handshake className="h-7 w-7 text-white transition-transform duration-500 group-hover:scale-110 sm:h-8 sm:w-8" />
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                    </div>
                  </div>

                  <div className="relative flex items-end justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-500 group-hover:text-primary sm:text-xl">
                        Conciliación de comprobaciones
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-muted-foreground">
                        Atiende solicitudes de código de verificación de viáticos
                        de tu compañía.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 -rotate-45 items-center justify-center rounded-xl border border-transparent bg-secondary/80 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-0 group-hover:border-primary/20 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25">
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-700 ease-out group-hover:w-1/2" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/financial-authorization")}
                  className="group relative cursor-pointer rounded-3xl border-2 border-transparent bg-card p-6 text-left shadow-[0_4px_6px_-1px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.05)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/30 hover:bg-card hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(139,92,246,0.12),0_12px_40px_-8px_rgba(139,92,246,0.18)] active:scale-[0.99] active:duration-200 sm:p-7 dark:hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(167,139,250,0.15)]"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 to-violet-600 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-[0.12]" />

                  <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-violet-500/40 sm:h-16 sm:w-16">
                    <ClipboardCheck className="h-7 w-7 text-white transition-transform duration-500 group-hover:scale-110 sm:h-8 sm:w-8" />
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                    </div>
                  </div>

                  <div className="relative flex items-end justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-500 group-hover:text-primary sm:text-xl">
                        Revisión y autorización
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-muted-foreground">
                        Aprueba movimientos contables y revisa solicitudes pendientes.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 -rotate-45 items-center justify-center rounded-xl border border-transparent bg-secondary/80 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-0 group-hover:border-primary/20 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25">
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-700 ease-out group-hover:w-1/2" />
                </button>
              </div>
            </div>
          ) : (
            <MenuAccountingModuleSkeleton />
          )}
        </div>
      </main>

      <AppFooter mounted transitionDelayClass="delay-700" />
    </div>
  )
}
