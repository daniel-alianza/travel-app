import type { ListaPaginadaMeta } from "@/lib/list-pagination-types"

export function calcularTotalPaginas(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) {
    return 1
  }
  return Math.max(1, Math.ceil(total / pageSize))
}

export function limitarPagina(pagina: number, totalPaginas: number): number {
  if (totalPaginas < 1) {
    return 1
  }
  return Math.min(Math.max(1, pagina), totalPaginas)
}

export function construirMetaDesdeTotal(
  page: number,
  pageSize: number,
  total: number,
): ListaPaginadaMeta {
  const totalPages = calcularTotalPaginas(total, pageSize)
  const pageAjustada = limitarPagina(page, totalPages)
  return {
    page: pageAjustada,
    pageSize,
    total,
    totalPages,
  }
}

export function rebanarPagina<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): T[] {
  const meta = construirMetaDesdeTotal(page, pageSize, items.length)
  const inicio = (meta.page - 1) * pageSize
  return items.slice(inicio, inicio + pageSize)
}
