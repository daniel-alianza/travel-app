import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface ExpenseHeaderProps {
  managerName?: string;
  onLogout?: () => void;
}

export function ExpenseHeader({
  managerName = 'Jefe',
  onLogout,
}: ExpenseHeaderProps) {
  const daysLeftInMonth = Math.ceil(
    (new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).getTime() -
      new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-600'>
            <span className='text-lg font-bold text-primary-foreground'>
              💰
            </span>
          </div>
          <div className='flex flex-col'>
            <h1 className='text-xl font-bold text-foreground'>
              Gestor de Gastos
            </h1>
            <p className='text-sm text-muted-foreground'>
              Bienvenido, {managerName}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden sm:flex flex-col items-end'>
            <p className='text-sm font-medium text-foreground'>
              {daysLeftInMonth} días para fin de mes
            </p>
            <p className='text-xs text-muted-foreground'>
              {new Date().toLocaleDateString('es-ES', {
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onLogout}
            className='gap-2'
          >
            <LogOut className='h-4 w-4' />
            <span className='hidden sm:inline'>Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
