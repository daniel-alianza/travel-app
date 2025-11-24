import { Search, Building2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface UsersCardsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  companies: string[];
  onCreateCardClick?: () => void;
}

const UsersCardsFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCompany,
  setSelectedCompany,
  companies,
  onCreateCardClick,
}: UsersCardsFiltersProps) => {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 md:p-3 lg:p-3 xl:p-3 shadow-sm'>
      <div className='flex flex-col gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-3'>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-3'>
          <div className='relative flex-1 w-full'>
            <Search className='absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Buscar por nombre o email...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-8 sm:pl-9 h-8 sm:h-9 text-xs sm:text-sm border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg'
            />
          </div>
          <div className='relative w-full sm:w-48 md:w-56 lg:w-64'>
            <Building2 className='absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground z-10 pointer-events-none' />
            <Select
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              className='pl-8 sm:pl-9 h-8 sm:h-9 text-xs sm:text-sm border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg'
            >
              <option value='all'>Todas las compañías</option>
              {companies.map(company => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {onCreateCardClick && (
          <div className='flex justify-end'>
            <Button
              onClick={onCreateCardClick}
              className='bg-[#F34602] hover:bg-[#d93d02] text-white cursor-pointer text-sm h-9 flex items-center gap-2 w-full sm:w-48 md:w-56 lg:w-64'
            >
              <Plus className='h-4 w-4' />
              Crear Tarjeta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersCardsFilters;
