import { useState, useEffect } from 'react';
import { getAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import { getUserNameFromToken } from '@/lib/jwt';
import { travelApi } from '@/infrastructure/http/axiosInstance';

interface CurrentUser {
  name: string | null;
  isLoading: boolean;
}

export function useCurrentUser(): CurrentUser {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserName() {
      setIsLoading(true);
      try {
        // Primero intentar obtener el nombre del token JWT
        const token = getAccessToken();
        const nameFromToken = getUserNameFromToken(token);

        if (nameFromToken) {
          setUserName(nameFromToken);
          setIsLoading(false);
          return;
        }

        // Si no está en el token, intentar obtenerlo del backend
        try {
          const response = await travelApi.get<{
            data: {
              name?: string;
              nombre?: string;
              firstName?: string;
              paternalSurname?: string;
              maternalSurname?: string;
            };
            message: string;
            error: null;
          }>('/auth/me');

          const userData = response.data.data;
          const fullName =
            userData.name ||
            userData.nombre ||
            (userData.firstName && userData.paternalSurname && userData.maternalSurname
              ? `${userData.firstName} ${userData.paternalSurname} ${userData.maternalSurname}`
              : userData.firstName ||
                userData.paternalSurname ||
                null);

          setUserName(fullName);
        } catch (apiError) {
          // Si el endpoint no existe o falla, usar el email del token como fallback
          const token = getAccessToken();
          const payload = token ? getUserNameFromToken(token) : null;
          setUserName(payload || 'Usuario');
        }
      } catch (error) {
        console.error('Error obteniendo nombre de usuario:', error);
        setUserName('Usuario');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserName();
  }, []);

  return {
    name: userName,
    isLoading,
  };
}

