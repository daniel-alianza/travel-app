import { Building2 } from 'lucide-react';

const LoginBranding = () => {
  return (
    <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80' />

      {/* Decoración de fondo con patrones */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-full h-full opacity-5'>
          <div className='absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl' />
          <div className='absolute top-40 right-20 w-40 h-40 bg-white rounded-full blur-3xl' />
          <div className='absolute bottom-20 left-1/4 w-36 h-36 bg-white rounded-full blur-3xl' />
        </div>
      </div>

      <div className='relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white'>
        <div>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-6 shadow-xl'>
            <Building2 className='h-8 w-8 text-white' />
          </div>
          <h1 className='text-4xl xl:text-5xl font-bold mb-4 tracking-tight'>
            Portal Grupo FG
          </h1>
          <p className='text-xl text-white/90 leading-relaxed'>
            Sistema de Gestión de Viáticos
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginBranding;

