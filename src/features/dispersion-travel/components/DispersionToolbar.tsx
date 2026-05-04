import {
  Calculator,
  CheckCircle2,
  Loader2,
  Square,
  SquareCheck,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DISPERSION_BUTTON_INTERACTIVE_CLASS } from "@/features/dispersion-travel/hooks/dispersion-page-helpers"
import { cn } from "@/lib/utils"

interface DispersionToolbarProps {
  filasCount: number
  cantidadSeleccionadas: number
  ocupado: boolean
  accionCargandoAplicar: boolean
  accionCargandoDispersarMasivo: boolean
  onSeleccionarPaginaActual: () => void
  onQuitarSeleccion: () => void
  onAplicarAjustesMontos: () => void
  onDispersarSeleccionadas: () => void
  onRechazarSeleccionadas: () => void
}

export function DispersionToolbar({
  filasCount,
  cantidadSeleccionadas,
  ocupado,
  accionCargandoAplicar,
  accionCargandoDispersarMasivo,
  onSeleccionarPaginaActual,
  onQuitarSeleccion,
  onAplicarAjustesMontos,
  onDispersarSeleccionadas,
  onRechazarSeleccionadas,
}: DispersionToolbarProps) {
  const accionesMasivasDeshabilitadas =
    cantidadSeleccionadas === 0 || ocupado

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "group rounded-2xl border-2",
              DISPERSION_BUTTON_INTERACTIVE_CLASS
            )}
            onClick={onSeleccionarPaginaActual}
            disabled={filasCount === 0 || ocupado}
            title="Añade a la selección todas las filas visibles en esta página"
          >
            <SquareCheck className="mr-1.5 size-4 transition-transform duration-300 group-hover:scale-110" />
            Seleccionar página
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("group rounded-2xl", DISPERSION_BUTTON_INTERACTIVE_CLASS)}
            onClick={onQuitarSeleccion}
            disabled={cantidadSeleccionadas === 0 || ocupado}
          >
            <Square className="mr-1.5 size-4 transition-transform duration-300 group-hover:scale-110" />
            Quitar selección
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {cantidadSeleccionadas === 0
            ? "Ninguna solicitud seleccionada"
            : `${cantidadSeleccionadas} seleccionada${cantidadSeleccionadas === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className={cn(
            "group rounded-2xl border border-primary/20 bg-primary/5 hover:bg-primary/10",
            DISPERSION_BUTTON_INTERACTIVE_CLASS
          )}
          onClick={onAplicarAjustesMontos}
          disabled={filasCount === 0 || ocupado}
        >
          {accionCargandoAplicar ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden />
          ) : (
            <Calculator className="mr-1.5 size-4 transition-transform duration-300 group-hover:rotate-12" />
          )}
          {accionCargandoAplicar
            ? "Aplicando…"
            : "Aplicar ajustes de montos"}
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant={accionesMasivasDeshabilitadas ? "outline" : "default"}
          size="sm"
          className={cn(
            "group rounded-2xl shadow-md shadow-primary/15",
            DISPERSION_BUTTON_INTERACTIVE_CLASS
          )}
          onClick={onDispersarSeleccionadas}
          disabled={accionesMasivasDeshabilitadas}
          title={
            cantidadSeleccionadas === 0
              ? "Selecciona al menos una solicitud en la tabla para dispersar."
              : undefined
          }
        >
          {accionCargandoDispersarMasivo ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" aria-hidden />
          ) : (
            <CheckCircle2 className="mr-1.5 size-4 transition-transform duration-300 group-hover:scale-110" />
          )}
          {accionCargandoDispersarMasivo
            ? "Dispersando…"
            : "Dispersar seleccionadas"}
        </Button>
        <Button
          type="button"
          variant={accionesMasivasDeshabilitadas ? "outline" : "destructive"}
          size="sm"
          className={cn("group rounded-2xl", DISPERSION_BUTTON_INTERACTIVE_CLASS)}
          onClick={onRechazarSeleccionadas}
          disabled={accionesMasivasDeshabilitadas}
          title={
            cantidadSeleccionadas === 0
              ? "Selecciona al menos una solicitud en la tabla para rechazar la dispersión."
              : undefined
          }
        >
          <XCircle className="mr-1.5 size-4 transition-transform duration-300 group-hover:rotate-12" />
          Rechazar dispersión (seleccionadas)
        </Button>
      </div>
    </>
  )
}
