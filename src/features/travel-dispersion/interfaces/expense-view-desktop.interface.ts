import type { Expense, ExpenseStatus } from '../interfaces';
export interface ExpensesDesktopViewProps {
  expenses: Expense[];
  selectedExpenses: string[];
  statusConfig: Record<
    ExpenseStatus,
    { label: string; bgColor: string; textColor: string }
  >;
  onToggleSelection: (id: string) => void;
  onAdjustmentChange: (id: string, sign: '+' | '-', amount: number) => void;
  onStatusChange: (id: string, status: ExpenseStatus) => void;
}
