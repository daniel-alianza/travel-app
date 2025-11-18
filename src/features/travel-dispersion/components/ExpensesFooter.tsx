import { formatCurrency } from '../utils/format';

const PRIMARY_COLOR = 'oklch(0.68 0.24 42)';

interface ExpensesFooterProps {
  totalRequested: number;
  selectedCount: number;
  isDisperseEnabled: boolean;
  isDispersing: boolean;
  onDisperse: () => void;
}

const ExpensesFooter = ({
  totalRequested,
  selectedCount,
  isDisperseEnabled,
  isDispersing,
  onDisperse,
}: ExpensesFooterProps) => {
  return (
    <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 sm:pt-0'>
      <div className='p-4 sm:p-5 lg:p-6 bg-white rounded-lg border border-gray-200 w-full sm:w-auto flex-none max-w-full sm:min-w-[340px]'>
        <div className='flex items-center justify-between gap-4'>
          <p className='text-xs sm:text-sm lg:text-base text-gray-600 font-semibold whitespace-nowrap'>
            TOTAL SOLICITADO
          </p>
          <p
            className='text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold truncate text-right'
            style={{ color: PRIMARY_COLOR }}
          >
            {formatCurrency(totalRequested)}
          </p>
        </div>
      </div>
      <div className='flex gap-3 w-full sm:w-auto'>
        <button
          onClick={onDisperse}
          disabled={!isDisperseEnabled || isDispersing}
          className={`flex-1 sm:flex-none px-6 sm:px-8 lg:px-10 py-3 sm:py-2.5 lg:py-3 font-medium text-sm sm:text-base lg:text-lg rounded-lg transition ${
            isDisperseEnabled && !isDispersing
              ? 'text-white cursor-pointer hover:opacity-90 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{
            backgroundColor:
              isDisperseEnabled && !isDispersing ? PRIMARY_COLOR : undefined,
          }}
        >
          {isDispersing
            ? 'Dispersando...'
            : `Dispersar${selectedCount > 0 ? ` (${selectedCount})` : ''}`}
        </button>
      </div>
    </div>
  );
};

export default ExpensesFooter;

