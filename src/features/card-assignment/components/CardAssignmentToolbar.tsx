import { Loader2, RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DispersionPillSelect } from "@/features/dispersion-travel/components/DispersionPillSelect"
import { cn } from "@/lib/utils"

interface OpcionFiltro {
  value: string
  label: string
}

interface CardAssignmentToolbarProps {
  textoBusqueda: string
  onTextoBusquedaChange: (valor: string) => void
  filtroCompania: string
  onFiltroCompaniaChange: (valor: string) => void
  filtroArea: string
  onFiltroAreaChange: (valor: string) => void
  opcionesCompania: ReadonlyArray<OpcionFiltro>
  opcionesArea: ReadonlyArray<OpcionFiltro>
  dropdownPillAbierto: string | null
  setDropdownPillAbierto: (id: string | null) => void
  deshabilitado: boolean
  actualizandoLista: boolean
  onRefrescar: () => void
}

export function CardAssignmentToolbar({
  textoBusqueda,
  onTextoBusquedaChange,
  filtroCompania,
  onFiltroCompaniaChange,
  filtroArea,
  onFiltroAreaChange,
  opcionesCompania,
  opcionesArea,
  dropdownPillAbierto,
  setDropdownPillAbierto,
  deshabilitado,
  actualizandoLista,
  onRefrescar,
}: CardAssignmentToolbarProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Label
            htmlFor="card-assignment-search"
            className="text-sm font-medium text-foreground"
          >
            Buscar por nombre o correo
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300"
              aria-hidden
            />
            <Input
              id="card-assignment-search"
              type="search"
              autoComplete="off"
              placeholder="Ej. Ana o ana.martinez@…"
              value={textoBusqueda}
              disabled={deshabilitado}
              onChange={(event) => onTextoBusquedaChange(event.target.value)}
              className={cn(
                "h-12 cursor-text rounded-2xl border-primary/25 bg-background/90 pl-11 shadow-sm transition-all duration-300",
                "placeholder:text-muted-foreground/80",
                "hover:border-primary/40 hover:shadow-md",
                "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              )}
            />
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={deshabilitado}
          onClick={() => onRefrescar()}
          className="group h-12 shrink-0 cursor-pointer rounded-2xl border-primary/30 px-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
        >
          {actualizandoLista ? (
            <Loader2
              className="mr-2 h-4 w-4 shrink-0 animate-spin"
              aria-hidden
            />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4 shrink-0 transition-transform duration-500 group-hover:rotate-180" />
          )}
          Actualizar lista
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-3xl">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Compañía
          </Label>
          <DispersionPillSelect
            instanceId="card-filter-compania"
            value={filtroCompania}
            options={opcionesCompania}
            onChange={onFiltroCompaniaChange}
            placeholder="Todas las compañías"
            disabled={deshabilitado}
            dropdownOpen={dropdownPillAbierto}
            setDropdownOpen={setDropdownPillAbierto}
            ariaLabel="Filtrar por compañía"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Área</Label>
          <DispersionPillSelect
            instanceId="card-filter-area"
            value={filtroArea}
            options={opcionesArea}
            onChange={onFiltroAreaChange}
            placeholder="Todas las áreas"
            disabled={deshabilitado}
            dropdownOpen={dropdownPillAbierto}
            setDropdownOpen={setDropdownPillAbierto}
            ariaLabel="Filtrar por área"
          />
        </div>
      </div>
    </div>
  )
}
