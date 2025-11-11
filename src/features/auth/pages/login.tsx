import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogIn, Mail, Lock } from "lucide-react"

interface LoginFormData {
  email: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const submitForm = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implementar lógica de autenticación real con API
      console.log("Login data:", data)
      // Simular autenticación
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Guardar token en localStorage (temporal, luego usar cookies)
      localStorage.setItem("token", "mock-token-123")
      navigate("/home")
    } catch (error) {
      console.error("Error en login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-16 md:mb-24 space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/30 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-semibold text-primary">Inicio de Sesión</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
              Bienvenido al{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Portal Grupo FG
              </span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto text-pretty">
              Ingresa tus credenciales para acceder al sistema de viáticos
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
                <CardDescription className="text-center">
                  Ingresa tu correo electrónico y contraseña
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="pl-10"
                        {...register("email", {
                          required: "El correo electrónico es requerido",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Correo electrónico inválido",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...register("password", {
                          required: "La contraseña es requerida",
                          minLength: {
                            value: 6,
                            message: "La contraseña debe tener al menos 6 caracteres",
                          },
                        })}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-orange text-white shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LoginPage

