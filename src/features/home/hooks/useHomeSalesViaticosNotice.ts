import { useQuery } from "@tanstack/react-query"

import { useAuthStore } from "@/features/auth/store/authStore"
import type { HomeSalesViaticosNoticeModel } from "@/features/home/interfaces/home-sales-viaticos-notice.interface"
import { fetchSalesViaticosHomeNotice } from "@/features/home/services/home-sales-viaticos-api"

export const SALES_VIATICOS_HOME_NOTICE_QUERY_KEY = [
  "common",
  "sales-viaticos-home-notice",
] as const

interface UseHomeSalesViaticosNoticeReturn {
  avisoViaticosVentas: HomeSalesViaticosNoticeModel | null
  cargandoAviso: boolean
}

export function useHomeSalesViaticosNotice(): UseHomeSalesViaticosNoticeReturn {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const avisoQuery = useQuery({
    queryKey: SALES_VIATICOS_HOME_NOTICE_QUERY_KEY,
    queryFn: fetchSalesViaticosHomeNotice,
    enabled: isAuthenticated,
    staleTime: 60_000,
  })

  const avisoViaticosVentas =
    avisoQuery.isSuccess && avisoQuery.data.visible ? avisoQuery.data : null

  return {
    avisoViaticosVentas,
    cargandoAviso: isAuthenticated && avisoQuery.isPending,
  }
}
