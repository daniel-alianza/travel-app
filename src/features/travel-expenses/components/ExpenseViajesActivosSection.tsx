import { ExpenseViajeTarjeta } from "@/features/travel-expenses/components/ExpenseViajeTarjeta"
import type { ExpenseViajesActivosSectionProps } from "@/features/travel-expenses/interfaces/expense-viajes-activos-section-props.interface"

export function ExpenseViajesActivosSection({
  viajesActivos,
  idViajeSeleccionado,
  onSeleccionarViaje,
}: ExpenseViajesActivosSectionProps) {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Viajes activos
      </h2>

      {viajesActivos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/70 bg-muted/15 px-4 py-10 text-center shadow-inner">
          <p className="text-sm font-medium text-foreground">
            No tienes viajes activos en este momento
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Cuando tengas un viaje vigente, aparecerá aquí arriba para comprobarlo primero.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {viajesActivos.map((v) => (
            <ExpenseViajeTarjeta
              key={v.id}
              viaje={v}
              variante="activo"
              seleccionado={v.id === idViajeSeleccionado}
              onSeleccionar={onSeleccionarViaje}
            />
          ))}
        </div>
      )}
    </section>
  )
}
