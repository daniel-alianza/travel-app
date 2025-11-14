import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import MenuCard from '../components/MenuCard';
import { ComprobacionesModal } from '../components/ComprobacionesModal';
import {
  FileText,
  FileStack,
  Send,
  CheckCircle,
  CreditCard,
  Receipt,
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [showComprobaciones, setShowComprobaciones] = useState(false);

  const menuItems = [
    {
      icon: FileText,
      label: 'Crear Solicitud',
      description:
        'Crea nuevas solicitudes de viáticos con destino, fechas, motivos y presupuesto estimado.',
      onClick: () => navigate('/travel-request'),
    },
    {
      icon: FileStack,
      label: 'Solicitudes de Viáticos',
      description:
        'Consulta y gestiona todas tus solicitudes. Revisa el estado y realiza seguimiento.',
    },
    {
      icon: Send,
      label: 'Dispersión de Viáticos',
      description:
        'Administra la dispersión y asignación de fondos para viáticos aprobados.',
    },
    {
      icon: CheckCircle,
      label: 'Autorización Contable',
      description:
        'Revisa y autoriza solicitudes desde el punto de vista contable y valida presupuestos.',
    },
    {
      icon: CreditCard,
      label: 'Asignación de Tarjeta',
      description:
        'Gestiona la asignación de tarjetas corporativas para viáticos y proyectos.',
    },
    {
      icon: Receipt,
      label: 'Comprobaciones de Viáticos',
      description:
        'Registra y revisa comprobantes de gastos. Sube recibos y facturas de tus viajes.',
      onClick: () => setShowComprobaciones(true),
    },
  ];

  return (
    <div className='flex min-h-screen flex-col'>
      <Header useLogoImage={true} />

      <main className='flex-1 bg-gradient-to-br from-background via-background to-primary/5'>
        <div className='container mx-auto px-4 py-12 md:py-20'>
          <div className='text-center mb-16 md:mb-24 space-y-4'>
            <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/30 mb-4'>
              <div className='h-2 w-2 rounded-full bg-primary animate-pulse'></div>
              <span className='text-sm font-semibold text-primary'>
                Dashboard Principal
              </span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance'>
              Bienvenido de nuevo,{' '}
              <span className='bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                Administrador
              </span>
            </h2>
            <p className='text-muted-foreground text-base md:text-lg max-w-2xl mx-auto text-pretty'>
              Gestiona todas tus operaciones de viáticos desde un solo lugar
            </p>
          </div>

          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10'>
              {menuItems.map((item) => (
                <MenuCard
                  key={item.label}
                  {...item}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer useLogoImage={true} />
      <ComprobacionesModal
        open={showComprobaciones}
        onOpenChange={setShowComprobaciones}
      />
    </div>
  );
};

export default DashboardPage;
