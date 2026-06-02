import { useEffect } from "react"

const CLASE_LAYOUT_PANTALLA_COMPLETA = "car-reservation-layout"

export function useCarReservationPage(): void {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const root = document.getElementById("root")

    html.classList.add(CLASE_LAYOUT_PANTALLA_COMPLETA)
    body.classList.add(CLASE_LAYOUT_PANTALLA_COMPLETA)
    root?.classList.add(CLASE_LAYOUT_PANTALLA_COMPLETA)

    return () => {
      html.classList.remove(CLASE_LAYOUT_PANTALLA_COMPLETA)
      body.classList.remove(CLASE_LAYOUT_PANTALLA_COMPLETA)
      root?.classList.remove(CLASE_LAYOUT_PANTALLA_COMPLETA)
    }
  }, [])
}
