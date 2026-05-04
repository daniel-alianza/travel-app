import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ListPaginationBarProps {
  pagina: number
  totalPaginas: number
  totalElementos: number
  tamanoPagina: number
  deshabilitado?: boolean
  etiquetaElemento?: string
  onPaginaAnterior: () => void
  onPaginaSiguiente: () => void
  onCambiarTamanoPagina?: (tamano: number) => void
  opcionesTamanoPagina?: readonly number[]
  className?: string
}

export function ListPaginationBar({
  pagina,
  totalPaginas,
  totalElementos,
  tamanoPagina,
  deshabilitado = false,
  etiquetaElemento = "resultados",
  onPaginaAnterior,
  onPaginaSiguiente,
  onCambiarTamanoPagina,
  opcionesTamanoPagina,
  className,
}: ListPaginationBarProps) {
  const desde = totalElementos === 0 ? 0 : (pagina - 1) * tamanoPagina + 1
  const hasta = Math.min(pagina * tamanoPagina, totalElementos)
  const puedeAnterior = pagina > 1 && !deshabilitado
  const puedeSiguiente = pagina < totalPaginas && !deshabilitado

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      role="navigation"
      aria-label="Paginación"
    >
      <p className="text-xs text-muted-foreground sm:text-sm">
        {totalElementos === 0 ? (
          <>Sin {etiquetaElemento}</>
        ) : (
          <>
            Mostrando{" "}
            <span className="font-medium text-foreground">
              {desde}–{hasta}
            </span>{" "}
            de{" "}
            <span className="font-medium text-foreground">{totalElementos}</span>{" "}
            {etiquetaElemento}
            {totalPaginas > 1 ? (
              <>
                {" "}
                · Página{" "}
                <span className="font-medium text-foreground">{pagina}</span> de{" "}
                <span className="font-medium text-foreground">{totalPaginas}</span>
              </>
            ) : null}
          </>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {onCambiarTamanoPagina !== undefined &&
        opcionesTamanoPagina !== undefined &&
        opcionesTamanoPagina.length > 0 ? (
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="whitespace-nowrap">Por página</span>
            <select
              className={cn(
                "h-9 rounded-lg border border-border/80 bg-background px-2 text-sm text-foreground shadow-sm",
                "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              )}
              value={String(tamanoPagina)}
              disabled={deshabilitado}
              onChange={(e) => {
                onCambiarTamanoPagina(Number(e.target.value))
              }}
              aria-label="Tamaño de página"
            >
              {opcionesTamanoPagina.map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1 rounded-xl"
            disabled={!puedeAnterior}
            onClick={onPaginaAnterior}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1 rounded-xl"
            disabled={!puedeSiguiente}
            onClick={onPaginaSiguiente}
            aria-label="Página siguiente"
          >
            Siguiente
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  )
}
