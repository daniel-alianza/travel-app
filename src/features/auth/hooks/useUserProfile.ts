import { useState, useEffect, useRef } from 'react';
import { travelApi } from '@/infrastructure/http/axiosInstance';
import { getAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import { decodeJWT } from '@/lib/jwt';

interface UserProfile {
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  company: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
  };
  area: {
    id: number;
    name: string;
  };
}

interface UseUserProfileReturn {
  profile: UserProfile;
  isLoading: boolean;
  error: Error;
}

interface UserResponse {
  data: {
    id: number;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    email: string;
    isActive: boolean;
    company: {
      id: number;
      name: string;
    };
    branch: {
      id: number;
      name: string;
    };
    area: {
      id: number;
      name: string;
    };
    role: {
      id: number;
      name: string;
    };
    supervisor?: {
      id: number;
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  error: null;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    async function fetchUserProfile() {
      hasFetched.current = true;
      setIsLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No hay token de acceso disponible');
        }

        const payload = decodeJWT(token);
        if (!payload || !payload.sub) {
          throw new Error('No se pudo obtener el ID del usuario del token');
        }

        const userId = Number.parseInt(payload.sub, 10);
        if (Number.isNaN(userId)) {
          throw new Error('ID de usuario inválido en el token');
        }
        const response = await travelApi.get<UserResponse>(`/users/${userId}`);

        const userData = response.data.data;
        const normalizedProfile: UserProfile = {
          name: userData.name,
          paternalSurname: userData.paternalSurname,
          maternalSurname: userData.maternalSurname,
          company: userData.company,
          branch: userData.branch,
          area: userData.area,
        };

        setProfile(normalizedProfile);
      } catch (err) {
        console.error('Error obteniendo perfil de usuario:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
        hasFetched.current = false;
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  return {
    profile: profile as UserProfile,
    isLoading,
    error: error as Error,
  };
}
