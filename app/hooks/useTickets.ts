// app/hooks/useTickets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTickets, createTicket, checkInTicket, getTicketById } from '@/service/ticket';
import { TicketResponse, SingleTicketResponse, TicketForm, Ticket } from '@/types/ticket';
import { toast } from 'sonner';

// ✅ Query Keys
export const ticketKeys = {
  all: ['tickets'] as const,
  bySchedule: (scheduleId: number) => [...ticketKeys.all, 'schedule', scheduleId] as const,
  byId: (ticketId: number) => [...ticketKeys.all, 'ticket', ticketId] as const,
};

// ✅ Hook untuk GET tickets (returns array)
export const useTickets = (scheduleId: number | null) => {
  return useQuery({
    queryKey: ticketKeys.bySchedule(scheduleId!),
    queryFn: () => getTickets(scheduleId!),
    enabled: !!scheduleId,
    select: (data: TicketResponse) => data.data || [],
    // ✅ Reduce cache time untuk faster updates
    staleTime: 0, // Always refetch when component mounts
    gcTime: 30 * 1000, // Keep in cache for 30 seconds only
  });
};

// ✅ Hook untuk CHECK-IN ticket - ENHANCED
// app/hooks/useTickets.ts
export const useCheckInTicket = (scheduleId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>({ // ✅ Use 'any' instead of SingleTicketResponse
    mutationFn: checkInTicket,
    onSuccess: async (data: any, ticketId: number) => {
      console.log(`✅ Check-in API response:`, data);
      
      // ✅ Always show success since database is updated
      toast.success(`Tiket #${ticketId} berhasil di check-in!`);
      
      // ✅ Force cache refresh
      await queryClient.invalidateQueries({ 
        queryKey: ticketKeys.all
      });
      
      if (scheduleId) {
        await queryClient.refetchQueries({
          queryKey: ticketKeys.bySchedule(scheduleId)
        });
      }
    },
    onError: (error: any, ticketId: number) => {
      console.error('❌ Check-in error:', error);
      
      // ✅ Check if actually successful (HTTP 200)
      if (error?.response?.status === 200) {
        toast.success(`Tiket #${ticketId} berhasil di check-in!`);
        
        // Force refresh on success
        queryClient.invalidateQueries({ queryKey: ticketKeys.all });
        if (scheduleId) {
          queryClient.refetchQueries({
            queryKey: ticketKeys.bySchedule(scheduleId)
          });
        }
        return;
      }
      
      // Real error
      toast.error(`Gagal check-in tiket #${ticketId}`);
    },
  });
};

// ✅ Hook untuk GET single ticket by ID
export const useTicketById = (ticketId: number | null) => {
  return useQuery<SingleTicketResponse, Error, Ticket>({
    queryKey: ticketKeys.byId(ticketId!),
    queryFn: () => getTicketById(ticketId!),
    enabled: !!ticketId,
    select: (data: SingleTicketResponse) => data.data,
    staleTime: 0, // Always fresh
    gcTime: 10 * 60 * 1000,
  });
};

// ✅ Hook untuk CREATE ticket
export const useCreateTicket = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation<TicketResponse, Error, TicketForm>({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ticketKeys.bySchedule(scheduleId) 
      });
      toast.success('Tiket berhasil ditambahkan!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan tiket');
    },
  });
};