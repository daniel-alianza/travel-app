import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, Card, CardAssignmentFormData } from '../interfaces';
import { travelCardService } from '../services/travelCardService';

const useUsersCards = () => {
  const queryClient = useQueryClient();

  const { data: usersWithCardsData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-with-cards'],
    queryFn: travelCardService.getUsersWithCards,
    retry: 1,
    staleTime: 30 * 1000,
  });

  const users = usersWithCardsData?.users ?? [];
  const allCards = usersWithCardsData?.cards ?? [];
  const isLoadingCards = false;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({
    open: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [viewCardsDialog, setViewCardsDialog] = useState<{
    open: boolean;
    userId: string | null;
    mode: 'view' | 'remove';
  }>({
    open: false,
    userId: null,
    mode: 'view',
  });
  const [createCardDialogOpen, setCreateCardDialogOpen] = useState(false);

  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(users.map(u => u.compania)));
    return uniqueCompanies;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          user.nombre.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (selectedCompany !== 'all' && user.compania !== selectedCompany) {
        return false;
      }

      return true;
    });
  }, [users, searchTerm, selectedCompany]);

  const getAvailableCardsForAssignment = () => {
    const assignedCardIds = new Set(
      users.flatMap(user =>
        user.tarjetas.filter(t => t.estado === 'activa').map(t => t.id),
      ),
    );

    return allCards
      .filter(card => !assignedCardIds.has(card.id))
      .map(card => ({ id: card.id, numero: card.numero }));
  };
  const assignCardMutation = useMutation({
    mutationFn: travelCardService.assignCard,
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: ['users-with-cards'] });

      const previousData = queryClient.getQueryData<{
        users: User[];
        cards: Card[];
      }>(['users-with-cards']);

      if (previousData) {
        const userId = data.usuarioId;
        const cardId = data.tarjetaId;
        const card = previousData.cards.find(c => c.id === cardId);

        if (card) {
          const updatedCard: Card = {
            ...card,
            estado: 'activa',
            fechaAsignacion: data.fechaAsignacion,
          };

          const updatedUsers = previousData.users.map(user => {
            const filteredTarjetas = user.tarjetas.filter(t => t.id !== cardId);
            if (user.id === userId) {
              return {
                ...user,
                tarjetas: [...filteredTarjetas, updatedCard],
              };
            }
            return {
              ...user,
              tarjetas: filteredTarjetas,
            };
          });

          queryClient.setQueryData(['users-with-cards'], {
            ...previousData,
            users: updatedUsers,
          });
        }
      }

      return { previousData };
    },
    onSuccess: () => {
      setAssignDialogOpen(false);
      setSelectedUserId(null);
      setMessageDialog({
        open: true,
        type: 'success',
        title: 'Tarjeta Asignada',
        message: 'La tarjeta ha sido asignada exitosamente al usuario.',
      });
    },
    onError: (error, data, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['users-with-cards'], context.previousData);
      }
      setMessageDialog({
        open: true,
        type: 'error',
        title: 'Error al Asignar',
        message:
          'Ocurrió un error al asignar la tarjeta. Por favor, intenta nuevamente.',
      });
    },
  });
  const unassignCardMutation = useMutation({
    mutationFn: ({ cardId, userId }: { cardId: number; userId: number }) =>
      travelCardService.unassignCard(cardId, userId),
    onMutate: async ({ cardId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['users-with-cards'] });

      const previousData = queryClient.getQueryData<{
        users: User[];
        cards: Card[];
      }>(['users-with-cards']);

      if (previousData) {
        const updatedUsers = previousData.users.map(user => {
          if (user.id === String(userId)) {
            return {
              ...user,
              tarjetas: user.tarjetas.filter(
                card => card.id !== String(cardId),
              ),
            };
          }
          return user;
        });

        queryClient.setQueryData(['users-with-cards'], {
          ...previousData,
          users: updatedUsers,
        });
      }

      return { previousData };
    },
    onSuccess: () => {
      setMessageDialog({
        open: true,
        type: 'success',
        title: 'Tarjeta Desactivada',
        message: 'La tarjeta ha sido desactivada exitosamente.',
      });
    },
    onError: (error, data, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['users-with-cards'], context.previousData);
      }
      setMessageDialog({
        open: true,
        type: 'error',
        title: 'Error al Desactivar',
        message:
          'Ocurrió un error al desactivar la tarjeta. Por favor, intenta nuevamente.',
      });
    },
  });

  const createCardMutation = useMutation({
    mutationFn: ({ numero, companyId }: { numero: string; companyId: string }) =>
      travelCardService.createCard(numero, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-cards'] });
      setCreateCardDialogOpen(false);
      setMessageDialog({
        open: true,
        type: 'success',
        title: 'Tarjeta Creada',
        message: 'La tarjeta ha sido creada exitosamente.',
      });
    },
    onError: () => {
      setMessageDialog({
        open: true,
        type: 'error',
        title: 'Error al Crear',
        message:
          'Ocurrió un error al crear la tarjeta. Por favor, intenta nuevamente.',
      });
    },
  });

  const isLoading =
    isLoadingUsers ||
    isLoadingCards ||
    assignCardMutation.isPending ||
    unassignCardMutation.isPending ||
    createCardMutation.isPending;

  const assignCard = async (data: CardAssignmentFormData) => {
    if (!data.usuarioId) return;
    assignCardMutation.mutate(data);
  };

  const deactivateCard = (userId: string, cardId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Desactivar Tarjeta',
      message:
        '¿Estás seguro de desactivar esta tarjeta? Se desactivará automáticamente si el usuario es eliminado.',
      onConfirm: () => {
        unassignCardMutation.mutate({
          cardId: Number(cardId),
          userId: Number(userId),
        });
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const openAssignDialog = (userId: string) => {
    setSelectedUserId(userId);
    setAssignDialogOpen(true);
  };

  const closeAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedUserId(null);
  };

  const openViewCardsDialog = (
    userId: string,
    mode: 'view' | 'remove' = 'view',
  ) => {
    setViewCardsDialog({
      open: true,
      userId,
      mode,
    });
  };

  const closeViewCardsDialog = () => {
    setViewCardsDialog({
      open: false,
      userId: null,
      mode: 'view',
    });
  };

  const createCard = (data: { numero: string; companyId: string }) => {
    createCardMutation.mutate(data);
  };

  const openCreateCardDialog = () => {
    setCreateCardDialogOpen(true);
  };

  const closeCreateCardDialog = () => {
    setCreateCardDialogOpen(false);
  };

  return {
    users: filteredUsers,
    companies,
    searchTerm,
    setSearchTerm,
    selectedCompany,
    setSelectedCompany,
    isLoading,
    assignDialogOpen,
    selectedUserId,
    selectedUserName: users.find(u => u.id === selectedUserId)?.nombre || '',
    availableCardsForAssignment: getAvailableCardsForAssignment(),
    assignCard,
    deactivateCard,
    openAssignDialog,
    closeAssignDialog,
    messageDialog,
    setMessageDialog,
    confirmDialog,
    setConfirmDialog,
    viewCardsDialog,
    openViewCardsDialog,
    closeViewCardsDialog,
    createCardDialogOpen,
    createCard,
    openCreateCardDialog,
    closeCreateCardDialog,
  };
};

export default useUsersCards;
