import { useRef, useEffect } from 'react';
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
  isAllSelected,
  isIndeterminate,
  onToggleSelection,
  onToggleSelectAll,
  onAdjustmentChange,
  onStatusChange,
}: ExpensesDesktopViewProps) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className='hidden md:block border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm'>
      <div className='overflow-x-auto'>
        <Table className='w-full table-fixed'>
          <TableHeader>
            <TableRow
              className='border-0 hover:bg-transparent'
              style={{ backgroundColor: 'oklch(0.68 0.24 42)' }}
            >
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-20'>
                <div className='flex flex-col items-center justify-center gap-1.5'>
                  <span className='text-xs font-normal leading-tight whitespace-nowrap'>
                    Seleccionar
                    <br />
                    todos
                  </span>
                  <input
                    ref={selectAllCheckboxRef}
                    type='checkbox'
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className='w-4 h-4 lg:w-5 lg:h-5 cursor-pointer'
                    aria-label={
                      isAllSelected
                        ? 'Deseleccionar todos los gastos'
                        : 'Seleccionar todos los gastos'
                    }
                  />
                </div>
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[180px]'>
                Nombre Usuario
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[160px]'>
                Número de Tarjeta
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[200px]'>
                Descripción
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[120px] leading-tight'>
                Viáticos
                <br />
                Solicitados
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[90px]'>
                Signo
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[150px]'>
                Monto a Ajustar
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[160px] leading-tight'>
                Fechas
                <br />
                <span className='text-xs font-normal'>Inicio / Fin</span>
              </TableHead>
              <TableHead className='text-white font-bold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center w-[130px] leading-tight'>
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
                  <TableCell className='text-center py-3 lg:py-4 px-2 lg:px-3 align-middle'>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => onToggleSelection(expense.id)}
                      className='w-4 h-4 lg:w-5 lg:h-5 cursor-pointer mx-auto'
                    />
                  </TableCell>
                  <TableCell className='font-medium text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-foreground text-center break-words whitespace-normal align-middle'>
                    <div className='flex items-center justify-center min-h-[2.5rem]'>
                      {expense.username}
                    </div>
                  </TableCell>
                  <TableCell className='text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-foreground text-center break-words whitespace-normal align-middle font-mono'>
                    <div className='flex items-center justify-center min-h-[2.5rem]'>
                      {expense.cardNumber}
                    </div>
                  </TableCell>
                  <TableCell className='text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-foreground text-center break-words whitespace-pre-wrap align-middle'>
                    <div className='flex items-center justify-center min-h-[2.5rem]'>
                      {expense.description}
                    </div>
                  </TableCell>
                  <TableCell
                    className='font-semibold text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-center align-middle'
                    style={{ color: 'oklch(0.68 0.24 42)' }}
                  >
                    <div className='flex items-center justify-center min-h-[2.5rem]'>
                      {formatCurrency(expense.requestedAmount)}
                    </div>
                  </TableCell>
                  <TableCell className='text-center py-3 lg:py-4 px-2 lg:px-3 align-middle'>
                    <div className='relative group inline-flex items-center justify-center'>
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
                        className='w-16 px-2 py-1.5 border border-gray-300 rounded text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white hover:bg-gray-50 cursor-pointer transition-colors text-center'
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
                  <TableCell className='text-center py-3 lg:py-4 px-2 lg:px-3 align-middle'>
                    <div className='flex items-center justify-center'>
                      <input
                        type='number'
                        step='0.01'
                        min='0'
                        value={expense.adjustAmount.toFixed(2)}
                        onChange={e => {
                          const value = parseFloat(e.target.value) || 0;
                          onAdjustmentChange(expense.id, expense.adjustSign, value);
                        }}
                        className='w-28 px-2 py-1.5 border border-gray-300 rounded text-center text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        placeholder='0.00'
                      />
                    </div>
                  </TableCell>
                  <TableCell className='text-sm lg:text-base py-3 lg:py-4 px-2 lg:px-3 text-foreground text-center align-middle'>
                    <div className='flex flex-col items-center justify-center space-y-1 min-h-[2.5rem]'>
                      <div className='flex items-center gap-1'>
                        <span className='font-medium text-xs'>Inicio:</span>
                        <span className='text-xs'>{formatDate(expense.startDate)}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <span className='font-medium text-xs'>Fin:</span>
                        <span className='text-xs'>{formatDate(expense.endDate)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='py-3 lg:py-4 px-2 lg:px-3 text-center align-middle'>
                    <div className='flex items-center justify-center'>
                      <select
                        value={expense.status}
                        onChange={e =>
                          onStatusChange(
                            expense.id,
                            e.target.value as ExpenseStatus,
                          )
                        }
                        className={`w-full max-w-[140px] px-2 py-1.5 rounded text-sm font-medium border-0 cursor-pointer ${config.bgColor} ${config.textColor} focus:outline-none focus:ring-2 focus:ring-primary text-center`}
                      >
                        {(Object.keys(statusConfig) as ExpenseStatus[]).map(
                          status => (
                            <option key={status} value={status}>
                              {statusConfig[status].label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
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
