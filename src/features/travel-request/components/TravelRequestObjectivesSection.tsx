import { Plus, Target, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import type { TravelRequestPageModel } from "../interfaces/travel-request-page-model.interface"

interface TravelRequestObjectivesSectionProps {
  model: TravelRequestPageModel
  tripIndex: number
}

export function TravelRequestObjectivesSection({
  model,
  tripIndex,
}: TravelRequestObjectivesSectionProps) {
  const {
    mounted,
    trips,
    handleAddObjetivo,
    handleRemoveObjetivo,
    handleObjetivoChange,
    tripSoloLectura,
  } = model
  const trip = trips[tripIndex]
  if (!trip) {
    return null
  }
  const { objetivos } = trip
  const soloLectura = tripSoloLectura(tripIndex)

  return (
    <section
      className={`relative z-10 rounded-3xl border border-border/50 bg-card p-6 shadow-lg transition-all delay-400 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <Target className="h-4 w-4 text-primary" />
        </div>
        Objetivos del Viaje
      </h2>

      <div className="space-y-3">
        {objetivos.map((obj, idx) => (
          <div key={idx} className="group flex items-center gap-3">
            <span className="min-w-[2rem] font-medium text-muted-foreground">
              {idx + 1}.-
            </span>
            <Input
              value={obj}
              onChange={(e) =>
                handleObjetivoChange(tripIndex, idx, e.target.value)
              }
              placeholder={`Escribe el objetivo ${idx + 1}...`}
              disabled={soloLectura}
              className="h-12 flex-1 rounded-2xl border-2 transition-all duration-500 focus:scale-[1.01] focus:shadow-lg focus:shadow-primary/20"
            />
            {objetivos.length > 3 && !soloLectura && (
              <button
                type="button"
                onClick={() => handleRemoveObjetivo(tripIndex, idx)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-destructive hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Mínimo 3 y máximo 5 objetivos. Usa el botón + para agregar otro
          objetivo.
        </p>
        {objetivos.length < 5 && !soloLectura && (
          <button
            type="button"
            onClick={() => handleAddObjetivo(tripIndex)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 hover:scale-110 hover:rotate-90 hover:bg-primary hover:text-white"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  )
}
