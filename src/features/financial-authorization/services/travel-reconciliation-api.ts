import { travelApi } from "@/api/travel-api"

export interface PendingTravelReconciliation {
  id: number
  travelRequestId: number
  status: "pending" | "rejected" | "approved" | "verified"
  verificationCode: string
  codeExpiresAt: string
  employeeName: string
  companyName: string
  requestedByName: string
  requestedByEmail: string
  createdAt: string
}

interface ListPendingTravelReconciliationsApiResponse {
  data: {
    reconciliations: PendingTravelReconciliation[]
  }
  message: string
}

interface DecideTravelReconciliationApiResponse {
  data: {
    id: number
    status: "rejected"
  }
  message: string
}

export async function fetchPendingTravelReconciliations(): Promise<
  PendingTravelReconciliation[]
> {
  const response =
    await travelApi.get<ListPendingTravelReconciliationsApiResponse>(
      "/travel-checks/reconciliations/pending"
    )
  return response.data.data.reconciliations
}

export async function decideTravelReconciliation(input: {
  reconciliationId: number
  rejectionReason: string | null
}): Promise<"rejected"> {
  const response = await travelApi.post<DecideTravelReconciliationApiResponse>(
    `/travel-checks/reconciliations/${String(input.reconciliationId)}/reject`,
    {
      rejectionReason: input.rejectionReason,
    }
  )
  return response.data.data.status
}
