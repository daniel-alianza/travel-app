import { useState, useMemo } from 'react';
import type { User, Card, CardAssignmentFormData } from '../interfaces';

const useUsersCards = () => {
  // Datos de ejemplo - en producción vendrían de un servicio/API
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user1',
      nombre: 'Juan Pérez',
      email: 'juan.perez@grupofg.com.mx',
      compania: 'Grupo FG',
      activo: true,
      tarjetas: [
        {
          id: 'card1',
          numero: '4532123456789012',
          banco: 'Banco Nacional',
          fechaVencimiento: '2025-12-31',
          limiteCredito: 50000,
          saldoDisponible: 45000,
          estado: 'activa',
          fechaAsignacion: '2024-01-15',
        },
        {
          id: 'card2',
          numero: '5123456789012345',
          banco: 'Banco Comercial',
          fechaVencimiento: '2026-06-30',
          limiteCredito: 30000,
          saldoDisponible: 28000,
          estado: 'activa',
          fechaAsignacion: '2024-02-01',
        },
      ],
    },
    {
      id: 'user2',
      nombre: 'María González',
      email: 'maria.gonzalez@grupofg.com.mx',
      compania: 'Grupo FG',
      activo: true,
      tarjetas: [
        {
          id: 'card3',
          numero: '4111111111111111',
          banco: 'Banco Nacional',
          fechaVencimiento: '2025-08-31',
          limiteCredito: 40000,
          saldoDisponible: 35000,
          estado: 'activa',
          fechaAsignacion: '2024-01-20',
        },
      ],
    },
    {
      id: 'user3',
      nombre: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@otraempresa.com.mx',
      compania: 'Otra Empresa',
      activo: true,
      tarjetas: [],
    },
  ]);

  const [availableCards, setAvailableCards] = useState<Card[]>([
    {
      id: 'card5',
      numero: '6011111111111111',
      banco: 'Banco Comercial',
      fechaVencimiento: '2026-12-31',
      limiteCredito: 50000,
      saldoDisponible: 50000,
      estado: 'desactivada',
      fechaAsignacion: '2023-11-01',
      fechaDesactivacion: '2024-01-05',
    },
    {
      id: 'card6',
      numero: '7000000000000000',
      banco: 'Banco Nacional',
      fechaVencimiento: '2027-01-31',
      limiteCredito: 60000,
      saldoDisponible: 60000,
      estado: 'desactivada',
      fechaAsignacion: '2023-10-15',
      fechaDesactivacion: '2024-01-08',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
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

  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(users.map(u => u.compania)));
    return uniqueCompanies;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filtro por búsqueda (nombre o email)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          user.nombre.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtro por compañía
      if (selectedCompany !== 'all' && user.compania !== selectedCompany) {
        return false;
      }

      return true;
    });
  }, [users, searchTerm, selectedCompany]);

  const getAvailableCardsForAssignment = () => {
    return availableCards
      .filter(card => card.estado === 'desactivada')
      .map(card => ({ id: card.id, numero: card.numero }));
  };

  const assignCard = async (data: CardAssignmentFormData) => {
    if (!data.usuarioId) return;

    setIsLoading(true);
    try {
      // Aquí iría la llamada al servicio/API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar estado local
      const card = availableCards.find(c => c.id === data.tarjetaId);
      if (card) {
        const updatedCard: Card = {
          ...card,
          estado: 'activa',
          fechaAsignacion: data.fechaAsignacion || new Date().toISOString().split('T')[0],
          fechaDesactivacion: undefined,
        };

        // Remover tarjeta de disponibles y agregar al usuario
        setAvailableCards(prev => prev.filter(c => c.id !== data.tarjetaId));
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === data.usuarioId
              ? { ...user, tarjetas: [...user.tarjetas, updatedCard] }
              : user
          )
        );
      }

      setAssignDialogOpen(false);
      setSelectedUserId(null);
      setMessageDialog({
        open: true,
        type: 'success',
        title: 'Tarjeta Asignada',
        message: 'La tarjeta ha sido asignada exitosamente al usuario.',
      });
    } catch (error) {
      console.error('Error al asignar tarjeta:', error);
      setMessageDialog({
        open: true,
        type: 'error',
        title: 'Error al Asignar',
        message: 'Ocurrió un error al asignar la tarjeta. Por favor, intenta nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateCard = (userId: string, cardId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Desactivar Tarjeta',
      message:
        '¿Estás seguro de desactivar esta tarjeta? Se desactivará automáticamente si el usuario es eliminado.',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          // Aquí iría la llamada al servicio/API
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Buscar la tarjeta a desactivar
          const user = users.find(u => u.id === userId);
          const cardToDeactivate = user?.tarjetas.find(c => c.id === cardId);

          if (cardToDeactivate) {
            const deactivatedCard: Card = {
              ...cardToDeactivate,
              estado: 'desactivada',
              fechaDesactivacion: new Date().toISOString().split('T')[0],
            };

            // Remover tarjeta del usuario y agregar a disponibles
            setUsers(prevUsers =>
              prevUsers.map(user =>
                user.id === userId
                  ? {
                      ...user,
                      tarjetas: user.tarjetas.filter(card => card.id !== cardId),
                    }
                  : user
              )
            );

            // Agregar a tarjetas disponibles
            setAvailableCards(prev => [...prev, deactivatedCard]);

            setMessageDialog({
              open: true,
              type: 'success',
              title: 'Tarjeta Desactivada',
              message: 'La tarjeta ha sido desactivada exitosamente.',
            });
          }
        } catch (error) {
          console.error('Error al desactivar tarjeta:', error);
          setMessageDialog({
            open: true,
            type: 'error',
            title: 'Error al Desactivar',
            message:
              'Ocurrió un error al desactivar la tarjeta. Por favor, intenta nuevamente.',
          });
        } finally {
          setIsLoading(false);
        }
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

  const openViewCardsDialog = (userId: string, mode: 'view' | 'remove' = 'view') => {
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
  };
};

export default useUsersCards;

