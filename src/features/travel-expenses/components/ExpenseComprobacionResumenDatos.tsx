import {
  formatearFechaCorta,
  formatearMonedaViatico,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

interface ExpenseComprobacionResumenDatosProps {
  movimiento: ExpenseMovimiento
  viaje: ExpenseViajeResumen
  nombreResponsable: string
}

export function ExpenseComprobacionResumenDatos({
  movimiento,
  viaje,
  nombreResponsable,
}: ExpenseComprobacionResumenDatosProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm">
      <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
        Datos automáticos
      </p>
      <dl className="mt-3 space-y-2 text-left">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">Movimiento</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {movimiento.numeroMovimiento}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">Viaje</dt>
          <dd className="text-right font-medium text-foreground">
            <span className="block sm:max-w-[70%] sm:text-right">{viaje.titulo}</span>
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
              {viaje.motivo}
            </span>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">Fecha del movimiento</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {formatearFechaCorta(movimiento.fecha)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">Importe del movimiento</dt>
          <dd className="font-bold tabular-nums text-accent">
            {formatearMonedaViatico(movimiento.gasto)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">Responsable</dt>
          <dd className="font-medium text-foreground">{nombreResponsable}</dd>
        </div>
      </dl>
    </div>
  )
}
