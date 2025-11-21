export interface Movement {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

export interface TravelExpense {
  id: string;
  name: string;
  totalViatico: number;
  totalSpent: number;
  movements: Movement[];
  createdAt: Date;
  expiresAt: Date;
  isExpired: boolean;
}
