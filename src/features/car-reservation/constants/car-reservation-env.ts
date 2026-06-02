function resolveCarReservationZoom(): number {
  const raw = import.meta.env.VITE_CAR_RESERVATION_ZOOM
  if (typeof raw !== "string" || raw.trim() === "") {
    return 1
  }
  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1
  }
  return Math.min(parsed, 2)
}

export function resolveCarReservationUrl(): string {
  const url = import.meta.env.VITE_CAR_RESERVATION_URL
  if (typeof url !== "string") {
    return ""
  }
  const trimmed = url.trim()
  if (!trimmed) {
    return ""
  }

  try {
    const parsed = new URL(trimmed)
    if (!parsed.searchParams.has("embed")) {
      parsed.searchParams.set("embed", "1")
    }
    return parsed.toString()
  } catch {
    return trimmed
  }
}

export function shouldClipCarReservationEmbeddedTopbar(): boolean {
  const raw = import.meta.env.VITE_CAR_RESERVATION_CLIP_TOPBAR
  if (typeof raw !== "string") {
    return true
  }
  return raw.trim().toLowerCase() !== "false"
}

export { resolveCarReservationZoom }
