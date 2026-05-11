import { DollarSign, Ticket } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestTagSectionProps {
  model: TravelRequestPageModel
  tripIndex: number
}

export function TravelRequestTagSection({
  model,
  tripIndex,
}: TravelRequestTagSectionProps) {
  const { mounted, trips, updateTrip, tripSoloLectura, getTripSubmitFieldError } =
    model
  const trip = trips[tripIndex]
  if (!trip) {
    return null
  }

  const soloLectura = tripSoloLectura(tripIndex)
  const errorTagMonto = getTripSubmitFieldError(tripIndex, "tagMonto")

  return (
    <section
      className={`relative z-[5] rounded-3xl border-2 bg-card p-6 shadow-lg transition-all delay-600 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${trip.necesitaTag ? "border-cyan-500/50" : "border-border/50"}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${trip.necesitaTag ? "bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25" : "bg-primary/10"}`}
          >
            <Ticket
              className={`h-5 w-5 transition-colors duration-500 ${trip.necesitaTag ? "text-white" : "text-primary"}`}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Solicitud de TAG
            </h2>
            <p className="text-sm text-muted-foreground">
              Activa esta opción si necesitas saldo para TAG de peajes
            </p>
          </div>
        </div>
        <Switch
          checked={trip.necesitaTag}
          onCheckedChange={(checked) =>
            updateTrip(tripIndex, { necesitaTag: checked })
          }
          disabled={soloLectura}
          className="data-[state=checked]:bg-cyan-500"
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-700 ease-out ${trip.necesitaTag ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="space-y-6 border-t border-border pt-6">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-medium text-foreground">
              <DollarSign className="h-4 w-4 text-cyan-500" />
              Monto Solicitado para TAG
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Monto que solicita ($)
                </Label>
                <div className="group relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-muted-foreground transition-colors duration-300 group-focus-within:text-cyan-500">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={trip.montoTag}
                    onChange={(e) =>
                      updateTrip(tripIndex, { montoTag: e.target.value })
                    }
                    placeholder="0.00"
                    disabled={soloLectura}
                    aria-invalid={Boolean(errorTagMonto)}
                    className={`h-12 rounded-2xl border-2 pl-8 transition-all duration-500 focus:scale-[1.01] focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20 ${errorTagMonto ? "border-destructive/70" : ""}`}
                  />
                </div>
                {errorTagMonto ? (
                  <span className="block text-xs text-destructive">
                    {errorTagMonto}
                  </span>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Monto total de saldo TAG que necesitas para el trayecto
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Ruta / destino del viaje
                </Label>
                <div className="min-h-[52px] rounded-2xl border-2 border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
                  {trip.destinoViaje.trim() ? (
                    trip.destinoViaje
                  ) : (
                    <span className="text-muted-foreground">
                      Indica primero el destino en la sección &quot;Viaje&quot;
                      (ej. Monterrey).
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mismo destino que vendedor y operaciones usan para validar la
                  solicitud; si necesitas detalle de trayecto o casetas, úsalo
                  en comentarios.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Detalle de trayecto y uso de TAG (opcional)
            </Label>
            <Textarea
              value={trip.comentariosTag}
              onChange={(e) =>
                updateTrip(tripIndex, { comentariosTag: e.target.value })
              }
              placeholder="Ej: CDMX → Monterrey por Arco Norte; peajes a cargar al TAG corporativo…"
              disabled={soloLectura}
              className="min-h-[100px] resize-none rounded-2xl border-2 transition-all duration-500 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20"
            />
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950/20">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20">
                <Ticket className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-cyan-900 dark:text-cyan-100">
                  Recarga de TAG
                </h4>
                <p className="text-sm text-cyan-700 dark:text-cyan-300">
                  El saldo se depositará en el TAG que se te fue asignado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
