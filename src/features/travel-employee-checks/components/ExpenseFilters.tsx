import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface ExpenseFiltersProps {
  onFilterChange: (status: string | null) => void;
  activeFilter: string | null;
}

export function ExpenseFilters({
  onFilterChange,
  activeFilter,
}: ExpenseFiltersProps) {
  const filters = [
    {
      label: 'Pendientes',
      value: 'pending',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    {
      label: 'Aprobados',
      value: 'approved',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
    {
      label: 'Rechazados',
      value: 'rejected',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
  ];

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Filter className='h-3 w-3 text-muted-foreground sm:h-4 sm:w-4' />
      <Button
        variant={activeFilter === null ? 'default' : 'outline'}
        size='sm'
        onClick={() => onFilterChange(null)}
        className='gap-1 text-xs sm:text-sm'
      >
        Todos
        {activeFilter === null && <X className='h-3 w-3' />}
      </Button>
      {filters.map(filter => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? 'default' : 'outline'}
          size='sm'
          onClick={() =>
            onFilterChange(activeFilter === filter.value ? null : filter.value)
          }
          className='gap-1 text-xs sm:text-sm'
        >
          {filter.label}
          {activeFilter === filter.value && <X className='h-3 w-3' />}
        </Button>
      ))}
    </div>
  );
}
