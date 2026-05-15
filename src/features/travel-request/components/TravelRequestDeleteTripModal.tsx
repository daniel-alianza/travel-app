import { Dialog } from "radix-ui"
import { Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TravelRequestDeleteTripModalProps = {
  readonly abierto: boolean
  readonly onAbiertoChange: (abierto: boolean) => void
  readonly numeroViaje: number
  readonly onConfirmar: () => void
}

export function TravelRequestDeleteTripModal({
  abierto,
  onAbiertoChange,
  numeroViaje,
  onConfirmar,
}: TravelRequestDeleteTripModalProps) {
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
            "fixed top-1/2 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl duration-200",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          <Dialog.Title className="sr-only">
            Confirmar eliminación del viaje {numeroViaje}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Los datos capturados en este viaje se perderán de forma permanente.
          </Dialog.Description>

          <div className="flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Viaje {numeroViaje}
                </p>
                <h3 className="font-(family-name:--font-heading) mt-1 text-lg font-semibold tracking-tight text-foreground">
                  ¿Eliminar este viaje?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Se borrarán destino, fechas, gastos estimados, objetivos y
                  opciones de gasolina o TAG capturados en este bloque. Esta
                  acción no se puede deshacer.
                </p>
              </div>
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

          <div className="flex flex-col gap-2 border-t border-border/50 bg-muted/15 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full cursor-pointer rounded-2xl border-2 sm:w-auto"
              >
                Conservar viaje
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              variant="destructive"
              className="h-11 w-full cursor-pointer rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              onClick={() => {
                onConfirmar()
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />
              Sí, eliminar
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
