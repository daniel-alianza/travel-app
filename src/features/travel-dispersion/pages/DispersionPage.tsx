import { useNavigate } from 'react-router-dom';
import ExpensesTable from '../components/ExpensesTable';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const DispersionPage = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-[#faf9f7] via-white to-[#fff3eb]'>
      <Header
        variant='module'
        title='Dispersión de Viáticos'
        subtitle='Gestiona y dispersa viáticos a los usuarios de manera eficiente'
        onBack={() => navigate('/home')}
      />
      <main className='flex-1 py-10 px-4 sm:px-6 lg:px-10 xl:px-12'>
        <div className='mx-auto flex w-full max-w-[1600px] flex-col gap-10'>
          <ExpensesTable />
        </div>
      </main>
      <Footer useLogoImage={true} />
    </div>
  );
};

export default DispersionPage;
