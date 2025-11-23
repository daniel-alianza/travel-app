import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import { authService } from '@/features/auth/services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Primero verificar si hay token en memoria
      const tokenInMemory = getAccessToken();

      if (tokenInMemory) {
        // Si hay token en memoria, el usuario está autenticado
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Si no hay token en memoria, verificar si hay sesión válida en cookies
      try {
        const isValid = await authService.validateSession();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (isAuthenticated === false) {
    return <Navigate to='/login' replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

export { ProtectedRoute };
