import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ExpenseStatus } from '../interfaces';
import type { ExpensesDesktopViewProps } from '../interfaces/expense-view-desktop.interface';
import { formatDate, formatCurrency } from '../utils/format';

const SIGN_TOOLTIP = 'Selecciona + para aumentar o - para disminuir el monto';

const ExpensesDesktopView = ({
  expenses,
  selectedExpenses,
  statusConfig,
  onToggleSelection,
  onAdjustmentChange,
  onStatusChange,
}: ExpensesDesktopViewProps) => {
  return (
    <div className='hidden md:block border border-gray-200 rounded-lg overflow-hidden bg-white'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow
              className='border-0 hover:bg-transparent'
              style={{ backgroundColor: 'oklch(0.68 0.24 42)' }}
            >
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center w-12 lg:w-16'>
                Sel.
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[150px] lg:min-w-[200px]'>
                Nombre Usuario
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[140px] lg:min-w-[180px]'>
                Número de Tarjeta
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[180px] lg:min-w-[220px]'>
                Descripción
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[100px] lg:min-w-[120px] leading-tight'>
                Viáticos
                <br />
                Solicitados
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[80px] lg:min-w-[100px]'>
                Signo
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[130px] lg:min-w-[160px]'>
                Monto a Ajustar
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[130px] lg:min-w-[160px] leading-tight'>
                Fechas
                <br />
                <span className='text-xs font-normal'>Inicio / Fin</span>
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center min-w-[100px] lg:min-w-[130px] leading-tight'>
                Cambio de
                <br />
                Estatus
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(expense => {
              const config = statusConfig[expense.status];
              const isSelected = selectedExpenses.includes(expense.id);

              return (
                <TableRow
                  key={expense.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                >
                  <TableCell className='text-center py-3 lg:py-4 px-3 lg:px-4'>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => onToggleSelection(expense.id)}
                      className='w-4 h-4 lg:w-5 lg:h-5 cursor-pointer'
                    />
                  </TableCell>
                  <TableCell className='font-medium text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-foreground text-center break-words whitespace-normal align-top'>
                    {expense.username}
                  </TableCell>
                  <TableCell className='text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-foreground text-center break-words whitespace-normal align-top'>
                    {expense.cardNumber}
                  </TableCell>
                  <TableCell className='text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-foreground text-center break-words whitespace-pre-wrap align-top'>
                    {expense.description}
                  </TableCell>
                  <TableCell
                    className='font-semibold text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-center'
                    style={{ color: 'oklch(0.68 0.24 42)' }}
                  >
                    {formatCurrency(expense.requestedAmount)}
                  </TableCell>
                  <TableCell className='text-center py-3 lg:py-4 px-3 lg:px-4'>
                    <div className='relative group inline-block'>
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
                        className='px-2 lg:px-3 py-1 lg:py-1.5 border border-gray-300 rounded text-sm lg:text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white hover:bg-gray-50 cursor-pointer transition-colors'
                      >
                        <option value='+'>+</option>
                        <option value='-'>−</option>
                      </select>
                      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50'>
                        {SIGN_TOOLTIP}
                        <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-center py-3 lg:py-4 px-3 lg:px-4'>
                    <input
                      type='number'
                      value={expense.adjustAmount.toFixed(2)}
                      readOnly
                      className='w-full lg:w-28 px-2 lg:px-3 py-1 lg:py-1.5 border border-gray-200 rounded text-center text-sm lg:text-base bg-gray-50 cursor-not-allowed'
                      placeholder='0.00'
                    />
                  </TableCell>
                  <TableCell className='text-sm lg:text-base py-3 lg:py-4 px-3 lg:px-4 text-foreground text-center align-top'>
                    <div className='space-y-1'>
                      <div className='font-medium'>Inicio:</div>
                      <div>{formatDate(expense.startDate)}</div>
                      <div className='font-medium pt-1'>Fin:</div>
                      <div>{formatDate(expense.endDate)}</div>
                    </div>
                  </TableCell>
                  <TableCell className='py-3 lg:py-4 px-3 lg:px-4 text-center'>
                    <select
                      value={expense.status}
                      onChange={e =>
                        onStatusChange(
                          expense.id,
                          e.target.value as ExpenseStatus,
                        )
                      }
                      className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded text-sm lg:text-base font-medium border-0 cursor-pointer ${config.bgColor} ${config.textColor} focus:outline-none focus:ring-2 focus:ring-primary w-full lg:w-auto`}
                    >
                      {(Object.keys(statusConfig) as ExpenseStatus[]).map(
                        status => (
                          <option key={status} value={status}>
                            {statusConfig[status].label}
                          </option>
                        ),
                      )}
                    </select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpensesDesktopView;
