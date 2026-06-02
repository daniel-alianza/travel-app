import { useNavigate } from "react-router-dom"
import {
  Banknote,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { ListPaginationBar } from "@/components/list-pagination-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GasolineCommentModal } from "@/features/gasoline/components/GasolineCommentModal"
import { GasolinePageHeader } from "@/features/gasoline/components/GasolinePageHeader"
import { GasolineRequestDetailModal } from "@/features/gasoline/components/GasolineRequestDetailModal"
import { GasolineRequestListCard } from "@/features/gasoline/components/GasolineRequestListCard"
import { useGasolineDispersionPage } from "@/features/gasoline/hooks/useGasolineDispersionPage"
import { useGasolineRequestDetail } from "@/features/gasoline/hooks/useGasolineRequestDetail"
import { formatearMonedaMx } from "@/features/gasoline/utils/gasoline-format"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import { cn } from "@/lib/utils"

export function GasolineDispersionPage() {
  const navigate = useNavigate()
  const page = useGasolineDispersionPage()
  const detalle = useGasolineRequestDetail()
  const mounted = true

  const cargandoModal =
    page.solicitudActiva !== null &&
    page.accionCargando === page.solicitudActiva.id

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted={mounted} onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <GasolinePageHeader
            icon={Banknote}
            titulo="Dispersión de gasolina"
            descripcion="Dispersa fondos de combustible a solicitudes ya aprobadas"
            mounted={mounted}
          />

          <section className="mb-6 rounded-3xl border border-border/50 bg-card p-4 shadow-lg sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={page.busqueda}
                  onChange={(e) => page.setBusqueda(e.target.value)}
                  placeholder="Buscar por solicitante, placa, folio…"
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
            </div>
          </section>

          {page.cargaInicial ? (
            <div className="flex items-center justify-center gap-3 rounded-3xl border border-border/60 bg-card px-6 py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
              Cargando cola de dispersión…
            </div>
          ) : page.solicitudesFiltradas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-card/80 px-6 py-16 text-center text-muted-foreground">
              No hay solicitudes aprobadas pendientes de dispersión.
            </div>
          ) : (
            <ul className="space-y-4">
              {page.solicitudesPagina.map((solicitud) => (
                <li key={solicitud.id}>
                  <GasolineRequestListCard
                    solicitud={solicitud}
                    acciones={
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl border-2"
                          onClick={() => void detalle.abrir(solicitud.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalle
                        </Button>
                        <Button
                          type="button"
                          disabled={page.accionCargando === solicitud.id}
                          className="rounded-2xl shadow-md shadow-orange-500/20"
                          onClick={() => void page.abrirDispersion(solicitud)}
                        >
                          <Banknote className="mr-2 h-4 w-4" />
                          Dispersar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={page.accionCargando === solicitud.id}
                          className="rounded-2xl border-2"
                          onClick={() => page.abrirCancelacion(solicitud)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      </>
                    }
                  />
                </li>
              ))}
            </ul>
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

      {page.modalAbierto === "dispersar" && page.solicitudActiva !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-foreground">
              Dispersar solicitud #{String(page.solicitudActiva.id)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Monto: {formatearMonedaMx(page.solicitudActiva.requestedAmount)} ·{" "}
              {page.solicitudActiva.company.name}
            </p>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gasoline-anticipo-select">
                  Anticipo SAP
                  <span className="text-destructive" aria-hidden>
                    {" "}
                    *
                  </span>
                </Label>
                {page.anticiposCargando ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando anticipos…
                  </div>
                ) : (
                  <select
                    id="gasoline-anticipo-select"
                    value={page.anticipoSeleccionado}
                    onChange={(e) =>
                      page.setAnticipoSeleccionado(e.target.value)
                    }
                    disabled={cargandoModal || page.anticipos.length === 0}
                    className="h-12 w-full cursor-pointer rounded-2xl border-2 border-border bg-background px-4 text-sm"
                  >
                    <option value="">
                      {page.anticipos.length === 0
                        ? "Sin anticipos disponibles"
                        : "Selecciona anticipo"}
                    </option>
                    {page.anticipos.map((anticipo) => (
                      <option
                        key={anticipo.docEntry}
                        value={String(anticipo.docEntry)}
                      >
                        Doc {anticipo.docEntry} · saldo{" "}
                        {formatearMonedaMx(anticipo.saldo)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gasoline-disburse-comment">
                  Comentario (opcional)
                </Label>
                <Textarea
                  id="gasoline-disburse-comment"
                  value={page.comentario}
                  onChange={(e) => page.setComentario(e.target.value)}
                  disabled={cargandoModal}
                  className="min-h-[80px] resize-none rounded-2xl border-2"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                disabled={cargandoModal}
                onClick={page.cerrarModal}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="rounded-2xl"
                disabled={
                  cargandoModal ||
                  page.anticipoSeleccionado.length === 0 ||
                  page.anticiposCargando
                }
                onClick={() => void page.confirmarDispersion()}
              >
                {cargandoModal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirmar dispersión"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <GasolineCommentModal
        abierto={page.modalAbierto === "cancelar"}
        titulo="Cancelar solicitud aprobada"
        descripcion={
          page.solicitudActiva !== null
            ? `Folio #${String(page.solicitudActiva.id)}`
            : ""
        }
        etiquetaComentario="Motivo de cancelación"
        comentario={page.comentario}
        comentarioObligatorio
        confirmarTexto="Confirmar cancelación"
        cargando={cargandoModal}
        onComentarioChange={page.setComentario}
        onCerrar={page.cerrarModal}
        onConfirmar={() => void page.confirmarCancelacion()}
      />

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
