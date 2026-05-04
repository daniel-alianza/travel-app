import { FileText } from "lucide-react"

interface TravelRequestHeroSectionProps {
  mounted: boolean
}

export function TravelRequestHeroSection({
  mounted,
}: TravelRequestHeroSectionProps) {
  return (
    <div
      className={`mb-8 transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
          <FileText className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Crear Solicitud de Viáticos
          </h1>
          <p className="text-muted-foreground">
            Complete el formulario para generar una nueva solicitud
          </p>
        </div>
      </div>
    </div>
  )
}
