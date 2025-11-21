import { useState, useEffect, useCallback } from 'react';
import type { Expense } from '../interfaces/expense.interface';
import { expenseService } from '../services/expense.service';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses(status);
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los gastos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const approveExpense = useCallback(
    async (id: string) => {
      try {
        await expenseService.approveExpense(id);
        setExpenses(
          expenses.map(e => (e.id === id ? { ...e, status: 'approved' } : e)),
        );
      } catch (err) {
        setError('Error al aprobar el gasto');
      }
    },
    [expenses],
  );

  const rejectExpense = useCallback(
    async (id: string, notes?: string) => {
      try {
        await expenseService.rejectExpense(id, notes);
        setExpenses(
          expenses.map(e =>
            e.id === id ? { ...e, status: 'rejected', notes } : e,
          ),
        );
      } catch (err) {
        setError('Error al rechazar el gasto');
      }
    },
    [expenses],
  );

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    approveExpense,
    rejectExpense,
  };
};
