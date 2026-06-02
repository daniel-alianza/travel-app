import { Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { GasolineCommentModalProps } from "@/features/gasoline/interfaces/gasoline-comment-modal-props.interface"
import { cn } from "@/lib/utils"

export function GasolineCommentModal({
  abierto,
  titulo,
  descripcion,
  etiquetaComentario,
  comentario,
  comentarioObligatorio = false,
  confirmarTexto,
  cargando,
  onComentarioChange,
  onCerrar,
  onConfirmar,
}: GasolineCommentModalProps) {
  if (!abierto) {
    return null
  }

  const puedeConfirmar =
    !cargando &&
    (!comentarioObligatorio || comentario.trim().length > 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gasoline-comment-modal-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="gasoline-comment-modal-title"
              className="text-lg font-semibold text-foreground"
            >
              {titulo}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{descripcion}</p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            disabled={cargando}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gasoline-comment-modal-textarea">
            {etiquetaComentario}
            {comentarioObligatorio ? (
              <span className="text-destructive" aria-hidden>
                {" "}
                *
              </span>
            ) : null}
          </Label>
          <Textarea
            id="gasoline-comment-modal-textarea"
            value={comentario}
            onChange={(event) => onComentarioChange(event.target.value)}
            disabled={cargando}
            placeholder="Escribe un comentario…"
            className="min-h-[100px] resize-none rounded-2xl border-2"
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={cargando}
            className="rounded-2xl"
            onClick={onCerrar}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!puedeConfirmar}
            className={cn(
              "rounded-2xl shadow-md shadow-orange-500/15",
              !puedeConfirmar && "opacity-60"
            )}
            onClick={onConfirmar}
          >
            {cargando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando…
              </>
            ) : (
              confirmarTexto
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
