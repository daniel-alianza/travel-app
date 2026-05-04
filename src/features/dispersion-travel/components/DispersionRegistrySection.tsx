import type { RefObject } from "react"
import { CalendarRange, Loader2 } from "lucide-react"

import { ListPaginationBar } from "@/components/list-pagination-bar"
import { DispersionDataTable } from "@/features/dispersion-travel/components/DispersionDataTable"
import { DispersionToolbar } from "@/features/dispersion-travel/components/DispersionToolbar"
import type { FilaDispersion } from "@/features/dispersion-travel/interfaces/dispersion-fila.interface"

interface DispersionRegistrySectionProps {
  cargaInicial: boolean
  filas: FilaDispersion[]
  totalFilasRegistro: number
  pagina: number
  totalPaginas: number
  tamanoPagina: number
  opcionesTamanoPagina: readonly number[]
  onPaginaAnterior: () => void
  onPaginaSiguiente: () => void
  onCambiarTamanoPagina: (tamano: number) => void
  seleccionEfectiva: Set<number>
  cantidadSeleccionadas: number
  todasSeleccionadas: boolean
  ocupado: boolean
  accionCargando: string | null
  dropdownPillAbierto: string | null
  setDropdownPillAbierto: (id: string | null) => void
  selectAllRef: RefObject<HTMLInputElement | null>
  onSeleccionarPaginaActual: () => void
  onQuitarSeleccion: () => void
  onAplicarAjustesMontos: () => void
  onDispersarSeleccionadas: () => void
  onRechazarSeleccionadas: () => void
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

export function DispersionRegistrySection({
  cargaInicial,
  filas,
  totalFilasRegistro,
  pagina,
  totalPaginas,
  tamanoPagina,
  opcionesTamanoPagina,
  onPaginaAnterior,
  onPaginaSiguiente,
  onCambiarTamanoPagina,
  seleccionEfectiva,
  cantidadSeleccionadas,
  todasSeleccionadas,
  ocupado,
  accionCargando,
  dropdownPillAbierto,
  setDropdownPillAbierto,
  selectAllRef,
  onSeleccionarPaginaActual,
  onQuitarSeleccion,
  onAplicarAjustesMontos,
  onDispersarSeleccionadas,
  onRechazarSeleccionadas,
  alternarSeleccionarTodas,
  alternarSeleccion,
  actualizarFila,
  convertirAbsolutoADeltaEnFila,
  dispersarPorIds,
  abrirModalRechazo,
}: DispersionRegistrySectionProps) {
  if (cargaInicial) {
    return (
      <section className="group/card rounded-3xl border-2 border-border/70 bg-linear-to-br from-card/95 via-card/80 to-card/70 p-4 shadow-xl shadow-primary/10 backdrop-blur-md transition-all delay-100 duration-700 ease-out hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/15 sm:p-6">
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Loader2
            className="h-9 w-9 shrink-0 animate-spin text-primary"
            aria-hidden
          />
          <p className="text-sm font-medium">
            Cargando solicitudes aprobadas…
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="group/card rounded-3xl border-2 border-border/70 bg-linear-to-br from-card/95 via-card/80 to-card/70 p-4 shadow-xl shadow-primary/10 backdrop-blur-md transition-all delay-100 duration-700 ease-out hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/15 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover/card:scale-105">
          <CalendarRange className="h-5 w-5 text-primary transition-transform duration-500 group-hover/card:rotate-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground">
            Registro de dispersión
          </h2>
          <p className="text-sm text-muted-foreground">
            Marca las solicitudes, usa acciones masivas o por fila
          </p>
        </div>
      </div>

      <DispersionToolbar
        filasCount={totalFilasRegistro}
        cantidadSeleccionadas={cantidadSeleccionadas}
        ocupado={ocupado}
        accionCargandoAplicar={accionCargando === "aplicar"}
        accionCargandoDispersarMasivo={accionCargando === "dispersar-masivo"}
        onSeleccionarPaginaActual={onSeleccionarPaginaActual}
        onQuitarSeleccion={onQuitarSeleccion}
        onAplicarAjustesMontos={onAplicarAjustesMontos}
        onDispersarSeleccionadas={onDispersarSeleccionadas}
        onRechazarSeleccionadas={onRechazarSeleccionadas}
      />

      <DispersionDataTable
        filas={filas}
        seleccionEfectiva={seleccionEfectiva}
        ocupado={ocupado}
        accionCargando={accionCargando}
        dropdownPillAbierto={dropdownPillAbierto}
        setDropdownPillAbierto={setDropdownPillAbierto}
        selectAllRef={selectAllRef}
        todasSeleccionadas={todasSeleccionadas}
        alternarSeleccionarTodas={alternarSeleccionarTodas}
        alternarSeleccion={alternarSeleccion}
        actualizarFila={actualizarFila}
        convertirAbsolutoADeltaEnFila={convertirAbsolutoADeltaEnFila}
        dispersarPorIds={dispersarPorIds}
        abrirModalRechazo={abrirModalRechazo}
      />

      {totalFilasRegistro > 0 && (
        <ListPaginationBar
          className="mt-4"
          pagina={pagina}
          totalPaginas={totalPaginas}
          totalElementos={totalFilasRegistro}
          tamanoPagina={tamanoPagina}
          deshabilitado={ocupado}
          etiquetaElemento="solicitudes"
          onPaginaAnterior={onPaginaAnterior}
          onPaginaSiguiente={onPaginaSiguiente}
          onCambiarTamanoPagina={onCambiarTamanoPagina}
          opcionesTamanoPagina={opcionesTamanoPagina}
        />
      )}

      {totalFilasRegistro === 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No hay solicitudes pendientes de dispersión.
        </p>
      )}
    </section>
  )
}
