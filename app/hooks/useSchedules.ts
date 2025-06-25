// hooks/useSchedules.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getSchedule, 
  getScheduleAll, 
  getSchedules, 
  getScheduleById,
  createSchedule 
} from '@/service/schedule';
import { Schedule, ScheduleResponse } from '@/types/schedule';
import { toast } from 'sonner';

// ✅ Query Keys (untuk cache management)
export const scheduleKeys = {
  all: ['schedules'] as const,
  active: () => [...scheduleKeys.all, 'active'] as const,
  list: (page?: number, limit?: number) => [...scheduleKeys.all, 'list', { page, limit }] as const,
  detail: (id: string | number) => [...scheduleKeys.all, 'detail', id] as const,
};


// ✅ Hook untuk GET all schedules 
export const useAllSchedules = (
  page: number = 1, 
  limit: number = 20
) => {
  return useQuery({
    queryKey: scheduleKeys.list(page, limit),
    queryFn: () => getScheduleAll(page, limit), // ✅ Gunakan service function
    staleTime: 5 * 60 * 1000, // 5 menit fresh
    gcTime: 10 * 60 * 1000, // 10 menit di cache
    retry: 2,
    select: (data: ScheduleResponse | null): Schedule[] => {
      return data?.data || [];
    },
  });
};

// ✅ Hook untuk GET schedules dengan pagination (general purpose)
export const useSchedules = (
  page: number = 1, 
  limit: number = 20
) => {
  return useQuery({
    queryKey: scheduleKeys.list(page, limit),
    queryFn: () => getSchedules(page, limit), // ✅ Gunakan service function
    staleTime: 5 * 60 * 1000, // 5 menit fresh
    gcTime: 10 * 60 * 1000, // 10 menit di cache
    retry: 2,
    select: (data: ScheduleResponse): Schedule[] => {
      return data?.data || [];
    },
  });
};

// ✅ Hook untuk GET schedule by ID
export const useScheduleById = (id: string | number | null) => {
  return useQuery({
    queryKey: scheduleKeys.detail(id!),
    queryFn: () => getScheduleById(id!), // ✅ Gunakan service function
    enabled: !!id, // Hanya fetch jika id ada
    staleTime: 2 * 60 * 1000, // 2 menit fresh
    gcTime: 5 * 60 * 1000, // 5 menit di cache
    retry: 2,
  });
};

// ✅ Hook untuk CREATE schedule
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchedule, // ✅ Gunakan service function
    onSuccess: () => {
      // ✅ Auto refresh semua schedules setelah create
      queryClient.invalidateQueries({ 
        queryKey: scheduleKeys.all 
      });
      toast.success('Jadwal berhasil ditambahkan!');
    },
    onError: (error: any) => {
      console.error('Failed to create schedule:', error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        'Gagal menambahkan jadwal. Silakan coba lagi.';
      toast.error(errorMessage);
    },
    // ✅ Retry strategy untuk mutations
    retry: (failureCount, error: any) => {
      // Jangan retry untuk client errors (4xx)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 1; // Retry 1x untuk server errors
    },
  });
};

// ✅ Utility hook untuk schedule statistics (optional)
export const useScheduleStats = () => {
  return useQuery({
    queryKey: [...scheduleKeys.all, 'stats'],
    queryFn: () => getScheduleAll(1, 1000), // Get all untuk stats
    staleTime: 10 * 60 * 1000, // 10 menit fresh untuk stats
    select: (data: ScheduleResponse | null) => {
      const schedules = data?.data || [];
      
      return {
        total: schedules.length,
        active: schedules.filter(s => s.status === 'active').length,
        upcoming: schedules.filter(s => new Date(s.departure_datetime) > new Date()).length,
        byShip: schedules.reduce((acc, schedule) => {
          const shipName = schedule.ship?.ship_name || 'Unknown';
          acc[shipName] = (acc[shipName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    },
  });
};