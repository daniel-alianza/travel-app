import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import UsersCardsFilters from '../components/UsersCardsFilters';
import UsersCardsTable from '../components/UsersCardsTable';
import AssignCardDialog from '../components/AssignCardDialog';
import MessageDialog from '../components/MessageDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import UserCardsDialog from '../components/UserCardsDialog';
import CreateCardDialog from '../components/CreateCardDialog';
import useUsersCards from '../hooks/useUsersCards';

const ManagementCardPage = () => {
  const navigate = useNavigate();
  const {
    users,
    companies,
    searchTerm,
    setSearchTerm,
    selectedCompany,
    setSelectedCompany,
    isLoading,
    assignDialogOpen,
    selectedUserId,
    selectedUserName,
    availableCardsForAssignment,
    assignCard,
    deactivateCard,
    openAssignDialog,
    closeAssignDialog,
    messageDialog,
    setMessageDialog,
    confirmDialog,
    setConfirmDialog,
    viewCardsDialog,
    openViewCardsDialog,
    closeViewCardsDialog,
    createCardDialogOpen,
    createCard,
    openCreateCardDialog,
    closeCreateCardDialog,
  } = useUsersCards();

  const selectedUserForView =
    users.find(u => u.id === viewCardsDialog.userId) || null;

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-[#faf9f7] via-white to-[#fff3eb]'>
      <Header
        variant='module'
        title='Asignación de Tarjeta'
        subtitle='Gestiona la asignación de tarjetas corporativas a usuarios'
        onBack={() => navigate('/home')}
      />
      <main className='flex-1 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12'>
        <div className='mx-auto flex max-w-[95rem] flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8'>
          <UsersCardsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            companies={companies}
            onCreateCardClick={openCreateCardDialog}
          />
          <UsersCardsTable
            users={users}
            onAssignCard={openAssignDialog}
            onOpenCardsDialog={openViewCardsDialog}
            isLoading={isLoading}
          />
          {selectedUserId && (
            <AssignCardDialog
              open={assignDialogOpen}
              onOpenChange={closeAssignDialog}
              onSubmit={assignCard}
              isLoading={isLoading}
              availableCards={availableCardsForAssignment}
              userName={selectedUserName}
              userId={selectedUserId}
            />
          )}
          <MessageDialog
            open={messageDialog.open}
            onOpenChange={open => setMessageDialog(prev => ({ ...prev, open }))}
            type={messageDialog.type}
            title={messageDialog.title}
            message={messageDialog.message}
          />
          <ConfirmDialog
            open={confirmDialog.open}
            onOpenChange={open => setConfirmDialog(prev => ({ ...prev, open }))}
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
            isLoading={isLoading}
          />
          <UserCardsDialog
            open={viewCardsDialog.open}
            onOpenChange={closeViewCardsDialog}
            user={selectedUserForView}
            mode={viewCardsDialog.mode}
            onRemoveCard={deactivateCard}
            isLoading={isLoading}
          />
          <CreateCardDialog
            open={createCardDialogOpen}
            onOpenChange={closeCreateCardDialog}
            onSubmit={createCard}
            isLoading={isLoading}
            companies={companies}
          />
        </div>
      </main>
      <Footer useLogoImage={true} />
    </div>
  );
};

export default ManagementCardPage;
