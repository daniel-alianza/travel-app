import { useState, type ReactElement } from "react"
import {
  Building2,
  CreditCard,
  Fuel,
  Layers,
  Loader2,
  Mail,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CardAssignmentUser } from "../interfaces/card-assignment-user.interface"

interface CardAssignmentUserListProps {
  usuarios: CardAssignmentUser[]
  usuariosCarga: boolean
  usuariosError: boolean
  listaVaciaPorFiltros: boolean
  usuarioEnAccion: (userId: number) => boolean
  desactivacionEnCurso: boolean
  onAbrirModalAsignacion: (
    usuario: CardAssignmentUser,
    cardType: "VIATIC" | "FUEL"
  ) => void
  onDesactivarTarjeta: (
    usuario: CardAssignmentUser,
    cardType: "VIATIC" | "FUEL"
  ) => void
  onReintentar: () => void
}

function TarjetaUsuarioSkeleton(): ReactElement {
  return (
    <div className="animate-pulse rounded-2xl border border-border/60 bg-card/50 p-5 shadow-md">
      <div className="mb-4 flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-muted/80" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/5 max-w-56 rounded bg-muted/80" />
          <div className="h-3 w-4/5 max-w-72 rounded bg-muted/60" />
        </div>
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-3 w-full rounded bg-muted/50" />
        <div className="h-3 w-2/3 rounded bg-muted/50" />
        <div className="mt-3 grid gap-2">
          <div className="h-14 rounded-xl bg-muted/40" />
          <div className="h-14 rounded-xl bg-muted/40" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 flex-1 rounded-xl bg-muted/70" />
        <div className="h-9 flex-1 rounded-xl bg-muted/70" />
      </div>
    </div>
  )
}

export function CardAssignmentUserList({
  usuarios,
  usuariosCarga,
  usuariosError,
  listaVaciaPorFiltros,
  usuarioEnAccion,
  desactivacionEnCurso,
  onAbrirModalAsignacion,
  onDesactivarTarjeta,
  onReintentar,
}: CardAssignmentUserListProps) {
  const [tipoSeleccionadoPorUsuario, setTipoSeleccionadoPorUsuario] = useState<
    Record<number, "VIATIC" | "FUEL">
  >({})

  function getTipoSeleccionado(userId: number): "VIATIC" | "FUEL" {
    return tipoSeleccionadoPorUsuario[userId] ?? "VIATIC"
  }

  function seleccionarTipo(userId: number, cardType: "VIATIC" | "FUEL"): void {
    setTipoSeleccionadoPorUsuario((previo) => ({
      ...previo,
      [userId]: cardType,
    }))
  }

  if (usuariosCarga) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <TarjetaUsuarioSkeleton key={`sk-${String(index)}`} />
        ))}
      </div>
    )
  }

  if (usuariosError) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-destructive/25 bg-destructive/5 p-10 text-center shadow-lg",
          "transition-all duration-500"
        )}
      >
        <p className="mb-4 text-foreground">
          No se pudo cargar el listado de colaboradores.
        </p>
        <Button
          type="button"
          onClick={() => onReintentar()}
          className="cursor-pointer rounded-2xl shadow-md shadow-primary/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          Reintentar
        </Button>
      </div>
    )
  }

  if (listaVaciaPorFiltros) {
    return (
      <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-12 text-center shadow-inner transition-all duration-500">
        <p className="text-foreground">
          No hay resultados con los filtros o la búsqueda actuales.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Prueba a limpiar el texto o seleccionar otra compañía o área.
        </p>
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <div className="rounded-3xl border border-border/80 bg-muted/20 p-12 text-center">
        <p className="text-muted-foreground">
          No hay colaboradores para mostrar.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {usuarios.map((usuario, index) => {
        const accionEnEste = usuarioEnAccion(usuario.id)
        const tipoSeleccionado = getTipoSeleccionado(usuario.id)
        const tieneViaticos = usuario.tarjetaViaticosEnmascarada !== null
        const tieneGasolina = usuario.tarjetaGasolinaEnmascarada !== null
        const tieneAlgunaTarjeta = tieneViaticos || tieneGasolina
        const tarjetaSeleccionadaAsignada =
          tipoSeleccionado === "VIATIC" ? tieneViaticos : tieneGasolina
        const etiquetaTipoSeleccionado =
          tipoSeleccionado === "VIATIC" ? "viáticos" : "gasolina"

        return (
          <article
            key={usuario.id}
            style={{ transitionDelay: `${Math.min(index, 12) * 35}ms` }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-5 shadow-md shadow-black/5",
              "transition-all duration-500 ease-out",
              "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-linear-to-br from-rose-500/10 to-transparent blur-2xl" />
            </div>

            <div className="relative flex items-start gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-md transition-transform duration-500 group-hover:scale-105",
                  tieneAlgunaTarjeta
                    ? "from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                    : "from-muted to-muted/70 shadow-black/10"
                )}
              >
                <User
                  className={cn(
                    "h-6 w-6",
                    tieneAlgunaTarjeta ? "text-white" : "text-foreground/90"
                  )}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {usuario.nombreCompleto}
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{usuario.correo}</span>
                </p>
              </div>
            </div>

            <dl className="relative mt-4 space-y-2 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/90">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
                <div>
                  <dt className="sr-only">Compañía</dt>
                  <dd>{usuario.compania}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/90">
                <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
                <div>
                  <dt className="sr-only">Área</dt>
                  <dd>{usuario.area}</dd>
                </div>
              </div>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => seleccionarTipo(usuario.id, "VIATIC")}
                  className={cn(
                    "cursor-pointer flex w-full items-center gap-2 rounded-xl border bg-background/60 px-3 py-2 text-left transition-colors duration-300 group-hover:bg-background/90",
                    tipoSeleccionado === "VIATIC"
                      ? "border-rose-500/70 bg-rose-500/10 ring-2 ring-rose-500/25 shadow-sm"
                      : "border-border/60 group-hover:border-rose-500/35 group-hover:bg-rose-500/5"
                  )}
                >
                  <CreditCard className="h-4 w-4 shrink-0 text-rose-500" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">
                      Tarjeta de viáticos
                    </dt>
                    <dd className="truncate font-medium text-foreground">
                      {tieneViaticos
                        ? usuario.tarjetaViaticosEnmascarada
                        : "Sin asignar"}
                    </dd>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => seleccionarTipo(usuario.id, "FUEL")}
                  className={cn(
                    "cursor-pointer flex w-full items-center gap-2 rounded-xl border bg-background/60 px-3 py-2 text-left transition-colors duration-300 group-hover:bg-background/90",
                    tipoSeleccionado === "FUEL"
                      ? "border-amber-500/70 bg-amber-500/10 ring-2 ring-amber-500/25 shadow-sm"
                      : "border-border/60 group-hover:border-amber-500/35 group-hover:bg-amber-500/5"
                  )}
                >
                  <Fuel className="h-4 w-4 shrink-0 text-amber-600" />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">
                      Tarjeta de gasolina
                    </dt>
                    <dd className="truncate font-medium text-foreground">
                      {tieneGasolina
                        ? usuario.tarjetaGasolinaEnmascarada
                        : "Sin asignar"}
                    </dd>
                  </div>
                </button>
              </div>
            </dl>

            <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                size="sm"
                disabled={tarjetaSeleccionadaAsignada || accionEnEste}
                onClick={() => onAbrirModalAsignacion(usuario, tipoSeleccionado)}
                className={cn(
                  "h-10 flex-1 cursor-pointer rounded-xl shadow-sm transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-md",
                  tarjetaSeleccionadaAsignada && "pointer-events-none"
                )}
              >
                {accionEnEste && !tarjetaSeleccionadaAsignada ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                ) : null}
                {`Asignar ${etiquetaTipoSeleccionado}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  !tarjetaSeleccionadaAsignada ||
                  accionEnEste ||
                  desactivacionEnCurso
                }
                onClick={() => onDesactivarTarjeta(usuario, tipoSeleccionado)}
                className={cn(
                  "h-10 flex-1 cursor-pointer rounded-xl border-destructive/30 transition-all duration-300",
                  "hover:scale-[1.02] hover:border-destructive/50 hover:bg-destructive/10 hover:shadow-md",
                  !tarjetaSeleccionadaAsignada && "pointer-events-none"
                )}
              >
                {accionEnEste && tarjetaSeleccionadaAsignada ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                ) : null}
                {accionEnEste && tarjetaSeleccionadaAsignada
                  ? "Desactivando…"
                  : `Desactivar ${etiquetaTipoSeleccionado}`}
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
