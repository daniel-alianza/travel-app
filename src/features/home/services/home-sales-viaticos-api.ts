import { travelApi } from "@/api/travel-api"
import type { HomeSalesViaticosNoticeModel } from "@/features/home/interfaces/home-sales-viaticos-notice.interface"

type ApiEnvelope<T> = {
  data: T
  message: string
}

export async function fetchSalesViaticosHomeNotice(): Promise<HomeSalesViaticosNoticeModel> {
  const respuesta = await travelApi.get<ApiEnvelope<HomeSalesViaticosNoticeModel>>(
    "/common/sales-viaticos-home-notice",
  )
  return respuesta.data.data
}
