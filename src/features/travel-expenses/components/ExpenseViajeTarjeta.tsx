import { CalendarRange, MapPin } from "lucide-react"

import {
  formatearFechaCorta,
  formatearMonedaViatico,
  formatearRangoFechasViaje,
  textoDiasRestantes,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseViajeTarjetaProps } from "@/features/travel-expenses/interfaces/expense-viaje-tarjeta-props.interface"
import { cn } from "@/lib/utils"

export function ExpenseViajeTarjeta({
  viaje,
  seleccionado,
  variante,
  plazoComprobacion = null,
  plazoComprobacionColor = "neutral",
  onSeleccionar,
}: ExpenseViajeTarjetaProps) {
  return (
    <button
      type="button"
      onClick={() => onSeleccionar(viaje.id)}
      className={cn(
        "group relative w-full cursor-pointer rounded-3xl border-2 bg-linear-to-br p-6 text-left shadow-lg backdrop-blur-md transition-all duration-500 ease-out",
        "hover:-translate-y-0.5 hover:shadow-xl",
        variante === "finalizado" && "opacity-95",
        seleccionado
          ? "border-accent/60 from-accent/12 via-card/90 to-card/80 shadow-accent/15 ring-2 ring-accent/25"
          : "border-border/70 from-card/95 via-card/85 to-card/70 shadow-primary/10 hover:border-primary/35"
      )}
    >
      <span
        className={cn(
          "absolute top-6 left-0 h-12 w-1.5 rounded-r-full transition-all duration-300",
          seleccionado
            ? "bg-accent"
            : "bg-muted-foreground/25 group-hover:bg-primary/40"
        )}
        aria-hidden
      />
      <div className="flex flex-col gap-4 pl-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate text-lg font-semibold text-foreground">
              {viaje.titulo}
            </span>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {viaje.motivo}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5" aria-hidden />
              {formatearRangoFechasViaje(viaje.fechaSalida, viaje.fechaRegreso)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-wide uppercase",
              variante === "activo"
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                : "border-border/60 bg-background/50 text-muted-foreground"
            )}
          >
            {variante === "activo" ? "En curso" : "Historial"}
          </span>
          <span className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
            {textoDiasRestantes(viaje)}
          </span>
          {plazoComprobacion ? (
            <span
              className={cn(
                "max-w-[14rem] text-right text-[0.65rem] leading-snug font-medium tracking-normal normal-case sm:max-w-[16rem]",
                plazoComprobacionColor === "danger"
                  ? "text-red-700 dark:text-red-300"
                  : plazoComprobacionColor === "warning"
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-sky-800 dark:text-sky-200"
              )}
            >
              {plazoComprobacion}
            </span>
          ) : null}
          <span className="text-lg font-bold tabular-nums text-accent">
            {formatearMonedaViatico(viaje.montoSolicitado)}
          </span>
          <span className="text-[0.7rem] text-muted-foreground">
            Autorizado {formatearFechaCorta(viaje.fechaAutorizacion)}
          </span>
        </div>
      </div>
    </button>
  )
}
