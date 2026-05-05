import {
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query"

import { travelApi } from "@/api/travel-api"

export const DAYS_UNTIL_MONTH_END_QUERY_KEY = [
  "common",
  "days-until-month-end",
] as const

type DaysUntilMonthEndResponseBody = {
  data: {
    daysUntilMonthEnd: number
    timeZone: string
  }
  message: string
  error: string | null
}

export function useDaysUntilMonthEndQuery(): UseQueryResult<number, Error> {
  return useQuery({
    queryKey: DAYS_UNTIL_MONTH_END_QUERY_KEY,
    queryFn: async (): Promise<number> => {
      const response = await travelApi.get<DaysUntilMonthEndResponseBody>(
        "/common/days-until-month-end",
      )
      return response.data.data.daysUntilMonthEnd
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
