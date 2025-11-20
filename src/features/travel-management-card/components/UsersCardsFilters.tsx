import { Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface UsersCardsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  companies: string[];
}

const UsersCardsFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCompany,
  setSelectedCompany,
  companies,
}: UsersCardsFiltersProps) => {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 shadow-sm'>
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-6'>
        <div className='relative flex-1 w-full'>
          <Search className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Buscar por nombre o email...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-9 sm:pl-10 lg:pl-12 xl:pl-14 h-10 sm:h-11 lg:h-12 xl:h-14 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg'
          />
        </div>
        <div className='relative w-full sm:w-56 md:w-64 lg:w-72 xl:w-80 2xl:w-96'>
          <Building2 className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-muted-foreground z-10 pointer-events-none' />
          <Select
            value={selectedCompany}
            onChange={e => setSelectedCompany(e.target.value)}
            className='pl-9 sm:pl-10 lg:pl-12 xl:pl-14 h-10 sm:h-11 lg:h-12 xl:h-14 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg'
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
    </div>
  );
};

export default UsersCardsFilters;
