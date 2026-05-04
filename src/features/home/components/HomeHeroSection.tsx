interface HomeHeroSectionProps {
  mounted: boolean
}

export function HomeHeroSection({ mounted }: HomeHeroSectionProps) {
  return (
    <div
      className={`mb-10 transition-all duration-1000 sm:mb-14 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground sm:text-base">
            Bienvenido de nuevo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
            Portal de Viáticos
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Selecciona una opción para comenzar a gestionar tus operaciones
          </p>
        </div>
      </div>
    </div>
  )
}
