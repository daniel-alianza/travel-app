import { useState, type ReactElement } from "react"
import { BookOpen, ChevronDown } from "lucide-react"

import {
  REGLAS_CONCILIACION_VIATICOS,
} from "@/features/financial-authorization/constants/accounting-expenses-reconciliation-rules"
import { cn } from "@/lib/utils"

export function AccountingExpensesRulesPanel(): ReactElement {
  const [abierto, setAbierto] = useState(false)

  return (
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04] shadow-sm transition-shadow duration-300 hover:shadow-md">
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-300 hover:bg-primary/[0.06] sm:px-5"
        aria-expanded={abierto}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          Reglas de cálculo (referencia)
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-500",
            abierto && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out",
          abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-3 border-t border-primary/15 px-4 py-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 sm:px-5 sm:pb-5 lg:grid-cols-3">
            {Object.values(REGLAS_CONCILIACION_VIATICOS).map((regla) => (
              <li
                key={regla.titulo}
                className="rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 text-sm transition-all duration-300 hover:border-primary/25 hover:bg-card"
              >
                <p className="font-medium text-foreground">{regla.titulo}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {regla.descripcion}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
