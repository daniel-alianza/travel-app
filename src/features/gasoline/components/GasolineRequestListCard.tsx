import {
  Building2,
  Car,
  MapPin,
  Route,
  User,
  Wallet,
} from "lucide-react"
import type { GasolineRequestListCardProps } from "@/features/gasoline/interfaces/gasoline-request-list-card-props.interface"
import {
  claseBadgeEstadoGasolina,
  etiquetaEstadoGasolina,
  formatearFechaGasolina,
  formatearMonedaMx,
} from "@/features/gasoline/utils/gasoline-format"
import { cn } from "@/lib/utils"

export function GasolineRequestListCard({
  solicitud,
  acciones,
  mostrarEstado = true,
}: GasolineRequestListCardProps) {
  return (
    <article className="rounded-3xl border border-border/60 bg-card p-5 shadow-lg transition-all duration-300 hover:border-orange-500/25 hover:shadow-xl sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              Folio #{solicitud.id}
            </span>
            {mostrarEstado ? (
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  claseBadgeEstadoGasolina(solicitud.status)
                )}
              >
                {etiquetaEstadoGasolina(solicitud.status)}
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">
              {formatearFechaGasolina(solicitud.createdAt)}
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-foreground">
              <User className="h-4 w-4 shrink-0 text-orange-500" />
              {solicitud.user.name}
            </p>
            <p className="flex items-center gap-2 text-sm text-foreground">
              <Building2 className="h-4 w-4 shrink-0 text-orange-500" />
              {solicitud.company.name}
              {solicitud.branch !== null
                ? ` · ${solicitud.branch.name}`
                : ""}
            </p>
            <p className="flex items-center gap-2 text-sm text-foreground">
              <Car className="h-4 w-4 shrink-0 text-orange-500" />
              {solicitud.plate}
              <span className="text-muted-foreground">
                · {solicitud.card.cardNumberMasked}
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Wallet className="h-4 w-4 shrink-0 text-orange-500" />
              {formatearMonedaMx(solicitud.requestedAmount)}
              <span className="font-normal text-muted-foreground">
                · {solicitud.distanceKm} km
              </span>
            </p>
          </div>

          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Route className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            {solicitud.routeToTake}
          </p>

          {solicitud.area !== null ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {solicitud.area.name}
              {solicitud.applicantComments !== null &&
              solicitud.applicantComments.trim().length > 0
                ? ` · ${solicitud.applicantComments}`
                : ""}
            </p>
          ) : null}
        </div>

        {acciones !== undefined ? (
          <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col lg:items-stretch">
            {acciones}
          </div>
        ) : null}
      </div>
    </article>
  )
}
