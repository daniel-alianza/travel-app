import { Gauge, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { GasolineRequestDetailModalProps } from "@/features/gasoline/interfaces/gasoline-request-detail-modal-props.interface"
import {
  etiquetaEstadoGasolina,
  formatearFechaGasolina,
  formatearMonedaMx,
} from "@/features/gasoline/utils/gasoline-format"

export function GasolineRequestDetailModal({
  abierto,
  detalle,
  cargando,
  error,
  onCerrar,
}: GasolineRequestDetailModalProps) {
  if (!abierto) {
    return null
  }

  const fotoRaw =
    detalle !== null && detalle.odometerPhotos.length > 0
      ? detalle.odometerPhotos[0].photoBase64
      : null
  const foto =
    fotoRaw !== null
      ? fotoRaw.startsWith("data:")
        ? fotoRaw
        : `data:image/jpeg;base64,${fotoRaw}`
      : null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gasolina-detalle-titulo"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="gasolina-detalle-titulo"
              className="text-lg font-semibold text-foreground"
            >
              Detalle de solicitud
              {detalle !== null ? ` #${String(detalle.id)}` : ""}
            </h2>
            {detalle !== null ? (
              <p className="text-sm text-muted-foreground">
                {etiquetaEstadoGasolina(detalle.status)} ·{" "}
                {formatearFechaGasolina(detalle.createdAt)}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {cargando ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
            Cargando detalle…
          </div>
        ) : error !== null ? (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : detalle !== null ? (
          <div className="space-y-5">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Solicitante</dt>
                <dd className="font-medium">{detalle.user.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Empresa</dt>
                <dd className="font-medium">
                  {detalle.company.name}
                  {detalle.branch !== null ? ` · ${detalle.branch.name}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Placa</dt>
                <dd className="font-medium">{detalle.plate}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tarjeta</dt>
                <dd className="font-mono font-medium">
                  {detalle.card.cardNumberMasked}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Monto</dt>
                <dd className="font-medium">
                  {formatearMonedaMx(detalle.requestedAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Distancia</dt>
                <dd className="font-medium">{detalle.distanceKm} km</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Ruta</dt>
                <dd className="font-medium">{detalle.routeToTake}</dd>
              </div>
              {detalle.applicantComments !== null &&
              detalle.applicantComments.trim().length > 0 ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Comentarios</dt>
                  <dd>{detalle.applicantComments}</dd>
                </div>
              ) : null}
            </dl>

            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Gauge className="h-4 w-4 text-orange-500" />
                Odómetro ({detalle.currentMileageKm} km)
              </h3>
              {foto !== null ? (
                <img
                  src={foto}
                  alt="Fotografía del odómetro"
                  className="max-h-80 w-full rounded-2xl border border-border object-contain"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin fotografía del odómetro.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
