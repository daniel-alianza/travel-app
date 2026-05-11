export function textoNormalizadoParaBusqueda(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
}

export function inicialesDesdeNombre(nombreCompleto: string): string {
  const partes = nombreCompleto.trim().split(/\s+/).filter((p) => p.length > 0)
  if (partes.length === 0) {
    return "?"
  }
  if (partes.length === 1) {
    return partes[0]!.slice(0, 2).toUpperCase()
  }
  const a = partes[0]!.charAt(0)
  const b = partes[partes.length - 1]!.charAt(0)
  return `${a}${b}`.toUpperCase()
}
