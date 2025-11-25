import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import type { TravelRequestFormData } from '../interfaces';
import { travelRequestService } from '../services/travelRequestService';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';
import { travelApi } from '@/infrastructure/http/axiosInstance';
import { getAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import { decodeJWT } from '@/lib/jwt';

interface BackendCardAssignment {
  id: number;
  cardId: number;
  userId: number;
  assignedAt: string;
  unassignedAt: string | null;
  card: {
    id: number;
    cardNumber: string;
    company?: {
      id: number;
      name: string;
    };
  };
}

interface ApiResponse<T> {
  data: T;
  message: string;
  error: null;
}

const defaultValues: TravelRequestFormData = {
  empresa: '',
  sucursal: '',
  area: '',
  tarjeta: '',
  motivo: '',
  fechaSalida: '',
  fechaRegreso: '',
  fechaDispersion: '',
  expenses: {
    transporte: '',
    peajes: '',
    hospedaje: '',
    alimentos: '',
    fletes: '',
    herramientas: '',
    envios: '',
    miscelaneos: '',
  },
  objectives: [{ value: '' }, { value: '' }, { value: '' }],
};

const useTravelRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userCards, setUserCards] = useState<
    Array<{ id: string; numero: string; cardId: number; company?: string }>
  >([]);
  const { register, handleSubmit, watch, control, setValue, reset } =
    useForm<TravelRequestFormData>({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'objectives',
  });
  const expenses = watch('expenses');
  const selectedCard = watch('tarjeta');
  const { profile, isLoading: isLoadingProfile } = useUserProfile();

  useEffect(() => {
    if (profile && !isLoadingProfile) {
      if (profile.company?.name) {
        setValue('empresa', profile.company.name);
      }
      if (profile.branch?.name) {
        setValue('sucursal', profile.branch.name);
      }
      if (profile.area?.name) {
        setValue('area', profile.area.name);
      }
    }
  }, [profile, isLoadingProfile, setValue]);

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const token = getAccessToken();
        if (!token) return;

        const payload = decodeJWT(token);
        if (!payload || !payload.sub) return;

        const userId = Number.parseInt(payload.sub, 10);
        if (Number.isNaN(userId)) return;

        // Usar el endpoint bulk para obtener las asignaciones del usuario
        const assignmentsResponse = await travelApi.get<
          ApiResponse<BackendCardAssignment[]>
        >('/cards/assignments/bulk', {
          params: {
            userIds: String(userId),
            limit: 100,
            offset: 0,
          },
        });

        // Filtrar solo las tarjetas activas (sin unassignedAt) y del usuario actual
        const activeAssignments = assignmentsResponse.data.data.filter(
          assignment =>
            !assignment.unassignedAt && assignment.userId === userId,
        );

        // Mapear las asignaciones a tarjetas
        // Si el backend incluye la compañía en la respuesta, usarla; si no, usar la del perfil del usuario
        const cards = activeAssignments.map(assignment => ({
          id: String(assignment.card.id),
          numero: assignment.card.cardNumber,
          cardId: assignment.card.id,
          company:
            assignment.card.company?.name || profile?.company?.name || '',
        }));

        setUserCards(cards);

        // Si solo hay una tarjeta, establecerla automáticamente
        if (cards.length === 1) {
          setValue('tarjeta', cards[0].numero);
        }
      } catch (error) {
        console.error('Error obteniendo tarjetas del usuario:', error);
      }
    }

    // Solo ejecutar cuando el perfil esté cargado para tener acceso a la compañía del usuario
    if (!isLoadingProfile) {
      fetchUserCards();
    }
  }, [setValue, profile, isLoadingProfile]);

  const addObjective = () => fields.length < 5 && append({ value: '' });
  const removeObjective = (index: number) => fields.length > 3 && remove(index);
  const calculateTotal = () =>
    Object.values(expenses).reduce(
      (sum, val) => sum + (Number.parseFloat(val) || 0),
      0,
    );

  const submitForm = async (data: TravelRequestFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Obtener el userId del token JWT
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

      // Obtener el cardId de la tarjeta seleccionada
      if (!selectedCard) {
        throw new Error('Por favor, selecciona una tarjeta');
      }

      const selectedCardData = userCards.find(
        card => card.numero === selectedCard,
      );
      if (!selectedCardData) {
        throw new Error('La tarjeta seleccionada no es válida');
      }

      // Crear la solicitud de viaje
      await travelRequestService.createTravelRequest(
        data,
        userId,
        selectedCardData.cardId,
      );

      setSuccess(true);
      // Resetear el formulario después de un éxito
      reset(defaultValues);
    } catch (err) {
      console.error('Error al enviar formulario:', err);

      let errorMessage =
        'Error al crear la solicitud de viaje. Por favor, intenta nuevamente.';

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSuccess = () => {
    setSuccess(false);
  };

  const resetError = () => {
    setError(null);
  };

  return {
    register,
    onSubmit: handleSubmit(submitForm),
    fields,
    addObjective,
    removeObjective,
    calculateTotal,
    isLoading,
    userCards,
    error,
    success,
    resetSuccess,
    resetError,
  };
};

export default useTravelRequestForm;
