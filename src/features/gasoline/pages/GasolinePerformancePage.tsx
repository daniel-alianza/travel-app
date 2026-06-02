import { useNavigate } from "react-router-dom"
import {
  Car,
  Gauge,
  Loader2,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GasolinePageHeader } from "@/features/gasoline/components/GasolinePageHeader"
import { useGasolinePerformancePage } from "@/features/gasoline/hooks/useGasolinePerformancePage"
import {
  formatearFechaGasolina,
  formatearMonedaMx,
} from "@/features/gasoline/utils/gasoline-format"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import { cn } from "@/lib/utils"

export function GasolinePerformancePage() {
  const navigate = useNavigate()
  const page = useGasolinePerformancePage()
  const mounted = true

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted={mounted} onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <GasolinePageHeader
            icon={Gauge}
            titulo="Rendimiento de consumo"
            descripcion="Analiza costo y kilometraje por vehículo según tu historial"
            mounted={mounted}
          />

          <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-md">
              <p className="text-xs text-muted-foreground">Vehículos</p>
              <p className="text-2xl font-semibold">
                {page.resumenGlobal.vehiculos}
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-md">
              <p className="text-xs text-muted-foreground">Monto acumulado</p>
              <p className="text-2xl font-semibold">
                {page.resumenGlobal.montoFormateado}
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-md">
              <p className="text-xs text-muted-foreground">Km reportados</p>
              <p className="text-2xl font-semibold">
                {page.resumenGlobal.distancia.toLocaleString("es-MX")} km
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-md">
              <p className="text-xs text-muted-foreground">Costo promedio / km</p>
              <p className="text-2xl font-semibold">
                {page.resumenGlobal.costoPromedioKm !== null
                  ? formatearMonedaMx(page.resumenGlobal.costoPromedioKm)
                  : "—"}
              </p>
            </div>
          </section>

          <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={page.busqueda}
                onChange={(e) => page.setBusqueda(e.target.value)}
                placeholder="Buscar por placa…"
                className="h-12 rounded-2xl border-2 pl-11"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-12 shrink-0 rounded-2xl border-2"
              disabled={page.cargaInicial}
              onClick={() => void page.recargar()}
            >
              <RefreshCw
                className={cn(
                  "mr-2 h-4 w-4",
                  page.cargaInicial && "animate-spin"
                )}
              />
              Actualizar
            </Button>
          </section>

          {page.cargaInicial ? (
            <div className="flex items-center justify-center gap-3 rounded-3xl border border-border/60 bg-card px-6 py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              Calculando rendimiento…
            </div>
          ) : page.vehiculosFiltrados.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-card/80 px-6 py-16 text-center text-muted-foreground">
              No hay datos de consumo para mostrar.
            </div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {page.vehiculosFiltrados.map((vehiculo) => (
                <li key={vehiculo.placa}>
                  <article className="rounded-3xl border border-border/60 bg-card p-5 shadow-lg transition-all hover:border-orange-500/30 hover:shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10">
                          <Car className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {vehiculo.placa}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {vehiculo.solicitudes} solicitud
                            {vehiculo.solicitudes === 1 ? "" : "es"}
                          </p>
                        </div>
                      </div>
                      <TrendingUp className="h-5 w-5 text-orange-500/70" />
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Monto total
                        </dt>
                        <dd className="font-medium">
                          {formatearMonedaMx(vehiculo.montoTotal)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Distancia (km)
                        </dt>
                        <dd className="font-medium">
                          {vehiculo.distanciaTotalKm.toLocaleString("es-MX")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Costo / km
                        </dt>
                        <dd className="font-medium">
                          {vehiculo.costoPorKm !== null
                            ? formatearMonedaMx(vehiculo.costoPorKm)
                            : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Km odómetro (rango)
                        </dt>
                        <dd className="font-medium">
                          {vehiculo.kilometrajeRecorrido !== null
                            ? `${vehiculo.kilometrajeRecorrido.toLocaleString("es-MX")} km`
                            : "—"}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-xs text-muted-foreground">
                          Última solicitud
                        </dt>
                        <dd className="font-medium">
                          {formatearFechaGasolina(vehiculo.ultimaSolicitud)}
                          {vehiculo.ultimoKilometraje !== null
                            ? ` · ${vehiculo.ultimoKilometraje.toLocaleString("es-MX")} km`
                            : ""}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <AppFooter mounted={mounted} transitionDelayClass="delay-700" />
    </div>
  )
}
