import { useNavigate } from 'react-router-dom';
import { ApprovalRequests } from '../components/ApprovalRequests';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const ReviewPage = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-[#faf9f7] via-white to-[#fff3eb]'>
      <Header
        variant='module'
        title='Solicitudes de Viáticos'
        subtitle='Revisa y aprueba solicitudes de viaje de manera rápida y eficiente'
        onBack={() => navigate('/home')}
      />
      <main className='flex-1 py-10 px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-[140rem] flex-col gap-10'>
          <ApprovalRequests />
        </div>
      </main>
      <Footer useLogoImage={true} />
    </div>
  );
};

export { ReviewPage };
