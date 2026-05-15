import {
  Car,
  DollarSign,
  Home,
  Loader2,
  Mail,
  MoreHorizontal,
  Package,
  Route,
  Utensils,
  Wrench,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { TravelRequestGastoInput } from "@/features/travel-request/components/TravelRequestGastoInput"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestExpensesSectionProps {
  model: TravelRequestPageModel
  tripIndex: number
}

export function TravelRequestExpensesSection({
  model,
  tripIndex,
}: TravelRequestExpensesSectionProps) {
  const [modalHospedajeAbierto, setModalHospedajeAbierto] = useState(false)
  const [esperandoOnfly, setEsperandoOnfly] = useState(false)
  const [elegirMontoHospedaje, setElegirMontoHospedaje] = useState(false)
  const {
    mounted,
    trips,
    patchTripGasto,
    calcularTotal,
    tripSoloLectura,
    getTripSubmitFieldError,
    getTripGastoError,
  } = model
  const trip = trips[tripIndex]

  if (!trip) {
    return null
  }
  const { gastos } = trip
  const soloLectura = tripSoloLectura(tripIndex)
  const errorGastosEstimados = getTripSubmitFieldError(
    tripIndex,
    "gastosEstimados"
  )
  const montoHospedaje = Number.parseFloat(gastos.hospedaje || "0")
  const inputHospedajeVisible =
    elegirMontoHospedaje ||
    (Number.isFinite(montoHospedaje) && montoHospedaje > 0)

  function abrirModalHospedaje(): void {
    setModalHospedajeAbierto(true)
  }

  function cerrarModalHospedaje(): void {
    setModalHospedajeAbierto(false)
  }

  function confirmarElegirMontoHospedaje(): void {
    setElegirMontoHospedaje(true)
    cerrarModalHospedaje()
  }

  function irAOnflyDesdeModal(): void {
    cerrarModalHospedaje()
    window.open(
      "https://app.onfly.com/v2#/home",
      "_blank",
      "noopener,noreferrer"
    )
    setEsperandoOnfly(true)
  }

  function cerrarEsperaOnfly(): void {
    setEsperandoOnfly(false)
  }

  return (
    <>
      <section
        className={`relative z-20 rounded-3xl border border-border/50 bg-card p-6 shadow-lg transition-all delay-300 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          Gastos Estimados
        </h2>
        {errorGastosEstimados ? (
          <p className="mb-4 text-sm text-destructive">{errorGastosEstimados}</p>
        ) : null}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <TravelRequestGastoInput
            label="Transporte"
            value={gastos.transporte}
            onChange={(val) => patchTripGasto(tripIndex, "transporte", val)}
            icon={Car}
            disabled={soloLectura}
          />
          <TravelRequestGastoInput
            label="Peajes"
            value={gastos.peajes}
            onChange={(val) => patchTripGasto(tripIndex, "peajes", val)}
            icon={Route}
            disabled={soloLectura}
          />
          <div className="space-y-2">
            {inputHospedajeVisible ? (
              <TravelRequestGastoInput
                label="Hospedaje"
                value={gastos.hospedaje}
                onChange={(val) => patchTripGasto(tripIndex, "hospedaje", val)}
                icon={Home}
                disabled={soloLectura}
                error={getTripGastoError(tripIndex, "hospedaje")}
              />
            ) : (
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Home className="h-4 w-4 text-primary/70" />
                Hospedaje
              </span>
            )}
            {!soloLectura && !elegirMontoHospedaje ? (
              <div className="group relative">
                <button
                  type="button"
                  onClick={abrirModalHospedaje}
                  className="h-12 w-full cursor-pointer rounded-2xl border-2 px-3 text-sm font-medium text-foreground transition-all duration-500 hover:bg-muted/50 focus:scale-[1.02] focus:border-primary focus:shadow-lg focus:shadow-primary/20"
                >
                  Ir a onfly
                </button>
              </div>
            ) : null}
          </div>
          <TravelRequestGastoInput
            label="Alimentos"
            value={gastos.alimentos}
            onChange={(val) => patchTripGasto(tripIndex, "alimentos", val)}
            icon={Utensils}
            disabled={soloLectura}
            error={getTripGastoError(tripIndex, "alimentos")}
          />
          <TravelRequestGastoInput
            label="Fletes"
            value={gastos.fletes}
            onChange={(val) => patchTripGasto(tripIndex, "fletes", val)}
            icon={Package}
            disabled={soloLectura}
          />
          <TravelRequestGastoInput
            label="Herramientas"
            value={gastos.herramientas}
            onChange={(val) => patchTripGasto(tripIndex, "herramientas", val)}
            icon={Wrench}
            disabled={soloLectura}
          />
          <TravelRequestGastoInput
            label="Envíos / Mensajería"
            value={gastos.envios}
            onChange={(val) => patchTripGasto(tripIndex, "envios", val)}
            icon={Mail}
            disabled={soloLectura}
          />
          <TravelRequestGastoInput
            label="Misceláneos"
            value={gastos.miscelaneos}
            onChange={(val) => patchTripGasto(tripIndex, "miscelaneos", val)}
            icon={MoreHorizontal}
            disabled={soloLectura}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <span className="text-muted-foreground">Total Estimado:</span>
          <span className="text-2xl font-bold text-accent">
            ${calcularTotal(tripIndex).toFixed(2)}
          </span>
        </div>
      </section>

      {modalHospedajeAbierto ? (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-hospedaje"
        >
          <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
            <h3
              id="titulo-modal-hospedaje"
              className="text-lg font-semibold text-foreground"
            >
              Hospedaje
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Elige cómo continuar.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer rounded-2xl sm:order-1"
                onClick={cerrarModalHospedaje}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer rounded-2xl"
                onClick={confirmarElegirMontoHospedaje}
              >
                Elegir monto
              </Button>
              <Button
                type="button"
                className="cursor-pointer rounded-2xl"
                onClick={irAOnflyDesdeModal}
              >
                Ir a Onfly
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {esperandoOnfly ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
              <h3 className="text-lg font-semibold text-foreground">
                Esperando confirmación en Onfly
              </h3>
              <p className="text-sm text-muted-foreground">
                Vuelve cuando hayas terminado o indica que lo harás después.
              </p>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer rounded-2xl"
                onClick={cerrarEsperaOnfly}
              >
                Lo haré después
              </Button>
              <Button
                type="button"
                className="cursor-pointer rounded-2xl"
                onClick={cerrarEsperaOnfly}
              >
                Ya terminé en Onfly
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
