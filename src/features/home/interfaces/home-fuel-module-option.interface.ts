import type { ComponentType } from "react"

export interface HomeFuelModuleOption {
  id: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  href: string | null
}
