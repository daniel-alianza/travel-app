import type { Dispatch, SetStateAction } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DispersionPillSelect } from "@/features/dispersion-travel/components/DispersionPillSelect"
import { OPCIONES_FILTRO_AVISOS_DISPERSION_VIATICOS } from "@/features/iam/interfaces/iam-constants"
import type {
  FiltroAvisosDispersionViaticosIam,
  OpcionFiltroIam,
} from "@/features/iam/interfaces/iam-domain.interface"
import { cn } from "@/lib/utils"

type IamSearchFiltersProps = {
  textoBusqueda: string
  setTextoBusqueda: Dispatch<SetStateAction<string>>
  cargandoInicial: boolean
  actualizandoLista: boolean
  filtroArea: string
  setFiltroArea: Dispatch<SetStateAction<string>>
  opcionesArea: OpcionFiltroIam[]
  filtroSucursal: string
  setFiltroSucursal: Dispatch<SetStateAction<string>>
  opcionesSucursal: OpcionFiltroIam[]
  filtroRol: string
  setFiltroRol: Dispatch<SetStateAction<string>>
  opcionesRol: OpcionFiltroIam[]
  filtroAvisosDispersionViaticos: FiltroAvisosDispersionViaticosIam
  setFiltroAvisosDispersionViaticos: Dispatch<
    SetStateAction<FiltroAvisosDispersionViaticosIam>
  >
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
  filtroSucursal,
  setFiltroSucursal,
  opcionesSucursal,
  filtroRol,
  setFiltroRol,
  opcionesRol,
  filtroAvisosDispersionViaticos,
  setFiltroAvisosDispersionViaticos,
  dropdownPillAbierto,
  setDropdownPillAbierto,
}: IamSearchFiltersProps) {
  const deshabilitado = cargandoInicial || actualizandoLista
  const opcionesAvisosDispersion: OpcionFiltroIam[] =
    OPCIONES_FILTRO_AVISOS_DISPERSION_VIATICOS.map((opcion) => ({
      value: opcion.value,
      label: opcion.label,
    }))

  return (
    <div
      className={cn(
        "relative z-30 mb-6 space-y-4 rounded-2xl border border-border/50 bg-card/30 p-4 shadow-md shadow-black/5 backdrop-blur-md transition-all duration-300",
        "hover:border-primary/15 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <div className="relative max-w-xl min-w-0">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={textoBusqueda}
          onChange={(e) => {
            setTextoBusqueda(e.target.value)
          }}
          placeholder="Buscar por: nombre o correo electrónico"
          disabled={deshabilitado}
          className="h-11 cursor-text rounded-xl border-border/70 bg-background/80 pr-4 pl-10 shadow-inner transition-all focus-visible:ring-primary/30"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            Sucursal
          </Label>
          <DispersionPillSelect
            instanceId="iam-filter-sucursal"
            value={filtroSucursal}
            options={opcionesSucursal}
            onChange={(v) => {
              setFiltroSucursal(v)
            }}
            placeholder="Todas las sucursales"
            disabled={deshabilitado}
            dropdownOpen={dropdownPillAbierto}
            setDropdownOpen={setDropdownPillAbierto}
            ariaLabel="Filtrar por sucursal"
          />
        </div>
        <div className="space-y-2">
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
        <div className="space-y-2 sm:col-span-2 xl:col-span-1">
          <Label className="text-sm font-medium text-foreground">
            Avisos viáticos
          </Label>
          <DispersionPillSelect
            instanceId="iam-filter-avisos-dispersion-viaticos"
            value={filtroAvisosDispersionViaticos}
            options={opcionesAvisosDispersion}
            onChange={(v) => {
              setFiltroAvisosDispersionViaticos(v as FiltroAvisosDispersionViaticosIam)
            }}
            placeholder="Todos los avisos"
            disabled={deshabilitado}
            dropdownOpen={dropdownPillAbierto}
            setDropdownOpen={setDropdownPillAbierto}
            ariaLabel="Filtrar por avisos de dispersión de viáticos"
          />
        </div>
      </div>
    </div>
  )
}
