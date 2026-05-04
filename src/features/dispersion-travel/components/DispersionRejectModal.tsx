import { Loader2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DISPERSION_BUTTON_INTERACTIVE_CLASS } from "@/features/dispersion-travel/hooks/dispersion-page-helpers"
import { cn } from "@/lib/utils"

interface DispersionRejectModalProps {
  comentarioRechazo: string
  puedeConfirmarRechazo: boolean
  accionCargandoRechazoModal: boolean
  onComentarioChange: (value: string) => void
  onCerrar: () => void
  onConfirmar: () => void
}

export function DispersionRejectModal({
  comentarioRechazo,
  puedeConfirmarRechazo,
  accionCargandoRechazoModal,
  onComentarioChange,
  onCerrar,
  onConfirmar,
}: DispersionRejectModalProps) {
  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-rechazo-dispersion"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-lg scale-100 rounded-3xl border-2 border-border/70 bg-card p-6 shadow-2xl ring-1 ring-border/40 transition-all duration-300 ease-out hover:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="titulo-rechazo-dispersion"
          className="text-lg font-semibold text-foreground"
        >
          Rechazar dispersión
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Indica el motivo. Es obligatorio para rechazar; al dispersar no se
          requiere comentario.
        </p>
        <div className="mt-4 space-y-2">
          <Label
            htmlFor="comentario-rechazo-dispersion"
            className="text-foreground"
          >
            Comentario
          </Label>
          <Textarea
            id="comentario-rechazo-dispersion"
            value={comentarioRechazo}
            onChange={(e) => onComentarioChange(e.target.value)}
            placeholder="Describe el motivo del rechazo…"
            rows={4}
            required
            aria-required
            disabled={accionCargandoRechazoModal}
            className="min-h-24 rounded-2xl border-2 bg-background/80 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed"
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className={cn("rounded-2xl", DISPERSION_BUTTON_INTERACTIVE_CLASS)}
            disabled={accionCargandoRechazoModal}
            onClick={onCerrar}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className={cn("group rounded-2xl", DISPERSION_BUTTON_INTERACTIVE_CLASS)}
            disabled={
              !puedeConfirmarRechazo || accionCargandoRechazoModal
            }
            title={
              puedeConfirmarRechazo
                ? undefined
                : "Escribe al menos un carácter en el comentario"
            }
            onClick={onConfirmar}
          >
            {accionCargandoRechazoModal ? (
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
            ) : (
              <XCircle className="mr-2 size-4 transition-transform duration-300 group-hover:rotate-12" />
            )}
            {accionCargandoRechazoModal
              ? "Procesando…"
              : "Confirmar rechazo"}
          </Button>
        </div>
      </div>
    </div>
  )
}
