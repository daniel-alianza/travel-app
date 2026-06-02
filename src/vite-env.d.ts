/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRAVEL_API_URL: string
  readonly VITE_CAR_RESERVATION_URL: string
  readonly VITE_CAR_RESERVATION_CLIP_TOPBAR?: string
  readonly VITE_CAR_RESERVATION_ZOOM?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
