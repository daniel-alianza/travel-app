import { CheckCircle2, Clock3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  formatearFechaCorta,
  formatearMonedaViatico,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimientoTarjetaMovilProps } from "@/features/travel-expenses/interfaces/expense-movimiento-tarjeta-movil-props.interface"
import { cn } from "@/lib/utils"

export function ExpenseMovimientoTarjetaMovil({
  movimiento,
  comprobacionHabilitada,
  etiquetaComprobacionBloqueada,
  onSolicitarComprobacion,
}: ExpenseMovimientoTarjetaMovilProps) {
  return (
    <article
      className={cn(
        "rounded-3xl border-2 p-5 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        movimiento.estado === "comprobado"
          ? "border-emerald-500/35 bg-linear-to-br from-emerald-500/10 via-card/90 to-card/80"
          : "border-amber-500/35 bg-linear-to-br from-amber-500/8 via-card/95 to-card/85"
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground tabular-nums">
            {movimiento.numeroMovimiento}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {movimiento.descripcion}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
            movimiento.estado === "comprobado"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/15 text-amber-800 dark:text-amber-200"
          )}
        >
          {movimiento.estado === "comprobado" ? (
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
          )}
          {movimiento.estado === "comprobado" ? "Comprobado" : "Pendiente"}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Fecha</span>
          <span className="font-medium">{formatearFechaCorta(movimiento.fecha)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Tarjeta</span>
          <span className="font-mono text-xs">{movimiento.numeroTarjeta}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Gasto</span>
          <span className="text-lg font-bold tabular-nums text-accent">
            {formatearMonedaViatico(movimiento.gasto)}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Button
          type="button"
          variant={movimiento.estado === "comprobado" ? "secondary" : "default"}
          disabled={movimiento.estado === "comprobado" || !comprobacionHabilitada}
          title={!comprobacionHabilitada ? etiquetaComprobacionBloqueada : undefined}
          className="w-full cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed"
          onClick={() => {
            if (movimiento.estado !== "comprobado" && comprobacionHabilitada) {
              onSolicitarComprobacion(movimiento)
            }
          }}
        >
          {movimiento.estado === "comprobado"
            ? "Movimiento comprobado"
            : comprobacionHabilitada
              ? "Adjuntar comprobante"
              : "Con contabilidad"}
        </Button>
      </div>
    </article>
  )
}
