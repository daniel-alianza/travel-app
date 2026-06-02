import { useEffect, useRef, useState } from "react"

interface CarReservationFrameSize {
  width: number
  height: number
}

interface UseCarReservationFrameSizeReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  frameSize: CarReservationFrameSize
}

export function useCarReservationFrameSize(): UseCarReservationFrameSizeReturn {
  const containerRef = useRef<HTMLDivElement>(null)
  const [frameSize, setFrameSize] = useState<CarReservationFrameSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    function updateSize(): void {
      const width = Math.floor(container.clientWidth)
      const height = Math.floor(container.clientHeight)

      setFrameSize((prev) => {
        if (prev.width === width && prev.height === height) {
          return prev
        }
        return { width, height }
      })
    }

    updateSize()

    const observer = new ResizeObserver(() => {
      updateSize()
    })
    observer.observe(container)
    window.addEventListener("resize", updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateSize)
    }
  }, [])

  return { containerRef, frameSize }
}
