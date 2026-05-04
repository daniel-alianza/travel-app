import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/features/auth/store/authStore"
import type {
  FocusedField,
  LoginPageActions,
  LoginPageState,
  MousePosition,
} from "@/features/auth/interfaces/login.interface"

interface UseLoginPageReturn {
  state: LoginPageState
  actions: LoginPageActions
}

export function useLoginPage(): UseLoginPageReturn {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [focusedField, setFocusedField] = useState<FocusedField>(null)
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  })
  const mounted = true

  useEffect(() => {
    function handleMouseMove(event: MouseEvent): void {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    const correo =
      event.currentTarget.querySelector<HTMLInputElement>("#email")?.value ?? ""
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    login(correo)
    navigate("/home")
  }

  function handlePasswordVisibility(): void {
    setShowPassword((previousValue) => !previousValue)
  }

  return {
    state: {
      showPassword,
      isLoading,
      mounted,
      focusedField,
      mousePosition,
    },
    actions: {
      setFocusedField,
      handlePasswordVisibility,
      handleSubmit,
    },
  }
}
