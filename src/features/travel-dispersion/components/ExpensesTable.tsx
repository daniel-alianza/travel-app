import useExpensesTable from '../hooks/useExpensesTable';
import ExpensesFilters from './ExpensesFilters';
import ExpensesMobileView from './ExpensesMobileView';
import ExpensesDesktopView from './ExpensesDesktopView';
import ExpensesFooter from './ExpensesFooter';
import DispersionSuccessDialog from './DispersionSuccessDialog';

const ExpensesTable = () => {
  const {
    selectedCompany,
    setSelectedCompany,
    searchTerm,
    setSearchTerm,
    selectedExpenses,
    showSuccessDialog,
    setShowSuccessDialog,
    isDispersing,
    dispersedCount,
    handleAdjustmentChange,
    handleStatusChange,
    toggleExpenseSelection,
    disperseExpenses,
    filteredExpenses,
    totalRequested,
    isDisperseEnabled,
    statusConfig,
  } = useExpensesTable();

  return (
    <div className='space-y-4 sm:space-y-6 px-2 sm:px-0'>
      <ExpensesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />

      <ExpensesMobileView
        expenses={filteredExpenses}
        selectedExpenses={selectedExpenses}
        statusConfig={statusConfig}
        onToggleSelection={toggleExpenseSelection}
        onAdjustmentChange={handleAdjustmentChange}
        onStatusChange={handleStatusChange}
      />

      <ExpensesDesktopView
        expenses={filteredExpenses}
        selectedExpenses={selectedExpenses}
        statusConfig={statusConfig}
        onToggleSelection={toggleExpenseSelection}
        onAdjustmentChange={handleAdjustmentChange}
        onStatusChange={handleStatusChange}
      />

      <ExpensesFooter
        totalRequested={totalRequested}
        selectedCount={selectedExpenses.length}
        isDisperseEnabled={isDisperseEnabled}
        isDispersing={isDispersing}
        onDisperse={disperseExpenses}
      />

      <DispersionSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        dispersedCount={dispersedCount}
      />
    </div>
  );
};

export default ExpensesTable;
