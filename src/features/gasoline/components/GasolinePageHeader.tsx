import type { GasolinePageHeaderProps } from "@/features/gasoline/interfaces/gasoline-page-header-props.interface"

export function GasolinePageHeader({
  icon: Icono,
  titulo,
  descripcion,
  mounted = true,
}: GasolinePageHeaderProps) {
  return (
    <header
      className={`mb-8 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
          <Icono className="h-7 w-7 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {titulo}
          </h1>
          <p className="text-pretty text-muted-foreground">{descripcion}</p>
        </div>
      </div>
    </header>
  )
}
