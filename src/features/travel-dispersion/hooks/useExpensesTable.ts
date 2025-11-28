import { useState, useMemo, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExpenseStatus } from '../interfaces';
import { useApprovedExpenses } from './useApprovedExpenses';
import { useCompanies } from '@/features/auth/hooks/useCompanies';
import { dispersionService } from '../services/dispersion.service';

const statusConfig: Record<
  ExpenseStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  activo: {
    label: 'Activo',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  'sin cambio': {
    label: 'Sin cambio',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
  },
  inactivo: {
    label: 'Inactivo',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
  },
  cancelado: {
    label: 'Cancelado',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
};

const useExpensesTable = () => {
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dispersedCount, setDispersedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const offset = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage],
  );

  // Obtener datos paginados del servidor
  const {
    data: expensesData = { data: [], pagination: undefined },
    isLoading,
  } = useApprovedExpenses({ limit: itemsPerPage, offset });

  const serverExpenses = expensesData.data;
  const pagination = expensesData.pagination;

  // Estado local para ajustes y cambios de estado (no se guardan hasta dispersar)
  const [expenses, setExpenses] = useState(serverExpenses);

  // Sincronizar expenses con serverExpenses cuando cambian
  useEffect(() => {
    setExpenses(serverExpenses);
  }, [serverExpenses]);

  const { data: companies = [], isLoading: isLoadingCompanies } =
    useCompanies();

  const handleAdjustmentChange = (
    id: string,
    sign: '+' | '-',
    amount: number,
  ) => {
    setExpenses(
      expenses.map(e =>
        e.id === id ? { ...e, adjustSign: sign, adjustAmount: amount } : e,
      ),
    );
  };

  const handleStatusChange = (id: string, newStatus: ExpenseStatus) => {
    setExpenses(
      expenses.map(e => (e.id === id ? { ...e, status: newStatus } : e)),
    );
  };

  const toggleExpenseSelection = (id: string) => {
    setSelectedExpenses(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const adjustAmounts = () => {
    if (selectedExpenses.length === 0) {
      // Si no hay selección, ajustar todos
      setExpenses(
        expenses.map(e => ({
          ...e,
          adjustAmount: e.requestedAmount,
          adjustSign: '+' as const,
        })),
      );
      return;
    }

    // Si hay selección, solo ajustar los seleccionados
    setExpenses(
      expenses.map(e =>
        selectedExpenses.includes(e.id)
          ? {
              ...e,
              adjustAmount: e.requestedAmount,
              adjustSign: '+' as const,
            }
          : e,
      ),
    );
  };

  const disperseMutation = useMutation({
    mutationFn: (requestIds: number[]) =>
      dispersionService.disperseMultipleRequests(requestIds),
    onSuccess: (_, requestIds) => {
      queryClient.invalidateQueries({ queryKey: ['approved-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['travel-requests'] });
      setDispersedCount(requestIds.length);
      setSelectedExpenses([]);
      setShowSuccessDialog(true);
      // Resetear a la primera página después de dispersar
      setCurrentPage(1);
    },
    onError: (error: Error) => {
      console.error('Error al dispersar viáticos:', error);
      throw error;
    },
  });

  const disperseExpenses = async () => {
    if (selectedExpenses.length === 0) return;

    // Validar que al menos uno de los gastos seleccionados tenga un monto ajustado > 0
    const hasAdjustedAmount = selectedExpenses.some(expenseId => {
      const expense = expenses.find(e => e.id === expenseId);
      return expense && expense.adjustAmount > 0;
    });

    if (!hasAdjustedAmount) {
      setShowErrorDialog(true);
      return;
    }

    const requestIds = selectedExpenses.map(id => Number.parseInt(id, 10));
    disperseMutation.mutate(requestIds);
  };

  // Filtrado del lado del cliente (si el backend no soporta búsqueda)
  const filteredExpenses = useMemo(
    () =>
      expenses.filter(
        e =>
          e.username?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false,
      ),
    [expenses, searchTerm],
  );

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCompany]);

  // Usar paginación del servidor si está disponible, sino calcular del lado del cliente
  const totalPages = useMemo(() => {
    if (pagination?.totalPages) {
      return pagination.totalPages;
    }
    // Fallback: calcular del lado del cliente si no hay paginación del servidor
    return Math.ceil(filteredExpenses.length / itemsPerPage);
  }, [pagination, filteredExpenses.length, itemsPerPage]);

  // Usar los datos filtrados directamente (ya vienen paginados del servidor)
  const paginatedExpenses = filteredExpenses;

  const toggleSelectAll = () => {
    const allFilteredIds = filteredExpenses.map(e => e.id);
    const allSelected = allFilteredIds.every(id =>
      selectedExpenses.includes(id),
    );

    if (allSelected) {
      // Deseleccionar todos los filtrados
      setSelectedExpenses(prev =>
        prev.filter(id => !allFilteredIds.includes(id)),
      );
    } else {
      // Seleccionar todos los filtrados (sin duplicados)
      setSelectedExpenses(prev => {
        const newSelection = [...prev];
        allFilteredIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const isAllSelected = useMemo(() => {
    if (filteredExpenses.length === 0) return false;
    return filteredExpenses.every(e => selectedExpenses.includes(e.id));
  }, [filteredExpenses, selectedExpenses]);

  const isIndeterminate = useMemo(() => {
    if (filteredExpenses.length === 0) return false;
    const selectedCount = filteredExpenses.filter(e =>
      selectedExpenses.includes(e.id),
    ).length;
    return selectedCount > 0 && selectedCount < filteredExpenses.length;
  }, [filteredExpenses, selectedExpenses]);

  const totalRequested = useMemo(
    () => paginatedExpenses.reduce((sum, e) => sum + e.requestedAmount, 0),
    [paginatedExpenses],
  );

  const isDisperseEnabled = selectedExpenses.length > 0;

  return {
    expenses,
    isLoading,
    companies,
    isLoadingCompanies,
    selectedCompany,
    setSelectedCompany,
    searchTerm,
    setSearchTerm,
    selectedExpenses,
    showSuccessDialog,
    setShowSuccessDialog,
    showErrorDialog,
    setShowErrorDialog,
    isDispersing: disperseMutation.isPending,
    dispersedCount,
    handleAdjustmentChange,
    handleStatusChange,
    toggleExpenseSelection,
    toggleSelectAll,
    isAllSelected,
    isIndeterminate,
    adjustAmounts,
    disperseExpenses,
    filteredExpenses,
    paginatedExpenses,
    totalRequested,
    isDisperseEnabled,
    statusConfig,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    totalItems: pagination?.total,
  };
};

export default useExpensesTable;
