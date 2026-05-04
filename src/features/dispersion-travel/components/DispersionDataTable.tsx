import type { RefObject } from "react"
import { Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DispersionPillSelect } from "@/features/dispersion-travel/components/DispersionPillSelect"
import {
  DISPERSION_BUTTON_INTERACTIVE_CLASS,
  formatearFecha,
  formatearMoneda,
} from "@/features/dispersion-travel/hooks/dispersion-page-helpers"
import {
  OPCIONES_SIGNO,
  type FilaDispersion,
  type SignoAjuste,
} from "@/features/dispersion-travel/interfaces/dispersion-fila.interface"
import { cn } from "@/lib/utils"

interface DispersionDataTableProps {
  filas: FilaDispersion[]
  seleccionEfectiva: Set<number>
  ocupado: boolean
  accionCargando: string | null
  dropdownPillAbierto: string | null
  setDropdownPillAbierto: (id: string | null) => void
  selectAllRef: RefObject<HTMLInputElement | null>
  todasSeleccionadas: boolean
  alternarSeleccionarTodas: () => void
  alternarSeleccion: (id: number) => void
  actualizarFila: (
    id: number,
    patch: Partial<
      Pick<FilaDispersion, "signoAjuste" | "montoAAjustar" | "montoEsAbsoluto">
    >
  ) => void
  convertirAbsolutoADeltaEnFila: (id: number) => void
  dispersarPorIds: (ids: number[]) => void | Promise<void>
  abrirModalRechazo: (ids: number[]) => void
}

export function DispersionDataTable({
  filas,
  seleccionEfectiva,
  ocupado,
  accionCargando,
  dropdownPillAbierto,
  setDropdownPillAbierto,
  selectAllRef,
  todasSeleccionadas,
  alternarSeleccionarTodas,
  alternarSeleccion,
  actualizarFila,
  convertirAbsolutoADeltaEnFila,
  dispersarPorIds,
  abrirModalRechazo,
}: DispersionDataTableProps) {
  return (
    <>
      <ul className="grid gap-4 lg:hidden" role="list">
        {filas.map((fila) => {
          const filaMarcada = seleccionEfectiva.has(fila.id)
          const accionesFilaDeshabilitadas = ocupado || !filaMarcada
          return (
          <li key={fila.id}>
            <article
              className={cn(
                "group h-full rounded-3xl border-2 border-border/70 bg-linear-to-br from-card/95 via-card/80 to-card/65 p-5 shadow-lg shadow-primary/10 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-xl hover:shadow-primary/15 sm:p-6",
                seleccionEfectiva.has(fila.id) &&
                  "border-primary/40 ring-2 ring-primary/20"
              )}
            >
              <div className="flex gap-3 border-b border-border/50 pb-3">
                <div className="flex shrink-0 items-start pt-0.5">
                  <Checkbox
                    checked={seleccionEfectiva.has(fila.id)}
                    onChange={() => alternarSeleccion(fila.id)}
                    aria-label={`Seleccionar solicitud de ${fila.nombreSolicitante}`}
                    className="size-4 cursor-pointer accent-primary transition-transform duration-200 hover:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {fila.nombreSolicitante}
                  </h3>
                  <p className="font-mono text-xs text-foreground/90">
                    {fila.numeroTarjeta}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {fila.descripcion}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 rounded-2xl border border-border/50 bg-background/40 p-3">
                  <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
                    Monto solicitado
                  </p>
                  <p className="tabular-nums text-foreground">
                    {formatearMoneda(fila.montoSolicitado)}
                  </p>
                </div>
                <div className="space-y-1 rounded-2xl border border-border/50 bg-background/40 p-3">
                  <p className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
                    Viaje
                  </p>
                  <p className="text-sm text-foreground">
                    {formatearFecha(fila.fechaInicioViaje)} —{" "}
                    {formatearFecha(fila.fechaFinViaje)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
                    Signo
                  </span>
                  <DispersionPillSelect
                    instanceId={`signo-mobile-${fila.id}`}
                    value={fila.signoAjuste}
                    options={OPCIONES_SIGNO}
                    onChange={(valor) =>
                      actualizarFila(fila.id, {
                        signoAjuste: valor as SignoAjuste,
                      })
                    }
                    placeholder="Signo"
                    disabled={ocupado}
                    dropdownOpen={dropdownPillAbierto}
                    setDropdownOpen={setDropdownPillAbierto}
                    ariaLabel={`Signo del ajuste para ${fila.nombreSolicitante}`}
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">
                    Monto a ajustar
                  </span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej. 1 500"
                    value={fila.montoAAjustar}
                    onFocus={() => convertirAbsolutoADeltaEnFila(fila.id)}
                    onChange={(e) =>
                      actualizarFila(fila.id, {
                        montoAAjustar: e.target.value,
                      })
                    }
                    disabled={ocupado}
                    className={cn(
                      "h-10 w-full rounded-xl border-2 bg-background/80 text-right tabular-nums transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed",
                      fila.montoEsAbsoluto &&
                        "border-primary/40 font-medium text-primary"
                    )}
                    aria-label={`Monto a ajustar para ${fila.nombreSolicitante}`}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  size="sm"
                  className={cn(
                    "group w-full rounded-xl sm:flex-1",
                    DISPERSION_BUTTON_INTERACTIVE_CLASS
                  )}
                  disabled={accionesFilaDeshabilitadas}
                  title={
                    !filaMarcada
                      ? "Marca la solicitud con la casilla para poder dispersar."
                      : undefined
                  }
                  onClick={() => void dispersarPorIds([fila.id])}
                >
                  {accionCargando === `dispersar-${fila.id}` ? (
                    <>
                      <Loader2
                        className="mr-1 size-3.5 shrink-0 animate-spin"
                        aria-hidden
                      />
                      Dispersando
                    </>
                  ) : (
                    "Dispersar"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className={cn(
                    "group w-full rounded-xl sm:flex-1",
                    DISPERSION_BUTTON_INTERACTIVE_CLASS
                  )}
                  disabled={accionesFilaDeshabilitadas}
                  title={
                    !filaMarcada
                      ? "Marca la solicitud con la casilla para poder rechazar la dispersión."
                      : undefined
                  }
                  onClick={() => abrirModalRechazo([fila.id])}
                >
                  <XCircle className="mr-1 size-3.5 transition-transform duration-300 group-hover:rotate-12" />
                  Rechazar
                </Button>
              </div>
            </article>
          </li>
          )
        })}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-border/60 bg-background/40 transition-shadow duration-300 ease-out hover:border-border hover:shadow-inner lg:block lg:overflow-x-visible">
      <table className="w-full min-w-0 table-auto border-collapse text-left text-sm lg:min-w-full">
        <thead>
          <tr className="border-b border-border/60 bg-muted/40">
            <th className="w-12 px-2 py-3 text-center">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={todasSeleccionadas}
                onChange={alternarSeleccionarTodas}
                disabled={filas.length === 0 || ocupado}
                className="size-4 cursor-pointer rounded border border-input accent-primary transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Seleccionar o deseleccionar todas las solicitudes visibles"
              />
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Nombre del solicitante
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Número de tarjeta
            </th>
            <th className="min-w-48 px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Descripción
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Monto solicitado
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Signo
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Monto a ajustar
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Fecha inicio
            </th>
            <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Fecha fin
            </th>
            <th className="min-w-52 px-3 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, index) => {
            const filaMarcada = seleccionEfectiva.has(fila.id)
            const accionesFilaDeshabilitadas = ocupado || !filaMarcada
            return (
            <tr
              key={fila.id}
              className={cn(
                "border-b border-border/50 transition-colors duration-200 ease-out hover:bg-muted/30 hover:shadow-sm",
                index === filas.length - 1 && "border-b-0",
                seleccionEfectiva.has(fila.id) && "bg-primary/5"
              )}
            >
              <td className="px-2 py-3 align-middle">
                <Checkbox
                  checked={seleccionEfectiva.has(fila.id)}
                  onChange={() => alternarSeleccion(fila.id)}
                  aria-label={`Seleccionar solicitud de ${fila.nombreSolicitante}`}
                  className="size-4 cursor-pointer accent-primary transition-transform duration-200 hover:scale-110"
                />
              </td>
              <td className="max-w-56 px-3 py-3 align-middle font-medium text-foreground">
                {fila.nombreSolicitante}
              </td>
              <td className="whitespace-nowrap px-3 py-3 align-middle font-mono text-xs text-foreground/90">
                {fila.numeroTarjeta}
              </td>
              <td className="max-w-72 px-3 py-3 align-middle text-muted-foreground">
                {fila.descripcion}
              </td>
              <td className="whitespace-nowrap px-3 py-3 align-middle tabular-nums text-foreground">
                {formatearMoneda(fila.montoSolicitado)}
              </td>
              <td className="px-3 py-3 align-middle">
                <DispersionPillSelect
                  instanceId={`signo-${fila.id}`}
                  value={fila.signoAjuste}
                  options={OPCIONES_SIGNO}
                  onChange={(valor) =>
                    actualizarFila(fila.id, {
                      signoAjuste: valor as SignoAjuste,
                    })
                  }
                  placeholder="Signo"
                  disabled={ocupado}
                  dropdownOpen={dropdownPillAbierto}
                  setDropdownOpen={setDropdownPillAbierto}
                  ariaLabel={`Signo del ajuste para ${fila.nombreSolicitante}`}
                />
              </td>
              <td className="px-3 py-3 align-middle">
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ej. 1 500"
                  value={fila.montoAAjustar}
                  onFocus={() => convertirAbsolutoADeltaEnFila(fila.id)}
                  onChange={(e) =>
                    actualizarFila(fila.id, {
                      montoAAjustar: e.target.value,
                    })
                  }
                  disabled={ocupado}
                  className={cn(
                    "h-10 min-w-28 rounded-xl border-2 bg-background/80 text-right tabular-nums transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed",
                    fila.montoEsAbsoluto &&
                      "border-primary/40 font-medium text-primary"
                  )}
                  aria-label={`Monto a ajustar para ${fila.nombreSolicitante}`}
                />
              </td>
              <td className="whitespace-nowrap px-3 py-3 align-middle text-foreground">
                {formatearFecha(fila.fechaInicioViaje)}
              </td>
              <td className="whitespace-nowrap px-3 py-3 align-middle text-foreground">
                {formatearFecha(fila.fechaFinViaje)}
              </td>
              <td className="px-3 py-3 align-middle">
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    className={cn(
                      "group rounded-xl",
                      DISPERSION_BUTTON_INTERACTIVE_CLASS
                    )}
                    disabled={accionesFilaDeshabilitadas}
                    title={
                      !filaMarcada
                        ? "Marca la solicitud con la casilla para poder dispersar."
                        : undefined
                    }
                    onClick={() => void dispersarPorIds([fila.id])}
                  >
                    {accionCargando === `dispersar-${fila.id}` ? (
                      <>
                        <Loader2
                          className="mr-1 size-3.5 shrink-0 animate-spin"
                          aria-hidden
                        />
                        Dispersando
                      </>
                    ) : (
                      "Dispersar"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className={cn(
                      "group rounded-xl",
                      DISPERSION_BUTTON_INTERACTIVE_CLASS
                    )}
                    disabled={accionesFilaDeshabilitadas}
                    title={
                      !filaMarcada
                        ? "Marca la solicitud con la casilla para poder rechazar la dispersión."
                        : undefined
                    }
                    onClick={() => abrirModalRechazo([fila.id])}
                  >
                    <XCircle className="mr-1 size-3.5 transition-transform duration-300 group-hover:rotate-12" />
                    Rechazar
                  </Button>
                </div>
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </>
  )
}
