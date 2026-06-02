import type {
  GasolineFormCatalogBranch,
  GasolineFormCatalogItem,
  GasolineRequestFormCatalog,
} from "@/features/gasoline/services/gasoline-api"

export function normalizarTextoCatalogo(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function nombresCatalogo(
  items: readonly GasolineFormCatalogItem[]
): string[] {
  return items.map((item) => item.name)
}

export function sucursalesPorEmpresa(
  catalogo: GasolineRequestFormCatalog,
  empresaNombre: string,
  sucursalSeleccionada: string
): string[] {
  const empresaId = catalogo.companies.find(
    (empresa) =>
      normalizarTextoCatalogo(empresa.name) ===
      normalizarTextoCatalogo(empresaNombre)
  )?.id

  const sucursalesFiltradas =
    empresaId === undefined
      ? catalogo.branches
      : catalogo.branches.filter(
          (sucursal: GasolineFormCatalogBranch) =>
            sucursal.companyId === empresaId || sucursal.companyId === null
        )

  const nombres = sucursalesFiltradas.map((sucursal) => sucursal.name)
  const opciones =
    nombres.length > 0
      ? nombres
      : catalogo.branches.map((sucursal) => sucursal.name)

  if (
    sucursalSeleccionada.trim().length > 0 &&
    !opciones.includes(sucursalSeleccionada)
  ) {
    return [sucursalSeleccionada, ...opciones]
  }

  return opciones
}

export function resolverIdCatalogoPorNombre(
  items: readonly { id: number; name: string }[],
  nombre: string
): number | null {
  if (nombre.trim().length === 0) {
    return null
  }
  return (
    items.find(
      (item) =>
        normalizarTextoCatalogo(item.name) ===
        normalizarTextoCatalogo(nombre)
    )?.id ?? null
  )
}
