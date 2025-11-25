interface TravelRequestPreloaderProps {
  isLoading: boolean;
}

export const TravelRequestPreloader = ({
  isLoading,
}: TravelRequestPreloaderProps) => {
  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl'>
        <div className='h-12 w-12 border-4 border-[#F34602] border-t-transparent rounded-full animate-spin' />
        <p className='text-base font-semibold text-[#02082C]'>
          Enviando solicitud...
        </p>
        <p className='text-sm text-muted-foreground'>
          Por favor, espera un momento
        </p>
      </div>
    </div>
  );
};

