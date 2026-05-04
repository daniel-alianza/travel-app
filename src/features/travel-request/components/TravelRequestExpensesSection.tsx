import {
  Car,
  DollarSign,
  Home,
  Mail,
  MoreHorizontal,
  Package,
  Route,
  Utensils,
  Wrench,
} from "lucide-react"

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
  const { mounted, trips, patchTripGasto, calcularTotal, tripSoloLectura } = model
  const trip = trips[tripIndex]
  if (!trip) {
    return null
  }
  const { gastos } = trip
  const soloLectura = tripSoloLectura(tripIndex)

  return (
    <section
      className={`relative z-20 rounded-3xl border border-border/50 bg-card p-6 shadow-lg transition-all delay-300 duration-700 sm:p-8 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        Gastos Estimados
      </h2>

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
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Home className="h-4 w-4 text-primary/70" />
            Hospedaje
          </span>
          <div className="group relative">
            <button
              type="button"
              disabled={soloLectura}
              className="h-12 w-full cursor-pointer rounded-2xl border-2 px-3 text-sm font-medium text-foreground transition-all duration-500 hover:bg-muted/50 focus:scale-[1.02] focus:border-primary focus:shadow-lg focus:shadow-primary/20 disabled:pointer-events-none disabled:opacity-50"
            >
              Ir a onfly
            </button>
          </div>
        </div>
        <TravelRequestGastoInput
          label="Alimentos"
          value={gastos.alimentos}
          onChange={(val) => patchTripGasto(tripIndex, "alimentos", val)}
          icon={Utensils}
          disabled={soloLectura}
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
  )
}
