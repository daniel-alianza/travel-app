import type { ComponentType } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TravelRequestGastoInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  icon: ComponentType<{ className?: string }>
  disabled?: boolean
  error?: string | null
}

export function TravelRequestGastoInput({
  label,
  value,
  onChange,
  icon: Icon,
  disabled = false,
  error = null,
}: TravelRequestGastoInputProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-primary/70" />
        {label}
      </Label>
      <div className="group relative">
        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
          $
        </span>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`h-12 rounded-2xl border-2 pl-8 transition-all duration-500 focus:scale-[1.02] focus:border-primary focus:shadow-lg focus:shadow-primary/20 ${error ? "border-destructive/70 focus:border-destructive focus:shadow-destructive/20" : ""}`}
        />
      </div>
      {error ? (
        <span className="block text-xs text-destructive">{error}</span>
      ) : null}
    </div>
  )
}
