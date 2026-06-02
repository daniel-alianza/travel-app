import { Dialog } from "radix-ui"
import { ChevronRight, Fuel, X } from "lucide-react"

import { HOME_FUEL_MODULE_OPTIONS } from "@/features/home/constants/home-fuel-module-options"
import type { HomeFuelModuleOption } from "@/features/home/interfaces/home-fuel-module-option.interface"
import { cn } from "@/lib/utils"

interface HomeFuelModuleModalProps {
  abierto: boolean
  onAbiertoChange: (abierto: boolean) => void
  onSeleccionarOpcion: (opcion: HomeFuelModuleOption) => void
}

export function HomeFuelModuleModal({
  abierto,
  onAbiertoChange,
  onSeleccionarOpcion,
}: HomeFuelModuleModalProps) {
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
            "fixed top-1/2 left-1/2 z-50 flex max-h-[min(90vh,640px)] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl duration-200",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          <Dialog.Title className="sr-only">Módulo de gasolina</Dialog.Title>
          <Dialog.Description className="sr-only">
            Selecciona una opción del módulo de gasolina.
          </Dialog.Description>

          <div className="flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
                <Fuel className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Combustible
                </p>
                <h3 className="font-(family-name:--font-heading) mt-1 text-lg font-semibold tracking-tight text-foreground">
                  Módulo de gasolina
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Elige la sección que deseas abrir.
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

          <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            <ul className="grid grid-cols-1 gap-2 sm:gap-2.5">
              {HOME_FUEL_MODULE_OPTIONS.map((opcion) => (
                <li key={opcion.id}>
                  <button
                    type="button"
                    onClick={() => onSeleccionarOpcion(opcion)}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-border/50 bg-background/50 p-3.5 text-left transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5 hover:shadow-md sm:gap-4 sm:p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 transition-colors duration-300 group-hover:bg-orange-500/20 sm:h-11 sm:w-11">
                      <opcion.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground transition-colors duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                        {opcion.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {opcion.description}
                      </p>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/80 transition-all duration-300 group-hover:bg-orange-500 group-hover:shadow-md group-hover:shadow-orange-500/20">
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
