import type { Expense } from '../interfaces/expense.interface';

// Mock data - En producción conectar a una API real
const mockExpenses: Expense[] = [
  {
    id: '1',
    employeeId: 'emp-001',
    employeeName: 'Juan García',
    amount: 150.5,
    category: 'Transporte',
    description: 'Taxi a reunión con cliente',
    date: '2024-11-18',
    status: 'pending',
  },
  {
    id: '2',
    employeeId: 'emp-002',
    employeeName: 'María López',
    amount: 85.0,
    category: 'Comidas',
    description: 'Almuerzo de trabajo',
    date: '2024-11-17',
    status: 'pending',
  },
  {
    id: '3',
    employeeId: 'emp-001',
    employeeName: 'Juan García',
    amount: 45.0,
    category: 'Materiales',
    description: 'Compra de suministros',
    date: '2024-11-16',
    status: 'approved',
  },
  {
    id: '4',
    employeeId: 'emp-003',
    employeeName: 'Carlos Rodríguez',
    amount: 200.0,
    category: 'Viaje',
    description: 'Hotel en viaje de negocios',
    date: '2024-11-15',
    status: 'pending',
  },
];

export const expenseService = {
  getExpenses: async (status?: string): Promise<Expense[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (status) {
          resolve(mockExpenses.filter(e => e.status === status));
        } else {
          resolve(mockExpenses);
        }
      }, 300);
    });
  },

  getPendingExpenses: async (): Promise<Expense[]> => {
    return expenseService.getExpenses('pending');
  },

  approveExpense: async (id: string): Promise<Expense | null> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const expense = mockExpenses.find(e => e.id === id);
        if (expense) {
          expense.status = 'approved';
          resolve(expense);
        }
        resolve(null);
      }, 300);
    });
  },

  rejectExpense: async (
    id: string,
    notes?: string,
  ): Promise<Expense | null> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const expense = mockExpenses.find(e => e.id === id);
        if (expense) {
          expense.status = 'rejected';
          if (notes) expense.notes = notes;
          resolve(expense);
        }
        resolve(null);
      }, 300);
    });
  },

  getExpenseStats: async () => {
    const allExpenses = await expenseService.getExpenses();
    return {
      total: allExpenses.reduce((sum, e) => sum + e.amount, 0),
      pending: allExpenses.filter(e => e.status === 'pending').length,
      pendingAmount: allExpenses
        .filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0),
      approved: allExpenses.filter(e => e.status === 'approved').length,
    };
  },
};
