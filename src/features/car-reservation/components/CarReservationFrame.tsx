import { CAR_RESERVATION_EMBEDDED_TOPBAR_HEIGHT_PX } from "@/features/car-reservation/constants/car-reservation-layout.constants"
import {
  resolveCarReservationZoom,
  shouldClipCarReservationEmbeddedTopbar,
} from "@/features/car-reservation/constants/car-reservation-env"
import { useCarReservationFrameSize } from "@/features/car-reservation/hooks/useCarReservationFrameSize"
import type { CarReservationFrameProps } from "@/features/car-reservation/interfaces/car-reservation-frame-props.interface"

export function CarReservationFrame({ src, title }: CarReservationFrameProps) {
  const { containerRef, frameSize } = useCarReservationFrameSize()
  const recortarTopbarEmbebida = shouldClipCarReservationEmbeddedTopbar()
  const zoom = resolveCarReservationZoom()
  const offsetTopbar = recortarTopbarEmbebida
    ? CAR_RESERVATION_EMBEDDED_TOPBAR_HEIGHT_PX
    : 0
  const puedeRenderizarIframe =
    frameSize.width > 0 && frameSize.height > 0 && src.length > 0

  const iframeHeight = Math.floor(frameSize.height + offsetTopbar)
  const iframeWidth = Math.floor(frameSize.width / zoom)

  return (
    <div
      ref={containerRef}
      className="h-full w-full min-h-0 overflow-hidden bg-[#f0f2f7]"
    >
      {!src ? (
        <div className="flex h-full w-full items-center justify-center bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          <p>
            Configura la variable de entorno{" "}
            <span className="font-mono text-foreground">
              VITE_CAR_RESERVATION_URL
            </span>{" "}
            para mostrar el módulo de reserva de autos.
          </p>
        </div>
      ) : null}

      {puedeRenderizarIframe ? (
        <iframe
          src={src}
          title={title}
          width={iframeWidth}
          height={iframeHeight}
          className="block max-w-none border-0 bg-[#f0f2f7]"
          style={{
            width: `${iframeWidth}px`,
            height: `${iframeHeight}px`,
            marginTop: recortarTopbarEmbebida ? `-${offsetTopbar}px` : undefined,
            zoom,
            transformOrigin: "top left",
          }}
          allow="fullscreen"
          loading="eager"
        />
      ) : null}
    </div>
  )
}
