import { useState } from 'react';
import type { RecentRequest } from '../interfaces';

const useRecentRequests = () => {
  const [requests] = useState<RecentRequest[]>([
    {
      id: 1,
      destination: 'Ciudad de México',
      date: '15 Oct 2024',
      amount: '$2,500',
      status: 'pending',
    },
    {
      id: 2,
      destination: 'Guadalajara',
      date: '10 Oct 2024',
      amount: '$1,800',
      status: 'approved',
    },
    {
      id: 3,
      destination: 'Monterrey',
      date: '5 Oct 2024',
      amount: '$2,100',
      status: 'approved',
    },
    {
      id: 4,
      destination: 'Cancún',
      date: '1 Oct 2024',
      amount: '$3,200',
      status: 'rejected',
    },
  ]);

  return {
    requests,
  };
};

export default useRecentRequests;

