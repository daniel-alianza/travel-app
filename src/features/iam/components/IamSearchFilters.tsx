import type { Dispatch, SetStateAction } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DispersionPillSelect } from "@/features/dispersion-travel/components/DispersionPillSelect"
import type { OpcionFiltroIam } from "@/features/iam/interfaces/iam-domain.interface"
import { cn } from "@/lib/utils"

type IamSearchFiltersProps = {
  textoBusqueda: string
  setTextoBusqueda: Dispatch<SetStateAction<string>>
  cargandoInicial: boolean
  actualizandoLista: boolean
  filtroArea: string
  setFiltroArea: Dispatch<SetStateAction<string>>
  opcionesArea: OpcionFiltroIam[]
  filtroDepartamento: string
  setFiltroDepartamento: Dispatch<SetStateAction<string>>
  opcionesDepartamento: OpcionFiltroIam[]
  filtroRol: string
  setFiltroRol: Dispatch<SetStateAction<string>>
  opcionesRol: OpcionFiltroIam[]
  dropdownPillAbierto: string | null
  setDropdownPillAbierto: Dispatch<SetStateAction<string | null>>
}

export function IamSearchFilters({
  textoBusqueda,
  setTextoBusqueda,
  cargandoInicial,
  actualizandoLista,
  filtroArea,
  setFiltroArea,
  opcionesArea,
  filtroDepartamento,
  setFiltroDepartamento,
  opcionesDepartamento,
  filtroRol,
  setFiltroRol,
  opcionesRol,
  dropdownPillAbierto,
  setDropdownPillAbierto,
}: IamSearchFiltersProps) {
  const deshabilitado = cargandoInicial || actualizandoLista

  return (
    <div
      className={cn(
        "mb-6 space-y-4 rounded-2xl border border-border/50 bg-card/30 p-4 shadow-md shadow-black/5 backdrop-blur-md transition-all duration-300",
        "hover:border-primary/15 hover:shadow-lg hover:shadow-primary/5",
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative min-w-0 max-w-xl flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={textoBusqueda}
            onChange={(e) => {
              setTextoBusqueda(e.target.value)
            }}
            placeholder="Buscar por nombre, correo, área, departamento, rol…"
            disabled={deshabilitado}
            className="h-11 cursor-text rounded-xl border-border/70 bg-background/80 pl-10 pr-4 shadow-inner transition-all focus-visible:ring-primary/30"
          />
        </div>
        <p className="text-xs text-muted-foreground lg:max-w-xs lg:text-right">
          Paginación preparada para respuesta tipo{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[0.7rem] text-foreground">
            ListaPaginada&lt;UsuarioIam&gt;
          </code>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Área</Label>
          <DispersionPillSelect
            instanceId="iam-filter-area"
            value={filtroArea}
            options={opcionesArea}
            onChange={(v) => {
              setFiltroArea(v)
            }}
            placeholder="Todas las áreas"
            disabled={deshabilitado}
            dropdownOpen={dropdownPillAbierto}
            setDropdownOpen={setDropdownPillAbierto}
            ariaLabel="Filtrar por área"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Departamento
          </Label>
          <DispersionPillSelect
            instanceId="iam-filter-depto"
            value={filtroDepartamento}
            options={opcionesDepartamento}
            onChange={(v) => {
              setFiltroDepartamento(v)
            }}
            placeholder="Todos los departamentos"
            disabled={deshabilitado}
            dropdownOpen={dropdownPillAbierto}
            setDropdownOpen={setDropdownPillAbierto}
            ariaLabel="Filtrar por departamento"
          />
        </div>
        <div className="space-y-2 sm:col-span-2 xl:col-span-1">
          <Label className="text-sm font-medium text-foreground">Rol</Label>
          <DispersionPillSelect
            instanceId="iam-filter-rol"
            value={filtroRol}
            options={opcionesRol}
            onChange={(v) => {
              setFiltroRol(v)
            }}
            placeholder="Todos los roles"
            disabled={deshabilitado}
            dropdownOpen={dropdownPillAbierto}
            setDropdownOpen={setDropdownPillAbierto}
            ariaLabel="Filtrar por rol"
          />
        </div>
      </div>
    </div>
  )
}
