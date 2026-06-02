import { useCallback, useState } from "react"

import { showAppToast } from "@/components/app-toast"
import {
  fetchGasolineRequestById,
  type GasolineRequestDetail,
} from "@/features/gasoline/services/gasoline-api"
import { logTravelAxiosError, userMessageFromTravelAxiosError } from "@/lib/travel-api-axios-error"

export function useGasolineRequestDetail() {
  const [abierto, setAbierto] = useState(false)
  const [detalle, setDetalle] = useState<GasolineRequestDetail | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cerrar = useCallback((): void => {
    setAbierto(false)
    setDetalle(null)
    setError(null)
  }, [])

  const abrir = useCallback(async (requestId: number): Promise<void> => {
    setAbierto(true)
    setDetalle(null)
    setError(null)
    setCargando(true)
    try {
      const data = await fetchGasolineRequestById(requestId)
      setDetalle(data)
    } catch (err) {
      logTravelAxiosError("gasoline-request-detail", err)
      const mensaje =
        userMessageFromTravelAxiosError(err) ||
        "No se pudo cargar el detalle de la solicitud."
      setError(mensaje)
      showAppToast(mensaje, "error")
    } finally {
      setCargando(false)
    }
  }, [])

  return {
    abierto,
    detalle,
    cargando,
    error,
    abrir,
    cerrar,
  }
}
