import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MapPin,
  Briefcase,
  CreditCard,
  Calendar,
  DollarSign,
  Target,
  Send,
  Plus,
  X,
} from 'lucide-react';

interface ExpenseCategory {
  label: string;
  value: string;
}

const expenseCategories: ExpenseCategory[] = [
  { label: 'Transporte', value: 'transporte' },
  { label: 'Peajes', value: 'peajes' },
  { label: 'Hospedaje', value: 'hospedaje' },
  { label: 'Alimentos', value: 'alimentos' },
  { label: 'Fletes', value: 'fletes' },
  { label: 'Herramientas', value: 'herramientas' },
  { label: 'Envíos/Mensajería', value: 'envios' },
  { label: 'Misceláneos', value: 'miscelaneos' },
];

export function TravelExpenseForm() {
  const [expenses, setExpenses] = useState<Record<string, string>>({});
  const [objectives, setObjectives] = useState<string[]>(['', '', '']);
  const [formData, setFormData] = useState({
    empresa: '',
    sucursal: '',
    area: '',
    tarjeta: '',
    motivo: '',
    fechaSalida: '',
    fechaRegreso: '',
    fechaDispersion: '',
  });

  const handleExpenseChange = (category: string, value: string) => {
    setExpenses(prev => ({ ...prev, [category]: value }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addObjective = () => {
    if (objectives.length < 5) {
      setObjectives([...objectives, '']);
    }
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 3) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return Object.values(expenses).reduce((sum, val) => {
      const num = Number.parseFloat(val) || 0;
      return sum + num;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { formData, expenses, objectives });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
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
            <div className='space-y-2'>
              <Label
                htmlFor='empresa'
                className='text-sm font-semibold text-[#02082C] flex items-center gap-2'
              >
                <Building2 className='h-4 w-4 text-[#F34602]' />
                Empresa
              </Label>
              <Input
                id='empresa'
                placeholder='Nombre de la empresa'
                value={formData.empresa}
                onChange={e =>
                  setFormData({ ...formData, empresa: e.target.value })
                }
                className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
              />
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='sucursal'
                className='text-sm font-semibold text-[#02082C] flex items-center gap-2'
              >
                <MapPin className='h-4 w-4 text-[#F34602]' />
                Sucursal
              </Label>
              <Input
                id='sucursal'
                placeholder='Ubicación de sucursal'
                value={formData.sucursal}
                onChange={e =>
                  setFormData({ ...formData, sucursal: e.target.value })
                }
                className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
              />
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='area'
                className='text-sm font-semibold text-[#02082C] flex items-center gap-2'
              >
                <Briefcase className='h-4 w-4 text-[#F34602]' />
                Área
              </Label>
              <Input
                id='area'
                placeholder='Departamento o área'
                value={formData.area}
                onChange={e =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
              />
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='tarjeta'
                className='text-sm font-semibold text-[#02082C] flex items-center gap-2'
              >
                <CreditCard className='h-4 w-4 text-[#F34602]' />
                Número de Tarjeta
              </Label>
              <Input
                id='tarjeta'
                placeholder='0000000000000000'
                value={formData.tarjeta}
                onChange={e =>
                  setFormData({ ...formData, tarjeta: e.target.value })
                }
                className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
          <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
            <div className='absolute -top-12 left-6'>
              <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
                <Briefcase className='h-9 w-9 text-white' />
              </div>
            </div>
            <CardTitle className='pl-28 text-2xl text-[#02082C] font-semibold'>
              Motivo del Viaje
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-8 pb-8'>
            <Textarea
              placeholder='Describa detalladamente el propósito de su viaje...'
              value={formData.motivo}
              onChange={e =>
                setFormData({ ...formData, motivo: e.target.value })
              }
              className='min-h-[160px] border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all resize-none rounded-lg'
            />
          </CardContent>
        </Card>

        <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
          <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
            <div className='absolute -top-12 left-6'>
              <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
                <Calendar className='h-9 w-9 text-white' />
              </div>
            </div>
            <CardTitle className='pl-28 text-2xl text-[#02082C] font-semibold'>
              Fechas del Viaje
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-8 pb-8'>
            <div className='space-y-5'>
              <div className='space-y-2'>
                <Label
                  htmlFor='fechaSalida'
                  className='text-sm font-semibold text-[#02082C]'
                >
                  Fecha de Salida
                </Label>
                <Input
                  id='fechaSalida'
                  type='date'
                  value={formData.fechaSalida}
                  onChange={e =>
                    setFormData({ ...formData, fechaSalida: e.target.value })
                  }
                  className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11 cursor-pointer'
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='fechaRegreso'
                  className='text-sm font-semibold text-[#02082C]'
                >
                  Fecha de Regreso
                </Label>
                <Input
                  id='fechaRegreso'
                  type='date'
                  value={formData.fechaRegreso}
                  onChange={e =>
                    setFormData({ ...formData, fechaRegreso: e.target.value })
                  }
                  className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11 cursor-pointer'
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='fechaDispersion'
                  className='text-sm font-semibold text-[#02082C]'
                >
                  Fecha de Dispersión
                </Label>
                <Input
                  id='fechaDispersion'
                  type='date'
                  value={formData.fechaDispersion}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      fechaDispersion: e.target.value,
                    })
                  }
                  className='border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11 cursor-pointer'
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
        <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
          <div className='absolute -top-12 left-6'>
            <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
              <DollarSign className='h-9 w-9 text-white' />
            </div>
          </div>
          <CardTitle className='pl-28 text-2xl text-[#02082C] font-semibold'>
            Gastos Estimados
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-8 pb-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'>
            {expenseCategories.map(category => (
              <div key={category.value} className='space-y-2'>
                <Label
                  htmlFor={category.value}
                  className='text-sm font-semibold text-[#02082C]'
                >
                  {category.label}
                </Label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium'>
                    $
                  </span>
                  <Input
                    id={category.value}
                    type='number'
                    step='0.01'
                    placeholder='0.00'
                    value={expenses[category.value] || ''}
                    onChange={e =>
                      handleExpenseChange(category.value, e.target.value)
                    }
                    className='pl-8 border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-2 border-gray-200 bg-gradient-to-r from-[#FFF5F0] to-transparent -mx-8 px-8 py-6 rounded-b-2xl'>
            <span className='text-xl font-semibold text-[#02082C]'>
              Total Estimado:
            </span>
            <div className='text-4xl font-bold text-[#F34602] tracking-tight'>
              ${calculateTotal().toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-visible'>
        <CardHeader className='relative bg-gradient-to-r from-[#FFF5F0] to-white border-b border-gray-100 pb-6 pt-16'>
          <div className='absolute -top-12 left-6'>
            <div className='w-20 h-20 rounded-3xl bg-[#F34602] flex items-center justify-center shadow-2xl ring-4 ring-white drop-shadow-[0_18px_35px_rgba(243,70,2,0.3)]'>
              <Target className='h-9 w-9 text-white' />
            </div>
          </div>
          <CardTitle className='flex items-center justify-between pl-28 text-2xl flex-wrap gap-4'>
            <span className='text-[#02082C] font-semibold'>
              Objetivos del Viaje
            </span>
            {objectives.length < 5 && (
              <Button
                type='button'
                onClick={addObjective}
                size='sm'
                variant='outline'
                className='border-2 border-[#F34602] text-[#F34602] hover:bg-[#F34602] hover:text-white bg-transparent transition-all duration-300 rounded-lg font-semibold cursor-pointer'
              >
                <Plus className='h-4 w-4 mr-1' />
                Agregar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-8 pb-8'>
          <div className='space-y-5'>
            {objectives.map((objective, index) => (
              <div key={index} className='flex gap-3 items-start'>
                <div className='flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#F34602] to-[#d93d02] text-white flex items-center justify-center font-bold mt-1 shadow-md'>
                  {index + 1}
                </div>
                <Input
                  placeholder={`Escriba el objetivo ${index + 1}...`}
                  value={objective}
                  onChange={e => handleObjectiveChange(index, e.target.value)}
                  className='flex-1 border-gray-300 focus:border-[#F34602] focus:ring-2 focus:ring-[#F34602]/20 transition-all rounded-lg h-11'
                />
                {objectives.length > 3 && (
                  <Button
                    type='button'
                    onClick={() => removeObjective(index)}
                    size='icon'
                    variant='ghost'
                    className='flex-shrink-0 text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 rounded-lg cursor-pointer'
                  >
                    <X className='h-5 w-5' />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className='text-sm text-gray-600 mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200'>
            Mínimo 3 y máximo 5 objetivos. Use el botón + para agregar más
            objetivos.
          </p>
        </CardContent>
      </Card>

      <div className='flex justify-center pt-6'>
        <Button
          type='submit'
          size='lg'
          className='bg-gradient-to-r from-[#F34602] to-[#d93d02] hover:from-[#d93d02] hover:to-[#c23602] text-white px-16 py-7 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl cursor-pointer'
        >
          <Send className='h-6 w-6 mr-3' />
          Enviar Solicitud
        </Button>
      </div>
    </form>
  );
}
