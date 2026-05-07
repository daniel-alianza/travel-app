import { Loader2, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ExpenseConciliacionOverlayProps {
  visible: boolean
  cargando: boolean
  mensaje: string
  codigo: string
  error: string | null
  codigoDemo: string | null
  onChangeCodigo: (codigo: string) => void
  onConfirmar: () => void
  onCerrar: () => void
}

export function ExpenseConciliacionOverlay({
  visible,
  cargando,
  mensaje,
  codigo,
  error,
  codigoDemo,
  onChangeCodigo,
  onConfirmar,
  onCerrar,
}: ExpenseConciliacionOverlayProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-130 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
        {cargando ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden
            />
            <p className="text-sm text-muted-foreground">
              Generando solicitud de conciliación...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-primary/10 p-2.5">
                <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {mensaje}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="codigo-conciliacion"
                className="text-sm font-medium text-foreground"
              >
                Código de verificación
              </label>
              <Input
                id="codigo-conciliacion"
                value={codigo}
                onChange={(event) => onChangeCodigo(event.target.value)}
                placeholder="Ingresa el código"
                autoComplete="off"
                className="h-11 rounded-2xl"
              />
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    El código tiene vigencia de 24 horas hábiles, contadas solo
                    conforme a tu horario laboral (no son 24 horas corridas).
                    Por viaje solo puedes solicitar dos códigos; al agotarlos,
                    esta opción deja de estar disponible.
                  </p>
                  {codigoDemo ? (
                    <p className="text-xs text-muted-foreground">
                      Simulación frontend: código demo{" "}
                      <span className="font-semibold">{codigoDemo}</span>
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer rounded-2xl"
                onClick={onCerrar}
              >
                Cerrar
              </Button>
              <Button
                type="button"
                className="cursor-pointer rounded-2xl"
                onClick={onConfirmar}
              >
                Verificar código
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
