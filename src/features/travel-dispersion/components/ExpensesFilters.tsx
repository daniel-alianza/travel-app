import { Search, Building2 } from 'lucide-react';
import { Select } from '@/components/ui/select';
import type { Company } from '@/features/auth/interfaces/authApiInterfaces';

interface ExpensesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  companies: Company[];
  isLoadingCompanies: boolean;
}

const ExpensesFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCompany,
  setSelectedCompany,
  companies,
  isLoadingCompanies,
}: ExpensesFiltersProps) => {
  const companyOptions = [
    { value: 'todos', label: 'Todas las compañías' },
    ...companies.map(company => ({
      value: company.id.toString(),
      label: company.name,
    })),
  ];

  return (
    <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6'>
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 w-full sm:w-auto'>
        <div className='relative flex-1 w-full sm:max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5' />
          <input
            type='text'
            placeholder='Buscar por nombre...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>
        <div className='relative'>
          <Select
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
            options={companyOptions}
            disabled={isLoadingCompanies}
            className='pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 border border-primary rounded-lg text-sm sm:text-base bg-white text-foreground font-medium hover:border-primary hover:shadow-md w-full sm:w-auto text-base lg:text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
          />
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none z-10'>
            <Building2 className='w-4 h-4 sm:w-5 sm:h-5' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesFilters;

