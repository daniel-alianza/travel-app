import { useEffect, useState } from "react"
import { Loader2, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppFooter } from "@/components/app-footer"
import { AppHeader } from "@/components/app-header"
import { showAppToast } from "@/components/app-toast"
import { Button } from "@/components/ui/button"
import { TravelRequestBackground } from "@/features/travel-request/components/TravelRequestBackground"
import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"
import {
  fetchMyTravelRequests,
  type MyTravelRequestApi,
} from "@/features/travel-request/services/travel-request-api"
import { cn } from "@/lib/utils"

const AUTHENTICATED_USER_ID = 1

function etiquetaEstadoSolicitud(status: string): string {
  switch (status) {
    case "approved":
      return "Aprobada"
    case "rejected":
      return "Rechazada"
    case "awaiting_trip_correction":
      return "En corrección"
    case "submitted":
      return "En revisión"
    case "dispersed":
      return "Dispersada"
    case "draft":
      return "Borrador"
    case "cancelled":
      return "Cancelada"
    default:
      return status
  }
}

function etiquetaEstadoViaje(estadoViaje: string): string {
  switch (estadoViaje) {
    case "approved":
      return "Aprobado"
    case "rejected":
      return "Rechazado"
    case "pending":
      return "Pendiente"
    default:
      return estadoViaje
  }
}

function claseEstadoViaje(estadoViaje: string): string {
  if (estadoViaje === "approved") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
  }
  if (estadoViaje === "rejected") {
    return "border-destructive/40 bg-destructive/10 text-destructive"
  }
  return "border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-100"
}

function claseEstadoSolicitud(status: string): string {
  if (status === "approved") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
  }
  if (status === "rejected") {
    return "border-destructive/40 bg-destructive/10 text-destructive"
  }
  if (status === "awaiting_trip_correction") {
    return "border-orange-500/40 bg-orange-500/10 text-orange-900 dark:text-orange-100"
  }
  return "border-primary/30 bg-primary/10 text-primary"
}

export function MyTravelRequestsPage() {
  const navigate = useNavigate()
  const mounted = true
  const [mousePosition, setMousePosition] = useState<TravelRequestMousePosition>({
    x: 0,
    y: 0,
  })
  const [cargando, setCargando] = useState(true)
  const [solicitudes, setSolicitudes] = useState<MyTravelRequestApi[]>([])

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let activo = true
    async function cargar(): Promise<void> {
      setCargando(true)
      try {
        const lista = await fetchMyTravelRequests(AUTHENTICATED_USER_ID)
        if (activo) {
          setSolicitudes(lista)
        }
      } catch {
        showAppToast(
          "No se pudieron cargar tus solicitudes. Revisa la conexión con el servidor.",
          "error"
        )
        if (activo) {
          setSolicitudes([])
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }
    void cargar()
    return () => {
      activo = false
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <TravelRequestBackground mousePosition={mousePosition} />

      <AppHeader
        mounted={mounted}
        onBackToHome={() => navigate("/travel-request")}
        mostrarAccionesDerecha
      />

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-28 sm:px-6 sm:pt-12 md:pb-16 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Mis solicitudes de viáticos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Aquí ves el estado de cada solicitud y de cada viaje (pendiente, aprobado o rechazado) y
            los comentarios del aprobador cuando apliquen.
          </p>
        </header>

        {cargando ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-card/80 py-16 text-muted-foreground backdrop-blur-sm"
            role="status"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
            <p className="text-sm font-medium">Cargando solicitudes…</p>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center text-muted-foreground">
            <p className="text-sm sm:text-base">
              Aún no hay solicitudes registradas para tu usuario, o no se pudieron obtener.
            </p>
            <p className="mt-2 text-xs sm:text-sm">
              Cuando envíes una solicitud desde &quot;Crear solicitud&quot;, aparecerá aquí con su
              estado.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {solicitudes.map((solicitud) => (
              <li
                key={solicitud.id}
                className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-lg shadow-foreground/5 backdrop-blur-md sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 pb-4">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Solicitud
                    </p>
                    <p className="text-lg font-semibold tabular-nums text-foreground">
                      #{solicitud.id}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      Creada:{" "}
                      <time dateTime={solicitud.createdAt}>
                        {solicitud.createdAt.slice(0, 10)}
                      </time>
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold",
                      claseEstadoSolicitud(solicitud.status)
                    )}
                  >
                    {etiquetaEstadoSolicitud(solicitud.status)}
                  </span>
                </div>

                <p className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Viajes
                </p>
                <ul className="mt-3 flex flex-col gap-3">
                  {solicitud.viajes.map((viaje) => (
                    <li
                      key={viaje.tripId}
                      className="flex flex-col gap-2 rounded-xl border border-border/50 bg-background/60 p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-1 gap-2">
                        <MapPin
                          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            Viaje {viaje.tripOrder}: {viaje.destino}
                          </p>
                          {viaje.comentarioAprobador ? (
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                              <span className="font-semibold text-foreground">
                                Comentario del aprobador:{" "}
                              </span>
                              {viaje.comentarioAprobador}
                            </p>
                          ) : null}
                          {viaje.aprobadoEn ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Aprobado: {viaje.aprobadoEn.slice(0, 16).replace("T", " ")}
                            </p>
                          ) : null}
                          {viaje.rechazadoEn ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Rechazado: {viaje.rechazadoEn.slice(0, 16).replace("T", " ")}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {viaje.estadoViaje === "rejected" ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-8 cursor-pointer rounded-lg px-3 text-xs"
                            onClick={() =>
                              navigate(
                                `/travel-request?solicitud=${solicitud.id}&viaje=${viaje.tripId}`
                              )
                            }
                          >
                            Corregir viaje
                          </Button>
                        ) : null}
                        <span
                          className={cn(
                            "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                            claseEstadoViaje(viaje.estadoViaje)
                          )}
                        >
                          {etiquetaEstadoViaje(viaje.estadoViaje)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </main>

      <AppFooter mounted={mounted} transitionDelayClass="delay-700" />
    </div>
  )
}
