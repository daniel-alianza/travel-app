import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import useRecentRequests from '../hooks/useRecentRequests';
import type { RequestStatus } from '../interfaces';

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pendiente',
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      };
    case 'approved':
      return {
        label: 'Aprobada',
        variant: 'default' as const,
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-600/10',
      };
    case 'rejected':
      return {
        label: 'Rechazada',
        variant: 'destructive' as const,
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-600/10',
      };
    default:
      return {
        label: 'Desconocido',
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
      };
  }
};

const RecentRequests = () => {
  const { requests } = useRecentRequests();

  return (
    <Card className='p-8 shadow-xl border-2 hover:border-primary/20 transition-all duration-300 lg:sticky lg:top-8'>
      <div className='space-y-6'>
        <div className='space-y-3 pb-4 border-b-2 border-border'>
          <div className='flex items-center gap-3'>
            <div className='p-3 rounded-xl bg-secondary/10'>
              <TrendingUp className='h-6 w-6 text-secondary' />
            </div>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Historial</h2>
              <p className='text-sm text-muted-foreground'>
                Últimas solicitudes
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          {requests.map(request => {
            const statusConfig = getStatusConfig(request.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={request.id}
                className='group flex items-start gap-4 p-5 rounded-xl border-2 bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-md'
              >
                <div
                  className={`${statusConfig.bgColor} p-3 rounded-xl mt-0.5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                </div>
                <div className='flex-1 space-y-2 min-w-0'>
                  <p className='font-semibold leading-none truncate text-base'>
                    {request.destination}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {request.date}
                  </p>
                  <div className='flex items-center justify-between gap-2'>
                    <Badge
                      variant={statusConfig.variant}
                      className='text-xs font-medium'
                    >
                      {statusConfig.label}
                    </Badge>
                    <p className='font-bold text-base text-primary'>
                      {request.amount}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className='w-full text-sm font-semibold text-primary hover:text-primary/80 transition-colors py-3 px-4 rounded-lg hover:bg-primary/5 border-2 border-transparent hover:border-primary/20'>
          Ver todas las solicitudes →
        </button>
      </div>
    </Card>
  );
};

export default RecentRequests;
