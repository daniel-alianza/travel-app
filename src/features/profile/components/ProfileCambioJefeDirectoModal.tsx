import { Search, X } from "lucide-react"
import { Dialog } from "radix-ui"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UsuarioCandidatoJefe } from "@/features/profile/interfaces/usuario-candidato-jefe.interface"
import { cn } from "@/lib/utils"

type ProfileCambioJefeDirectoModalProps = {
  abierto: boolean
  onAbiertoChange: (abierto: boolean) => void
  busquedaCandidatoJefe: string
  onBusquedaCandidatoJefeChange: (valor: string) => void
  candidatosJefeFiltrados: ReadonlyArray<UsuarioCandidatoJefe>
  candidatoJefeSeleccionado: UsuarioCandidatoJefe | null
  onSeleccionarCandidato: (candidato: UsuarioCandidatoJefe) => void
  onConfirmarSeleccion: () => void
}

export function ProfileCambioJefeDirectoModal({
  abierto,
  onAbiertoChange,
  busquedaCandidatoJefe,
  onBusquedaCandidatoJefeChange,
  candidatosJefeFiltrados,
  candidatoJefeSeleccionado,
  onSeleccionarCandidato,
  onConfirmarSeleccion,
}: ProfileCambioJefeDirectoModalProps) {
  return (
    <Dialog.Root open={abierto} onOpenChange={onAbiertoChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-background/80 backdrop-blur-md",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[min(85vh,560px)] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl duration-200",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          <Dialog.Title className="sr-only">
            Seleccionar nuevo jefe directo
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Busca y selecciona al colaborador que será tu nuevo jefe directo.
          </Dialog.Description>
          <div className="flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cambio de reporte
              </p>
              <h3 className="font-(family-name:--font-heading) mt-1 text-lg font-semibold tracking-tight text-foreground">
                Selecciona responsable
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Busca por nombre, correo o área y elige a quien reportarás.
              </p>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="group/close flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-transparent text-muted-foreground transition-all duration-300 hover:border-border hover:bg-muted hover:text-foreground hover:shadow-md"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 transition-transform duration-300 group-hover/close:rotate-90" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-3 px-5 pt-4 sm:px-6">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={busquedaCandidatoJefe}
                onChange={(event) =>
                  onBusquedaCandidatoJefeChange(event.target.value)
                }
                placeholder="Buscar colaborador…"
                className="h-11 cursor-text rounded-2xl border-border/70 bg-background/80 pl-10 pr-3 shadow-sm transition-shadow focus-visible:ring-primary/30"
                autoComplete="off"
              />
            </div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Colaboradores disponibles
            </Label>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-2 sm:px-6">
            <ul className="space-y-2 pb-2" role="listbox">
              {candidatosJefeFiltrados.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                  No hay resultados para tu búsqueda.
                </li>
              ) : (
                candidatosJefeFiltrados.map((candidato) => {
                  const seleccionado =
                    candidatoJefeSeleccionado?.id === candidato.id
                  return (
                    <li key={candidato.id} role="none">
                      <button
                        type="button"
                        role="option"
                        aria-selected={seleccionado}
                        onClick={() => onSeleccionarCandidato(candidato)}
                        className={cn(
                          "group/opt w-full cursor-pointer rounded-2xl border px-4 py-3 text-left shadow-sm transition-all duration-300",
                          seleccionado
                            ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                            : "border-border/60 bg-card/80 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg"
                        )}
                      >
                        <p className="font-medium text-foreground transition-colors group-hover/opt:text-primary">
                          {candidato.nombreCompleto}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {candidato.correo}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {candidato.area}
                        </p>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-2 border-t border-border/50 bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-11 w-full cursor-pointer rounded-2xl sm:w-auto"
              >
                Cancelar
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              className="h-11 w-full cursor-pointer rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              onClick={onConfirmarSeleccion}
            >
              Confirmar selección
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
