import type { GasolineRequestDetail } from "@/features/gasoline/services/gasoline-api"

export interface GasolineRequestDetailModalProps {
  abierto: boolean
  detalle: GasolineRequestDetail | null
  cargando: boolean
  error: string | null
  onCerrar: () => void
}
