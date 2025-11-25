import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Building2, MapPin, Briefcase, CreditCard } from 'lucide-react';
import type { BaseCardProps } from '../interfaces';

const CompanyInfoCard = ({ register, userCards = [] }: BaseCardProps) => {
  const activeCards = userCards.filter(card => card.numero);
  const hasMultipleCards = activeCards.length > 1;
  const hasSingleCard = activeCards.length === 1;

  const fields = [
    {
      id: 'empresa',
      label: 'Empresa',
      icon: Building2,
      placeholder: 'Nombre de la empresa',
    },
    {
      id: 'sucursal',
      label: 'Sucursal',
      icon: MapPin,
      placeholder: 'Ubicación de sucursal',
    },
    {
      id: 'area',
      label: 'Área',
      icon: Briefcase,
      placeholder: 'Departamento o área',
    },
    {
      id: 'tarjeta',
      label: 'Número de Tarjeta',
      icon: CreditCard,
      placeholder: '0000000000000000',
    },
  ] as const;

  const formatCardNumber = (numero: string, company?: string) => {
    // Formatear el número de tarjeta para mostrar solo los últimos 4 dígitos
    let formatted = '';
    if (numero.length > 4) {
      formatted = `****${numero.slice(-4)}`;
    } else {
      formatted = numero;
    }
    
    // Agregar la compañía si está disponible
    if (company) {
      return `${formatted} - ${company}`;
    }
    return formatted;
  };

  return (
    <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
      <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
        <div className='absolute -top-12 left-6'>
          <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
            <Building2 className='h-9 w-9 text-white' />
          </div>
        </div>
        <CardTitle className='pl-28 text-2xl text-[#02082C] font-semibold'>
          Información de la Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-8 pb-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {fields.map(({ id, label, icon: Icon, placeholder }) => {
            const isCardField = id === 'tarjeta';
            const showSelect = isCardField && hasMultipleCards;
            const showInput = isCardField && (hasSingleCard || !hasMultipleCards);

            return (
              <div key={id} className='space-y-2'>
                <Label
                  htmlFor={id}
                  className='text-sm font-semibold text-[#02082C] flex items-center gap-2'
                >
                  <Icon className='h-4 w-4 text-[#F34602]' />
                  {label}
                </Label>
                {showSelect ? (
                  <Select
                    id={id}
                    {...register(id)}
                    className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
                    placeholder='Selecciona una tarjeta'
                  >
                    {activeCards.map(card => (
                      <option key={card.id} value={card.numero}>
                        {formatCardNumber(card.numero, card.company)}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    id={id}
                    placeholder={placeholder}
                    {...register(id)}
                    disabled={!isCardField || hasSingleCard}
                    className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70'
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
