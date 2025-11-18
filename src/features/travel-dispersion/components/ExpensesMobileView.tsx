import type { Expense, ExpenseStatus } from '../interfaces';
import { formatDate, formatCurrency } from '../utils/format';

const PRIMARY_COLOR = 'oklch(0.68 0.24 42)';
const SIGN_TOOLTIP = 'Selecciona + para aumentar o - para disminuir el monto';

interface ExpensesMobileViewProps {
  expenses: Expense[];
  selectedExpenses: string[];
  statusConfig: Record<
    ExpenseStatus,
    { label: string; bgColor: string; textColor: string }
  >;
  onToggleSelection: (id: string) => void;
  onAdjustmentChange: (
    id: string,
    sign: '+' | '-',
    amount: number,
  ) => void;
  onStatusChange: (id: string, status: ExpenseStatus) => void;
}

const ExpenseCard = ({
  expense,
  isSelected,
  statusConfig,
  onToggleSelection,
  onAdjustmentChange,
  onStatusChange,
}: {
  expense: Expense;
  isSelected: boolean;
  statusConfig: Record<
    ExpenseStatus,
    { label: string; bgColor: string; textColor: string }
  >;
  onToggleSelection: (id: string) => void;
  onAdjustmentChange: (id: string, sign: '+' | '-', amount: number) => void;
  onStatusChange: (id: string, status: ExpenseStatus) => void;
}) => {
  const config = statusConfig[expense.status];

  return (
    <div
      className={`border rounded-lg p-4 bg-white ${
        isSelected
          ? 'border-primary ring-2 ring-primary ring-opacity-50'
          : 'border-gray-200'
      }`}
    >
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center gap-3 flex-1'>
          <input
            type='checkbox'
            checked={isSelected}
            onChange={() => onToggleSelection(expense.id)}
            className='w-5 h-5 cursor-pointer mt-1'
          />
          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-base text-foreground break-words'>
              {expense.username}
            </h3>
            <p className='text-sm text-gray-600 mt-1 break-words'>
              {expense.cardNumber}
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-3 mt-4'>
        <div>
          <p className='text-xs text-gray-500 mb-1'>Descripción</p>
          <p className='text-sm text-foreground break-words whitespace-pre-wrap'>
            {expense.description}
          </p>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <p className='text-xs text-gray-500 mb-1'>Viáticos Solicitados</p>
            <p
              className='font-semibold text-base'
              style={{ color: PRIMARY_COLOR }}
            >
              {formatCurrency(expense.requestedAmount)}
            </p>
          </div>

          <div className='min-w-0'>
            <p className='text-xs text-gray-500 mb-1'>Monto a Ajustar</p>
            <div className='flex items-center gap-2 min-w-0'>
              <div className='relative group inline-block flex-shrink-0'>
                <select
                  value={expense.adjustSign}
                  onChange={e =>
                    onAdjustmentChange(
                      expense.id,
                      e.target.value as '+' | '-',
                      expense.adjustAmount,
                    )
                  }
                  title={SIGN_TOOLTIP}
                  className='px-2 py-1 border border-gray-300 rounded text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white hover:bg-gray-50 cursor-pointer transition-colors'
                >
                  <option value='+'>+</option>
                  <option value='-'>−</option>
                </select>
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50'>
                  {SIGN_TOOLTIP}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
                </div>
              </div>
              <input
                type='number'
                value={expense.adjustAmount.toFixed(2)}
                readOnly
                className='flex-1 min-w-0 max-w-full px-2 py-1 border border-gray-200 rounded text-center text-sm bg-gray-50 cursor-not-allowed overflow-hidden text-ellipsis'
                placeholder='0.00'
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <p className='text-xs text-gray-500 mb-1'>Fecha Inicio</p>
            <p className='text-sm text-foreground'>
              {formatDate(expense.startDate)}
            </p>
          </div>
          <div>
            <p className='text-xs text-gray-500 mb-1'>Fecha Fin</p>
            <p className='text-sm text-foreground'>
              {formatDate(expense.endDate)}
            </p>
          </div>
        </div>

        <div>
          <p className='text-xs text-gray-500 mb-1'>Estatus</p>
          <select
            value={expense.status}
            onChange={e =>
              onStatusChange(expense.id, e.target.value as ExpenseStatus)
            }
            className={`w-full px-3 py-2 rounded text-sm font-medium border-0 cursor-pointer ${config.bgColor} ${config.textColor} focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            {(Object.keys(statusConfig) as ExpenseStatus[]).map(status => (
              <option key={status} value={status}>
                {statusConfig[status].label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const ExpensesMobileView = ({
  expenses,
  selectedExpenses,
  statusConfig,
  onToggleSelection,
  onAdjustmentChange,
  onStatusChange,
}: ExpensesMobileViewProps) => {
  return (
    <div className='block md:hidden space-y-4'>
      {expenses.map(expense => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          isSelected={selectedExpenses.includes(expense.id)}
          statusConfig={statusConfig}
          onToggleSelection={onToggleSelection}
          onAdjustmentChange={onAdjustmentChange}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ExpensesMobileView;

