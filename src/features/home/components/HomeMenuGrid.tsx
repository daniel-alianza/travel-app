import { ChevronRight } from "lucide-react"

import type { HomeMenuOption } from "../interfaces/home-menu-option.interface"

interface HomeMenuGridProps {
  mounted: boolean
  hoveredCard: number | null
  menuOptions: HomeMenuOption[]
  onMenuOptionSelect: (option: HomeMenuOption) => void
  onCardEnter: (id: number) => void
  onCardLeave: () => void
}

export function HomeMenuGrid({
  mounted,
  hoveredCard,
  menuOptions,
  onMenuOptionSelect,
  onCardEnter,
  onCardLeave,
}: HomeMenuGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {menuOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onMenuOptionSelect(option)}
          onMouseEnter={() => onCardEnter(option.id)}
          onMouseLeave={onCardLeave}
          className={`group relative cursor-pointer rounded-3xl border-2 border-transparent bg-card p-6 text-left transition-all duration-700 ease-out hover:border-primary/20 sm:p-7 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          style={{
            transitionDelay: `${option.delay}ms`,
            transform:
              hoveredCard === option.id
                ? "translateY(-8px) scale(1.02)"
                : "translateY(0) scale(1)",
            boxShadow:
              hoveredCard === option.id
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${option.color} opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-10`}
          />

          <div
            className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${option.color} shadow-lg ${option.shadowColor} transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl sm:h-16 sm:w-16`}
          >
            <option.icon className="h-7 w-7 text-white transition-all duration-500 group-hover:scale-110 sm:h-8 sm:w-8" />

            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </div>
          </div>

          <div className="relative flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-card-foreground transition-colors duration-500 group-hover:text-primary sm:text-xl">
                {option.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-muted-foreground/80">
                {option.description}
              </p>
            </div>

            <div className="shrink-0">
              <div className="flex h-10 w-10 -rotate-45 items-center justify-center rounded-xl bg-secondary/80 transition-all duration-500 group-hover:scale-110 group-hover:rotate-0 group-hover:bg-primary">
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-primary-foreground" />
              </div>
            </div>
          </div>

          <div
            className={`absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r ${option.color} transition-all duration-700 group-hover:w-1/2`}
          />
        </button>
      ))}
    </div>
  )
}
