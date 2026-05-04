export type SignoAjuste = "+" | "-"

export interface FilaDispersion {
  id: number
  nombreSolicitante: string
  numeroTarjeta: string
  descripcion: string
  montoSolicitado: number
  signoAjuste: SignoAjuste
  montoAAjustar: string
  montoEsAbsoluto: boolean
  fechaInicioViaje: string
  fechaFinViaje: string
}

export const OPCIONES_SIGNO = [
  { value: "+", label: "+ Aumenta" },
  { value: "-", label: "− Disminuye" },
] as const
