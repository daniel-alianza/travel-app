import { cn } from "@/lib/utils"

export const COMPANIAS_FILTRO = [
  "Alianza Eléctrica",
  "Grupo FG Industrial",
  "FG Servicios",
] as const

export const AREAS_FILTRO = [
  "Tecnologías de la Información",
  "Recursos Humanos",
  "Operaciones",
  "Ventas",
  "Logística",
] as const

export const selectFiltroClassName = cn(
  "flex h-9 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm shadow-xs outline-none",
  "transition-[color,box-shadow,border-color,transform] duration-200 ease-out",
  "hover:border-violet-400/45 hover:shadow-sm hover:-translate-y-px active:scale-[0.995]",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:cursor-not-allowed disabled:opacity-50",
)

export const filtrosInputClassName = cn(
  "h-9 transition-[border-color,box-shadow,background-color] duration-200 ease-out",
  "hover:border-violet-400/40 dark:hover:border-violet-500/35",
  "focus-visible:border-violet-500/55 focus-visible:ring-2 focus-visible:ring-violet-500/20",
)

export const CFDI_UUID_FISCAL_MOCK = "45DAFDD5-6830-4BF2-A86E-59374E4D435D"

export const CAMPOS_CFDI_YA_EN_UI: ReadonlySet<string> = new Set([
  "Forma de pago",
  "Método de pago",
  "Uso CFDI",
  "UUID",
  "Nombre Emisor",
  "RFC Emisor",
  "Régimen Fiscal Emisor",
  "Nombre Receptor",
  "RFC Receptor",
  "Régimen Fiscal Receptor",
  "Subtotal",
  "Total",
  "Descripción",
  "Cantidad",
  "Importe",
  "Base",
  "Impuesto",
  "Tipo Factor",
  "Tasa/Cuota",
  "Importe Impuesto",
  "Total impuestos trasladados",
])

export const CAMPOS_EXTRA_GRUPO_TIMBRE: ReadonlySet<string> = new Set([
  "Fecha Timbrado",
  "RFC Proveedor Certificación",
  "No. Certificado SAT",
  "Versión Timbre",
])

export const CAMPOS_EXTRA_GRUPO_CONCEPTO_XML: ReadonlySet<string> = new Set([
  "Domicilio Fiscal Receptor",
  "Clave ProdServ",
  "Clave Unidad",
  "Unidad",
  "No. Identificación",
  "Valor Unitario",
  "Objeto Impuesto",
])

export const pillCfdiBaseClassName = cn(
  "inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs transition-colors",
)
