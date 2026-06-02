import { startTransition, useEffect, useState, type ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  X,
} from "lucide-react"
import { DropdownMenu } from "radix-ui"

import { Button } from "@/components/ui/button"
import { GRUPO_FG_LOGO_URL } from "@/components/app-brand"
import { useAuthStore } from "@/features/auth/store/authStore"
import { puedeAccederRuta } from "@/features/auth/utils/auth-route-access"
import { useDaysUntilMonthEndQuery } from "@/hooks/useDaysUntilMonthEndQuery"

type AppHeaderProps = {
  mounted?: boolean
  onBackToHome?: () => void
  /** Texto del botón «Volver» en módulos; por defecto «Volver al inicio». */
  etiquetaBotonVolver?: string
  /** En módulos con «Volver», muestra a la derecha el acceso rápido (p. ej. días fin de mes). */
  mostrarAccionesDerecha?: boolean
  /** Contenido opcional antes del botón «Días para fin de mes» (p. ej. enlace a mis solicitudes). */
  accionExtraDerecha?: ReactNode
}

export function AppHeader({
  mounted = true,
  onBackToHome,
  etiquetaBotonVolver = "Volver al inicio",
  mostrarAccionesDerecha = true,
  accionExtraDerecha,
}: AppHeaderProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const rolSesion = useAuthStore((state) => state.rolSesion ?? "")
  const permisosSesion = useAuthStore((state) => state.permisosSesion ?? [])
  const puedeVerConfiguracion = puedeAccederRuta(
    "/settings/users-permissions",
    permisosSesion,
    rolSesion,
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileConfigSubmenuOpen, setMobileConfigSubmenuOpen] =
    useState<boolean>(false)
  const [configuracionMenuAbierto, setConfiguracionMenuAbierto] =
    useState<boolean>(false)

  const diasFinMesQuery = useDaysUntilMonthEndQuery()

  const mostrarCuentaYsesion = pathname === "/home"

  const etiquetaDiasFinMes =
    diasFinMesQuery.data !== undefined
      ? `Días para fin de mes: ${diasFinMesQuery.data}`
      : "Días para fin de mes"

  useEffect(() => {
    startTransition(() => {
      setMobileMenuOpen(false)
      setMobileConfigSubmenuOpen(false)
    })
  }, [pathname])

  function handleLogout(): void {
    logout()
    navigate("/")
  }

  const esModuloConVolver = onBackToHome !== undefined

  const botonDiasFinMes = (
    <Button
      type="button"
      variant="ghost"
      title={etiquetaDiasFinMes}
      aria-busy={diasFinMesQuery.isPending}
      className="group h-10 max-w-[min(100%,14rem)] shrink cursor-pointer rounded-2xl px-2 text-xs transition-all duration-500 hover:scale-105 hover:bg-primary/10 sm:h-11 sm:max-w-none sm:px-4 sm:text-sm"
    >
      <Calendar className="mr-1 h-4 w-4 shrink-0 transition-all duration-300 group-hover:rotate-12 sm:mr-2 sm:h-5 sm:w-5" />
      <span className="truncate">{etiquetaDiasFinMes}</span>
    </Button>
  )

  const logoButton = (
    <button
      type="button"
      onClick={() => navigate("/home")}
      className="shrink-0 cursor-pointer border-0 bg-transparent p-0"
    >
      <img
        src={GRUPO_FG_LOGO_URL}
        alt="Grupo FG Logo"
        className="h-10 transition-all duration-500 hover:scale-105 sm:h-12"
      />
    </button>
  )

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div
        className={
          esModuloConVolver
            ? "mx-auto w-full max-w-[96rem] px-3 sm:px-6 lg:px-8"
            : "mx-auto max-w-7xl pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8"
        }
      >
        {esModuloConVolver ? (
          <div className="grid h-20 w-full grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center justify-self-start justify-start">
              <Button
                type="button"
                variant="ghost"
                onClick={onBackToHome}
                className="group/back h-9 min-w-0 max-w-full cursor-pointer rounded-2xl px-2 text-xs text-muted-foreground transition-all duration-500 hover:bg-primary/10 hover:text-foreground sm:h-10 sm:px-3 sm:text-sm"
              >
                <ArrowLeft className="mr-1 h-4 w-4 shrink-0 transition-transform duration-300 group-hover/back:-translate-x-1 sm:mr-2 sm:h-5 sm:w-5" />
                <span className="truncate">{etiquetaBotonVolver}</span>
              </Button>
            </div>
            <div className="flex justify-center justify-self-center px-1">
              {logoButton}
            </div>
            <div className="flex min-w-0 items-center justify-self-end justify-end gap-2">
              {accionExtraDerecha ?? null}
              {mostrarAccionesDerecha ? botonDiasFinMes : null}
            </div>
          </div>
        ) : (
          <div className="flex h-20 items-center gap-1 sm:gap-2">
            <div className="flex min-w-0 flex-1 items-center justify-start gap-1.5 sm:gap-3">
              {logoButton}
            </div>

            <div className="flex shrink-0 items-center justify-center px-1 sm:px-2">
              {botonDiasFinMes}
            </div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            {mostrarCuentaYsesion ? (
              <>
                <nav className="hidden items-center gap-2 md:flex">
                  {puedeVerConfiguracion ? (
                    <DropdownMenu.Root
                      onOpenChange={setConfiguracionMenuAbierto}
                    >
                      <DropdownMenu.Trigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="group h-11 cursor-pointer rounded-2xl px-4 transition-all duration-500 hover:scale-105 hover:bg-primary/10 data-[state=open]:bg-primary/10"
                        >
                          <Settings className="mr-2 h-5 w-5 transition-all duration-300 group-hover:rotate-90" />
                          Configuración
                          <ChevronDown
                            className={`ml-1 h-4 w-4 shrink-0 opacity-70 transition-transform duration-300 ${configuracionMenuAbierto ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          align="end"
                          sideOffset={8}
                          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 min-w-[17rem] rounded-2xl border border-border/60 bg-popover p-1.5 text-popover-foreground shadow-xl"
                        >
                          <DropdownMenu.Item
                            className="group/item relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                            onSelect={() => {
                              navigate("/settings/users-permissions")
                            }}
                          >
                            <Users className="h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover/item:scale-110" />
                            Gestión de usuarios y permisos
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/profile")}
                    className="group h-11 cursor-pointer rounded-2xl px-4 transition-all duration-500 hover:scale-105 hover:bg-primary/10"
                  >
                    <User className="mr-2 h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                    Mi Perfil
                  </Button>
                  <div className="mx-2 h-8 w-px bg-border" />
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="group h-11 cursor-pointer rounded-2xl px-4 text-destructive transition-all duration-500 hover:scale-105 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-5 w-5 transition-all duration-300 group-hover:-translate-x-1" />
                    Cerrar Sesión
                  </Button>
                </nav>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="shrink-0 cursor-pointer rounded-2xl p-3 transition-all duration-500 hover:scale-110 hover:bg-primary/10 md:hidden"
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                >
                  <div className="relative h-6 w-6">
                    <Menu
                      className={`absolute h-6 w-6 transition-all duration-500 ${mobileMenuOpen ? "scale-0 rotate-180 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
                    />
                    <X
                      className={`absolute h-6 w-6 transition-all duration-500 ${mobileMenuOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-180 opacity-0"}`}
                    />
                  </div>
                </button>
              </>
            ) : null}
            </div>
          </div>
        )}
      </div>

      {mostrarCuentaYsesion ? (
        <div
          className={`overflow-hidden transition-all duration-500 ease-out md:hidden ${mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="space-y-2 border-t border-border/50 bg-background/95 px-4 py-4 backdrop-blur-xl">
            {puedeVerConfiguracion ? (
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
                <button
                  type="button"
                  onClick={() =>
                    setMobileConfigSubmenuOpen(!mobileConfigSubmenuOpen)
                  }
                  className="flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl px-3 text-left text-sm font-medium transition-colors hover:bg-primary/10"
                  aria-expanded={mobileConfigSubmenuOpen}
                >
                  <span className="flex items-center">
                    <Settings className="mr-3 h-5 w-5 shrink-0" />
                    Configuración
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 opacity-70 transition-transform duration-300 ${mobileConfigSubmenuOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${mobileConfigSubmenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        navigate("/settings/users-permissions")
                        setMobileMenuOpen(false)
                        setMobileConfigSubmenuOpen(false)
                      }}
                      className="mb-2 h-11 w-full cursor-pointer justify-start rounded-xl pl-10 text-sm transition-all duration-300 hover:bg-primary/10"
                    >
                      <Users className="mr-2 h-4 w-4 shrink-0 text-primary" />
                      Gestión de usuarios y permisos
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                navigate("/profile")
                setMobileMenuOpen(false)
              }}
              className="h-12 w-full cursor-pointer justify-start rounded-2xl transition-all duration-300 hover:bg-primary/10"
            >
              <User className="mr-3 h-5 w-5" />
              Mi Perfil
            </Button>
            <div className="border-t border-border/50 pt-2">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-12 w-full cursor-pointer justify-start rounded-2xl text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
