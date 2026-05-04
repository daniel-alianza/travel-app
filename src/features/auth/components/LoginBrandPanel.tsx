import { Sparkles } from "lucide-react"
import { GRUPO_FG_LOGO_URL } from "@/components/app-brand"

interface LoginBrandPanelProps {
  mounted: boolean
}

export function LoginBrandPanel(props: LoginBrandPanelProps) {
  const { mounted } = props

  return (
    <div className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary to-primary/90 lg:flex lg:w-1/2">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="animate-float absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="animate-float-reverse absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
        <div className="animate-morph absolute top-1/4 right-1/4 h-32 w-32 bg-white/5" />
        <div className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 animate-[spin_80s_linear_infinite] rounded-full border border-white/10 shadow-[inset_0_0_100px_rgba(255,255,255,0.05)]" />
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite_reverse] rounded-full border border-white/10 shadow-[inset_0_0_60px_rgba(255,255,255,0.05)]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite] rounded-full border-2 border-white/5 shadow-[0_0_40px_rgba(255,255,255,0.1)]" />
        <div
          className="animate-float absolute top-20 left-20 h-3 w-3 rounded-full bg-white/30 shadow-lg shadow-white/20"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="animate-float-reverse absolute top-40 right-32 h-2 w-2 rounded-full bg-accent/50 shadow-lg shadow-accent/20"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="animate-float absolute bottom-32 left-40 h-4 w-4 rounded-full bg-white/20 shadow-lg shadow-white/10"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="animate-float-reverse absolute right-20 bottom-48 h-2 w-2 rounded-full bg-white/40 shadow-lg shadow-white/20"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col justify-between p-12">
        <div
          className={`transform transition-all duration-1000 ease-out ${mounted ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-8 -rotate-3 opacity-0"}`}
        >
          <div className="group cursor-pointer">
            <img
              src={GRUPO_FG_LOGO_URL}
              alt="Grupo FG Logo"
              className="h-16 brightness-0 invert transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div
            className={`transform transition-all delay-200 duration-1000 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h1 className="text-4xl leading-tight font-semibold text-balance text-primary-foreground drop-shadow-lg xl:text-5xl">
              Bienvenido al Portal de Viaticos
            </h1>
          </div>
          <div
            className={`transform transition-all delay-400 duration-1000 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          ></div>
        </div>
        <div
          className={`transform text-sm text-primary-foreground/60 transition-all delay-1000 duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>
              © {new Date().getFullYear()} Grupo FG. Todos los derechos
              reservados.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
