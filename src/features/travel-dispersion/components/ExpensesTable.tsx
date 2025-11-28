import useExpensesTable from '../hooks/useExpensesTable';
import ExpensesFilters from './ExpensesFilters';
import ExpensesMobileView from './ExpensesMobileView';
import ExpensesDesktopView from './ExpensesDesktopView';
import ExpensesFooter from './ExpensesFooter';
import DispersionSuccessDialog from './DispersionSuccessDialog';
import DispersionErrorDialog from './DispersionErrorDialog';
import { ExpensesPagination } from './ExpensesPagination';

const ExpensesTable = () => {
  const {
    companies,
    isLoadingCompanies,
    selectedCompany,
    setSelectedCompany,
    searchTerm,
    setSearchTerm,
    selectedExpenses,
    showSuccessDialog,
    setShowSuccessDialog,
    showErrorDialog,
    setShowErrorDialog,
    isDispersing,
    dispersedCount,
    handleAdjustmentChange,
    handleStatusChange,
    toggleExpenseSelection,
    toggleSelectAll,
    isAllSelected,
    isIndeterminate,
    adjustAmounts,
    disperseExpenses,
    paginatedExpenses,
    totalRequested,
    isDisperseEnabled,
    statusConfig,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    totalItems,
  } = useExpensesTable();

  return (
    <div className='space-y-4 sm:space-y-6 px-2 sm:px-0'>
      <ExpensesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        companies={companies}
        isLoadingCompanies={isLoadingCompanies}
      />

      {!isLoading && paginatedExpenses.length === 0 ? (
        <div className='rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center'>
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-4 rounded-full bg-gray-100 p-4'>
              <svg
                className='h-12 w-12 sm:h-16 sm:w-16 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <p className='text-base sm:text-lg font-semibold text-foreground mb-2'>
              No hay dispersiones por autorizar
            </p>
            <p className='text-sm text-muted-foreground'>
              Por el momento no hay dispersiones disponibles para autorizar.
            </p>
          </div>
        </div>
      ) : (
        <>
          <ExpensesMobileView
            expenses={paginatedExpenses}
            selectedExpenses={selectedExpenses}
            statusConfig={statusConfig}
            onToggleSelection={toggleExpenseSelection}
            onAdjustmentChange={handleAdjustmentChange}
            onStatusChange={handleStatusChange}
          />

          <ExpensesDesktopView
            expenses={paginatedExpenses}
            selectedExpenses={selectedExpenses}
            statusConfig={statusConfig}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onToggleSelection={toggleExpenseSelection}
            onToggleSelectAll={toggleSelectAll}
            onAdjustmentChange={handleAdjustmentChange}
            onStatusChange={handleStatusChange}
          />

          <ExpensesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            isLoading={isLoading || isDispersing}
          />
        </>
      )}

      <ExpensesFooter
        totalRequested={totalRequested}
        selectedCount={selectedExpenses.length}
        isDisperseEnabled={isDisperseEnabled}
        isDispersing={isDispersing}
        onAdjust={adjustAmounts}
        onDisperse={disperseExpenses}
      />

      <DispersionSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        dispersedCount={dispersedCount}
      />

      <DispersionErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
      />
    </div>
  );
};

export default ExpensesTable;
