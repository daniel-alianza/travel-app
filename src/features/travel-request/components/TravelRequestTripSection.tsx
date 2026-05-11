import { Briefcase, Calendar, MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestTripSectionProps {
  model: TravelRequestPageModel
  tripIndex: number
}

export function TravelRequestTripSection({
  model,
  tripIndex,
}: TravelRequestTripSectionProps) {
  const { mounted, trips, updateTrip, tripSoloLectura, getTripSubmitFieldError } =
    model
  const trip = trips[tripIndex]
  if (!trip) {
    return null
  }

  const soloLectura = tripSoloLectura(tripIndex)
  const errorDestino = getTripSubmitFieldError(tripIndex, "destinoViaje")
  const errorMotivo = getTripSubmitFieldError(tripIndex, "motivoViaje")
  const errorFechaSalida = getTripSubmitFieldError(tripIndex, "fechaSalida")
  const errorFechaRegreso = getTripSubmitFieldError(tripIndex, "fechaRegreso")
  const errorFechaDispersion = getTripSubmitFieldError(
    tripIndex,
    "fechaDispersion"
  )

  return (
    <section
      className={`relative z-30 rounded-3xl border border-border/50 bg-card p-6 shadow-lg transition-all delay-200 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              Destino del viaje
            </h2>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                ¿A dónde vas? (ciudad o punto principal)
              </Label>
              <Input
                value={trip.destinoViaje}
                onChange={(e) =>
                  updateTrip(tripIndex, { destinoViaje: e.target.value })
                }
                placeholder="Ej: Monterrey, planta Querétaro, cliente en Puebla…"
                disabled={soloLectura}
                aria-invalid={Boolean(errorDestino)}
                className={`h-12 rounded-2xl border-2 transition-all duration-500 focus:shadow-lg focus:shadow-primary/20 ${errorDestino ? "border-destructive/70 focus-visible:ring-destructive/30" : ""}`}
              />
              {errorDestino ? (
                <span className="block text-xs text-destructive">
                  {errorDestino}
                </span>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Este dato es el mismo que verán operaciones en gasolina y TAG
                para alinear la ruta.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              Motivo o actividades
            </h2>
            <Textarea
              value={trip.motivoViaje}
              onChange={(e) =>
                updateTrip(tripIndex, { motivoViaje: e.target.value })
              }
              placeholder="Resumen opcional: reuniones, instalación, cobranza, etc."
              disabled={soloLectura}
              aria-invalid={Boolean(errorMotivo)}
              className={`min-h-[100px] resize-none rounded-2xl border-2 transition-all duration-500 focus:shadow-lg focus:shadow-primary/20 ${errorMotivo ? "border-destructive/70 focus-visible:ring-destructive/30" : ""}`}
            />
            {errorMotivo ? (
              <span className="block text-xs text-destructive">{errorMotivo}</span>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            Fechas del Viaje
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Fecha de Salida
              </Label>
              <Input
                type="date"
                value={trip.fechaSalida}
                onChange={(e) =>
                  updateTrip(tripIndex, { fechaSalida: e.target.value })
                }
                disabled={soloLectura}
                aria-invalid={Boolean(errorFechaSalida)}
                className={`h-12 rounded-2xl border-2 transition-all duration-500 focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/20 ${errorFechaSalida ? "border-destructive/70" : ""}`}
              />
              {errorFechaSalida ? (
                <span className="block text-xs text-destructive">
                  {errorFechaSalida}
                </span>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Fecha de Regreso
              </Label>
              <Input
                type="date"
                value={trip.fechaRegreso}
                onChange={(e) =>
                  updateTrip(tripIndex, { fechaRegreso: e.target.value })
                }
                disabled={soloLectura}
                aria-invalid={Boolean(errorFechaRegreso)}
                className={`h-12 rounded-2xl border-2 transition-all duration-500 focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/20 ${errorFechaRegreso ? "border-destructive/70" : ""}`}
              />
              {errorFechaRegreso ? (
                <span className="block text-xs text-destructive">
                  {errorFechaRegreso}
                </span>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Fecha de Dispersión
              </Label>
              <Input
                type="date"
                value={trip.fechaDispersion}
                onChange={(e) =>
                  updateTrip(tripIndex, { fechaDispersion: e.target.value })
                }
                disabled={soloLectura}
                aria-invalid={Boolean(errorFechaDispersion)}
                className={`h-12 rounded-2xl border-2 transition-all duration-500 focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/20 ${errorFechaDispersion ? "border-destructive/70" : ""}`}
              />
              {errorFechaDispersion ? (
                <span className="block text-xs text-destructive">
                  {errorFechaDispersion}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
