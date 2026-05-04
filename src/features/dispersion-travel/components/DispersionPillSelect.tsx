import { useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface OpcionPillSelect {
  value: string
  label: string
}

interface DispersionPillSelectProps {
  instanceId: string
  value: string
  options: ReadonlyArray<OpcionPillSelect>
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  dropdownOpen: string | null
  setDropdownOpen: (id: string | null) => void
  ariaLabel: string
}

export function DispersionPillSelect({
  instanceId,
  value,
  options,
  onChange,
  placeholder = "Seleccionar",
  disabled = false,
  dropdownOpen,
  setDropdownOpen,
  ariaLabel,
}: DispersionPillSelectProps) {
  const abierto = dropdownOpen === instanceId
  const contenedorRef = useRef<HTMLDivElement>(null)

  const etiquetaSeleccionada = options.find((o) => o.value === value)?.label

  useEffect(() => {
    if (!abierto) {
      return
    }
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setDropdownOpen(null)
      }
    }
    function handlePointerDown(event: PointerEvent): void {
      const nodo = contenedorRef.current
      if (nodo && !nodo.contains(event.target as Node)) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener("keydown", handleEscape)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [abierto, setDropdownOpen])

  return (
    <div ref={contenedorRef} className="relative w-full min-w-40">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={abierto}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={() =>
          setDropdownOpen(abierto ? null : instanceId)
        }
        className={cn(
          "group flex h-11 w-full cursor-pointer items-center justify-between rounded-full border border-primary bg-background px-4 text-left text-sm transition-all duration-300",
          "shadow-sm",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:border-primary/80 hover:shadow-md focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none",
          abierto && "border-primary shadow-md ring-2 ring-primary/15"
        )}
      >
        <span
          className={cn(
            "truncate pr-2",
            etiquetaSeleccionada
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          )}
        >
          {etiquetaSeleccionada ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-primary transition-transform duration-300",
            abierto && "-rotate-180"
          )}
          aria-hidden
        />
      </button>

      <div
        role="listbox"
        aria-hidden={!abierto}
        className={cn(
          "absolute top-full left-0 z-50 mt-2 w-full origin-top overflow-hidden rounded-3xl border border-border/80 bg-card py-2 shadow-lg transition-all duration-300",
          abierto
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="max-h-56 overflow-y-auto py-1">
          {options.map((opcion) => {
            const seleccionada = opcion.value === value
            return (
              <button
                key={opcion.value}
                type="button"
                role="option"
                aria-selected={seleccionada}
                onClick={() => {
                  onChange(opcion.value)
                  setDropdownOpen(null)
                }}
                className={cn(
                  "flex w-full items-center justify-center px-6 py-3.5 text-sm transition-colors duration-200",
                  "text-foreground hover:bg-muted/60",
                  seleccionada && "bg-primary/8 font-medium text-primary"
                )}
              >
                {opcion.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
