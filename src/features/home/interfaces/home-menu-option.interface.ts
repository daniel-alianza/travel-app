import type { ComponentType } from "react"

export interface HomeMenuOption {
  id: number
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  color: string
  shadowColor: string
  delay: number
  href: string
}
