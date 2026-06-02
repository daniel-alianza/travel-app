import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface FinancialAuthorizationPillSelectOption {
  value: string
  label: string
}

interface FinancialAuthorizationPillSelectProps {
  id?: string
  value: string
  placeholder: string
  options: ReadonlyArray<FinancialAuthorizationPillSelectOption>
  onChange: (value: string) => void
  className?: string
  dropdownClassName?: string
  disabled?: boolean
  ariaLabel?: string
}

export function FinancialAuthorizationPillSelect({
  id,
  value,
  placeholder,
  options,
  onChange,
  className,
  dropdownClassName,
  disabled = false,
  ariaLabel,
}: FinancialAuthorizationPillSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuRect, setMenuRect] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const selectedLabel = options.find((option) => option.value === value)?.label

  function actualizarPosicionMenu(): void {
    const trigger = triggerRef.current
    if (trigger === null) {
      return
    }
    const rect = trigger.getBoundingClientRect()
    setMenuRect({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    })
  }

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuRect(null)
      return
    }
    actualizarPosicionMenu()
    window.addEventListener("resize", actualizarPosicionMenu)
    window.addEventListener("scroll", actualizarPosicionMenu, true)
    return () => {
      window.removeEventListener("resize", actualizarPosicionMenu)
      window.removeEventListener("scroll", actualizarPosicionMenu, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    function handlePointerDown(event: PointerEvent): void {
      const target = event.target as Node
      if (containerRef.current?.contains(target)) {
        return
      }
      if (menuRef.current?.contains(target)) {
        return
      }
      setIsOpen(false)
    }
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const menuContent = (
    <div
      ref={menuRef}
      role="listbox"
      aria-hidden={!isOpen}
      style={
        menuRect !== null
          ? {
              position: "fixed",
              top: menuRect.top,
              left: menuRect.left,
              width: menuRect.width,
              zIndex: 9999,
            }
          : undefined
      }
      className={cn(
        "origin-top overflow-hidden rounded-3xl border border-border/80 bg-card py-2 shadow-xl transition-all duration-300",
        isOpen && menuRect !== null
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0",
        dropdownClassName,
      )}
    >
      <div className="max-h-56 overflow-y-auto py-1">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-center px-6 py-3.5 text-sm transition-colors duration-200",
                "text-foreground hover:bg-muted/70",
                selected && "bg-primary/10 font-medium text-primary",
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "group flex h-11 w-full cursor-pointer items-center justify-between rounded-full border border-primary/60 bg-background px-4 text-left text-sm shadow-sm transition-all duration-300",
          "hover:-translate-y-px hover:border-primary hover:shadow-md focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "border-primary shadow-md ring-2 ring-primary/15",
        )}
      >
        <span
          className={cn(
            "truncate pr-2",
            selectedLabel ? "font-medium text-foreground" : "text-primary/80",
          )}
        >
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-primary transition-transform duration-300",
            isOpen && "-rotate-180",
          )}
          aria-hidden
        />
      </button>

      {typeof document !== "undefined" && isOpen
        ? createPortal(menuContent, document.body)
        : null}
    </div>
  )
}
