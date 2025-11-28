import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpensesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number; // Opcional porque puede venir del servidor
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function ExpensesPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
}: ExpensesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='flex items-center justify-center gap-2 py-4 border-t border-border/50'>
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className={`h-9 px-3 text-sm font-medium rounded-md transition-colors ${
            currentPage === 1 || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className='flex items-center gap-1'>
            <ChevronLeft className='h-4 w-4' />
            Anterior
          </span>
        </button>

        {/* Números de página */}
        <div className='flex items-center gap-1'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isLoading}
          className={`h-9 px-3 text-sm font-medium rounded-md transition-colors ${
            currentPage === totalPages || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className='flex items-center gap-1'>
            Siguiente
            <ChevronRight className='h-4 w-4' />
          </span>
        </button>
    </div>
  );
}

