import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { travelApi } from "@/api/travel-api"
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

interface LoginApiResponse {
  data: {
    userId: number
    accessToken: string
    expiresInSeconds: number
    role: string
    permisos?: readonly string[]
  }
  message: string
  error?: unknown
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
    const password =
      event.currentTarget.querySelector<HTMLInputElement>("#password")?.value ??
      ""
    const correoNormalizado = correo.trim().toLowerCase()

    if (correoNormalizado.length === 0 || password.length === 0) {
      return
    }

    setIsLoading(true)
    try {
      const response = await travelApi.post<LoginApiResponse>("/auth/login", {
        email: correoNormalizado,
        password,
      })

      login({
        correo: correoNormalizado,
        userId: response.data.data.userId,
        rol: response.data.data.role,
        permisos: response.data.data.permisos ?? [],
      })
      navigate("/home")
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return
      }
      return
    } finally {
      setIsLoading(false)
    }
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
