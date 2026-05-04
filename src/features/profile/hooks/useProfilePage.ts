import { useEffect, useState } from "react"

import type { TravelRequestMousePosition } from "@/features/travel-request/interfaces/travel-request-mouse-position.interface"

interface UseProfilePageReturn {
  mounted: boolean
  mousePosition: TravelRequestMousePosition
}

export function useProfilePage(): UseProfilePageReturn {
  const [mounted, setMounted] = useState<boolean>(false)
  const [mousePosition, setMousePosition] = useState<TravelRequestMousePosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return { mounted, mousePosition }
}
