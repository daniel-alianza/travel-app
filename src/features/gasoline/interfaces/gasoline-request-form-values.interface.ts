import type { z } from "zod"

import type { gasolineRequestFormSchema } from "@/features/gasoline/schemas/gasoline-request-form.schema"

export type GasolineRequestFormValues = z.infer<
  typeof gasolineRequestFormSchema
>
