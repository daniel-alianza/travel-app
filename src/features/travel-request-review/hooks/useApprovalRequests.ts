import { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TravelRequest, ApprovalRequestsFilters } from '../interfaces';
import {
  travelRequestReviewService,
  getUserCompanyMap,
} from '../services/travelRequestReviewService';

const defaultFilters: ApprovalRequestsFilters = {
  searchTerm: '',
  companyFilter: 'all',
  statusFilter: 'pending', // Por defecto mostrar solo pendientes
  showDispersed: false,
  minAmount: '',
  maxAmount: '',
};

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const useApprovalRequests = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] =
    useState<ApprovalRequestsFilters>(defaultFilters);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    undefined,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  const prevStatusFilterRef = useRef<string>(filters.statusFilter);

  // Obtener el mapa de usuarios/compañías una vez y cachearlo
  const { data: companyMap = new Map<number, string>() } = useQuery({
    queryKey: ['user-company-map'],
    queryFn: getUserCompanyMap,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    gcTime: 10 * 60 * 1000, // Mantener en cache por 10 minutos
  });

  // Resetear página cuando cambia el filtro de estado y cancelar queries pendientes
  useEffect(() => {
    if (prevStatusFilterRef.current !== filters.statusFilter) {
      prevStatusFilterRef.current = filters.statusFilter;
      // Cancelar queries pendientes para evitar peticiones duplicadas
      queryClient.cancelQueries({ queryKey: ['travel-requests'] });
      setCurrentPage(1);
    }
  }, [filters.statusFilter, queryClient]);

  // Calcular statusId y offset de forma sincronizada
  const statusId = useMemo(() => {
    if (filters.statusFilter === 'pending') return 1;
    if (filters.statusFilter === 'approved') return 2;
    if (filters.statusFilter === 'rejected') return 3;
    // Si es 'all', retornar undefined para obtener todas
    return undefined;
  }, [filters.statusFilter]);
  const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['travel-requests', statusId, currentPage],
    queryFn: () =>
      travelRequestReviewService.getApprovalRequests(
        statusId,
        limit,
        offset,
        companyMap,
      ),
    retry: false,
    staleTime: 30 * 1000,
    enabled: companyMap.size > 0 || true, // Ejecutar incluso si el mapa está vacío
  });

  const requests = requestsData?.data ?? [];
  const pagination = requestsData?.pagination;

  const allRequests = requests;

  const calculateTotal = (
    expenses: TravelRequest['expenses'] | undefined | null,
  ) => {
    if (!expenses || typeof expenses !== 'object') {
      return 0;
    }
    return Object.values(expenses).reduce(
      (sum, val) => sum + (Number(val) || 0),
      0,
    );
  };

  const filteredRequests = useMemo(() => {
    const filtered = allRequests.filter(request => {
      // Filtro de dispersadas
      if (filters.showDispersed && !request.dispersed) return false;
      if (!filters.showDispersed && request.dispersed) return false;

      // Filtro de búsqueda por nombre (ignora acentos)
      if (filters.searchTerm) {
        const normalizedSearch = normalizeText(filters.searchTerm);
        const normalizedEmployee = normalizeText(request.employee);
        if (!normalizedEmployee.includes(normalizedSearch)) {
          return false;
        }
      }

      // Filtro por compañía
      if (
        filters.companyFilter !== 'all' &&
        request.company !== filters.companyFilter
      ) {
        return false;
      }

      // Filtro por estado - el backend ya lo maneja, pero mantenemos este filtro
      // como capa adicional de seguridad
      // Si el filtro es 'all', no filtrar por estado (el backend ya lo hizo)
      if (filters.statusFilter !== 'all') {
        if (request.status !== filters.statusFilter) {
          return false;
        }
      }

      // Filtro por monto
      const total = calculateTotal(request.expenses);
      const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : 0;
      const maxAmount = filters.maxAmount
        ? parseFloat(filters.maxAmount)
        : Infinity;

      if (total < minAmount || total > maxAmount) {
        return false;
      }

      return true;
    });

    // Ordenar por fecha de creación (más reciente primero)
    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id * -1; // Si no hay fecha, usar id como fallback (más alto = más reciente)
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id * -1;
      return dateB - dateA; // Orden descendente (más reciente primero)
    });
  }, [allRequests, filters]);

  // Obtener compañías únicas de las solicitudes actuales
  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(
      new Set(allRequests.map(r => r.company).filter(Boolean)),
    );
    return uniqueCompanies.sort();
  }, [allRequests]);

  const updateFilter = (key: keyof ApprovalRequestsFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // El reset de página se maneja en el useEffect cuando cambia statusFilter
    // Para otros filtros, también reseteamos la página
    if (key !== 'statusFilter') {
      setCurrentPage(1);
    }
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const [messageDialog, setMessageDialog] = useState<{
    open: boolean;
    type: 'success' | 'error' | 'rejected';
    title: string;
    message: string;
  }>({
    open: false,
    type: 'success',
    title: '',
    message: '',
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => travelRequestReviewService.approveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-requests'] });
      setMessageDialog({
        open: true,
        type: 'success',
        title: 'Solicitud Aprobada',
        message: 'La solicitud ha sido aprobada exitosamente.',
      });
    },
    onError: (error: Error) => {
      setMessageDialog({
        open: true,
        type: 'error',
        title: 'Error al Aprobar',
        message:
          error.message ||
          'Ocurrió un error al aprobar la solicitud. Por favor, intenta nuevamente.',
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => travelRequestReviewService.rejectRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-requests'] });
      setMessageDialog({
        open: true,
        type: 'rejected',
        title: 'Solicitud Rechazada',
        message: 'La solicitud ha sido rechazada exitosamente.',
      });
    },
    onError: (error: Error) => {
      setMessageDialog({
        open: true,
        type: 'error',
        title: 'Error al Rechazar',
        message:
          error.message ||
          'Ocurrió un error al rechazar la solicitud. Por favor, intenta nuevamente.',
      });
    },
  });

  const approveRequest = (id: number) => {
    approveMutation.mutate(id);
  };

  const rejectRequest = (id: number) => {
    rejectMutation.mutate(id);
  };

  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return {
    requests: filteredRequests,
    companies,
    filters,
    updateFilter,
    clearFilters,
    approveRequest,
    rejectRequest,
    calculateTotal,
    openAccordion,
    setOpenAccordion,
    isLoading: isLoading || isLoadingRequests,
    messageDialog,
    setMessageDialog,
    pagination,
    currentPage,
    setCurrentPage,
  };
};

export { useApprovalRequests };
