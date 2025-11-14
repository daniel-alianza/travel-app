import { useNavigate } from 'react-router-dom';
import TravelRequestForm from '../components/TravelRequestForm';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const TravelRequestPage = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-[#faf9f7] via-white to-[#fff3eb]'>
      <Header
        variant='module'
        title='Solicitud de Viaje'
        subtitle='Completa la información requerida para generar tu solicitud'
        onBack={() => navigate('/home')}
      />
      <main className='flex-1 py-10 px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-5xl flex-col gap-10'>
          <section className='rounded-3xl border border-[#F34602]/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8'>
            <div className='flex flex-col gap-4 text-center sm:text-left'>
              <div className='inline-flex items-center justify-center gap-2 self-center rounded-full bg-[#F34602]/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#F34602] sm:self-start'>
                Viajes corporativos
              </div>
              <h2 className='text-2xl font-bold text-[#02082C] sm:text-3xl'>
                Información preliminar
              </h2>
              <p className='text-sm text-muted-foreground sm:text-base'>
                Recuerda respetar las políticas vigentes de viajes corporativos.
                Si aún no las conoces, consulta las{' '}
                <a
                  href='https://intranet.grupofg.com.mx/politicas-viajes'
                  target='_blank'
                  rel='noreferrer'
                  className='font-semibold text-[#F34602] underline decoration-transparent transition-colors hover:decoration-[#F34602] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F34602]/50'
                >
                  políticas de viáticos
                </a>{' '}
                antes de continuar.
              </p>
            </div>
          </section>
          <TravelRequestForm />
        </div>
      </main>
      <Footer useLogoImage={true} />
    </div>
  );
};

export default TravelRequestPage;
