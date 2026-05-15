import { cn } from "@/lib/utils"
import type {
  FinancialAuthorizationCfdiCampoXml,
  FinancialAuthorizationCfdiFilaConcepto,
  FinancialAuthorizationCfdiFilaGeneral,
  FinancialAuthorizationCfdiFilaTraslado,
  FinancialAuthorizationCfdiVistaTabla,
  FinancialAuthorizationExtrasXmlPartidos,
} from "@/features/financial-authorization/interfaces/financial-authorization-cfdi.interface"
import type { FiltrosAutorizacionFinanciera } from "@/features/financial-authorization/interfaces/financial-authorization-filtros.interface"
import type { FinancialAuthorizationMovimientoComprobado } from "@/features/financial-authorization/interfaces/financial-authorization-movimiento.interface"
import type { FinancialAuthorizationSolicitudPendienteRevision } from "@/features/financial-authorization/interfaces/financial-authorization-solicitud.interface"
import type { FinancialAuthorizationViajeEnSolicitud } from "@/features/financial-authorization/interfaces/financial-authorization-viaje.interface"
import {
  CAMPOS_CFDI_YA_EN_UI,
  CAMPOS_EXTRA_GRUPO_CONCEPTO_XML,
  CAMPOS_EXTRA_GRUPO_TIMBRE,
  CFDI_UUID_FISCAL_MOCK,
  pillCfdiBaseClassName,
  selectFiltroClassName,
} from "@/features/financial-authorization/hooks/financial-authorization-ui-constants"

const COMENTARIO_USUARIO_AL_COMPROBAR_DEFAULT: Record<string, string> = {}

export const selectCeldaCfdiClassName = cn(
  selectFiltroClassName,
  "h-9 w-full min-w-0 py-1.5 text-xs"
)

export { pillCfdiBaseClassName }

export function textoComentarioUsuarioAlComprobar(
  mov: FinancialAuthorizationMovimientoComprobado
): string {
  const propio = mov.comentarioAlComprobar?.trim()
  if (propio) {
    return propio
  }
  return (
    COMENTARIO_USUARIO_AL_COMPROBAR_DEFAULT[mov.id] ??
    "Sin comentario al enviar la comprobación."
  )
}

export function formatearMonto(monto: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(monto)
}

export function formatearFechaCorta(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

export function totalMovimientosComprobados(
  movimientos: FinancialAuthorizationMovimientoComprobado[]
): number {
  return movimientos.reduce((acc, m) => acc + m.monto, 0)
}

export function movimientosComprobadosDeSolicitud(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision
): FinancialAuthorizationMovimientoComprobado[] {
  return solicitud.viajes.flatMap((viaje) => viaje.movimientosComprobados)
}

export function movimientoTieneComprobacionUsuario(
  mov: FinancialAuthorizationMovimientoComprobado
): boolean {
  return mov.comprobacionUsuarioHecha !== false
}

export function movimientosConComprobacionUsuarioColaborador(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision
): FinancialAuthorizationMovimientoComprobado[] {
  return movimientosComprobadosDeSolicitud(solicitud).filter(
    movimientoTieneComprobacionUsuario
  )
}

export function solicitudTieneAlMenosUnaComprobacionUsuario(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision
): boolean {
  return movimientosConComprobacionUsuarioColaborador(solicitud).length > 0
}

export function solicitudVisibleEnColaContabilidadMock(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision
): boolean {
  if (solicitud.contabilidadCerrada === true) {
    return false
  }
  return solicitudTieneAlMenosUnaComprobacionUsuario(solicitud)
}

export function movimientoElegibleEnvioSapMock(
  mov: FinancialAuthorizationMovimientoComprobado
): boolean {
  if (!movimientoTieneComprobacionUsuario(mov) || mov.facturadoSapMock === true) {
    return false
  }
  if (mov.proofStatus === "approved") {
    return false
  }
  if (mov.tripMovementProofId === undefined) {
    return false
  }
  if (mov.proofType !== undefined && mov.proofType !== "invoice") {
    return false
  }
  if (mov.proofStatus !== undefined && mov.proofStatus !== "submitted") {
    return false
  }
  return true
}

export function totalComprobadoSolicitud(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision
): number {
  return totalMovimientosComprobados(
    movimientosConComprobacionUsuarioColaborador(solicitud)
  )
}

export function montoTotalPorIdsMovimientos(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision,
  idsMovimiento: readonly string[]
): number {
  if (idsMovimiento.length === 0) {
    return 0
  }
  const ids = new Set(idsMovimiento)
  return movimientosComprobadosDeSolicitud(solicitud)
    .filter((m) => ids.has(m.id))
    .reduce((acc, m) => acc + m.monto, 0)
}

export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function normalizarTextoBusqueda(valor: string): string {
  return valor.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
}

function parseMontoFiltro(valor: string): number | null {
  const limpio = valor.trim().replace(/,/g, "")
  if (limpio === "") {
    return null
  }
  const n = Number.parseFloat(limpio)
  return Number.isFinite(n) ? n : null
}

export function solicitudCoincideFiltros(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision,
  filtros: FiltrosAutorizacionFinanciera
): boolean {
  const total = totalComprobadoSolicitud(solicitud)
  const qNombre = normalizarTextoBusqueda(filtros.textoNombre)
  const qCorreo = normalizarTextoBusqueda(filtros.textoCorreo)
  const nombreNorm = normalizarTextoBusqueda(solicitud.solicitante)
  const correoNorm = normalizarTextoBusqueda(solicitud.correoElectronico)

  const coincideNombre =
    qNombre === "" ||
    nombreNorm.includes(qNombre) ||
    normalizarTextoBusqueda(solicitud.resumen).includes(qNombre) ||
    normalizarTextoBusqueda(solicitud.folioSolicitud).includes(qNombre)

  const coincideCorreo = qCorreo === "" || correoNorm.includes(qCorreo)

  const min = parseMontoFiltro(filtros.montoMin)
  const max = parseMontoFiltro(filtros.montoMax)
  const coincideMontoMin = min === null || total >= min
  const coincideMontoMax = max === null || total <= max

  const coincideCompania =
    filtros.compania === "" || solicitud.empresa === filtros.compania

  const coincideArea = filtros.area === "" || solicitud.area === filtros.area

  const qTarjeta = filtros.ultimos4Tarjeta.replace(/\D/g, "")
  const coincideTarjeta =
    qTarjeta === "" || solicitud.tarjetaUltimos4.includes(qTarjeta)

  return (
    coincideNombre &&
    coincideCorreo &&
    coincideTarjeta &&
    coincideMontoMin &&
    coincideMontoMax &&
    coincideCompania &&
    coincideArea
  )
}

export function filtrosTienenValor(
  filtros: FiltrosAutorizacionFinanciera
): boolean {
  return (
    filtros.textoNombre.trim() !== "" ||
    filtros.textoCorreo.trim() !== "" ||
    filtros.ultimos4Tarjeta.trim() !== "" ||
    filtros.montoMin.trim() !== "" ||
    filtros.montoMax.trim() !== "" ||
    filtros.compania !== "" ||
    filtros.area !== ""
  )
}

export function indiceSolicitudEnLista(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision,
  todas: FinancialAuthorizationSolicitudPendienteRevision[]
): number {
  const i = todas.findIndex((s) => s.id === solicitud.id)
  return i >= 0 ? i : 0
}

export function idViaticoParaViaje(
  indiceSolicitud: number,
  indiceViaje: number
): number {
  return 1100 + indiceSolicitud * 15 + indiceViaje + 1
}

export function tarjetaMock(
  indiceSolicitud: number,
  indiceViaje: number,
  indiceMovimiento: number
): string {
  const n = 9300 + indiceSolicitud * 17 + indiceViaje * 3 + indiceMovimiento
  const s = String(n % 10000).padStart(4, "0")
  return `516102000461${s}`
}

export function primerNombreCompleto(nombreCompleto: string): string {
  const parte = nombreCompleto.trim().split(/\s+/)[0]
  return parte ?? nombreCompleto
}

export function rangoFechasSolicitud(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision
): { salida: string; regreso: string } {
  if (solicitud.viajes.length === 0) {
    return { salida: "—", regreso: "—" }
  }
  const inicios = solicitud.viajes.map((v) => v.periodoInicio).sort()
  const fines = solicitud.viajes.map((v) => v.periodoFin).sort()
  const primera = inicios[0]
  const ultima = fines[fines.length - 1]
  if (!primera || !ultima) {
    return { salida: "—", regreso: "—" }
  }
  return {
    salida: formatearFechaCorta(primera),
    regreso: formatearFechaCorta(ultima),
  }
}

function escaparXmlAtributo(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
}

function redondearDosDecimales(valor: number): number {
  return Math.round(valor * 100) / 100
}

export function generarXmlComprobanteCfdiMock(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision,
  viaje: FinancialAuthorizationViajeEnSolicitud,
  mov: FinancialAuthorizationMovimientoComprobado,
  idViatico: number,
  numeroTarjeta: string
): string {
  const totalNum = mov.monto
  const baseNum = redondearDosDecimales(totalNum / 1.16)
  const ivaNum = redondearDosDecimales(totalNum - baseNum)
  const subtotalStr = baseNum.toFixed(2)
  const totalStr = totalNum.toFixed(2)
  const ivaStr = ivaNum.toFixed(2)
  const vuStr = baseNum.toFixed(6)
  const uuid = CFDI_UUID_FISCAL_MOCK
  const empresaXml = escaparXmlAtributo(solicitud.empresa)
  const descXml = escaparXmlAtributo(mov.descripcion)
  const noIdMock = escaparXmlAtributo(`REF-${mov.numeroMovimiento}`)
  const fechaXml = `${mov.fecha}T17:25:47`
  const fechaTimbrado = `${mov.fecha}T17:25:48`
  return `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="4.0" Serie="A" Folio="${mov.numeroMovimiento}" Fecha="${fechaXml}" SubTotal="${subtotalStr}" Total="${totalStr}" Moneda="MXN" TipoDeComprobante="I" Exportacion="01" MetodoPago="PUE" FormaPago="28" LugarExpedicion="54040" NoCertificado="00001000000717078018" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd">
  <cfdi:Emisor Rfc="BAOL620611TG5" Nombre="LUIS HUMBERTO BAÑOS ORTIZ" RegimenFiscal="612"/>
  <cfdi:Receptor Rfc="TAR210901RX7" Nombre="${empresaXml}" DomicilioFiscalReceptor="52916" RegimenFiscalReceptor="601" UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="31162800" Cantidad="1" ClaveUnidad="H87" Unidad="PZA" NoIdentificacion="${noIdMock}" Descripcion="${descXml}" ValorUnitario="${vuStr}" Importe="${subtotalStr}" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="${subtotalStr}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="${ivaStr}"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="${ivaStr}"/>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1" UUID="${uuid}" FechaTimbrado="${fechaTimbrado}" RfcProvCertif="PPD101129EA3" SelloCFD="..." SelloSAT="..." NoCertificadoSAT="00001000000705928441"/>
  </cfdi:Complemento>
  <!-- Referencia interna: folio ${solicitud.folioSolicitud} · id viático ${idViatico} · tarjeta ${numeroTarjeta} · viaje ${viaje.idViaje} -->
</cfdi:Comprobante>`
}

export function descargarTextoComoArchivo(
  contenido: string,
  nombreArchivo: string,
  tipoMime: string
): void {
  const blob = new Blob([contenido], { type: tipoMime })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement("a")
  enlace.href = url
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(url)
}

export function construirVistaCfdiTabla(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision,
  mov: FinancialAuthorizationMovimientoComprobado
): FinancialAuthorizationCfdiVistaTabla {
  const total = mov.monto
  const baseImponible = redondearDosDecimales(total / 1.16)
  const ivaTrasladado = redondearDosDecimales(total - baseImponible)
  const uuidFiscal = CFDI_UUID_FISCAL_MOCK

  const generales: FinancialAuthorizationCfdiFilaGeneral[] = [
    {
      etiqueta: "Fecha de emisión",
      valor: formatearFechaCorta(mov.fecha),
    },
    { etiqueta: "Total", valor: formatearMonto(total) },
    {
      etiqueta: "Lugar de expedición (código postal)",
      valor: "54040",
    },
    { etiqueta: "RFC emisor", valor: "BAOL620611TG5" },
    {
      etiqueta: "Razón social emisor",
      valor: "LUIS HUMBERTO BAÑOS ORTIZ",
    },
    {
      etiqueta: "Régimen fiscal emisor",
      valor:
        "612 - Personas físicas con actividades empresariales y profesionales",
    },
    { etiqueta: "RFC receptor", valor: "TAR210901RX7" },
    {
      etiqueta: "Razón social receptor",
      valor: solicitud.empresa,
    },
    {
      etiqueta: "Régimen fiscal receptor",
      valor: "601 - General de ley personas morales",
    },
    { etiqueta: "Uso CFDI", valor: "G03 - Gastos en general" },
    { etiqueta: "Folio fiscal (UUID)", valor: uuidFiscal },
    { etiqueta: "Forma de pago", valor: "28 - Tarjeta de débito" },
    {
      etiqueta: "Método de pago",
      valor: "PUE - Pago en una sola exhibición",
    },
    {
      etiqueta: "Total impuestos retenidos",
      valor: formatearMonto(0),
    },
    {
      etiqueta: "Total traslados",
      valor: formatearMonto(ivaTrasladado),
    },
  ]

  const conceptos: FinancialAuthorizationCfdiFilaConcepto[] = [
    {
      descripcion: mov.descripcion,
      cantidad: 1,
      importe: baseImponible,
      iva: ivaTrasladado,
      base: baseImponible,
      impuesto: "002",
      impuestoLetra: "IVA",
    },
  ]

  const traslados: FinancialAuthorizationCfdiFilaTraslado[] = [
    {
      impuesto: "002",
      impuestoLetra: "IVA",
      tipoFactor: "Tasa",
      tasaOCuota: "0.16",
      importe: ivaTrasladado,
    },
  ]

  return {
    uuidFiscal,
    generales,
    conceptos,
    traslados,
  }
}

export function valorGeneralCfdi(
  generales: FinancialAuthorizationCfdiFilaGeneral[],
  fragmento: string
): string {
  const f = generales.find((x) =>
    x.etiqueta.toLowerCase().includes(fragmento.toLowerCase())
  )
  return f?.valor ?? "—"
}

function primerElementoLocal(
  padre: Document | Element,
  local: string
): Element | null {
  const nodos = padre.getElementsByTagName("*")
  for (let i = 0; i < nodos.length; i++) {
    const el = nodos[i]
    if (el !== undefined && el.localName === local) {
      return el
    }
  }
  return null
}

function attrXml(el: Element | null, ...nombres: string[]): string {
  if (!el) {
    return "—"
  }
  for (const nombre of nombres) {
    const v = el.getAttribute(nombre)
    if (v !== null && v !== "") {
      return v
    }
  }
  return "—"
}

function impuestosTotalesDelComprobante(compr: Element): Element | null {
  for (let i = 0; i < compr.children.length; i++) {
    const hijo = compr.children[i]
    if (
      hijo.localName === "Impuestos" &&
      hijo.hasAttribute("TotalImpuestosTrasladados")
    ) {
      return hijo
    }
  }
  return null
}

export function extraerCamposCfdiDesdeXml(
  xml: string
): FinancialAuthorizationCfdiCampoXml[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, "text/xml")
  if (doc.querySelector("parsererror")) {
    return [
      {
        campo: "Lectura XML",
        valor: "No se pudo interpretar el documento.",
      },
    ]
  }
  const compr = doc.documentElement
  if (!compr || compr.localName !== "Comprobante") {
    return [
      {
        campo: "Lectura XML",
        valor: "No se encontró el nodo raíz cfdi:Comprobante.",
      },
    ]
  }
  const emisor = primerElementoLocal(compr, "Emisor")
  const receptor = primerElementoLocal(compr, "Receptor")
  const conceptosEl = primerElementoLocal(compr, "Conceptos")
  const concepto = conceptosEl
    ? primerElementoLocal(conceptosEl, "Concepto")
    : null
  const impConc = concepto ? primerElementoLocal(concepto, "Impuestos") : null
  const trasladosEl = impConc ? primerElementoLocal(impConc, "Traslados") : null
  const traslado = trasladosEl
    ? primerElementoLocal(trasladosEl, "Traslado")
    : null
  const impTot = impuestosTotalesDelComprobante(compr)
  const complemento = primerElementoLocal(compr, "Complemento")
  const timbre = complemento
    ? primerElementoLocal(complemento, "TimbreFiscalDigital")
    : null

  const filas: FinancialAuthorizationCfdiCampoXml[] = []

  function agregar(campo: string, valor: string): void {
    filas.push({ campo, valor: valor === "" ? "—" : valor })
  }

  agregar("Versión", attrXml(compr, "Version"))
  agregar("Tipo de comprobante", attrXml(compr, "TipoDeComprobante"))
  agregar("Fecha", attrXml(compr, "Fecha"))
  agregar("Folio", attrXml(compr, "Folio"))
  agregar("Moneda", attrXml(compr, "Moneda"))
  agregar("Forma de pago", attrXml(compr, "FormaPago"))
  agregar("Método de pago", attrXml(compr, "MetodoPago"))
  agregar("Lugar de expedición", attrXml(compr, "LugarExpedicion"))
  agregar("Exportación", attrXml(compr, "Exportacion"))
  agregar("Subtotal", attrXml(compr, "SubTotal"))
  agregar("Total", attrXml(compr, "Total"))
  agregar("No. Certificado", attrXml(compr, "NoCertificado"))
  agregar("Nombre Emisor", attrXml(emisor, "Nombre"))
  agregar("RFC Emisor", attrXml(emisor, "Rfc"))
  agregar("Régimen Fiscal Emisor", attrXml(emisor, "RegimenFiscal"))
  agregar("Nombre Receptor", attrXml(receptor, "Nombre"))
  agregar("RFC Receptor", attrXml(receptor, "Rfc"))
  agregar("Régimen Fiscal Receptor", attrXml(receptor, "RegimenFiscalReceptor"))
  agregar("Uso CFDI", attrXml(receptor, "UsoCFDI"))
  agregar(
    "Domicilio Fiscal Receptor",
    attrXml(receptor, "DomicilioFiscalReceptor")
  )
  agregar("Cantidad", attrXml(concepto, "Cantidad"))
  agregar("Clave ProdServ", attrXml(concepto, "ClaveProdServ"))
  agregar("Clave Unidad", attrXml(concepto, "ClaveUnidad"))
  agregar("Unidad", attrXml(concepto, "Unidad"))
  agregar("Descripción", attrXml(concepto, "Descripcion"))
  agregar("No. Identificación", attrXml(concepto, "NoIdentificacion"))
  agregar("Valor Unitario", attrXml(concepto, "ValorUnitario"))
  agregar("Importe", attrXml(concepto, "Importe"))
  agregar("Objeto Impuesto", attrXml(concepto, "ObjetoImp"))
  agregar("Base", attrXml(traslado, "Base"))
  agregar("Impuesto", attrXml(traslado, "Impuesto"))
  agregar("Tipo Factor", attrXml(traslado, "TipoFactor"))
  agregar("Tasa/Cuota", attrXml(traslado, "TasaOCuota"))
  agregar("Importe Impuesto", attrXml(traslado, "Importe"))
  agregar(
    "Total impuestos trasladados",
    attrXml(impTot, "TotalImpuestosTrasladados")
  )
  agregar("UUID", attrXml(timbre, "UUID"))
  agregar("Fecha Timbrado", attrXml(timbre, "FechaTimbrado"))
  agregar("RFC Proveedor Certificación", attrXml(timbre, "RfcProvCertif"))
  agregar("No. Certificado SAT", attrXml(timbre, "NoCertificadoSAT"))
  agregar("Versión Timbre", attrXml(timbre, "Version"))

  return filas
}

export function camposXmlExtrasRespectoAlaVista(
  filas: FinancialAuthorizationCfdiCampoXml[]
): FinancialAuthorizationCfdiCampoXml[] {
  return filas.filter((f) => !CAMPOS_CFDI_YA_EN_UI.has(f.campo))
}

export function particionarExtrasXmlParaVista(
  filas: FinancialAuthorizationCfdiCampoXml[]
): FinancialAuthorizationExtrasXmlPartidos {
  const comprobante: FinancialAuthorizationCfdiCampoXml[] = []
  const conceptoXml: FinancialAuthorizationCfdiCampoXml[] = []
  const timbre: FinancialAuthorizationCfdiCampoXml[] = []
  for (const f of filas) {
    if (CAMPOS_EXTRA_GRUPO_TIMBRE.has(f.campo)) {
      timbre.push(f)
    } else if (CAMPOS_EXTRA_GRUPO_CONCEPTO_XML.has(f.campo)) {
      conceptoXml.push(f)
    } else {
      comprobante.push(f)
    }
  }
  return { comprobante, conceptoXml, timbre }
}

export function pillCfdiClasePorCampo(
  grupo: "pago" | "uuid" | "comprobante" | "concepto" | "timbre"
): string {
  switch (grupo) {
    case "pago":
      return "border-amber-500/30 bg-amber-500/[0.09] text-amber-950/90 dark:border-amber-400/35 dark:bg-amber-500/15 dark:text-amber-50/95"
    case "uuid":
      return "border-violet-500/35 bg-violet-500/12 font-mono text-[10px] leading-snug text-violet-950/95 dark:border-violet-400/40 dark:bg-violet-500/20 dark:text-violet-50"
    case "comprobante":
      return "border-violet-400/25 bg-violet-500/[0.07] text-foreground dark:border-violet-500/30 dark:bg-violet-950/25"
    case "concepto":
      return "border-teal-500/30 bg-teal-500/[0.08] text-foreground dark:border-teal-400/35 dark:text-teal-950/30"
    case "timbre":
      return "border-sky-500/30 bg-sky-500/[0.09] text-foreground dark:border-sky-400/35 dark:bg-sky-950/35"
    default:
      return "border-border/60 bg-background/80"
  }
}

export function encontrarMovimientoEnSolicitud(
  solicitud: FinancialAuthorizationSolicitudPendienteRevision,
  movimientoId: string
):
  | {
      viaje: FinancialAuthorizationViajeEnSolicitud
      movimiento: FinancialAuthorizationMovimientoComprobado
      indiceViaje: number
      indiceMovimiento: number
    }
  | undefined {
  for (let vi = 0; vi < solicitud.viajes.length; vi++) {
    const viaje = solicitud.viajes[vi]
    if (!viaje) {
      continue
    }
    for (let mi = 0; mi < viaje.movimientosComprobados.length; mi++) {
      const mov = viaje.movimientosComprobados[mi]
      if (mov?.id === movimientoId) {
        return {
          viaje,
          movimiento: mov,
          indiceViaje: vi,
          indiceMovimiento: mi,
        }
      }
    }
  }
  return undefined
}
