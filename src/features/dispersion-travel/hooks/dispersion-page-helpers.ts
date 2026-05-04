import type { DispersionQueueItemApi } from "@/features/dispersion-travel/services/dispersion-travel-api"
import type { FilaDispersion } from "@/features/dispersion-travel/interfaces/dispersion-fila.interface"

export const DISPERSION_BUTTON_INTERACTIVE_CLASS =
  "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] active:shadow-md disabled:cursor-not-allowed disabled:translate-y-0 disabled:scale-100 disabled:opacity-50 disabled:shadow-none"

export function formatearFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) {
    return iso
  }
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d))
}

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(valor)
}

export function parseMontoAAjustar(texto: string): number {
  const normalizado = texto.trim().replaceAll(",", "")
  if (normalizado === "") {
    return 0
  }
  const n = Number.parseFloat(normalizado)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

export function calcularMontoNetoDispersion(fila: FilaDispersion): number {
  if (fila.montoEsAbsoluto) {
    if (fila.montoAAjustar.trim() === "") {
      return fila.montoSolicitado
    }
    return Math.max(0, Math.round(parseMontoAAjustar(fila.montoAAjustar)))
  }
  const delta = parseMontoAAjustar(fila.montoAAjustar)
  if (fila.signoAjuste === "+") {
    return fila.montoSolicitado + delta
  }
  return Math.max(0, fila.montoSolicitado - delta)
}

export function absolutoARelativo(
  fila: FilaDispersion
): Pick<FilaDispersion, "montoAAjustar" | "signoAjuste" | "montoEsAbsoluto"> {
  if (fila.montoAAjustar.trim() === "") {
    return { montoAAjustar: "", signoAjuste: "+", montoEsAbsoluto: false }
  }
  const abs = Math.round(parseMontoAAjustar(fila.montoAAjustar))
  const diff = abs - fila.montoSolicitado
  if (diff > 0) {
    return {
      montoAAjustar: String(diff),
      signoAjuste: "+",
      montoEsAbsoluto: false,
    }
  }
  if (diff < 0) {
    return {
      montoAAjustar: String(-diff),
      signoAjuste: "-",
      montoEsAbsoluto: false,
    }
  }
  return { montoAAjustar: "", signoAjuste: "+", montoEsAbsoluto: false }
}

export function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function filaCumpleRequisitosMontoParaDispersion(
  fila: FilaDispersion
): boolean {
  if (fila.montoAAjustar.trim() === "") {
    return false
  }
  const capturado = parseMontoAAjustar(fila.montoAAjustar)
  if (!Number.isFinite(capturado) || capturado < 0) {
    return false
  }
  return calcularMontoNetoDispersion(fila) > 0
}

export function mapearItemDispersionApiAFila(
  item: DispersionQueueItemApi
): FilaDispersion {
  return {
    id: item.id,
    nombreSolicitante: item.nombreSolicitante,
    numeroTarjeta: item.numeroTarjeta,
    descripcion: item.descripcion,
    montoSolicitado: item.montoSolicitado,
    signoAjuste: "+",
    montoAAjustar: "",
    montoEsAbsoluto: false,
    fechaInicioViaje: item.fechaInicioViaje,
    fechaFinViaje: item.fechaFinViaje,
  }
}
