import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseStats } from '../components/ExpenseStats';
import { ExpenseFilters } from '../components/ExpenseFilters';
import { ExpenseTable } from '../components/ExpenseTable';
import { useExpenses } from '../hooks/useExpenses';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function EmployeeChecksPage() {
  const navigate = useNavigate();
  const { expenses, loading, approveExpense, rejectExpense, fetchExpenses } =
    useExpenses();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredExpenses = activeFilter
    ? expenses.filter(e => e.status === activeFilter)
    : expenses;

  const handleFilterChange = async (filter: string | null) => {
    setActiveFilter(filter);
    if (filter) {
      await fetchExpenses(filter);
    } else {
      await fetchExpenses();
    }
  };

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-[#faf9f7] via-white to-[#fff3eb]'>
      <Header
        variant='module'
        title='Comprobaciones por Colaborador'
        subtitle='Revisa y gestiona las comprobaciones de gastos de todos los colaboradores'
        onBack={() => navigate('/home')}
      />
      <main className='flex-1 py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 lg:py-10 lg:px-12'>
        <div className='mx-auto flex w-full max-w-[1400px] 2xl:max-w-[1600px] flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10'>
          {/* Estadísticas */}
          <ExpenseStats />

          {/* Filtros */}
          <div className='rounded-lg border border-border bg-card p-3 sm:p-4 md:p-5 lg:p-6'>
            <h2 className='mb-3 text-base font-semibold text-foreground sm:mb-4 sm:text-lg'>
              Filtrar gastos
            </h2>
            <ExpenseFilters
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Tabla de gastos */}
          <div className='space-y-3 sm:space-y-4'>
            <div>
              <h2 className='text-base font-semibold text-foreground sm:text-lg'>
                {activeFilter
                  ? `Gastos ${
                      activeFilter === 'pending'
                        ? 'pendientes'
                        : activeFilter === 'approved'
                        ? 'aprobados'
                        : 'rechazados'
                    }`
                  : 'Todos los gastos'}
              </h2>
              <p className='mt-1 text-xs text-muted-foreground sm:text-sm'>
                {filteredExpenses.length} gastos encontrados
              </p>
            </div>
            <ExpenseTable
              expenses={filteredExpenses}
              loading={loading}
              onApprove={approveExpense}
              onReject={rejectExpense}
            />
          </div>
        </div>
      </main>
      <Footer useLogoImage={true} />
    </div>
  );
}
