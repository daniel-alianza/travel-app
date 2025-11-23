import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LogIn, Mail, Lock, Building2, UserPlus } from 'lucide-react';
import type { LoginFormProps } from '../interfaces/LoginFormProps';

export const LoginForm = ({
  register,
  errors,
  isLoading,
  error,
  onSubmit,
}: LoginFormProps) => {
  const navigate = useNavigate();

  return (
    <div className='flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5'>
      <div className='w-full max-w-md'>
        <div className='lg:hidden mb-8 text-center'>
          <div className='inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-orange mb-4 shadow-lg'>
            <Building2 className='h-7 w-7 text-white' />
          </div>
          <h1 className='text-2xl font-bold text-foreground mb-2'>
            Portal Grupo FG
          </h1>
          <p className='text-sm text-muted-foreground'>Sistema de Viáticos</p>
        </div>

        <Card className='border-0 shadow-2xl bg-card/95 backdrop-blur-sm'>
          <CardContent className='p-8 sm:p-10'>
            <div className='mb-8'>
              <h2 className='text-3xl font-bold text-foreground mb-2'>
                Bienvenido
              </h2>
              <p className='text-muted-foreground'>
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {error && (
              <div className='mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20'>
                <p className='text-sm text-destructive font-medium'>{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <label
                  htmlFor='email'
                  className='text-sm font-semibold text-foreground flex items-center gap-2'
                >
                  <Mail className='h-4 w-4 text-primary' />
                  Correo Electrónico
                </label>
                <div className='relative'>
                  <Input
                    id='email'
                    type='email'
                    placeholder='correo@ejemplo.com'
                    className={`h-12 pl-4 pr-4 text-base transition-all ${
                      errors.email
                        ? 'border-destructive focus-visible:ring-destructive'
                        : 'focus-visible:ring-primary'
                    }`}
                    {...register('email', {
                      required: 'El correo electrónico es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo electrónico inválido',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className='text-sm text-destructive font-medium'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='password'
                  className='text-sm font-semibold text-foreground flex items-center gap-2'
                >
                  <Lock className='h-4 w-4 text-primary' />
                  Contraseña
                </label>
                <div className='relative'>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    className={`h-12 pl-4 pr-4 text-base transition-all ${
                      errors.password
                        ? 'border-destructive focus-visible:ring-destructive'
                        : 'focus-visible:ring-primary'
                    }`}
                    {...register('password', {
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 6,
                        message: 'La contraseña debe tener al menos 6 caracteres',
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <p className='text-sm text-destructive font-medium'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type='submit'
                className='w-full h-12 gradient-orange text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98]'
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className='flex items-center justify-center gap-2'>
                    <LogIn className='h-5 w-5' />
                    Iniciar Sesión
                  </span>
                )}
              </Button>
            </form>

            <div className='mt-4'>
              <Button
                type='button'
                variant='outline'
                className='w-full h-12 border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98]'
                onClick={() => navigate('/register')}
              >
                <span className='flex items-center justify-center gap-2'>
                  <UserPlus className='h-5 w-5' />
                  Crear Cuenta
                </span>
              </Button>
            </div>

            <div className='mt-8 pt-6 border-t border-border'>
              <p className='text-xs text-center text-muted-foreground'>
                Al ingresar, aceptas nuestros términos y condiciones de uso
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
