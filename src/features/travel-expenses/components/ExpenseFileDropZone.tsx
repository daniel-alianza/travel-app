import { useCallback, useRef, useState } from "react"
import { FileUp, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExpenseFileDropZoneProps {
  inputId: string
  accept: string
  textoArrastrar: string
  textoAyuda: string
  etiquetaBoton: string
  nombreArchivo: string | null
  error?: boolean
  compacto?: boolean
  multiple?: boolean
  onArchivoElegido?: (archivo: File) => void
  onArchivosElegidos?: (archivos: File[]) => void
  onQuitarArchivo?: () => void
}

export function ExpenseFileDropZone({
  inputId,
  accept,
  textoArrastrar,
  textoAyuda,
  etiquetaBoton,
  nombreArchivo,
  error,
  compacto = false,
  multiple = false,
  onArchivoElegido,
  onArchivosElegidos,
  onQuitarArchivo,
}: ExpenseFileDropZoneProps) {
  const contadorEntrada = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [zonaActiva, setZonaActiva] = useState(false)

  const finalizarArrastre = useCallback(() => {
    contadorEntrada.current = 0
    setZonaActiva(false)
  }, [])

  function manejarEntradaArrastre(event: React.DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    contadorEntrada.current += 1
    setZonaActiva(true)
  }

  function manejarSalidaArrastre(event: React.DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    contadorEntrada.current -= 1
    if (contadorEntrada.current <= 0) {
      contadorEntrada.current = 0
      setZonaActiva(false)
    }
  }

  function manejarArrastreSobre(event: React.DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = "copy"
  }

  function manejarSoltar(event: React.DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    finalizarArrastre()
    const lista = event.dataTransfer.files
    if (!lista || lista.length === 0) {
      return
    }
    if (multiple && onArchivosElegidos) {
      onArchivosElegidos(Array.from(lista))
      return
    }
    const archivo = lista[0]
    if (archivo && onArchivoElegido) {
      onArchivoElegido(archivo)
    }
  }

  function manejarCambioInput(event: React.ChangeEvent<HTMLInputElement>): void {
    const lista = event.target.files
    if (!lista || lista.length === 0) {
      return
    }
    if (multiple && onArchivosElegidos) {
      onArchivosElegidos(Array.from(lista))
      return
    }
    const archivo = lista[0]
    if (archivo && onArchivoElegido) {
      onArchivoElegido(archivo)
    }
  }

  function manejarQuitarArchivo(): void {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onQuitarArchivo?.()
  }

  return (
    <div
      role="region"
      aria-label={textoArrastrar}
      onDragEnter={manejarEntradaArrastre}
      onDragLeave={manejarSalidaArrastre}
      onDragOver={manejarArrastreSobre}
      onDrop={manejarSoltar}
      className={cn(
        "relative rounded-2xl border-2 border-dashed bg-background/50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        compacto ? "p-3" : "p-4",
        zonaActiva && "scale-[1.01] border-primary/60 bg-primary/8 shadow-md",
        error ? "border-destructive/50" : "border-border/80",
        !error && !zonaActiva && "hover:border-primary/35"
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={manejarCambioInput}
      />
      <div
        className={cn(
          "flex flex-col gap-3 text-center",
          !compacto && "sm:flex-row sm:text-left"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 justify-center",
            compacto ? "sm:justify-start" : "sm:justify-start"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-colors",
              zonaActiva && "bg-primary/15 text-primary",
              compacto ? "h-10 w-10" : "h-12 w-12"
            )}
          >
            <FileUp className={compacto ? "h-5 w-5" : "h-7 w-7"} aria-hidden />
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">{textoArrastrar}</p>
          <p className="text-xs text-muted-foreground">{textoAyuda}</p>
          <Button
            type="button"
            variant="outline"
            size={compacto ? "sm" : "default"}
            className="cursor-pointer rounded-xl"
            onClick={() => inputRef.current?.click()}
          >
            {etiquetaBoton}
          </Button>
        </div>
      </div>
      {nombreArchivo ? (
        <div className="mt-3 flex items-start gap-2 border-t border-border/40 pt-3">
          <p className="min-w-0 flex-1 text-left text-xs text-foreground break-all">
            {nombreArchivo}
          </p>
          {onQuitarArchivo ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
              onClick={manejarQuitarArchivo}
              aria-label="Quitar archivo"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
