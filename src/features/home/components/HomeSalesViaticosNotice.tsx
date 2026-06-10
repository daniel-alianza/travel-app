import { CalendarClock, Loader2 } from "lucide-react"

import type { HomeSalesViaticosNoticeModel } from "@/features/home/interfaces/home-sales-viaticos-notice.interface"
import { cn } from "@/lib/utils"

interface HomeSalesViaticosNoticeProps {
  mounted: boolean
  cargando: boolean
  aviso: HomeSalesViaticosNoticeModel | null
}

export function HomeSalesViaticosNotice({
  mounted,
  cargando,
  aviso,
}: HomeSalesViaticosNoticeProps) {
  if (!cargando && aviso === null) {
    return null
  }

  const mostrarContadorDias =
    aviso !== null && aviso.diasHabilesRestantes > 0

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/15 bg-gradient-to-r from-card via-card to-primary/[0.06] p-4 shadow-md shadow-primary/5 transition-all duration-700 ease-out sm:p-5",
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
      role="status"
      aria-live="polite"
      aria-busy={cargando}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-4 sm:shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            {cargando ? (
              <Loader2
                className="h-5 w-5 animate-spin text-primary"
                aria-hidden
              />
            ) : (
              <CalendarClock className="h-5 w-5 text-primary" aria-hidden />
            )}
          </div>
          {mostrarContadorDias ? (
            <div className="min-w-[5.5rem]">
              <p className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                {aviso?.diasHabilesRestantes}
              </p>
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                hábiles restantes
              </p>
            </div>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {cargando
              ? "Calendario de viáticos"
              : (aviso?.tituloAccion ?? "Calendario de viáticos")}
          </p>
          {cargando ? (
            <p className="text-sm text-muted-foreground">
              Calculando plazos del mes…
            </p>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-foreground sm:text-base">
                {aviso?.mensajePrincipal}
              </p>
              {aviso?.mensajeSecundario !== null &&
              aviso?.mensajeSecundario !== undefined &&
              aviso.mensajeSecundario.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {aviso.mensajeSecundario}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
