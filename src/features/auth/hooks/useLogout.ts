import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { setAccessToken } from '@/infrastructure/http/interceptors/interceptors';

export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.logout();
      setAccessToken(null);
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      setError('Error al cerrar sesión. Por favor, intenta nuevamente.');
      setAccessToken(null);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
};
