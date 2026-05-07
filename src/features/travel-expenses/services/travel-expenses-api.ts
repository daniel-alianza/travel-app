import { travelApi } from "@/api/travel-api"
import type { ExpenseMovimiento } from "@/features/travel-expenses/interfaces/expense-movimiento.interface"
import type { ExpenseViajeResumen } from "@/features/travel-expenses/interfaces/expense-viaje-resumen.interface"

interface ListExpenseDispersedTripsApiResponse {
  data: {
    viajes: ExpenseViajeResumen[]
  }
  message: string
}

interface ListExpenseTripMovementsApiResponse {
  data: {
    movimientos: ExpenseMovimiento[]
  }
  message: string
}

interface RequestReconciliationCodeApiResponse {
  data: {
    reconciliationId: number
    companyName: string
    codeExpiresAt: string
    remainingAttempts: number
  }
  message: string
}

interface VerifyReconciliationCodeApiResponse {
  data: {
    verified: boolean
  }
  message: string
}

interface CreateDmsUploadUrlApiResponse {
  data: {
    path: string
    token: string
    signedUrl: string
    expiresInSeconds: number
  }
  message: string
}

interface RegisterDmsTripFileApiResponse {
  data: {
    fileId: number
    deduplicated: boolean
  }
  message: string
}

interface SubmitTripMovementProofApiResponse {
  data: {
    id: number
    status: "submitted"
  }
  message: string
}

export async function fetchExpenseDispersedTrips(
  userId: number
): Promise<ExpenseViajeResumen[]> {
  const response = await travelApi.get<ListExpenseDispersedTripsApiResponse>(
    `/travel-checks/expense-trips/${String(userId)}`
  )
  return response.data.data.viajes
}

export async function fetchExpenseTripMovements(
  userId: number,
  tripId: string
): Promise<ExpenseMovimiento[]> {
  const response = await travelApi.get<ListExpenseTripMovementsApiResponse>(
    `/travel-checks/expense-trips/${String(userId)}/trips/${tripId}/movements`
  )
  return response.data.data.movimientos
}

export async function requestExpenseReconciliationCode(input: {
  tripId: number
}): Promise<{
  reconciliationId: number
  companyName: string
  codeExpiresAt: string
  remainingAttempts: number
}> {
  const response = await travelApi.post<RequestReconciliationCodeApiResponse>(
    "/travel-checks/reconciliations/request-code",
    input
  )
  return response.data.data
}

export async function verifyExpenseReconciliationCode(input: {
  travelRequestId: number
  verificationCode: string
}): Promise<boolean> {
  const response = await travelApi.post<VerifyReconciliationCodeApiResponse>(
    "/travel-checks/reconciliations/verify-code",
    input
  )
  return response.data.data.verified
}

export async function uploadTripFilesToDms(input: {
  userId: number
  tripId: number
  fileType: "ticket" | "invoice"
  files: readonly File[]
  onProgress?: (progress: {
    fileName: string
    fileIndex: number
    totalFiles: number
    progressPercent: number
  }) => void
}): Promise<readonly { fileId: number; fileName: string; mimeType: string }[]> {
  const uploadedFiles: { fileId: number; fileName: string; mimeType: string }[] = []
  const totalFiles = input.files.length
  for (const [fileIndex, file] of input.files.entries()) {
    input.onProgress?.({
      fileName: file.name,
      fileIndex: fileIndex + 1,
      totalFiles,
      progressPercent: 0,
    })
    const createUploadUrlResponse =
      await travelApi.post<CreateDmsUploadUrlApiResponse>(
        `/dms/users/${String(input.userId)}/trips/${String(input.tripId)}/files/upload-url`,
        {
          fileName: file.name,
          mimeType: file.type || inferMimeTypeFromName(file.name),
          fileSizeBytes: file.size,
        }
      )

    const signedUpload = createUploadUrlResponse.data.data
    await uploadFileToSignedUrl({
      signedUrl: signedUpload.signedUrl,
      file,
      mimeType: file.type || inferMimeTypeFromName(file.name),
      onProgress: (progressPercent) => {
        input.onProgress?.({
          fileName: file.name,
          fileIndex: fileIndex + 1,
          totalFiles,
          progressPercent,
        })
      },
    })

    const registerResponse = await travelApi.post<RegisterDmsTripFileApiResponse>(
      `/dms/users/${String(input.userId)}/trips/${String(input.tripId)}/files/register`,
      {
        fileType: input.fileType,
        fileName: file.name,
        mimeType: file.type || inferMimeTypeFromName(file.name),
        path: signedUpload.path,
        fileSizeBytes: file.size,
      }
    )
    uploadedFiles.push({
      fileId: registerResponse.data.data.fileId,
      fileName: file.name,
      mimeType: file.type || inferMimeTypeFromName(file.name),
    })
    input.onProgress?.({
      fileName: file.name,
      fileIndex: fileIndex + 1,
      totalFiles,
      progressPercent: 100,
    })
  }
  return uploadedFiles
}

export async function submitTripMovementProof(input: {
  userId: number
  tripId: number
  movementSequence: number
  proofType: "ticket" | "invoice"
  comment: string | null
  files: readonly {
    tripFileId: number
    fileRole:
      | "ticket"
      | "invoice_xml"
      | "invoice_pdf"
      | "invoice_xml_outbound"
      | "invoice_pdf_outbound"
      | "invoice_xml_return"
      | "invoice_pdf_return"
  }[]
}): Promise<void> {
  await travelApi.post<SubmitTripMovementProofApiResponse>(
    `/travel-checks/expense-trips/${String(input.userId)}/trips/${String(input.tripId)}/movements/${String(input.movementSequence)}/proofs`,
    {
      proofType: input.proofType,
      comment: input.comment,
      files: input.files,
    }
  )
}

function uploadFileToSignedUrl(input: {
  signedUrl: string
  file: File
  mimeType: string
  onProgress: (progressPercent: number) => void
}): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open("PUT", input.signedUrl)
    request.setRequestHeader("Content-Type", input.mimeType)
    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return
      }
      const progress = Math.min(
        99,
        Math.round((event.loaded / Math.max(event.total, 1)) * 100)
      )
      input.onProgress(progress)
    }
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        input.onProgress(100)
        resolve()
        return
      }
      reject(new Error("No se pudo subir el archivo al bucket."))
    }
    request.onerror = () => {
      reject(new Error("No se pudo subir el archivo al bucket."))
    }
    request.send(input.file)
  })
}

function inferMimeTypeFromName(fileName: string): string {
  const lowerName = fileName.toLowerCase()
  if (lowerName.endsWith(".pdf")) {
    return "application/pdf"
  }
  if (lowerName.endsWith(".xml")) {
    return "application/xml"
  }
  if (lowerName.endsWith(".png")) {
    return "image/png"
  }
  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
    return "image/jpeg"
  }
  if (lowerName.endsWith(".webp")) {
    return "image/webp"
  }
  return "application/octet-stream"
}
