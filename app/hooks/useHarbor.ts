// app/hooks/useHarbors.ts
import { useQuery } from '@tanstack/react-query';
import { getHarbors } from '@/service/harborService';
import { Harbor, HarborResponse } from '@/types/harbor';

// ✅ Query keys for caching
const harborKeys = {
  all: ['harbors'] as const,
  lists: () => [...harborKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => 
    [...harborKeys.lists(), { page, pageSize }] as const,
};

// ✅ Harbor query hook
export const useHarbors = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: harborKeys.list(page, pageSize),
    queryFn: () => getHarbors(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export { harborKeys };