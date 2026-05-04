import type { TravelRequestMousePosition } from "../interfaces/travel-request-mouse-position.interface"

interface TravelRequestBackgroundProps {
  mousePosition: TravelRequestMousePosition
}

export function TravelRequestBackground({
  mousePosition,
}: TravelRequestBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl transition-transform duration-1000"
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl transition-transform duration-1000"
        style={{
          transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
        }}
      />
      <div className="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 animate-[spin_120s_linear_infinite] rounded-full border border-primary/5" />
    </div>
  )
}
