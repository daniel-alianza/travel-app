import { useId, useState, type ReactElement } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, FileText, Loader2, Trash2 } from "lucide-react"

import { showAppToast } from "@/components/app-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/features/auth/store/authStore"
import { ExpenseComprobacionResumenDatos } from "@/features/travel-expenses/components/ExpenseComprobacionResumenDatos"
import { ExpenseFileDropZone } from "@/features/travel-expenses/components/ExpenseFileDropZone"
import { ExpenseViaticCategorySelect } from "@/features/travel-expenses/components/ExpenseViaticCategorySelect"
import {
  esCategoriaAutobus,
  VIATIC_CATEGORY_VALUE_AUTOBUS,
} from "@/features/travel-expenses/data/viatic-category-options"
import { formatearMonedaViatico } from "@/features/travel-expenses/hooks/expense-page-helpers"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"
import {
  submitTripMovementProof,
  uploadTripFilesToDms,
} from "@/features/travel-expenses/services/travel-expenses-api"
import {
  expenseFacturaComprobacionSchema,
  type ExpenseFacturaComprobacionFormValues,
} from "@/features/travel-expenses/schemas/expense-factura-comprobacion.schema"
import { cn } from "@/lib/utils"

function archivoEsXml(archivo: File): boolean {
  if (archivo.name.toLowerCase().endsWith(".xml")) {
    return true
  }
  const tipo = archivo.type
  return tipo === "application/xml" || tipo === "text/xml"
}

function archivoEsPdf(archivo: File): boolean {
  if (archivo.name.toLowerCase().endsWith(".pdf")) {
    return true
  }
  return archivo.type === "application/pdf"
}

interface CfdiAutobus {
  xmlIda: File | null
  pdfIda: File | null
  xmlVuelta: File | null
  pdfVuelta: File | null
}

const CFDI_AUTOBUS_VACIO: CfdiAutobus = {
  xmlIda: null,
  pdfIda: null,
  xmlVuelta: null,
  pdfVuelta: null,
}

function mergeArchivosEnAutobus(
  prev: CfdiAutobus,
  archivos: File[]
): { ok: true; next: CfdiAutobus } | { ok: false; mensaje: string } {
  const next: CfdiAutobus = { ...prev }
  for (const archivo of archivos) {
    if (archivoEsXml(archivo)) {
      if (!next.xmlIda) {
        next.xmlIda = archivo
      } else if (!next.xmlVuelta) {
        next.xmlVuelta = archivo
      } else {
        return {
          ok: false,
          mensaje:
            "Ya agregaste 2 archivos XML. Quita uno en la lista para poder reemplazarlo.",
        }
      }
    } else if (archivoEsPdf(archivo)) {
      if (!next.pdfIda) {
        next.pdfIda = archivo
      } else if (!next.pdfVuelta) {
        next.pdfVuelta = archivo
      } else {
        return {
          ok: false,
          mensaje:
            "Ya agregaste 2 archivos PDF. Quita uno en la lista para poder reemplazarlo.",
        }
      }
    } else {
      return {
        ok: false,
        mensaje: `"${archivo.name}" no es un XML ni un PDF válido.`,
      }
    }
  }
  return { ok: true, next }
}

interface CfdiSimple {
  xml: File | null
  pdf: File | null
}

const CFDI_SIMPLE_VACIO: CfdiSimple = {
  xml: null,
  pdf: null,
}

function mergeArchivosSimple(
  prev: CfdiSimple,
  archivos: File[]
): { ok: true; next: CfdiSimple } | { ok: false; mensaje: string } {
  const next: CfdiSimple = { ...prev }
  for (const archivo of archivos) {
    if (archivoEsXml(archivo)) {
      if (!next.xml) {
        next.xml = archivo
      } else {
        return {
          ok: false,
          mensaje:
            "Ya agregaste el XML. Quita el archivo en la lista para poder reemplazarlo.",
        }
      }
    } else if (archivoEsPdf(archivo)) {
      if (!next.pdf) {
        next.pdf = archivo
      } else {
        return {
          ok: false,
          mensaje:
            "Ya agregaste el PDF. Quita el archivo en la lista para poder reemplazarlo.",
        }
      }
    } else {
      return {
        ok: false,
        mensaje: `"${archivo.name}" no es un XML ni un PDF válido.`,
      }
    }
  }
  return { ok: true, next }
}

function FilaArchivoCfdi(props: {
  etiqueta: string
  nombre: string
  onQuitar: () => void
}): ReactElement {
  const { etiqueta, nombre, onQuitar } = props
  return (
    <div className="flex items-start gap-2 rounded-xl border border-border/50 bg-background/60 px-3 py-2 text-xs">
      <div className="min-w-0 flex-1 text-left">
        <span className="font-medium text-muted-foreground">{etiqueta}</span>
        <p className="break-all text-foreground">{nombre}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
        onClick={onQuitar}
        aria-label={`Quitar ${etiqueta}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  )
}

interface ExpenseFacturaComprobacionFormProps {
  movimiento: ExpenseMovimiento
  viaje: ExpenseViajeResumen
  nombreResponsable: string
  onVolver: () => void
  onExito: () => void
  onCambioSubiendo?: (subiendo: boolean) => void
}

export function ExpenseFacturaComprobacionForm({
  movimiento,
  viaje,
  nombreResponsable,
  onVolver,
  onExito,
  onCambioSubiendo,
}: ExpenseFacturaComprobacionFormProps) {
  const idBase = useId()
  const authenticatedUserId = useAuthStore((state) => state.userId)
  const [errorArchivos, setErrorArchivos] = useState<string | null>(null)
  const [cfdiSimple, setCfdiSimple] = useState<CfdiSimple>(CFDI_SIMPLE_VACIO)
  const { xml, pdf } = cfdiSimple
  const [cfdiAutobus, setCfdiAutobus] = useState<CfdiAutobus>(CFDI_AUTOBUS_VACIO)
  const { xmlIda, pdfIda, xmlVuelta, pdfVuelta } = cfdiAutobus
  const [estadoCarga, setEstadoCarga] = useState<{
    fileName: string
    fileIndex: number
    totalFiles: number
    progressPercent: number
  } | null>(null)

  const formulario = useForm<ExpenseFacturaComprobacionFormValues>({
    resolver: zodResolver(expenseFacturaComprobacionSchema),
    defaultValues: {
      categoriaViatico: "",
      comentario: "",
    },
  })

  const { register, handleSubmit, control, formState } = formulario
  const categoriaValor = useWatch({ control, name: "categoriaViatico" })
  const modoAutobus = esCategoriaAutobus(categoriaValor ?? "")

  function aplicarArchivosFacturaSimple(archivos: File[]): void {
    if (archivos.length === 0) {
      return
    }
    setCfdiSimple((prev) => {
      const result = mergeArchivosSimple(prev, archivos)
      if (!result.ok) {
        setErrorArchivos(result.mensaje)
        return prev
      }
      setErrorArchivos(null)
      return result.next
    })
  }

  function aplicarArchivosFacturaAutobus(archivos: File[]): void {
    if (archivos.length === 0) {
      return
    }
    setCfdiAutobus((prev) => {
      const result = mergeArchivosEnAutobus(prev, archivos)
      if (!result.ok) {
        setErrorArchivos(result.mensaje)
        return prev
      }
      setErrorArchivos(null)
      return result.next
    })
  }

  function limpiarXml(destino: "simple" | "ida" | "vuelta"): void {
    setErrorArchivos(null)
    if (destino === "simple") {
      setCfdiSimple((p) => ({ ...p, xml: null }))
    } else if (destino === "ida") {
      setCfdiAutobus((p) => ({ ...p, xmlIda: null }))
    } else {
      setCfdiAutobus((p) => ({ ...p, xmlVuelta: null }))
    }
  }

  function limpiarPdf(destino: "simple" | "ida" | "vuelta"): void {
    setErrorArchivos(null)
    if (destino === "simple") {
      setCfdiSimple((p) => ({ ...p, pdf: null }))
    } else if (destino === "ida") {
      setCfdiAutobus((p) => ({ ...p, pdfIda: null }))
    } else {
      setCfdiAutobus((p) => ({ ...p, pdfVuelta: null }))
    }
  }

  function validarArchivosFactura(): string | null {
    if (modoAutobus) {
      if (!xmlIda || !pdfIda || !xmlVuelta || !pdfVuelta) {
        return "En autobús (ida y vuelta) se requieren 2 XML y 2 PDF (ida y vuelta)."
      }
      return null
    }
    if (!xml || !pdf) {
      return "Debes adjuntar un XML y un PDF del CFDI (puedes subirlos por separado)."
    }
    return null
  }

  async function enviarFactura(
    valores: ExpenseFacturaComprobacionFormValues
  ): Promise<void> {
    const err = validarArchivosFactura()
    if (err !== null) {
      setErrorArchivos(err)
      return
    }
    if (typeof authenticatedUserId !== "number") {
      setErrorArchivos("No se pudo identificar al usuario para subir archivos.")
      return
    }
    setErrorArchivos(null)
    void valores
    const archivosConRol = modoAutobus
      ? [
          { file: xmlIda, fileRole: "invoice_xml_outbound" as const },
          { file: pdfIda, fileRole: "invoice_pdf_outbound" as const },
          { file: xmlVuelta, fileRole: "invoice_xml_return" as const },
          { file: pdfVuelta, fileRole: "invoice_pdf_return" as const },
        ]
      : [
          { file: xml, fileRole: "invoice_xml" as const },
          { file: pdf, fileRole: "invoice_pdf" as const },
        ]
    const archivosFinales = archivosConRol.filter(
      (item): item is { file: File; fileRole: typeof item.fileRole } => item.file !== null
    )
    onCambioSubiendo?.(true)
    try {
      const uploadedFiles = await uploadTripFilesToDms({
        userId: authenticatedUserId,
        tripId: Number(viaje.id),
        fileType: "invoice",
        files: archivosFinales.map((item) => item.file),
        onProgress: (progress) => {
          setEstadoCarga(progress)
        },
      })
      await submitTripMovementProof({
        userId: authenticatedUserId,
        tripId: Number(viaje.id),
        movementSequence: movimiento.numeroMovimiento,
        proofType: "invoice",
        comment: valores.comentario.trim(),
        files: uploadedFiles.map((uploadedFile, index) => ({
          tripFileId: uploadedFile.fileId,
          fileRole: archivosFinales[index]?.fileRole ?? "invoice_pdf",
        })),
      })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "No se pudo subir los archivos al bucket."
      setErrorArchivos(errorMessage)
      setEstadoCarga(null)
      onCambioSubiendo?.(false)
      return
    }
    setEstadoCarga(null)
    onCambioSubiendo?.(false)
    showAppToast("Comprobantes CFDI subidos al bucket correctamente.", "success")
    onExito()
  }

  return (
    <div className="flex max-h-[min(90vh,760px)] flex-col">
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="cursor-pointer rounded-xl"
          onClick={onVolver}
          disabled={formState.isSubmitting}
        >
          <ArrowLeft className="mr-1 h-4 w-4" aria-hidden />
          Volver
        </Button>
      </div>

      <div className="mb-4 flex shrink-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 id="titulo-comprobar-factura" className="text-lg font-semibold text-foreground">
            Comprobación con factura (CFDI)
          </h3>
          <p className="text-sm text-muted-foreground">
            Sube el XML y el PDF del CFDI. En {VIATIC_CATEGORY_VALUE_AUTOBUS}, facturas de ida y
            vuelta.
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
          onSubmit={handleSubmit(enviarFactura)}
          noValidate
        >
          <ExpenseViaticCategorySelect<ExpenseFacturaComprobacionFormValues>
            id={`${idBase}-categoria`}
            fieldName="categoriaViatico"
            register={register}
            error={formState.errors.categoriaViatico?.message}
          />

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

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-sm font-medium text-foreground">Archivos CFDI</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Una sola zona: arrastra o elige los archivos. Solo XML y PDF.
              {modoAutobus
                ? " En autobús hacen falta 2 XML y 2 PDF (ida y vuelta). Puedes ir subiendo de uno en uno o varios a la vez hasta completar."
                : " Hacen falta un XML y un PDF. Puedes subirlos de uno en uno o los dos en un solo paso."}
            </p>

            <div className="mt-4 space-y-3">
              <Label className="text-foreground">
                CFDI (XML y PDF) <span className="text-destructive">*</span>
              </Label>
              <ExpenseFileDropZone
                key={`${idBase}-cfdi-${modoAutobus ? "bus" : "one"}-${[xml, pdf, xmlIda, pdfIda, xmlVuelta, pdfVuelta].map((f) => f?.name ?? "").join("|")}`}
                inputId={`${idBase}-cfdi-multi`}
                accept=".xml,.pdf,application/xml,text/xml,application/pdf"
                textoArrastrar={
                  modoAutobus
                    ? "Arrastra o elige archivos CFDI (ida y vuelta)"
                    : "Arrastra aquí el XML y el PDF del CFDI"
                }
                textoAyuda={
                  modoAutobus
                    ? "Hasta 2 XML y 2 PDF. Cada tipo se llena en orden: primero ida, luego vuelta. Puedes añadir varios en un solo paso."
                    : "Un XML y un PDF. Puedes ir sumando archivos hasta completar o elegir ambos a la vez."
                }
                etiquetaBoton="Elegir archivos"
                nombreArchivo={null}
                error={Boolean(errorArchivos)}
                compacto={false}
                multiple
                onArchivosElegidos={
                  formState.isSubmitting
                    ? undefined
                    : modoAutobus
                      ? aplicarArchivosFacturaAutobus
                      : aplicarArchivosFacturaSimple
                }
              />

              {!modoAutobus && (xml || pdf) ? (
                <div className="space-y-2">
                  {xml ? (
                    <FilaArchivoCfdi
                      etiqueta="XML"
                      nombre={xml.name}
                      onQuitar={
                        formState.isSubmitting ? () => undefined : () => limpiarXml("simple")
                      }
                    />
                  ) : null}
                  {pdf ? (
                    <FilaArchivoCfdi
                      etiqueta="PDF"
                      nombre={pdf.name}
                      onQuitar={
                        formState.isSubmitting ? () => undefined : () => limpiarPdf("simple")
                      }
                    />
                  ) : null}
                </div>
              ) : null}

              {modoAutobus && (xmlIda || pdfIda || xmlVuelta || pdfVuelta) ? (
                <div className="space-y-2">
                  {xmlIda ? (
                    <FilaArchivoCfdi
                      etiqueta="XML — ida"
                      nombre={xmlIda.name}
                      onQuitar={
                        formState.isSubmitting ? () => undefined : () => limpiarXml("ida")
                      }
                    />
                  ) : null}
                  {pdfIda ? (
                    <FilaArchivoCfdi
                      etiqueta="PDF — ida"
                      nombre={pdfIda.name}
                      onQuitar={
                        formState.isSubmitting ? () => undefined : () => limpiarPdf("ida")
                      }
                    />
                  ) : null}
                  {xmlVuelta ? (
                    <FilaArchivoCfdi
                      etiqueta="XML — vuelta"
                      nombre={xmlVuelta.name}
                      onQuitar={
                        formState.isSubmitting ? () => undefined : () => limpiarXml("vuelta")
                      }
                    />
                  ) : null}
                  {pdfVuelta ? (
                    <FilaArchivoCfdi
                      etiqueta="PDF — vuelta"
                      nombre={pdfVuelta.name}
                      onQuitar={
                        formState.isSubmitting ? () => undefined : () => limpiarPdf("vuelta")
                      }
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
            {estadoCarga ? (
              <p className="mt-3 text-xs text-muted-foreground" role="status">
                Subiendo archivo {String(estadoCarga.fileIndex)}/
                {String(estadoCarga.totalFiles)} ({String(estadoCarga.progressPercent)}%):
                {" "}
                {estadoCarga.fileName}
              </p>
            ) : null}
            {errorArchivos ? (
              <p className="mt-3 text-sm text-destructive" role="alert">
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
              placeholder="Obligatorio: indica de qué es el gasto (alimentos, hospedaje, servicios, autobús ida/vuelta, etc.)."
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
                Sin este detalle no se puede enviar la comprobación.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer rounded-2xl"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Subiendo al bucket...
              </>
            ) : (
              "Enviar comprobación"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
