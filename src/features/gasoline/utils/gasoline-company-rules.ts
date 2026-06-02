function normalizarTexto(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function esEmpresaAlianza(
  empresaNombre: string,
  empresaId?: number | null
): boolean {
  if (empresaId === 1) {
    return true
  }
  return normalizarTexto(empresaNombre).includes("alianza")
}

export function esEmpresaSinSucursalObligatoria(
  empresaNombre: string,
  empresaId?: number | null
): boolean {
  if (empresaId === 2 || empresaId === 3 || empresaId === 4) {
    return true
  }

  const normalizado = normalizarTexto(empresaNombre)
  if (normalizado.includes("fg") && normalizado.includes("electrical")) {
    return true
  }
  if (normalizado.includes("manufacturing")) {
    return true
  }
  if (normalizado.includes("tableros") || normalizado.includes("arrancadores")) {
    return true
  }
  return false
}

/** Alianza: sucursal obligatoria en todo el flujo de gasolina. */
export function requiereSucursalGasolina(
  empresaNombre: string,
  empresaId?: number | null
): boolean {
  if (esEmpresaSinSucursalObligatoria(empresaNombre, empresaId)) {
    return false
  }
  return esEmpresaAlianza(empresaNombre, empresaId)
}

export function requiereFiltroSucursalSap(
  empresaNombre: string,
  empresaId?: number | null
): boolean {
  return (
    esEmpresaAlianza(empresaNombre, empresaId) &&
    !esEmpresaSinSucursalObligatoria(empresaNombre, empresaId)
  )
}
