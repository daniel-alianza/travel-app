import { useState, useMemo } from 'react';
import type { Expense, ExpenseStatus } from '../interfaces';

const mockData: Expense[] = [
  {
    id: '1',
    username: 'ANTONIO SOTO GUERRERO',
    cardNumber: '5161020004323913',
    description: 'DISPERSION PARA CUBRIR RUTAS',
    requestedAmount: 7500.0,
    adjustSign: '+',
    adjustAmount: 0.0,
    startDate: '2025-11-14',
    endDate: '2025-11-30',
    status: 'sin cambio',
  },
  {
    id: '2',
    username: 'JUAN MANUEL HERNANDEZ REYES',
    cardNumber: '5161020004761153',
    description: 'VIATICAS PARA CUBRIR GASTOS EN RUTAS',
    requestedAmount: 4000.0,
    adjustSign: '+',
    adjustAmount: 0.0,
    startDate: '2025-11-18',
    endDate: '2025-11-24',
    status: 'sin cambio',
  },
  {
    id: '3',
    username: 'María López',
    cardNumber: '5161020004000000',
    description: 'Viáticos transporte y hospedaje',
    requestedAmount: 3500.0,
    adjustSign: '+',
    adjustAmount: 500.0,
    startDate: '2025-11-15',
    endDate: '2025-11-22',
    status: 'activo',
  },
  {
    id: '4',
    username: 'Carlos Martínez',
    cardNumber: '5161020004111111',
    description: 'Gastos de operación regional',
    requestedAmount: 2800.0,
    adjustSign: '+',
    adjustAmount: 200.0,
    startDate: '2025-11-10',
    endDate: '2025-11-28',
    status: 'inactivo',
  },
  {
    id: '5',
    username: 'Ana Rodríguez',
    cardNumber: '5161020004222222',
    description: 'Viáticos proyecto cancelado',
    requestedAmount: 5000.0,
    adjustSign: '+',
    adjustAmount: 5000.0,
    startDate: '2025-11-20',
    endDate: '2025-11-25',
    status: 'cancelado',
  },
];

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
  const [expenses, setExpenses] = useState<Expense[]>(mockData);
  const [selectedCompany, setSelectedCompany] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isDispersing, setIsDispersing] = useState(false);
  const [dispersedCount, setDispersedCount] = useState(0);

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

  const disperseExpenses = async () => {
    if (selectedExpenses.length === 0) return;

    setIsDispersing(true);
    const count = selectedExpenses.length;
    try {
      // TODO: Implementar llamada real a la API cuando el backend esté listo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular éxito
      setDispersedCount(count);
      setSelectedExpenses([]);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error al dispersar viáticos:', error);
    } finally {
      setIsDispersing(false);
    }
  };

  const filteredExpenses = useMemo(
    () =>
      expenses.filter(e =>
        e.username.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [expenses, searchTerm],
  );

  const totalRequested = useMemo(
    () =>
      filteredExpenses.reduce((sum, e) => sum + e.requestedAmount, 0),
    [filteredExpenses],
  );

  const isDisperseEnabled = selectedExpenses.length > 0;

  return {
    expenses,
    selectedCompany,
    setSelectedCompany,
    searchTerm,
    setSearchTerm,
    selectedExpenses,
    showSuccessDialog,
    setShowSuccessDialog,
    isDispersing,
    dispersedCount,
    handleAdjustmentChange,
    handleStatusChange,
    toggleExpenseSelection,
    disperseExpenses,
    filteredExpenses,
    totalRequested,
    isDisperseEnabled,
    statusConfig,
  };
};

export default useExpensesTable;

