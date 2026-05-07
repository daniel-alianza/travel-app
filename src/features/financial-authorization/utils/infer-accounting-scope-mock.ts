import type { AccountingScopeMock } from "@/features/financial-authorization/interfaces/accounting-menu-mock.interface"
import { EMPRESAS_MOCK_CONTABILIDAD } from "@/features/financial-authorization/mocks/accounting-menu-mock"

export function inferirAlcanceContabilidadMock(
  correo: string,
): AccountingScopeMock {
  const normalizado = correo.trim().toLowerCase()
  if (normalizado.length === 0) {
    return {
      tipo: "empresa",
      companyId: EMPRESAS_MOCK_CONTABILIDAD[0].id,
    }
  }

  if (
    normalizado.includes("gerente") ||
    normalizado.includes("lider") ||
    normalizado.includes("líder") ||
    normalizado.includes("director")
  ) {
    return { tipo: "consolidado" }
  }

  let hash = 0
  for (let i = 0; i < normalizado.length; i += 1) {
    hash = (hash + normalizado.charCodeAt(i) * (i + 1)) % 10009
  }
  const idx = hash % EMPRESAS_MOCK_CONTABILIDAD.length
  return {
    tipo: "empresa",
    companyId: EMPRESAS_MOCK_CONTABILIDAD[idx].id,
  }
}
