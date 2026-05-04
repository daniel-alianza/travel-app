import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ExpenseComprobacionResumenDatos } from "@/features/travel-expenses/components/ExpenseComprobacionResumenDatos"
import { ExpenseFileDropZone } from "@/features/travel-expenses/components/ExpenseFileDropZone"
import { ExpenseViaticCategorySelect } from "@/features/travel-expenses/components/ExpenseViaticCategorySelect"
import { formatearMonedaViatico } from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"
import {
  expenseTicketComprobacionSchema,
  type ExpenseTicketComprobacionFormValues,
} from "@/features/travel-expenses/schemas/expense-ticket-comprobacion.schema"
import { cn } from "@/lib/utils"

function archivoTicketPermitido(archivo: File): boolean {
  const nombreLower = archivo.name.toLowerCase()
  if (nombreLower.endsWith(".webp") || nombreLower.endsWith(".gif")) {
    return false
  }
  if (archivo.type === "image/webp" || archivo.type === "image/gif") {
    return false
  }
  if (
    archivo.type === "application/pdf" ||
    nombreLower.endsWith(".pdf") ||
    archivo.type === "application/x-pdf"
  ) {
    return true
  }
  if (archivo.type.startsWith("image/")) {
    return true
  }
  return /^.+\.(jpe?g|png|bmp|tiff?|heic|heif|svg|avif|ico)$/i.test(archivo.name)
}

interface ExpenseTicketComprobacionFormProps {
  movimiento: ExpenseMovimiento
  viaje: ExpenseViajeResumen
  nombreResponsable: string
  onVolver: () => void
  onExito: () => void
}

export function ExpenseTicketComprobacionForm({
  movimiento,
  viaje,
  nombreResponsable,
  onVolver,
  onExito,
}: ExpenseTicketComprobacionFormProps) {
  const idBase = useId()
  const idArchivos = `${idBase}-archivos`
  const [errorArchivos, setErrorArchivos] = useState<string | null>(null)
  const [nombreArchivoTicket, setNombreArchivoTicket] = useState<string | null>(null)

  const formulario = useForm<ExpenseTicketComprobacionFormValues>({
    resolver: zodResolver(expenseTicketComprobacionSchema),
    defaultValues: {
      categoriaViatico: "",
      motivo: "",
      descripcion: movimiento.descripcion,
      comentario: "",
    },
  })

  const { register, handleSubmit, formState } = formulario

  function validarArchivoTicket(files: FileList | null): string | null {
    if (files === null || files.length === 0) {
      return "Adjunta una imagen o un PDF."
    }
    if (files.length > 1) {
      return "Solo puedes adjuntar un archivo: una imagen o un PDF."
    }
    const archivo = files.item(0)
    if (!archivo) {
      return "Adjunta una imagen o un PDF."
    }
    if (!archivoTicketPermitido(archivo)) {
      return "Solo PDF o imagen (cualquier formato salvo WebP y GIF)."
    }
    return null
  }

  function onArchivoTicketChange(lista: FileList | null): void {
    const mensaje = validarArchivoTicket(lista)
    setErrorArchivos(mensaje)
    const primero = lista?.item(0)
    if (primero && mensaje === null) {
      setNombreArchivoTicket(primero.name)
    } else {
      setNombreArchivoTicket(null)
    }
  }

  function aplicarArchivoTicket(archivo: File): void {
    const lista = new DataTransfer()
    lista.items.add(archivo)
    onArchivoTicketChange(lista.files)
  }

  function quitarArchivoTicket(): void {
    setErrorArchivos(null)
    setNombreArchivoTicket(null)
  }

  function enviarComprobacionTicket(
    valores: ExpenseTicketComprobacionFormValues
  ): void {
    const entrada = document.getElementById(idArchivos) as HTMLInputElement | null
    const files = entrada?.files ?? null
    const err = validarArchivoTicket(files)
    if (err !== null) {
      setErrorArchivos(err)
      return
    }
    setErrorArchivos(null)
    void valores
    void files
    onExito()
  }

  return (
    <div className="flex max-h-[min(90vh,720px)] flex-col">
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="cursor-pointer rounded-xl"
          onClick={onVolver}
        >
          <ArrowLeft className="mr-1 h-4 w-4" aria-hidden />
          Volver
        </Button>
      </div>

      <div className="mb-4 flex shrink-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Ticket className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 id="titulo-comprobar-ticket" className="text-lg font-semibold text-foreground">
            Comprobación con ticket
          </h3>
          <p className="text-sm text-muted-foreground">
            Verifica los datos del movimiento y completa los campos obligatorios.
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <ExpenseComprobacionResumenDatos
          movimiento={movimiento}
          viaje={viaje}
          nombreResponsable={nombreResponsable}
        />

        <form
          className="space-y-4"
          onSubmit={handleSubmit(enviarComprobacionTicket)}
          noValidate
        >
          <ExpenseViaticCategorySelect<ExpenseTicketComprobacionFormValues>
            id={`${idBase}-categoria`}
            fieldName="categoriaViatico"
            register={register}
            error={formState.errors.categoriaViatico?.message}
          />

          <div className="space-y-2">
            <Label htmlFor={`${idBase}-motivo`} className="text-foreground">
              Motivo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`${idBase}-motivo`}
              rows={2}
              placeholder="Ej. pago de servicios, consumo en establecimiento"
              className={cn(
                "min-h-[4rem] rounded-2xl border-2 bg-background/80",
                formState.errors.motivo && "border-destructive/60"
              )}
              {...register("motivo")}
              aria-invalid={Boolean(formState.errors.motivo)}
            />
            {formState.errors.motivo ? (
              <p className="text-sm text-destructive" role="alert">
                {formState.errors.motivo.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idBase}-descripcion`} className="text-foreground">
              Descripción <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`${idBase}-descripcion`}
              rows={2}
              placeholder="Ej. pago con tarjeta, consumo varios"
              className={cn(
                "min-h-[4rem] rounded-2xl border-2 bg-background/80",
                formState.errors.descripcion && "border-destructive/60"
              )}
              {...register("descripcion")}
              aria-invalid={Boolean(formState.errors.descripcion)}
            />
            {formState.errors.descripcion ? (
              <p className="text-sm text-destructive" role="alert">
                {formState.errors.descripcion.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Puedes ajustar el texto; el importe sigue siendo el del movimiento de arriba.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idBase}-importe`} className="text-foreground">
              Importe (referencia del movimiento)
            </Label>
            <Input
              id={`${idBase}-importe`}
              readOnly
              value={formatearMonedaViatico(movimiento.gasto)}
              className="h-11 cursor-default rounded-2xl border-2 bg-muted/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={idArchivos} className="text-foreground">
              Comprobantes (imagen o PDF) <span className="text-destructive">*</span>
            </Label>
            <ExpenseFileDropZone
              inputId={idArchivos}
              accept="image/*,.pdf,application/pdf"
              textoArrastrar="Arrastra y suelta aquí tu archivo"
              textoAyuda="Un solo archivo: imagen (no WebP ni GIF) o PDF. También puedes elegirlo con el botón."
              etiquetaBoton="Elegir archivo"
              nombreArchivo={nombreArchivoTicket}
              error={Boolean(errorArchivos)}
              onArchivoElegido={aplicarArchivoTicket}
              onQuitarArchivo={quitarArchivoTicket}
            />
            {errorArchivos ? (
              <p className="text-sm text-destructive" role="alert">
                {errorArchivos}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idBase}-comentario`} className="text-foreground">
              Comentario <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`${idBase}-comentario`}
              rows={3}
              placeholder="Obligatorio: indica de qué es el gasto (alimentos, hospedaje, pago de servicio, casetas, etc.)."
              className={cn(
                "min-h-[5rem] rounded-2xl border-2 bg-background/80",
                formState.errors.comentario && "border-destructive/60"
              )}
              {...register("comentario")}
              aria-invalid={Boolean(formState.errors.comentario)}
            />
            {formState.errors.comentario ? (
              <p className="text-sm text-destructive" role="alert">
                {formState.errors.comentario.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sin este detalle no se puede completar la comprobación.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer rounded-2xl"
            disabled={formState.isSubmitting}
          >
            Comprobar movimiento
          </Button>
        </form>
      </div>
    </div>
  )
}
