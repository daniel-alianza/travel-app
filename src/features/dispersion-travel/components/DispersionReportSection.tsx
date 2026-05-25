import { FileSpreadsheet, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DISPERSION_BUTTON_INTERACTIVE_CLASS } from "@/features/dispersion-travel/hooks/dispersion-page-helpers"
import { cn } from "@/lib/utils"

interface DispersionReportSectionProps {
  fechaReporteDesde: string
  fechaReporteHasta: string
  ocupado: boolean
  accionCargandoReporte: boolean
  onFechaDesdeChange: (value: string) => void
  onFechaHastaChange: (value: string) => void
  onLimpiarFiltros: () => void
  onGenerarReporte: () => void
}

export function DispersionReportSection({
  fechaReporteDesde,
  fechaReporteHasta,
  ocupado,
  accionCargandoReporte,
  onFechaDesdeChange,
  onFechaHastaChange,
  onLimpiarFiltros,
  onGenerarReporte,
}: DispersionReportSectionProps) {
  const hayFiltrosFecha =
    fechaReporteDesde.trim().length > 0 || fechaReporteHasta.trim().length > 0

  return (
    <section className="group/card mb-8 rounded-3xl border-2 border-border/70 bg-linear-to-br from-card/95 via-card/80 to-card/70 p-4 shadow-xl shadow-primary/10 backdrop-blur-md transition-all delay-75 duration-700 ease-out hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/15 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 ease-out group-hover/card:scale-105">
          <FileSpreadsheet className="h-5 w-5 text-primary transition-colors duration-300 group-hover/card:text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">
            Reportes de dispersión
          </h2>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="w-full space-y-1.5 sm:w-44">
              <Label
                htmlFor="dispersion-reporte-fecha-desde"
                className="text-xs font-medium text-foreground"
              >
                Fecha inicial
              </Label>
              <Input
                id="dispersion-reporte-fecha-desde"
                type="date"
                value={fechaReporteDesde}
                onChange={(e) => onFechaDesdeChange(e.target.value)}
                disabled={ocupado}
                className="h-11 w-full cursor-pointer rounded-2xl border-2 bg-background/80 px-3 text-sm transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed"
              />
            </div>
            <div className="w-full space-y-1.5 sm:w-44">
              <Label
                htmlFor="dispersion-reporte-fecha-hasta"
                className="text-xs font-medium text-foreground"
              >
                Fecha final
              </Label>
              <Input
                id="dispersion-reporte-fecha-hasta"
                type="date"
                value={fechaReporteHasta}
                onChange={(e) => onFechaHastaChange(e.target.value)}
                disabled={ocupado}
                className="h-11 w-full cursor-pointer rounded-2xl border-2 bg-background/80 px-3 text-sm transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={ocupado || !hayFiltrosFecha}
            className={cn(
              "h-11 w-full shrink-0 rounded-2xl border-2 px-4 text-sm sm:w-auto",
              DISPERSION_BUTTON_INTERACTIVE_CLASS
            )}
            onClick={onLimpiarFiltros}
          >
            Limpiar filtros
          </Button>
        </div>
        <Button
          type="button"
          disabled={ocupado}
          className={cn(
            "group w-full shrink-0 rounded-2xl shadow-md shadow-primary/15 sm:w-auto",
            DISPERSION_BUTTON_INTERACTIVE_CLASS
          )}
          onClick={onGenerarReporte}
        >
          {accionCargandoReporte ? (
            <Loader2
              className="mr-2 size-4 shrink-0 animate-spin"
              aria-hidden
            />
          ) : (
            <FileSpreadsheet className="mr-2 size-4 transition-transform duration-300 group-hover:scale-110" />
          )}
          {accionCargandoReporte ? "Generando…" : "Generar reporte Excel"}
        </Button>
      </div>
    </section>
  )
}
