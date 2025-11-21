export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
}
