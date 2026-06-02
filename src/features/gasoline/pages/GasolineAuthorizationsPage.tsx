import { useNavigate } from "react-router-dom"
import {
  Check,
  ClipboardCheck,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { ListPaginationBar } from "@/components/list-pagination-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GasolineCommentModal } from "@/features/gasoline/components/GasolineCommentModal"
import { GasolinePageHeader } from "@/features/gasoline/components/GasolinePageHeader"
import { GasolineRequestDetailModal } from "@/features/gasoline/components/GasolineRequestDetailModal"
import { GasolineRequestListCard } from "@/features/gasoline/components/GasolineRequestListCard"
import { useGasolineAuthorizationsPage } from "@/features/gasoline/hooks/useGasolineAuthorizationsPage"
import { useGasolineRequestDetail } from "@/features/gasoline/hooks/useGasolineRequestDetail"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import { cn } from "@/lib/utils"

export function GasolineAuthorizationsPage() {
  const navigate = useNavigate()
  const page = useGasolineAuthorizationsPage()
  const detalle = useGasolineRequestDetail()
  const mounted = true

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={page.mousePosition} />

      <AppHeader mounted={mounted} onBackToHome={() => navigate("/home")} />

      <main className="relative z-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-28 sm:px-6 sm:py-12 lg:px-8">
          <GasolinePageHeader
            icon={ClipboardCheck}
            titulo="Autorización de gasolina"
            descripcion="Aprueba o rechaza solicitudes de combustible pendientes"
            mounted={mounted}
          />

          <section
            className={`mb-6 rounded-3xl border border-border/50 bg-card p-4 shadow-lg sm:p-6 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="relative min-w-0 flex-1">
                <Label htmlFor="gasoline-auth-search" className="sr-only">
                  Buscar
                </Label>
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="gasoline-auth-search"
                  value={page.busqueda}
                  onChange={(e) => page.setBusqueda(e.target.value)}
                  placeholder="Buscar por solicitante, placa, empresa…"
                  className="h-12 rounded-2xl border-2 pl-11"
                />
              </div>
              <div className="w-full sm:w-56">
                <Label
                  htmlFor="gasoline-auth-empresa"
                  className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Empresa
                </Label>
                <select
                  id="gasoline-auth-empresa"
                  value={page.empresaFiltro}
                  onChange={(e) => page.setEmpresaFiltro(e.target.value)}
                  className="h-12 w-full cursor-pointer rounded-2xl border-2 border-border bg-card px-4 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="">Todas las empresas</option>
                  {page.opcionesEmpresa.map((empresa) => (
                    <option key={empresa} value={empresa}>
                      {empresa}
                    </option>
                  ))}
                </select>
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
              Cargando solicitudes pendientes…
            </div>
          ) : page.solicitudesFiltradas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-card/80 px-6 py-16 text-center text-muted-foreground">
              No hay solicitudes pendientes de autorización.
            </div>
          ) : (
            <ul className="space-y-4">
              {page.solicitudesPagina.map((solicitud) => (
                <li key={solicitud.id}>
                  <GasolineRequestListCard
                    solicitud={solicitud}
                    mostrarEstado={false}
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
                          className="rounded-2xl shadow-md shadow-emerald-500/15"
                          onClick={() => void page.aprobarSolicitud(solicitud)}
                        >
                          {page.accionCargando === solicitud.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Aprobar
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={page.accionCargando === solicitud.id}
                          className="rounded-2xl border-2"
                          onClick={() => page.abrirRechazo(solicitud)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rechazar
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

      <GasolineCommentModal
        abierto={page.modalResolucion === "rechazar"}
        titulo="Rechazar solicitud"
        descripcion={
          page.solicitudActiva !== null
            ? `Folio #${String(page.solicitudActiva.id)} · ${page.solicitudActiva.user.name}`
            : ""
        }
        etiquetaComentario={
          page.rechazoRequiereComentario
            ? "Motivo del rechazo *"
            : "Comentario (opcional)"
        }
        comentarioObligatorio={page.rechazoRequiereComentario}
        comentario={page.comentarioResolucion}
        confirmarTexto="Confirmar rechazo"
        cargando={
          page.solicitudActiva !== null &&
          page.accionCargando === page.solicitudActiva.id
        }
        onComentarioChange={page.setComentarioResolucion}
        onCerrar={page.cerrarModal}
        onConfirmar={() => void page.confirmarRechazo()}
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
