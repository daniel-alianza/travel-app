import type { FieldValues, Path, UseFormRegister } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { VIATIC_CATEGORY_OPTIONS } from "@/features/travel-expenses/data/viatic-category-options"
import { cn } from "@/lib/utils"

interface ExpenseViaticCategorySelectProps<T extends FieldValues> {
  id: string
  fieldName: Path<T>
  register: UseFormRegister<T>
  error?: string
}

export function ExpenseViaticCategorySelect<T extends FieldValues>({
  id,
  fieldName,
  register,
  error,
}: ExpenseViaticCategorySelectProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground">
        Tipo de gasto <span className="text-destructive">*</span>
      </Label>
      <select
        id={id}
        className={cn(
          "flex h-11 w-full rounded-2xl border-2 border-input bg-background/80 px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive/60"
        )}
        {...register(fieldName)}
      >
        <option value="">Selecciona el tipo</option>
        {VIATIC_CATEGORY_OPTIONS.map((nombre) => (
          <option key={nombre} value={nombre}>
            {nombre === "AUTOBUS"
              ? "AUTOBUS (ida y vuelta: 2 XML y 2 PDF)"
              : nombre}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
