import type { ComponentType } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Label } from "@/components/ui/label"

interface TravelRequestSelectDropdownProps {
  label: string
  value: string
  options: readonly string[] | undefined
  onChange: (value: string) => void
  placeholder: string
  icon: ComponentType<{ className?: string }>
  id: string
  disabled?: boolean
  dropdownOpen: string | null
  setDropdownOpen: (value: string | null) => void
  focusedField: string | null
  setFocusedField: (value: string | null) => void
  showChevron?: boolean
  onOpen?: () => void
  error?: string | null
}

export function TravelRequestSelectDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  icon: Icon,
  id,
  disabled = false,
  dropdownOpen,
  setDropdownOpen,
  focusedField,
  setFocusedField,
  showChevron = true,
  onOpen,
  error = null,
}: TravelRequestSelectDropdownProps) {
  const safeOptions = options ?? []

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (dropdownOpen === id) {
              setDropdownOpen(null)
              return
            }
            onOpen?.()
            setDropdownOpen(id)
          }}
          onFocus={() => setFocusedField(id)}
          onBlur={() => {
            setFocusedField(null)
            setTimeout(() => setDropdownOpen(null), 200)
          }}
          aria-invalid={Boolean(error)}
          className={`group flex h-12 w-full items-center justify-between rounded-2xl border-2 bg-card px-4 text-left transition-all duration-500 ${
            disabled
              ? "cursor-not-allowed border-border opacity-50"
              : error
                ? "border-destructive/70 shadow-md shadow-destructive/10"
                : focusedField === id
                  ? "scale-[1.01] border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:shadow-md"
          }`}
        >
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {value || placeholder}
          </span>
          {showChevron ? (
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-all duration-500 ${dropdownOpen === id ? "rotate-180 text-primary" : "group-hover:text-primary"}`}
            />
          ) : null}
        </button>

        <div
          className={`absolute z-50 mt-2 w-full origin-top overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl transition-all duration-500 ${
            dropdownOpen === id
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="max-h-48 overflow-y-auto py-2">
            {safeOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(option)
                  setDropdownOpen(null)
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-300 hover:bg-primary/10 ${
                  value === option
                    ? "bg-primary/5 text-primary"
                    : "text-foreground"
                }`}
              >
                {value === option && <Check className="h-4 w-4 text-primary" />}
                <span className={value === option ? "" : "ml-7"}>{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {error ? (
        <span className="block text-xs text-destructive">{error}</span>
      ) : null}
    </div>
  )
}
