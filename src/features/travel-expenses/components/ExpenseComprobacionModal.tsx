import { useCallback, useEffect, useRef, useState } from "react"
import { FileText, Receipt, Ticket, X } from "lucide-react"

import { showAppToast } from "@/components/app-toast"
import { Button } from "@/components/ui/button"
import { ExpenseFacturaComprobacionForm } from "@/features/travel-expenses/components/ExpenseFacturaComprobacionForm"
import { ExpenseTicketComprobacionForm } from "@/features/travel-expenses/components/ExpenseTicketComprobacionForm"
import {
  formatearFechaCorta,
  formatearMonedaViatico,
} from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"
import { cn } from "@/lib/utils"

const DURACION_MODAL_MS = 480
const EASE_MODAL = "cubic-bezier(0.22, 1, 0.36, 1)"

export type ExpenseTipoComprobante = "factura" | "ticket"

interface ExpenseComprobacionModalProps {
  movimiento: ExpenseMovimiento | null
  viaje: ExpenseViajeResumen | null
  nombreResponsable: string
  onCerrar: () => void
  onComprobacionRegistrada: () => void
}

export function ExpenseComprobacionModal({
  movimiento,
  viaje,
  nombreResponsable,
  onCerrar,
  onComprobacionRegistrada,
}: ExpenseComprobacionModalProps) {
  const [paso, setPaso] = useState<"tipo" | "ticket" | "factura">("tipo")
  const [subiendoArchivos, setSubiendoArchivos] = useState(false)
  const [nonceVolverTipo, setNonceVolverTipo] = useState(0)
  const [entradaActiva, setEntradaActiva] = useState(false)
  const [saliendo, setSaliendo] = useState(false)
  const salidaCompletadaRef = useRef(false)

  useEffect(() => {
    if (movimiento === null || viaje === null) {
      return
    }
    let cancelado = false
    const marco1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelado) {
          setEntradaActiva(true)
        }
      })
    })
    return () => {
      cancelado = true
      cancelAnimationFrame(marco1)
    }
    // Solo al abrir otro movimiento/viaje (identificadores), no a cada render del objeto.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps intencionales: ids estables
  }, [movimiento?.id, viaje?.id])

  const cerrarConAnimacion = useCallback((): void => {
    if (subiendoArchivos) {
      return
    }
    setSaliendo((prev) => {
      if (prev) {
        return prev
      }
      salidaCompletadaRef.current = false
      return true
    })
  }, [subiendoArchivos])

  function finalizarSalidaSiCorresponde(event: React.TransitionEvent<HTMLDivElement>): void {
    if (!saliendo || salidaCompletadaRef.current) {
      return
    }
    if (event.target !== event.currentTarget) {
      return
    }
    if (event.propertyName !== "opacity") {
      return
    }
    salidaCompletadaRef.current = true
    onCerrar()
  }

  useEffect(() => {
    if (movimiento === null) {
      return
    }
    function handleEscape(event: KeyboardEvent): void {
      if (event.key !== "Escape") {
        return
      }
      if (subiendoArchivos) {
        return
      }
      if (paso === "ticket" || paso === "factura") {
        setNonceVolverTipo((n) => n + 1)
        setPaso("tipo")
        return
      }
      cerrarConAnimacion()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [movimiento, paso, cerrarConAnimacion, subiendoArchivos])

  useEffect(() => {
    if (!saliendo) {
      return
    }
    const respaldo = window.setTimeout(() => {
      if (!salidaCompletadaRef.current) {
        salidaCompletadaRef.current = true
        onCerrar()
      }
    }, DURACION_MODAL_MS + 120)
    return () => window.clearTimeout(respaldo)
  }, [saliendo, onCerrar])

  if (movimiento === null || viaje === null) {
    return null
  }

  const nombre = nombreResponsable.trim() !== "" ? nombreResponsable : "Usuario"

  const tituloAria =
    paso === "tipo"
      ? "titulo-comprobar-movimiento"
      : paso === "ticket"
        ? "titulo-comprobar-ticket"
        : "titulo-comprobar-factura"

  const modalVisible = entradaActiva && !saliendo

  return (
    <div
      className={cn(
        "fixed inset-0 z-120 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md",
        "transition-[opacity] ease-out",
        modalVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transitionDuration: `${DURACION_MODAL_MS}ms`,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloAria}
      onTransitionEnd={finalizarSalidaSiCorresponde}
      onClick={() => {
        if (subiendoArchivos) {
          return
        }
        if (paso === "ticket" || paso === "factura") {
          setNonceVolverTipo((n) => n + 1)
          setPaso("tipo")
        } else {
          cerrarConAnimacion()
        }
      }}
    >
      <div
        className={cn(
          "w-full rounded-3xl border-2 border-border/70 bg-card p-6 shadow-2xl ring-1 ring-border/40",
          "transition-[max-width,transform,opacity] will-change-[max-width,transform,opacity]",
          paso === "tipo" ? "max-w-md sm:max-w-lg" : "max-w-2xl",
          modalVisible ? "scale-100 translate-y-0 opacity-100" : "scale-[0.96] translate-y-4 opacity-0"
        )}
        style={{
          transitionDuration: `${DURACION_MODAL_MS}ms`,
          transitionTimingFunction: EASE_MODAL,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {paso === "tipo" ? (
          <div
            key={`tipo-${nonceVolverTipo}`}
            className={cn(nonceVolverTipo > 0 && "animate-travel-modal-step-in")}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
                  <Receipt className="h-6 w-6 text-white" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3
                    id="titulo-comprobar-movimiento"
                    className="text-lg font-semibold text-foreground"
                  >
                    Comprobar movimiento
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ¿Comprobarás con factura o con ticket?
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-xl"
                onClick={cerrarConAnimacion}
                aria-label="Cerrar"
                disabled={subiendoArchivos}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-4 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm">
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                {movimiento.numeroMovimiento}
              </p>
              <p className="mt-1 line-clamp-2 font-medium text-foreground">
                {movimiento.descripcion}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{formatearFechaCorta(movimiento.fecha)}</span>
                <span className="font-semibold text-accent">
                  {formatearMonedaViatico(movimiento.gasto)}
                </span>
              </div>
            </div>

            <p className="mb-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Elige el tipo de comprobante
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaso("factura")}
                disabled={subiendoArchivos}
                className={cn(
                  "group flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-border/70 bg-linear-to-br from-card to-secondary/20 p-5 text-center shadow-md transition-all duration-300",
                  "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  <FileText className="h-6 w-6" aria-hidden />
                </div>
                <span className="font-semibold text-foreground">Factura</span>
                <span className="text-xs leading-snug text-muted-foreground">
                  CFDI (XML + PDF)
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPaso("ticket")}
                disabled={subiendoArchivos}
                className={cn(
                  "group flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-border/70 bg-linear-to-br from-card to-secondary/20 p-5 text-center shadow-md transition-all duration-300",
                  "hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-105">
                  <Ticket className="h-6 w-6" aria-hidden />
                </div>
                <span className="font-semibold text-foreground">Ticket</span>
                <span className="text-xs leading-snug text-muted-foreground">
                  Nota o ticket de compra
                </span>
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-5 w-full cursor-pointer rounded-2xl"
              onClick={cerrarConAnimacion}
              disabled={subiendoArchivos}
            >
              Cancelar
            </Button>
          </div>
        ) : paso === "ticket" ? (
          <div className="relative animate-travel-modal-step-in min-h-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -top-1 -right-1 z-10 h-9 w-9 rounded-xl"
              onClick={cerrarConAnimacion}
              aria-label="Cerrar"
              disabled={subiendoArchivos}
            >
              <X className="h-4 w-4" />
            </Button>
            <ExpenseTicketComprobacionForm
              key={movimiento.id}
              movimiento={movimiento}
              viaje={viaje}
              nombreResponsable={nombre}
              onVolver={() => {
                if (subiendoArchivos) {
                  return
                }
                setNonceVolverTipo((n) => n + 1)
                setPaso("tipo")
              }}
              onCambioSubiendo={setSubiendoArchivos}
              onExito={() => {
                showAppToast("Comprobación con ticket enviada correctamente.", "success")
                onComprobacionRegistrada()
                cerrarConAnimacion()
              }}
            />
          </div>
        ) : (
          <div className="relative animate-travel-modal-step-in min-h-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -top-1 -right-1 z-10 h-9 w-9 rounded-xl"
              onClick={cerrarConAnimacion}
              aria-label="Cerrar"
              disabled={subiendoArchivos}
            >
              <X className="h-4 w-4" />
            </Button>
            <ExpenseFacturaComprobacionForm
              key={movimiento.id}
              movimiento={movimiento}
              viaje={viaje}
              nombreResponsable={nombre}
              onVolver={() => {
                if (subiendoArchivos) {
                  return
                }
                setNonceVolverTipo((n) => n + 1)
                setPaso("tipo")
              }}
              onCambioSubiendo={setSubiendoArchivos}
              onExito={() => {
                showAppToast("Comprobación con factura enviada correctamente.", "success")
                onComprobacionRegistrada()
                cerrarConAnimacion()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
