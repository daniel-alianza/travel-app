import { useEffect, useState } from 'react';
import { expenseService } from '../services/expense.service';
import { TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

export function ExpenseStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    pendingAmount: 0,
    approved: 0,
  });

  useEffect(() => {
    expenseService.getExpenseStats().then(setStats);
  }, []);

  const statCards = [
    {
      label: 'Total de gastos',
      value: `$${stats.total.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Pendientes',
      value: stats.pending,
      subValue: `$${stats.pendingAmount.toFixed(2)}`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Aprobados',
      value: stats.approved,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:gap-6'>
      {statCards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className='rounded-lg border border-border bg-card p-3 sm:p-4 md:p-5 lg:p-6'
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium text-muted-foreground sm:text-sm'>
                  {card.label}
                </p>
                <p className='mt-1.5 text-xl font-bold text-foreground sm:mt-2 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl'>
                  {card.value}
                </p>
                {card.subValue && (
                  <p className='mt-1 text-xs text-muted-foreground sm:text-sm'>
                    {card.subValue}
                  </p>
                )}
              </div>
              <div className={`ml-2 flex-shrink-0 rounded-lg ${card.bgColor} p-2 sm:p-3 md:p-4`}>
                <Icon className={`h-4 w-4 ${card.color} sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 2xl:h-9 2xl:w-9`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
