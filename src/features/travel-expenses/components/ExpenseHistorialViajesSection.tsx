import { History } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ExpenseViajeTarjeta } from "@/features/travel-expenses/components/ExpenseViajeTarjeta"
import type { ExpenseHistorialViajesSectionProps } from "@/features/travel-expenses/interfaces/expense-historial-viajes-section-props.interface"

export function ExpenseHistorialViajesSection({
  viajesFinalizados,
  historialViajesVisible,
  onToggleHistorial,
  idViajeSeleccionado,
  onSeleccionarViaje,
}: ExpenseHistorialViajesSectionProps) {
  if (viajesFinalizados.length === 0) {
    return null
  }

  return (
    <section className="mb-10 space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer rounded-2xl border-dashed py-6 transition-all duration-300 hover:border-primary/40 hover:bg-muted/40 sm:w-auto sm:px-8"
        onClick={onToggleHistorial}
        aria-expanded={historialViajesVisible}
      >
        <History className="mr-2 h-4 w-4 shrink-0" aria-hidden />
        {historialViajesVisible
          ? "Ocultar viajes finalizados"
          : `Ver viajes finalizados (${viajesFinalizados.length})`}
      </Button>

      {historialViajesVisible ? (
        <div className="grid gap-4 transition-opacity duration-300 lg:grid-cols-2">
          {viajesFinalizados.map((v) => (
            <ExpenseViajeTarjeta
              key={v.id}
              viaje={v}
              variante="finalizado"
              seleccionado={v.id === idViajeSeleccionado}
              onSeleccionar={onSeleccionarViaje}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
