import { Loader2, Wallet } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestTripsTotalBadgeProps {
  model: TravelRequestPageModel
}

export function TravelRequestTripsTotalBadge({
  model,
}: TravelRequestTripsTotalBadgeProps) {
  const total = model.calcularTotalTodosLosViajes()
  const cantidadViajes = model.trips.length

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[100]",
        "bottom-4 left-4 right-4 top-auto translate-y-0",
        "md:bottom-auto md:left-auto md:right-5 md:top-1/2 md:w-[13.5rem] md:max-w-[min(13.5rem,calc(100vw-2.5rem))] md:-translate-y-1/2",
        "lg:right-8"
      )}
      aria-live="polite"
    >
      <div
        className={cn(
          "pointer-events-auto rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl shadow-foreground/10 backdrop-blur-md",
          "transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10"
        )}
      >
        <div className="mb-2 flex items-center gap-2 border-b border-border/50 pb-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15">
            <Wallet className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
              Total de tus viajes
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {cantidadViajes === 1
                ? "1 viaje en solicitud"
                : `${cantidadViajes} viajes en solicitud`}
            </p>
          </div>
        </div>
        {model.ocupado ? (
          <div
            className="flex items-center justify-center gap-2 py-1 text-sm font-medium text-primary"
            role="status"
          >
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            Enviando solicitud…
          </div>
        ) : (
          <p className="text-center text-2xl font-bold tabular-nums tracking-tight text-accent">
            $
            {total.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}
      </div>
    </div>
  )
}
