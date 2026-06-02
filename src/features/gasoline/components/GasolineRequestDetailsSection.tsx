import {
  Camera,
  Car,
  Fuel,
  Gauge,
  Route,
  Upload,
  Wallet,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GasolineCardSearchSelect } from "@/features/gasoline/components/GasolineCardSearchSelect"
import { GASOLINE_REQUEST_INPUT_CLASS } from "@/features/gasoline/hooks/gasoline-request-ui-constants"
import type { GasolineRequestDetailsSectionProps } from "@/features/gasoline/interfaces/gasoline-request-details-section-props.interface"

export function GasolineRequestDetailsSection({
  page,
}: GasolineRequestDetailsSectionProps) {
  const {
    mounted,
    catalogoCarga,
    catalogoError,
    alianzaSinSucursal,
    empresaId,
    tarjetaSeleccionada,
    onTarjetaChange,
    register,
    formState,
    fotoOdometroPreview,
    onFotoOdometroChange,
  } = page

  return (
    <section
      className={`relative z-[8] rounded-3xl border-2 border-accent/50 bg-card p-6 shadow-lg transition-all delay-300 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
          <Fuel className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Datos de la solicitud
          </h2>
          <p className="text-sm text-muted-foreground">
            Tarjeta, vehículo y trayecto del combustible
          </p>
        </div>
      </div>

      {alianzaSinSucursal ? (
        <p
          className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
          role="status"
        >
          Selecciona la sucursal de Alianza antes de enviar la solicitud. Puedes
          elegir la tarjeta y completar el resto del formulario mientras tanto.
        </p>
      ) : null}

      <div className="space-y-6 border-t border-border pt-6">
        <GasolineCardSearchSelect
          label="Seleccionar tarjeta"
          companyId={empresaId}
          value={tarjetaSeleccionada}
          onChange={onTarjetaChange}
          disabled={catalogoCarga || catalogoError !== null}
          error={formState.errors.tarjeta?.message}
        />

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-medium text-foreground">
            <Car className="h-4 w-4 text-accent" />
            Información del vehículo
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Matrícula / placa
                <span className="text-destructive" aria-hidden>
                  {" "}
                  *
                </span>
              </Label>
              <Input
                {...register("matricula")}
                placeholder="Ej. ABC-123-D"
                aria-invalid={Boolean(formState.errors.matricula)}
                className={`${GASOLINE_REQUEST_INPUT_CLASS} ${formState.errors.matricula ? "border-destructive/70" : ""}`}
              />
              {formState.errors.matricula ? (
                <span className="block text-xs text-destructive">
                  {formState.errors.matricula.message}
                </span>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Kilometraje actual (odómetro)
                <span className="text-destructive" aria-hidden>
                  {" "}
                  *
                </span>
              </Label>
              <div className="relative">
                <Gauge className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  {...register("kilometraje")}
                  placeholder="Ej. 45000"
                  aria-invalid={Boolean(formState.errors.kilometraje)}
                  className={`${GASOLINE_REQUEST_INPUT_CLASS} pl-12 ${formState.errors.kilometraje ? "border-destructive/70" : ""}`}
                />
              </div>
              {formState.errors.kilometraje ? (
                <span className="block text-xs text-destructive">
                  {formState.errors.kilometraje.message}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4 text-accent" />
                Monto solicitado
                <span className="text-destructive" aria-hidden>
                  {" "}
                  *
                </span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("montoSolicitado")}
                placeholder="Ej. 1500.00"
                aria-invalid={Boolean(formState.errors.montoSolicitado)}
                className={`${GASOLINE_REQUEST_INPUT_CLASS} ${formState.errors.montoSolicitado ? "border-destructive/70" : ""}`}
              />
              {formState.errors.montoSolicitado ? (
                <span className="block text-xs text-destructive">
                  {formState.errors.montoSolicitado.message}
                </span>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Route className="h-4 w-4 text-accent" />
                Distancia (km)
                <span className="text-destructive" aria-hidden>
                  {" "}
                  *
                </span>
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("distanciaKm")}
                placeholder="Ej. 120"
                aria-invalid={Boolean(formState.errors.distanciaKm)}
                className={`${GASOLINE_REQUEST_INPUT_CLASS} ${formState.errors.distanciaKm ? "border-destructive/70" : ""}`}
              />
              {formState.errors.distanciaKm ? (
                <span className="block text-xs text-destructive">
                  {formState.errors.distanciaKm.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Route className="h-4 w-4 text-accent" />
              Ruta a tomar
              <span className="text-destructive" aria-hidden>
                {" "}
                *
              </span>
            </Label>
            <Input
              {...register("ruta")}
              placeholder="Ej. CDMX – Querétaro por autopista 57"
              aria-invalid={Boolean(formState.errors.ruta)}
              className={`${GASOLINE_REQUEST_INPUT_CLASS} ${formState.errors.ruta ? "border-destructive/70" : ""}`}
            />
            {formState.errors.ruta ? (
              <span className="block text-xs text-destructive">
                {formState.errors.ruta.message}
              </span>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Comentarios (opcional)
            </Label>
            <Textarea
              {...register("comentarios")}
              placeholder="Ej. casetas, motivo del trayecto o detalles adicionales"
              className="min-h-[80px] resize-none rounded-2xl border-2 transition-all duration-500 focus:border-accent focus:shadow-lg focus:shadow-accent/20"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-base font-medium text-foreground">
            <Camera className="h-4 w-4 text-accent" />
            Foto del odómetro
          </h3>
          <Label className="mb-3 block text-sm text-muted-foreground">
            Fotografía del odómetro actual
            <span className="text-destructive" aria-hidden>
              {" "}
              *
            </span>
          </Label>

          <label
            className={`relative block cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-500 hover:border-accent hover:bg-accent/5 ${fotoOdometroPreview ? "border-accent bg-accent/5" : "border-border"} ${formState.errors.fotoOdometro ? "border-destructive/70" : ""}`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={onFotoOdometroChange}
              className="sr-only"
            />
            {fotoOdometroPreview ? (
              <div className="relative">
                <img
                  src={fotoOdometroPreview}
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
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
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
          {formState.errors.fotoOdometro ? (
            <span className="mt-2 block text-xs text-destructive">
              {formState.errors.fotoOdometro.message}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
