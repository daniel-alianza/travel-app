export type ExpenseStatus = 'sin cambio' | 'activo' | 'inactivo' | 'cancelado';

export interface Expense {
  id: string;
  username: string;
  cardNumber: string;
  description: string;
  requestedAmount: number;
  adjustSign: '+' | '-';
  adjustAmount: number;
  startDate: string;
  endDate: string;
  status: ExpenseStatus;
}
