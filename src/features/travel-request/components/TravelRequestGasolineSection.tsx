import {
  Camera,
  Car,
  CreditCard,
  DollarSign,
  Fuel,
  Gauge,
  Route,
  Upload,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { TravelRequestSelectDropdown } from "@/features/travel-request/components/TravelRequestSelectDropdown"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestGasolineSectionProps {
  model: TravelRequestPageModel
  tripIndex: number
}

export function TravelRequestGasolineSection({
  model,
  tripIndex,
}: TravelRequestGasolineSectionProps) {
  const {
    mounted,
    fuelCards,
    loadFuelCards,
    trips,
    updateTrip,
    handleFileUpload,
    dropdownOpen,
    setDropdownOpen,
    focusedField,
    setFocusedField,
    tripSoloLectura,
  } = model
  const trip = trips[tripIndex]
  if (!trip) {
    return null
  }

  const soloLectura = tripSoloLectura(tripIndex)
  const tarjetaGasolinaId = `tarjetaGasolina-${tripIndex}`

  return (
    <section
      className={`relative z-[8] rounded-3xl border-2 bg-card p-6 shadow-lg transition-all delay-500 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${trip.necesitaGasolina ? "border-accent/50" : "border-border/50"}`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${trip.necesitaGasolina ? "bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25" : "bg-primary/10"}`}
          >
            <Fuel
              className={`h-5 w-5 transition-colors duration-500 ${trip.necesitaGasolina ? "text-white" : "text-primary"}`}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Solicitud de Gasolina
            </h2>
            <p className="text-sm text-muted-foreground">
              Activa esta opción si necesitas combustible para tu viaje
            </p>
          </div>
        </div>
        <Switch
          checked={trip.necesitaGasolina}
          onCheckedChange={(checked) =>
            updateTrip(tripIndex, { necesitaGasolina: checked })
          }
          disabled={soloLectura}
          className="data-[state=checked]:bg-accent"
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-700 ease-out ${trip.necesitaGasolina ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="space-y-6 border-t border-border pt-6">
          <div>
            <TravelRequestSelectDropdown
              label="Seleccionar Tarjeta"
              value={trip.tarjetaGasolina}
              options={fuelCards.map((fuelCard) => fuelCard.cardNumber)}
              onChange={(value) => updateTrip(tripIndex, { tarjetaGasolina: value })}
              placeholder="Buscar tarjeta..."
              icon={CreditCard}
              id={tarjetaGasolinaId}
              disabled={soloLectura}
              onOpen={() => {
                void loadFuelCards()
              }}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
            />
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-medium text-foreground">
              <Car className="h-4 w-4 text-accent" />
              Información del Vehículo
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Matrícula / Placa
                </Label>
                <Input
                  value={trip.placa}
                  onChange={(e) =>
                    updateTrip(tripIndex, { placa: e.target.value })
                  }
                  placeholder="Buscar placa..."
                  disabled={soloLectura}
                  className="h-12 rounded-2xl border-2 transition-all duration-500 focus:scale-[1.01] focus:border-accent focus:shadow-lg focus:shadow-accent/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Kilometraje Actual (Odómetro)
                </Label>
                <div className="relative">
                  <Gauge className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    value={trip.kilometraje}
                    onChange={(e) =>
                      updateTrip(tripIndex, { kilometraje: e.target.value })
                    }
                    placeholder="Ej: 45000"
                    disabled={soloLectura}
                    className="h-12 rounded-2xl border-2 pl-12 transition-all duration-500 focus:scale-[1.01] focus:border-accent focus:shadow-lg focus:shadow-accent/20"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-medium text-foreground">
              <DollarSign className="h-4 w-4 text-accent" />
              Detalles de la Solicitud
            </h3>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Monto Solicitado ($)
                </Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    value={trip.montoGasolina}
                    onChange={(e) =>
                      updateTrip(tripIndex, { montoGasolina: e.target.value })
                    }
                    placeholder="0.00"
                    disabled={soloLectura}
                    className="h-12 rounded-2xl border-2 pl-8 transition-all duration-500 focus:scale-[1.01] focus:border-accent focus:shadow-lg focus:shadow-accent/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Distancia a Recorrer (km)
                </Label>
                <div className="relative">
                  <Route className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    value={trip.distancia}
                    onChange={(e) =>
                      updateTrip(tripIndex, { distancia: e.target.value })
                    }
                    placeholder="Ej: 150"
                    disabled={soloLectura}
                    className="h-12 rounded-2xl border-2 pl-12 transition-all duration-500 focus:scale-[1.01] focus:border-accent focus:shadow-lg focus:shadow-accent/20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
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
                  solicitud; si necesitas detalle de trayecto, úsalo en
                  comentarios.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Comentarios (Opcional)
                </Label>
                <Textarea
                  value={trip.comentariosGasolina}
                  onChange={(e) =>
                    updateTrip(tripIndex, {
                      comentariosGasolina: e.target.value,
                    })
                  }
                  placeholder="Comentarios adicionales sobre la solicitud"
                  disabled={soloLectura}
                  className="min-h-[80px] resize-none rounded-2xl border-2 transition-all duration-500 focus:border-accent focus:shadow-lg focus:shadow-accent/20"
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-base font-medium text-foreground">
              <Camera className="h-4 w-4 text-accent" />
              Foto del Odómetro
            </h3>
            <Label className="mb-3 block text-sm text-muted-foreground">
              Fotografía del odómetro actual
            </Label>

            <label
              className={`relative block rounded-2xl border-2 border-dashed transition-all duration-500 ${soloLectura ? "pointer-events-none cursor-default opacity-60" : "cursor-pointer hover:border-accent hover:bg-accent/5"} ${trip.fotoOdometro ? "border-accent bg-accent/5" : "border-border"}`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(tripIndex, e)}
                disabled={soloLectura}
                className="sr-only"
              />
              {trip.fotoOdometro ? (
                <div className="relative">
                  <img
                    src={trip.fotoOdometro}
                    alt="Odómetro"
                    className="h-48 w-full rounded-2xl object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <span className="font-medium text-white">
                      Click para cambiar
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 transition-transform duration-500 group-hover:scale-110">
                    <Upload className="h-7 w-7 text-accent" />
                  </div>
                  <span className="font-medium text-accent">
                    Click para subir foto
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG hasta 10MB
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
