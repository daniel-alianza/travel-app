import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Calendar, Menu, X, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GrupoFGLogo from '@/assets/GrupoFG_Logo.png';

interface HeaderProps {
  useLogoImage?: boolean;
  variant?: 'default' | 'module';
  title?: string;
  onBack?: () => void;
  subtitle?: string;
  actions?: ReactNode;
}

export const Header = ({
  useLogoImage = false,
  variant = 'default',
  title,
  onBack,
  subtitle,
  actions,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [daysUntilEndOfMonth, setDaysUntilEndOfMonth] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const diff = Math.ceil(
        (lastDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      setDaysUntilEndOfMonth(diff);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateMenuVisibility = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', updateMenuVisibility);
    return () => window.removeEventListener('resize', updateMenuVisibility);
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (variant === 'module') {
    return (
      <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-white/90 backdrop-blur shadow-sm'>
        <div className='container mx-auto flex h-20 items-center justify-between px-4 md:px-6'>
          <Button
            variant='ghost'
            size='icon'
            aria-label='Volver al inicio'
            className='rounded-xl text-primary hover:bg-primary/10 hover:text-primary transition-colors'
            onClick={() => (onBack ? onBack() : navigate('/home'))}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div className='flex flex-1 flex-col items-center justify-center text-center px-4'>
            <h1 className='text-lg md:text-xl font-bold text-[#02082C] tracking-tight'>
              {title ?? 'Solicitud'}
            </h1>
            {subtitle ? (
              <p className='text-xs md:text-sm text-muted-foreground mt-1'>
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className='flex min-w-[40px] justify-end'>{actions}</div>
        </div>
      </header>
    );
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm'>
      <div className='container mx-auto flex h-20 items-center justify-between px-4 md:px-6'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            {useLogoImage ? (
              <img
                src={GrupoFGLogo}
                alt='Grupo FG Logo'
                className='h-11 w-auto object-contain'
              />
            ) : (
              <div className='h-11 w-11 rounded-xl gradient-orange flex items-center justify-center shadow-md'>
                <span className='text-white font-bold text-xl'>FG</span>
              </div>
            )}
          </div>
          <div>
            <h1 className='text-xl font-bold text-foreground'>
              Portal Grupo FG
            </h1>
            <p className='text-xs text-muted-foreground'>Sistema de Viáticos</p>
          </div>
        </div>

        <div className='hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20'>
          <Calendar className='h-4 w-4 text-primary' />
          <div className='text-sm'>
            <span className='font-semibold text-primary'>
              {daysUntilEndOfMonth}
            </span>
            <span className='text-muted-foreground ml-1'>
              días para fin de mes
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='hidden lg:flex hover:bg-primary/10 hover:text-primary transition-colors'
          >
            <Settings className='h-5 w-5' />
          </Button>
          <Button
            className='hidden lg:flex gradient-orange text-white shadow-md hover:shadow-lg transition-all'
            onClick={logout}
          >
            <LogOut className='h-4 w-4 mr-2' />
            Cerrar Sesión
          </Button>
          <div className='relative lg:hidden'>
            <Button
              variant='ghost'
              size='icon'
              className='flex lg:hidden hover:bg-primary/10 hover:text-primary transition-colors'
              onClick={toggleMenu}
            >
              {isMobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
            {isMobileMenuOpen && (              <div className='absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white p-3 shadow-lg'>
                <div className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 px-3 py-2'>
                  <Calendar className='h-4 w-4 text-primary' />
                  <div className='text-sm'>
                    <span className='font-semibold text-primary'>
                      {daysUntilEndOfMonth}
                    </span>
                    <span className='text-muted-foreground ml-1'>
                      días para fin de mes
                    </span>
                  </div>
                </div>
                <div className='mt-3 flex flex-col gap-2'>
                  <Button
                    variant='ghost'
                    className='justify-start gap-2 hover:bg-primary/10 hover:text-primary transition-colors'
                    onClick={closeMenu}
                  >
                    <Settings className='h-4 w-4' />
                    Configuración
                  </Button>
                  <Button
                    className='gradient-orange text-white shadow-md hover:shadow-lg transition-all justify-start gap-2'
                    onClick={() => {
                      closeMenu();
                      logout();
                    }}
                  >
                    <LogOut className='h-4 w-4' />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

