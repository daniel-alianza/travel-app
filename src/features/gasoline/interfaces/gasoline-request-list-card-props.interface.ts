import type { ReactNode } from "react"

import type { GasolineRequestListItem } from "@/features/gasoline/services/gasoline-api"

export interface GasolineRequestListCardProps {
  solicitud: GasolineRequestListItem
  acciones?: ReactNode
  mostrarEstado?: boolean
}
