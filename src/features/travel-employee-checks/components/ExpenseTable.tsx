import type { Expense } from '../interfaces/expense.interface';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';

interface ExpenseTableProps {
  expenses: Expense[];
  loading?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export function ExpenseTable({
  expenses,
  loading,
  onApprove,
  onReject,
}: ExpenseTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      approved: 'bg-green-100 text-green-800 border border-green-300',
      rejected: 'bg-red-100 text-red-800 border border-red-300',
    };
    const statusLabels = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    };
    return (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs md:text-sm ${
          badgeClasses[status as keyof typeof badgeClasses]
        }`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Transporte: '🚕',
      Comidas: '🍽️',
      Materiales: '📦',
      Viaje: '✈️',
      Otro: '📄',
    };
    return icons[category] || '📄';
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary mx-auto'></div>
          <p className='text-muted-foreground'>Cargando gastos...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className='flex items-center justify-center rounded-lg border border-border bg-card py-12'>
        <div className='text-center'>
          <AlertCircle className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
          <p className='text-muted-foreground'>No hay gastos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3 sm:space-y-4'>
      {expenses.map(expense => (
        <div
          key={expense.id}
          className='rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-md'
        >
          <div className='flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4 md:p-5 lg:p-6'>
            <div className='flex-shrink-0 text-xl sm:text-2xl md:text-3xl'>
              {getCategoryIcon(expense.category)}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-foreground text-balance sm:text-base md:text-lg'>
                    {expense.employeeName}
                  </p>
                  <p className='text-xs text-muted-foreground sm:text-sm md:text-base'>
                    {expense.category}
                  </p>
                </div>
                <div className='flex-shrink-0'>
                  {getStatusBadge(expense.status)}
                </div>
              </div>
              <p className='text-xs text-foreground mb-2 sm:text-sm md:text-base'>
                {expense.description}
              </p>
              <div className='flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4 sm:text-sm'>
                <span>
                  {new Date(expense.date).toLocaleDateString('es-ES')}
                </span>
                <span className='font-mono font-semibold text-base text-primary sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'>
                  ${expense.amount.toFixed(2)}
                </span>
              </div>
            </div>

            {expense.status === 'pending' && (
              <div className='flex-shrink-0 flex flex-col gap-2 sm:flex-row'>
                <Button
                  size='sm'
                  variant='default'
                  className='gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm'
                  onClick={() => onApprove(expense.id)}
                >
                  <CheckCircle2 className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Aprobar</span>
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  className='gap-2 text-xs sm:text-sm'
                  onClick={() =>
                    setExpandedId(expandedId === expense.id ? null : expense.id)
                  }
                >
                  <XCircle className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span className='hidden sm:inline'>Rechazar</span>
                </Button>
              </div>
            )}
          </div>

          {expandedId === expense.id && expense.status === 'pending' && (
            <div className='border-t border-border bg-secondary/30 p-3 sm:p-4'>
              <div className='mb-3'>
                <label className='block text-xs font-medium text-foreground mb-2 sm:text-sm'>
                  Motivo del rechazo (opcional)
                </label>
                <textarea
                  value={rejectNotes[expense.id] || ''}
                  onChange={e =>
                    setRejectNotes({
                      ...rejectNotes,
                      [expense.id]: e.target.value,
                    })
                  }
                  placeholder='Ej: Documentación incompleta, monto no autorizado...'
                  className='w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm'
                  rows={3}
                />
              </div>
              <Button
                size='sm'
                variant='destructive'
                className='w-full text-xs sm:text-sm'
                onClick={() => {
                  onReject(expense.id, rejectNotes[expense.id]);
                  setExpandedId(null);
                  setRejectNotes({ ...rejectNotes, [expense.id]: '' });
                }}
              >
                Confirmar rechazo
              </Button>
            </div>
          )}

          {expense.notes && (
            <div className='border-t border-border bg-secondary/30 p-3 sm:p-4'>
              <div className='flex gap-2'>
                <FileText className='h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5 sm:h-4 sm:w-4' />
                <div>
                  <p className='text-xs font-medium text-foreground mb-1 sm:text-sm'>
                    Notas
                  </p>
                  <p className='text-xs text-muted-foreground sm:text-sm'>
                    {expense.notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
