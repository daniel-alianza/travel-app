import type { FormEvent } from "react"

export type FocusedField = "email" | "password" | null

export interface MousePosition {
  x: number
  y: number
}

export interface LoginPageState {
  showPassword: boolean
  isLoading: boolean
  mounted: boolean
  focusedField: FocusedField
  mousePosition: MousePosition
}

export interface LoginPageActions {
  setFocusedField: (field: FocusedField) => void
  handlePasswordVisibility: () => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}
