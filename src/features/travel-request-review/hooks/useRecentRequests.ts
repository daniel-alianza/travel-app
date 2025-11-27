import type { RecentRequest } from '../interfaces';

const useRecentRequests = () => {
  const requests: RecentRequest[] = [];

  return {
    requests,
  };
};

export default useRecentRequests;

