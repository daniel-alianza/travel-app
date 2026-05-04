import type { FormEvent } from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { GRUPO_FG_LOGO_URL } from "@/components/app-brand"
import type {
  FocusedField,
  MousePosition,
} from "@/features/auth/interfaces/login.interface"

interface LoginFormPanelProps {
  mounted: boolean
  focusedField: FocusedField
  mousePosition: MousePosition
  showPassword: boolean
  isLoading: boolean
  onFocusedFieldChange: (field: FocusedField) => void
  onPasswordVisibilityChange: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function LoginFormPanel(props: LoginFormPanelProps) {
  const {
    mounted,
    focusedField,
    mousePosition,
    showPassword,
    isLoading,
    onFocusedFieldChange,
    onPasswordVisibilityChange,
    onSubmit,
  } = props

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-secondary/30 p-6 sm:p-12 lg:w-1/2">
      <div
        className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
        }}
      />

      <div
        className={`relative z-10 w-full max-w-md transform space-y-8 transition-all duration-1000 ease-out ${mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"}`}
      >
        <div className="mb-8 flex justify-center lg:hidden">
          <img
            src={GRUPO_FG_LOGO_URL}
            alt="Grupo FG Logo"
            className="h-12 transition-all duration-700 hover:scale-110 hover:drop-shadow-lg"
          />
        </div>

        <div
          className={`transform space-y-3 transition-all delay-100 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Iniciar Sesión
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-5">
            <div
              className={`transform space-y-2 transition-all delay-200 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <label
                htmlFor="email"
                className={`text-sm font-medium transition-all duration-500 ${focusedField === "email" ? "translate-x-1 text-primary" : "text-foreground"}`}
              >
                Correo electrónico
              </label>
              <div
                className={`group relative transition-all duration-500 ${focusedField === "email" ? "scale-[1.02]" : ""}`}
              >
                <div
                  className={`absolute -inset-1 rounded-2xl bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl transition-all duration-700 ${focusedField === "email" ? "animate-gradient opacity-100" : "opacity-0"}`}
                />
                <div className="relative">
                  <Mail
                    className={`absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 transition-all duration-500 ${focusedField === "email" ? "scale-110 rotate-12 text-primary" : "text-muted-foreground group-hover:text-primary/70"}`}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@grupofg.com"
                    className="h-14 cursor-text rounded-2xl border-2 border-border bg-background/80 pl-12 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-lg focus:border-primary focus:bg-background focus:shadow-xl focus:ring-4 focus:shadow-primary/10 focus:ring-primary/10"
                    required
                    onFocus={() => onFocusedFieldChange("email")}
                    onBlur={() => onFocusedFieldChange(null)}
                  />
                </div>
              </div>
            </div>
            <div
              className={`transform space-y-2 transition-all delay-300 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <label
                htmlFor="password"
                className={`text-sm font-medium transition-all duration-500 ${focusedField === "password" ? "translate-x-1 text-primary" : "text-foreground"}`}
              >
                Contraseña
              </label>
              <div
                className={`group relative transition-all duration-500 ${focusedField === "password" ? "scale-[1.02]" : ""}`}
              >
                <div
                  className={`absolute -inset-1 rounded-2xl bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl transition-all duration-700 ${focusedField === "password" ? "animate-gradient opacity-100" : "opacity-0"}`}
                />
                <div className="relative">
                  <Lock
                    className={`absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 transition-all duration-500 ${focusedField === "password" ? "scale-110 rotate-12 text-primary" : "text-muted-foreground group-hover:text-primary/70"}`}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-14 cursor-text rounded-2xl border-2 border-border bg-background/80 pr-12 pl-12 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-lg focus:border-primary focus:bg-background focus:shadow-xl focus:ring-4 focus:shadow-primary/10 focus:ring-primary/10"
                    required
                    onFocus={() => onFocusedFieldChange("password")}
                    onBlur={() => onFocusedFieldChange(null)}
                  />
                  <button
                    type="button"
                    onClick={onPasswordVisibilityChange}
                    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-all duration-500 hover:scale-125 hover:rotate-12 hover:bg-primary/10 hover:text-primary"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    <div className="relative h-5 w-5">
                      <Eye
                        className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${showPassword ? "scale-0 rotate-180 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
                      />
                      <EyeOff
                        className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${showPassword ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-180 opacity-0"}`}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex transform items-center justify-between transition-all delay-400 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <div className="group flex cursor-pointer items-center gap-3">
              <Checkbox
                id="remember"
                className="h-5 w-5 rounded-lg border-2 transition-all duration-500 hover:scale-125 hover:shadow-lg data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="remember"
                className="cursor-pointer text-sm text-muted-foreground transition-all duration-300 select-none group-hover:text-foreground"
              >
                Recordarme
              </label>
            </div>
            <a
              href="#"
              className="group relative text-sm font-medium text-accent transition-all duration-500 hover:text-accent/80"
            >
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
                ¿Olvidaste tu contraseña?
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-accent transition-all duration-500 group-hover:w-full" />
            </a>
          </div>
          <div
            className={`transform transition-all delay-500 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <Button
              type="submit"
              className="group relative h-14 w-full cursor-pointer overflow-hidden rounded-2xl bg-primary text-base font-medium text-primary-foreground transition-all duration-700 hover:scale-[1.02] hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/30 active:scale-[0.98]"
              disabled={isLoading}
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
              <span className="absolute inset-0 scale-0 rounded-full bg-white/10 transition-transform duration-500 group-active:scale-150" />
              {isLoading ? (
                <div className="relative z-10 flex items-center gap-3">
                  <div className="relative h-6 w-6">
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    <div className="absolute inset-1 animate-[spin_0.5s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-primary-foreground/50" />
                  </div>
                  <span className="animate-pulse">Iniciando sesión...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center gap-3">
                  Iniciar Sesión
                  <ArrowRight className="h-5 w-5 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110" />
                </span>
              )}
            </Button>
          </div>
        </form>

        <div
          className={`relative transform transition-all delay-600 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full rounded-full border-t-2 border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="rounded-full bg-background px-4 py-1 text-muted-foreground">
              ¿Necesitas ayuda?
            </span>
          </div>
        </div>

        <div
          className={`transform space-y-3 text-center transition-all delay-700 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <p className="text-sm text-muted-foreground">
            Contacta al área de soporte técnico
          </p>
          <a
            href="mailto:soporte@grupofg.com"
            className="group inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary transition-all duration-500 hover:gap-4"
          >
            <span className="relative">
              soporte@grupofg.com
              <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-primary transition-all duration-500 group-hover:w-full" />
            </span>
            <ArrowRight className="h-4 w-4 -rotate-45 transition-all duration-500 group-hover:translate-x-1 group-hover:rotate-0" />
          </a>
        </div>
        <div className="flex items-center justify-center gap-2 pt-4 text-center text-xs text-muted-foreground lg:hidden">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>
            © {new Date().getFullYear()} Grupo FG. Todos los derechos
            reservados.
          </span>
        </div>
      </div>
    </div>
  )
}
