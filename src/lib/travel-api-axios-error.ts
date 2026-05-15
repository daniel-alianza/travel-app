import { isAxiosError, type AxiosError } from "axios"

type TravelApiErrorEnvelope = {
  readonly message?: string
  readonly error?: unknown
  readonly data?: unknown
}

export function logTravelAxiosError(etiqueta: string, error: unknown): void {
  if (!isAxiosError(error)) {
    console.error(`[${etiqueta}]`, { tipo: "no-axios", error })
    return
  }
  const ax = error as AxiosError<TravelApiErrorEnvelope>
  console.error(`[${etiqueta}]`, {
    axiosMessage: ax.message,
    code: ax.code,
    status: ax.response?.status,
    url: ax.config?.url,
    method: ax.config?.method,
    responseData: ax.response?.data,
  })
}

export function userMessageFromTravelAxiosError(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : "Error de red o servidor."
  }
  const data = error.response?.data as TravelApiErrorEnvelope | undefined
  const apiMessage =
    typeof data?.message === "string" ? data.message.trim() : ""
  const apiError = data?.error
  let detail = ""
  if (typeof apiError === "string") {
    detail = apiError.trim()
  } else if (
    apiError !== null &&
    typeof apiError === "object" &&
    "message" in apiError
  ) {
    const nested = (apiError as { message?: unknown }).message
    if (typeof nested === "string") {
      detail = nested.trim()
    }
  }
  const partes: string[] = []
  if (detail.length > 0) {
    partes.push(detail)
  }
  if (apiMessage.length > 0 && apiMessage !== detail) {
    partes.push(apiMessage)
  }
  if (partes.length > 0) {
    return partes.join(" · ")
  }
  return "No se pudo registrar la factura en SAP."
}
