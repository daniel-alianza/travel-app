import type {
  FocusedField,
  MousePosition,
} from "@/features/auth/interfaces/login.interface"

interface LoginCursorProps {
  focusedField: FocusedField
  mousePosition: MousePosition
}

export function LoginCursor(props: LoginCursorProps) {
  const { focusedField, mousePosition } = props

  return (
    <div
      className="pointer-events-none fixed z-50 h-6 w-6 mix-blend-difference transition-transform duration-150 ease-out"
      style={{
        left: mousePosition.x - 12,
        top: mousePosition.y - 12,
        transform: `scale(${focusedField ? 1.5 : 1})`,
      }}
    >
      <div className="h-full w-full animate-pulse rounded-full bg-accent/50" />
    </div>
  )
}
