import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import { authService } from '@/features/auth/services/authService';
import { useTermsAcceptance } from '@/hooks/useTermsAcceptance';
import { TermsAndConditionsModal } from '@/components/TermsAndConditionsModal';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showModal, hasAccepted, acceptPolicies } = useTermsAcceptance();

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

  // Si está autenticado, mostrar el contenido con el modal de políticas si es necesario
  // El contenido solo se muestra si el usuario ha aceptado las políticas
  return (
    <>
      {isAuthenticated && (
        <TermsAndConditionsModal
          open={showModal}
          onAccept={acceptPolicies}
        />
      )}
      {isAuthenticated && !showModal && children}
    </>
  );
};

export { ProtectedRoute };
