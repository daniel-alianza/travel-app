import { LoginBrandPanel } from "@/features/auth/components/LoginBrandPanel"
import { LoginCursor } from "@/features/auth/components/LoginCursor"
import { LoginFormPanel } from "@/features/auth/components/LoginFormPanel"
import { useLoginPage } from "@/features/auth/hooks/useLogin"

export function LoginPage() {
  const { state, actions } = useLoginPage()
  const { mounted, focusedField, mousePosition, showPassword, isLoading } =
    state
  const { setFocusedField, handlePasswordVisibility, handleSubmit } = actions

  return (
    <div className="flex min-h-screen cursor-default overflow-hidden bg-background">
      <LoginCursor focusedField={focusedField} mousePosition={mousePosition} />
      <LoginBrandPanel mounted={mounted} />
      <LoginFormPanel
        mounted={mounted}
        focusedField={focusedField}
        mousePosition={mousePosition}
        showPassword={showPassword}
        isLoading={isLoading}
        onFocusedFieldChange={setFocusedField}
        onPasswordVisibilityChange={handlePasswordVisibility}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
