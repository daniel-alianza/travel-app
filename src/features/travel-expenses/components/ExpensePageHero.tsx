import { Receipt } from "lucide-react"

export function ExpensePageHero() {
  return (
    <header className="mb-8 translate-y-0 opacity-100 transition-all duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="group flex h-14 w-14 shrink-0 cursor-default items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/35">
          <Receipt className="h-7 w-7 text-white transition-transform duration-500 group-hover:-rotate-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Comprobación de viáticos
          </h1>
          <p className="mt-1 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            Elige un viaje para cargar movimientos. El historial solo se muestra si lo pides.
          </p>
        </div>
      </div>
    </header>
  )
}
