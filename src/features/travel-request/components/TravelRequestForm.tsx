import { useState } from "react"
import { ChevronDown, Loader2, Plus, Send, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TravelRequestCompanyCompactBanner } from "@/features/travel-request/components/TravelRequestCompanyCompactBanner"
import { TravelRequestCompanySection } from "@/features/travel-request/components/TravelRequestCompanySection"
import { TravelRequestExpensesSection } from "@/features/travel-request/components/TravelRequestExpensesSection"
import { TravelRequestGasolineSection } from "@/features/travel-request/components/TravelRequestGasolineSection"
import { TravelRequestObjectivesSection } from "@/features/travel-request/components/TravelRequestObjectivesSection"
import { TravelRequestTagSection } from "@/features/travel-request/components/TravelRequestTagSection"
import { TravelRequestTripSection } from "@/features/travel-request/components/TravelRequestTripSection"
import { TravelRequestTripSummaryCard } from "@/features/travel-request/components/TravelRequestTripSummaryCard"
import { cn } from "@/lib/utils"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestFormProps {
  model: TravelRequestPageModel
}

export function TravelRequestForm({ model }: TravelRequestFormProps) {
  const {
    mounted,
    ocupado,
    handleSubmit,
    trips,
    addTrip,
    removeTrip,
    esModoCorreccionViaje,
    etiquetaBotonEnviar,
    viaticCards,
  } = model
  const showEmpresa = trips.length === 1

  const [edicionViajePasado, setEdicionViajePasado] = useState<
    Record<number, boolean>
  >({})
  const [viajeCerrandoResumen, setViajeCerrandoResumen] = useState<
    number | null
  >(null)

  function expandirViajePasado(tripIndex: number): void {
    setEdicionViajePasado((prev) => ({ ...prev, [tripIndex]: true }))
  }

  function contraerViajePasado(tripIndex: number): void {
    setEdicionViajePasado((prev) => ({ ...prev, [tripIndex]: false }))
  }

  function iniciarCierreResumen(tripIndex: number): void {
    setViajeCerrandoResumen(tripIndex)
    window.setTimeout(() => {
      contraerViajePasado(tripIndex)
      setViajeCerrandoResumen(null)
    }, 680)
  }

  function solicitarEliminarViaje(tripIndex: number): void {
    if (esModoCorreccionViaje) {
      return
    }
    if (trips.length <= 1) {
      return
    }
    const confirmar = window.confirm(
      "¿Eliminar este viaje? Los datos capturados en este viaje se perderán."
    )
    if (!confirmar) {
      return
    }
    removeTrip(tripIndex)
    setEdicionViajePasado({})
    setViajeCerrandoResumen(null)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void handleSubmit()
      }}
      className="space-y-8"
      aria-busy={ocupado}
    >
      <fieldset
        disabled={ocupado}
        className="min-w-0 space-y-8 border-0 p-0 disabled:pointer-events-none disabled:opacity-[0.68]"
      >
        {showEmpresa ? (
          <div className="transition-all duration-700 ease-out">
            <TravelRequestCompanySection model={model} />
          </div>
        ) : (
          <div
            key="empresa-compacta"
            className="transition-all duration-700 ease-out"
          >
            <TravelRequestCompanyCompactBanner model={model} />
          </div>
        )}

        {trips.map((_, tripIndex) => {
          const numeroViajeEnTitulo =
            trips[tripIndex]?.ordenViajeEnSolicitud ?? tripIndex + 1
          const esUltimoViaje = tripIndex === trips.length - 1
          const esViajePasado =
            !esModoCorreccionViaje && trips.length > 1 && !esUltimoViaje
          const mostrarSoloResumen =
            esViajePasado && !edicionViajePasado[tripIndex]

          const animarEntradaFormularioPasado =
            !mostrarSoloResumen &&
            viajeCerrandoResumen !== tripIndex &&
            esViajePasado &&
            edicionViajePasado[tripIndex]

          return (
            <div
              key={tripIndex}
              className={cn(
                "transition-all duration-500 ease-out",
                tripIndex > 0
                  ? "space-y-8 border-t border-border/60 pt-10"
                  : "space-y-8"
              )}
            >
              {mostrarSoloResumen ? (
                <>
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-center text-lg font-semibold tracking-tight text-foreground sm:text-left">
                      Viaje {numeroViajeEnTitulo}
                    </h3>
                    {!esModoCorreccionViaje ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => solicitarEliminarViaje(tripIndex)}
                        className="h-10 shrink-0 cursor-pointer gap-2 rounded-xl border-destructive/40 text-destructive shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-destructive hover:bg-destructive/10 hover:shadow-md"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Eliminar viaje
                      </Button>
                    ) : null}
                  </div>
                  <div
                    key={`resumen-${tripIndex}`}
                    className="animate-travel-panel-in"
                  >
                    <TravelRequestTripSummaryCard
                      model={model}
                      tripIndex={tripIndex}
                      onExpand={() => expandirViajePasado(tripIndex)}
                    />
                  </div>
                </>
              ) : (
                <div
                  className={cn(
                    "space-y-8",
                    viajeCerrandoResumen === tripIndex
                      ? "animate-travel-panel-out"
                      : animarEntradaFormularioPasado
                        ? "animate-travel-panel-in"
                        : undefined
                  )}
                >
                  {trips.length > 1 ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-center text-lg font-semibold tracking-tight text-foreground sm:text-left">
                        Viaje {numeroViajeEnTitulo}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                        {!esModoCorreccionViaje ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => solicitarEliminarViaje(tripIndex)}
                            className="h-10 shrink-0 cursor-pointer gap-2 rounded-xl border-destructive/40 text-destructive shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-destructive hover:bg-destructive/10 hover:shadow-md"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                            Eliminar viaje
                          </Button>
                        ) : null}
                        {esViajePasado && edicionViajePasado[tripIndex] ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => iniciarCierreResumen(tripIndex)}
                            aria-label="Cerrar detalle del viaje"
                            className="h-10 shrink-0 cursor-pointer gap-2 rounded-xl border-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:bg-muted/50 hover:shadow-md"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 rotate-180 transition-transform duration-500 ease-out",
                                viajeCerrandoResumen === tripIndex &&
                                  "animate-travel-summary-close-spin"
                              )}
                              aria-hidden
                            />
                            Cerrar detalle
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <TravelRequestTripSection
                    model={model}
                    tripIndex={tripIndex}
                  />
                  <TravelRequestExpensesSection
                    key={`hospedaje-${trips[tripIndex]?.tripId ?? `nuevo-${tripIndex}`}`}
                    model={model}
                    tripIndex={tripIndex}
                  />
                  <TravelRequestObjectivesSection
                    model={model}
                    tripIndex={tripIndex}
                  />
                  <TravelRequestGasolineSection
                    model={model}
                    tripIndex={tripIndex}
                  />
                  <TravelRequestTagSection
                    model={model}
                    tripIndex={tripIndex}
                  />

                  {esUltimoViaje && !esModoCorreccionViaje ? (
                    <div
                      className={`flex justify-center pt-2 transition-all delay-600 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const indiceViajeQuePasaAResumen = trips.length - 1
                          setEdicionViajePasado((prev) => ({
                            ...prev,
                            [indiceViajeQuePasaAResumen]: false,
                          }))
                          addTrip()
                        }}
                        className="h-12 cursor-pointer rounded-2xl border-2 px-6 text-base shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/35 hover:shadow-lg hover:shadow-primary/15"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        {trips.length === 1
                          ? "Solicitar un segundo viaje"
                          : "Solicitar otro viaje"}
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )
        })}

        <div
          className={`flex justify-end transition-all delay-600 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <Button
            type="submit"
            disabled={
              ocupado || (!esModoCorreccionViaje && viaticCards.length === 0)
            }
            className="group relative h-14 cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:to-primary hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            {ocupado ? (
              <>
                <Loader2
                  className="mr-3 h-5 w-5 shrink-0 animate-spin"
                  aria-hidden
                />
                Enviando…
              </>
            ) : (
              <>
                <Send className="mr-3 h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-12" />
                {etiquetaBotonEnviar}
              </>
            )}
          </Button>
        </div>
      </fieldset>
    </form>
  )
}
