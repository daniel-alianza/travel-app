import { Calendar } from "lucide-react"

import {
  formatearMonedaViatico,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseResumenMesSectionProps } from "@/features/travel-expenses/interfaces/expense-resumen-mes-section-props.interface"

export function ExpenseResumenMesSection({ resumenMes }: ExpenseResumenMesSectionProps) {
  return (
    <section
      className="mb-10 overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-card/95 via-card/90 to-secondary/25 p-5 shadow-lg shadow-primary/10 backdrop-blur-md transition-all duration-500 sm:p-6"
      aria-labelledby="expense-resumen-mes"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/90 to-primary shadow-md shadow-primary/20">
            <Calendar className="h-6 w-6 text-primary-foreground" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Este mes
            </p>
            <h2
              id="expense-resumen-mes"
              className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              {resumenMes.etiquetaMesTitulo}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Resumen de tus viáticos con viajes aún vigentes. Los totales son referencia del
              periodo autorizado.
            </p>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-2xl lg:gap-4">
          <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-center shadow-inner">
            <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
              Viajes activos
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {resumenMes.cantidadViajesActivos}
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-center shadow-inner">
            <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
              Autorizado (activos)
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-accent">
              {formatearMonedaViatico(resumenMes.totalAutorizadoActivos)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-center shadow-inner">
            <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
              Días del mes
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {resumenMes.diasRestantesDelMes}
            </p>
            <p className="mt-0.5 text-[0.65rem] text-muted-foreground">hasta fin de mes</p>
          </div>
        </div>
      </div>
    </section>
  )
}
