import { ChevronDown, DollarSign, Fuel, MapPin, Ticket } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestTripSummaryCardProps {
  model: TravelRequestPageModel
  tripIndex: number
  onExpand: () => void
}

export function TravelRequestTripSummaryCard({
  model,
  tripIndex,
  onExpand,
}: TravelRequestTripSummaryCardProps) {
  const { trips, calcularTotal } = model
  const trip = trips[tripIndex]
  if (!trip) {
    return null
  }

  const numeroViaje = trip.ordenViajeEnSolicitud ?? tripIndex + 1
  const tituloViaje =
    trip.ordenViajeEnSolicitud === undefined && tripIndex === 0
      ? "Primer viaje"
      : `Viaje ${numeroViaje}`
  const destino =
    trip.destinoViaje.trim() || "Sin destino indicado"
  const total = calcularTotal(tripIndex)

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onExpand()
        }
      }}
      className={cn(
        "group relative z-30 cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-muted/30 p-5 shadow-md transition-all duration-500 ease-out",
        "hover:-translate-y-0.5 hover:border-primary/25 hover:bg-muted/40 hover:shadow-xl hover:shadow-primary/10",
        "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
        "active:scale-[0.995] active:shadow-lg sm:p-6"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.03]" />
      </div>

      <div className="relative mb-4 border-b border-border/50 pb-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Resumen
        </p>
        <h3 className="text-lg font-semibold text-foreground">{tituloViaje}</h3>
        <p className="mt-1 text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
          Toca o haz clic para editar este viaje.
        </p>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <div className="flex gap-3 rounded-2xl border border-border/40 bg-card/80 p-4 shadow-sm transition-all duration-300 group-hover:border-border/60 group-hover:shadow-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-inner transition-transform duration-300 group-hover:scale-105">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Ruta / destino
            </p>
            <p className="mt-0.5 font-medium text-foreground">{destino}</p>
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl border border-border/40 bg-card/80 p-4 shadow-sm transition-all duration-300 group-hover:border-border/60 group-hover:shadow-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 shadow-inner transition-transform duration-300 group-hover:scale-105">
            <DollarSign className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total estimado del viaje
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-accent">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-shadow duration-300 group-hover:shadow-sm ${
            trip.necesitaGasolina
              ? "border-orange-500/40 bg-orange-500/10 text-orange-800 dark:text-orange-200"
              : "border-border bg-muted/50 text-muted-foreground"
          }`}
        >
          <Fuel className="h-3.5 w-3.5" />
          Gasolina: {trip.necesitaGasolina ? "Solicitada" : "No solicitada"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-shadow duration-300 group-hover:shadow-sm ${
            trip.necesitaTag
              ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200"
              : "border-border bg-muted/50 text-muted-foreground"
          }`}
        >
          <Ticket className="h-3.5 w-3.5" />
          TAG: {trip.necesitaTag ? "Solicitado" : "No solicitado"}
        </span>
      </div>

      <div className="relative mt-6 flex flex-col items-center border-t border-border/40 pt-5">
        <span className="mb-2 text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-primary">
          Abrir para editar
        </span>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 shadow-md",
            "transition-all duration-300 ease-out",
            "group-hover:border-primary/45 group-hover:bg-primary/12 group-hover:shadow-lg group-hover:shadow-primary/20",
            "group-hover:scale-110"
          )}
          aria-hidden
        >
          <ChevronDown className="h-6 w-6 text-primary transition-transform duration-500 ease-out group-hover:translate-y-0.5" />
        </div>
      </div>
    </section>
  )
}
