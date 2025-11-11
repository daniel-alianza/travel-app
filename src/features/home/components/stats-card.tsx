import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>{title}</p>
            <p className='text-2xl font-bold'>{value}</p>
            {trend && (
              <p
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600',
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div className='h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center'>
            <Icon className='h-6 w-6 text-primary' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
