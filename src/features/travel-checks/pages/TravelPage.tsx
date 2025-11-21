import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TravelExpense } from '../interfaces/movements.interface';
import { ViaticCard } from '../components/ViaticosCard';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const mockViaticos: TravelExpense[] = [
  {
    id: '1',
    name: 'Viaje Buenos Aires - Nov 2025',
    totalViatico: 1200,
    totalSpent: 1200,
    createdAt: new Date('2025-11-01'),
    expiresAt: new Date('2025-11-15'),
    isExpired: false,
    movements: [
      {
        id: '1-1',
        description: 'Almuerzo en restaurante',
        amount: 400,
        date: new Date('2025-11-02'),
      },
      {
        id: '1-2',
        description: 'Uber al aeropuerto',
        amount: 400,
        date: new Date('2025-11-03'),
      },
      {
        id: '1-3',
        description: 'Cena con cliente',
        amount: 400,
        date: new Date('2025-11-05'),
      },
    ],
  },
  {
    id: '2',
    name: 'Viaje Córdoba - Octubre 2025',
    totalViatico: 800,
    totalSpent: 650,
    createdAt: new Date('2025-10-15'),
    expiresAt: new Date('2025-10-31'),
    isExpired: true,
    movements: [
      {
        id: '2-1',
        description: 'Hotel 2 noches',
        amount: 400,
        date: new Date('2025-10-16'),
      },
      {
        id: '2-2',
        description: 'Taxi local',
        amount: 150,
        date: new Date('2025-10-17'),
      },
      {
        id: '2-3',
        description: 'Comidas varias',
        amount: 100,
        date: new Date('2025-10-18'),
      },
    ],
  },
  {
    id: '3',
    name: 'Viaje Mendoza - Octubre 2025',
    totalViatico: 1500,
    totalSpent: 1200,
    createdAt: new Date('2025-10-01'),
    expiresAt: new Date('2025-10-20'),
    isExpired: true,
    movements: [
      {
        id: '3-1',
        description: 'Hotel 3 noches',
        amount: 900,
        date: new Date('2025-10-02'),
      },
      {
        id: '3-2',
        description: 'Comidas y cenas',
        amount: 250,
        date: new Date('2025-10-03'),
      },
      {
        id: '3-3',
        description: 'Transporte',
        amount: 50,
        date: new Date('2025-10-05'),
      },
    ],
  },
];

export function TravelPage() {
  const navigate = useNavigate();
  const [showExpired, setShowExpired] = useState(false);

  // Separar viáticos activos y expirados
  const activeViaticos = mockViaticos.filter(v => !v.isExpired);
  const expiredViaticos = mockViaticos.filter(v => v.isExpired);

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-[#faf9f7] via-white to-[#fff3eb]'>
      <Header
        variant='module'
        title='Mis Comprobaciones'
        subtitle='Visualiza y comprueba todos tus gastos de viáticos'
        onBack={() => navigate('/home')}
      />
      <main className='flex-1 py-4 sm:py-6 md:py-6 lg:py-6 xl:py-8 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-8 2xl:px-10'>
        <div className='mx-auto flex max-w-6xl xl:max-w-6xl 2xl:max-w-6xl flex-col gap-4 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6'>
          {/* Viáticos Activos */}
          <div>
            <h2 className='text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl font-semibold text-foreground mb-3 sm:mb-3 md:mb-3 lg:mb-4'>
              Viáticos Activos
            </h2>
            {activeViaticos.length === 0 ? (
              <div className='text-center py-6 sm:py-8 md:py-8 lg:py-8 bg-white rounded-lg border border-border'>
                <p className='text-sm sm:text-base md:text-base text-muted-foreground'>
                  No hay viáticos activos
                </p>
              </div>
            ) : (
              <div className='space-y-2 sm:space-y-3 md:space-y-3 lg:space-y-3'>
                {activeViaticos.map(viatico => (
                  <ViaticCard
                    key={viatico.id}
                    viatico={viatico}
                    isExpired={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Botón para ver expirados */}
          {expiredViaticos.length > 0 && (
            <div>
              <button
                onClick={() => setShowExpired(!showExpired)}
                className='w-full py-2.5 sm:py-3 md:py-3 lg:py-3 px-3 sm:px-4 md:px-4 lg:px-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors text-sm sm:text-base md:text-base lg:text-base'
              >
                {showExpired ? 'Ocultar' : 'Ver'} Viáticos Caducados (
                {expiredViaticos.length})
              </button>
            </div>
          )}

          {/* Viáticos Expirados */}
          {showExpired && (
            <div>
              <h2 className='text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl font-semibold text-foreground mb-3 sm:mb-3 md:mb-3 lg:mb-4'>
                Viáticos Caducados
              </h2>
              <div className='space-y-2 sm:space-y-3 md:space-y-3 lg:space-y-3 opacity-75'>
                {expiredViaticos.map(viatico => (
                  <ViaticCard
                    key={viatico.id}
                    viatico={viatico}
                    isExpired={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className='bg-white rounded-lg p-3 sm:p-4 md:p-4 lg:p-4 border border-border text-center text-xs sm:text-sm md:text-sm text-muted-foreground'>
            <p>Últimas transacciones sincronizadas hace poco</p>
          </div>
        </div>
      </main>
      <Footer useLogoImage={true} />
    </div>
  );
}
