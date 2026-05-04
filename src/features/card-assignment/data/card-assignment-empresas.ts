export const EMPRESAS_TARJETA = [
  "Alianza Eléctrica",
  "Grupo FG Industrial",
  "FG Servicios",
] as const

export type EmpresaTarjeta = (typeof EMPRESAS_TARJETA)[number]
