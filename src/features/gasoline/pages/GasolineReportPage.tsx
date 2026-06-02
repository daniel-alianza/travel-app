import { useNavigate } from "react-router-dom"
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { ListPaginationBar } from "@/components/list-pagination-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GasolinePageHeader } from "@/features/gasoline/components/GasolinePageHeader"
import { GasolineRequestDetailModal } from "@/features/gasoline/components/GasolineRequestDetailModal"
import { useGasolineReportPage } from "@/features/gasoline/hooks/useGasolineReportPage"
import { useGasolineRequestDetail } from "@/features/gasoline/hooks/useGasolineRequestDetail"
import type { GasolineRequestStatus } from "@/features/gasoline/services/gasoline-api"
import {
  claseBadgeEstadoGasolina,
  etiquetaEstadoGasolina,
  formatearFechaGasolina,
  formatearMonedaMx,
} from "@/features/gasoline/utils/gasoline-format"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import { cn } from "@/lib/utils"

const ESTADOS_FILTRO: Array<{ valor: GasolineRequestStatus | ""; etiqueta: string }> =
  [
    { valor: "", etiqueta: "Todos los estados" },
    { valor: "pending", etiqueta: "Pendiente" },
    { valor: "approved", etiqueta: "Aprobada" },
    { valor: "rejected", etiqueta: "Rechazada" },
    { valor: "dispersed", etiqueta: "Dispersada" },
  ]

export function GasolineReportPage() {
  const navigate = useNavigate()
  const page = useGasolineReportPage()
  const detalle = useGasolineRequestDetail()
  const mounted = true

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted={mounted} onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <GasolinePageHeader
            icon={BarChart3}
            titulo="Reporte de gasolina"
            descripcion="Consulta movimientos y exporta el detalle de solicitudes"
            mounted={mounted}
          />

          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant={page.vista === "operativa" ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => page.setVista("operativa")}
            >
              Cola operativa
            </Button>
            <Button
              type="button"
              variant={page.vista === "historial" ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => page.setVista("historial")}
            >
              Mi historial
            </Button>
          </div>

          <section className="mb-6 rounded-3xl border border-border/50 bg-card p-4 shadow-lg sm:p-6">
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="relative xl:col-span-2">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={page.busqueda}
                  onChange={(e) => page.setBusqueda(e.target.value)}
                  placeholder="Buscar…"
                  className="h-12 rounded-2xl border-2 pl-11"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Estado
                </Label>
                <select
                  value={page.estadoFiltro}
                  onChange={(e) =>
                    page.setEstadoFiltro(
                      e.target.value as GasolineRequestStatus | ""
                    )
                  }
                  className="h-12 w-full cursor-pointer rounded-2xl border-2 border-border bg-card px-4 text-sm"
                >
                  {ESTADOS_FILTRO.map((opcion) => (
                    <option key={opcion.valor || "all"} value={opcion.valor}>
                      {opcion.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">
                    Desde
                  </Label>
                  <Input
                    type="date"
                    value={page.fechaDesde}
                    onChange={(e) => page.setFechaDesde(e.target.value)}
                    className="h-12 rounded-2xl border-2"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Label className="mb-1.5 block text-xs text-muted-foreground">
                    Hasta
                  </Label>
                  <Input
                    type="date"
                    value={page.fechaHasta}
                    onChange={(e) => page.setFechaHasta(e.target.value)}
                    className="h-12 rounded-2xl border-2"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-2"
                onClick={page.limpiarFiltros}
              >
                Limpiar filtros
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-2"
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
              <Button
                type="button"
                className="rounded-2xl"
                disabled={page.exportando || page.solicitudesFiltradas.length === 0}
                onClick={page.exportarCsv}
              >
                {page.exportando ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Exportar CSV
              </Button>
            </div>
          </section>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-md">
              <p className="text-xs text-muted-foreground">Registros</p>
              <p className="text-2xl font-semibold text-foreground">
                {page.totales.cantidad}
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-md">
              <p className="text-xs text-muted-foreground">Monto total</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatearMonedaMx(page.totales.monto)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-md">
              <p className="text-xs text-muted-foreground">Distancia total</p>
              <p className="text-2xl font-semibold text-foreground">
                {page.totales.distancia.toLocaleString("es-MX")} km
              </p>
            </div>
          </div>

          {page.cargaInicial ? (
            <div className="flex items-center justify-center gap-3 rounded-3xl border border-border/60 bg-card px-6 py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              Cargando reporte…
            </div>
          ) : page.solicitudesFiltradas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-card/80 px-6 py-16 text-center text-muted-foreground">
              <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 opacity-40" />
              No hay registros con los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Folio</th>
                      <th className="px-4 py-3 font-semibold">Fecha</th>
                      <th className="px-4 py-3 font-semibold">Estado</th>
                      <th className="px-4 py-3 font-semibold">Solicitante</th>
                      <th className="px-4 py-3 font-semibold">Empresa</th>
                      <th className="px-4 py-3 font-semibold">Placa</th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.solicitudesPagina.map((solicitud) => (
                      <tr
                        key={solicitud.id}
                        className="border-b border-border/40 transition-colors hover:bg-orange-500/5"
                      >
                        <td className="px-4 py-3 font-medium">
                          <button
                            type="button"
                            className="text-orange-600 underline-offset-2 hover:underline dark:text-orange-400"
                            onClick={() => void detalle.abrir(solicitud.id)}
                          >
                            #{solicitud.id}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatearFechaGasolina(solicitud.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-semibold",
                              claseBadgeEstadoGasolina(solicitud.status)
                            )}
                          >
                            {etiquetaEstadoGasolina(solicitud.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">{solicitud.user.name}</td>
                        <td className="px-4 py-3">{solicitud.company.name}</td>
                        <td className="px-4 py-3">{solicitud.plate}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatearMonedaMx(solicitud.requestedAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!page.cargaInicial && page.solicitudesFiltradas.length > 0 ? (
            <ListPaginationBar
              className="mt-8"
              pagina={page.pagina}
              totalPaginas={page.totalPaginas}
              tamanoPagina={page.tamanoPagina}
              opcionesTamanoPagina={page.opcionesTamanoPagina}
              totalElementos={page.solicitudesFiltradas.length}
              onPaginaAnterior={() =>
                page.setPagina(Math.max(1, page.pagina - 1))
              }
              onPaginaSiguiente={() =>
                page.setPagina(
                  Math.min(page.totalPaginas, page.pagina + 1)
                )
              }
              onCambiarTamanoPagina={page.setTamanoPagina}
            />
          ) : null}
        </div>
      </main>

      <AppFooter mounted={mounted} transitionDelayClass="delay-700" />

      <GasolineRequestDetailModal
        abierto={detalle.abierto}
        detalle={detalle.detalle}
        cargando={detalle.cargando}
        error={detalle.error}
        onCerrar={detalle.cerrar}
      />
    </div>
  )
}
