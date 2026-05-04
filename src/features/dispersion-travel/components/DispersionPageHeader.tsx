import { Banknote } from "lucide-react"

export function DispersionPageHeader() {
  return (
    <div className="mb-8 translate-y-0 opacity-100 transition-all duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="group flex h-14 w-14 shrink-0 cursor-default items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:shadow-amber-500/35">
          <Banknote className="h-7 w-7 text-white transition-transform duration-500 group-hover:-rotate-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Dispersión de viáticos
          </h1>
          <p className="text-pretty text-muted-foreground">
            Selecciona solicitudes y dispersa o rechaza la dispersión
          </p>
        </div>
      </div>
    </div>
  )
}
