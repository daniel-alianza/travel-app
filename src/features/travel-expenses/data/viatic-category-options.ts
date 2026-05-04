/**
 * Nombres de categoría alineados al seeder de viáticos (sin "NO DEDUCIBLES").
 * Incluye AUTOBUS para comprobación ida/vuelta (2 XML + 2 PDF).
 */
export const VIATIC_CATEGORY_VALUE_AUTOBUS = "AUTOBUS" as const

export const VIATIC_CATEGORY_OPTIONS: readonly string[] = [
  "ALIMENTACIÓN",
  "AVION",
  VIATIC_CATEGORY_VALUE_AUTOBUS,
  "CASETAS",
  "COMBUSTIBLES Y LUBRICANTES",
  "CONSUMO CON CLIENTES",
  "GASTOS DE VIAJES INTERNACIONALES",
  "HERRAMIENTAS Y EQUIPO",
  "HOSPEDAJE",
  "MTTO. EQUIPO DE TRANSPORTE",
  "OTROS IMPUESTOS",
  "TRANSPORTACION PERSONAL",
  "TAXIS",
]

export function esCategoriaAutobus(valor: string): boolean {
  return valor.trim().toUpperCase() === VIATIC_CATEGORY_VALUE_AUTOBUS
}
